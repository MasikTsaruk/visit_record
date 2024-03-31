from odoo import http
from odoo.http import request
from odoo.exceptions import ValidationError

class VisitRecordController(http.Controller):

    @http.route('/create/visit_record', type='json', auth='public', methods=['POST'], csrf=False)
    def create_visit_record(self, **post):
        user_id = post['params']['user_id']
        visit_datetime = post['params']['visit_datetime']
        page_path = post['params']['page_path']
        url = post['params']['url']

        if user_id:
            try:
                visit_record = request.env['visit_record.visit_record'].sudo().create({
                    'user_id': user_id,
                    'visit_datetime': visit_datetime,
                    'page_path': page_path,
                    'url': url,
                })
                return "Visit Record created successfully."
            except ValidationError as e:
                return f"Error creating Visit Record: {e.name}"
        else:
            return "User ID isn't defined"

    @http.route('/last_five_visits', type='json', auth='public', methods=['POST'], csrf=False)
    def last_five_visits(self, **er):
        e = er['params']['user_id']
        e = str(e)
        i = request.env['visit_record.visit_record'].get_my_records(e)
        visit = []
        for rec in i:
            vals = {
                'page_path': rec.page_path,
                'url': rec.url,
                'id': rec.user_id
            }
            visit.append(vals)
        return visit

    @http.route('/pinned_rec_create', type='json', auth='public', methods=['POST'], csrf=False)
    def pinned_rec_create(self, **rec):
        page_path = rec['params']['page_path']
        url = rec['params']['url']
        ee = str(rec['params']['user_id'])
        request.env['visit_record.pinned_recs'].sudo().get_pinned_records(ee)
        if url:
            try:
                pinned_record = request.env['visit_record.pinned_recs'].sudo().create({
                    'user_id' : ee,
                    'page_path': page_path,
                    'url': url,
                })
                return  "Pinned Record created successfully."
            except ValidationError as e:
                return f"Error creating Pinned Record: {e.name}"
        else:
            return "URL isn't defined"


    @http.route('/pinned_recs_get', type='json', auth='public', methods=['POST'], csrf=False)
    def pinned_recs_get(self, **req):
        user_id = req['params']['user_id']
        pinned_records = request.env['visit_record.pinned_recs'].sudo().search([('user_id', '=', user_id)])
        pinned = []

        for rec in pinned_records:
            vals = {
                'page_path': rec.page_path,
                'url': rec.url,
            }
            pinned.append(vals)

        return pinned

    @http.route('/pinned_recs_del', type='json', auth='public', methods=['POST'], csrf=False)
    def pinned_recs_del(self, **rec):
        pinned_record = request.env['visit_record.pinned_recs'].sudo().search([('url', '=' , rec['params']['url'])], limit=1)
        try:
            pinned_record.unlink()

            return "Deleted successfully"
        except Exception as e:
            return f"Error: {e}"
