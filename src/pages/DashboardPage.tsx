import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Users, 
  Bell, 
  Plus, 
  TrendingUp,
  Activity,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useChatStore, useAuthStore } from '@/store';
import { useNotifications, useBreakpoint } from '@/hooks';
import { Avatar, Badge, Button, Card } from '@/components';

export function DashboardPage() {
  const { user } = useAuthStore();
  const { chats, groups } = useChatStore();
  const { unreadCount } = useNotifications();
  const { isMobile } = useBreakpoint();

  const recentChats = chats.slice(0, 5);
  const myGroups = groups.filter(group => 
    group.members.some(member => member.user.id === user?.id)
  );

  const stats = [
    {
      label: 'Total Chats',
      value: chats.length,
      icon: <MessageCircle className="w-5 h-5" />,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      label: 'Groups',
      value: myGroups.length,
      icon: <Users className="w-5 h-5" />,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      label: 'Unread Messages',
      value: unreadCount,
      icon: <Bell className="w-5 h-5" />,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
    {
      label: 'Active Today',
      value: 12,
      icon: <Activity className="w-5 h-5" />,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4 mb-4">
          {user && (
            <div className="flex items-center gap-4">
              <Avatar user={user} size="lg" showStatus />
              <div>
                <h1 className="text-3xl font-bold text-text-primary dark:text-dark-text-primary">
                  Welcome back, {user.name}!
                </h1>
                <p className="text-text-secondary dark:text-dark-text-secondary">
                  Here's what's happening in your workspace today.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Button size="sm" variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
          <Button size="sm" variant="outline">
            <Users className="w-4 h-4 mr-2" />
            Create Group
          </Button>
          <Link to="/notifications">
            <Button size="sm" variant="ghost">
              <Bell className="w-4 h-4 mr-2" />
              View Notifications
              {unreadCount > 0 && (
                <Badge variant="error" size="sm" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">
                    {stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bgColor}`}>
                  <span className={stat.color}>
                    {stat.icon}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Chats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-text-primary dark:text-dark-text-primary">
                Recent Chats
              </h2>
              <Link to="/chats">
                <Button size="sm" variant="ghost">
                  View All
                </Button>
              </Link>
            </div>

            {recentChats.length > 0 ? (
              <div className="space-y-4">
                {recentChats.map((chat, index) => (
                  <motion.div
                    key={chat.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                  >
                    <Link to={chat.type === 'group' ? `/chat/group/${chat.id}` : `/chat/private/${chat.id}`}>
                      <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-bg-page dark:hover:bg-dark-bg-page transition-colors cursor-pointer">
                        <div className="flex-shrink-0">
                          {chat.type === 'group' ? (
                            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                              <span className="text-sm font-semibold text-primary-700 dark:text-primary-400">
                                {chat.name.substring(0, 2).toUpperCase()}
                              </span>
                            </div>
                          ) : (
                            <Avatar
                              user={chat.participants.find(p => p.id !== user?.id)}
                              size="md"
                            />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-text-primary dark:text-dark-text-primary truncate">
                              {chat.name}
                            </p>
                            {chat.unreadCount > 0 && (
                              <Badge variant="primary" size="sm">
                                {chat.unreadCount}
                              </Badge>
                            )}
                          </div>
                          {chat.lastMessage && (
                            <p className="text-sm text-text-secondary dark:text-dark-text-secondary truncate">
                              {chat.lastMessage.content}
                            </p>
                          )}
                        </div>

                        <div className="text-xs text-text-secondary dark:text-dark-text-secondary">
                          {chat.lastMessage && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(chat.lastMessage.timestamp).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-text-secondary dark:text-dark-text-secondary mx-auto mb-4" />
                <p className="text-text-secondary dark:text-dark-text-secondary">
                  No recent chats
                </p>
              </div>
            )}
          </Card>
        </motion.div>

        {/* My Groups */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-text-primary dark:text-dark-text-primary">
                My Groups
              </h2>
              <Link to="/groups">
                <Button size="sm" variant="ghost">
                  View All
                </Button>
              </Link>
            </div>

            {myGroups.length > 0 ? (
              <div className="space-y-3">
                {myGroups.slice(0, 4).map((group, index) => (
                  <motion.div
                    key={group.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                  >
                    <Link to={`/groups/${group.id}`}>
                      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-bg-page dark:hover:bg-dark-bg-page transition-colors cursor-pointer">
                        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-semibold text-primary-700 dark:text-primary-400">
                            {group.name.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-text-primary dark:text-dark-text-primary text-sm truncate">
                            {group.name}
                          </p>
                          <p className="text-xs text-text-secondary dark:text-dark-text-secondary">
                            {group.members.length} members
                          </p>
                        </div>
                        {group.unreadCount > 0 && (
                          <Badge variant="primary" size="sm">
                            {group.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-text-secondary dark:text-dark-text-secondary mx-auto mb-4" />
                <p className="text-text-secondary dark:text-dark-text-secondary mb-4">
                  No groups yet
                </p>
                <Button size="sm" variant="primary">
                  Create Group
                </Button>
              </div>
            )}
          </Card>

          {/* Activity Feed */}
          <Card className="p-6 mt-6">
            <h2 className="text-xl font-semibold text-text-primary dark:text-dark-text-primary mb-6">
              Recent Activity
            </h2>

            <div className="space-y-4">
              {[
                {
                  action: 'Message sent',
                  target: 'Frontend Team',
                  time: '2 minutes ago',
                  icon: <MessageCircle className="w-4 h-4" />,
                  color: 'text-blue-500',
                },
                {
                  action: 'Group joined',
                  target: 'Design Review',
                  time: '1 hour ago',
                  icon: <Users className="w-4 h-4" />,
                  color: 'text-green-500',
                },
                {
                  action: 'File shared',
                  target: 'Project Alpha',
                  time: '3 hours ago',
                  icon: <CheckCircle className="w-4 h-4" />,
                  color: 'text-purple-500',
                },
              ].map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className={`w-8 h-8 rounded-full bg-bg-page dark:bg-dark-bg-page flex items-center justify-center ${activity.color}`}>
                    {activity.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary dark:text-dark-text-primary">
                      {activity.action}{' '}
                      <span className="font-medium">{activity.target}</span>
                    </p>
                    <p className="text-xs text-text-secondary dark:text-dark-text-secondary">
                      {activity.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}