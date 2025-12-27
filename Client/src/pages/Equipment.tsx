import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AddEquipmentModal } from '@/components/modals/AddEquipmentModal';
import {
  Plus,
  Search,
  Filter,
  Cog,
  Wrench,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const equipment = [
  {
    id: '1',
    name: 'CNC Machine #12',
    serial: 'CNC-2021-0012',
    location: 'Building A, Floor 2',
    status: 'operational',
    team: 'Machine Shop Team',
    maintenanceCount: 5,
  },
  {
    id: '2',
    name: 'Conveyor Line A',
    serial: 'CVY-2020-0001',
    location: 'Building B, Floor 1',
    status: 'maintenance',
    team: 'Assembly Team',
    maintenanceCount: 2,
  },
  {
    id: '3',
    name: 'Press Machine #3',
    serial: 'PRS-2019-0003',
    location: 'Building A, Floor 1',
    status: 'operational',
    team: 'Machine Shop Team',
    maintenanceCount: 8,
  },
  {
    id: '4',
    name: 'Laser Cutter #2',
    serial: 'LSR-2022-0002',
    location: 'Building C, Floor 1',
    status: 'offline',
    team: 'Precision Team',
    maintenanceCount: 1,
  },
  {
    id: '5',
    name: 'Assembly Robot #7',
    serial: 'ROB-2021-0007',
    location: 'Building B, Floor 2',
    status: 'operational',
    team: 'Automation Team',
    maintenanceCount: 3,
  },
];

const statusConfig = {
  operational: { label: 'Operational', className: 'status-repaired' },
  maintenance: { label: 'Under Maintenance', className: 'status-progress' },
  offline: { label: 'Offline', className: 'status-scrap' },
};

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Equipment() {
  const navigate = useNavigate();
  const [isAddEquipmentOpen, setIsAddEquipmentOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.serial.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(item.status);
    return matchesSearch && matchesStatus;
  });

  return (
    <AppLayout title="Equipment">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Equipment Registry</h2>
          <p className="text-sm text-muted-foreground">Manage and monitor all equipment assets</p>
        </div>
        <Button size="sm" className="gap-2" onClick={() => setIsAddEquipmentOpen(true)}>
          <Plus className="w-4 h-4" />
          Add Equipment
        </Button>
      </div>

      {/* Filters */}
      <div className="enterprise-card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search equipment..." 
              className="pl-9" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filter
                {statusFilter.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 min-w-5">
                    {statusFilter.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.entries(statusConfig).map(([key, config]) => (
                <DropdownMenuCheckboxItem
                  key={key}
                  checked={statusFilter.includes(key)}
                  onCheckedChange={(checked) => {
                    setStatusFilter(prev => 
                      checked ? [...prev, key] : prev.filter(s => s !== key)
                    );
                  }}
                >
                  {config.label}
                </DropdownMenuCheckboxItem>
              ))}
              {statusFilter.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={false}
                    onCheckedChange={() => setStatusFilter([])}
                    className="justify-center text-center text-muted-foreground"
                  >
                    Clear Filters
                  </DropdownMenuCheckboxItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Equipment Table */}
      <div className="enterprise-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Equipment</TableHead>
              <TableHead>Serial Number</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Team</TableHead>
              <TableHead className="text-center">Maintenance</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEquipment.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No equipment found.
                </TableCell>
              </TableRow>
            ) : (
              filteredEquipment.map((item) => (
                <TableRow
                  key={item.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/equipment/${item.id}`)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Cog className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-medium">{item.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-sm">
                    {item.serial}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="text-sm">{item.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={cn('status-badge', statusConfig[item.status].className)}>
                      {statusConfig[item.status].label}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{item.team}</TableCell>
                  <TableCell className="text-center">
                    <button className="smart-button text-sm">
                      <Wrench className="w-4 h-4" />
                      {item.maintenanceCount}
                    </button>
                  </TableCell>
                  <TableCell>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Equipment Modal */}
      <AddEquipmentModal open={isAddEquipmentOpen} onOpenChange={setIsAddEquipmentOpen} />
    </AppLayout>
  );
}
