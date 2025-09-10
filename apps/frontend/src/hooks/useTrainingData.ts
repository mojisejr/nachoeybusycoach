/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import { useFetch, useApiCall } from './useApiCall';
import { trainingApi } from '@/services/trainingApi';
import {
  TrainingPlan,
  TrainingSession,
  WorkoutLog,
  CreateTrainingPlanForm,
  CreateSessionForm,
  LogWorkoutForm,
  CoachFeedbackForm,
  TrainingPlanFilters,
  SessionFilters,
  TrainingStats,
  WorkoutLogFilters,
  CoachFeedback
} from '@/types/training';
import { uiLogger } from '@/lib/logger';

// Training Plans Hooks
export const useTrainingPlans = (filters?: TrainingPlanFilters) => {
  const {
    data: plans,
    loading,
    error,
    execute
  } = useFetch<TrainingPlan[]>();

  useEffect(() => {
    execute(() => trainingApi.plans.getAll(filters));
  }, [execute, filters]);

  return {
    plans: plans || [],
    loading,
    error,
    refetch: () => execute(() => trainingApi.plans.getAll(filters))
  };
};

export const useTrainingPlan = (id: string | null) => {
  const {
    data: plan,
    loading,
    error,
    execute
  } = useFetch<TrainingPlan>();

  useEffect(() => {
    if (id) {
      execute(() => trainingApi.plans.getById(id));
    }
  }, [execute, id]);

  return {
    plan,
    loading,
    error,
    refetch: () => id ? execute(() => trainingApi.plans.getById(id)) : Promise.resolve()
  };
};

export const useRunnerTrainingPlans = (runnerId: string | null) => {
  const {
    data: plans,
    loading,
    error,
    execute
  } = useFetch<TrainingPlan[]>();

  useEffect(() => {
    if (runnerId) {
      execute(() => trainingApi.plans.getByRunnerId(runnerId));
    }
  }, [execute, runnerId]);

  return {
    plans: plans || [],
    loading,
    error,
    refetch: () => runnerId ? execute(() => trainingApi.plans.getByRunnerId(runnerId)) : Promise.resolve()
  };
};

export const useCoachTrainingPlans = (coachId: string | null) => {
  const {
    data: plans,
    loading,
    error,
    execute
  } = useFetch<TrainingPlan[]>();

  useEffect(() => {
    if (coachId) {
      execute(() => trainingApi.plans.getByCoachId(coachId));
    }
  }, [execute, coachId]);

  return {
    plans: plans || [],
    loading,
    error,
    refetch: () => coachId ? execute(() => trainingApi.plans.getByCoachId(coachId)) : Promise.resolve()
  };
};

export const useTrainingPlanStats = (planId: string | null) => {
  const {
    data: stats,
    loading,
    error,
    execute
  } = useFetch<TrainingStats | null>();

  useEffect(() => {
    if (planId) {
      execute(() => trainingApi.plans.getStats(planId));
    }
  }, [execute, planId]);

  return {
    stats,
    loading,
    error,
    refetch: () => planId ? execute(() => trainingApi.plans.getStats(planId)) : Promise.resolve()
  };
};

// Training Plan Mutations
export const useCreateTrainingPlan = () => {
  const { execute, loading, error } = useApiCall<TrainingPlan>();

  const createPlan = useCallback(async (data: CreateTrainingPlanForm) => {
    uiLogger.userAction('create_training_plan', `Creating plan: ${data.title}`);
    return await execute(() => trainingApi.plans.create(data));
  }, [execute]);

  return {
    createPlan,
    loading,
    error
  };
};

export const useUpdateTrainingPlan = () => {
  const { execute, loading, error } = useApiCall<TrainingPlan>();

  const updatePlan = useCallback(async (id: string, data: Partial<CreateTrainingPlanForm>) => {
    uiLogger.userAction('update_training_plan', `Updating plan: ${id}`);
    return await execute(() => trainingApi.plans.update(id, data));
  }, [execute]);

  return {
    updatePlan,
    loading,
    error
  };
};

export const useDeleteTrainingPlan = () => {
  const { execute, loading, error } = useApiCall<void>();

  const deletePlan = useCallback(async (id: string) => {
    uiLogger.userAction('delete_training_plan', `Deleting plan: ${id}`);
    return await execute(() => trainingApi.plans.delete(id));
  }, [execute]);

  return {
    deletePlan,
    loading,
    error
  };
};

