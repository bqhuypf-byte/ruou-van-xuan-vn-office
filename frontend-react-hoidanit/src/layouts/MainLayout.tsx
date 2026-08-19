import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, Outlet, useNavigate, useSearchParams } from 'react-router';
import { Package, LogIn, MapPin, Search, Tag, Truck } from 'lucide-react';
import { useAuthStore } from '@/features/auth';
import { CartBadge } from '@/features/cart';
import { CategoryNavMenu } from '@/features/product';
import { useSiteSettings } from '@/features/home';
import { Footer, UserMenu } from '@/shared/components/layout';
import { Input } from '@/shared/components/ui';
import { ROUTES } from '@/routes/routes';

const DEFAULT_SITE_NAME = 'MegaMart';
const DEFAULT_TOP_BAR_MESSAGE = 'Welcome to worldwide MegaMart!';
const DEFAULT_DELIVER_TO_TEXT = 'Deliver to 423651';

export const MainLayout = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') ?? '');
  const { data: settings } = useSiteSettings();

  const siteName = settings?.siteName ?? DEFAULT_SITE_NAME;

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    navigate(trimmed ? `${ROUTES.HOME}?search=${encodeURIComponent(trimmed)}` : ROUTES.HOME);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="hidden md:block bg-[#F5F5F5] dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[42px] flex items-center justify-between">
          <span>{settings?.topBarMessage ?? DEFAULT_TOP_BAR_MESSAGE}</span>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {settings?.deliverToText ?? DEFAULT_DELIVER_TO_TEXT}
            </span>
            <Link to={ROUTES.ORDERS} className="flex items-center gap-1.5 hover:text-[#008ECC]">
              <Truck className="w-3.5 h-3.5" />
              Track your order
            </Link>
            <Link to={ROUTES.PRODUCTS} className="flex items-center gap-1.5 hover:text-[#008ECC]">
              <Tag className="w-3.5 h-3.5" />
              All Offers
            </Link>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center gap-4">
          <Link to={ROUTES.HOME} className="flex items-center gap-2.5 font-bold text-lg text-slate-900 dark:text-white shrink-0">
            {settings?.logoUrl ? (
              <img src={settings.logoUrl} alt={siteName} className="h-9 object-contain" />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-[#008ECC] flex items-center justify-center text-white shadow-lg shadow-[#008ECC]/30">
                <Package className="w-5 h-5" />
              </div>
            )}
            {siteName}
          </Link>

          <form onSubmit={handleSearchSubmit} className="hidden md:block flex-1 max-w-xl">
            <Input
              placeholder="Search essentials, groceries and more..."
              leftIcon={<Search className="w-4 h-4" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-full bg-[#F3F9FB] dark:bg-slate-800 border-transparent"
            />
          </form>

          <div className="flex items-center gap-1.5 ml-auto">
            <CartBadge />

            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <Link
                to={ROUTES.LOGIN}
                className="ml-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-[#008ECC] hover:bg-[#0077ad] text-white transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Sign Up/Sign In
              </Link>
            )}
          </div>
        </div>
        <div className="hidden sm:block border-t border-slate-100 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <CategoryNavMenu />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};
