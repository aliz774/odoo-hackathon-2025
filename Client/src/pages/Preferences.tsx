import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/components/theme-provider';
import { toast } from 'sonner';
import { Bell, Moon, Sun, Monitor, Globe, Mail } from 'lucide-react';

export default function Preferences() {
  const { theme, setTheme } = useTheme();
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);
  const [language, setLanguage] = useState('en');

  const handleSave = () => {
    toast.success('Preferences saved successfully');
  };

  return (
    <AppLayout title="Preferences">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Appearance Section */}
        <div className="enterprise-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Monitor className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Appearance</h3>
              <p className="text-sm text-muted-foreground">Customize how GearGuard looks on your device</p>
            </div>
          </div>
          
          <Separator className="mb-6" />

          <div className="grid gap-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Theme</Label>
                <p className="text-sm text-muted-foreground">Select your preferred color theme</p>
              </div>
              <div className="flex bg-muted p-1 rounded-lg">
                <button
                  onClick={() => setTheme('light')}
                  className={`p-2 rounded-md transition-all ${theme === 'light' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  title="Light Mode"
                >
                  <Sun className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`p-2 rounded-md transition-all ${theme === 'dark' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  title="Dark Mode"
                >
                  <Moon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setTheme('system')}
                  className={`p-2 rounded-md transition-all ${theme === 'system' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  title="System Default"
                >
                  <Monitor className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="enterprise-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Notifications</h3>
              <p className="text-sm text-muted-foreground">Manage how you receive updates</p>
            </div>
          </div>
          
          <Separator className="mb-6" />

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive daily summaries and critical alerts</p>
              </div>
              <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
            </div>
            
            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive real-time updates on your device</p>
              </div>
              <Switch checked={pushNotifs} onCheckedChange={setPushNotifs} />
            </div>
          </div>
        </div>

        {/* Localization Section */}
        <div className="enterprise-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Language & Region</h3>
              <p className="text-sm text-muted-foreground">Set your language and formatting preferences</p>
            </div>
          </div>
          
          <Separator className="mb-6" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label className="text-base">Language</Label>
              <p className="text-sm text-muted-foreground">Select your interface language</p>
            </div>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} className="w-full sm:w-auto">
            Save Changes
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
