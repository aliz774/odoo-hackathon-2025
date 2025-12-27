import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ArrowLeft, CalendarIcon, Save, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const statusOptions = [
  { value: 'new', label: 'New', color: 'bg-blue-500' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-amber-500' },
  { value: 'repaired', label: 'Repaired', color: 'bg-emerald-500' },
  { value: 'scrap', label: 'Scrap', color: 'bg-red-500' },
];

export default function MaintenanceRequestForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [status, setStatus] = useState('new');
  const [date, setDate] = useState<Date>();

  return (
    <AppLayout title={isEditing ? 'Edit Request' : 'New Maintenance Request'}>
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        className="gap-2 mb-4"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Button>

      {/* Status Buttons */}
      <div className="enterprise-card p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setStatus(option.value)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg border transition-all',
                status === option.value
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border hover:border-primary/50'
              )}
            >
              <div className={cn('w-2 h-2 rounded-full', option.color)} />
              <span className="font-medium text-sm">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="enterprise-card p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Subject */}
          <div className="lg:col-span-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Brief description of the issue"
              className="mt-1.5"
            />
          </div>

          {/* Equipment */}
          <div>
            <Label htmlFor="equipment">Equipment</Label>
            <Select>
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select equipment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cnc-12">CNC Machine #12</SelectItem>
                <SelectItem value="conveyor-a">Conveyor Line A</SelectItem>
                <SelectItem value="press-3">Press Machine #3</SelectItem>
                <SelectItem value="laser-2">Laser Cutter #2</SelectItem>
                <SelectItem value="robot-7">Assembly Robot #7</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Request Type */}
          <div>
            <Label htmlFor="type">Request Type</Label>
            <Select>
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="corrective">Corrective</SelectItem>
                <SelectItem value="preventive">Preventive</SelectItem>
                <SelectItem value="predictive">Predictive</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Technician */}
          <div>
            <Label htmlFor="technician">Assign Technician</Label>
            <Select>
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select technician" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mike">Mike Chen</SelectItem>
                <SelectItem value="sarah">Sarah Kim</SelectItem>
                <SelectItem value="tom">Tom Wilson</SelectItem>
                <SelectItem value="lisa">Lisa Park</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select>
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Scheduled Date */}
          <div>
            <Label>Scheduled Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal mt-1.5',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Duration */}
          <div>
            <Label htmlFor="duration">Estimated Duration (hours)</Label>
            <Input
              id="duration"
              type="number"
              placeholder="2"
              className="mt-1.5"
            />
          </div>

          {/* Description */}
          <div className="lg:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Detailed description of the maintenance request..."
              className="mt-1.5 min-h-[120px]"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-border">
          <Button variant="outline" onClick={() => navigate('/')}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button>
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? 'Save Changes' : 'Create Request'}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
