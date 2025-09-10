import { NextRequest } from 'next/server';
import { logger } from '@/lib/logger';
import { formatErrorResponse, formatSuccessResponse } from '@/lib/errorHandler';

interface LogEntry {
  level: 'error' | 'warn' | 'info' | 'debug';
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

interface LogRequest {
  logs: LogEntry[];
}

export async function POST(request: NextRequest) {
  try {
    const body: LogRequest = await request.json();
    
    if (!body.logs || !Array.isArray(body.logs)) {
      return formatErrorResponse(new Error('Invalid request body. Expected logs array.'));
    }

    // Process each log entry
    for (const logEntry of body.logs) {
      // Validate log entry structure
      if (!logEntry.level || !logEntry.message || !logEntry.timestamp) {
        logger.warn('Invalid log entry received', { logEntry });
        continue;
      }

      // Create a structured log message for backend
      const backendLogMessage = `[FRONTEND] ${logEntry.message}`;
      const metadata = {
        ...logEntry.metadata,
        frontend: true,
        originalContext: logEntry.context,
        userAgent: logEntry.userAgent,
        url: logEntry.url,
        component: logEntry.component,
        userId: logEntry.userId,
        sessionId: logEntry.sessionId,
        frontendTimestamp: logEntry.timestamp,
        ...(logEntry.stack && { stack: logEntry.stack })
      };

      // Log to backend logger with appropriate level
      switch (logEntry.level) {
        case 'error':
          logger.error(backendLogMessage, metadata);
          break;
        case 'warn':
          logger.warn(backendLogMessage, metadata);
          break;
        case 'info':
          logger.info(backendLogMessage, metadata);
          break;
        case 'debug':
          logger.debug(backendLogMessage, metadata);
          break;
        default:
          logger.info(backendLogMessage, metadata);
      }
    }

    // Log the successful processing
    logger.info(`Processed ${body.logs.length} frontend log entries`, {
      count: body.logs.length,
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
    });

    return formatSuccessResponse({ 
      processed: body.logs.length 
    }, 'Logs processed successfully');

  } catch (error) {
    logger.error('Failed to process frontend logs', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return formatErrorResponse(new Error('Failed to process logs'));
  }
}

// Health check for logging endpoint
export async function GET() {
  try {
    logger.info('Logging endpoint health check');
    
    return formatSuccessResponse({
      status: 'healthy',
      endpoint: '/api/logs',
      timestamp: new Date().toISOString()
    }, 'Logging endpoint healthy');
  } catch (error) {
    logger.error('Logging endpoint health check failed', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    
    return formatErrorResponse(new Error('Logging endpoint unhealthy'));
  }
}