// Training Sessions Hooks
export const useTrainingSessions = (filters?: SessionFilters) => {
  const {
    data: sessions,
    loading,
    error,
    execute
  } = useFetch<TrainingSession[]>();

  useEffect(() => {
    execute(() => trainingApi.sessions.getAll(filters));
  }, [execute, filters]);

  return {
    sessions: sessions || [],
    loading,
    error,
    refetch: () => execute(() => trainingApi.sessions.getAll(filters))
  };
};

export const useTrainingSession = (id: string | null) => {
  const {
    data: session,
    loading,
    error,
    execute
  } = useFetch<TrainingSession>();

  useEffect(() => {
    if (id) {
      execute(() => trainingApi.sessions.getById(id));
    }
  }, [execute, id]);

  return {
    session,
    loading,
    error,
    refetch: () => id ? execute(() => trainingApi.sessions.getById(id)) : Promise.resolve()
  };
};

export const usePlanSessions = (planId: string | null) => {
  const {
    data: sessions,
    loading,
    error,
    execute
  } = useFetch<TrainingSession[]>();

  useEffect(() => {
    if (planId) {
      execute(() => trainingApi.sessions.getByPlanId(planId));
    }
  }, [execute, planId]);

  return {
    sessions: sessions || [],
    loading,
    error,
    refetch: () => planId ? execute(() => trainingApi.sessions.getByPlanId(planId)) : Promise.resolve()
  };
};

export const useRunnerSessions = (runnerId: string | null) => {
  const {
    data: sessions,
    loading,
    error,
    execute
  } = useFetch<TrainingSession[]>();

  useEffect(() => {
    if (runnerId) {
      execute(() => trainingApi.sessions.getByRunnerId(runnerId));
    }
  }, [execute, runnerId]);

  return {
    sessions: sessions || [],
    loading,
    error,
    refetch: () => runnerId ? execute(() => trainingApi.sessions.getByRunnerId(runnerId)) : Promise.resolve()
  };
};

export const useSessionsByDateRange = (startDate: string, endDate: string, runnerId?: string) => {
  const {
    data: sessions,
    loading,
    error,
    execute
  } = useFetch<TrainingSession[]>();

  useEffect(() => {
    execute(() => trainingApi.sessions.getByDateRange(startDate, endDate, runnerId));
  }, [execute, startDate, endDate, runnerId]);

  return {
    sessions: sessions || [],
    loading,
    error,
    refetch: () => execute(() => trainingApi.sessions.getByDateRange(startDate, endDate, runnerId))
  };
};

// Training Session Mutations
export const useCreateTrainingSession = () => {
  const { execute, loading, error } = useApiCall<TrainingSession>();

  const createSession = useCallback(async (data: CreateSessionForm) => {
    uiLogger.userAction('create_training_session', `Creating session: ${data.type}`);
    return await execute(() => trainingApi.sessions.create(data));
  }, [execute]);

  return {
    createSession,
    loading,
    error
  };
};

export const useUpdateTrainingSession = () => {
  const { execute, loading, error } = useApiCall<TrainingSession>();

  const updateSession = useCallback(async (id: string, data: Partial<CreateSessionForm>) => {
    uiLogger.userAction('update_training_session', `Updating session: ${id}`);
    return await execute(() => trainingApi.sessions.update(id, data));
  }, [execute]);

  return {
    updateSession,
    loading,
    error
  };
};

export const useDeleteTrainingSession = () => {
  const { execute, loading, error } = useApiCall<void>();

  const deleteSession = useCallback(async (id: string) => {
    uiLogger.userAction('delete_training_session', `Deleting session: ${id}`);
    return await execute(() => trainingApi.sessions.delete(id));
  }, [execute]);

  return {
    deleteSession,
    loading,
    error
  };
};

export const useUpdateSessionStatus = () => {
  const { execute, loading, error } = useApiCall<TrainingSession>();

  const updateStatus = useCallback(async (id: string, status: TrainingSession['status']) => {
    uiLogger.userAction('update_session_status', `Updating session ${id} status to ${status}`);
    return await execute(() => trainingApi.sessions.updateStatus(id, status));
  }, [execute]);

  return {
    updateStatus,
    loading,
    error
  };
};

