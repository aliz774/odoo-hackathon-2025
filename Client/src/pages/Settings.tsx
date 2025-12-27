import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Settings as SettingsIcon, 
  Users, 
  Database, 
  Shield, 
  Save, 
  Plus, 
  MoreHorizontal,
  Trash2,
  Edit
} from 'lucide-react';
import { toast } from 'sonner';

  // Mock initial data
const initialUsers = [
  { id: 1, name: 'John Doe', email: 'john@gearguard.com', role: 'Admin', avatar: 'admin' },
  { id: 2, name: 'Mike Chen', email: 'mike@gearguard.com', role: 'Technician', avatar: 'mike' },
  { id: 3, name: 'Sarah Kim', email: 'sarah@gearguard.com', role: 'Manager', avatar: 'sarah' },
];

const initialIntegrations = [
  { id: 'odoo', name: 'Odoo ERP', description: 'Sync inventory and assets', status: 'connected', color: 'bg-blue-100', isLoading: false },
  { id: 'auth0', name: 'Auth0', description: 'Single Sign-On (SSO)', status: 'disconnected', color: 'bg-orange-100', isLoading: false },
];

export default function Settings() {
  const [users, setUsers] = useState(initialUsers);
  const [integrations, setIntegrations] = useState(initialIntegrations);
  const [configuringIntegration, setConfiguringIntegration] = useState<string | null>(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Technician' });

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;

    const user = {
      id: Math.max(...users.map(u => u.id), 0) + 1,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      avatar: newUser.name.toLowerCase().replace(' ', '')
    };

    setUsers([...users, user]);
    setNewUser({ name: '', email: '', role: 'Technician' });
    setIsAddUserOpen(false);
    toast.success('User added successfully');
  };

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter(u => u.id !== id));
    toast.success('User deleted successfully');
  };


  const toggleIntegration = (id: string) => {
    // If we are disconnecting, do it immediately
    const integration = integrations.find(i => i.id === id);
    if (integration?.status === 'connected') {
      setIntegrations(integrations.map(i => {
        if (i.id === id) return { ...i, isLoading: true };
        return i;
      }));

      setTimeout(() => {
        setIntegrations(prev => prev.map(i => {
          if (i.id === id) {
            toast.success(`${i.name} disconnected successfully`);
            return { ...i, status: 'disconnected', isLoading: false };
          }
          return i;
        }));
      }, 1000);
      return;
    }

    // If connecting, open configuration dialog
    setConfiguringIntegration(id);
  };

  const handleConnectIntegration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!configuringIntegration) return;

    const id = configuringIntegration;
    setConfiguringIntegration(null);

    setIntegrations(integrations.map(i => {
      if (i.id === id) return { ...i, isLoading: true };
      return i;
    }));

    setTimeout(() => {
      setIntegrations(prev => prev.map(i => {
        if (i.id === id) {
          toast.success(`${i.name} connected successfully`);
          return { ...i, status: 'connected', isLoading: false };
        }
        return i;
      }));
    }, 1500);
  };

  const renderIntegrationForm = () => {
    if (configuringIntegration === 'odoo') {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Server URL</Label>
            <Input placeholder="https://odoo.example.com" required />
          </div>
          <div className="space-y-2">
            <Label>Database</Label>
            <Input placeholder="gearguard_db" required />
          </div>
          <div className="space-y-2">
            <Label>Username</Label>
            <Input placeholder="admin" required />
          </div>
          <div className="space-y-2">
            <Label>API Key</Label>
            <Input type="password" placeholder="••••••••••••••" required />
          </div>
        </div>
      );
    }
    
    if (configuringIntegration === 'auth0') {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Domain</Label>
            <Input placeholder="dev-xyz.auth0.com" required />
          </div>
          <div className="space-y-2">
            <Label>Client ID</Label>
            <Input placeholder="Client ID" required />
          </div>
          <div className="space-y-2">
            <Label>Client Secret</Label>
            <Input type="password" placeholder="Client Secret" required />
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <AppLayout title="Settings">
      <div className="max-w-5xl mx-auto">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general" className="gap-2">
              <SettingsIcon className="w-4 h-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="w-4 h-4" />
              Users & Permissions
            </TabsTrigger>
            <TabsTrigger value="integrations" className="gap-2">
              <Database className="w-4 h-4" />
              Integrations
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <div className="enterprise-card p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold">System Information</h3>
                <p className="text-sm text-muted-foreground">Manage general application settings</p>
              </div>
              <Separator className="mb-6" />
              
              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Organization Name</Label>
                    <Input defaultValue="GearGuard Industries" />
                  </div>
                  <div className="space-y-2">
                    <Label>Support Email</Label>
                    <Input defaultValue="support@gearguard.com" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Maintenance Configuration</h4>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <Label>Auto-Scheduler</Label>
                      <p className="text-sm text-muted-foreground">Automatically assign technicians based on availability</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <Label>Overdue Alerts</Label>
                      <p className="text-sm text-muted-foreground">Send high-priority alerts for overdue tickets</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSave} className="gap-2">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Users Settings */}
          <TabsContent value="users" className="space-y-6">
            <div className="enterprise-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">User Management</h3>
                  <p className="text-sm text-muted-foreground">Manage access and roles</p>
                </div>
                
                <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                      <DialogDescription>
                        Create a new user account. They will receive an email to set their password.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddUser} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={newUser.name}
                          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                          placeholder="john@company.com"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select
                          value={newUser.role}
                          onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Manager">Manager</SelectItem>
                            <SelectItem value="Technician">Technician</SelectItem>
                            <SelectItem value="Viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Create User</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <div className="divide-y">
                  {users.map((user) => (
                    <div key={user.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatar}`} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">{user.role}</Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem className="gap-2">
                              <Edit className="w-4 h-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive gap-2"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                  
                  {users.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground">
                      No users found. Add a user to get started.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Integrations Settings */}
          <TabsContent value="integrations" className="space-y-6">
            <div className="enterprise-card p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold">Integrations</h3>
                <p className="text-sm text-muted-foreground">Connect with third-party services</p>
              </div>
              
              <div className="grid gap-4">
                {integrations.map((integration) => (
                  <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:border-primary/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${integration.color}`}>
                        {integration.id === 'odoo' ? <Database className="w-6 h-6 text-blue-600" /> : <Shield className="w-6 h-6 text-orange-600" />}
                      </div>
                      <div>
                        <h4 className="font-medium">{integration.name}</h4>
                        <p className="text-sm text-muted-foreground">{integration.description}</p>
                      </div>
                    </div>
                    {integration.status === 'connected' ? (
                      <div className="flex items-center gap-3">
                        <Badge className="bg-green-500 hover:bg-green-600">Connected</Badge>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toggleIntegration(integration.id)}
                          disabled={integration.isLoading}
                        >
                          Disconnect
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleIntegration(integration.id)}
                        disabled={integration.isLoading}
                      >
                        {integration.isLoading ? 'Connecting...' : 'Connect'}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Dialog open={!!configuringIntegration} onOpenChange={(open) => !open && setConfiguringIntegration(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Connect {integrations.find(i => i.id === configuringIntegration)?.name}
                  </DialogTitle>
                  <DialogDescription>
                    Enter your credentials to establish a secure connection.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleConnectIntegration}>
                  <div className="grid gap-4 py-4">
                    {renderIntegrationForm()}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" type="button" onClick={() => setConfiguringIntegration(null)}>
                      Cancel
                    </Button>
                    <Button type="submit">Connect Integration</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
