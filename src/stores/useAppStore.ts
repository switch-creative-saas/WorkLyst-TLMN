import { create } from 'zustand';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

interface AppState {
  sidebarCollapsed: boolean;
  mobileNavOpen: boolean;
  activeModule: string;
  activeRoute: string;
  toasts: Toast[];
  globalLoading: boolean;
  toggleSidebar: () => void;
  toggleMobileNav: () => void;
  setMobileNavOpen: (open: boolean) => void;
  setActiveModule: (module: string) => void;
  setActiveRoute: (route: string) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  setGlobalLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  mobileNavOpen: false,
  activeModule: 'Employee Management',
  activeRoute: '/',
  toasts: [],
  globalLoading: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  toggleMobileNav: () => set((state) => ({ mobileNavOpen: !state.mobileNavOpen })),
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
  setActiveModule: (module) => set({ activeModule: module }),
  setActiveRoute: (route) => set({ activeRoute: route }),
  addToast: (toast) => set((state) => ({
    toasts: [...state.toasts, { ...toast, id: Math.random().toString(36).substring(7) }],
  })),
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter((t) => t.id !== id),
  })),
  setGlobalLoading: (loading) => set({ globalLoading: loading }),
}));