// Workout Log Hooks
export const useWorkoutLogs = (sessionId?: string, filters?: WorkoutLogFilters) => {
  const { data, loading, error, execute } = useFetch<WorkoutLog[]>();

  useEffect(() => {
    if (sessionId) {
      execute(async () => {
        const log = await trainingApi.workoutLogs.getBySessionId(sessionId);
        return log ? [log] : [];
      });
    }
  }, [execute, sessionId, filters]);

  return {
    logs: data || [],
    loading,
    error,
    refetch: () => {
      if (sessionId) {
        execute(async () => {
          const log = await trainingApi.workoutLogs.getBySessionId(sessionId);
          return log ? [log] : [];
        });
      }
    }
  };
};

export const useWorkoutLog = (sessionId: string | null) => {
  const {
    data: workoutLog,
    loading,
    error,
    execute
  } = useFetch<WorkoutLog | null>();

  useEffect(() => {
    if (sessionId) {
      execute(() => trainingApi.workoutLogs.getBySessionId(sessionId));
    }
  }, [execute, sessionId]);

  return {
    workoutLog,
    loading,
    error,
    refetch: () => sessionId ? execute(() => trainingApi.workoutLogs.getBySessionId(sessionId)) : Promise.resolve()
  };
};

export const useWorkoutLogById = (id: string) => {
  const { data, loading, error, execute } = useFetch<WorkoutLog>();

  useEffect(() => {
    if (id) {
      execute(() => trainingApi.workoutLogs.getById(id));
    }
  }, [execute, id]);

  return {
    log: data,
    loading,
    error,
    refetch: () => execute(() => trainingApi.workoutLogs.getById(id))
  };
};

export const useRunnerWorkoutLogs = (runnerId: string | null) => {
  const {
    data: workoutLogs,
    loading,
    error,
    execute
  } = useFetch<WorkoutLog[]>();

  useEffect(() => {
    if (runnerId) {
      execute(() => trainingApi.workoutLogs.getByRunnerId(runnerId));
    }
  }, [execute, runnerId]);

  return {
    workoutLogs: workoutLogs || [],
    loading,
    error,
    refetch: () => runnerId ? execute(() => trainingApi.workoutLogs.getByRunnerId(runnerId)) : Promise.resolve()
  };
};

// Workout Log Mutations
export const useLogWorkout = () => {
  const { execute, loading, error } = useApiCall<WorkoutLog>();

  const logWorkout = useCallback(async (data: LogWorkoutForm) => {
    uiLogger.userAction('log_workout', `Creating log for session: ${data.sessionId}`);
    return await execute(() => trainingApi.workoutLogs.create(data));
  }, [execute]);

  return {
    logWorkout,
    loading,
    error
  };
};

export const useUpdateWorkoutLog = () => {
  const { execute, loading, error } = useApiCall<WorkoutLog>();

  const updateWorkoutLog = useCallback(async (id: string, data: Partial<LogWorkoutForm>) => {
    uiLogger.userAction('update_workout_log', `Updating log: ${id}`);
    return await execute(() => trainingApi.workoutLogs.update(id, data));
  }, [execute]);

  return {
    updateWorkoutLog,
    loading,
    error
  };
};

export const useDeleteWorkoutLog = () => {
  const { execute, loading, error } = useApiCall<void>();

  const deleteWorkoutLog = useCallback(async (id: string) => {
    uiLogger.userAction('delete_workout_log', `Deleting log: ${id}`);
    return await execute(() => trainingApi.workoutLogs.delete(id));
  }, [execute]);

  return {
    deleteWorkoutLog,
    loading,
    error
  };
};

// Coach Feedback Data Fetching
export const useCoachFeedback = (workoutLogId: string) => {
  const { data, loading, error, execute } = useFetch<CoachFeedback[]>();

  useEffect(() => {
    if (workoutLogId) {
      // Note: This method doesn't exist in the API, need to implement or use alternative
      execute(() => Promise.resolve([]));
    }
  }, [execute, workoutLogId]);

  return {
    feedback: data || [],
    loading,
    error,
    refetch: () => execute(() => Promise.resolve([]))
  };
};

