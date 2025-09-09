import React from 'react';
import { cn } from '../../utils/cn';

export interface RadioOption {
  value: string | number;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (value: string | number) => void;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
  error?: boolean;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  value,
  defaultValue,
  onChange,
  orientation = 'vertical',
  size = 'md',
  variant = 'default',
  error = false,
  disabled = false,
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}) => {
  const [selectedValue, setSelectedValue] = React.useState<string | number | undefined>(
    value || defaultValue
  );

  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  const handleChange = (optionValue: string | number) => {
    if (disabled) return;
    
    setSelectedValue(optionValue);
    onChange?.(optionValue);
  };

  const sizeClasses = {
    sm: 'radio-sm',
    md: 'radio-md',
    lg: 'radio-lg',
  };

  const variantClasses = {
    default: '',
    primary: 'radio-primary',
    secondary: 'radio-secondary',
    accent: 'radio-accent',
  };

  const orientationClasses = {
    horizontal: 'flex flex-row flex-wrap gap-4',
    vertical: 'flex flex-col space-y-2',
  };

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={cn(
        'form-control',
        orientationClasses[orientation],
        className
      )}
    >
      {options.map((option) => {
        const radioId = `${name}-${option.value}`;
        const isSelected = selectedValue === option.value;
        const isDisabled = disabled || option.disabled;

        return (
          <label
            key={option.value}
            htmlFor={radioId}
            className={cn(
              'label cursor-pointer justify-start space-x-3',
              isDisabled && 'cursor-not-allowed opacity-50'
            )}
          >
            <input
              type="radio"
              id={radioId}
              name={name}
              value={option.value}
              checked={isSelected}
              onChange={() => handleChange(option.value)}
              disabled={isDisabled}
              className={cn(
                'radio',
                sizeClasses[size],
                variantClasses[variant],
                error && 'radio-error',
                'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
              )}
              aria-describedby={option.description ? `${radioId}-description` : undefined}
            />
            <div className="flex flex-col">
              <span
                className={cn(
                  'label-text',
                  isDisabled && 'text-base-content/50',
                  error && 'text-error'
                )}
              >
                {option.label}
              </span>
              {option.description && (
                <span
                  id={`${radioId}-description`}
                  className={cn(
                    'label-text-alt text-base-content/60',
                    isDisabled && 'text-base-content/30'
                  )}
                >
                  {option.description}
                </span>
              )}
            </div>
          </label>
        );
      })}
    </div>
  );
};

export default RadioGroup;