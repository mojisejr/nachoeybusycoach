import { z } from 'zod';

// Common utility schemas
export const paginationSchema = z.object({
  page: z.number().positive().default(1),
  limit: z.number().positive().max(100).default(20),
  total: z.number().nonnegative().default(0),
  totalPages: z.number().nonnegative().default(0)
});

export const sortSchema = z.object({
  field: z.string(),
  direction: z.enum(['asc', 'desc']).default('asc')
});

export const filterSchema = z.object({
  field: z.string(),
  operator: z.enum(['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'in', 'nin', 'contains', 'startsWith', 'endsWith']),
  value: z.union([z.string(), z.number(), z.boolean(), z.array(z.union([z.string(), z.number()]))])
});

export const searchParamsSchema = z.object({
  q: z.string().optional(),
  pagination: paginationSchema.optional(),
  sort: z.array(sortSchema).optional(),
  filters: z.array(filterSchema).optional()
});

// Date range schema
export const dateRangeSchema = z.object({
  start: z.string().datetime(),
  end: z.string().datetime()
}).refine(data => new Date(data.start) <= new Date(data.end), {
  message: "Start date must be before or equal to end date"
});

// File upload schema
export const fileUploadSchema = z.object({
  id: z.string(),
  name: z.string(),
  size: z.number().positive(),
  type: z.string(),
  url: z.string().url(),
  uploadedAt: z.string().datetime(),
  uploadedBy: z.string()
});

// Geolocation schema
export const coordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  altitude: z.number().optional(),
  accuracy: z.number().positive().optional()
});

export const locationSchema = z.object({
  coordinates: coordinatesSchema,
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  timezone: z.string().optional()
});

// Time duration schema (for workouts, sessions, etc.)
export const durationSchema = z.object({
  hours: z.number().nonnegative().default(0),
  minutes: z.number().min(0).max(59).default(0),
  seconds: z.number().min(0).max(59).default(0),
  totalSeconds: z.number().nonnegative()
}).refine(data => {
  const calculated = data.hours * 3600 + data.minutes * 60 + data.seconds;
  return Math.abs(calculated - data.totalSeconds) < 1;
}, {
  message: "Total seconds must match hours, minutes, and seconds"
});

// Heart rate zones schema
export const heartRateZoneSchema = z.object({
  zone: z.number().min(1).max(5),
  name: z.enum(['recovery', 'aerobic', 'threshold', 'lactate', 'neuromuscular']),
  minBpm: z.number().positive(),
  maxBpm: z.number().positive(),
  percentage: z.number().min(0).max(100) // percentage of max HR
}).refine(data => data.minBpm < data.maxBpm, {
  message: "Min BPM must be less than max BPM"
});

// Pace schema (for running)
export const paceSchema = z.object({
  minutesPerKm: z.number().positive(),
  minutesPerMile: z.number().positive(),
  secondsPerKm: z.number().nonnegative(),
  kmPerHour: z.number().positive(),
  milesPerHour: z.number().positive()
});

// Weather conditions schema
export const weatherSchema = z.object({
  temperature: z.number(), // in Celsius
  humidity: z.number().min(0).max(100), // percentage
  windSpeed: z.number().nonnegative(), // km/h
  windDirection: z.number().min(0).max(360).optional(), // degrees
  condition: z.enum([
    'sunny', 'partly_cloudy', 'cloudy', 'overcast',
    'light_rain', 'rain', 'heavy_rain', 'snow',
    'fog', 'windy', 'hot', 'cold'
  ]),
  visibility: z.number().positive().optional(), // km
  uvIndex: z.number().min(0).max(11).optional()
});

// Notification schema
export const notificationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.enum([
    'training_reminder', 'coach_feedback', 'workout_completed',
    'goal_achieved', 'system_update', 'message_received',
    'session_scheduled', 'session_cancelled', 'injury_alert'
  ]),
  title: z.string(),
  message: z.string(),
  data: z.record(z.any()).optional(), // Additional data payload
  read: z.boolean().default(false),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  createdAt: z.string().datetime(),
  readAt: z.string().datetime().optional(),
  expiresAt: z.string().datetime().optional()
});

