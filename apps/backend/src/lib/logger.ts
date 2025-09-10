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
}

class Logger {
  private context: string;
  private isDevelopment: boolean;

  constructor(context: string = 'App') {
    this.context = context;
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  private formatLog(level: LogLevel, message: string, metadata?: Record<string, any>): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: this.context,
      metadata,
      ...(metadata?.stack && { stack: metadata.stack }),
      ...(metadata?.userId && { userId: metadata.userId }),
      ...(metadata?.sessionId && { sessionId: metadata.sessionId }),
      ...(metadata?.userAgent && { userAgent: metadata.userAgent }),
      ...(metadata?.url && { url: metadata.url })
    };
  }

  private writeLog(logEntry: LogEntry): void {
    const logString = JSON.stringify(logEntry, null, this.isDevelopment ? 2 : 0);
    
    switch (logEntry.level) {
      case 'error':
        console.error(logString);
        break;
      case 'warn':
        console.warn(logString);
        break;
      case 'info':
        console.info(logString);
        break;
      case 'debug':
        if (this.isDevelopment) {
          console.debug(logString);
        }
        break;
      default:
        console.log(logString);
    }

    // TODO: Send to external logging service (e.g., Sentry, LogRocket)
    this.sendToExternalService(logEntry);
  }

  private async sendToExternalService(logEntry: LogEntry): Promise<void> {
    try {
      // TODO: Implement external logging service integration
      // For now, just store in memory or database
      if (logEntry.level === 'error') {
        // Store critical errors
        console.log('Storing critical error:', logEntry.message);
      }
    } catch (error) {
      console.error('Failed to send log to external service:', error);
    }
  }

  error(message: string, metadata?: Record<string, any>): void {
    const logEntry = this.formatLog('error', message, metadata);
    this.writeLog(logEntry);
  }

  warn(message: string, metadata?: Record<string, any>): void {
    const logEntry = this.formatLog('warn', message, metadata);
    this.writeLog(logEntry);
  }

  info(message: string, metadata?: Record<string, any>): void {
    const logEntry = this.formatLog('info', message, metadata);
    this.writeLog(logEntry);
  }

  debug(message: string, metadata?: Record<string, any>): void {
    const logEntry = this.formatLog('debug', message, metadata);
    this.writeLog(logEntry);
  }

  // Specialized logging methods
  apiRequest(method: string, url: string, userId?: string, metadata?: Record<string, any>): void {
    this.info(`API Request: ${method} ${url}`, {
      type: 'api_request',
      method,
      url,
      userId,
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

  userAction(action: string, userId: string, metadata?: Record<string, any>): void {
    this.info(`User Action: ${action}`, {
      type: 'user_action',
      action,
      userId,
      ...metadata
    });
  }

  performance(operation: string, duration: number, metadata?: Record<string, any>): void {
    const level = duration > 5000 ? 'warn' : 'info'; // Warn if operation takes more than 5 seconds
    this[level](`Performance: ${operation} took ${duration}ms`, {
      type: 'performance',
      operation,
      duration,
      ...metadata
    });
  }

  security(event: string, userId?: string, metadata?: Record<string, any>): void {
    this.warn(`Security Event: ${event}`, {
      type: 'security',
      event,
      userId,
      ...metadata
    });
  }

  // Create child logger with additional context
  child(additionalContext: string): Logger {
    return new Logger(`${this.context}:${additionalContext}`);
  }
}

// Create default loggers
export const logger = new Logger('Backend');
export const apiLogger = new Logger('API');
export const authLogger = new Logger('Auth');
export const dbLogger = new Logger('Database');
export const sanityLogger = new Logger('Sanity');

// Performance monitoring helper
export const withPerformanceLogging = <T extends (...args: any[]) => any>(
  fn: T,
  operationName: string,
  logger: Logger = apiLogger
): T => {
  return ((...args: any[]) => {
    const startTime = Date.now();
    try {
      const result = fn(...args);
      
      // Handle both sync and async functions
      if (result instanceof Promise) {
        return result
          .then((value) => {
            const duration = Date.now() - startTime;
            logger.performance(operationName, duration, { success: true });
            return value;
          })
          .catch((error) => {
            const duration = Date.now() - startTime;
            logger.performance(operationName, duration, { success: false, error: error.message });
            throw error;
          });
      } else {
        const duration = Date.now() - startTime;
        logger.performance(operationName, duration, { success: true });
        return result;
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.performance(operationName, duration, { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
    }
  }) as T;
};

export default Logger;