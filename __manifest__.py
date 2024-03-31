{
    'name': 'Record List',
    'version': '1.0',
    'author': 'TsaMa',
    'summary': 'Module to track user visits and actions',
    'sequence': 1,
    'description': """
        Track user visits and actions in Odoo 17.
    """,
    'category': 'Website',
    'depends': ['web', 'base'],
    'data': [
        'security/ir.model.access.csv',
        'views/menu_item_record.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'rec_list/static/src/xml/url_tracker.xml',
            'rec_list/static/src/js/url_tracker.js',
            'rec_list/views/assets.xml',
            'rec_list/static/src/css/rec_list.css',
            'rec_list/static/src/xml/last_five.xml',
            'rec_list/static/src/js/last_five.js',
        ],
    },
    'js': ['rec_list/static/src/js/url_tracker.js'],
    'css': ['static/src/css/rec_list.css'],
    'installable': True,
    'auto_install': False,
    'application': True,
}
