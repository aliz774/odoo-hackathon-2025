import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/dashboard/StatsCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import {
  Download,
  TrendingUp,
  Clock,
  Wrench,
  AlertTriangle,
} from 'lucide-react';

const monthlyData = [
  { month: 'Jul', completed: 18, pending: 5 },
  { month: 'Aug', completed: 22, pending: 3 },
  { month: 'Sep', completed: 25, pending: 7 },
  { month: 'Oct', completed: 20, pending: 4 },
  { month: 'Nov', completed: 28, pending: 6 },
  { month: 'Dec', completed: 24, pending: 8 },
];

const statusData = [
  { name: 'Completed', value: 142, color: 'hsl(142, 71%, 45%)' },
  { name: 'In Progress', value: 8, color: 'hsl(43, 96%, 56%)' },
  { name: 'Pending', value: 5, color: 'hsl(217, 91%, 60%)' },
  { name: 'Overdue', value: 3, color: 'hsl(0, 72%, 51%)' },
];

const teamPerformance = [
  { team: 'Machine Shop', completed: 45, avgTime: 2.5 },
  { team: 'Assembly', completed: 38, avgTime: 3.2 },
  { team: 'Automation', completed: 32, avgTime: 2.8 },
  { team: 'Precision', completed: 27, avgTime: 4.1 },
];

const trendData = [
  { week: 'W1', requests: 12, resolved: 10 },
  { week: 'W2', requests: 15, resolved: 14 },
  { week: 'W3', requests: 8, resolved: 9 },
  { week: 'W4', requests: 18, resolved: 16 },
];

export default function Reports() {
  return (
    <AppLayout title="Reports">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Maintenance Reports</h2>
          <p className="text-sm text-muted-foreground">Analytics and insights for maintenance operations</p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="month">
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total Completed"
          value={142}
          change="+12% from last month"
          changeType="positive"
          icon={Wrench}
        />
        <StatsCard
          title="Avg Response Time"
          value="2.4h"
          change="-18% improvement"
          changeType="positive"
          icon={Clock}
        />
        <StatsCard
          title="Resolution Rate"
          value="94%"
          change="+5% from last month"
          changeType="positive"
          icon={TrendingUp}
        />
        <StatsCard
          title="Overdue Tasks"
          value={3}
          change="2 less than last week"
          changeType="positive"
          icon={AlertTriangle}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Monthly Trend */}
        <div className="lg:col-span-2 enterprise-card p-5">
          <h3 className="font-semibold text-foreground mb-4">Monthly Maintenance Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="completed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="enterprise-card p-5">
          <h3 className="font-semibold text-foreground mb-4">Status Distribution</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <span className="font-medium text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Performance */}
        <div className="enterprise-card p-5">
          <h3 className="font-semibold text-foreground mb-4">Team Performance</h3>
          <div className="space-y-4">
            {teamPerformance.map((team) => (
              <div key={team.team} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{team.team}</span>
                  <span className="text-muted-foreground">{team.completed} completed</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${(team.completed / 50) * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Avg. resolution: {team.avgTime}h</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Trend */}
        <div className="enterprise-card p-5">
          <h3 className="font-semibold text-foreground mb-4">Weekly Request vs Resolution</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="requests"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
                <Line
                  type="monotone"
                  dataKey="resolved"
                  stroke="hsl(142, 71%, 45%)"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(142, 71%, 45%)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
