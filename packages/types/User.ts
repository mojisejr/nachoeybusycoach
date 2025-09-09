import { z } from 'zod';

// User Role Enum
export const UserRole = z.enum([
  'runner',
  'coach',
  'admin'
]);

// User Status Enum
export const UserStatus = z.enum([
  'active',
  'inactive',
  'suspended'
]);

// Base User Schema
export const userSchema = z.object({
  id: z.string().optional(),
  email: z.string().email('Invalid email format'),
  name: z.string().min(1, 'Name is required'),
  image: z.string().url().optional(),
  role: UserRole,
  status: UserStatus.default('active'),
  
  // Profile information
  dateOfBirth: z.string().datetime().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  
  // Running specific data
  runningExperience: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  personalBest: z.object({
    marathon: z.string().optional(), // e.g., "3:45:30"
    halfMarathon: z.string().optional(),
    tenK: z.string().optional(),
    fiveK: z.string().optional()
  }).optional(),
  
  // Coach specific data
  certifications: z.array(z.string()).optional(),
  specializations: z.array(z.string()).optional(),
  yearsOfExperience: z.number().positive().optional(),
  
  // Relationships
  coachId: z.string().optional(), // For runners
  runnerIds: z.array(z.string()).optional(), // For coaches
  
  // OAuth provider data
  providers: z.array(z.object({
    provider: z.enum(['google', 'facebook', 'line']),
    providerId: z.string(),
    connectedAt: z.string().datetime()
  })).optional(),
  
  // Timestamps
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  lastLoginAt: z.string().datetime().optional()
});

// Create User Schema (for registration)
export const createUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLoginAt: true
});

// Update User Schema (for profile updates)
export const updateUserSchema = userSchema.partial().omit({
  id: true,
  createdAt: true,
  email: true // Email should not be updatable
});

// User Query Schema
export const userQuerySchema = z.object({
  role: UserRole.optional(),
  status: UserStatus.optional(),
  coachId: z.string().optional(),
  search: z.string().optional(), // Search by name or email
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(20)
});

// Coach-Runner Relationship Schema
export const coachRunnerRelationshipSchema = z.object({
  id: z.string().optional(),
  coachId: z.string(),
  runnerId: z.string(),
  status: z.enum(['pending', 'active', 'inactive']).default('pending'),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  notes: z.string().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional()
});

// Type exports
// Notification Preferences Schema
export const notificationPreferencesSchema = z.object({
  email: z.object({
    trainingReminders: z.boolean().default(true),
    coachFeedback: z.boolean().default(true),
    weeklyReports: z.boolean().default(true),
    systemUpdates: z.boolean().default(false)
  }),
  push: z.object({
    trainingReminders: z.boolean().default(true),
    coachFeedback: z.boolean().default(true),
    workoutCompleted: z.boolean().default(false),
    socialUpdates: z.boolean().default(false)
  }),
  sms: z.object({
    emergencyOnly: z.boolean().default(false),
    trainingReminders: z.boolean().default(false)
  })
});

// Privacy Settings Schema
export const privacySettingsSchema = z.object({
  profileVisibility: z.enum(['public', 'coaches_only', 'private']).default('coaches_only'),
  workoutVisibility: z.enum(['public', 'coaches_only', 'private']).default('coaches_only'),
  shareWithStrava: z.boolean().default(false),
  shareWithGarmin: z.boolean().default(false),
  allowDataExport: z.boolean().default(true)
});

// User Preferences Schema
export const userPreferencesSchema = z.object({
  units: z.object({
    distance: z.enum(['km', 'miles']).default('km'),
    pace: z.enum(['min_per_km', 'min_per_mile']).default('min_per_km'),
    temperature: z.enum(['celsius', 'fahrenheit']).default('celsius'),
    weight: z.enum(['kg', 'lbs']).default('kg')
  }),
  timezone: z.string().default('UTC'),
  language: z.string().default('en'),
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: notificationPreferencesSchema,
  privacy: privacySettingsSchema
});

// Coach Profile Schema
export const coachProfileSchema = z.object({
  bio: z.string().optional(),
  certifications: z.array(z.object({
    name: z.string(),
    issuer: z.string(),
    dateObtained: z.string().datetime(),
    expiryDate: z.string().datetime().optional(),
    certificateUrl: z.string().url().optional()
  })).default([]),
  specializations: z.array(z.enum([
    '5k', '10k', 'half_marathon', 'marathon', 'ultra',
    'trail_running', 'track', 'triathlon', 'weight_loss',
    'beginner_friendly', 'elite_training'
  ])).default([]),
  yearsOfExperience: z.number().nonnegative().optional(),
  maxRunners: z.number().positive().default(20),
  currentRunners: z.number().nonnegative().default(0),
  hourlyRate: z.number().positive().optional(),
  availability: z.object({
    monday: z.array(z.string()).default([]), // e.g., ['09:00', '17:00']
    tuesday: z.array(z.string()).default([]),
    wednesday: z.array(z.string()).default([]),
    thursday: z.array(z.string()).default([]),
    friday: z.array(z.string()).default([]),
    saturday: z.array(z.string()).default([]),
    sunday: z.array(z.string()).default([])
  }).optional(),
  acceptingNewRunners: z.boolean().default(true)
});

