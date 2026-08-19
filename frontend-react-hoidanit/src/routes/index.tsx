import { createBrowserRouter, Navigate } from 'react-router';
import { MainLayout } from '@/layouts/MainLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { LoginPage, RegisterPage } from '@/features/auth';
import { RolesPage } from '@/features/roles';
import { UsersPage } from '@/features/users';
import {
  CategoriesPage,
  ProductsPage,
  ProductDetailPage,
  HomePage,
  ProductViewPage,
  CategoryPage,
} from '@/features/product';
import { CartPage } from '@/features/cart';
import { OrdersPage, OrderDetailPage } from '@/features/order';
import { AddressesPage } from '@/features/user-profile';
import { SiteContentPage } from '@/features/site-content';
import { BannersPage, BrandsPage, SiteSettingsPage } from '@/features/home';
import { AdminRoute } from './AdminRoute';
import { ProtectedRoute } from './ProtectedRoute';
import { ROUTES } from './routes';

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'products/:slug', element: <ProductViewPage /> },
      { path: 'categories/:slug', element: <CategoryPage /> },
      { path: 'cart', element: <CartPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: 'orders', element: <OrdersPage /> },
          { path: 'orders/:id', element: <OrderDetailPage /> },
          { path: 'profile', element: <AddressesPage /> },
        ],
      },
    ],
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
          { path: 'categories', element: <CategoriesPage /> },
          { path: 'site-content', element: <SiteContentPage /> },
          { path: 'banners', element: <BannersPage /> },
          { path: 'brands', element: <BrandsPage /> },
          { path: 'site-settings', element: <SiteSettingsPage /> },
          { path: 'products', element: <ProductsPage /> },
          { path: 'products/:slug', element: <ProductDetailPage /> },
        ],
      },
    ],
  },
]);
