import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ScheduleMaintenanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate?: string | null;
}

export function ScheduleMaintenanceModal({ open, onOpenChange, selectedDate }: ScheduleMaintenanceModalProps) {
  const [equipment, setEquipment] = useState('');
  const [maintenanceType, setMaintenanceType] = useState('');
  const [assignedTeam, setAssignedTeam] = useState('');
  const [technician, setTechnician] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('');

  useEffect(() => {
    if (selectedDate) {
      setScheduledDate(selectedDate);
    }
  }, [selectedDate]);

  const isFormValid = 
    equipment !== '' && 
    maintenanceType !== '' && 
    assignedTeam !== '' &&
    scheduledDate !== '' &&
    estimatedDuration !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle schedule maintenance logic
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setEquipment('');
    setMaintenanceType('');
    setAssignedTeam('');
    setTechnician('');
    setScheduledDate('');
    setEstimatedDuration('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Schedule Maintenance</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          {/* Equipment */}
          <div className="space-y-2">
            <Label>Equipment</Label>
            <Select value={equipment} onValueChange={setEquipment}>
              <SelectTrigger>
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

          {/* Maintenance Type */}
          <div className="space-y-2">
            <Label>Maintenance Type</Label>
            <Select value={maintenanceType} onValueChange={setMaintenanceType}>
              <SelectTrigger>
                <SelectValue placeholder="Select maintenance type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="preventive">Preventive</SelectItem>
                <SelectItem value="inspection">Inspection</SelectItem>
                <SelectItem value="calibration">Calibration</SelectItem>
                <SelectItem value="cleaning">Cleaning</SelectItem>
                <SelectItem value="replacement">Part Replacement</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Assigned Team */}
          <div className="space-y-2">
            <Label>Assigned Team</Label>
            <Select value={assignedTeam} onValueChange={setAssignedTeam}>
              <SelectTrigger>
                <SelectValue placeholder="Select team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="machine-shop">Machine Shop Team</SelectItem>
                <SelectItem value="assembly">Assembly Team</SelectItem>
                <SelectItem value="automation">Automation Team</SelectItem>
                <SelectItem value="precision">Precision Team</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Technician (Optional) */}
          <div className="space-y-2">
            <Label>Technician (optional)</Label>
            <Select value={technician} onValueChange={setTechnician}>
              <SelectTrigger>
                <SelectValue placeholder="Select technician" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mike">Mike Chen</SelectItem>
                <SelectItem value="sarah">Sarah Kim</SelectItem>
                <SelectItem value="tom">Tom Wilson</SelectItem>
                <SelectItem value="james">James Lee</SelectItem>
                <SelectItem value="anna">Anna Brown</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Scheduled Date */}
            <div className="space-y-2">
              <Label htmlFor="scheduledDate">Scheduled Date</Label>
              <Input
                id="scheduledDate"
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
              />
            </div>

            {/* Estimated Duration */}
            <div className="space-y-2">
              <Label>Estimated Duration</Label>
              <Select value={estimatedDuration} onValueChange={setEstimatedDuration}>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                  <SelectItem value="240">4 hours</SelectItem>
                  <SelectItem value="480">Full day</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isFormValid}>
              Schedule
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
