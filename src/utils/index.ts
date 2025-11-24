import { clsx, type ClassValue } from 'clsx';
import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns';
import { User, Message, Group } from '@/types';

// Utility for combining class names
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Date formatting utilities
export const formatMessageTime = (date: Date): string => {
  if (isToday(date)) {
    return format(date, 'HH:mm');
  } else if (isYesterday(date)) {
    return 'Yesterday';
  } else {
    return format(date, 'MMM d');
  }
};

export const formatRelativeTime = (date: Date): string => {
  return formatDistanceToNow(date, { addSuffix: true });
};

export const formatDate = (date: Date): string => {
  return format(date, 'MMMM d, yyyy');
};

// File size formatting
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Text utilities
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const generateInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Avatar utilities
export const generateAvatarUrl = (name: string, seed?: string): string => {
  const initials = generateInitials(name);
  const hash = (name + seed).split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${Math.abs(hash % 16777215).toString(16).padStart(6, '0')}&color=ffffff&size=150`;
};

// Message utilities
export const getMessageSenderName = (message: Message): string => {
  return message.sender.name;
};

export const isMessageFromCurrentUser = (message: Message, currentUserId?: string): boolean => {
  // This would typically use the current user from auth store
  // For demo purposes, we'll check if it's from Alex Johnson
  return message.sender.name === 'Alex Johnson';
};

// Group utilities
export const getGroupDisplayName = (group: Group): string => {
  return group.name;
};

export const getGroupAvatar = (group: Group): string => {
  return group.avatar || generateAvatarUrl(group.name);
};

export const getGroupMemberCount = (group: Group): number => {
  return group.members.length;
};

// Validation utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

// URL utilities
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

export const isVideoFile = (file: File): boolean => {
  return file.type.startsWith('video/');
};

export const isAudioFile = (file: File): boolean => {
  return file.type.startsWith('audio/');
};

export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

// Search utilities
export const searchUsers = (users: User[], query: string): User[] => {
  const lowercaseQuery = query.toLowerCase();
  return users.filter(user => 
    user.name.toLowerCase().includes(lowercaseQuery) ||
    user.email.toLowerCase().includes(lowercaseQuery)
  );
};

export const searchMessages = (messages: Message[], query: string): Message[] => {
  const lowercaseQuery = query.toLowerCase();
  return messages.filter(message =>
    message.content.toLowerCase().includes(lowercaseQuery)
  );
};

export const searchGroups = (groups: Group[], query: string): Group[] => {
  const lowercaseQuery = query.toLowerCase();
  return groups.filter(group =>
    group.name.toLowerCase().includes(lowercaseQuery) ||
    group.description?.toLowerCase().includes(lowercaseQuery)
  );
};

// Theme utilities
export const getThemeIcon = (theme: 'light' | 'dark') => {
  return theme === 'light' ? '🌙' : '☀️';
};

// Status utilities
export const getStatusColor = (status: User['status']): string => {
  switch (status) {
    case 'online':
      return 'bg-green-500';
    case 'away':
      return 'bg-yellow-500';
    case 'busy':
      return 'bg-red-500';
    case 'offline':
      return 'bg-gray-400';
    default:
      return 'bg-gray-400';
  }
};

export const getStatusText = (status: User['status']): string => {
  switch (status) {
    case 'online':
      return 'Online';
    case 'away':
      return 'Away';
    case 'busy':
      return 'Busy';
    case 'offline':
      return 'Offline';
    default:
      return 'Unknown';
  }
};

// Animation utilities
export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const slideUpVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export const scaleInVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
};

// Local storage utilities
export const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
};

export const setToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
  }
};

export const removeFromStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage key "${key}":`, error);
  }
};

// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

// Color utilities
export const generateRandomColor = (): string => {
  const colors = [
    '#3B82F6', // blue
    '#10B981', // emerald
    '#F59E0B', // amber
    '#EF4444', // red
    '#8B5CF6', // violet
    '#06B6D4', // cyan
    '#84CC16', // lime
    '#F97316', // orange
    '#EC4899', // pink
    '#6366F1', // indigo
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
};

// Scroll utilities
export const scrollToBottom = (element: HTMLElement, smooth = true): void => {
  element.scrollTo({
    top: element.scrollHeight,
    behavior: smooth ? 'smooth' : 'auto',
  });
};

export const isScrolledToBottom = (element: HTMLElement, threshold = 100): boolean => {
  return element.scrollHeight - element.scrollTop - element.clientHeight < threshold;
};

// Keyboard shortcuts
export const handleKeyboardShortcut = (
  event: KeyboardEvent,
  callback: () => void,
  keys: string[]
): boolean => {
  const pressedKeys = [];
  
  if (event.ctrlKey || event.metaKey) pressedKeys.push('ctrl');
  if (event.shiftKey) pressedKeys.push('shift');
  if (event.altKey) pressedKeys.push('alt');
  
  pressedKeys.push(event.key.toLowerCase());
  
  const requiredKeys = keys.map(k => k.toLowerCase());
  
  if (pressedKeys.length === requiredKeys.length && 
      requiredKeys.every(key => pressedKeys.includes(key))) {
    callback();
    event.preventDefault();
    return true;
  }
  
  return false;
};

// Error handling
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unknown error occurred';
};