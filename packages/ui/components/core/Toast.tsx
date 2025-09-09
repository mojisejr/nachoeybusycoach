import React from 'react';
import { cn } from '../../utils/cn';

// Toast variants
const toastVariants = {
  default: 'bg-background text-foreground border',
  success: 'bg-green-50 text-green-900 border-green-200 dark:bg-green-900/20 dark:text-green-100 dark:border-green-800',
  error: 'bg-red-50 text-red-900 border-red-200 dark:bg-red-900/20 dark:text-red-100 dark:border-red-800',
  warning: 'bg-yellow-50 text-yellow-900 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-100 dark:border-yellow-800',
  info: 'bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-900/20 dark:text-blue-100 dark:border-blue-800'
};

type ToastVariant = keyof typeof toastVariants;

// Toast positions
const toastPositions = {
  'top-left': 'top-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'top-right': 'top-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  'bottom-right': 'bottom-4 right-4'
};

type ToastPosition = keyof typeof toastPositions;

// Toast interface
interface ToastData {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
}

// Individual Toast component
interface ToastProps extends ToastData {
  onRemove: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({
  id,
  title,
  description,
  variant = 'default',
  duration = 5000,
  action,
  onClose,
  onRemove
}) => {
  const [isVisible, setIsVisible] = React.useState(true);
  const [isExiting, setIsExiting] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const hoverRef = React.useRef(false);

  const handleClose = React.useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onRemove(id);
      onClose?.();
    }, 150); // Animation duration
  }, [id, onRemove, onClose]);

  const resetTimeout = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (duration > 0 && !hoverRef.current) {
      timeoutRef.current = setTimeout(handleClose, duration);
    }
  }, [duration, handleClose]);

  React.useEffect(() => {
    resetTimeout();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [resetTimeout]);

  const handleMouseEnter = () => {
    hoverRef.current = true;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleMouseLeave = () => {
    hoverRef.current = false;
    resetTimeout();
  };

  const getIcon = () => {
    switch (variant) {
      case 'success':
        return (
          <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="h-5 w-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'info':
        return (
          <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'relative flex w-full max-w-sm items-center space-x-3 rounded-lg p-4 shadow-lg transition-all duration-150',
        toastVariants[variant],
        isExiting ? 'animate-out slide-out-to-right-full' : 'animate-in slide-in-from-right-full'
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="alert"
      aria-live="polite"
    >
      {getIcon() && (
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        {title && (
          <p className="text-sm font-medium">{title}</p>
        )}
        {description && (
          <p className={cn(
            'text-sm',
            title ? 'mt-1 text-opacity-90' : ''
          )}>
            {description}
          </p>
        )}
      </div>

      {action && (
        <button
          onClick={action.onClick}
          className="flex-shrink-0 text-sm font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current rounded"
        >
          {action.label}
        </button>
      )}

      <button
        onClick={handleClose}
        className="flex-shrink-0 rounded-md p-1 hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current transition-colors"
        aria-label="Close notification"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

// Toast Container component
interface ToastContainerProps {
  toasts: ToastData[];
  position?: ToastPosition;
  maxToasts?: number;
  onRemove: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  position = 'top-right',
  maxToasts = 5,
  onRemove
}) => {
  const visibleToasts = toasts.slice(0, maxToasts);

  return (
    <div
      className={cn(
        'fixed z-50 flex flex-col space-y-2',
        toastPositions[position]
      )}
      aria-live="polite"
      aria-label="Notifications"
    >
      {visibleToasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

// Toast Hook
interface ToastContextType {
  toasts: ToastData[];
  addToast: (toast: Omit<ToastData, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

// Toast Provider component
interface ToastProviderProps {
  children: React.ReactNode;
  position?: ToastPosition;
  maxToasts?: number;
}

const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  position = 'top-right',
  maxToasts = 5
}) => {
  const [toasts, setToasts] = React.useState<ToastData[]>([]);

  const addToast = React.useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastData = { ...toast, id };
    
    setToasts((prev) => [newToast, ...prev]);
    return id;
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearToasts = React.useCallback(() => {
    setToasts([]);
  }, []);

  const contextValue = React.useMemo(
    () => ({ toasts, addToast, removeToast, clearToasts }),
    [toasts, addToast, removeToast, clearToasts]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer
        toasts={toasts}
        position={position}
        maxToasts={maxToasts}
        onRemove={removeToast}
      />
    </ToastContext.Provider>
  );
};

// useToast hook
const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const toast = React.useCallback(
    (options: Omit<ToastData, 'id'>) => {
      return context.addToast(options);
    },
    [context]
  );

  // Convenience methods
  const success = React.useCallback(
    (title: string, description?: string, options?: Partial<Omit<ToastData, 'id' | 'variant' | 'title' | 'description'>>) => {
      return toast({ ...options, variant: 'success', title, description });
    },
    [toast]
  );

  const error = React.useCallback(
    (title: string, description?: string, options?: Partial<Omit<ToastData, 'id' | 'variant' | 'title' | 'description'>>) => {
      return toast({ ...options, variant: 'error', title, description });
    },
    [toast]
  );

  const warning = React.useCallback(
    (title: string, description?: string, options?: Partial<Omit<ToastData, 'id' | 'variant' | 'title' | 'description'>>) => {
      return toast({ ...options, variant: 'warning', title, description });
    },
    [toast]
  );

  const info = React.useCallback(
    (title: string, description?: string, options?: Partial<Omit<ToastData, 'id' | 'variant' | 'title' | 'description'>>) => {
      return toast({ ...options, variant: 'info', title, description });
    },
    [toast]
  );

  return {
    toast,
    success,
    error,
    warning,
    info,
    remove: context.removeToast,
    clear: context.clearToasts
  };
};

export {
  Toast,
  ToastContainer,
  ToastProvider,
  useToast
};

export type {
  ToastData,
  ToastProps,
  ToastContainerProps,
  ToastProviderProps,
  ToastVariant,
  ToastPosition
};