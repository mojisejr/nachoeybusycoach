import React from 'react';
import { cn } from '../../utils/cn';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  label?: string;
  description?: string;
  error?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
  indeterminate?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      description,
      error = false,
      size = 'md',
      variant = 'default',
      indeterminate = false,
      className,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const checkboxRef = React.useRef<HTMLInputElement>(null);
    const combinedRef = ref || checkboxRef;

    React.useEffect(() => {
      if (combinedRef && typeof combinedRef === 'object' && combinedRef.current) {
        combinedRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate, combinedRef]);

    const sizeClasses = {
      sm: 'checkbox-sm',
      md: 'checkbox-md',
      lg: 'checkbox-lg',
    };

    const variantClasses = {
      default: '',
      primary: 'checkbox-primary',
      secondary: 'checkbox-secondary',
      accent: 'checkbox-accent',
    };

    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    const checkboxElement = (
      <input
        ref={combinedRef}
        type="checkbox"
        id={checkboxId}
        className={cn(
          'checkbox',
          sizeClasses[size],
          variantClasses[variant],
          error && 'checkbox-error',
          disabled && 'checkbox-disabled',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          className
        )}
        disabled={disabled}
        aria-describedby={description ? `${checkboxId}-description` : undefined}
        {...props}
      />
    );

    if (!label && !description) {
      return checkboxElement;
    }

    return (
      <div className="form-control">
        <label className="label cursor-pointer justify-start space-x-3">
          {checkboxElement}
          <div className="flex flex-col">
            {label && (
              <span
                className={cn(
                  'label-text',
                  disabled && 'text-base-content/50',
                  error && 'text-error'
                )}
              >
                {label}
              </span>
            )}
            {description && (
              <span
                id={`${checkboxId}-description`}
                className={cn(
                  'label-text-alt text-base-content/60',
                  disabled && 'text-base-content/30'
                )}
              >
                {description}
              </span>
            )}
          </div>
        </label>
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;