import React from 'react';
import { cn } from '../../utils/cn';

// Loading spinner sizes
const spinnerSizes = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12'
};

type SpinnerSize = keyof typeof spinnerSizes;

// Basic Spinner component
interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
  color?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  className,
  color = 'currentColor'
}) => {
  return (
    <svg
      className={cn(
        'animate-spin',
        spinnerSizes[size],
        className
      )}
      fill="none"
      viewBox="0 0 24 24"
      role="status"
      aria-label="Loading"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill={color}
        d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

// Dots Spinner component
interface DotsSpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

const DotsSpinner: React.FC<DotsSpinnerProps> = ({
  size = 'md',
  className
}) => {
  const dotSize = {
    xs: 'h-1 w-1',
    sm: 'h-1.5 w-1.5',
    md: 'h-2 w-2',
    lg: 'h-3 w-3',
    xl: 'h-4 w-4'
  };

  return (
    <div
      className={cn('flex space-x-1', className)}
      role="status"
      aria-label="Loading"
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'rounded-full bg-current animate-pulse',
            dotSize[size]
          )}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  );
};

// Pulse Spinner component
interface PulseSpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

const PulseSpinner: React.FC<PulseSpinnerProps> = ({
  size = 'md',
  className
}) => {
  return (
    <div
      className={cn(
        'rounded-full bg-current animate-pulse',
        spinnerSizes[size],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
};

// Loading Overlay component
interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  spinner?: React.ReactNode;
  text?: string;
  className?: string;
  overlayClassName?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  children,
  spinner,
  text,
  className,
  overlayClassName
}) => {
  return (
    <div className={cn('relative', className)}>
      {children}
      {isLoading && (
        <div
          className={cn(
            'absolute inset-0 flex flex-col items-center justify-center',
            'bg-background/80 backdrop-blur-sm',
            'z-10',
            overlayClassName
          )}
        >
          {spinner || <Spinner size="lg" />}
          {text && (
            <p className="mt-2 text-sm text-muted-foreground">{text}</p>
          )}
        </div>
      )}
    </div>
  );
};

// Loading Button component
interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  spinner?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading = false,
  loadingText,
  spinner,
  children,
  disabled,
  className,
  variant = 'default',
  size = 'default',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  
  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline'
  };

  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10'
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <>
          {spinner || <Spinner size="sm" className="mr-2" />}
          {loadingText || 'Loading...'}
        </>
      )}
      {!isLoading && children}
    </button>
  );
};

// Skeleton components
interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className,
  width,
  height,
  rounded = false
}) => {
  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={cn(
        'animate-pulse bg-muted',
        rounded ? 'rounded-full' : 'rounded',
        className
      )}
      style={style}
      role="status"
      aria-label="Loading content"
    />
  );
};

// Skeleton Text component
interface SkeletonTextProps {
  lines?: number;
  className?: string;
  lineHeight?: string;
  lastLineWidth?: string;
}

const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 3,
  className,
  lineHeight = 'h-4',
  lastLineWidth = 'w-3/4'
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn(
            lineHeight,
            index === lines - 1 ? lastLineWidth : 'w-full'
          )}
        />
      ))}
    </div>
  );
};

// Skeleton Card component
interface SkeletonCardProps {
  showAvatar?: boolean;
  showImage?: boolean;
  className?: string;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({
  showAvatar = false,
  showImage = false,
  className
}) => {
  return (
    <div className={cn('space-y-4 p-4', className)}>
      {showImage && (
        <Skeleton className="h-48 w-full" />
      )}
      
      <div className="space-y-2">
        {showAvatar && (
          <div className="flex items-center space-x-3">
            <Skeleton className="h-10 w-10" rounded />
            <div className="space-y-1 flex-1">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-3 w-1/6" />
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
};

// Loading States component
interface LoadingStatesProps {
  state: 'idle' | 'loading' | 'success' | 'error';
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  successComponent?: React.ReactNode;
}

const LoadingStates: React.FC<LoadingStatesProps> = ({
  state,
  children,
  loadingComponent,
  errorComponent,
  successComponent
}) => {
  switch (state) {
    case 'loading':
      return (
        <>
          {loadingComponent || (
            <div className="flex items-center justify-center p-8">
              <Spinner size="lg" />
            </div>
          )}
        </>
      );
    case 'error':
      return (
        <>
          {errorComponent || (
            <div className="flex items-center justify-center p-8 text-destructive">
              <p>Something went wrong. Please try again.</p>
            </div>
          )}
        </>
      );
    case 'success':
      return (
        <>
          {successComponent || children}
        </>
      );
    default:
      return <>{children}</>;
  }
};

export {
  Spinner,
  DotsSpinner,
  PulseSpinner,
  LoadingOverlay,
  LoadingButton,
  Skeleton,
  SkeletonText,
  SkeletonCard,
  LoadingStates
};

export type {
  SpinnerProps,
  DotsSpinnerProps,
  PulseSpinnerProps,
  LoadingOverlayProps,
  LoadingButtonProps,
  SkeletonProps,
  SkeletonTextProps,
  SkeletonCardProps,
  LoadingStatesProps,
  SpinnerSize
};