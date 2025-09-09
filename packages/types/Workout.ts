import { z } from 'zod';

// Workout Data Source
export const WorkoutDataSource = z.enum([
  'manual',
  'strava',
  'garmin',
  'polar',
  'suunto',
  'fitbit',
  'apple_health',
  'google_fit'
]);

// Workout Type (more detailed than training session type)
export const WorkoutType = z.enum([
  'easy_run',
  'tempo_run',
  'interval_run',
  'long_run',
  'recovery_run',
  'fartlek',
  'hill_repeats',
  'track_workout',
  'race',
  'bike_ride',
  'swim',
  'strength_training',
  'cross_training',
  'yoga',
  'stretching',
  'rest'
]);

// Weather Conditions
export const WeatherCondition = z.enum([
  'sunny',
  'cloudy',
  'rainy',
  'snowy',
  'windy',
  'hot',
  'cold',
  'humid',
  'foggy'
]);

// Perceived Exertion (RPE Scale 1-10)
export const PerceivedExertion = z.number().min(1).max(10);

// Workout Schema
export const workoutSchema = z.object({
  id: z.string().optional(),
  
  // Basic workout info
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  type: WorkoutType,
  
  // Timing
  startTime: z.string().datetime(),
  endTime: z.string().datetime().optional(),
  duration: z.number().positive(), // in seconds
  
  // Distance and pace
  distance: z.number().positive().optional(), // in meters
  averagePace: z.number().positive().optional(), // in seconds per km
  bestPace: z.number().positive().optional(), // in seconds per km
  
  // Heart rate data
  heartRate: z.object({
    average: z.number().positive().optional(),
    maximum: z.number().positive().optional(),
    minimum: z.number().positive().optional(),
    zones: z.object({
      zone1: z.number().nonnegative().optional(), // seconds in zone
      zone2: z.number().nonnegative().optional(),
      zone3: z.number().nonnegative().optional(),
      zone4: z.number().nonnegative().optional(),
      zone5: z.number().nonnegative().optional()
    }).optional()
  }).optional(),
  
  // Elevation and terrain
  elevation: z.object({
    gain: z.number().nonnegative().optional(), // in meters
    loss: z.number().nonnegative().optional(), // in meters
    minimum: z.number().optional(), // in meters
    maximum: z.number().optional() // in meters
  }).optional(),
  
  // Calories and power
  calories: z.number().nonnegative().optional(),
  power: z.object({
    average: z.number().nonnegative().optional(), // watts
    maximum: z.number().nonnegative().optional(),
    normalized: z.number().nonnegative().optional()
  }).optional(),
  
  // Cadence (steps per minute for running, RPM for cycling)
  cadence: z.object({
    average: z.number().nonnegative().optional(),
    maximum: z.number().nonnegative().optional()
  }).optional(),
  
  // Environmental conditions
  weather: z.object({
    condition: WeatherCondition.optional(),
    temperature: z.number().optional(), // in Celsius
    humidity: z.number().min(0).max(100).optional(), // percentage
    windSpeed: z.number().nonnegative().optional(), // km/h
    windDirection: z.string().optional() // e.g., 'N', 'NE', 'E'
  }).optional(),
  
  // Location data
  location: z.object({
    name: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    coordinates: z.object({
      latitude: z.number(),
      longitude: z.number()
    }).optional(),
    route: z.string().optional() // GPX data or route description
  }).optional(),
  
  // Subjective data
  perceivedExertion: PerceivedExertion.optional(),
  mood: z.enum(['terrible', 'poor', 'okay', 'good', 'excellent']).optional(),
  energy: z.enum(['very_low', 'low', 'moderate', 'high', 'very_high']).optional(),
  
  // Equipment
  equipment: z.object({
    shoes: z.string().optional(),
    clothing: z.array(z.string()).optional(),
    gear: z.array(z.string()).optional() // watch, heart rate monitor, etc.
  }).optional(),
  
  // Splits and laps
  splits: z.array(z.object({
    distance: z.number().positive(), // in meters
    time: z.number().positive(), // in seconds
    pace: z.number().positive().optional(), // seconds per km
    heartRate: z.number().positive().optional(),
    elevation: z.number().optional()
  })).optional(),
  
  // Data source and sync
  dataSource: WorkoutDataSource.default('manual'),
  externalId: z.string().optional(), // ID from external service
  externalUrl: z.string().url().optional(), // Link to Strava, Garmin, etc.
  syncedAt: z.string().datetime().optional(),
  
  // Relationships
  userId: z.string(),
  trainingSessionId: z.string().optional(), // Link to planned session
  
  // Analysis and insights
  analysis: z.object({
    trainingLoad: z.number().nonnegative().optional(),
    intensityFactor: z.number().nonnegative().optional(),
    efficiency: z.number().min(0).max(100).optional(), // percentage
    fatigue: z.number().min(0).max(100).optional(),
    fitness: z.number().min(0).max(100).optional()
  }).optional(),
  
  // Notes and feedback
  notes: z.string().optional(),
  coachFeedback: z.string().optional(),
  
  // Flags and status
  isRace: z.boolean().default(false),
  isPersonalRecord: z.boolean().default(false),
  quality: z.enum(['poor', 'average', 'good', 'excellent']).optional(),
  
  // Timestamps
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional()
});

// Workout Summary Schema (for lists and dashboards)
export const workoutSummarySchema = z.object({
  id: z.string(),
  title: z.string(),
  type: WorkoutType,
  startTime: z.string().datetime(),
  duration: z.number().positive(),
  distance: z.number().positive().optional(),
  averagePace: z.number().positive().optional(),
  averageHeartRate: z.number().positive().optional(),
  calories: z.number().nonnegative().optional(),
  perceivedExertion: PerceivedExertion.optional(),
  dataSource: WorkoutDataSource,
  isRace: z.boolean(),
  quality: z.enum(['poor', 'average', 'good', 'excellent']).optional()
});

