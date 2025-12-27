import { Plus } from 'lucide-react';
import { KanbanCard, MaintenanceRequest } from './KanbanCard';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  title: string;
  status: MaintenanceRequest['status'];
  requests: MaintenanceRequest[];
  count: number;
  onCardClick?: (request: MaintenanceRequest) => void;
  onAddClick?: () => void;
}

const statusColors = {
  new: 'bg-blue-500',
  in_progress: 'bg-amber-500',
  repaired: 'bg-emerald-500',
  scrap: 'bg-red-500',
};

export function KanbanColumn({
  title,
  status,
  requests,
  count,
  onCardClick,
  onAddClick,
}: KanbanColumnProps) {
  return (
    <div className="kanban-column flex flex-col">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={cn('w-2.5 h-2.5 rounded-full', statusColors[status])} />
          <h3 className="font-semibold text-foreground">{title}</h3>
          <span className="bg-muted text-muted-foreground text-xs font-medium px-2 py-0.5 rounded-full">
            {count}
          </span>
        </div>
        <button
          onClick={onAddClick}
          className="p-1 hover:bg-card rounded transition-colors"
        >
          <Plus className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Cards */}
      <div className="flex-1 space-y-3 overflow-y-auto scrollbar-thin">
        {requests.map((request) => (
          <KanbanCard
            key={request.id}
            request={request}
            onClick={() => onCardClick?.(request)}
          />
        ))}
      </div>
    </div>
  );
}
