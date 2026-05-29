import type { InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = ({
  label,
  error,
  hint,
  className,
  id,
  ...props
}: InputProps) => {
  const inputId = id || label?.toLowerCase().replace(/\s/g, '-');

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-surface-200"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'w-full bg-surface-800 border border-surface-700 rounded-xl px-4 py-3',
          'text-white placeholder:text-surface-200/40 text-base',
          'focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500',
          'transition-all duration-200',
          error && 'border-red-500 focus:ring-red-500/50',
          className
        )}
        {...props}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      {hint && !error && (
        <p className="text-surface-200/50 text-xs mt-1">{hint}</p>
      )}
    </div>
  );
};
