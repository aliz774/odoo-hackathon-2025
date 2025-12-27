import { useState } from 'react';
import { toast } from 'sonner';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AddTeamModal } from '@/components/modals/AddTeamModal';
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  Users,
  Mail,
  Phone,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: 'manager' | 'technician' | 'lead';
  email: string;
  phone: string;
}

interface Team {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
}

const teams: Team[] = [
  {
    id: '1',
    name: 'Machine Shop Team',
    description: 'Responsible for CNC machines and precision equipment',
    members: [
      { id: '1', name: 'Mike Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike', role: 'lead', email: 'mike@gearguard.com', phone: '+1 555-0101' },
      { id: '2', name: 'Sarah Kim', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', role: 'technician', email: 'sarah@gearguard.com', phone: '+1 555-0102' },
      { id: '3', name: 'Tom Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tom', role: 'technician', email: 'tom@gearguard.com', phone: '+1 555-0103' },
    ],
  },
  {
    id: '2',
    name: 'Assembly Team',
    description: 'Handles conveyor systems and assembly line equipment',
    members: [
      { id: '4', name: 'Lisa Park', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa', role: 'manager', email: 'lisa@gearguard.com', phone: '+1 555-0104' },
      { id: '5', name: 'James Lee', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james', role: 'lead', email: 'james@gearguard.com', phone: '+1 555-0105' },
      { id: '6', name: 'Anna Brown', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=anna', role: 'technician', email: 'anna@gearguard.com', phone: '+1 555-0106' },
      { id: '7', name: 'David Miller', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david', role: 'technician', email: 'david@gearguard.com', phone: '+1 555-0107' },
    ],
  },
  {
    id: '3',
    name: 'Automation Team',
    description: 'Manages robots and automated systems',
    members: [
      { id: '8', name: 'Robert Taylor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=robert', role: 'manager', email: 'robert@gearguard.com', phone: '+1 555-0108' },
      { id: '9', name: 'Emily Davis', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily', role: 'technician', email: 'emily@gearguard.com', phone: '+1 555-0109' },
    ],
  },
  {
    id: '4',
    name: 'Precision Team',
    description: 'Specializes in laser cutters and precision instruments',
    members: [
      { id: '10', name: 'Chris Anderson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chris', role: 'lead', email: 'chris@gearguard.com', phone: '+1 555-0110' },
      { id: '11', name: 'Jennifer White', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jennifer', role: 'technician', email: 'jennifer@gearguard.com', phone: '+1 555-0111' },
      { id: '12', name: 'Mark Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mark', role: 'technician', email: 'mark@gearguard.com', phone: '+1 555-0112' },
    ],
  },
];

const roleConfig = {
  manager: { label: 'Manager', className: 'bg-purple-100 text-purple-800' },
  lead: { label: 'Lead Technician', className: 'bg-blue-100 text-blue-800' },
  technician: { label: 'Technician', className: 'bg-gray-100 text-gray-800' },
};

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// ... existing code ...

export default function Teams() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isAddTeamOpen, setIsAddTeamOpen] = useState(false);
  const [teamToView, setTeamToView] = useState<Team | null>(null);
  const [teamsList, setTeamsList] = useState<Team[]>(teams);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTeams = teamsList.filter(team => 
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.members.some(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddTeam = (newTeamData: any) => {
    const newTeam: Team = {
      id: Date.now().toString(),
      ...newTeamData
    };
    setTeamsList([...teamsList, newTeam]);
  };

  const handleDeleteTeam = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation(); // Prevent triggering any parent click handlers
    if (confirm('Are you sure you want to delete this team?')) {
        setTeamsList(prev => prev.filter(t => t.id !== id));
        toast.success('Team deleted successfully');
    }
  };

  const handleRemoveMember = (memberId: string) => {
    if (!teamToView) return;
    setTeamToView({
      ...teamToView,
      members: teamToView.members.filter(m => m.id !== memberId)
    });
  };

  const handleSaveTeamChanges = () => {
    if (!teamToView) return;
    setTeamsList(teamsList.map(t => t.id === teamToView.id ? teamToView : t));
    setTeamToView(null);
    toast.success('Team updated successfully');
  };

  return (
    <AppLayout title="Teams">
      {/* ... Header and Filters (unchanged) ... */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Team Management</h2>
          <p className="text-sm text-muted-foreground">Organize and manage maintenance teams</p>
        </div>
        <Button size="sm" className="gap-2" onClick={() => setIsAddTeamOpen(true)}>
          <Plus className="w-4 h-4" />
          Add Team
        </Button>
      </div>

      <div className="enterprise-card p-4 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
                placeholder="Search teams or members..." 
                className="pl-9" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTeams.map((team) => (
            <div key={team.id} className="enterprise-card overflow-hidden flex flex-col justify-between h-full">
              <div className="p-5 border-b border-border">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{team.name}</h3>
                      <p className="text-sm text-muted-foreground">{team.members.length} members</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 relative z-20" 
                    onClick={(e) => handleDeleteTeam(team.id, e)}
                  >
                      <span className="sr-only">Delete</span>
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">{team.description}</p>
              </div>
              <div className="p-5">
                <div className="flex -space-x-2 mb-4">
                  {team.members.slice(0, 5).map((member) => (
                    <Avatar key={member.id} className="h-9 w-9 border-2 border-card">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                  ))}
                  {team.members.length > 5 && (
                    <div className="h-9 w-9 rounded-full bg-muted border-2 border-card flex items-center justify-center text-xs font-medium text-muted-foreground">
                      +{team.members.length - 5}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  {team.members.slice(0, 3).map((member) => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className="text-xs">{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-foreground">{member.name}</span>
                      </div>
                      <Badge variant="secondary" className={cn('text-xs', roleConfig[member.role].className)}>
                        {roleConfig[member.role].label}
                      </Badge>
                    </div>
                  ))}
                </div>
                {team.members.length > 3 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full mt-3 text-muted-foreground"
                    onClick={() => setTeamToView(team)}
                  >
                    View all members
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="enterprise-card overflow-hidden">
          {filteredTeams.map((team, teamIndex) => (
            <div key={team.id}>
              <div className="p-4 bg-muted/30 border-b border-border flex justify-between items-center group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{team.name}</h3>
                    <p className="text-xs text-muted-foreground">{team.description}</p>
                  </div>
                </div>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10 gap-2" 
                    onClick={(e) => handleDeleteTeam(team.id, e)}
                >
                    <Trash2 className="h-4 w-4" />
                    Delete
                </Button>
              </div>
              <div className="divide-y divide-border">
                {team.members.map((member) => (
                  <div key={member.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{member.name}</p>
                        <Badge variant="secondary" className={cn('text-xs mt-0.5', roleConfig[member.role].className)}>
                          {roleConfig[member.role].label}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5 hidden sm:flex">
                        <Mail className="w-4 h-4" />
                        {member.email}
                      </div>
                      <div className="flex items-center gap-1.5 hidden md:flex">
                        <Phone className="w-4 h-4" />
                        {member.phone}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Team Modal */}
      <AddTeamModal 
        open={isAddTeamOpen} 
        onOpenChange={setIsAddTeamOpen} 
        onAddTeam={handleAddTeam}
      />

      {/* View Team Members Dialog */}
      <Dialog open={!!teamToView} onOpenChange={(open) => !open && setTeamToView(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{teamToView?.name} - Members</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {teamToView?.members.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No members in this team</p>
            ) : (
                teamToView?.members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 group">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                        <p className="font-medium text-foreground">{member.name}</p>
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className={cn('text-[10px]', roleConfig[member.role].className)}>
                                {roleConfig[member.role].label}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{member.email}</span>
                        </div>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveMember(member.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
                ))
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTeamToView(null)}>Cancel</Button>
            <Button onClick={handleSaveTeamChanges}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
