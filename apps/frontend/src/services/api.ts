'use client';

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

// Generic API response type
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: any;
}

// User profile types
interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: 'runner' | 'coach' | 'admin';
  avatar?: string;
  profile?: {
    age?: number;
    weight?: number;
    height?: number;
    experience?: string;
    goals?: string;
  };
  coachId?: string;
  createdAt: string;
  updatedAt: string;
}

interface UserRole {
  userId: string;
  name: string;
  email: string;
  role: 'runner' | 'coach' | 'admin';
  permissions: string[];
  coach?: {
    id: string;
    name: string;
    email: string;
  };
  runners?: {
    id: string;
    name: string;
    email: string;
    role: string;
  }[];
}

// Generic fetch wrapper with error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${response.status}: ${response.statusText}`,
        details: data.details,
      };
    }

    return {
      success: true,
      data: data.data || data,
    };
  } catch (error) {
    console.error('API request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Authentication and User Services
export const authService = {
  // Get current user profile
  getCurrentUser: async (): Promise<ApiResponse<UserProfile>> => {
    return apiRequest<UserProfile>('/api/users/profile');
  },

  // Update user profile
  updateProfile: async (data: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> => {
    return apiRequest<UserProfile>('/api/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Get user role and permissions
  getUserRole: async (): Promise<ApiResponse<UserRole>> => {
    return apiRequest<UserRole>('/api/users/role');
  },
};

// Training Plan Services
export const trainingPlanService = {
  // Get training plans with optional filters
  getTrainingPlans: async (params?: {
    runnerId?: string;
    status?: string;
    weekStart?: string;
    weekEnd?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<any[]>> => {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/api/training-plans${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return apiRequest<any[]>(endpoint);
  },

  // Get specific training plan by ID
  getTrainingPlan: async (id: string): Promise<ApiResponse<any>> => {
    return apiRequest<any>(`/api/training-plans/${id}`);
  },

  // Create new training plan (coach only)
  createTrainingPlan: async (data: any): Promise<ApiResponse<any>> => {
    return apiRequest<any>('/api/training-plans', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update training plan (coach only)
  updateTrainingPlan: async (id: string, data: any): Promise<ApiResponse<any>> => {
    return apiRequest<any>(`/api/training-plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete training plan (coach only)
  deleteTrainingPlan: async (id: string): Promise<ApiResponse<any>> => {
    return apiRequest<any>(`/api/training-plans/${id}`, {
      method: 'DELETE',
    });
  },
};

// Session/Workout Services
export const sessionService = {
  // Get training sessions
  getSessions: async (params?: {
    trainingPlanId?: string;
    runnerId?: string;
    date?: string;
    status?: string;
  }): Promise<ApiResponse<any[]>> => {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/api/sessions${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return apiRequest<any[]>(endpoint);
  },

  // Update session status/log
  updateSession: async (id: string, data: any): Promise<ApiResponse<any>> => {
    return apiRequest<any>(`/api/sessions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Bulk update sessions
  bulkUpdateSessions: async (data: any[]): Promise<ApiResponse<any>> => {
    return apiRequest<any>('/api/sessions/bulk', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// Export types for use in components
export type { UserProfile, UserRole, ApiResponse };