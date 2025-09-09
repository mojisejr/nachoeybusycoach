import React from 'react';
import { cn } from '../../utils/cn';

// Card base styles
const cardVariants = {
  base: 'rounded-lg border bg-card text-card-foreground shadow-sm',
  variants: {
    default: 'border-border',
    outlined: 'border-2 border-border',
    elevated: 'shadow-md border-0',
    flat: 'shadow-none border-border/50',
    interactive: 'cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98]'
  },
  padding: {
    none: '',
    sm: 'p-3',
    default: 'p-6',
    lg: 'p-8'
  }
};

type CardVariant = keyof typeof cardVariants.variants;
type CardPadding = keyof typeof cardVariants.padding;

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  asChild?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          cardVariants.base,
          cardVariants.variants[variant],
          cardVariants.padding[padding],
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

// Card Header component
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  divider?: boolean;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, divider = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col space-y-1.5 p-6',
          divider && 'border-b border-border pb-4',
          className
        )}
        {...props}
      />
    );
  }
);

CardHeader.displayName = 'CardHeader';

// Card Title component
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, as: Component = 'h3', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          'text-2xl font-semibold leading-none tracking-tight',
          className
        )}
        {...props}
      />
    );
  }
);

CardTitle.displayName = 'CardTitle';

// Card Description component
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
});

CardDescription.displayName = 'CardDescription';

// Card Content component
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('p-6 pt-0', className)}
      {...props}
    />
  );
});

CardContent.displayName = 'CardContent';

// Card Footer component
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  divider?: boolean;
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, divider = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center p-6 pt-0',
          divider && 'border-t border-border pt-4',
          className
        )}
        {...props}
      />
    );
  }
);

CardFooter.displayName = 'CardFooter';

// Card Actions component for button groups
const CardActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'flex items-center justify-end space-x-2 p-6 pt-0',
        className
      )}
      {...props}
    />
  );
});

CardActions.displayName = 'CardActions';

// Specialized card components

// Stats Card for displaying metrics
interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  className
}) => {
  return (
    <Card className={cn('p-6', className)}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline space-x-2">
            <p className="text-2xl font-bold">{value}</p>
            {trend && (
              <span
                className={cn(
                  'text-xs font-medium',
                  trend.isPositive ? 'text-success' : 'text-error'
                )}
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 text-muted-foreground">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

// Feature Card for showcasing features
interface FeatureCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  action,
  className
}) => {
  return (
    <Card className={cn('p-6', className)}>
      {icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
      )}
      <CardTitle className="mb-2 text-lg">{title}</CardTitle>
      <CardDescription className="mb-4">{description}</CardDescription>
      {action && <div className="mt-auto">{action}</div>}
    </Card>
  );
};

// Profile Card for user information
interface ProfileCardProps {
  name: string;
  role?: string;
  avatar?: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  role,
  avatar,
  description,
  actions,
  className
}) => {
  return (
    <Card className={cn('p-6', className)}>
      <div className="flex items-start space-x-4">
        {avatar ? (
          <img
            src={avatar}
            alt={`${name}'s avatar`}
            className="h-12 w-12 rounded-full object-cover"
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
            <span className="text-lg font-semibold text-muted-foreground">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{name}</h3>
          {role && (
            <p className="text-sm text-muted-foreground">{role}</p>
          )}
          {description && (
            <p className="text-sm text-muted-foreground mt-2">{description}</p>
          )}
          {actions && (
            <div className="mt-4">{actions}</div>
          )}
        </div>
      </div>
    </Card>
  );
};

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardActions,
  StatsCard,
  FeatureCard,
  ProfileCard
};

export type {
  CardProps,
  CardHeaderProps,
  CardTitleProps,
  CardFooterProps,
  StatsCardProps,
  FeatureCardProps,
  ProfileCardProps,
  CardVariant,
  CardPadding
};