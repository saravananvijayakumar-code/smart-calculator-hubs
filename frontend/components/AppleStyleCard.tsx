// @ts-nocheck
import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface AppleStyleCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const AppleStyleCard = forwardRef<HTMLDivElement, AppleStyleCardProps>(
  ({ className, variant = 'default', padding = 'md', children, ...props }, ref) => {
    const variants = {
      default: "bg-card text-card-foreground border border-border",
      elevated: "bg-card text-card-foreground shadow-lg border border-border/50",
      outlined: "bg-background text-foreground border-2 border-border"
    };
    
    const paddings = {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8"
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl transition-all duration-200",
          variants[variant],
          paddings[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

AppleStyleCard.displayName = "AppleStyleCard";

interface AppleStyleCardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
}

export const AppleStyleCardHeader = forwardRef<HTMLDivElement, AppleStyleCardHeaderProps>(
  ({ className, title, subtitle, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("space-y-2 mb-6", className)}
        {...props}
      >
        {title && <h3 className="text-xl font-semibold leading-none tracking-tight">{title}</h3>}
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        {children}
      </div>
    );
  }
);

AppleStyleCardHeader.displayName = "AppleStyleCardHeader";