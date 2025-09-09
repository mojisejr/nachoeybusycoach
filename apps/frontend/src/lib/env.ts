/**
 * Environment configuration for the frontend application
 * This file centralizes all environment variable access and provides type safety
 */

// Server-side environment variables (not exposed to client)
export const serverEnv = {
  nextAuthSecret: process.env.NEXTAUTH_SECRET!,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  facebookClientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
} as const;

// Client-side environment variables (exposed to browser)
export const clientEnv = {
  nextAuthUrl: process.env.NEXTAUTH_URL!,
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL!,
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL!,
  sanityProjectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  sanityDataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  googleClientId: process.env.GOOGLE_CLIENT_ID!,
  facebookClientId: process.env.FACEBOOK_CLIENT_ID!,
  nodeEnv: process.env.NODE_ENV!,
  // Optional analytics
  gaTrackingId: process.env.NEXT_PUBLIC_GA_TRACKING_ID,
  hotjarId: process.env.NEXT_PUBLIC_HOTJAR_ID,
  sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
} as const;

// Validation function to ensure required environment variables are set
export function validateEnv() {
  const requiredServerVars = [
    'NEXTAUTH_SECRET',
    'GOOGLE_CLIENT_SECRET',
  ];
  
  const requiredClientVars = [
    'NEXTAUTH_URL',
    'NEXT_PUBLIC_API_BASE_URL',
    'NEXT_PUBLIC_BACKEND_URL',
    'NEXT_PUBLIC_SANITY_PROJECT_ID',
    'NEXT_PUBLIC_SANITY_DATASET',
    'GOOGLE_CLIENT_ID',
  ];

  const missingVars: string[] = [];

  // Check server-side variables (only on server)
  if (typeof window === 'undefined') {
    requiredServerVars.forEach(varName => {
      if (!process.env[varName]) {
        missingVars.push(varName);
      }
    });
  }

  // Check client-side variables
  requiredClientVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please check your .env.local file and ensure all required variables are set.'
    );
  }
}

// Helper to check if we're in development mode
export const isDevelopment = clientEnv.nodeEnv === 'development';
export const isProduction = clientEnv.nodeEnv === 'production';

// API endpoints helper
export const apiEndpoints = {
  auth: {
    signIn: `${clientEnv.apiBaseUrl}/auth/signin`,
    signOut: `${clientEnv.apiBaseUrl}/auth/signout`,
    session: `${clientEnv.apiBaseUrl}/auth/session`,
  },
  users: {
    profile: `${clientEnv.apiBaseUrl}/users/profile`,
    update: `${clientEnv.apiBaseUrl}/users/update`,
  },
  trainingPlans: {
    list: `${clientEnv.apiBaseUrl}/training-plans`,
    create: `${clientEnv.apiBaseUrl}/training-plans`,
    update: (id: string) => `${clientEnv.apiBaseUrl}/training-plans/${id}`,
    delete: (id: string) => `${clientEnv.apiBaseUrl}/training-plans/${id}`,
  },
  sessions: {
    list: `${clientEnv.apiBaseUrl}/sessions`,
    create: `${clientEnv.apiBaseUrl}/sessions`,
    update: (id: string) => `${clientEnv.apiBaseUrl}/sessions/${id}`,
    delete: (id: string) => `${clientEnv.apiBaseUrl}/sessions/${id}`,
  },
  workoutLogs: {
    list: `${clientEnv.apiBaseUrl}/workout-logs`,
    create: `${clientEnv.apiBaseUrl}/workout-logs`,
    update: (id: string) => `${clientEnv.apiBaseUrl}/workout-logs/${id}`,
    delete: (id: string) => `${clientEnv.apiBaseUrl}/workout-logs/${id}`,
  },
  feedback: {
    list: `${clientEnv.apiBaseUrl}/feedback`,
    create: `${clientEnv.apiBaseUrl}/feedback`,
    update: (id: string) => `${clientEnv.apiBaseUrl}/feedback/${id}`,
  },
  notifications: {
    list: `${clientEnv.apiBaseUrl}/notifications`,
    markAsRead: (id: string) => `${clientEnv.apiBaseUrl}/notifications/${id}/read`,
  },
  analytics: {
    runner: (id: string) => `${clientEnv.apiBaseUrl}/analytics/runner/${id}`,
    coach: (id: string) => `${clientEnv.apiBaseUrl}/analytics/coach/${id}`,
  },
} as const;