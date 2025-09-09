import { z } from 'zod';
import type { TrainingSession } from './training-session';

// Training Plan Status
export const TrainingPlanStatus = z.enum([
  'draft',
  'active',
  'completed',
  'paused',
  'cancelled'
]);

// Training Plan Type
export const TrainingPlanType = z.enum([
  '5k',
  '10k',
  'half_marathon',
  'marathon',
  'ultra',
  'general_fitness',
  'weight_loss',
  'strength',
  'custom'
]);

// Training Phase
export const TrainingPhase = z.enum([
  'base',
  'build',
  'peak',
  'taper',
  'recovery',
  'maintenance'
]);

// Training Plan Schema
export const trainingPlanSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  type: TrainingPlanType,
  status: TrainingPlanStatus.default('draft'),
  phase: TrainingPhase.optional(),
  
  // Duration and scheduling
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  durationWeeks: z.number().positive(),
  
  // Target metrics
  targetDistance: z.number().positive().optional(), // in kilometers
  targetTime: z.string().optional(), // e.g., "3:30:00" for marathon
  targetPace: z.string().optional(), // e.g., "5:00/km"
  
  // Weekly structure
  weeklyVolume: z.number().positive().optional(), // total km per week
  weeklyHours: z.number().positive().optional(), // total hours per week
  sessionsPerWeek: z.number().positive().default(3),
  
  // Relationships
  coachId: z.string(),
  runnerId: z.string(),
  
  // Template and customization
  isTemplate: z.boolean().default(false),
  templateId: z.string().optional(),
  customizations: z.record(z.any()).optional(),
  
  // Progress tracking
  completionPercentage: z.number().min(0).max(100).default(0),
  
  // Metadata
  tags: z.array(z.string()).default([]),
  notes: z.string().optional(),
  
  // Timestamps
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional()
});

// Training Week Schema
export const trainingWeekSchema = z.object({
  id: z.string().optional(),
  planId: z.string(),
  weekNumber: z.number().positive(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  
  // Week goals
  weeklyGoal: z.string().optional(),
  targetVolume: z.number().positive().optional(), // km
  targetHours: z.number().positive().optional(),
  
  // Progress
  actualVolume: z.number().nonnegative().default(0),
  actualHours: z.number().nonnegative().default(0),
  completedSessions: z.number().nonnegative().default(0),
  totalSessions: z.number().positive(),
  
  // Status
  status: z.enum(['upcoming', 'current', 'completed', 'skipped']).default('upcoming'),
  
  // Notes
  coachNotes: z.string().optional(),
  runnerNotes: z.string().optional(),
  
  // Timestamps
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional()
});

// Training Template Schema
export const trainingTemplateSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  type: TrainingPlanType,
  
  // Template structure
  durationWeeks: z.number().positive(),
  sessionsPerWeek: z.number().positive(),
  
  // Template sessions (weekly pattern)
  weeklyTemplate: z.array(z.object({
    dayOfWeek: z.number().min(0).max(6), // 0 = Sunday
    sessionType: z.string(),
    description: z.string().optional(),
    duration: z.number().positive().optional(),
    intensity: z.string().optional()
  })),
  
  // Progression rules
  progressionRules: z.object({
    volumeIncrease: z.number().optional(), // percentage per week
    intensityProgression: z.string().optional(),
    recoveryWeeks: z.array(z.number()).optional() // week numbers for recovery
  }).optional(),
  
  // Metadata
  isPublic: z.boolean().default(false),
  createdBy: z.string(),
  tags: z.array(z.string()).default([]),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  
  // Usage stats
  usageCount: z.number().nonnegative().default(0),
  rating: z.number().min(1).max(5).optional(),
  
  // Timestamps
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional()
});

// Training Goal Schema
export const trainingGoalSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  
  // Goal type and metrics
  type: z.enum(['distance', 'time', 'pace', 'frequency', 'weight', 'custom']),
  targetValue: z.number().positive(),
  currentValue: z.number().nonnegative().default(0),
  unit: z.string(), // e.g., 'km', 'minutes', 'kg'
  
  // Timeline
  targetDate: z.string().datetime().optional(),
  startDate: z.string().datetime(),
  
  // Status
  status: z.enum(['active', 'completed', 'paused', 'cancelled']).default('active'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  
  // Relationships
  userId: z.string(),
  planId: z.string().optional(),
  
  // Progress tracking
  milestones: z.array(z.object({
    value: z.number(),
    date: z.string().datetime().optional(),
    achieved: z.boolean().default(false)
  })).default([]),
  
  // Timestamps
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  completedAt: z.string().datetime().optional()
});

