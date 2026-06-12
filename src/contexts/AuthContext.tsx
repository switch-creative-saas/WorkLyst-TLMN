import { createContext, useContext, useEffect, useMemo } from 'react';
import {
  useAuthStore,
  type DemoUser,
  dashboardRouteForRole,
} from '@/stores/useAuthStore';
import { USE_MOCK } from '@/api/client';

interface LoginResult {
  ok: boolean;
  reason?: string;
  redirectTo?: string;
}

interface AuthContextValue {
  user: DemoUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string, remember?: boolean) => Promise<LoginResult>;
  logout: () => Promise<void>;
  getDashboardRoute: () => string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const loginStore = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const hydrateSession = useAuthStore((state) => state.hydrateSession);
  const getDashboardRoute = useAuthStore((state) => state.getDashboardRoute);

  useEffect(() => {
    void hydrateSession();
  }, [hydrateSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: isAuthenticated ? user : null,
      isAuthenticated,
      isLoading,
      login: async (username, password) => loginStore(username, password),
      logout: async () => {
        if (!USE_MOCK) {
          try {
            await fetch('/api/auth/logout', {
              method: 'POST',
              credentials: 'include',
            });
          } catch {
            // If the API is unavailable, still clear the client session.
          }
        }
        logout();
      },
      getDashboardRoute: () => dashboardRouteForRole(user.role) || getDashboardRoute(),
    }),
    [getDashboardRoute, isAuthenticated, isLoading, loginStore, logout, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
