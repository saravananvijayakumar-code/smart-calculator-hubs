// Type overrides to fix shadcn/ui component compatibility issues
declare module '@/components/ui/*' {
  import type {  ComponentPropsWithoutRef, ElementRef } from 'react';
  
  // Allow all HTML attributes on all components
  export interface TabsProps extends ComponentPropsWithoutRef<'div'> {}
  export interface TabsListProps extends ComponentPropsWithoutRef<'div'> {}
  export interface TabsTriggerProps extends ComponentPropsWithoutRef<'button'> {}
  export interface TabsContentProps extends ComponentPropsWithoutRef<'div'> {}
  export interface DialogTriggerProps extends ComponentPropsWithoutRef<'button'> {}
  export interface DialogTitleProps extends ComponentPropsWithoutRef<'h2'> {}
  export interface DropdownMenuTriggerProps extends ComponentPropsWithoutRef<'button'> {}
  export interface DropdownMenuItemProps extends ComponentPropsWithoutRef<'div'> {}
  export interface SelectTriggerProps extends ComponentPropsWithoutRef<'button'> {}
  export interface ScrollAreaProps extends ComponentPropsWithoutRef<'div'> {}
  export interface LabelProps extends ComponentPropsWithoutRef<'label'> {}
  export interface ProgressProps extends ComponentPropsWithoutRef<'div'> {}
}
