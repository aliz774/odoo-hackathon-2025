import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KanbanColumn } from './KanbanColumn';
import { MaintenanceRequest } from './KanbanCard';

const mockRequests: MaintenanceRequest[] = [
  {
    id: '1',
    subject: 'Motor overheating issue',
    equipment: 'CNC Machine #12',
    technician: {
      name: 'Mike Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
      initials: 'MC',
    },
    priority: 'urgent',
    status: 'new',
    isOverdue: true,
    dueDate: 'Dec 25, 2024',
  },
  {
    id: '2',
    subject: 'Belt replacement needed',
    equipment: 'Conveyor Line A',
    technician: {
      name: 'Sarah Kim',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      initials: 'SK',
    },
    priority: 'high',
    status: 'new',
    dueDate: 'Dec 28, 2024',
  },
  {
    id: '3',
    subject: 'Hydraulic leak inspection',
    equipment: 'Press Machine #3',
    technician: {
      name: 'Tom Wilson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tom',
      initials: 'TW',
    },
    priority: 'medium',
    status: 'in_progress',
    dueDate: 'Dec 30, 2024',
  },
  {
    id: '4',
    subject: 'Annual calibration',
    equipment: 'Laser Cutter #2',
    technician: {
      name: 'Lisa Park',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa',
      initials: 'LP',
    },
    priority: 'low',
    status: 'in_progress',
    dueDate: 'Jan 2, 2025',
  },
  {
    id: '5',
    subject: 'Gear box replacement',
    equipment: 'Assembly Robot #7',
    technician: {
      name: 'Mike Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
      initials: 'MC',
    },
    priority: 'high',
    status: 'in_progress',
    isOverdue: true,
    dueDate: 'Dec 24, 2024',
  },
  {
    id: '6',
    subject: 'Electrical panel fix',
    equipment: 'Control Unit #5',
    technician: {
      name: 'Sarah Kim',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      initials: 'SK',
    },
    priority: 'medium',
    status: 'repaired',
    dueDate: 'Dec 20, 2024',
  },
  {
    id: '7',
    subject: 'Compressor maintenance',
    equipment: 'Air System #1',
    technician: {
      name: 'Tom Wilson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tom',
      initials: 'TW',
    },
    priority: 'low',
    status: 'repaired',
    dueDate: 'Dec 18, 2024',
  },
  {
    id: '8',
    subject: 'Beyond repair - replace',
    equipment: 'Old Pump #2',
    technician: {
      name: 'Lisa Park',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa',
      initials: 'LP',
    },
    priority: 'low',
    status: 'scrap',
    dueDate: 'Dec 15, 2024',
  },
];

export function KanbanBoard() {
  const navigate = useNavigate();
  const [requests] = useState<MaintenanceRequest[]>(mockRequests);

  const columns = [
    { title: 'New', status: 'new' as const },
    { title: 'In Progress', status: 'in_progress' as const },
    { title: 'Repaired', status: 'repaired' as const },
    { title: 'Scrap', status: 'scrap' as const },
  ];

  const getRequestsByStatus = (status: MaintenanceRequest['status']) =>
    requests.filter((r) => r.status === status);

  const handleCardClick = (request: MaintenanceRequest) => {
    navigate(`/requests/${request.id}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {columns.map((column) => (
        <KanbanColumn
          key={column.status}
          title={column.title}
          status={column.status}
          requests={getRequestsByStatus(column.status)}
          count={getRequestsByStatus(column.status).length}
          onCardClick={handleCardClick}
        />
      ))}
    </div>
  );
}
