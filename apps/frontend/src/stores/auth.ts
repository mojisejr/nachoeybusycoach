import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'runner' | 'coach';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (user: User) => void;
  logout: () => void;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
};

export const useAuthStore = create<AuthStore>()()
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setUser: (user) =>
          set(
            {
              user,
              isAuthenticated: !!user,
              error: null,
            },
            false,
            'auth/setUser'
          ),

        setLoading: (isLoading) =>
          set(
            { isLoading },
            false,
            'auth/setLoading'
          ),

        setError: (error) =>
          set(
            { error },
            false,
            'auth/setError'
          ),

        login: (user) =>
          set(
            {
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            },
            false,
            'auth/login'
          ),

        logout: () =>
          set(
            {
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            },
            false,
            'auth/logout'
          ),

        clearError: () =>
          set(
            { error: null },
            false,
            'auth/clearError'
          ),
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    {
      name: 'auth-store',
    }
  );

// Selectors for better performance
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);