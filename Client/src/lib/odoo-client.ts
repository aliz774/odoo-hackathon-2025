// Odoo Config
export const ODOO_CONFIG = {
  url: '', // Empty string means use current origin (localhost:8080), which Vite proxies to 8069
  db: 'gearguard', 
};

// --- XML-RPC Helpers (Lightweight, no extra dependecies) ---

const serializeParams = (params: any[]): string => {
  return params.map(p => `<param><value>${serializeValue(p)}</value></param>`).join('');
};

const serializeValue = (value: any): string => {
  if (typeof value === 'number') {
    return Number.isInteger(value) ? `<int>${value}</int>` : `<double>${value}</double>`;
  }
  if (typeof value === 'string') {
    return `<string>${value.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</string>`; 
  }
  if (typeof value === 'boolean') {
    return `<boolean>${value ? 1 : 0}</boolean>`;
  }
  if (Array.isArray(value)) {
    return `<array><data>${value.map(v => `<value>${serializeValue(v)}</value>`).join('')}</data></array>`;
  }
  if (typeof value === 'object' && value !== null) {
      const members = Object.keys(value).map(k => `
        <member>
            <name>${k}</name>
            <value>${serializeValue(value[k])}</value>
        </member>
      `).join('');
      return `<struct>${members}</struct>`;
  }
  return '';
};

const parseXMLResponse = async (response: Response): Promise<any> => {
    const text = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "text/xml");
    
    // Check for Fault
    const fault = xmlDoc.querySelector('methodResponse > fault');
    if (fault) {
        const faultString = fault.querySelector('member > value > string')?.textContent;
        throw new Error(faultString || 'Unknown XML-RPC Fault');
    }

    const value = xmlDoc.querySelector('methodResponse > params > param > value');
    return parseValue(value);
};

const parseValue = (node: Element | null): any => {
    if (!node) return null;
    
    const child = node.firstElementChild;
    if (!child) return node.textContent;

    if (child.tagName === 'int' || child.tagName === 'i4') return parseInt(child.textContent || '0');
    if (child.tagName === 'double') return parseFloat(child.textContent || '0');
    if (child.tagName === 'boolean') return child.textContent === '1';
    if (child.tagName === 'string') return child.textContent || '';
    if (child.tagName === 'array') {
        const data = child.querySelector('data');
        if (!data) return [];
        return Array.from(data.children).map(v => parseValue(v as Element));
    }
    if (child.tagName === 'struct') {
        const obj: any = {};
        Array.from(child.children).forEach(member => {
            const name = member.querySelector('name')?.textContent;
            const val = member.querySelector('value');
            if (name) obj[name] = parseValue(val);
        });
        return obj;
    }
    
    return child.textContent;
};

// --- API Client ---

export const odooCall = async (endpoint: 'common' | 'object', method: string, params: any[]) => {
    const xmlBody = `<?xml version="1.0"?>
    <methodCall>
        <methodName>${method}</methodName>
        <params>
            ${serializeParams(params)}
        </params>
    </methodCall>`;

    try {
        const response = await fetch(`${ODOO_CONFIG.url}/xmlrpc/2/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'text/xml' },
            body: xmlBody
        });

        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        return await parseXMLResponse(response);
    } catch (error) {
        console.error("XML-RPC Error:", error);
        throw error;
    }
};

export const OdooAPI = {
    authenticate: async (db: string, user: string, pass: string) => {
        const uid = await odooCall('common', 'authenticate', [db, user, pass, {}]);
        if (!uid) throw new Error("Authentication Failed");
        return uid;
    },

    execute: async (uid: number, password: string, model: string, operation: string, args: any[], kwargs: any = {}) => {
        return await odooCall('object', 'execute_kw', [ODOO_CONFIG.db, uid, password, model, operation, args, kwargs]);
    },

    // --- Dashboard Specifics ---
    getStats: async (uid: number, password: string) => {
        const model = 'gearguard.maintenance.request';
        
        // Parallel fetch for dashboard
        const [total, inProgress, completed, overdue] = await Promise.all([
            OdooAPI.execute(uid, password, model, 'search_count', [[['state', '!=', 'scrap']]]),
            OdooAPI.execute(uid, password, model, 'search_count', [[['state', '=', 'in_progress']]]),
            OdooAPI.execute(uid, password, model, 'search_count', [[['state', '=', 'repaired']]]),
            OdooAPI.execute(uid, password, model, 'search_count', [[['overdue', '=', true]]]) 
        ]);

        return {
            totalRequests: total,
            inProgress: inProgress,
            completed: completed,
            overdue: overdue
        };
    },
    
    // --- Equipment Helper ---
    createEquipment: async (uid: number, password: string, name: string) => {
         const model = 'gearguard.equipment';
         // Find generic team or first team
         const teams = await OdooAPI.execute(uid, password, 'gearguard.maintenance.team', 'search', [[]], {limit: 1});
         const teamId = teams[0] || 1;

         const id = await OdooAPI.execute(uid, password, model, 'create', [{
             name: name,
             maintenance_team_id: teamId,
             status: 'active',
             serial_number: `client-created-${Date.now()}`
         }]);
         return id;
    },

    // --- Auth/Registration ---
    register: async (name: string, email: string, pass: string) => {
        // PROXY REGISTRATION: Uses Admin creds to create user
        // WARNING: insecure for production, dev only
        try {
            const adminUid = await OdooAPI.authenticate(ODOO_CONFIG.db, 'admin', 'admin');
            
            // Check if user exists
            const existing = await OdooAPI.execute(adminUid, 'admin', 'res.users', 'search_count', [[['login', '=', email]]]);
            if (existing > 0) throw new Error("Email already registered");

            // Create User
            const newUserId = await OdooAPI.execute(adminUid, 'admin', 'res.users', 'create', [{
                name: name,
                login: email,
                password: pass,
                active: true,
                // Add to internal groups if needed, usually default is fine for basic access
            }]);

            if (newUserId) {
                // Return immediate login
                return await OdooAPI.authenticate(ODOO_CONFIG.db, email, pass);
            }
        } catch (e: any) {
            console.error("Registration Error", e);
            throw new Error(e.message || "Registration Failed");
        }
    }
};
