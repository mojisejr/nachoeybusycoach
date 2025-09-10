import React from 'react';

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: string;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
  stack?: string;
  userAgent?: string;
  url?: string;
  component?: string;
}

interface LoggerConfig {
  enableConsole: boolean;
  enableRemote: boolean;
  remoteEndpoint?: string;
  batchSize: number;
  flushInterval: number;
}

class FrontendLogger {
  private context: string;
  private config: LoggerConfig;
  private logQueue: LogEntry[] = [];
  private flushTimer: NodeJS.Timeout | null = null;
  private isDevelopment: boolean;

  constructor(context: string = 'Frontend', config?: Partial<LoggerConfig>) {
    this.context = context;
    this.isDevelopment = process.env.NODE_ENV === 'development';
    
    this.config = {
      enableConsole: true,
      enableRemote: !this.isDevelopment, // Only send to remote in production
      remoteEndpoint: '/api/logs',
      batchSize: 10,
      flushInterval: 5000, // 5 seconds
      ...config
    };

    // Start flush timer
    this.startFlushTimer();

    // Flush logs before page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.flush();
      });
    }
  }

  private formatLog(level: LogLevel, message: string, metadata?: Record<string, any>): LogEntry {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: this.context,
      metadata,
      ...(metadata?.stack && { stack: metadata.stack }),
      ...(metadata?.userId && { userId: metadata.userId }),
      ...(metadata?.sessionId && { sessionId: metadata.sessionId }),
      ...(metadata?.component && { component: metadata.component })
    };

    // Add browser info
    if (typeof window !== 'undefined') {
      entry.userAgent = navigator.userAgent;
      entry.url = window.location.href;
    }

    return entry;
  }

  private writeToConsole(logEntry: LogEntry): void {
    if (!this.config.enableConsole) return;

    const logString = this.isDevelopment 
      ? JSON.stringify(logEntry, null, 2)
      : JSON.stringify(logEntry);
    
    switch (logEntry.level) {
      case 'error':
        console.error(`[${logEntry.context}]`, logEntry.message, logEntry.metadata || '');
        break;
      case 'warn':
        console.warn(`[${logEntry.context}]`, logEntry.message, logEntry.metadata || '');
        break;
      case 'info':
        console.info(`[${logEntry.context}]`, logEntry.message, logEntry.metadata || '');
        break;
      case 'debug':
        if (this.isDevelopment) {
          console.debug(`[${logEntry.context}]`, logEntry.message, logEntry.metadata || '');
        }
        break;
      default:
        console.log(`[${logEntry.context}]`, logEntry.message, logEntry.metadata || '');
    }
  }

  private queueForRemote(logEntry: LogEntry): void {
    if (!this.config.enableRemote) return;

    this.logQueue.push(logEntry);

    // Flush immediately for errors
    if (logEntry.level === 'error') {
      this.flush();
    } else if (this.logQueue.length >= this.config.batchSize) {
      this.flush();
    }
  }

  private startFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.config.flushInterval);
  }

  private async flush(): Promise<void> {
    if (this.logQueue.length === 0 || !this.config.enableRemote) return;

    const logsToSend = [...this.logQueue];
    this.logQueue = [];

    try {
      await fetch(this.config.remoteEndpoint!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ logs: logsToSend }),
      });
    } catch (error) {
      // If remote logging fails, put logs back in queue and log to console
      this.logQueue.unshift(...logsToSend);
      console.error('Failed to send logs to remote endpoint:', error);
    }
  }

  private log(level: LogLevel, message: string, metadata?: Record<string, any>): void {
    const logEntry = this.formatLog(level, message, metadata);
    
    this.writeToConsole(logEntry);
    this.queueForRemote(logEntry);
  }

  error(message: string, metadata?: Record<string, any>): void {
    this.log('error', message, metadata);
  }

  warn(message: string, metadata?: Record<string, any>): void {
    this.log('warn', message, metadata);
  }

  info(message: string, metadata?: Record<string, any>): void {
    this.log('info', message, metadata);
  }

  debug(message: string, metadata?: Record<string, any>): void {
    this.log('debug', message, metadata);
  }

  // Specialized logging methods
  apiRequest(method: string, url: string, metadata?: Record<string, any>): void {
    this.info(`API Request: ${method} ${url}`, {
      type: 'api_request',
      method,
      url,
      ...metadata
    });
  }

  apiResponse(method: string, url: string, statusCode: number, duration: number, metadata?: Record<string, any>): void {
    const level = statusCode >= 400 ? 'error' : 'info';
    this[level](`API Response: ${method} ${url} - ${statusCode} (${duration}ms)`, {
      type: 'api_response',
      method,
      url,
      statusCode,
      duration,
      ...metadata
    });
  }

  userAction(action: string, component?: string, metadata?: Record<string, any>): void {
    this.info(`User Action: ${action}`, {
      type: 'user_action',
      action,
      component,
      ...metadata
    });
  }

  componentError(componentName: string, error: Error, metadata?: Record<string, any>): void {
    this.error(`Component Error in ${componentName}: ${error.message}`, {
      type: 'component_error',
      component: componentName,
      stack: error.stack,
      ...metadata
    });
  }

  routeChange(from: string, to: string, metadata?: Record<string, any>): void {
    this.info(`Route Change: ${from} -> ${to}`, {
      type: 'route_change',
      from,
      to,
      ...metadata
    });
  }

  performance(operation: string, duration: number, metadata?: Record<string, any>): void {
    const level = duration > 3000 ? 'warn' : 'info'; // Warn if operation takes more than 3 seconds
    this[level](`Performance: ${operation} took ${duration}ms`, {
      type: 'performance',
      operation,
      duration,
      ...metadata
    });
  }

  // Create child logger with additional context
  child(additionalContext: string): FrontendLogger {
    return new FrontendLogger(`${this.context}:${additionalContext}`, this.config);
  }

  // Cleanup method
  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    this.flush(); // Final flush
  }
}

