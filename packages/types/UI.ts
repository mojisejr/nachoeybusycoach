import { z } from 'zod';
import { ReactNode } from 'react';

// Base component props
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

// Button Variants
export const ButtonVariant = z.enum([
  'primary',
  'secondary',
  'outline',
  'ghost',
  'link',
  'destructive'
]);

export const ButtonSize = z.enum([
  'sm',
  'md',
  'lg',
  'xl'
]);

export interface ButtonProps extends BaseComponentProps {
  variant?: z.infer<typeof ButtonVariant>;
  size?: z.infer<typeof ButtonSize>;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

// Card Variants
export const CardVariant = z.enum([
  'default',
  'outlined',
  'elevated',
  'filled'
]);

export interface CardProps extends BaseComponentProps {
  variant?: z.infer<typeof CardVariant>;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

// Input Types
export const InputType = z.enum([
  'text',
  'email',
  'password',
  'number',
  'tel',
  'url',
  'search',
  'date',
  'time',
  'datetime-local'
]);

export interface InputProps extends BaseComponentProps {
  type?: z.infer<typeof InputType>;
  placeholder?: string;
  value?: string | number;
  defaultValue?: string | number;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  helperText?: string;
  onChange?: (value: string) => void;
}

// Modal Props
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

// Toast Types
export const ToastType = z.enum([
  'success',
  'error',
  'warning',
  'info'
]);

export interface ToastProps {
  id: string;
  type: z.infer<typeof ToastType>;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Loading States
export interface LoadingProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  overlay?: boolean;
}

// Form Field Props
export interface FormFieldProps extends BaseComponentProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
}

// Select Props
export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends BaseComponentProps {
  options: SelectOption[];
  value?: string | number;
  defaultValue?: string | number;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  multiple?: boolean;
  searchable?: boolean;
  onChange?: (value: string | number | (string | number)[]) => void;
}

// Checkbox Props
export interface CheckboxProps extends BaseComponentProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  error?: string;
  onChange?: (checked: boolean) => void;
}

// Radio Group Props
export interface RadioOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface RadioGroupProps extends BaseComponentProps {
  options: RadioOption[];
  value?: string | number;
  defaultValue?: string | number;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  orientation?: 'horizontal' | 'vertical';
  onChange?: (value: string | number) => void;
}

// Layout Props
export interface LayoutProps extends BaseComponentProps {
  sidebar?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
}

export interface HeaderProps extends BaseComponentProps {
  title?: string;
  user?: {
    name: string;
    image?: string;
    role: string;
  };
  onLogout?: () => void;
}

export interface SidebarProps extends BaseComponentProps {
  isOpen?: boolean;
  onClose?: () => void;
  navigation: NavigationItem[];
}

export interface NavigationItem {
  label: string;
  href: string;
  icon?: ReactNode;
  active?: boolean;
  children?: NavigationItem[];
}

// Logo Props
export interface LogoProps extends BaseComponentProps {
  variant?: 'full' | 'icon' | 'text';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  href?: string;
}

// Theme Types
export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  fonts: {
    primary: string;
    secondary: string;
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
}

// Responsive Design Types
export type ResponsiveValue<T> = T | {
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
};

// Animation Types
export interface AnimationProps {
  duration?: number;
  delay?: number;
  easing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
}

// Accessibility Props
export interface AccessibilityProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-hidden'?: boolean;
  role?: string;
  tabIndex?: number;
}

// Type exports for Zod enums
export type ButtonVariantType = z.infer<typeof ButtonVariant>;
export type ButtonSizeType = z.infer<typeof ButtonSize>;
export type CardVariantType = z.infer<typeof CardVariant>;
export type InputTypeType = z.infer<typeof InputType>;
export type ToastTypeType = z.infer<typeof ToastType>;