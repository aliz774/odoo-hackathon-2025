import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { KanbanBoard } from '@/components/maintenance/KanbanBoard';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Button } from '@/components/ui/button';
import { NewMaintenanceRequestModal } from '@/components/modals/NewMaintenanceRequestModal';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Filter,
} from 'lucide-react';
import { toast } from 'sonner';

export default function Dashboard() {
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [stats, setStats] = useState({ total: 24, inProgress: 8, completed: 142, overdue: 3 });

  const connectToOdoo = async () => {
    try {
      toast.info('Connecting to Odoo Server...');
      const { OdooAPI } = await import('@/lib/odoo-client');
      // Demo credentials from api_mapping_client.py
      // In a real app, prompts user
      const auth = await OdooAPI.authenticate('gearguard', 'admin', 'admin'); 
      if (auth) {
        toast.success('Connected to Backend!');
        setIsConnected(true);
        const fetchedStats = await OdooAPI.getStats(auth, 'admin');
        setStats({
            total: fetchedStats.totalRequests,
            inProgress: fetchedStats.inProgress,
            completed: fetchedStats.completed,
            overdue: fetchedStats.overdue
        });
      }
    } catch (e) {
      console.error(e);
      toast.error('Connection Failed. Is Odoo running on 8069?');
    }
  };

  return (
    <AppLayout title="Maintenance Dashboard">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total Requests"
          value={stats.total}
          change={isConnected ? "Realtime" : "Demo Data"}
          changeType="neutral"
          icon={ClipboardList}
        />
        <StatsCard
          title="In Progress"
          value={stats.inProgress}
          change={isConnected ? "Active" : "Demo Data"}
          changeType="neutral"
          icon={Clock}
        />
        <StatsCard
          title="Completed"
          value={stats.completed}
          change={isConnected ? "Total" : "Demo Data"}
          changeType="positive"
          icon={CheckCircle2}
        />
        <StatsCard
          title="Overdue"
          value={stats.overdue}
          change={isConnected ? "Actions Needed" : "Demo Data"}
          changeType="negative"
          icon={AlertTriangle}
        />
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Maintenance Kanban</h2>
          <p className="text-sm text-muted-foreground">Track and manage all maintenance requests</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2" onClick={connectToOdoo}>
             {isConnected ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Clock className="w-4 h-4" />}
             {isConnected ? "Connected" : "Connect Server"}
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button size="sm" className="gap-2" onClick={() => setIsNewRequestOpen(true)}>
            <Plus className="w-4 h-4" />
            New Request
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <KanbanBoard />

      {/* New Request Modal */}
      <NewMaintenanceRequestModal open={isNewRequestOpen} onOpenChange={setIsNewRequestOpen} />
    </AppLayout>
  );
}
