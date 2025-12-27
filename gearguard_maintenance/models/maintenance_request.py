# -*- coding: utf-8 -*-
from odoo import models, fields, api, _
from odoo.exceptions import UserError, ValidationError
from datetime import date

class GearGuardMaintenanceRequest(models.Model):
    _name = 'gearguard.maintenance.request'
    _description = 'Maintenance Request'
    _inherit = ['mail.thread', 'mail.activity.mixin']
    _order = 'id desc'

    name = fields.Char(string='Reference', default=lambda self: _('New'), copy=False, readonly=True, required=True)
    subject = fields.Char(string='Subject', required=True)
    equipment_id = fields.Many2one('gearguard.equipment', string='Equipment', required=True, tracking=True)
    
    request_type = fields.Selection([
        ('corrective', 'Corrective'),
        ('preventive', 'Preventive')
    ], string='Request Type', default='corrective', required=True, tracking=True)
    
    maintenance_team_id = fields.Many2one('gearguard.maintenance.team', string='Maintenance Team', required=True, tracking=True)
    technician_id = fields.Many2one('res.users', string='Technician', tracking=True, 
                                   domain="[('id', 'in', allowed_technician_ids)]")
    
    # Compute field for easier domain handling in XML if needed, or stick to onchange domain
    allowed_technician_ids = fields.Many2many('res.users', compute='_compute_allowed_technicians')

    scheduled_date = fields.Date(string='Scheduled Date', required=True, default=fields.Date.context_today)
    duration = fields.Float(string='Duration (Hours)', tracking=True)
    
    state = fields.Selection([
        ('new', 'New'),
        ('in_progress', 'In Progress'),
        ('repaired', 'Repaired'),
        ('scrap', 'Scrap')
    ], string='State', default='new', group_expand='_expand_states', tracking=True)
    
    overdue = fields.Boolean(string='Overdue', compute='_compute_overdue', store=True)

    @api.model
    def create(self, vals):
        if vals.get('name', _('New')) == _('New'):
            vals['name'] = self.env['ir.sequence'].next_by_code('gearguard.maintenance.request') or _('New')
            
        if vals.get('equipment_id'):
             equipment = self.env['gearguard.equipment'].browse(vals['equipment_id'])
             if equipment.status == 'scrap':
                 raise ValidationError(_("Cannot create maintenance request for scrapped equipment."))
                 
        return super(GearGuardMaintenanceRequest, self).create(vals)

    @api.depends('maintenance_team_id')
    def _compute_allowed_technicians(self):
        for rec in self:
            if rec.maintenance_team_id:
                rec.allowed_technician_ids = rec.maintenance_team_id.member_ids
            else:
                rec.allowed_technician_ids = self.env['res.users'].search([])

    @api.depends('scheduled_date', 'state')
    def _compute_overdue(self):
        today = fields.Date.today()
        for rec in self:
            if rec.scheduled_date and rec.scheduled_date < today and rec.state not in ['repaired', 'scrap']:
                rec.overdue = True
            else:
                rec.overdue = False

    @api.onchange('equipment_id')
    def _onchange_equipment_id(self):
        if self.equipment_id:
            self.maintenance_team_id = self.equipment_id.maintenance_team_id
            self.technician_id = self.equipment_id.default_technician_id

    def action_in_progress(self):
        self.state = 'in_progress'

    def action_repaired(self):
        for rec in self:
            if rec.duration <= 0:
                raise UserError(_("Duration must be greater than 0 to mark as Repaired."))
        self.state = 'repaired'

    def action_scrap(self):
        self.state = 'scrap'
        if self.equipment_id:
            self.equipment_id.status = 'scrap'

    def action_new(self):
        self.state = 'new'

    def _expand_states(self, states, domain, order):
        return [key for key, val in type(self).state.selection]

    def write(self, vals):
        if vals.get('equipment_id'):
            equipment = self.env['gearguard.equipment'].browse(vals['equipment_id'])
            if equipment.status == 'scrap':
                raise ValidationError(_("Cannot assign maintenance request to scrapped equipment."))
        return super(GearGuardMaintenanceRequest, self).write(vals)
