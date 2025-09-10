import { apiLogger } from '@/lib/logger';
import {
  TrainingPlan,
  TrainingPlanResponse,
  TrainingPlansResponse,
  TrainingSession,
  SessionResponse,
  SessionsResponse,
  WorkoutLog,
  WorkoutLogResponse,
  CreateTrainingPlanForm,
  CreateSessionForm,
  LogWorkoutForm,
  CoachFeedbackForm,
  TrainingPlanFilters,
  SessionFilters,
  TrainingStats
} from '@/types/training';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

// Base API client with error handling and logging
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const startTime = Date.now();

    try {
      apiLogger.apiRequest(options.method || 'GET', url);

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const duration = Date.now() - startTime;
      apiLogger.apiResponse(
        options.method || 'GET',
        url,
        response.status,
        duration
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: 'Network error occurred'
        }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      const duration = Date.now() - startTime;
      apiLogger.apiResponse(
        options.method || 'GET',
        url,
        0,
        duration,
        { error: error instanceof Error ? error.message : 'Unknown error' }
      );
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

const apiClient = new ApiClient(API_BASE_URL);

// Training Plan API
export const trainingPlanApi = {
  // Get all training plans with optional filters
  getAll: async (filters?: TrainingPlanFilters): Promise<TrainingPlan[]> => {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const endpoint = `/training-plans${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiClient.get<TrainingPlansResponse>(endpoint);
    return response.data;
  },

  // Get training plan by ID
  getById: async (id: string): Promise<TrainingPlan> => {
    const response = await apiClient.get<TrainingPlanResponse>(`/training-plans/${id}`);
    return response.data;
  },

  // Get training plans for a specific runner
  getByRunnerId: async (runnerId: string): Promise<TrainingPlan[]> => {
    const response = await apiClient.get<TrainingPlansResponse>(`/training-plans/runner/${runnerId}`);
    return response.data;
  },

  // Get training plans for a specific coach
  getByCoachId: async (coachId: string): Promise<TrainingPlan[]> => {
    const response = await apiClient.get<TrainingPlansResponse>(`/training-plans/coach/${coachId}`);
    return response.data;
  },

  // Create new training plan
  create: async (data: CreateTrainingPlanForm): Promise<TrainingPlan> => {
    const response = await apiClient.post<TrainingPlanResponse>('/training-plans', data);
    return response.data;
  },

  // Update training plan
  update: async (id: string, data: Partial<CreateTrainingPlanForm>): Promise<TrainingPlan> => {
    const response = await apiClient.put<TrainingPlanResponse>(`/training-plans/${id}`, data);
    return response.data;
  },

  // Delete training plan
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/training-plans/${id}`);
  },

  // Get training plan statistics
  getStats: async (id: string): Promise<TrainingStats> => {
    const response = await apiClient.get<{ success: boolean; data: TrainingStats }>(`/training-plans/${id}/stats`);
    return response.data;
  }
};

