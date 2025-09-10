import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { trainingApi } from '../services/trainingApi';
import { logger } from '../lib/logger';

// Types
interface TrainingState {
  // Data
  trainingPlans: any[];
  trainingSessions: any[];
  workoutLogs: any[];
  stats: any;
  
  // UI State
  isLoading: boolean;
  error: string | null;
  selectedPlan: any;
  selectedSession: any;
  
  // Filters
  planFilters: Record<string, any>;
  sessionFilters: Record<string, any>;
  
  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Training Plans
  fetchTrainingPlans: (filters?: Record<string, any>) => Promise<void>;
  createTrainingPlan: (planData: any) => Promise<void>;
  updateTrainingPlan: (id: string, updates: any) => Promise<void>;
  deleteTrainingPlan: (id: string) => Promise<void>;
  setSelectedPlan: (plan: any) => void;
  
  // Training Sessions
  fetchTrainingSessions: (filters?: Record<string, any>) => Promise<void>;
  createTrainingSession: (sessionData: any) => Promise<void>;
  updateTrainingSession: (id: string, updates: any) => Promise<void>;
  deleteTrainingSession: (id: string) => Promise<void>;
  setSelectedSession: (session: any) => void;
  
  // Workout Logs
  fetchWorkoutLogs: (sessionId?: string) => Promise<void>;
  createWorkoutLog: (logData: any) => Promise<void>;
  updateWorkoutLog: (id: string, updates: any) => Promise<void>;
  
  // Stats
  fetchStats: (planId?: string) => Promise<void>;
  
  // Filters
  setPlanFilters: (filters: Record<string, any>) => void;
  setSessionFilters: (filters: Record<string, any>) => void;
  
  // Reset
  reset: () => void;
}

const initialState = {
  trainingPlans: [],
  trainingSessions: [],
  workoutLogs: [],
  stats: null,
  isLoading: false,
  error: null,
  selectedPlan: null,
  selectedSession: null,
  planFilters: {},
  sessionFilters: {},
};

