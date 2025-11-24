import React from 'react';
import { motion } from 'framer-motion';
import { 
  Menu, 
  Search, 
  Bell, 
  Sun, 
  Moon,
  Phone,
  Video,
  MoreHorizontal,
  Settings,
  LogOut,
  User
} from 'lucide-react';
import { useAuthStore, useAppStore } from '@/store';
import { useTheme, useNotifications } from '@/hooks';
import { Avatar, Badge, Button, Dropdown, Input } from '@/components';

export function Topbar() {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const { setSidebarCollapsed } = useAppStore();
  const { unreadCount } = useNotifications();

  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    {
      id: 'profile',
      label: 'Profile',
      icon: <User className="w-4 h-4" />,
      action: () => {},
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />,
      action: () => {},
    },
    {
      id: 'logout',
      label: 'Sign out',
      icon: <LogOut className="w-4 h-4" />,
      action: handleLogout,
      danger: true,
    },
  ];

  return (
    <header className="flex items-center justify-between p-4 bg-bg-surface dark:bg-dark-bg-surface border-b border-border-subtle dark:border-dark-border-subtle">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarCollapsed(false)}
          className="lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Search */}
        <div className="hidden md:block w-80">
          <Input
            placeholder="Search messages, groups, or users..."
            icon={<Search className="w-4 h-4" />}
          />
        </div>

        {/* Mobile Search Button */}
        <Button variant="ghost" size="sm" className="md:hidden">
          <Search className="w-5 h-5" />
        </Button>
      </div>

      {/* Center Section - Call Actions */}
      <div className="hidden md:flex items-center gap-2">
        <Button variant="ghost" size="sm" className="text-text-secondary">
          <Phone className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" className="text-text-secondary">
          <Video className="w-4 h-4" />
        </Button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="text-text-secondary"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </Button>

        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="text-text-secondary relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1"
              >
                <Badge variant="error" size="sm">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              </motion.div>
            )}
          </Button>
        </div>

        {/* More Actions */}
        <Button
          variant="ghost"
          size="sm"
          className="text-text-secondary"
        >
          <MoreHorizontal className="w-5 h-5" />
        </Button>

        {/* User Menu */}
        <div className="flex items-center gap-3 pl-2 border-l border-border-subtle dark:border-dark-border-subtle">
          {user && (
            <>
              {/* User Info - Hidden on mobile */}
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-text-primary dark:text-dark-text-primary">
                  {user.name}
                </p>
                <p className="text-xs text-text-secondary dark:text-dark-text-secondary">
                  {user.status}
                </p>
              </div>

              {/* User Avatar */}
              <Dropdown
                trigger={
                  <button className="relative">
                    <Avatar user={user} size="md" showStatus />
                  </button>
                }
                items={menuItems}
                align="right"
              />
            </>
          )}
        </div>
      </div>
    </header>
  );
}