import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScheduleMaintenanceModal } from '@/components/modals/ScheduleMaintenanceModal';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Wrench,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface MaintenanceEvent {
  id: string;
  title: string;
  type: 'preventive' | 'corrective';
  equipment: string;
}

const events: Record<string, MaintenanceEvent[]> = {
  '2024-12-28': [
    { id: '1', title: 'Annual Calibration', type: 'preventive', equipment: 'Laser Cutter #2' },
  ],
  '2024-12-30': [
    { id: '2', title: 'Oil Change', type: 'preventive', equipment: 'CNC Machine #12' },
    { id: '3', title: 'Belt Inspection', type: 'preventive', equipment: 'Conveyor Line A' },
  ],
  '2025-01-02': [
    { id: '4', title: 'Safety Check', type: 'preventive', equipment: 'Press Machine #3' },
  ],
  '2025-01-05': [
    { id: '5', title: 'Filter Replacement', type: 'preventive', equipment: 'Air System #1' },
  ],
  '2025-01-10': [
    { id: '6', title: 'Quarterly Inspection', type: 'preventive', equipment: 'Assembly Robot #7' },
  ],
};

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 11, 1)); // December 2024
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const formatDateKey = (day: number, monthOffset = 0) => {
    const d = new Date(year, month + monthOffset, day);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const getDayEvents = (day: number, monthOffset = 0) => {
    const key = formatDateKey(day, monthOffset);
    return events[key] || [];
  };

  const handleDateClick = (dateKey: string) => {
    setSelectedDate(dateKey);
    setIsScheduleModalOpen(true);
  };

  const renderCalendarDays = () => {
    const days = [];

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const dateKey = formatDateKey(day, -1);
      const dayEvents = getDayEvents(day, -1);
      days.push(
        <div
          key={`prev-${day}`}
          className="min-h-[100px] p-2 border-b border-r border-border bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => handleDateClick(dateKey)}
        >
          <span className="text-sm text-muted-foreground">{day}</span>
          {renderEvents(dayEvents)}
        </div>
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = formatDateKey(day);
      const dayEvents = getDayEvents(day);
      const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
      days.push(
        <div
          key={day}
          className={cn(
            'min-h-[100px] p-2 border-b border-r border-border cursor-pointer hover:bg-muted/50 transition-colors',
            isToday && 'bg-primary/5'
          )}
          onClick={() => handleDateClick(dateKey)}
        >
          <span
            className={cn(
              'inline-flex items-center justify-center w-7 h-7 text-sm rounded-full',
              isToday && 'bg-primary text-primary-foreground font-medium'
            )}
          >
            {day}
          </span>
          {renderEvents(dayEvents)}
        </div>
      );
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const dateKey = formatDateKey(day, 1);
      const dayEvents = getDayEvents(day, 1);
      days.push(
        <div
          key={`next-${day}`}
          className="min-h-[100px] p-2 border-b border-r border-border bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => handleDateClick(dateKey)}
        >
          <span className="text-sm text-muted-foreground">{day}</span>
          {renderEvents(dayEvents)}
        </div>
      );
    }

    return days;
  };

  const renderEvents = (dayEvents: MaintenanceEvent[]) => {
    if (dayEvents.length === 0) return null;
    return (
      <div className="mt-1 space-y-1">
        {dayEvents.slice(0, 2).map((event) => (
          <div
            key={event.id}
            className="flex items-center gap-1.5 px-2 py-1 rounded bg-primary/10 text-primary text-xs truncate"
          >
            <Wrench className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{event.title}</span>
          </div>
        ))}
        {dayEvents.length > 2 && (
          <span className="text-xs text-muted-foreground px-2">
            +{dayEvents.length - 2} more
          </span>
        )}
      </div>
    );
  };

  return (
    <AppLayout title="Maintenance Calendar">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Preventive Maintenance Schedule</h2>
          <p className="text-sm text-muted-foreground">Plan and track scheduled maintenance tasks</p>
        </div>
        <Button size="sm" className="gap-2" onClick={() => setIsScheduleModalOpen(true)}>
          <Plus className="w-4 h-4" />
          Schedule Maintenance
        </Button>
      </div>

      {/* Calendar */}
      <div className="enterprise-card overflow-hidden">
        {/* Calendar Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">
            {monthNames[month]} {year}
          </h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b border-border">
          {dayNames.map((day) => (
            <div
              key={day}
              className="p-3 text-center text-sm font-medium text-muted-foreground bg-muted/30"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">{renderCalendarDays()}</div>
      </div>

      {/* Schedule Maintenance Modal */}
      <ScheduleMaintenanceModal 
        open={isScheduleModalOpen} 
        onOpenChange={setIsScheduleModalOpen}
        selectedDate={selectedDate}
      />
    </AppLayout>
  );
}
