import { Clock, AlertTriangle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export interface MaintenanceRequest {
  id: string;
  subject: string;
  equipment: string;
  technician: {
    name: string;
    avatar: string;
    initials: string;
  };
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'new' | 'in_progress' | 'repaired' | 'scrap';
  isOverdue?: boolean;
  dueDate?: string;
}

interface KanbanCardProps {
  request: MaintenanceRequest;
  onClick?: () => void;
}

const priorityLabels = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

export function KanbanCard({ request, onClick }: KanbanCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'kanban-card group',
        request.isOverdue && 'border-l-4 border-l-destructive'
      )}
    >
      {/* Overdue indicator */}
      {request.isOverdue && (
        <div className="flex items-center gap-1.5 text-destructive text-xs font-medium mb-2">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Overdue</span>
        </div>
      )}

      {/* Subject */}
      <h4 className="font-medium text-foreground text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
        {request.subject}
      </h4>

      {/* Equipment */}
      <p className="text-xs text-muted-foreground mb-3">{request.equipment}</p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Technician */}
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={request.technician.avatar} />
            <AvatarFallback className="text-xs">
              {request.technician.initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">{request.technician.name}</span>
        </div>

        {/* Priority Badge */}
        <span
          className={cn(
            'status-badge',
            request.priority === 'low' && 'priority-low',
            request.priority === 'medium' && 'priority-medium',
            request.priority === 'high' && 'priority-high',
            request.priority === 'urgent' && 'priority-urgent'
          )}
        >
          {priorityLabels[request.priority]}
        </span>
      </div>

      {/* Due date */}
      {request.dueDate && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
          <Clock className="w-3.5 h-3.5" />
          <span>Due: {request.dueDate}</span>
        </div>
      )}
    </div>
  );
}
