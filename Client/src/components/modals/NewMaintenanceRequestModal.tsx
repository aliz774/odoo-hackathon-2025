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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface NewMaintenanceRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewMaintenanceRequestModal({ open, onOpenChange }: NewMaintenanceRequestModalProps) {
  const [subject, setSubject] = useState('');
  const [equipment, setEquipment] = useState('');
  const [requestType, setRequestType] = useState('');
  const [priority, setPriority] = useState('');
  const [description, setDescription] = useState('');

  const isFormValid = subject.trim() !== '' && equipment !== '' && requestType !== '' && priority !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle create request logic
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setSubject('');
    setEquipment('');
    setRequestType('');
    setPriority('');
    setDescription('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Maintenance Request</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject / Issue Title</Label>
            <Input
              id="subject"
              placeholder="Brief description of the issue"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

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

          {/* Request Type */}
          <div className="space-y-2">
            <Label>Request Type</Label>
            <Select value={requestType} onValueChange={setRequestType}>
              <SelectTrigger>
                <SelectValue placeholder="Select request type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="corrective">Corrective</SelectItem>
                <SelectItem value="preventive">Preventive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label>Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Provide additional details about the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isFormValid}>
              Create Request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
