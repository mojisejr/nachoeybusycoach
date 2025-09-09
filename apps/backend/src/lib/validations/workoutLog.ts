import { z } from 'zod';

/**
 * Base workout log schema without refinements
 */
const baseWorkoutLogSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
  runnerId: z.string().min(1, 'Runner ID is required'),
  status: z.enum(['completed', 'dnf', 'undone']).default('undone'),
  externalLink: z.string().url('Invalid external link URL').optional(),
  actualDistance: z.number().positive('Actual distance must be positive').optional(),
  actualDuration: z.number().positive('Actual duration must be positive').optional(),
  notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional(),
  feeling: z.enum(['excellent', 'good', 'okay', 'tired', 'exhausted']).optional(),
  injuries: z.string().max(500, 'Injuries description must be less than 500 characters').optional(),
  weather: z.enum(['sunny', 'cloudy', 'rainy', 'windy', 'hot', 'cold']).optional(),
  temperature: z.number().min(-50, 'Temperature too low').max(60, 'Temperature too high').optional()
});

/**
 * Workout log validation schema for creating and updating workout logs
 * Used in POST/PUT /api/workout-logs endpoints
 */
export const workoutLogSchema = baseWorkoutLogSchema.refine(
  (data) => {
    // If status is completed, at least one of actualDistance or actualDuration should be provided
    if (data.status === 'completed') {
      return data.actualDistance !== undefined || data.actualDuration !== undefined;
    }
    return true;
  },
  {
    message: 'For completed workouts, either actual distance or actual duration must be provided',
    path: ['actualDistance']
  }
);

/**
 * Workout log query parameters validation schema
 * Used in GET /api/workout-logs endpoint
 */
export const workoutLogQuerySchema = z.object({
  sessionId: z.string().optional(),
  runnerId: z.string().optional(),
  status: z.enum(['completed', 'dnf', 'undone']).optional(),
  feeling: z.enum(['excellent', 'good', 'okay', 'tired', 'exhausted']).optional(),
  weather: z.enum(['sunny', 'cloudy', 'rainy', 'windy', 'hot', 'cold']).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  limit: z.string().transform(Number).pipe(z.number().positive().max(100)).optional(),
  offset: z.string().transform(Number).pipe(z.number().min(0)).optional()
});

/**
 * Workout log update validation schema
 * Used in PUT /api/workout-logs/[id] endpoint
 */
export const workoutLogUpdateSchema = baseWorkoutLogSchema.partial().omit({ sessionId: true, runnerId: true });

/**
 * Type definitions derived from schemas
 */
export type WorkoutLog = z.infer<typeof workoutLogSchema>;
export type WorkoutLogQuery = z.infer<typeof workoutLogQuerySchema>;
export type WorkoutLogUpdate = z.infer<typeof workoutLogUpdateSchema>;

/**
 * Workout log response schema with Sanity metadata
 * Used for API responses
 */
export const workoutLogResponseSchema = baseWorkoutLogSchema.extend({
  _id: z.string(),
  _createdAt: z.string().datetime(),
  _updatedAt: z.string().datetime(),
  session: z.object({
    _id: z.string(),
    title: z.string(),
    plannedDistance: z.number().optional(),
    plannedDuration: z.number().optional()
  }).optional(),
  runner: z.object({
    _id: z.string(),
    name: z.string(),
    email: z.string().email()
  }).optional()
});

export type WorkoutLogResponse = z.infer<typeof workoutLogResponseSchema>;

/**
 * Partial workout log schema for PATCH operations
 */
export const workoutLogPartialSchema = baseWorkoutLogSchema.partial();
export type WorkoutLogPartial = z.infer<typeof workoutLogPartialSchema>;