import { User, Group, Message, Chat, Notification, CallParticipant } from '@/types';

// Demo Users
export const demoUsers: User[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    status: 'online',
    lastSeen: new Date(),
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    status: 'online',
    lastSeen: new Date(),
  },
  {
    id: '3',
    name: 'Mike Rodriguez',
    email: 'mike@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    status: 'away',
    lastSeen: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    status: 'busy',
    lastSeen: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
  },
  {
    id: '5',
    name: 'James Wilson',
    email: 'james@example.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    status: 'offline',
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: '6',
    name: 'Lisa Anderson',
    email: 'lisa@example.com',
    avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=150&h=150&fit=crop&crop=face',
    status: 'online',
    lastSeen: new Date(),
  },
  {
    id: '7',
    name: 'David Kim',
    email: 'david@example.com',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    status: 'offline',
    lastSeen: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
  },
  {
    id: '8',
    name: 'Anna Martinez',
    email: 'anna@example.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    status: 'online',
    lastSeen: new Date(),
  },
];

// Demo Groups
export const demoGroups: Group[] = [
  {
    id: 'group-1',
    name: 'Frontend Team',
    description: 'Discussion about frontend development, UI/UX, and React components',
    avatar: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=150&h=150&fit=crop',
    members: [
      {
        user: demoUsers[0],
        role: 'admin',
        joinedAt: new Date('2024-01-15'),
      },
      {
        user: demoUsers[1],
        role: 'member',
        joinedAt: new Date('2024-01-15'),
      },
      {
        user: demoUsers[2],
        role: 'member',
        joinedAt: new Date('2024-01-20'),
      },
      {
        user: demoUsers[5],
        role: 'moderator',
        joinedAt: new Date('2024-01-18'),
      },
    ],
    createdAt: new Date('2024-01-15'),
    isPrivate: false,
    unreadCount: 3,
  },
  {
    id: 'group-2',
    name: 'Design Review',
    description: 'Weekly design critiques and feedback sessions',
    avatar: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=150&h=150&fit=crop',
    members: [
      {
        user: demoUsers[1],
        role: 'admin',
        joinedAt: new Date('2024-01-10'),
      },
      {
        user: demoUsers[3],
        role: 'member',
        joinedAt: new Date('2024-01-12'),
      },
      {
        user: demoUsers[5],
        role: 'member',
        joinedAt: new Date('2024-01-12'),
      },
      {
        user: demoUsers[7],
        role: 'member',
        joinedAt: new Date('2024-01-18'),
      },
    ],
    createdAt: new Date('2024-01-10'),
    isPrivate: false,
    unreadCount: 1,
  },
  {
    id: 'group-3',
    name: 'Project Alpha',
    description: 'Core development team for Project Alpha',
    avatar: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=150&h=150&fit=crop',
    members: [
      {
        user: demoUsers[0],
        role: 'admin',
        joinedAt: new Date('2024-01-05'),
      },
      {
        user: demoUsers[1],
        role: 'moderator',
        joinedAt: new Date('2024-01-08'),
      },
      {
        user: demoUsers[2],
        role: 'member',
        joinedAt: new Date('2024-01-10'),
      },
      {
        user: demoUsers[3],
        role: 'member',
        joinedAt: new Date('2024-01-12'),
      },
      {
        user: demoUsers[6],
        role: 'member',
        joinedAt: new Date('2024-01-15'),
      },
    ],
    createdAt: new Date('2024-01-05'),
    isPrivate: true,
    unreadCount: 0,
  },
  {
    id: 'group-4',
    name: 'General Chat',
    description: 'Company-wide announcements and general discussions',
    avatar: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=150&h=150&fit=crop',
    members: demoUsers.map(user => ({
      user,
      role: 'member' as const,
      joinedAt: new Date('2024-01-01'),
    })),
    createdAt: new Date('2024-01-01'),
    isPrivate: false,
    unreadCount: 12,
  },
];

