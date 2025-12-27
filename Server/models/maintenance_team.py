# -*- coding: utf-8 -*-
from odoo import models, fields

class GearGuardMaintenanceTeam(models.Model):
    _name = 'gearguard.maintenance.team'
    _description = 'Maintenance Team'
    _inherit = ['mail.thread', 'mail.activity.mixin']

    name = fields.Char(string='Team Name', required=True, tracking=True)
    member_ids = fields.Many2many('res.users', string='Team Members')

    _sql_constraints = [
        ('name_unique', 'unique(name)', 'Team name must be unique!')
    ]
