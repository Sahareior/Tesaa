// User and Authentication Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  lastSeen?: Date;
  isTyping?: boolean;
}

// Group Types
export interface Group {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  members: GroupMember[];
  createdAt: Date;
  isPrivate: boolean;
  unreadCount: number;
  lastMessage?: Message;
}

// Group Member Types
export interface GroupMember {
  user: User;
  role: 'admin' | 'moderator' | 'member';
  joinedAt: Date;
}

// Message Types
export interface Message {
  id: string;
  content: string;
  sender: User;
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'audio' | 'video';
  status: 'sending' | 'sent' | 'delivered' | 'read';
  replyTo?: string;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: 'image' | 'file' | 'audio' | 'video';
  url: string;
  thumbnail?: string;
}

// Chat Types
export interface Chat {
  id: string;
  type: 'group' | 'private';
  name: string;
  participants: User[];
  messages: Message[];
  lastMessage?: Message;
  unreadCount: number;
  isTyping?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'message' | 'mention' | 'group_invite' | 'friend_request' | 'system';
  title: string;
  message: string;
  user: User;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
}

// Call Types
export interface CallParticipant {
  user: User;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isScreenSharing: boolean;
  isConnected: boolean;
}

export interface Call {
  id: string;
  type: 'audio' | 'video';
  participants: CallParticipant[];
  startedAt: Date;
  duration: number;
  isGroupCall: boolean;
  groupId?: string;
}

// File Upload Types
export interface FileUpload {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: 'uploading' | 'completed' | 'failed';
  url?: string;
  error?: string;
}

// Theme Types
export type Theme = 'light' | 'dark';

// App State Types
export interface AppState {
  currentUser: User | null;
  isAuthenticated: boolean;
  theme: Theme;
  isLoading: boolean;
  sidebarCollapsed: boolean;
  currentChat: string | null;
  notifications: Notification[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface CreateGroupForm {
  name: string;
  description: string;
  isPrivate: boolean;
  memberIds: string[];
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps extends BaseComponentProps {
  type?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  error?: string;
  icon?: React.ReactNode;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

// Navigation Types
export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
  children?: NavigationItem[];
}

// Modal Types
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

// Dropdown Types
export interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  action: () => void;
  disabled?: boolean;
  danger?: boolean;
}

export interface DropdownProps extends BaseComponentProps {
  items: DropdownItem[];
  trigger: React.ReactNode;
  align?: 'left' | 'right';
  width?: string;
}

// Loading States
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

// Error States
export interface ErrorState {
  hasError: boolean;
  message: string;
  code?: string;
}