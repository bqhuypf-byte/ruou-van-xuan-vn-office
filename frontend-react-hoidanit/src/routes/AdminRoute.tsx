import { Navigate, Outlet } from 'react-router';
import { useAuthStore } from '@/features/auth';
import { ROUTES } from './routes';

export const AdminRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <Outlet />;
};
