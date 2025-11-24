import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Chat, Group, Notification, Theme } from '@/types';
import { demoUsers, demoGroups, demoChats, demoNotifications } from '@/data/demoData';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Demo login - accept any email/password
        const user = demoUsers[0]; // Default to Alex Johnson
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
        
        return true;
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Create new user
        const newUser: User = {
          id: `user-${Date.now()}`,
          name,
          email,
          avatar: `https://images.unsplash.com/photo-1${Math.floor(Math.random() * 9)}?w=150&h=150&fit=crop&crop=face`,
          status: 'online',
        };
        
        set({
          user: newUser,
          isAuthenticated: true,
          isLoading: false,
        });
        
        return true;
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

interface ChatState {
  chats: Chat[];
  currentChat: string | null;
  groups: Group[];
  notifications: Notification[];
  isTyping: { [chatId: string]: boolean };
  
  // Chat actions
  setCurrentChat: (chatId: string | null) => void;
  sendMessage: (chatId: string, content: string, type?: 'text' | 'image' | 'file') => void;
  markAsRead: (chatId: string) => void;
  setTyping: (chatId: string, isTyping: boolean) => void;
  
  // Group actions
  createGroup: (name: string, description: string, memberIds: string[]) => void;
  joinGroup: (groupId: string) => void;
  leaveGroup: (groupId: string) => void;
  
  // Notification actions
  markNotificationAsRead: (notificationId: string) => void;
  clearAllNotifications: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  chats: demoChats,
  currentChat: null,
  groups: demoGroups,
  notifications: demoNotifications,
  isTyping: {},

  setCurrentChat: (chatId: string | null) => {
    set({ currentChat: chatId });
    
    // Mark as read when opening chat
    if (chatId) {
      get().markAsRead(chatId);
    }
  },

  sendMessage: (chatId: string, content: string, type = 'text') => {
    const { chats } = get();
    const { user } = useAuthStore.getState();
    
    if (!user) return;

    const newMessage = {
      id: `msg-${Date.now()}`,
      content,
      sender: user,
      timestamp: new Date(),
      type,
      status: 'sending' as const,
    };

    const updatedChats = chats.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastMessage: newMessage,
          updatedAt: new Date(),
        };
      }
      return chat;
    });

    set({ chats: updatedChats });

    // Simulate message sending
    setTimeout(() => {
      const finalChats = get().chats.map(chat => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: chat.messages.map(msg => 
              msg.id === newMessage.id 
                ? { ...msg, status: 'sent' as const }
                : msg
            ),
          };
        }
        return chat;
      });
      set({ chats: finalChats });
    }, 500);
  },

  markAsRead: (chatId: string) => {
    const { chats } = get();
    const updatedChats = chats.map(chat =>
      chat.id === chatId
        ? { ...chat, unreadCount: 0 }
        : chat
    );
    set({ chats: updatedChats });
  },

  setTyping: (chatId: string, isTyping: boolean) => {
    set(state => ({
      isTyping: {
        ...state.isTyping,
        [chatId]: isTyping,
      },
    }));
  },

  createGroup: (name: string, description: string, memberIds: string[]) => {
    const { groups, user } = get();
    const { user: currentUser } = useAuthStore.getState();
    
    if (!currentUser) return;

    const members = memberIds
      .map(id => demoUsers.find(u => u.id === id))
      .filter(Boolean)
      .map(user => ({
        user: user!,
        role: 'member' as const,
        joinedAt: new Date(),
      }));

    // Add current user as admin
    members.unshift({
      user: currentUser,
      role: 'admin',
      joinedAt: new Date(),
    });

    const newGroup: Group = {
      id: `group-${Date.now()}`,
      name,
      description,
      members,
      createdAt: new Date(),
      isPrivate: false,
      unreadCount: 0,
    };

    set({ groups: [...groups, newGroup] });
  },

  joinGroup: (groupId: string) => {
    const { groups, user } = get();
    const { user: currentUser } = useAuthStore.getState();
    
    if (!currentUser) return;

    const updatedGroups = groups.map(group =>
      group.id === groupId
        ? {
            ...group,
            members: [
              ...group.members,
              {
                user: currentUser,
                role: 'member' as const,
                joinedAt: new Date(),
              },
            ],
          }
        : group
    );

    set({ groups: updatedGroups });
  },

  leaveGroup: (groupId: string) => {
    const { groups, user } = get();
    const { user: currentUser } = useAuthStore.getState();
    
    if (!currentUser) return;

    const updatedGroups = groups.map(group =>
      group.id === groupId
        ? {
            ...group,
            members: group.members.filter(member => member.user.id !== currentUser.id),
          }
        : group
    );

    set({ groups: updatedGroups });
  },

  markNotificationAsRead: (notificationId: string) => {
    const { notifications } = get();
    const updatedNotifications = notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, isRead: true }
        : notification
    );
    set({ notifications: updatedNotifications });
  },

  clearAllNotifications: () => {
    set({ notifications: [] });
  },
}));

interface AppState {
  theme: Theme;
  sidebarCollapsed: boolean;
  isLoading: boolean;
  
  // Theme actions
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  
  // UI actions
  setSidebarCollapsed: (collapsed: boolean) => void;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      sidebarCollapsed: false,
      isLoading: false,

      setTheme: (theme: Theme) => {
        set({ theme });
        
        // Apply theme to document
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      toggleTheme: () => {
        const { theme } = get();
        get().setTheme(theme === 'light' ? 'dark' : 'light');
      },

      setSidebarCollapsed: (collapsed: boolean) => {
        set({ sidebarCollapsed: collapsed });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({ theme: state.theme }),
      onRehydrateStorage: () => (state) => {
        // Apply theme on app load
        if (state?.theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
    }
  )
);