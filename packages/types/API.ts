import { z } from 'zod';
import type { User, TrainingSession } from './index';

// HTTP Methods
export const HTTPMethod = z.enum([
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE'
]);

// API Response Status
export const APIStatus = z.enum([
  'success',
  'error',
  'loading'
]);

// Base API Response Schema
export const baseAPIResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  timestamp: z.string().datetime().optional()
});

// Paginated Response Schema
export const paginatedResponseSchema = z.object({
  data: z.array(z.any()),
  pagination: z.object({
    page: z.number().positive(),
    limit: z.number().positive(),
    total: z.number().nonnegative(),
    totalPages: z.number().positive(),
    hasNext: z.boolean(),
    hasPrev: z.boolean()
  })
}).merge(baseAPIResponseSchema);

// Single Item Response Schema
export const singleItemResponseSchema = z.object({
  data: z.any()
}).merge(baseAPIResponseSchema);

// Error Response Schema
export const errorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.any().optional(),
    field: z.string().optional() // For validation errors
  })
}).merge(baseAPIResponseSchema);

// Authentication Types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  image?: string;
  role: 'runner' | 'coach' | 'admin';
}

export interface AuthResponse {
  user: AuthUser;
  tokens: AuthTokens;
}

// Login Request
export const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

// Register Request
export const registerRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  role: z.enum(['runner', 'coach'])
});

// OAuth Callback Request
export const oauthCallbackSchema = z.object({
  provider: z.enum(['google', 'facebook', 'line']),
  code: z.string(),
  state: z.string().optional()
});

// API Endpoints
export interface APIEndpoints {
  // Authentication
  auth: {
    login: '/api/auth/login';
    register: '/api/auth/register';
    logout: '/api/auth/logout';
    refresh: '/api/auth/refresh';
    me: '/api/auth/me';
    oauth: {
      google: '/api/auth/oauth/google';
      facebook: '/api/auth/oauth/facebook';
      line: '/api/auth/oauth/line';
    };
  };
  
  // Users
  users: {
    list: '/api/users';
    create: '/api/users';
    get: '/api/users/[id]';
    update: '/api/users/[id]';
    delete: '/api/users/[id]';
    profile: '/api/users/profile';
  };
  
  // Training Sessions
  trainingSessions: {
    list: '/api/training-sessions';
    create: '/api/training-sessions';
    bulkCreate: '/api/training-sessions/bulk';
    get: '/api/training-sessions/[id]';
    update: '/api/training-sessions/[id]';
    delete: '/api/training-sessions/[id]';
    complete: '/api/training-sessions/[id]/complete';
    review: '/api/training-sessions/[id]/review';
  };
  
  // Coach-Runner Relationships
  relationships: {
    list: '/api/relationships';
    create: '/api/relationships';
    update: '/api/relationships/[id]';
    delete: '/api/relationships/[id]';
  };
}

// Request Configuration
export interface RequestConfig {
  method: z.infer<typeof HTTPMethod>;
  url: string;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
}

// API Client Configuration
export interface APIClientConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  headers: Record<string, string>;
  interceptors?: {
    request?: (config: RequestConfig) => RequestConfig;
    response?: (response: any) => any;
    error?: (error: any) => any;
  };
}

// SWR Configuration
export interface SWRConfig {
  refreshInterval?: number;
  revalidateOnFocus?: boolean;
  revalidateOnReconnect?: boolean;
  dedupingInterval?: number;
  errorRetryCount?: number;
  errorRetryInterval?: number;
}

// API Hook Return Types
export interface UseAPIReturn<T> {
  data: T | undefined;
  error: any;
  isLoading: boolean;
  isValidating: boolean;
  mutate: () => void;
}

export interface UseMutationReturn<T, V = any> {
  trigger: (variables: V) => Promise<T>;
  data: T | undefined;
  error: any;
  isMutating: boolean;
  reset: () => void;
}

// Webhook Types
export const webhookEventSchema = z.object({
  id: z.string(),
  type: z.enum([
    'user.created',
    'user.updated',
    'training_session.created',
    'training_session.completed',
    'training_session.reviewed',
    'relationship.created',
    'relationship.updated'
  ]),
  data: z.any(),
  timestamp: z.string().datetime(),
  signature: z.string()
});

// File Upload Types
export interface FileUploadConfig {
  maxSize: number; // in bytes
  allowedTypes: string[];
  multiple?: boolean;
}

export interface UploadedFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: string;
}

// Rate Limiting
export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message?: string;
}

// API Versioning
export interface APIVersion {
  version: string;
  deprecated?: boolean;
  deprecationDate?: string;
  supportedUntil?: string;
}

// Health Check Response
export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version: string;
  uptime: number;
  services: {
    database: 'connected' | 'disconnected';
    cache: 'connected' | 'disconnected';
    external: Record<string, 'connected' | 'disconnected'>;
  };
}

// Type exports
export type HTTPMethodType = z.infer<typeof HTTPMethod>;
export type APIStatusType = z.infer<typeof APIStatus>;
export type BaseAPIResponse = z.infer<typeof baseAPIResponseSchema>;
export type PaginatedResponse<T = any> = Omit<z.infer<typeof paginatedResponseSchema>, 'data'> & { data: T[] };
export type SingleItemResponse<T = any> = Omit<z.infer<typeof singleItemResponseSchema>, 'data'> & { data: T };
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type RegisterRequest = z.infer<typeof registerRequestSchema>;
export type OAuthCallback = z.infer<typeof oauthCallbackSchema>;
export type WebhookEvent = z.infer<typeof webhookEventSchema>;