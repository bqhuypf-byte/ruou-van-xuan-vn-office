import { createBrowserRouter } from 'react-router';
import { MainLayout } from '@/layouts/MainLayout';
import App from '@/App';
import { ROUTES } from './routes';

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <MainLayout />,
    children: [{ index: true, element: <App /> }],
  },
]);