// Runner Profile Schema
export const runnerProfileSchema = z.object({
  goals: z.array(z.string()).default([]),
  runningHistory: z.object({
    startedRunning: z.string().datetime().optional(),
    previousInjuries: z.array(z.object({
      type: z.string(),
      date: z.string().datetime(),
      recovered: z.boolean().default(false)
    })).default([]),
    currentWeeklyMileage: z.number().nonnegative().optional()
  }).optional(),
  healthMetrics: z.object({
    restingHeartRate: z.number().positive().optional(),
    maxHeartRate: z.number().positive().optional(),
    weight: z.number().positive().optional(),
    height: z.number().positive().optional(), // in cm
    bodyFatPercentage: z.number().min(0).max(100).optional()
  }).optional(),
  emergencyContact: z.object({
    name: z.string(),
    phone: z.string(),
    relationship: z.string()
  }).optional()
});

// Extended User Schema with profiles
export const extendedUserSchema = userSchema.extend({
  preferences: userPreferencesSchema.optional(),
  coachProfile: coachProfileSchema.optional(),
  runnerProfile: runnerProfileSchema.optional()
});

// User Statistics Schema
export const userStatsSchema = z.object({
  userId: z.string(),
  period: z.enum(['week', 'month', 'quarter', 'year', 'all_time']),
  
  // Running stats
  totalDistance: z.number().nonnegative().default(0), // in km
  totalWorkouts: z.number().nonnegative().default(0),
  totalDuration: z.number().nonnegative().default(0), // in hours
  averagePace: z.number().positive().optional(), // seconds per km
  
  // Consistency
  workoutsPerWeek: z.number().nonnegative().default(0),
  longestStreak: z.number().nonnegative().default(0), // days
  currentStreak: z.number().nonnegative().default(0), // days
  
  // Personal records
  personalRecords: z.array(z.object({
    distance: z.string(),
    time: z.number().positive(),
    date: z.string().datetime(),
    pace: z.number().positive()
  })).default([]),
  
  // Goals achieved
  goalsCompleted: z.number().nonnegative().default(0),
  goalsInProgress: z.number().nonnegative().default(0)
});

// Create schemas for extended types
export const createCoachProfileSchema = coachProfileSchema.omit({});
export const createRunnerProfileSchema = runnerProfileSchema.omit({});
export const updateCoachProfileSchema = coachProfileSchema.partial();
export const updateRunnerProfileSchema = runnerProfileSchema.partial();
export const updateUserPreferencesSchema = userPreferencesSchema.partial();

// Relationship management schemas
export const createRelationshipSchema = coachRunnerRelationshipSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const updateRelationshipSchema = coachRunnerRelationshipSchema.partial().omit({
  id: true,
  createdAt: true,
  coachId: true,
  runnerId: true
});

// Type exports
export type User = z.infer<typeof userSchema>;
export type ExtendedUser = z.infer<typeof extendedUserSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type UserQuery = z.infer<typeof userQuerySchema>;
export type UserStats = z.infer<typeof userStatsSchema>;

export type CoachRunnerRelationship = z.infer<typeof coachRunnerRelationshipSchema>;
export type CreateRelationship = z.infer<typeof createRelationshipSchema>;
export type UpdateRelationship = z.infer<typeof updateRelationshipSchema>;

export type CoachProfile = z.infer<typeof coachProfileSchema>;
export type RunnerProfile = z.infer<typeof runnerProfileSchema>;
export type UserPreferences = z.infer<typeof userPreferencesSchema>;
export type NotificationPreferences = z.infer<typeof notificationPreferencesSchema>;
export type PrivacySettings = z.infer<typeof privacySettingsSchema>;

export type UserRoleType = z.infer<typeof UserRole>;
export type UserStatusType = z.infer<typeof UserStatus>;

// Utility types
export interface UserWithStats extends User {
  stats: UserStats;
}

export interface CoachWithRunners extends User {
  coachProfile: CoachProfile;
  runners: User[];
  activeRelationships: CoachRunnerRelationship[];
}

export interface RunnerWithCoach extends User {
  runnerProfile: RunnerProfile;
  coach?: User;
  relationship?: CoachRunnerRelationship;
}

export interface UserSearchResult {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: UserRoleType;
  status: UserStatusType;
  lastActive?: string;
}