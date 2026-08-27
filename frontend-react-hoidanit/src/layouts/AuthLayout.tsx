import { Outlet, Link } from 'react-router';
import { ScrollToTop } from '@/shared/components/layout';
import { ROUTES } from '@/routes/routes';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12">
      <ScrollToTop />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to={ROUTES.HOME} className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center font-bold text-white shadow-lg shadow-brand-600/30">
              VX
            </div>
            <span className="font-bold text-xl tracking-wide text-slate-900 dark:text-white">
              Rượu Vạn Xuân
            </span>
          </Link>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
