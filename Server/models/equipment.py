# -*- coding: utf-8 -*-
from odoo import models, fields, api

class GearGuardEquipment(models.Model):
    _name = 'gearguard.equipment'
    _description = 'Maintenance Equipment'
    _inherit = ['mail.thread', 'mail.activity.mixin']

    name = fields.Char(string='Equipment Name', required=True, tracking=True)
    serial_number = fields.Char(string='Serial Number', copy=False, tracking=True)
    department = fields.Char(string='Department')
    assigned_employee_id = fields.Many2one('res.users', string='Assigned Employee', tracking=True)
    location = fields.Char(string='Location')
    
    purchase_date = fields.Date(string='Purchase Date')
    warranty_end_date = fields.Date(string='Warranty End Date')
    
    maintenance_team_id = fields.Many2one('gearguard.maintenance.team', string='Maintenance Team', required=True, tracking=True)
    default_technician_id = fields.Many2one('res.users', string='Default Technician', tracking=True)
    
    status = fields.Selection([
        ('active', 'Active'),
        ('scrap', 'Scrap')
    ], string='Status', default='active', tracking=True, required=True)
    
    maintenance_count = fields.Integer(compute='_compute_maintenance_count', string='Maintenance Count')

    _sql_constraints = [
        ('serial_no_unique', 'unique(serial_number)', 'Serial number must be unique!')
    ]

    @api.depends()
    def _compute_maintenance_count(self):
        for equipment in self:
            equipment.maintenance_count = self.env['gearguard.maintenance.request'].search_count([
                ('equipment_id', '=', equipment.id),
                ('state', 'in', ['new', 'in_progress'])
            ])

    def action_view_maintenance(self):
        self.ensure_one()
        return {
            'type': 'ir.actions.act_window',
            'name': 'Maintenance Requests',
            'view_mode': 'kanban,tree,form',
            'res_model': 'gearguard.maintenance.request',
            'domain': [('equipment_id', '=', self.id)],
            'context': {'default_equipment_id': self.id},
        }

    @api.onchange('maintenance_team_id')
    def _onchange_maintenance_team(self):
        if self.maintenance_team_id and self.default_technician_id:
            if self.default_technician_id not in self.maintenance_team_id.member_ids:
                self.default_technician_id = False