// Training Session API
export const trainingSessionApi = {
  // Get all sessions with optional filters
  getAll: async (filters?: SessionFilters): Promise<TrainingSession[]> => {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const endpoint = `/training-sessions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiClient.get<SessionsResponse>(endpoint);
    return response.data;
  },

  // Get session by ID
  getById: async (id: string): Promise<TrainingSession> => {
    const response = await apiClient.get<SessionResponse>(`/training-sessions/${id}`);
    return response.data;
  },

  // Get sessions for a specific training plan
  getByPlanId: async (planId: string): Promise<TrainingSession[]> => {
    const response = await apiClient.get<SessionsResponse>(`/training-sessions/plan/${planId}`);
    return response.data;
  },

  // Get sessions for a specific runner
  getByRunnerId: async (runnerId: string): Promise<TrainingSession[]> => {
    const response = await apiClient.get<SessionsResponse>(`/training-sessions/runner/${runnerId}`);
    return response.data;
  },

  // Get sessions for a specific date range
  getByDateRange: async (startDate: string, endDate: string, runnerId?: string): Promise<TrainingSession[]> => {
    const queryParams = new URLSearchParams({
      startDate,
      endDate,
      ...(runnerId && { runnerId })
    });
    
    const response = await apiClient.get<SessionsResponse>(`/training-sessions/date-range?${queryParams.toString()}`);
    return response.data;
  },

  // Create new training session
  create: async (data: CreateSessionForm): Promise<TrainingSession> => {
    const response = await apiClient.post<SessionResponse>('/training-sessions', data);
    return response.data;
  },

  // Update training session
  update: async (id: string, data: Partial<CreateSessionForm>): Promise<TrainingSession> => {
    const response = await apiClient.put<SessionResponse>(`/training-sessions/${id}`, data);
    return response.data;
  },

  // Delete training session
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/training-sessions/${id}`);
  },

  // Update session status
  updateStatus: async (id: string, status: TrainingSession['status']): Promise<TrainingSession> => {
    const response = await apiClient.patch<SessionResponse>(`/training-sessions/${id}/status`, { status });
    return response.data;
  }
};

// Workout Log API
export const workoutLogApi = {
  // Get workout log by session ID
  getBySessionId: async (sessionId: string): Promise<WorkoutLog | null> => {
    try {
      const response = await apiClient.get<WorkoutLogResponse>(`/workout-logs/session/${sessionId}`);
      return response.data;
    } catch (error) {
      // Return null if no workout log exists for this session
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  },

  // Get workout log by ID
  getById: async (id: string): Promise<WorkoutLog> => {
    const response = await apiClient.get<WorkoutLogResponse>(`/workout-logs/${id}`);
    return response.data;
  },

  // Get workout logs for a runner
  getByRunnerId: async (runnerId: string): Promise<WorkoutLog[]> => {
    const response = await apiClient.get<{ success: boolean; data: WorkoutLog[] }>(`/workout-logs/runner/${runnerId}`);
    return response.data;
  },

  // Create workout log
  create: async (data: LogWorkoutForm): Promise<WorkoutLog> => {
    const response = await apiClient.post<WorkoutLogResponse>('/workout-logs', {
      ...data,
      completedAt: new Date().toISOString()
    });
    return response.data;
  },

  // Update workout log
  update: async (id: string, data: Partial<LogWorkoutForm>): Promise<WorkoutLog> => {
    const response = await apiClient.put<WorkoutLogResponse>(`/workout-logs/${id}`, data);
    return response.data;
  },

  // Delete workout log
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/workout-logs/${id}`);
  }
};

// Coach Feedback API
export const coachFeedbackApi = {
  // Add feedback to a workout log
  addFeedback: async (workoutLogId: string, data: CoachFeedbackForm): Promise<WorkoutLog> => {
    const response = await apiClient.post<WorkoutLogResponse>(`/workout-logs/${workoutLogId}/feedback`, data);
    return response.data;
  },

  // Update feedback
  updateFeedback: async (workoutLogId: string, feedbackId: string, data: Partial<CoachFeedbackForm>): Promise<WorkoutLog> => {
    const response = await apiClient.put<WorkoutLogResponse>(`/workout-logs/${workoutLogId}/feedback/${feedbackId}`, data);
    return response.data;
  },

  // Mark feedback as reviewed
  markAsReviewed: async (workoutLogId: string, feedbackId: string): Promise<WorkoutLog> => {
    const response = await apiClient.patch<WorkoutLogResponse>(`/workout-logs/${workoutLogId}/feedback/${feedbackId}/reviewed`, { reviewed: true });
    return response.data;
  }
};

// Export all APIs
export const trainingApi = {
  plans: trainingPlanApi,
  sessions: trainingSessionApi,
  workoutLogs: workoutLogApi,
  feedback: coachFeedbackApi
};

export default trainingApi;