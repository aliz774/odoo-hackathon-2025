import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import {
  Cog,
  Wrench,
  MapPin,
  Calendar,
  Users,
  ArrowLeft,
  Edit,
  Clock,
  CheckCircle2,
  Save,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate, useParams } from 'react-router-dom';

const initialEquipmentData = {
  id: '1',
  name: 'CNC Machine #12',
  serial: 'CNC-2021-0012',
  location: 'Building A, Floor 2',
  status: 'operational',
  model: 'Haas VF-2',
  manufacturer: 'Haas Automation',
  purchaseDate: 'March 15, 2021',
  lastMaintenance: 'December 20, 2024',
  team: {
    name: 'Machine Shop Team',
    members: [
      { name: 'Mike Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike', role: 'Lead Technician' },
      { name: 'Sarah Kim', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', role: 'Technician' },
      { name: 'Tom Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tom', role: 'Technician' },
    ],
  },
  maintenanceHistory: [
    { id: '1', subject: 'Motor overheating issue', date: 'Dec 20, 2024', status: 'repaired', technician: 'Mike Chen' },
    { id: '2', subject: 'Belt replacement', date: 'Nov 15, 2024', status: 'repaired', technician: 'Sarah Kim' },
    { id: '3', subject: 'Annual calibration', date: 'Oct 10, 2024', status: 'repaired', technician: 'Tom Wilson' },
    { id: '4', subject: 'Coolant system check', date: 'Sep 5, 2024', status: 'repaired', technician: 'Mike Chen' },
  ],
  maintenanceCount: 5,
};

export default function EquipmentDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [equipment, setEquipment] = useState(initialEquipmentData);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialEquipmentData);

  const handleSave = () => {
    setEquipment(formData);
    setIsEditing(false);
    toast.success('Equipment details updated successfully');
  };

  return (
    <AppLayout title="Equipment Details">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        className="gap-2 mb-4"
        onClick={() => navigate('/equipment')}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Equipment
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Equipment Overview */}
          <div className="enterprise-card p-6">
            <div className="flex items-start justify-between mb-6">

              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Cog className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-1">
                  {isEditing ? (
                    <div className="grid gap-2">
                       <Input 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="font-semibold text-lg h-9"
                      />
                      <Input 
                        value={formData.serial} 
                        onChange={(e) => setFormData({...formData, serial: e.target.value})}
                        className="text-sm font-mono h-8"
                      />
                    </div>
                  ) : (
                    <>
                      <h1 className="text-xl font-semibold text-foreground mb-1">{equipment.name}</h1>
                      <p className="text-sm text-muted-foreground font-mono">{equipment.serial}</p>
                    </>
                  )}
                </div>
              </div>
              {isEditing ? (
                <div className="flex items-center gap-2">
                   <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave} className="gap-2">
                    <Save className="w-4 h-4" />
                    Save
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsEditing(true)}>
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Status</p>
                {isEditing ? (
                   <Select 
                    value={formData.status} 
                    onValueChange={(value) => setFormData({...formData, status: value})}
                   >
                     <SelectTrigger className="h-8">
                       <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="operational">Operational</SelectItem>
                       <SelectItem value="maintenance">Maintenance</SelectItem>
                       <SelectItem value="offline">Offline</SelectItem>
                     </SelectContent>
                   </Select>
                ) : (
                  <span className={cn(
                    "status-badge",
                    equipment.status === 'operational' ? "status-repaired" : 
                    equipment.status === 'maintenance' ? "status-pending" : "status-overdue"
                  )}>
                    {equipment.status.charAt(0).toUpperCase() + equipment.status.slice(1)}
                  </span>
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Location</p>
                {isEditing ? (
                  <Input 
                    value={formData.location} 
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="h-8 text-sm"
                  />
                ) : (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-sm font-medium">{equipment.location}</span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Model</p>
                {isEditing ? (
                  <Input 
                    value={formData.model} 
                    onChange={(e) => setFormData({...formData, model: e.target.value})}
                    className="h-8 text-sm"
                  />
                ) : (
                  <span className="text-sm font-medium">{equipment.model}</span>
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Manufacturer</p>
                {isEditing ? (
                  <Input 
                    value={formData.manufacturer} 
                    onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
                    className="h-8 text-sm"
                  />
                ) : (
                   <span className="text-sm font-medium">{equipment.manufacturer}</span>
                )}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Purchase Date</p>
                {isEditing ? (
                   <Input 
                    value={formData.purchaseDate} 
                    onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})}
                    className="h-8 text-sm"
                  />
                ) : (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-sm font-medium">{equipment.purchaseDate}</span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Last Maintenance</p>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-sm font-medium">{equipment.lastMaintenance}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Maintenance History */}
          <div className="enterprise-card">
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold text-foreground">Maintenance History</h3>
            </div>
            <div className="divide-y divide-border">
              {equipment.maintenanceHistory.map((item) => (
                <div key={item.id} className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{item.subject}</p>
                        <p className="text-sm text-muted-foreground">{item.technician}</p>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Maintenance Smart Button */}
          <div className="enterprise-card p-6">
            <button className="w-full smart-button justify-center text-base py-3">
              <Wrench className="w-5 h-5" />
              Maintenance
              <Badge variant="secondary" className="ml-2">
                {equipment.maintenanceCount}
              </Badge>
            </button>
          </div>

          {/* Assigned Team */}
          <div className="enterprise-card">
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-semibold text-foreground">Assigned Team</h3>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm font-medium text-foreground mb-4">{equipment.team.name}</p>
              <div className="space-y-3">
                {equipment.team.members.map((member) => (
                  <div key={member.name} className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-foreground">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
