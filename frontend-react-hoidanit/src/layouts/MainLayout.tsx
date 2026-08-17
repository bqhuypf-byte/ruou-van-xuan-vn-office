import { Outlet, Link, useNavigate } from 'react-router';
import { Package, User, LogOut, LogIn, ClipboardList } from 'lucide-react';
import { useAuthStore, useLogout } from '@/features/auth';
import { CartBadge } from '@/features/cart';
import { ROUTES } from '@/routes/routes';

export const MainLayout = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    navigate(ROUTES.HOME);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to={ROUTES.HOME} className="flex items-center gap-2.5 font-bold text-lg text-slate-900 dark:text-white">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <Package className="w-5 h-5" />
            </div>
            Rượu Văn Xuân
          </Link>

          <div className="flex items-center gap-1.5">
            <CartBadge />

            {isAuthenticated ? (
              <>
                <Link
                  to={ROUTES.ORDERS}
                  className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                  title="Đơn hàng của tôi"
                >
                  <ClipboardList className="w-5 h-5" />
                </Link>
                <div className="flex items-center gap-2 pl-2 ml-1 border-l border-slate-200 dark:border-slate-800">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="hidden sm:inline text-sm font-medium text-slate-700 dark:text-slate-300">
                    {user?.fullName}
                  </span>
                  <button
                    onClick={handleLogout}
                    title="Đăng xuất"
                    className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <Link
                to={ROUTES.LOGIN}
                className="ml-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Đăng Nhập
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};
