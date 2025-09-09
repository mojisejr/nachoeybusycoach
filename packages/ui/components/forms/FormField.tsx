import React from 'react';
import { cn } from '../../utils/cn';

export interface FormFieldProps {
  children: React.ReactNode;
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  errorClassName?: string;
  hintClassName?: string;
  id?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  children,
  label,
  error,
  hint,
  required = false,
  className,
  labelClassName,
  errorClassName,
  hintClassName,
  id,
}) => {
  const fieldId = id || `field-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={cn('space-y-2', className)}>
      {/* Label */}
      {label && (
        <label
          htmlFor={fieldId}
          className={cn(
            'block text-sm font-medium text-base-content',
            required && 'after:content-["*"] after:ml-0.5 after:text-error',
            labelClassName
          )}
        >
          {label}
        </label>
      )}

      {/* Input Field */}
      <div className="relative">
        {React.isValidElement(children)
          ? React.cloneElement(children, {
              id: fieldId,
              'aria-invalid': error ? 'true' : 'false',
              'aria-describedby': error
                ? `${fieldId}-error`
                : hint
                ? `${fieldId}-hint`
                : undefined,
            } as any)
          : children}
      </div>

      {/* Error Message */}
      {error && (
        <p
          id={`${fieldId}-error`}
          className={cn(
            'text-sm text-error flex items-center',
            errorClassName
          )}
          role="alert"
        >
          <svg
            className="w-4 h-4 mr-1 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}

      {/* Hint Message */}
      {hint && !error && (
        <p
          id={`${fieldId}-hint`}
          className={cn(
            'text-sm text-base-content/60',
            hintClassName
          )}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default FormField;