// Coach Feedback Hooks
export const useAddCoachFeedback = () => {
  const { execute, loading, error } = useApiCall<WorkoutLog>();

  const addFeedback = useCallback(async (workoutLogId: string, data: CoachFeedbackForm) => {
    uiLogger.userAction('add_coach_feedback', `Adding feedback for log: ${workoutLogId}`);
    return await execute(() => trainingApi.feedback.addFeedback(workoutLogId, data));
  }, [execute]);

  return {
    addFeedback,
    loading,
    error
  };
};

export const useUpdateCoachFeedback = () => {
  const { execute, loading, error } = useApiCall<WorkoutLog>();

  const updateFeedback = useCallback(async (workoutLogId: string, feedbackId: string, data: Partial<CoachFeedbackForm>) => {
    uiLogger.userAction('update_coach_feedback', `Updating feedback ${feedbackId} for log: ${workoutLogId}`);
    return await execute(() => trainingApi.feedback.updateFeedback(workoutLogId, feedbackId, data));
  }, [execute]);

  return {
    updateFeedback,
    loading,
    error
  };
};

export const useMarkFeedbackAsReviewed = () => {
  const { execute, loading, error } = useApiCall<WorkoutLog>();

  const markAsReviewed = useCallback(async (workoutLogId: string, feedbackId: string) => {
    uiLogger.userAction('mark_feedback_reviewed', `Marking feedback ${feedbackId} as reviewed for log: ${workoutLogId}`);
    return await execute(() => trainingApi.feedback.markAsReviewed(workoutLogId, feedbackId));
  }, [execute]);

  return {
    markAsReviewed,
    loading,
    error
  };
};

// Combined hooks for common use cases
export const useSessionWithLog = (sessionId: string | null) => {
  const { session, loading: sessionLoading, error: sessionError, refetch: refetchSession } = useTrainingSession(sessionId);
  const { workoutLog, loading: logLoading, error: logError, refetch: refetchLog } = useWorkoutLog(sessionId);

  const refetch = useCallback(() => {
    refetchSession();
    refetchLog();
  }, [refetchSession, refetchLog]);

  return {
    session,
    workoutLog,
    loading: sessionLoading || logLoading,
    error: sessionError || logError,
    refetch
  };
};

export const usePlanWithSessions = (planId: string | null) => {
  const { plan, loading: planLoading, error: planError, refetch: refetchPlan } = useTrainingPlan(planId);
  const { sessions, loading: sessionsLoading, error: sessionsError, refetch: refetchSessions } = usePlanSessions(planId);
  const { stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useTrainingPlanStats(planId);

  const refetch = useCallback(() => {
    refetchPlan();
    refetchSessions();
    refetchStats();
  }, [refetchPlan, refetchSessions, refetchStats]);

  return {
    plan,
    sessions,
    stats,
    loading: planLoading || sessionsLoading || statsLoading,
    error: planError || sessionsError || statsError,
    refetch
  };
};

// Training Statistics
export const useTrainingStats = (userId?: string, dateRange?: { start: Date; end: Date }) => {
  const { data, loading, error, execute } = useFetch<TrainingStats>();

  useEffect(() => {
    // Note: Stats API not implemented yet
    execute(() => Promise.resolve({} as TrainingStats));
  }, [execute, userId, dateRange]);

  return {
    stats: data,
    loading,
    error,
    refetch: () => execute(() => Promise.resolve({} as TrainingStats))
  };
};

// Cache management hook
export const useTrainingDataCache = () => {
  const [cacheKeys, setCacheKeys] = useState<string[]>([]);

  const invalidateCache = useCallback((pattern?: string) => {
    uiLogger.userAction('invalidate_cache', 'TrainingDataCache', { pattern: pattern || 'all' });
    // This would integrate with your caching solution
    // For now, we'll just track cache keys
    if (pattern) {
      setCacheKeys(prev => prev.filter(key => !key.includes(pattern || '')));
    } else {
      setCacheKeys([]);
    }
  }, []);

  const addCacheKey = useCallback((key: string) => {
    setCacheKeys(prev => [...new Set([...prev, key])]);
  }, []);

  return {
    cacheKeys,
    invalidateCache,
    addCacheKey
  };
};