// Global JSX namespace for intrinsic elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// Shadcn/ui component prop extensions
declare module '@/components/ui/tabs' {
  export interface TabsProps {
    defaultValue?: string;
    className?: string;
    children?: React.ReactNode;
  }
  export interface TabsListProps {
    className?: string;
    children?: React.ReactNode;
  }
  export interface TabsTriggerProps {
    value: string;
    className?: string;
    children?: React.ReactNode;
  }
  export interface TabsContentProps {
    value: string;
    className?: string;
    children?: React.ReactNode;
  }
}

declare module '@/components/ui/label' {
  export interface LabelProps {
    htmlFor?: string;
    className?: string;
    children?: React.ReactNode;
  }
}

declare module '@/components/ui/select' {
  export interface SelectTriggerProps {
    className?: string;
    size?: 'default' | 'sm';
    children?: React.ReactNode;
  }
}

declare module '@/components/ui/dialog' {
  export interface DialogTriggerProps {
    asChild?: boolean;
    className?: string;
    children?: React.ReactNode;
  }
  export interface DialogTitleProps {
    className?: string;
    children?: React.ReactNode;
  }
}

declare module '@/components/ui/dropdown-menu' {
  export interface DropdownMenuTriggerProps {
    asChild?: boolean;
    className?: string;
    children?: React.ReactNode;
  }
  export interface DropdownMenuItemProps {
    asChild?: boolean;
    inset?: boolean;
    variant?: 'default' | 'destructive';
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    children?: React.ReactNode;
  }
}

declare module '@/components/ui/scroll-area' {
  export interface ScrollAreaProps {
    className?: string;
    children?: React.ReactNode;
  }
}

declare module '@/components/ui/progress' {
  export interface ProgressProps {
    value?: number;
    className?: string;
  }
}

export {};
