# -*- coding: utf-8 -*-
{
    'name': 'GearGuard - Maintenance Tracker',
    'version': '1.0',
    'category': 'Operations/Maintenance',
    'summary': 'Track equipment and manage maintenance requests',
    'description': """
GearGuard Maintenance Tracker
=============================
Key features:
- Equipment Management
- Maintenance Teams
- Maintenance Requests (Corrective & Preventive)
- Scrap Logic & Overdue Tracking
    """,
    'author': 'Antigravity',
    'depends': ['base', 'mail'],
    'data': [
        'security/security.xml',
        'security/ir.model.access.csv',
        'security/rules.xml',
        'views/menus.xml',
        'views/equipment_views.xml',
        'views/maintenance_team_views.xml',
        'views/maintenance_request_views.xml',
    ],
    'demo': [
        'data/demo_data.xml',
    ],
    'installable': True,
    'application': True,
    'license': 'LGPL-3',
}
