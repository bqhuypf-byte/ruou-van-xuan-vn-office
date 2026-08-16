import { Navigate, Outlet } from 'react-router';
import { useAuthStore } from '@/features/auth';
import { ROUTES } from './routes';

export const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
};
