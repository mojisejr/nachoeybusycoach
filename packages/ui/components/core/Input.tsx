import React from 'react';
import { cn } from '../../utils/cn';

// Input variant styles
const inputVariants = {
  base: 'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  
  variants: {
    default: '',
    error: 'border-destructive focus-visible:ring-destructive',
    success: 'border-success focus-visible:ring-success',
    warning: 'border-warning focus-visible:ring-warning'
  },
  
  sizes: {
    sm: 'h-8 px-2 text-xs',
    default: 'h-10 px-3 py-2',
    lg: 'h-12 px-4 py-3 text-base'
  }
};

type InputVariant = keyof typeof inputVariants.variants;
type InputSize = keyof typeof inputVariants.sizes;

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;
  inputSize?: InputSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  success?: string;
  warning?: string;
  helperText?: string;
  label?: string;
  required?: boolean;
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      variant = 'default',
      inputSize = 'default',
      leftIcon,
      rightIcon,
      error,
      success,
      warning,
      helperText,
      label,
      required,
      fullWidth = true,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = Boolean(error);
    const hasSuccess = Boolean(success);
    const hasWarning = Boolean(warning);
    
    // Determine the variant based on validation state
    const effectiveVariant = hasError ? 'error' : hasSuccess ? 'success' : hasWarning ? 'warning' : variant;
    
    const inputElement = (
      <div className={cn('relative', fullWidth && 'w-full')}>
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            inputVariants.base,
            inputVariants.variants[effectiveVariant],
            inputVariants.sizes[inputSize],
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            className
          )}
          ref={ref}
          id={inputId}
          aria-invalid={hasError}
          aria-describedby={cn(
            error && `${inputId}-error`,
            success && `${inputId}-success`,
            warning && `${inputId}-warning`,
            helperText && `${inputId}-helper`
          ).trim() || undefined}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {rightIcon}
          </div>
        )}
      </div>
    );

    if (!label && !error && !success && !warning && !helperText) {
      return inputElement;
    }

    return (
      <div className={cn('space-y-2', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        {inputElement}
        {error && (
          <p
            id={`${inputId}-error`}
            className="text-sm text-destructive"
            role="alert"
          >
            {error}
          </p>
        )}
        {success && !error && (
          <p
            id={`${inputId}-success`}
            className="text-sm text-success"
          >
            {success}
          </p>
        )}
        {warning && !error && !success && (
          <p
            id={`${inputId}-warning`}
            className="text-sm text-warning"
          >
            {warning}
          </p>
        )}
        {helperText && !error && !success && !warning && (
          <p
            id={`${inputId}-helper`}
            className="text-sm text-muted-foreground"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Textarea component
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: InputVariant;
  error?: string;
  success?: string;
  warning?: string;
  helperText?: string;
  label?: string;
  required?: boolean;
  fullWidth?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      variant = 'default',
      error,
      success,
      warning,
      helperText,
      label,
      required,
      fullWidth = true,
      resize = 'vertical',
      id,
      ...props
    },
    ref
  ) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = Boolean(error);
    const hasSuccess = Boolean(success);
    const hasWarning = Boolean(warning);
    
    const effectiveVariant = hasError ? 'error' : hasSuccess ? 'success' : hasWarning ? 'warning' : variant;
    
    const resizeClasses = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize'
    };

    const textareaElement = (
      <textarea
        className={cn(
          inputVariants.base,
          inputVariants.variants[effectiveVariant],
          'min-h-[80px]',
          resizeClasses[resize],
          className
        )}
        ref={ref}
        id={textareaId}
        aria-invalid={hasError}
        aria-describedby={cn(
          error && `${textareaId}-error`,
          success && `${textareaId}-success`,
          warning && `${textareaId}-warning`,
          helperText && `${textareaId}-helper`
        ).trim() || undefined}
        {...props}
      />
    );

    if (!label && !error && !success && !warning && !helperText) {
      return textareaElement;
    }

    return (
      <div className={cn('space-y-2', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        {textareaElement}
        {error && (
          <p
            id={`${textareaId}-error`}
            className="text-sm text-destructive"
            role="alert"
          >
            {error}
          </p>
        )}
        {success && !error && (
          <p
            id={`${textareaId}-success`}
            className="text-sm text-success"
          >
            {success}
          </p>
        )}
        {warning && !error && !success && (
          <p
            id={`${textareaId}-warning`}
            className="text-sm text-warning"
          >
            {warning}
          </p>
        )}
        {helperText && !error && !success && !warning && (
          <p
            id={`${textareaId}-helper`}
            className="text-sm text-muted-foreground"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// Search Input component
interface SearchInputProps extends Omit<InputProps, 'type' | 'leftIcon'> {
  onClear?: () => void;
  showClearButton?: boolean;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onClear, showClearButton = true, rightIcon, value, ...props }, ref) => {
    const SearchIcon = () => (
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    );

    const ClearIcon = () => (
      <button
        type="button"
        onClick={onClear}
        className="text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Clear search"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    );

    return (
      <Input
        ref={ref}
        type="search"
        leftIcon={<SearchIcon />}
        rightIcon={
          showClearButton && value && onClear ? <ClearIcon /> : rightIcon
        }
        value={value}
        {...props}
      />
    );
  }
);

SearchInput.displayName = 'SearchInput';

// Password Input component
interface PasswordInputProps extends Omit<InputProps, 'type' | 'rightIcon'> {
  showPasswordToggle?: boolean;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ showPasswordToggle = true, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const ToggleIcon = () => (
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="text-muted-foreground hover:text-foreground transition-colors"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? (
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
            />
          </svg>
        ) : (
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        )}
      </button>
    );

    return (
      <Input
        ref={ref}
        type={showPassword ? 'text' : 'password'}
        rightIcon={showPasswordToggle ? <ToggleIcon /> : undefined}
        {...props}
      />
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export { Input, Textarea, SearchInput, PasswordInput };
export type {
  InputProps,
  TextareaProps,
  SearchInputProps,
  PasswordInputProps,
  InputVariant,
  InputSize
};