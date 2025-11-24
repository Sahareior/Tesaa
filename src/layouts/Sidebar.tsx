import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Users, 
  Settings, 
  Bell, 
  Search,
  Plus,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/utils';
import { useAuthStore, useChatStore, useAppStore } from '@/store';
import { useBreakpoint, useNotifications } from '@/hooks';
import { Avatar, Badge, Button, Input } from '@/components';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'chats',
    label: 'Chats',
    icon: <MessageCircle className="w-5 h-5" />,
    path: '/chats',
  },
  {
    id: 'groups',
    label: 'Groups',
    icon: <Users className="w-5 h-5" />,
    path: '/groups',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: <Bell className="w-5 h-5" />,
    path: '/notifications',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings className="w-5 h-5" />,
    path: '/settings',
  },
];

export function Sidebar() {
  const location = useLocation();
  const { user } = useAuthStore();
  const { chats } = useChatStore();
  const { sidebarCollapsed, setSidebarCollapsed } = useAppStore();
  const { isMobile } = useBreakpoint();
  const { unreadCount } = useNotifications();

  const totalUnreadChats = chats.reduce((total, chat) => total + chat.unreadCount, 0);

  // Close sidebar on mobile when clicking outside
  React.useEffect(() => {
    if (!isMobile && sidebarCollapsed) {
      setSidebarCollapsed(false);
    }
  }, [isMobile, sidebarCollapsed, setSidebarCollapsed]);

  if (isMobile && !sidebarCollapsed) {
    return (
      <>
        {/* Mobile Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
        
        {/* Mobile Sidebar */}
        <motion.div
          initial={{ x: -280 }}
          animate={{ x: 0 }}
          exit={{ x: -280 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed left-0 top-0 z-50 h-full w-80 bg-bg-surface dark:bg-dark-bg-surface border-r border-border-subtle dark:border-dark-border-subtle lg:hidden"
        >
          <SidebarContent 
            user={user}
            currentPath={location.pathname}
            unreadCount={totalUnreadChats + unreadCount}
            notificationUnread={unreadCount}
            sidebarItems={sidebarItems}
            isCollapsed={false}
            onClose={() => setSidebarCollapsed(true)}
          />
        </motion.div>
      </>
    );
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 80 : 280 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className={cn(
        'hidden lg:flex flex-col bg-bg-surface dark:bg-dark-bg-surface border-r border-border-subtle dark:border-dark-border-subtle relative z-30',
        sidebarCollapsed ? 'w-20' : 'w-72'
      )}
    >
      <SidebarContent 
        user={user}
        currentPath={location.pathname}
        unreadCount={totalUnreadChats + unreadCount}
        notificationUnread={unreadCount}
        sidebarItems={sidebarItems}
        isCollapsed={sidebarCollapsed}
      />
    </motion.aside>
  );
}

interface SidebarContentProps {
  user: any;
  currentPath: string;
  unreadCount: number;
  notificationUnread: number;
  sidebarItems: SidebarItem[];
  isCollapsed: boolean;
  onClose?: () => void;
}

function SidebarContent({
  user,
  currentPath,
  unreadCount,
  notificationUnread,
  sidebarItems,
  isCollapsed,
  onClose,
}: SidebarContentProps) {
  const { chats } = useChatStore();

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border-subtle dark:border-dark-border-subtle">
        <div className="flex items-center gap-3">
          {user && (
            <>
              <Avatar user={user} size="md" />
              {!isCollapsed && (
                <div>
                  <p className="font-semibold text-text-primary dark:text-dark-text-primary text-sm">
                    {user.name}
                  </p>
                  <p className="text-text-secondary dark:text-dark-text-secondary text-xs">
                    {user.email}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {!isCollapsed && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="lg:hidden"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          
          {!isCollapsed && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {}}
            >
              <Plus className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Search */}
      {!isCollapsed && (
        <div className="p-4">
          <Input
            placeholder="Search..."
            icon={<Search className="w-4 h-4" />}
            className="h-9"
          />
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {sidebarItems.map((item) => {
            const isActive = currentPath === item.path || 
              (item.path === '/chats' && currentPath.startsWith('/chat'));
            
            const hasNotification = item.id === 'notifications' && notificationUnread > 0;
            const hasUnread = item.id === 'chats' && unreadCount > 0;
            const showBadge = (hasNotification || hasUnread) && !isCollapsed;

            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 group relative',
                  isActive 
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400' 
                    : 'text-text-secondary dark:text-dark-text-secondary hover:bg-bg-page dark:hover:bg-dark-bg-page hover:text-text-primary dark:hover:text-dark-text-primary',
                  isCollapsed && 'justify-center px-2'
                )}
              >
                <div className="flex-shrink-0">
                  {item.icon}
                </div>
                
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-sm font-medium">
                      {item.label}
                    </span>
                    {showBadge && (
                      <Badge
                        variant="primary"
                        size="sm"
                        className="ml-auto"
                      >
                        {hasNotification ? notificationUnread : unreadCount}
                      </Badge>
                    )}
                  </>
                )}
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-bg-surface dark:bg-dark-bg-surface border border-border-subtle dark:border-dark-border-subtle rounded shadow-lg text-xs text-text-primary dark:text-dark-text-primary whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                    {item.label}
                    {(hasNotification || hasUnread) && (
                      <Badge variant="primary" size="sm" className="ml-2">
                        {hasNotification ? notificationUnread : unreadCount}
                      </Badge>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Recent Chats */}
        {!isCollapsed && (
          <div className="mt-8">
            <h3 className="text-xs font-semibold text-text-secondary dark:text-dark-text-secondary uppercase tracking-wider mb-3">
              Recent Chats
            </h3>
            <div className="space-y-1">
              {chats.slice(0, 3).map((chat) => (
                <Link
                  key={chat.id}
                  to={chat.type === 'group' ? `/chat/group/${chat.id}` : `/chat/private/${chat.id}`}
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-bg-page dark:hover:bg-dark-bg-page transition-colors duration-200 group"
                >
                  <div className="flex-shrink-0">
                    {chat.type === 'group' ? (
                      <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                        <span className="text-xs font-semibold text-primary-700 dark:text-primary-400">
                          {chat.name.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                    ) : (
                      <Avatar
                        user={chat.participants.find(p => p.id !== user?.id)}
                        size="xs"
                      />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary dark:text-dark-text-primary truncate">
                      {chat.name}
                    </p>
                    {chat.lastMessage && (
                      <p className="text-xs text-text-secondary dark:text-dark-text-secondary truncate">
                        {chat.lastMessage.content}
                      </p>
                    )}
                  </div>
                  
                  {chat.unreadCount > 0 && (
                    <Badge variant="primary" size="sm">
                      {chat.unreadCount}
                    </Badge>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}