from odoo import models, fields, api

class VisitRecord(models.Model):
    _name = 'visit_record.visit_record'
    _description = 'Visit Record Log'

    user_id = fields.Integer(string='User')
    visit_datetime = fields.Datetime(string='Visit Datetime')
    page_path = fields.Char(string='Page Path')
    url = fields.Char(string='URL')

    @api.model
    def get_my_records(self, user_id):
        i = self.env['visit_record.visit_record'].sudo().search([('user_id', '=', user_id)], order="visit_datetime desc", limit=5)
        return i
class PinnedRecords(models.Model):
    _name = 'visit_record.pinned_recs'

    user_id = fields.Char(string='User')
    page_path = fields.Char(string='Page Path')
    url = fields.Char(string='URL')

    @api.model
    def get_pinned_records(self, ee):
        record_count = self.env['visit_record.pinned_recs'].search_count([('user_id', '=', ee)])
        if record_count >= 3:
            first_record = self.env['visit_record.pinned_recs'].search([], limit=1)
            if first_record:
                first_record.unlink()
        return self.env['visit_record.pinned_recs'].search_count([])
