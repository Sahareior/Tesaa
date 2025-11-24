import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils';
import { ButtonProps } from '@/types';

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', disabled, loading, children, onClick, type = 'button', ...props }, ref) => {
    const baseStyles = [
      'inline-flex items-center justify-center rounded-md font-semibold transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
    ];

    const variants = {
      primary: [
        'bg-primary-500 text-white',
        'hover:bg-primary-700 hover:scale-102',
        'active:scale-98 focus:ring-primary-500',
      ],
      secondary: [
        'bg-text-primary text-white',
        'hover:bg-text-secondary hover:scale-102',
        'active:scale-98 focus:ring-text-primary',
      ],
      outline: [
        'border border-border-subtle bg-transparent text-text-primary',
        'hover:bg-bg-surface hover:scale-102',
        'active:scale-98 focus:ring-border-subtle dark:border-dark-border-subtle dark:hover:bg-dark-bg-surface',
      ],
      ghost: [
        'bg-transparent text-text-primary',
        'hover:bg-bg-surface hover:scale-102',
        'active:scale-98 focus:ring-border-subtle dark:hover:bg-dark-bg-surface',
      ],
    };

    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-11 px-4 text-base',
      lg: 'h-12 px-6 text-lg',
    };

    return (
      <motion.button
        ref={ref}
        type={type}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          loading && 'cursor-wait',
          className
        )}
        disabled={disabled || loading}
        onClick={onClick}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export { Button };