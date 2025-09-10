// Training Plan Types
export interface TrainingPlan {
  _id: string;
  title: string;
  description?: string;
  runnerId: string;
  coachId: string;
  weekStart: string; // ISO date string
  weekEnd: string; // ISO date string
  status: 'draft' | 'active' | 'completed' | 'archived';
  sessions: TrainingSession[];
  createdAt: string;
  updatedAt: string;
}

// Training Session Types
export interface TrainingSession {
  _id: string;
  planId: string;
  date: string; // ISO date string
  title: string;
  description?: string;
  type: SessionType;
  distance?: number; // in kilometers
  duration?: number; // in minutes
  intensity: IntensityLevel;
  notes?: string;
  status: SessionStatus;
  workoutLog?: WorkoutLog;
  createdAt: string;
  updatedAt: string;
}

export type SessionType = 
  | 'easy_run'
  | 'tempo_run'
  | 'interval'
  | 'long_run'
  | 'recovery'
  | 'cross_training'
  | 'rest'
  | 'race'
  | 'custom';

export type IntensityLevel = 
  | 'very_easy' // Zone 1
  | 'easy' // Zone 2
  | 'moderate' // Zone 3
  | 'hard' // Zone 4
  | 'very_hard'; // Zone 5

export type SessionStatus = 
  | 'scheduled' // Session is planned but not yet done
  | 'completed' // Session completed successfully
  | 'dnf' // Did Not Finish
  | 'skipped' // Intentionally skipped
  | 'missed'; // Unintentionally missed

// Workout Log Types (when runner completes a session)
export interface WorkoutLog {
  _id: string;
  sessionId: string;
  runnerId: string;
  completedAt: string; // ISO date string
  actualDistance?: number; // in kilometers
  actualDuration?: number; // in minutes
  avgPace?: string; // e.g., "5:30" (min:sec per km)
  avgHeartRate?: number;
  maxHeartRate?: number;
  effort: EffortLevel;
  feeling: FeelingLevel;
  notes?: string;
  injuries?: InjuryReport[];
  externalLinks?: ExternalLink[];
  coachFeedback?: CoachFeedback;
  createdAt: string;
  updatedAt: string;
}

export type EffortLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type FeelingLevel = 
  | 'terrible'
  | 'bad'
  | 'okay'
  | 'good'
  | 'great';

export interface InjuryReport {
  bodyPart: string;
  severity: 'minor' | 'moderate' | 'severe';
  description: string;
}

export interface ExternalLink {
  platform: 'strava' | 'garmin' | 'polar' | 'other';
  url: string;
  activityId?: string;
}

export interface CoachFeedback {
  _id: string;
  coachId: string;
  message: string;
  rating?: 1 | 2 | 3 | 4 | 5; // Coach's rating of the session
  reviewed: boolean;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface TrainingPlanResponse {
  success: boolean;
  data: TrainingPlan;
  message?: string;
}

export interface TrainingPlansResponse {
  success: boolean;
  data: TrainingPlan[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

export interface SessionResponse {
  success: boolean;
  data: TrainingSession;
  message?: string;
}

export interface SessionsResponse {
  success: boolean;
  data: TrainingSession[];
  message?: string;
}

export interface WorkoutLogResponse {
  success: boolean;
  data: WorkoutLog;
  message?: string;
}

// Form Types
export interface CreateTrainingPlanForm {
  title: string;
  description?: string;
  runnerId: string;
  weekStart: string;
  weekEnd: string;
}

export interface CreateSessionForm {
  planId: string;
  date: string;
  title: string;
  description?: string;
  type: SessionType;
  distance?: number;
  duration?: number;
  intensity: IntensityLevel;
  notes?: string;
}

export interface LogWorkoutForm {
  sessionId: string;
  actualDistance?: number;
  actualDuration?: number;
  avgPace?: string;
  avgHeartRate?: number;
  maxHeartRate?: number;
  effort: EffortLevel;
  feeling: FeelingLevel;
  notes?: string;
  injuries?: Omit<InjuryReport, 'id'>[];
  externalLinks?: Omit<ExternalLink, 'id'>[];
}

export interface CoachFeedbackForm {
  sessionId: string;
  message: string;
  rating?: 1 | 2 | 3 | 4 | 5;
}

// Filter and Query Types
export interface TrainingPlanFilters {
  runnerId?: string;
  coachId?: string;
  status?: TrainingPlan['status'];
  dateFrom?: string;
  dateTo?: string;
}

export interface SessionFilters {
  planId?: string;
  runnerId?: string;
  type?: SessionType;
  status?: SessionStatus;
  dateFrom?: string;
  dateTo?: string;
  intensity?: IntensityLevel;
}

export interface WorkoutLogFilters {
  sessionId?: string;
  runnerId?: string;
  effort?: EffortLevel;
  feeling?: FeelingLevel;
  dateFrom?: string;
  dateTo?: string;
}

// Statistics Types
export interface TrainingStats {
  totalSessions: number;
  completedSessions: number;
  totalDistance: number;
  totalDuration: number;
  avgPace?: string;
  completionRate: number;
  weeklyStats: WeeklyStats[];
}

export interface WeeklyStats {
  weekStart: string;
  weekEnd: string;
  plannedSessions: number;
  completedSessions: number;
  totalDistance: number;
  totalDuration: number;
  completionRate: number;
}

// Utility Types
export type TrainingPlanWithStats = TrainingPlan & {
  stats: TrainingStats;
};

export type SessionWithLog = TrainingSession & {
  workoutLog?: WorkoutLog;
};

// Constants
export const SESSION_TYPE_LABELS: Record<SessionType, string> = {
  easy_run: 'Easy Run',
  tempo_run: 'Tempo Run',
  interval: 'Interval Training',
  long_run: 'Long Run',
  recovery: 'Recovery Run',
  cross_training: 'Cross Training',
  rest: 'Rest Day',
  race: 'Race',
  custom: 'Custom Workout'
};

export const INTENSITY_LABELS: Record<IntensityLevel, string> = {
  very_easy: 'Very Easy (Zone 1)',
  easy: 'Easy (Zone 2)',
  moderate: 'Moderate (Zone 3)',
  hard: 'Hard (Zone 4)',
  very_hard: 'Very Hard (Zone 5)'
};

export const STATUS_LABELS: Record<SessionStatus, string> = {
  scheduled: 'Scheduled',
  completed: 'Completed',
  dnf: 'Did Not Finish',
  skipped: 'Skipped',
  missed: 'Missed'
};

export const FEELING_LABELS: Record<FeelingLevel, string> = {
  terrible: 'Terrible 😞',
  bad: 'Bad 😕',
  okay: 'Okay 😐',
  good: 'Good 😊',
  great: 'Great 😄'
};