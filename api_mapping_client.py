import xmlrpc.client
import datetime

class GearGuardClient:
    def __init__(self, url, db, username, password):
        self.url = url
        self.db = db
        self.username = username
        self.password = password
        self.uid = None
        self.models = xmlrpc.client.ServerProxy(f'{self.url}/xmlrpc/2/object')
        self.common = xmlrpc.client.ServerProxy(f'{self.url}/xmlrpc/2/common')

    def login(self):
        """ Endpoint: POST /api/auth/login """
        self.uid = self.common.authenticate(self.db, self.username, self.password, {})
        if self.uid:
            print(f"✅ Login Successful. UID: {self.uid}")
            return {"token": self.uid, "user": {"id": self.uid, "email": self.username}}
        else:
            raise Exception("Login Failed")

    def get_dashboard_stats(self):
        """ Endpoint: GET /api/dashboard/stats """
        # We use search_count for efficiency
        requests = self.models.execute_kw(self.db, self.uid, self.password, 'gearguard.maintenance.request', 'search_count', 
            [[['state', '!=', 'scrap']]]) # Total active
        
        in_progress = self.models.execute_kw(self.db, self.uid, self.password, 'gearguard.maintenance.request', 'search_count', 
            [[['state', '=', 'in_progress']]])
            
        completed = self.models.execute_kw(self.db, self.uid, self.password, 'gearguard.maintenance.request', 'search_count', 
            [[['state', '=', 'repaired']]])
            
        overdue = self.models.execute_kw(self.db, self.uid, self.password, 'gearguard.maintenance.request', 'search_count', 
            [[['overdue', '=', True]]])

        return {
            "totalRequests": {"value": requests},
            "inProgress": {"value": in_progress},
            "completed": {"value": completed},
            "overdue": {"value": overdue}
        }

    def create_test_equipment(self, name):
        """ Helper to create fresh equipment for testing """
        # Find a team first
        teams = self.models.execute_kw(self.db, self.uid, self.password, 'gearguard.maintenance.team', 'search', [[]], {'limit': 1})
        team_id = teams[0] if teams else 1

        vals = {
            'name': name,
            'serial_number': f'api-demo-{int(datetime.datetime.now().timestamp())}',
            'maintenance_team_id': team_id,
            'status': 'active'
        }
        eq_id = self.models.execute_kw(self.db, self.uid, self.password, 'gearguard.equipment', 'create', [vals])
        print(f"✅ Created Equipment ID: {eq_id}")
        return eq_id

    def list_my_tasks(self):
        """ Endpoint: GET /api/technician/tasks """
        # Filter by technician_id = me (uid)
        domain = [['technician_id', '=', self.uid]]
        fields = ['subject', 'equipment_id', 'state', 'scheduled_date', 'overdue']
        
        tasks = self.models.execute_kw(self.db, self.uid, self.password, 'gearguard.maintenance.request', 'search_read', 
            [domain], {'fields': fields})
        return tasks

    def create_request(self, subject, equipment_id, request_type='corrective'):
        """ Endpoint: POST /api/maintenance-requests """
        # Logic: We must fetch the maintenance team from the equipment first
        eq_data = self.models.execute_kw(self.db, self.uid, self.password, 'gearguard.equipment', 'read', 
            [[equipment_id], ['maintenance_team_id']])
        
        if not eq_data or not eq_data[0]['maintenance_team_id']:
             raise Exception("Equipment not found or no team assigned")
             
        team_id = eq_data[0]['maintenance_team_id'][0]

        vals = {
            'subject': subject,
            'equipment_id': equipment_id,
            'maintenance_team_id': team_id,
            'request_type': request_type,
            'scheduled_date': str(datetime.date.today())
        }
        
        req_id = self.models.execute_kw(self.db, self.uid, self.password, 'gearguard.maintenance.request', 'create', [vals])
        print(f"✅ Created Request ID: {req_id}")
        return req_id

    def log_work(self, request_id, hours, notes=None):
        """ Endpoint: POST /api/maintenance-requests/{id}/work-log """
        # Odoo doesn't have a 'notes' field on the request itself by default without chatter
        # We will update the duration
        self.models.execute_kw(self.db, self.uid, self.password, 'gearguard.maintenance.request', 'write', 
            [[request_id], {'duration': hours}])
            
        # If notes provided, post a message (chatter)
        if notes:
            self.models.execute_kw(self.db, self.uid, self.password, 'gearguard.maintenance.request', 'message_post', 
                [request_id], {'body': notes})
        
        print(f"✅ Logged {hours} hours on Request {request_id}")

    def complete_task(self, request_id):
        """ Endpoint: PATCH /api/maintenance-requests/{id}/status (to 'repaired') """
        # We call the button action
        self.models.execute_kw(self.db, self.uid, self.password, 'gearguard.maintenance.request', 'action_repaired', [[request_id]])
        print(f"✅ request {request_id} marked as Repaired")

# --- USAGE EXAMPLE ---
if __name__ == "__main__":
    # CONFIG
    URL = "http://localhost:8069"
    DB = "mydb02"
    USER = "sibtainali786110@gmail.com"
    PASS = "Sib@12345"

    client = GearGuardClient(URL, DB, USER, PASS)
    
    try:
        # 1. Auth
        client.login()
        
        # 2. Dashboard
        stats = client.get_dashboard_stats()
        print("\n📊 Dashboard Stats:", stats)
        
        # 3. Create Request (With FRESH Equipment)
        eq_id = client.create_test_equipment("Frontend Demo Machine")
        new_id = client.create_request("Noise in Motor", eq_id, "corrective")
        
        # 4. Technician View
        tasks = client.list_my_tasks()
        print(f"\n📋 My Tasks ({len(tasks)}):")
        for t in tasks:
            print(f" - [{t['id']}] {t['subject']} ({t['state']})")

        # 5. Log Work
        client.log_work(new_id, 2.5, "Replaced bearings.")

    except Exception as e:
        print("❌ Error:", e)
