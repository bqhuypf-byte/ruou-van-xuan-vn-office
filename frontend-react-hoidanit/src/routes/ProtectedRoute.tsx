import { Navigate, Outlet } from 'react-router';
import { ROUTES } from './routes';

export const ProtectedRoute = () => {
  const isAuthenticated = false; // TODO: wire to auth store when /fe-crud auth feature lands

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
};
