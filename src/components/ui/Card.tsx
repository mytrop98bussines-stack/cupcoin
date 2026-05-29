import type { ReactNode, HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

export const Card = ({
  children,
  padding = 'md',
  hoverable = false,
  className,
  ...props
}: CardProps) => {
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-5',
  };

  return (
    <div
      className={cn(
        'bg-surface-800/80 backdrop-blur-sm border border-surface-700/50 rounded-2xl',
        paddings[padding],
        hoverable && 'hover:border-surface-700 hover:bg-surface-800 transition-all duration-200 cursor-pointer active:scale-[0.99]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
