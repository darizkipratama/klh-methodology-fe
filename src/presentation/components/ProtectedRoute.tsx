import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../domain/store/authStore';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ('INTERNAL' | 'EXTERNAL')[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Optional role-based access control checking
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect logic: they are authenticated but lack the specific role.
    // Ensure they land on their own dashboard respectively.
    return <Navigate to={user.role === 'INTERNAL' ? '/dashboard/admin' : '/dashboard/external'} replace />;
  }

  return <>{children}</>;
};
