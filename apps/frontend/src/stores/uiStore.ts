import { create } from 'zustand';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  createdAt: Date;
}

interface Modal {
  id: string;
  component: string;
  props?: Record<string, any>;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

interface UIState {
  // Sidebar
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  
  // Notifications
  notifications: Notification[];
  
  // Modals
  modals: Modal[];
  
  // Loading states
  globalLoading: boolean;
  
  // Theme
  theme: 'light' | 'dark';
  
  // Mobile detection
  isMobile: boolean;
  
  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapse: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  // Notification actions
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  
  // Modal actions
  openModal: (modal: Omit<Modal, 'id'>) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  
  // Loading actions
  setGlobalLoading: (loading: boolean) => void;
  
  // Theme actions
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  
  // Mobile actions
  setIsMobile: (isMobile: boolean) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useUIStore = create<UIState>()((set, get) => ({
  // Initial state
  sidebarOpen: true,
  sidebarCollapsed: false,
  notifications: [],
  modals: [],
  globalLoading: false,
  theme: 'light',
  isMobile: false,

  // Sidebar actions
  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },

  setSidebarOpen: (open) => {
    set({ sidebarOpen: open });
  },

  toggleSidebarCollapse: () => {
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
  },

  setSidebarCollapsed: (collapsed) => {
    set({ sidebarCollapsed: collapsed });
  },

  // Notification actions
  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: generateId(),
      createdAt: new Date()
    };
    
    set((state) => ({
      notifications: [newNotification, ...state.notifications]
    }));

    // Auto remove notification after duration
    const duration = notification.duration || 5000;
    if (duration > 0) {
      setTimeout(() => {
        get().removeNotification(newNotification.id);
      }, duration);
    }
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }));
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },

  // Modal actions
  openModal: (modal) => {
    const newModal: Modal = {
      ...modal,
      id: generateId()
    };
    
    set((state) => ({
      modals: [...state.modals, newModal]
    }));
  },

  closeModal: (id) => {
    set((state) => ({
      modals: state.modals.filter(m => m.id !== id)
    }));
  },

  closeAllModals: () => {
    set({ modals: [] });
  },

  // Loading actions
  setGlobalLoading: (loading) => {
    set({ globalLoading: loading });
  },

  // Theme actions
  setTheme: (theme) => {
    set({ theme });
    // Update document class for theme
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  },

  toggleTheme: () => {
    const currentTheme = get().theme;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    get().setTheme(newTheme);
  },

  // Mobile actions
  setIsMobile: (isMobile) => {
    set({ isMobile });
    
    // Auto close sidebar on mobile
    if (isMobile) {
      set({ sidebarOpen: false });
    }
  }
}));

// Selectors
export const useSidebar = () => {
  return useUIStore((state) => ({
    isOpen: state.sidebarOpen,
    isCollapsed: state.sidebarCollapsed,
    toggle: state.toggleSidebar,
    setOpen: state.setSidebarOpen,
    toggleCollapse: state.toggleSidebarCollapse,
    setCollapsed: state.setSidebarCollapsed
  }));
};

export const useNotifications = () => {
  return useUIStore((state) => ({
    notifications: state.notifications,
    add: state.addNotification,
    remove: state.removeNotification,
    clear: state.clearNotifications
  }));
};

export const useModals = () => {
  return useUIStore((state) => ({
    modals: state.modals,
    open: state.openModal,
    close: state.closeModal,
    closeAll: state.closeAllModals
  }));
};

export const useTheme = () => {
  return useUIStore((state) => ({
    theme: state.theme,
    setTheme: state.setTheme,
    toggle: state.toggleTheme
  }));
};

export const useGlobalLoading = () => useUIStore((state) => state.globalLoading);
export const useIsMobile = () => useUIStore((state) => state.isMobile);