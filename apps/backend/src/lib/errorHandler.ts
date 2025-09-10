import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
  details?: any;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: any;

  constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_ERROR', details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.name = 'AppError';

    Error.captureStackTrace(this, this.constructor);
  }
}

// Predefined error types
export const ErrorTypes = {
  VALIDATION_ERROR: (message: string, details?: any) => 
    new AppError(message, 400, 'VALIDATION_ERROR', details),
  
  UNAUTHORIZED: (message: string = 'ไม่ได้รับอนุญาต') => 
    new AppError(message, 401, 'UNAUTHORIZED'),
  
  FORBIDDEN: (message: string = 'ไม่มีสิทธิ์เข้าถึง') => 
    new AppError(message, 403, 'FORBIDDEN'),
  
  NOT_FOUND: (message: string = 'ไม่พบข้อมูลที่ต้องการ') => 
    new AppError(message, 404, 'NOT_FOUND'),
  
  CONFLICT: (message: string = 'ข้อมูลซ้ำกัน') => 
    new AppError(message, 409, 'CONFLICT'),
  
  RATE_LIMIT: (message: string = 'คำขอเกินขีดจำกัด') => 
    new AppError(message, 429, 'RATE_LIMIT'),
  
  INTERNAL_ERROR: (message: string = 'เกิดข้อผิดพลาดภายในระบบ') => 
    new AppError(message, 500, 'INTERNAL_ERROR'),
  
  SERVICE_UNAVAILABLE: (message: string = 'บริการไม่พร้อมใช้งาน') => 
    new AppError(message, 503, 'SERVICE_UNAVAILABLE')
};

// Error response formatter
export const formatErrorResponse = (error: unknown): NextResponse => {
  let apiError: ApiError;

  if (error instanceof AppError) {
    apiError = {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      details: error.details
    };
  } else if (error instanceof ZodError) {
    apiError = {
      message: 'ข้อมูลไม่ถูกต้อง',
      code: 'VALIDATION_ERROR',
      statusCode: 400,
      details: error.errors
    };
  } else if (error instanceof Error) {
    apiError = {
      message: process.env.NODE_ENV === 'development' ? error.message : 'เกิดข้อผิดพลาดภายในระบบ',
      code: 'INTERNAL_ERROR',
      statusCode: 500
    };
  } else {
    apiError = {
      message: 'เกิดข้อผิดพลาดที่ไม่คาดคิด',
      code: 'UNKNOWN_ERROR',
      statusCode: 500
    };
  }

  // Log error for monitoring
  console.error('API Error:', {
    ...apiError,
    stack: error instanceof Error ? error.stack : undefined,
    timestamp: new Date().toISOString()
  });

  return NextResponse.json(
    {
      success: false,
      error: {
        message: apiError.message,
        code: apiError.code,
        ...(process.env.NODE_ENV === 'development' && apiError.details && { details: apiError.details })
      }
    },
    { status: apiError.statusCode }
  );
};

// Async error handler wrapper for API routes
export const withErrorHandler = (
  handler: (req: NextRequest, context?: any) => Promise<NextResponse>
) => {
  return async (req: NextRequest, context?: any): Promise<NextResponse> => {
    try {
      return await handler(req, context);
    } catch (error) {
      return formatErrorResponse(error);
    }
  };
};

// Success response formatter
export const formatSuccessResponse = (
  data: any,
  message: string = 'สำเร็จ',
  statusCode: number = 200
): NextResponse => {
  return NextResponse.json(
    {
      success: true,
      message,
      data
    },
    { status: statusCode }
  );
};

// Input validation helper
export const validateInput = <T>(schema: any, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      throw ErrorTypes.VALIDATION_ERROR('ข้อมูลไม่ถูกต้อง', error.errors);
    }
    throw error;
  }
};

// Rate limiting helper
export const checkRateLimit = async (identifier: string, limit: number = 100): Promise<void> => {
  // TODO: Implement rate limiting logic with Redis or in-memory store
  // For now, just a placeholder
  console.log(`Rate limit check for ${identifier}: ${limit} requests`);
};

export default {
  AppError,
  ErrorTypes,
  formatErrorResponse,
  formatSuccessResponse,
  withErrorHandler,
  validateInput,
  checkRateLimit
};