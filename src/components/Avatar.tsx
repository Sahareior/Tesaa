import React from 'react';
import { motion } from 'framer-motion';
import { cn, generateInitials, generateAvatarUrl } from '@/utils';
import { User } from '@/types';

interface AvatarProps {
  user?: User;
  src?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  status?: 'online' | 'offline' | 'away' | 'busy';
  showStatus?: boolean;
  className?: string;
  onClick?: () => void;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
  '2xl': 'w-20 h-20 text-2xl',
};

const statusColors = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  away: 'bg-yellow-500',
  busy: 'bg-red-500',
};

const statusSizeClasses = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
  xl: 'w-4 h-4',
  '2xl': 'w-5 h-5',
};

export function Avatar({
  user,
  src,
  name,
  size = 'md',
  status,
  showStatus = false,
  className,
  onClick,
}: AvatarProps) {
  const avatarSrc = src || (user?.avatar ?? (name ? generateAvatarUrl(name) : ''));
  const displayName = name || user?.name || 'Unknown User';
  const initials = generateInitials(displayName);
  const isClickable = !!onClick;

  const avatarContent = (
    <>
      {avatarSrc ? (
        <img
          src={avatarSrc}
          alt={displayName}
          className={cn(
            'w-full h-full object-cover rounded-full',
            isClickable && 'transition-transform duration-200 hover:scale-105'
          )}
          onError={(e) => {
            // Fallback to initials if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              const fallback = document.createElement('div');
              fallback.className = cn(
                'w-full h-full rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold',
                sizeClasses[size]
              );
              fallback.textContent = initials;
              parent.appendChild(fallback);
            }
          }}
        />
      ) : (
        <div className={cn(
          'w-full h-full rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold',
          sizeClasses[size]
        )}>
          {initials}
        </div>
      )}
      
      {showStatus && status && (
        <div className={cn(
          'absolute bottom-0 right-0 rounded-full ring-2 ring-bg-surface dark:ring-dark-bg-surface',
          statusColors[status],
          statusSizeClasses[size]
        )} />
      )}
    </>
  );

  if (isClickable) {
    return (
      <motion.button
        type="button"
        onClick={onClick}
        className={cn(
          'relative inline-flex items-center justify-center rounded-full',
          sizeClasses[size],
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          className
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        {avatarContent}
      </motion.button>
    );
  }

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-full',
        sizeClasses[size],
        className
      )}
    >
      {avatarContent}
    </div>
  );
}