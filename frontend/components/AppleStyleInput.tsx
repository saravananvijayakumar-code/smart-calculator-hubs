// @ts-nocheck
import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface AppleStyleInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  suffix?: string;
  prefix?: string;
  large?: boolean;
}

export const AppleStyleInput = forwardRef<HTMLInputElement, AppleStyleInputProps>(
  ({ className, label, error, helperText, suffix, prefix, large = false, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <div className="relative">
          {prefix && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground select-none">
              {prefix}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full border border-border bg-background rounded-xl transition-all duration-200",
              "focus:ring-2 focus:ring-primary/20 focus:border-primary",
              "placeholder:text-muted-foreground/60",
              large ? "px-6 py-4 text-lg" : "px-4 py-3",
              prefix && (large ? "pl-12" : "pl-10"),
              suffix && (large ? "pr-12" : "pr-10"),
              error && "border-red-500 focus:ring-red-500/20 focus:border-red-500",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              className
            )}
            {...props}
          />
          {suffix && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground select-none">
              {suffix}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  }
);

AppleStyleInput.displayName = "AppleStyleInput";