import { z } from 'zod';

/**
 * Base training plan schema without refinements
 */
const baseTrainingPlanSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  runnerId: z.string().min(1, 'Runner ID is required'),
  weekStart: z.string().datetime('Invalid week start date format'),
  weekEnd: z.string().datetime('Invalid week end date format'),
  status: z.enum(['draft', 'active', 'completed', 'cancelled']).default('draft')
});

/**
 * Training plan validation schema for creating and updating training plans
 * Used in POST/PUT /api/training-plans endpoints
 */
export const trainingPlanSchema = baseTrainingPlanSchema.refine(
  (data) => new Date(data.weekEnd) > new Date(data.weekStart),
  {
    message: 'Week end date must be after week start date',
    path: ['weekEnd']
  }
);

/**
 * Training plan query parameters validation schema
 * Used in GET /api/training-plans endpoint
 */
export const trainingPlanQuerySchema = z.object({
  runnerId: z.string().optional(),
  status: z.enum(['draft', 'active', 'completed', 'cancelled']).optional(),
  weekStart: z.string().datetime().optional(),
  weekEnd: z.string().datetime().optional(),
  limit: z.string().transform(Number).pipe(z.number().positive().max(100)).optional(),
  offset: z.string().transform(Number).pipe(z.number().min(0)).optional()
});

/**
 * Training plan update validation schema
 * Used in PUT /api/training-plans/[id] endpoint
 */
export const trainingPlanUpdateSchema = baseTrainingPlanSchema.partial().omit({ runnerId: true });

/**
 * Type definitions derived from schemas
 */
export type TrainingPlan = z.infer<typeof trainingPlanSchema>;
export type TrainingPlanQuery = z.infer<typeof trainingPlanQuerySchema>;
export type TrainingPlanUpdate = z.infer<typeof trainingPlanUpdateSchema>;

/**
 * Training plan response schema for API responses
 */
export const trainingPlanResponseSchema = baseTrainingPlanSchema.extend({
  _id: z.string(),
  _createdAt: z.string().datetime(),
  _updatedAt: z.string().datetime(),
  runner: z.object({
    _id: z.string(),
    name: z.string(),
    email: z.string().email()
  }).optional(),
  coach: z.object({
    _id: z.string(),
    name: z.string(),
    email: z.string().email()
  }).optional(),
  sessionsCount: z.number().optional()
});

export type TrainingPlanResponse = z.infer<typeof trainingPlanResponseSchema>;