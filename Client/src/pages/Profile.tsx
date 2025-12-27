import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Camera, Save, User, Mail, Phone, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function Profile() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@gearguard.com',
    phone: '+1 555-0123',
    role: 'Admin',
    department: 'Maintenance Management',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Profile updated successfully');
    }, 1000);
  };

  const handleChange = (field: string, value: string) => {
    setUser(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser(prev => ({ ...prev, avatar: reader.result as string }));
        toast.success('Profile picture updated');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <AppLayout title="My Profile">
      <div className="max-w-4xl mx-auto">
        {/* Header / Profile Card */}
        <div className="enterprise-card p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-background shadow-sm">
                <AvatarImage src={user.avatar} className="object-cover" />
                <AvatarFallback className="text-2xl">JD</AvatarFallback>
              </Avatar>
              <label 
                htmlFor="avatar-upload" 
                className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <input 
                  id="avatar-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageUpload}
                />
              </label>
            </div>
            
            <div className="text-center sm:text-left flex-1">
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
                <Badge variant="outline" className="px-3 py-1 border-primary/20 bg-primary/5 text-primary">
                  {user.role}
                </Badge>
              </div>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  <span>{user.department}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{user.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="enterprise-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <p className="text-sm text-muted-foreground">Update your personal details and contact info</p>
            </div>
          </div>
          
          <Separator className="mb-6" />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    value={user.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={user.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="role"
                    value={user.role}
                    disabled
                    className="pl-9 bg-muted/50"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Role cannot be changed directly</p>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto gap-2">
                <Save className="w-4 h-4" />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