// Create default loggers
export const logger = new FrontendLogger('Frontend');
export const uiLogger = new FrontendLogger('UI');
export const apiLogger = new FrontendLogger('API');
export const routerLogger = new FrontendLogger('Router');

// React component logging helper
export const withComponentLogging = <P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) => {
  const WrappedComponent = (props: P) => {
    const componentLogger = logger.child(componentName);
    
    React.useEffect(() => {
      componentLogger.debug(`Component ${componentName} mounted`);
      
      return () => {
        componentLogger.debug(`Component ${componentName} unmounted`);
      };
    }, [componentLogger]);

    try {
      return React.createElement(Component, props);
    } catch (error) {
      componentLogger.componentError(componentName, error as Error);
      throw error;
    }
  };

  WrappedComponent.displayName = `withLogging(${componentName})`;
  return WrappedComponent;
};

// Performance monitoring hook
export const usePerformanceLogging = (operationName: string) => {
  const performanceLogger = logger.child('Performance');
  
  return React.useCallback(<T extends (...args: any[]) => any>(fn: T): T => {
    return ((...args: any[]) => {
      const startTime = Date.now();
      try {
        const result = fn(...args);
        
        if (result instanceof Promise) {
          return result
            .then((value) => {
              const duration = Date.now() - startTime;
              performanceLogger.performance(operationName, duration, { success: true });
              return value;
            })
            .catch((error) => {
              const duration = Date.now() - startTime;
              performanceLogger.performance(operationName, duration, { success: false, error: error.message });
              throw error;
            });
        } else {
          const duration = Date.now() - startTime;
          performanceLogger.performance(operationName, duration, { success: true });
          return result;
        }
      } catch (error) {
        const duration = Date.now() - startTime;
        performanceLogger.performance(operationName, duration, { 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
        throw error;
      }
    }) as T;
  }, [operationName, performanceLogger]);
};

export default FrontendLogger;