// Activity summary schema
export const activitySummarySchema = z.object({
  totalActivities: z.number().nonnegative().default(0),
  totalDistance: z.number().nonnegative().default(0), // km
  totalDuration: z.number().nonnegative().default(0), // seconds
  averagePace: z.number().positive().optional(), // seconds per km
  caloriesBurned: z.number().nonnegative().default(0),
  elevationGain: z.number().nonnegative().default(0), // meters
  period: z.enum(['day', 'week', 'month', 'year']),
  startDate: z.string().datetime(),
  endDate: z.string().datetime()
});

// Goal schema
export const goalSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.enum([
    'distance_weekly', 'distance_monthly', 'distance_yearly',
    'pace_improvement', 'race_completion', 'weight_loss',
    'consistency', 'personal_record', 'custom'
  ]),
  title: z.string(),
  description: z.string().optional(),
  target: z.object({
    value: z.number().positive(),
    unit: z.string(),
    deadline: z.string().datetime().optional()
  }),
  current: z.object({
    value: z.number().nonnegative().default(0),
    lastUpdated: z.string().datetime().optional()
  }),
  status: z.enum(['active', 'completed', 'paused', 'cancelled']).default('active'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  createdAt: z.string().datetime(),
  completedAt: z.string().datetime().optional()
});

// Achievement schema
export const achievementSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.enum([
    'first_run', 'distance_milestone', 'pace_improvement',
    'consistency_streak', 'goal_completed', 'personal_record',
    'challenge_completed', 'social_milestone'
  ]),
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
  points: z.number().nonnegative().default(0),
  rarity: z.enum(['common', 'uncommon', 'rare', 'epic', 'legendary']).default('common'),
  unlockedAt: z.string().datetime(),
  data: z.record(z.any()).optional() // Additional achievement data
});

// Type exports
export type Pagination = z.infer<typeof paginationSchema>;
export type Sort = z.infer<typeof sortSchema>;
export type Filter = z.infer<typeof filterSchema>;
export type SearchParams = z.infer<typeof searchParamsSchema>;
export type DateRange = z.infer<typeof dateRangeSchema>;
export type FileUpload = z.infer<typeof fileUploadSchema>;
export type Coordinates = z.infer<typeof coordinatesSchema>;
export type Location = z.infer<typeof locationSchema>;
export type Duration = z.infer<typeof durationSchema>;
export type HeartRateZone = z.infer<typeof heartRateZoneSchema>;
export type Pace = z.infer<typeof paceSchema>;
export type Weather = z.infer<typeof weatherSchema>;
export type Notification = z.infer<typeof notificationSchema>;
export type ActivitySummary = z.infer<typeof activitySummarySchema>;
export type Goal = z.infer<typeof goalSchema>;
export type Achievement = z.infer<typeof achievementSchema>;

// Utility type helpers
export interface SortedResponse<T> {
  data: T[];
  sort: Sort[];
}

export interface FilteredResponse<T> {
  data: T[];
  filters: Filter[];
  totalFiltered: number;
}

export interface SearchResponse<T> {
  data: T[];
  pagination: Pagination;
  query?: string;
  totalResults: number;
  searchTime: number; // milliseconds
}

// Common response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId: string;
    version: string;
  };
}

// Form validation helpers
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface FormState<T = any> {
  data: T;
  errors: ValidationError[];
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
}

// Time-based utilities
export interface TimeSlot {
  start: string; // HH:MM format
  end: string; // HH:MM format
  available: boolean;
}

export interface WeeklySchedule {
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
  sunday: TimeSlot[];
}

// Chart/Analytics data types
export interface ChartDataPoint {
  x: string | number;
  y: number;
  label?: string;
  color?: string;
}

export interface ChartSeries {
  name: string;
  data: ChartDataPoint[];
  color?: string;
  type?: 'line' | 'bar' | 'area' | 'scatter';
}

export interface ChartConfig {
  title?: string;
  xAxis: {
    label: string;
    type: 'category' | 'time' | 'value';
  };
  yAxis: {
    label: string;
    type: 'value';
    unit?: string;
  };
  series: ChartSeries[];
}