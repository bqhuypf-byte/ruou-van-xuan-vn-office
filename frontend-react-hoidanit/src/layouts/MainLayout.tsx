import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, Outlet, useNavigate, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { LogIn, List, MapPin, Search, Tag, Truck } from 'lucide-react';
import { useAuthStore } from '@/features/auth';
import { CartBadge } from '@/features/cart';
import { CategoryPillNav } from '@/features/product';
import {
  ContactWidget,
  VoucherFloatingButton,
  VoucherPopup,
  useSiteSettings,
} from '@/features/home';
import { Footer, LanguageSwitcher, ScrollToTop, UserMenu } from '@/shared/components/layout';
import { Input } from '@/shared/components/ui';
import { ROUTES } from '@/routes/routes';

const DEFAULT_SITE_NAME = 'Rượu Vạn Xuân';
const DEFAULT_TOP_BAR_MESSAGE = 'Chào mừng đến với Rượu Vạn Xuân!';
const DEFAULT_DELIVER_TO_TEXT = 'Giao Hàng Toàn Quốc';

export const MainLayout = () => {
  const { t } = useTranslation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') ?? '');
  const [isVoucherPopupOpen, setIsVoucherPopupOpen] = useState(false);
  const { data: settings } = useSiteSettings();

  const siteName = settings?.siteName ?? DEFAULT_SITE_NAME;

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    navigate(trimmed ? `${ROUTES.PRODUCTS}?search=${encodeURIComponent(trimmed)}` : ROUTES.PRODUCTS);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 shadow-xs border-t-2 border-brand-600">
        <div className="hidden md:block text-xs text-brand-600 dark:text-brand-400 bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between">
            <span>{settings?.topBarMessage ?? DEFAULT_TOP_BAR_MESSAGE}</span>
            <div className="flex items-center gap-5">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                {settings?.deliverToText ?? DEFAULT_DELIVER_TO_TEXT}
              </span>
              <Link to={ROUTES.ORDERS} className="flex items-center gap-1.5 hover:text-brand-800 dark:hover:text-brand-300 transition-colors">
                <Truck className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                {t('header.trackOrder')}
              </Link>
              <button
                type="button"
                onClick={() => setIsVoucherPopupOpen(true)}
                className="flex items-center gap-1.5 hover:text-brand-800 dark:hover:text-brand-300 transition-colors"
              >
                <Tag className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                {t('header.allOffers')}
              </button>
            </div>
          </div>
        </div>

        <div className="border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center gap-4">
            <Link to={ROUTES.HOME} className="flex items-center gap-2.5 font-bold text-lg text-brand-600 dark:text-white shrink-0">
              {settings?.logoUrl ? (
                <img src={settings.logoUrl} alt={siteName} className="h-9 object-contain" />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white text-xs font-bold">
                  VX
                </div>
              )}
              <span className="text-2xl">{siteName}</span>
            </Link>

            <form onSubmit={handleSearchSubmit} className="hidden md:block flex-1 max-w-xl">
              <Input
                placeholder={t('header.searchPlaceholder')}
                leftIcon={<Search className="w-4 h-4 text-brand-600 dark:text-brand-400" />}
                rightIcon={<List className="w-4 h-4 text-brand-600 dark:text-brand-400" />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              />
            </form>

            <div className="flex items-center gap-4 ml-auto">
              {isAuthenticated ? (
                <>
                  <CartBadge />
                  <UserMenu />
                </>
              ) : (
                <>
                  <Link
                    to={ROUTES.LOGIN}
                    className="flex items-center gap-1.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400"
                  >
                    <LogIn className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                    {t('header.signInSignUp')}
                  </Link>
                  <span className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
                  <CartBadge />
                </>
              )}
            </div>
          </div>
        </div>

        <div className="hidden sm:block bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <CategoryPillNav />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
      <LanguageSwitcher />
      <ContactWidget channels={settings?.contactChannels ?? []} />
      <VoucherFloatingButton onClick={() => setIsVoucherPopupOpen(true)} />
      <VoucherPopup isOpen={isVoucherPopupOpen} onClose={() => setIsVoucherPopupOpen(false)} />
    </div>
  );
};
