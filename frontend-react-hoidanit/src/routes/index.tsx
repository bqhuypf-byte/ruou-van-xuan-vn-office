import { createBrowserRouter, Navigate } from 'react-router';
import { MainLayout } from '@/layouts/MainLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { LoginPage, RegisterPage } from '@/features/auth';
import { RolesPage } from '@/features/roles';
import { UsersPage } from '@/features/users';
import App from '@/App';
import { AdminRoute } from './AdminRoute';
import { ROUTES } from './routes';

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <MainLayout />,
    children: [{ index: true, element: <App /> }],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: ROUTES.LOGIN, element: <LoginPage /> },
      { path: ROUTES.REGISTER, element: <RegisterPage /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to={ROUTES.ADMIN_ROLES} replace /> },
          { path: 'roles', element: <RolesPage /> },
          { path: 'users', element: <UsersPage /> },
        ],
      },
    ],
  },
]);