// Workout Analytics Schema
export const workoutAnalyticsSchema = z.object({
  period: z.enum(['week', 'month', 'quarter', 'year']),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  
  // Volume metrics
  totalWorkouts: z.number().nonnegative(),
  totalDistance: z.number().nonnegative(), // in km
  totalDuration: z.number().nonnegative(), // in hours
  totalCalories: z.number().nonnegative(),
  
  // Averages
  averageDistance: z.number().nonnegative(),
  averageDuration: z.number().nonnegative(), // in minutes
  averagePace: z.number().positive().optional(),
  averageHeartRate: z.number().positive().optional(),
  averageRPE: z.number().min(1).max(10).optional(),
  
  // Distribution by type
  workoutsByType: z.record(WorkoutType, z.number().nonnegative()),
  
  // Trends
  weeklyTrend: z.array(z.object({
    week: z.string(),
    distance: z.number().nonnegative(),
    duration: z.number().nonnegative(),
    workouts: z.number().nonnegative()
  })),
  
  // Personal records
  personalRecords: z.array(z.object({
    distance: z.string(), // e.g., '5K', '10K', 'Half Marathon'
    time: z.number().positive(), // in seconds
    pace: z.number().positive(), // seconds per km
    date: z.string().datetime(),
    workoutId: z.string()
  })),
  
  // Goals progress
  goalsProgress: z.array(z.object({
    goalId: z.string(),
    goalTitle: z.string(),
    target: z.number(),
    current: z.number(),
    percentage: z.number().min(0).max(100)
  }))
});

// Create schemas
export const createWorkoutSchema = workoutSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// Update schemas
export const updateWorkoutSchema = workoutSchema.partial().omit({
  id: true,
  createdAt: true,
  userId: true
});

// Query schemas
export const workoutQuerySchema = z.object({
  userId: z.string().optional(),
  type: WorkoutType.optional(),
  dataSource: WorkoutDataSource.optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  minDistance: z.number().positive().optional(),
  maxDistance: z.number().positive().optional(),
  minDuration: z.number().positive().optional(),
  maxDuration: z.number().positive().optional(),
  isRace: z.boolean().optional(),
  quality: z.enum(['poor', 'average', 'good', 'excellent']).optional(),
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(20),
  sortBy: z.enum(['date', 'distance', 'duration', 'pace']).default('date'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

export const workoutAnalyticsQuerySchema = z.object({
  userId: z.string(),
  period: z.enum(['week', 'month', 'quarter', 'year']),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  workoutTypes: z.array(WorkoutType).optional()
});

// Bulk operations
export const bulkCreateWorkoutSchema = z.object({
  workouts: z.array(createWorkoutSchema).min(1).max(100)
});

export const bulkUpdateWorkoutSchema = z.object({
  updates: z.array(z.object({
    id: z.string(),
    data: updateWorkoutSchema
  })).min(1).max(50)
});

// Type exports
export type Workout = z.infer<typeof workoutSchema>;
export type CreateWorkout = z.infer<typeof createWorkoutSchema>;
export type UpdateWorkout = z.infer<typeof updateWorkoutSchema>;
export type WorkoutQuery = z.infer<typeof workoutQuerySchema>;
export type WorkoutSummary = z.infer<typeof workoutSummarySchema>;
export type WorkoutAnalytics = z.infer<typeof workoutAnalyticsSchema>;
export type WorkoutAnalyticsQuery = z.infer<typeof workoutAnalyticsQuerySchema>;
export type BulkCreateWorkout = z.infer<typeof bulkCreateWorkoutSchema>;
export type BulkUpdateWorkout = z.infer<typeof bulkUpdateWorkoutSchema>;

// Enum type exports
export type WorkoutDataSourceType = z.infer<typeof WorkoutDataSource>;
export type WorkoutTypeType = z.infer<typeof WorkoutType>;
export type WeatherConditionType = z.infer<typeof WeatherCondition>;

// Utility types
export interface WorkoutWithSession extends Workout {
  trainingSession?: {
    id: string;
    title: string;
    type: string;
    status: string;
  };
}

export interface WorkoutStats {
  totalWorkouts: number;
  totalDistance: number; // km
  totalDuration: number; // hours
  averagePace: number; // seconds per km
  bestPace: number; // seconds per km
  longestRun: number; // km
  longestDuration: number; // hours
}

export interface WeeklyWorkoutSummary {
  weekStart: string;
  weekEnd: string;
  totalWorkouts: number;
  totalDistance: number;
  totalDuration: number;
  workoutsByType: Record<WorkoutTypeType, number>;
  averageRPE: number;
}

export interface MonthlyWorkoutSummary {
  month: string;
  year: number;
  totalWorkouts: number;
  totalDistance: number;
  totalDuration: number;
  averageWorkoutsPerWeek: number;
  personalRecords: number;
}

// Heart rate zones configuration
export interface HeartRateZones {
  zone1: { min: number; max: number; name: 'Recovery' };
  zone2: { min: number; max: number; name: 'Aerobic Base' };
  zone3: { min: number; max: number; name: 'Aerobic' };
  zone4: { min: number; max: number; name: 'Lactate Threshold' };
  zone5: { min: number; max: number; name: 'VO2 Max' };
}

// Pace zones configuration
export interface PaceZones {
  recovery: { min: number; max: number }; // seconds per km
  easy: { min: number; max: number };
  moderate: { min: number; max: number };
  tempo: { min: number; max: number };
  interval: { min: number; max: number };
  repetition: { min: number; max: number };
}