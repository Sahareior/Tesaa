import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
  count?: number;
}

export function Skeleton({
  className,
  width,
  height,
  rounded = false,
  count = 1,
}: SkeletonProps) {
  const baseClasses = [
    'bg-gray-200 dark:bg-gray-700 animate-pulse',
    rounded ? 'rounded-full' : 'rounded',
  ];

  const skeletons = Array.from({ length: count }, (_, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.1 }}
      className={cn(baseClasses, className)}
      style={{
        width: width,
        height: height,
      }}
    />
  ));

  if (count === 1) {
    return skeletons[0];
  }

  return <div className="space-y-2">{skeletons}</div>;
}

// Specific skeleton components for common use cases
export function ChatMessageSkeleton() {
  return (
    <div className="flex gap-3 p-4">
      <Skeleton width={40} height={40} rounded />
      <div className="flex-1 space-y-2">
        <Skeleton width={100} height={12} />
        <Skeleton width="80%" height={16} />
        <Skeleton width="60%" height={16} />
      </div>
    </div>
  );
}

export function UserListSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3">
      <Skeleton width={40} height={40} rounded />
      <div className="flex-1">
        <Skeleton width="60%" height={16} />
        <Skeleton width="40%" height={12} />
      </div>
    </div>
  );
}

export function GroupCardSkeleton() {
  return (
    <div className="bg-bg-surface dark:bg-dark-bg-surface rounded-lg p-6 border border-border-subtle dark:border-dark-border-subtle">
      <div className="flex items-center gap-4">
        <Skeleton width={48} height={48} rounded />
        <div className="flex-1">
          <Skeleton width="70%" height={20} />
          <Skeleton width="50%" height={14} />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton width="100%" height={12} />
        <Skeleton width="80%" height={12} />
      </div>
    </div>
  );
}

export function MeetingParticipantsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg">
          <div className="absolute bottom-2 left-2">
            <Skeleton width={80} height={20} rounded />
          </div>
        </div>
      ))}
    </div>
  );
}

export function FileListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index} className="flex items-center gap-3 p-3">
          <Skeleton width={40} height={40} rounded />
          <div className="flex-1">
            <Skeleton width="70%" height={16} />
            <Skeleton width="40%" height={12} />
          </div>
          <Skeleton width={60} height={12} />
        </div>
      ))}
    </div>
  );
}

export function NotificationSkeleton() {
  return (
    <div className="flex gap-3 p-4">
      <Skeleton width={32} height={32} rounded />
      <div className="flex-1">
        <Skeleton width="80%" height={16} />
        <Skeleton width="60%" height={14} />
        <Skeleton width="40%" height={12} />
      </div>
    </div>
  );
}

export function MessageInputSkeleton() {
  return (
    <div className="flex items-center gap-2 p-4">
      <Skeleton width={40} height={40} rounded />
      <Skeleton width="60%" height={44} />
      <Skeleton width={44} height={44} rounded />
      <Skeleton width={44} height={44} rounded />
      <Skeleton width={44} height={44} rounded />
    </div>
  );
}

export function ContactListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 8 }, (_, index) => (
        <div key={index} className="flex items-center gap-3 p-3">
          <Skeleton width={48} height={48} rounded />
          <div className="flex-1">
            <Skeleton width="60%" height={16} />
            <Skeleton width="40%" height={14} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SettingsFormSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton width={120} height={20} className="mb-2" />
        <Skeleton width="100%" height={44} />
      </div>
      <div>
        <Skeleton width={120} height={20} className="mb-2" />
        <Skeleton width="100%" height={44} />
      </div>
      <div>
        <Skeleton width={120} height={20} className="mb-2" />
        <Skeleton width="100%" height={100} />
      </div>
      <div className="flex gap-3">
        <Skeleton width={100} height={44} />
        <Skeleton width={100} height={44} />
      </div>
    </div>
  );
}