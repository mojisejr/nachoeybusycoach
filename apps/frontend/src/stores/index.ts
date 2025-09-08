/**
 * Zustand stores for NachoeyBusyCoach frontend
 */

// Auth store
export {
  useAuthStore,
  useUser,
  useIsAuthenticated,
  useIsLoading,
  useUserRole
} from './authStore';

// Training store
export {
  useTrainingStore,
  useCurrentPlan,
  useWeekSessions,
  useWorkoutLogs,
  useSelectedWeek,
  usePlanLoading,
  useSessionsLoading,
  useLogsLoading,
  useSessionById,
  useLogsBySessionId
} from './trainingStore';

// UI store
export {
  useUIStore,
  useSidebar,
  useNotifications,
  useModals,
  useTheme,
  useGlobalLoading,
  useIsMobile
} from './uiStore';

// Store initialization hook
export const useStoreInitialization = () => {
  // This hook can be used to initialize stores on app startup
  // For example, setting up mobile detection, theme initialization, etc.
  
  const setIsMobile = useUIStore((state) => state.setIsMobile);
  const setTheme = useUIStore((state) => state.setTheme);
  
  const initializeStores = () => {
    // Mobile detection
    if (typeof window !== 'undefined') {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };
      
      checkMobile();
      window.addEventListener('resize', checkMobile);
      
      // Theme initialization
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
      setTheme(savedTheme);
      
      return () => {
        window.removeEventListener('resize', checkMobile);
      };
    }
  };
  
  return { initializeStores };
};