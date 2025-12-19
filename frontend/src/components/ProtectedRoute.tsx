import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  requireUser?: boolean;
}

export default function ProtectedRoute({
  children,
  requireAuth = false,
  requireAdmin = false,
  requireUser = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAppSelector((state) => state.auth);

  const isAdmin = user?.role === 'admin';
  const isUser = user?.role === 'user';

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requireUser && !isUser) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