// Demo Messages
export const demoMessages: { [key: string]: Message[] } = {
  'group-1': [
    {
      id: 'msg-1',
      content: 'Hey team! Ready for the sprint planning?',
      sender: demoUsers[0],
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: 'text',
      status: 'read',
    },
    {
      id: 'msg-2',
      content: 'Absolutely! I\'ve prepared the user stories.',
      sender: demoUsers[1],
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000),
      type: 'text',
      status: 'read',
    },
    {
      id: 'msg-3',
      content: 'Great! Let\'s discuss the new design system implementation.',
      sender: demoUsers[2],
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 10 * 60 * 1000),
      type: 'text',
      status: 'read',
    },
    {
      id: 'msg-4',
      content: 'I\'ve uploaded the latest mockups for review.',
      sender: demoUsers[5],
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      type: 'text',
      status: 'read',
    },
    {
      id: 'msg-5',
      content: 'Perfect! The new components look amazing 🎨',
      sender: demoUsers[0],
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      type: 'text',
      status: 'read',
    },
    {
      id: 'msg-6',
      content: 'Can we add dark mode support to the button component?',
      sender: demoUsers[1],
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      type: 'text',
      status: 'read',
    },
    {
      id: 'msg-7',
      content: 'Good idea! I\'ll work on that today.',
      sender: demoUsers[0],
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      type: 'text',
      status: 'sent',
    },
  ],
  'group-2': [
    {
      id: 'msg-8',
      content: 'Good morning everyone! Ready for today\'s design review?',
      sender: demoUsers[1],
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      type: 'text',
      status: 'read',
    },
    {
      id: 'msg-9',
      content: 'Yes! I have the dashboard mockups ready.',
      sender: demoUsers[3],
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000 + 5 * 60 * 1000),
      type: 'text',
      status: 'read',
    },
    {
      id: 'msg-10',
      content: 'The user feedback has been incorporated. Much better UX!',
      sender: demoUsers[7],
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: 'text',
      status: 'read',
    },
  ],
  'private-1-2': [
    {
      id: 'msg-11',
      content: 'Hey Sarah, how\'s the new project coming along?',
      sender: demoUsers[0],
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      type: 'text',
      status: 'read',
    },
    {
      id: 'msg-12',
      content: 'Going great! Just finished the API integration.',
      sender: demoUsers[1],
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000 + 10 * 60 * 1000),
      type: 'text',
      status: 'read',
    },
    {
      id: 'msg-13',
      content: 'That\'s awesome! Want to sync up tomorrow?',
      sender: demoUsers[0],
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: 'text',
      status: 'read',
    },
    {
      id: 'msg-14',
      content: 'Sounds perfect! How about 10 AM?',
      sender: demoUsers[1],
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 15 * 60 * 1000),
      type: 'text',
      status: 'read',
    },
  ],
  'private-1-3': [
    {
      id: 'msg-15',
      content: 'Mike! Great work on the authentication module.',
      sender: demoUsers[0],
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      type: 'text',
      status: 'read',
    },
    {
      id: 'msg-16',
      content: 'Thanks Alex! The security audit went well too.',
      sender: demoUsers[2],
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000 + 20 * 60 * 1000),
      type: 'text',
      status: 'read',
    },
  ],
};

// Demo Chats
export const demoChats: Chat[] = [
  // Group Chats
  ...demoGroups.map(group => ({
    id: group.id,
    type: 'group' as const,
    name: group.name,
    participants: group.members.map(member => member.user),
    messages: demoMessages[group.id] || [],
    lastMessage: demoMessages[group.id]?.[demoMessages[group.id].length - 1],
    unreadCount: group.unreadCount,
    createdAt: group.createdAt,
    updatedAt: new Date(),
  })),
  // Private Chats
  {
    id: 'private-1-2',
    type: 'private' as const,
    name: 'Sarah Chen',
    participants: [demoUsers[0], demoUsers[1]],
    messages: demoMessages['private-1-2'] || [],
    lastMessage: demoMessages['private-1-2']?.[demoMessages['private-1-2'].length - 1],
    unreadCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'private-1-3',
    type: 'private' as const,
    name: 'Mike Rodriguez',
    participants: [demoUsers[0], demoUsers[2]],
    messages: demoMessages['private-1-3'] || [],
    lastMessage: demoMessages['private-1-3']?.[demoMessages['private-1-3'].length - 1],
    unreadCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'private-1-4',
    type: 'private' as const,
    name: 'Emily Davis',
    participants: [demoUsers[0], demoUsers[3]],
    messages: [],
    unreadCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Demo Notifications
export const demoNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'message',
    title: 'New message',
    message: 'Sarah Chen sent a message in Frontend Team',
    user: demoUsers[1],
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    isRead: false,
    actionUrl: '/chat/group-1',
  },
  {
    id: 'notif-2',
    type: 'mention',
    title: 'You were mentioned',
    message: 'Mike Rodriguez mentioned you in Project Alpha',
    user: demoUsers[2],
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    isRead: false,
    actionUrl: '/chat/group-3',
  },
  {
    id: 'notif-3',
    type: 'group_invite',
    title: 'Group invitation',
    message: 'Emily Davis invited you to join Design Review',
    user: demoUsers[3],
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isRead: true,
    actionUrl: '/groups/group-2',
  },
  {
    id: 'notif-4',
    type: 'system',
    title: 'System notification',
    message: 'Platform maintenance scheduled for tonight',
    user: demoUsers[0],
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    isRead: true,
  },
];

// Demo Call Participants
export const demoCallParticipants: CallParticipant[] = [
  {
    user: demoUsers[0],
    isVideoEnabled: true,
    isAudioEnabled: true,
    isScreenSharing: false,
    isConnected: true,
  },
  {
    user: demoUsers[1],
    isVideoEnabled: true,
    isAudioEnabled: false,
    isScreenSharing: false,
    isConnected: true,
  },
  {
    user: demoUsers[2],
    isVideoEnabled: false,
    isAudioEnabled: true,
    isScreenSharing: false,
    isConnected: true,
  },
  {
    user: demoUsers[3],
    isVideoEnabled: true,
    isAudioEnabled: true,
    isScreenSharing: true,
    isConnected: true,
  },
];