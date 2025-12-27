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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AddEquipmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddEquipmentModal({ open, onOpenChange }: AddEquipmentModalProps) {
  const [equipmentName, setEquipmentName] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [equipmentType, setEquipmentType] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [warrantyExpiry, setWarrantyExpiry] = useState('');
  const [assignedTeam, setAssignedTeam] = useState('');

  const isFormValid = 
    equipmentName.trim() !== '' && 
    serialNumber.trim() !== '' && 
    equipmentType !== '' &&
    department !== '' &&
    location.trim() !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle add equipment logic
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setEquipmentName('');
    setSerialNumber('');
    setEquipmentType('');
    setDepartment('');
    setLocation('');
    setPurchaseDate('');
    setWarrantyExpiry('');
    setAssignedTeam('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Add New Equipment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Equipment Name */}
            <div className="space-y-2">
              <Label htmlFor="equipmentName">Equipment Name</Label>
              <Input
                id="equipmentName"
                placeholder="e.g., CNC Machine #13"
                value={equipmentName}
                onChange={(e) => setEquipmentName(e.target.value)}
              />
            </div>

            {/* Serial Number */}
            <div className="space-y-2">
              <Label htmlFor="serialNumber">Serial Number</Label>
              <Input
                id="serialNumber"
                placeholder="e.g., CNC-2024-0013"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Equipment Type */}
            <div className="space-y-2">
              <Label>Equipment Type</Label>
              <Select value={equipmentType} onValueChange={setEquipmentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cnc">CNC Machine</SelectItem>
                  <SelectItem value="conveyor">Conveyor</SelectItem>
                  <SelectItem value="press">Press Machine</SelectItem>
                  <SelectItem value="laser">Laser Cutter</SelectItem>
                  <SelectItem value="robot">Robot</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Department */}
            <div className="space-y-2">
              <Label>Department</Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="assembly">Assembly</SelectItem>
                  <SelectItem value="quality">Quality Control</SelectItem>
                  <SelectItem value="warehouse">Warehouse</SelectItem>
                  <SelectItem value="rd">R&D</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g., Building A, Floor 2"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Purchase Date */}
            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Purchase Date</Label>
              <Input
                id="purchaseDate"
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
              />
            </div>

            {/* Warranty Expiry Date */}
            <div className="space-y-2">
              <Label htmlFor="warrantyExpiry">Warranty Expiry Date</Label>
              <Input
                id="warrantyExpiry"
                type="date"
                value={warrantyExpiry}
                onChange={(e) => setWarrantyExpiry(e.target.value)}
              />
            </div>
          </div>

          {/* Assigned Maintenance Team */}
          <div className="space-y-2">
            <Label>Assigned Maintenance Team</Label>
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

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isFormValid}>
              Save Equipment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
