import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  color?: 'primary' | 'secondary' | 'white';
}

const sizes = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

const colors = {
  primary: 'text-primary-500',
  secondary: 'text-text-secondary',
  white: 'text-white',
};

export function SpinnerLoader({ size = 'md', className, color = 'primary' }: LoaderProps) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      }}
      className={cn(
        'border-2 border-current border-t-transparent rounded-full',
        sizes[size],
        colors[color],
        className
      )}
    />
  );
}

interface DotsLoaderProps {
  className?: string;
  color?: 'primary' | 'secondary' | 'white';
}

export function DotsLoader({ className, color = 'primary' }: DotsLoaderProps) {
  const dotVariants = {
    initial: { scale: 0.8, opacity: 0.6 },
    animate: { scale: 1, opacity: 1 },
  };

  const dotTransition = {
    duration: 0.6,
    repeat: Infinity,
    repeatType: 'reverse' as const,
    ease: 'easeInOut',
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          variants={dotVariants}
          initial="initial"
          animate="animate"
          transition={{
            ...dotTransition,
            delay: index * 0.1,
          }}
          className={cn(
            'w-2 h-2 rounded-full',
            color === 'primary' && 'bg-primary-500',
            color === 'secondary' && 'bg-text-secondary',
            color === 'white' && 'bg-white'
          )}
        />
      ))}
    </div>
  );
}

interface PulseLoaderProps {
  className?: string;
  color?: 'primary' | 'secondary' | 'white';
}

export function PulseLoader({ className, color = 'primary' }: PulseLoaderProps) {
  return (
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        opacity: [1, 0.7, 1],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={cn(
        'rounded-full',
        color === 'primary' && 'bg-primary-500',
        color === 'secondary' && 'bg-text-secondary',
        color === 'white' && 'bg-white',
        'w-8 h-8',
        className
      )}
    />
  );
}

interface BarLoaderProps {
  className?: string;
  color?: 'primary' | 'secondary' | 'white';
}

export function BarLoader({ className, color = 'primary' }: BarLoaderProps) {
  return (
    <motion.div
      className={cn(
        'h-1 w-full rounded-full overflow-hidden',
        className
      )}
    >
      <motion.div
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={cn(
          'h-full rounded-full',
          color === 'primary' && 'bg-primary-500',
          color === 'secondary' && 'bg-text-secondary',
          color === 'white' && 'bg-white'
        )}
        style={{
          width: '40%',
        }}
      />
    </motion.div>
  );
}

// Loading overlay for full-screen loading states
interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  className?: string;
}

export function LoadingOverlay({ isVisible, message, className }: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm',
        className
      )}
    >
      <div className="bg-bg-surface dark:bg-dark-bg-surface rounded-lg p-8 shadow-lg border border-border-subtle dark:border-dark-border-subtle">
        <div className="flex flex-col items-center gap-4">
          <SpinnerLoader size="lg" />
          {message && (
            <p className="text-text-primary dark:text-dark-text-primary text-sm">
              {message}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Inline loading state for buttons and small components
interface InlineLoaderProps {
  className?: string;
}

export function InlineLoader({ className }: InlineLoaderProps) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      }}
      className={cn(
        'w-4 h-4 border-2 border-current border-t-transparent rounded-full',
        className
      )}
    />
  );
}

// Page loading state
interface PageLoaderProps {
  message?: string;
}

export function PageLoader({ message = 'Loading...' }: PageLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="w-12 h-12 rounded-full bg-primary-500/20 border-2 border-primary-500"
      />
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-text-secondary dark:text-dark-text-secondary text-sm"
      >
        {message}
      </motion.p>
    </div>
  );
}