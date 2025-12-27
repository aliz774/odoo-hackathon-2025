import { Bell, Search, Menu, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface TopBarProps {
  onMenuClick: () => void;
  title?: string;
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Mock initial notifications
const initialNotifications = [
  {
    id: 1,
    title: 'Overdue Maintenance',
    message: 'CNC Machine #12 is 2 days overdue for scheduled maintenance.',
    time: '2 mins ago',
    read: false,
    type: 'alert'
  },
  {
    id: 2,
    title: 'New Request Assigned',
    message: 'Conveyor Belt inspection has been assigned to you.',
    time: '1 hour ago',
    read: false,
    type: 'info'
  },
  {
    id: 3,
    title: 'Maintenance Complete',
    message: 'Forklift #5 service has been marked as completed directly.',
    time: '3 hours ago',
    read: true,
    type: 'success'
  }
];

export function TopBar({ onMenuClick, title = 'Dashboard' }: TopBarProps) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    // Navigate to signin page
    navigate('/signin');
  };

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-muted rounded-lg transition-colors lg:hidden"
        >
          <Menu className="w-5 h-5 text-muted-foreground" />
        </button>
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-muted rounded-lg transition-colors hidden lg:flex"
        >
          <Menu className="w-5 h-5 text-muted-foreground" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="w-64 pl-9 bg-muted/50 border-transparent focus:border-primary focus:bg-card"
          />
        </div>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-0.5 -right-0.5 h-5 w-5 flex items-center justify-center p-0 text-xs bg-destructive">
                  {unreadCount}
                </Badge>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between px-2 py-1.5">
              <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  Mark all as read
                </button>
              )}
            </div>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No notifications
                </div>
              ) : (
                notifications.map((notification) => (
                  <DropdownMenuItem 
                    key={notification.id} 
                    className={`flex items-start gap-3 py-3 cursor-pointer ${!notification.read ? 'bg-muted/50' : ''}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="mt-1.5">
                      {!notification.read && (
                        <span className="flex h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between w-full">
                        <span className={`font-medium leading-none ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {notification.title}
                        </span>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-snug">
                        {notification.message}
                      </p>
                    </div>
                  </DropdownMenuItem>
                ))
              )}
            </div>
            {notifications.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="w-full text-center text-xs text-muted-foreground justify-center cursor-pointer pointer-events-auto"
                  onClick={() => setNotifications([])}
                >
                  Clear all notifications
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-1.5 hover:bg-muted rounded-lg transition-colors">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="hidden lg:flex flex-col items-start">
                <span className="text-sm font-medium text-foreground">John Doe</span>
                <span className="text-xs text-muted-foreground">Admin</span>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground hidden lg:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profile')}>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/preferences')}>Preferences</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={handleLogout}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
