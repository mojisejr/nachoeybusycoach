export interface TrainingPlan {
  id: string;
  runnerId: string;
  coachId: string;
  weekStartDate: Date;
  sessions: TrainingSession[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TrainingSession {
  id: string;
  planId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  date: Date;
  type: SessionType;
  title: string;
  description?: string;
  distance?: number; // in kilometers
  duration?: number; // in minutes
  intensity?: IntensityLevel;
  pace?: string; // e.g., "5:30/km"
  notes?: string;
  status: SessionStatus;
  workoutLog?: WorkoutLog;
  createdAt: Date;
  updatedAt: Date;
}

export type SessionType = 
  | 'easy_run'
  | 'tempo_run'
  | 'interval'
  | 'long_run'
  | 'recovery_run'
  | 'speed_work'
  | 'cross_training'
  | 'rest';

export type IntensityLevel = 
  | 'very_easy'
  | 'easy'
  | 'moderate'
  | 'hard'
  | 'very_hard';

export type SessionStatus = 
  | 'scheduled'
  | 'completed'
  | 'dnf' // Did Not Finish
  | 'skipped'
  | 'cancelled';

export interface WorkoutLog {
  id: string;
  sessionId: string;
  runnerId: string;
  status: SessionStatus;
  actualDistance?: number;
  actualDuration?: number;
  actualPace?: string;
  externalLinks?: {
    strava?: string;
    garmin?: string;
    other?: string;
  };
  personalNotes?: string;
  feelings?: FeelingLevel;
  injuries?: string;
  reviewStatus: ReviewStatus;
  coachFeedback?: string;
  submittedAt: Date;
  reviewedAt?: Date;
}

export type FeelingLevel = 
  | 'terrible'
  | 'bad'
  | 'okay'
  | 'good'
  | 'excellent';

export type ReviewStatus = 
  | 'pending'
  | 'reviewed'
  | 'needs_attention';

export interface Feedback {
  id: string;
  workoutLogId: string;
  coachId: string;
  runnerId: string;
  message: string;
  type: FeedbackType;
  createdAt: Date;
}

export type FeedbackType = 
  | 'general'
  | 'encouragement'
  | 'correction'
  | 'advice'
  | 'concern';