export const useTrainingStore = create<TrainingState>()((
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        // UI Actions
        setLoading: (loading: boolean) => set({ isLoading: loading }),
        setError: (error: string | null) => set({ error }),
        clearError: () => set({ error: null }),
        
        // Training Plans
        fetchTrainingPlans: async (filters?: Record<string, any>) => {
          set({ isLoading: true, error: null });
          
          try {
            const plans = await trainingApi.plans.getAll(filters || {});
            set({ trainingPlans: plans, isLoading: false });
          } catch (error) {
          logger.error('Failed to fetch training plans:', error as any);
          set({ error: 'Failed to fetch training plans', isLoading: false });
        }
        },
        
        createTrainingPlan: async (planData: any) => {
          set({ isLoading: true, error: null });
          
          try {
            const plan = await trainingApi.plans.create(planData);
            const { trainingPlans } = get();
            set({ trainingPlans: [...trainingPlans, plan], isLoading: false });
          } catch (error) {
          logger.error('Failed to create training plan:', error as any);
          set({ error: 'Failed to create training plan', isLoading: false });
        }
        },
        
        updateTrainingPlan: async (id: string, updates: any) => {
          set({ isLoading: true, error: null });
          
          try {
            const plan = await trainingApi.plans.update(id, updates);
            const { trainingPlans } = get();
            const updatedPlans = trainingPlans.map(p => p._id === id ? plan : p);
            set({ trainingPlans: updatedPlans, isLoading: false });
          } catch (error) {
          logger.error('Failed to update training plan:', error as any);
          set({ error: 'Failed to update training plan', isLoading: false });
        }
        },
        
        deleteTrainingPlan: async (id: string) => {
          set({ isLoading: true, error: null });
          
          try {
            await trainingApi.plans.delete(id);
            const { trainingPlans } = get();
            const filteredPlans = trainingPlans.filter(p => p._id !== id);
            set({ trainingPlans: filteredPlans, isLoading: false });
          } catch (error) {
          logger.error('Failed to delete training plan:', error as any);
          set({ error: 'Failed to delete training plan', isLoading: false });
        }
        },
        
        setSelectedPlan: (plan: any) => set({ selectedPlan: plan }),
        
        // Training Sessions
        fetchTrainingSessions: async (filters?: Record<string, any>) => {
          set({ isLoading: true, error: null });
          
          try {
            const sessions = await trainingApi.sessions.getAll(filters || {});
            set({ trainingSessions: sessions, isLoading: false });
          } catch (error) {
          logger.error('Failed to fetch training sessions:', error as any);
          set({ error: 'Failed to fetch training sessions', isLoading: false });
        }
        },
        
        createTrainingSession: async (sessionData: any) => {
          set({ isLoading: true, error: null });
          
          try {
            const session = await trainingApi.sessions.create(sessionData);
            const { trainingSessions } = get();
            set({ trainingSessions: [...trainingSessions, session], isLoading: false });
          } catch (error) {
          logger.error('Failed to create training session:', error as any);
          set({ error: 'Failed to create training session', isLoading: false });
        }
        },
        
        updateTrainingSession: async (id: string, updates: any) => {
          set({ isLoading: true, error: null });
          
          try {
            const session = await trainingApi.sessions.update(id, updates);
            const { trainingSessions } = get();
            const updatedSessions = trainingSessions.map(s => s._id === id ? session : s);
            set({ trainingSessions: updatedSessions, isLoading: false });
          } catch (error) {
          logger.error('Failed to update training session:', error as any);
          set({ error: 'Failed to update training session', isLoading: false });
        }
        },
        
        deleteTrainingSession: async (id: string) => {
          set({ isLoading: true, error: null });
          
          try {
            await trainingApi.sessions.delete(id);
            const { trainingSessions } = get();
            const filteredSessions = trainingSessions.filter(s => s._id !== id);
            set({ trainingSessions: filteredSessions, isLoading: false });
          } catch (error) {
          logger.error('Failed to delete training session:', error as any);
          set({ error: 'Failed to delete training session', isLoading: false });
        }
        },
        
        setSelectedSession: (session: any) => set({ selectedSession: session }),
        
        // Workout Logs
        fetchWorkoutLogs: async (sessionId?: string) => {
          set({ isLoading: true, error: null });
          
          try {
            const logs = sessionId 
              ? [await trainingApi.workoutLogs.getBySessionId(sessionId)].filter(Boolean)
              : [];
            set({ workoutLogs: logs, isLoading: false });
          } catch (error) {
          logger.error('Failed to fetch workout logs:', error as any);
          set({ error: 'Failed to fetch workout logs', isLoading: false });
        }
        },
        
        createWorkoutLog: async (logData: any) => {
          set({ isLoading: true, error: null });
          
          try {
            const log = await trainingApi.workoutLogs.create(logData);
            const { workoutLogs } = get();
            set({ workoutLogs: [...workoutLogs, log], isLoading: false });
          } catch (error) {
          logger.error('Failed to create workout log:', error as any);
          set({ error: 'Failed to create workout log', isLoading: false });
        }
        },
        
        updateWorkoutLog: async (id: string, updates: any) => {
          set({ isLoading: true, error: null });
          
          try {
            const log = await trainingApi.workoutLogs.update(id, updates);
            const { workoutLogs } = get();
            const updatedLogs = workoutLogs.map(l => l._id === id ? log : l);
            set({ workoutLogs: updatedLogs, isLoading: false });
          } catch (error) {
          logger.error('Failed to update workout log:', error as any);
          set({ error: 'Failed to update workout log', isLoading: false });
        }
        },
        
        // Stats
        fetchStats: async (planId?: string) => {
          set({ isLoading: true, error: null });
          
          try {
            const stats = planId ? await trainingApi.plans.getStats(planId) : null;
            set({ stats, isLoading: false });
          } catch (error) {
          logger.error('Failed to fetch stats:', error as any);
          set({ error: 'Failed to fetch stats', isLoading: false });
        }
        },
        
        // Filters
        setPlanFilters: (filters: Record<string, any>) => set({ planFilters: filters }),
        setSessionFilters: (filters: Record<string, any>) => set({ sessionFilters: filters }),
        
        // Reset
        reset: () => set(initialState),
      }),
      {
        name: 'training-store',
        partialize: (state) => ({
          trainingPlans: state.trainingPlans,
          trainingSessions: state.trainingSessions,
          workoutLogs: state.workoutLogs,
          planFilters: state.planFilters,
          sessionFilters: state.sessionFilters,
        }),
      }
    ),
    {
      name: 'training-store',
    }
  )
));

// Selectors
export const useTrainingPlans = () => useTrainingStore(state => state.trainingPlans);
export const useTrainingSessions = () => useTrainingStore(state => state.trainingSessions);
export const useWorkoutLogs = () => useTrainingStore(state => state.workoutLogs);
export const useTrainingStats = () => useTrainingStore(state => state.stats);
export const useTrainingLoading = () => useTrainingStore(state => state.isLoading);
export const useTrainingError = () => useTrainingStore(state => state.error);
export const useSelectedPlan = () => useTrainingStore(state => state.selectedPlan);
export const useSelectedSession = () => useTrainingStore(state => state.selectedSession);

// Computed selectors
export const useFilteredTrainingPlans = () => {
  const plans = useTrainingPlans();
  const filters = useTrainingStore(state => state.planFilters);
  
  return plans.filter(plan => {
    if (filters.status && plan.status !== filters.status) return false;
    if (filters.runnerId && plan.runnerId !== filters.runnerId) return false;
    if (filters.coachId && plan.coachId !== filters.coachId) return false;
    return true;
  });
};

export const useFilteredTrainingSessions = () => {
  const sessions = useTrainingSessions();
  const filters = useTrainingStore(state => state.sessionFilters);
  
  return sessions.filter(session => {
    if (filters.status && session.status !== filters.status) return false;
    if (filters.planId && session.planId !== filters.planId) return false;
    if (filters.date && session.scheduledDate !== filters.date) return false;
    return true;
  });
};