import { Navigate, useLocation } from 'react-router-dom';
import { canRoleAccessPath, dashboardRouteForRole, useAuthStore } from '@/stores/useAuthStore';
import { toast } from 'sonner';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const mustChangePassword = useAuthStore((s) => s.user.mustChangePassword);
  const role = useAuthStore((s) => s.user.role);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (mustChangePassword && location.pathname !== '/auth/set-password') {
    return <Navigate to="/auth/set-password" replace />;
  }

  if (!mustChangePassword && !canRoleAccessPath(role, location.pathname)) {
    toast.error("You don't have access to that section.");
    return <Navigate to={dashboardRouteForRole(role)} replace />;
  }

  return <>{children}</>;
}
