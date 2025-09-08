import { z } from 'zod';

// Training Session Status Enum
export const TrainingSessionStatus = z.enum([
  'scheduled',
  'completed',
  'dnf', // Did Not Finish
  'undone'
]);

// Training Session Intensity Enum
export const TrainingSessionIntensity = z.enum([
  'easy',
  'moderate',
  'hard',
  'recovery'
]);

// Training Session Type Enum
export const TrainingSessionType = z.enum([
  'run',
  'bike',
  'swim',
  'strength',
  'rest',
  'cross_training'
]);

// Base Training Session Schema
export const trainingSessionSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  type: TrainingSessionType,
  intensity: TrainingSessionIntensity,
  status: TrainingSessionStatus.default('scheduled'),
  
  // Scheduling
  scheduledDate: z.string().datetime(),
  duration: z.number().positive().optional(), // in minutes
  
  // Performance metrics
  distance: z.number().positive().optional(), // in kilometers
  targetPace: z.string().optional(), // e.g., "5:30/km"
  actualPace: z.string().optional(),
  heartRate: z.object({
    avg: z.number().positive().optional(),
    max: z.number().positive().optional()
  }).optional(),
  
  // External links
  stravaLink: z.string().url().optional(),
  garminLink: z.string().url().optional(),
  
  // Notes and feedback
  runnerNotes: z.string().optional(),
  coachNotes: z.string().optional(),
  coachFeedback: z.string().optional(),
  
  // Injury and wellness
  injuryNotes: z.string().optional(),
  wellnessRating: z.number().min(1).max(10).optional(), // 1-10 scale
  
  // Relationships
  runnerId: z.string(),
  coachId: z.string(),
  
  // Timestamps
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  completedAt: z.string().datetime().optional(),
  reviewedAt: z.string().datetime().optional() // when coach reviewed
});

// Create Training Session Schema (for POST requests)
export const createTrainingSessionSchema = trainingSessionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  completedAt: true,
  reviewedAt: true
});

// Update Training Session Schema (for PATCH requests)
export const updateTrainingSessionSchema = trainingSessionSchema.partial().omit({
  id: true,
  createdAt: true
});

// Bulk Create Training Sessions Schema
export const bulkCreateTrainingSessionSchema = z.object({
  sessions: z.array(createTrainingSessionSchema).min(1).max(50) // Limit to 50 sessions per bulk request
});

// Query parameters for GET requests
export const trainingSessionQuerySchema = z.object({
  runnerId: z.string().optional(),
  coachId: z.string().optional(),
  status: TrainingSessionStatus.optional(),
  type: TrainingSessionType.optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(20)
});

// Type exports
export type TrainingSession = z.infer<typeof trainingSessionSchema>;
export type CreateTrainingSession = z.infer<typeof createTrainingSessionSchema>;
export type UpdateTrainingSession = z.infer<typeof updateTrainingSessionSchema>;
export type BulkCreateTrainingSession = z.infer<typeof bulkCreateTrainingSessionSchema>;
export type TrainingSessionQuery = z.infer<typeof trainingSessionQuerySchema>;
export type TrainingSessionStatusType = z.infer<typeof TrainingSessionStatus>;
export type TrainingSessionIntensityType = z.infer<typeof TrainingSessionIntensity>;
export type TrainingSessionTypeType = z.infer<typeof TrainingSessionType>;