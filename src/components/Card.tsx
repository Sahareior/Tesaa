import React from 'react';
import { motion, MotionProps } from 'framer-motion';

interface CardProps extends React.HTMLAttributes<HTMLDivElement>, MotionProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outline';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export function Card({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  hover = false,
  ...props
}: CardProps) {
  const variantClasses = {
    default: 'bg-bg-surface dark:bg-dark-bg-surface border border-border-subtle dark:border-dark-border-subtle',
    elevated: 'bg-bg-surface dark:bg-dark-bg-surface border border-border-subtle dark:border-dark-border-subtle shadow-md dark:shadow-lg',
    outline: 'bg-transparent border-2 border-border-subtle dark:border-dark-border-subtle'
  };

  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8'
  };

  const hoverClasses = hover
    ? 'transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer'
    : '';

  return (
    <motion.div
      className={`rounded-lg ${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}