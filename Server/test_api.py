import xmlrpc.client
import time

# CONFIGURATION
URL = "http://localhost:8069"
DB = "mydb02"
USER = "sibtainali786110@gmail.com"
PASS = "Sib@12345"

def test_backend():
    print(f"Connecting to {URL}...")
    try:
        # 1. Login
        common = xmlrpc.client.ServerProxy(f'{URL}/xmlrpc/2/common')
        uid = common.authenticate(DB, USER, PASS, {})
        if not uid:
            print("❌ Authentication Failed!")
            return
        print(f"✅ Authenticated with UID: {uid}")

        models = xmlrpc.client.ServerProxy(f'{URL}/xmlrpc/2/object')

        # 1.5 Get or Create Maintenance Team
        print("Finding Maintenance Team...")
        team_ids = models.execute_kw(DB, uid, PASS, 'gearguard.maintenance.team', 'search', [[['name', '=', 'Test API Team']]])
        if team_ids:
            team_id = team_ids[0]
            print(f"✅ Found existing Team ID: {team_id}")
        else:
            # Try to find ANY team if Test team doesn't exist
            all_teams = models.execute_kw(DB, uid, PASS, 'gearguard.maintenance.team', 'search', [[]], {'limit': 1})
            if all_teams:
                team_id = all_teams[0]
                print(f"✅ Using existing Team ID: {team_id}")
            else:
                team_id = models.execute_kw(DB, uid, PASS, 'gearguard.maintenance.team', 'create', [{'name': 'Test API Team', 'member_ids': [(4, uid)]}])
                print(f"✅ Created New Team ID: {team_id}")

        # 2. Create Equipment
        print("Creating Equipment...")
        eq_id = models.execute_kw(DB, uid, PASS, 'gearguard.equipment', 'create', [{
            'name': 'Test API Equipment',
            'serial_number': f'API-TEST-{int(time.time())}',
            'status': 'active',
            'maintenance_team_id': team_id 
        }])
        print(f"✅ Created Equipment ID: {eq_id}")

        # 3. Create Request
        print("Creating Maintenance Request...")
        req_id = models.execute_kw(DB, uid, PASS, 'gearguard.maintenance.request', 'create', [{
            'subject': 'API Test Request',
            'equipment_id': eq_id,
            'maintenance_team_id': team_id,
            'request_type': 'preventive',
            'scheduled_date': '2025-05-01'
        }])
        print(f"✅ Created Request ID: {req_id}")

        # 4. Verify Smart Button Count
        print("Verifying Smart Button Logic...")
        eq_data = models.execute_kw(DB, uid, PASS, 'gearguard.equipment', 'read', [[eq_id], ['maintenance_count']])
        count = eq_data[0]['maintenance_count']
        if count == 1:
            print(f"✅ Smart Button Maintenance Count is correct: {count}")
        else:
            print(f"❌ Smart Button Count mismatch: {count}")

        # 5. Test Scrap Logic
        print("Testing Scrap Logic...")
        models.execute_kw(DB, uid, PASS, 'gearguard.maintenance.request', 'action_scrap', [[req_id]])
        
        # Check Equipment Status
        eq_status = models.execute_kw(DB, uid, PASS, 'gearguard.equipment', 'read', [[eq_id], ['status']])[0]['status']
        if eq_status == 'scrap':
            print("✅ Equipment correctly marked as SCRAP after request scrap.")
        else:
            print(f"❌ Equipment status failed to update: {eq_status}")

    except ConnectionRefusedError:
        print("❌ Could not connect to Odoo. Is the server running on localhost:8069?")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_backend()