// Create schemas (omit auto-generated fields)
export const createTrainingPlanSchema = trainingPlanSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  completionPercentage: true
});

export const createTrainingWeekSchema = trainingWeekSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  actualVolume: true,
  actualHours: true,
  completedSessions: true
});

export const createTrainingTemplateSchema = trainingTemplateSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  usageCount: true
});

export const createTrainingGoalSchema = trainingGoalSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  completedAt: true,
  currentValue: true
});

// Update schemas (partial with omitted fields)
export const updateTrainingPlanSchema = trainingPlanSchema.partial().omit({
  id: true,
  createdAt: true,
  coachId: true,
  runnerId: true
});

export const updateTrainingWeekSchema = trainingWeekSchema.partial().omit({
  id: true,
  createdAt: true,
  planId: true
});

export const updateTrainingTemplateSchema = trainingTemplateSchema.partial().omit({
  id: true,
  createdAt: true,
  createdBy: true
});

export const updateTrainingGoalSchema = trainingGoalSchema.partial().omit({
  id: true,
  createdAt: true,
  userId: true
});

// Query schemas
export const trainingPlanQuerySchema = z.object({
  coachId: z.string().optional(),
  runnerId: z.string().optional(),
  status: TrainingPlanStatus.optional(),
  type: TrainingPlanType.optional(),
  isTemplate: z.boolean().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(20)
});

export const trainingWeekQuerySchema = z.object({
  planId: z.string().optional(),
  weekNumber: z.number().positive().optional(),
  status: z.enum(['upcoming', 'current', 'completed', 'skipped']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(20)
});

// Type exports
export type TrainingPlan = z.infer<typeof trainingPlanSchema>;
export type CreateTrainingPlan = z.infer<typeof createTrainingPlanSchema>;
export type UpdateTrainingPlan = z.infer<typeof updateTrainingPlanSchema>;
export type TrainingPlanQuery = z.infer<typeof trainingPlanQuerySchema>;

export type TrainingWeek = z.infer<typeof trainingWeekSchema>;
export type CreateTrainingWeek = z.infer<typeof createTrainingWeekSchema>;
export type UpdateTrainingWeek = z.infer<typeof updateTrainingWeekSchema>;
export type TrainingWeekQuery = z.infer<typeof trainingWeekQuerySchema>;

export type TrainingTemplate = z.infer<typeof trainingTemplateSchema>;
export type CreateTrainingTemplate = z.infer<typeof createTrainingTemplateSchema>;
export type UpdateTrainingTemplate = z.infer<typeof updateTrainingTemplateSchema>;

export type TrainingGoal = z.infer<typeof trainingGoalSchema>;
export type CreateTrainingGoal = z.infer<typeof createTrainingGoalSchema>;
export type UpdateTrainingGoal = z.infer<typeof updateTrainingGoalSchema>;

// Enum type exports
export type TrainingPlanStatusType = z.infer<typeof TrainingPlanStatus>;
export type TrainingPlanTypeType = z.infer<typeof TrainingPlanType>;
export type TrainingPhaseType = z.infer<typeof TrainingPhase>;

// Extended types with relationships
export interface TrainingPlanWithSessions extends TrainingPlan {
  weeks: TrainingWeek[];
  sessions: TrainingSession[];
  goals: TrainingGoal[];
}

export interface TrainingWeekWithSessions extends TrainingWeek {
  sessions: TrainingSession[];
}

export interface TrainingPlanSummary {
  id: string;
  title: string;
  type: TrainingPlanTypeType;
  status: TrainingPlanStatusType;
  startDate: string;
  endDate: string;
  completionPercentage: number;
  totalSessions: number;
  completedSessions: number;
  currentWeek: number;
  totalWeeks: number;
}