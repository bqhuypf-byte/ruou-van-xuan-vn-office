import { Navigate, Outlet } from 'react-router';
import { useAuthStore } from '@/features/auth';
import { Spinner } from '@/shared/components/ui';
import { ROUTES } from './routes';

export const ProtectedRoute = () => {
  const isInitializing = useAuthStore((state) => state.isInitializing);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
};
