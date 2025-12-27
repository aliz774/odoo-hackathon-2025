import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface AddTeamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTeam?: (team: any) => void;
}

const availableMembers = [
  { id: '1', name: 'Mike Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike', role: 'Lead Technician' },
  { id: '2', name: 'Sarah Kim', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', role: 'Technician' },
  { id: '3', name: 'Tom Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tom', role: 'Technician' },
  { id: '4', name: 'Lisa Park', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa', role: 'Manager' },
  { id: '5', name: 'James Lee', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james', role: 'Lead Technician' },
  { id: '6', name: 'Anna Brown', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=anna', role: 'Technician' },
];

export function AddTeamModal({ open, onOpenChange, onAddTeam }: AddTeamModalProps) {
  const [teamName, setTeamName] = useState('');
  const [teamType, setTeamType] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const isFormValid = 
    teamName.trim() !== '' && 
    teamType !== '' && 
    selectedMembers.length > 0;

  const toggleMember = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTeamMembers = availableMembers.filter(m => selectedMembers.includes(m.id)).map(m => ({
        ...m,
        // Map role string to one of the strict string union types expected by parent
        role: m.role.toLowerCase().includes('manager') ? 'manager' :
              m.role.toLowerCase().includes('lead') ? 'lead' :
              'technician',
        email: `${m.name.toLowerCase().replace(' ', '.')}@gearguard.com`,
        phone: '+1 555-0000'
    }));

    if (onAddTeam) {
        onAddTeam({
            name: teamName,
            description: `${teamType.charAt(0).toUpperCase() + teamType.slice(1)} maintenance team`,
            members: newTeamMembers
        });
    }
    
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setTeamName('');
    setTeamType('');
    setSelectedMembers([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Maintenance Team</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          {/* Team Name */}
          <div className="space-y-2">
            <Label htmlFor="teamName">Team Name</Label>
            <Input
              id="teamName"
              placeholder="e.g., Electrical Team"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
          </div>

          {/* Team Type */}
          <div className="space-y-2">
            <Label>Team Type</Label>
            <Select value={teamType} onValueChange={setTeamType}>
              <SelectTrigger>
                <SelectValue placeholder="Select team type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="it-support">IT Support</SelectItem>
                <SelectItem value="electrical">Electrical</SelectItem>
                <SelectItem value="mechanical">Mechanical</SelectItem>
                <SelectItem value="plumbing">Plumbing</SelectItem>
                <SelectItem value="hvac">HVAC</SelectItem>
                <SelectItem value="general">General Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Team Members */}
          <div className="space-y-2">
            <Label>Team Members</Label>
            <div className="border border-border rounded-lg max-h-[200px] overflow-y-auto">
              {availableMembers.map((member) => {
                const isSelected = selectedMembers.includes(member.id);
                return (
                  <div
                    key={member.id}
                    className={cn(
                      'flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50 transition-colors border-b border-border last:border-b-0',
                      isSelected && 'bg-primary/5'
                    )}
                    onClick={() => toggleMember(member.id)}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleMember(member.id)}
                    />
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className="text-xs">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            {selectedMembers.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {selectedMembers.length} member{selectedMembers.length !== 1 ? 's' : ''} selected
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isFormValid}>
              Create Team
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
