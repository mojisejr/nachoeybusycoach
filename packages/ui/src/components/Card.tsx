import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
  compact?: boolean;
  bordered?: boolean;
  shadow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  actions,
  className = '',
  compact = false,
  bordered = true,
  shadow = true
}) => {
  const baseClasses = 'card bg-base-100';
  const modifierClasses = [
    compact ? 'card-compact' : '',
    bordered ? 'border border-base-300' : '',
    shadow ? 'shadow-lg' : '',
    className
  ].filter(Boolean).join(' ');

  const cardClasses = `${baseClasses} ${modifierClasses}`;

  return (
    <div className={cardClasses}>
      <div className="card-body">
        {(title || subtitle) && (
          <div className="card-title-section">
            {title && (
              <h2 className="card-title">
                {title}
                {subtitle && (
                  <div className="badge badge-secondary">{subtitle}</div>
                )}
              </h2>
            )}
          </div>
        )}
        
        <div className="card-content">
          {children}
        </div>
        
        {actions && (
          <div className="card-actions justify-end mt-4">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};