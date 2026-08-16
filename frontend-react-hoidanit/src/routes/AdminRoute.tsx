import { Navigate, Outlet } from 'react-router';
import { ROUTES } from './routes';

export const AdminRoute = () => {
  const isAdmin = false; // TODO: wire to auth store when /fe-crud auth feature lands

  if (!isAdmin) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <Outlet />;
};
