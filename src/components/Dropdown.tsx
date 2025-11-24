import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils';
import { DropdownProps } from '@/types';

const dropdownVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: -8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -8,
    transition: {
      duration: 0.15,
      ease: [0.4, 0, 1, 1],
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -8 },
};

export function Dropdown({
  items,
  trigger,
  align = 'left',
  width = 'w-48',
  className,
}: DropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleItemClick = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  const alignmentClasses = {
    left: 'left-0',
    right: 'right-0',
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center"
      >
        {trigger}
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              'absolute top-full mt-2 z-50 bg-bg-surface dark:bg-dark-bg-surface border border-border-subtle dark:border-dark-border-subtle rounded-lg shadow-lg py-2',
              width,
              alignmentClasses[align],
              className
            )}
          >
            {items.map((item, index) => (
              <motion.button
                key={item.id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ delay: index * 0.05 }}
                onClick={() => handleItemClick(item.action)}
                disabled={item.disabled}
                className={cn(
                  'w-full px-4 py-2 text-left text-sm text-text-primary dark:text-dark-text-primary hover:bg-bg-page dark:hover:bg-dark-bg-page transition-colors duration-150',
                  'flex items-center gap-3',
                  item.disabled && 'opacity-50 cursor-not-allowed',
                  item.danger && 'text-error hover:bg-red-50 dark:hover:bg-red-900/20'
                )}
              >
                {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                {item.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}