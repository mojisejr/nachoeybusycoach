import { create } from 'zustand';
import type { 
  TrainingPlan, 
  TrainingSession, 
  WorkoutLog, 
  SessionStatus,
  LoadingState 
} from '@nachoeybusycoach/types';

interface TrainingState {
  // Current training plan
  currentPlan: TrainingPlan | null;
  
  // Weekly sessions
  weekSessions: TrainingSession[];
  
  // Workout logs
  workoutLogs: WorkoutLog[];
  
  // Selected week date
  selectedWeek: Date;
  
  // Loading states
  planLoading: LoadingState;
  sessionsLoading: LoadingState;
  logsLoading: LoadingState;
  
  // Actions
  setCurrentPlan: (plan: TrainingPlan | null) => void;
  setWeekSessions: (sessions: TrainingSession[]) => void;
  setWorkoutLogs: (logs: WorkoutLog[]) => void;
  setSelectedWeek: (date: Date) => void;
  
  // Loading actions
  setPlanLoading: (state: LoadingState) => void;
  setSessionsLoading: (state: LoadingState) => void;
  setLogsLoading: (state: LoadingState) => void;
  
  // Session actions
  updateSessionStatus: (sessionId: string, status: SessionStatus) => void;
  addWorkoutLog: (log: WorkoutLog) => void;
  updateWorkoutLog: (logId: string, updates: Partial<WorkoutLog>) => void;
  
  // Reset actions
  resetTrainingData: () => void;
}

const initialState = {
  currentPlan: null,
  weekSessions: [],
  workoutLogs: [],
  selectedWeek: new Date(),
  planLoading: 'idle' as LoadingState,
  sessionsLoading: 'idle' as LoadingState,
  logsLoading: 'idle' as LoadingState
};

export const useTrainingStore = create<TrainingState>()((set, get) => ({
  ...initialState,

  setCurrentPlan: (plan) => {
    set({ currentPlan: plan });
  },

  setWeekSessions: (sessions) => {
    set({ weekSessions: sessions });
  },

  setWorkoutLogs: (logs) => {
    set({ workoutLogs: logs });
  },

  setSelectedWeek: (date) => {
    set({ selectedWeek: date });
  },

  setPlanLoading: (state) => {
    set({ planLoading: state });
  },

  setSessionsLoading: (state) => {
    set({ sessionsLoading: state });
  },

  setLogsLoading: (state) => {
    set({ logsLoading: state });
  },

  updateSessionStatus: (sessionId, status) => {
    const sessions = get().weekSessions;
    const updatedSessions = sessions.map(session => 
      session.id === sessionId 
        ? { ...session, status }
        : session
    );
    set({ weekSessions: updatedSessions });
  },

  addWorkoutLog: (log) => {
    const logs = get().workoutLogs;
    set({ workoutLogs: [log, ...logs] });
  },

  updateWorkoutLog: (logId, updates) => {
    const logs = get().workoutLogs;
    const updatedLogs = logs.map(log => 
      log.id === logId 
        ? { ...log, ...updates }
        : log
    );
    set({ workoutLogs: updatedLogs });
  },

  resetTrainingData: () => {
    set(initialState);
  }
}));

// Selectors
export const useCurrentPlan = () => useTrainingStore((state) => state.currentPlan);
export const useWeekSessions = () => useTrainingStore((state) => state.weekSessions);
export const useWorkoutLogs = () => useTrainingStore((state) => state.workoutLogs);
export const useSelectedWeek = () => useTrainingStore((state) => state.selectedWeek);

// Loading selectors
export const usePlanLoading = () => useTrainingStore((state) => state.planLoading);
export const useSessionsLoading = () => useTrainingStore((state) => state.sessionsLoading);
export const useLogsLoading = () => useTrainingStore((state) => state.logsLoading);

// Computed selectors
export const useSessionById = (sessionId: string) => {
  return useTrainingStore((state) => 
    state.weekSessions.find(session => session.id === sessionId)
  );
};

export const useLogsBySessionId = (sessionId: string) => {
  return useTrainingStore((state) => 
    state.workoutLogs.filter(log => log.sessionId === sessionId)
  );
};