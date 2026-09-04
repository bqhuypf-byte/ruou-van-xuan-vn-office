import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Link, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { House, LayoutGrid, LogIn, List, MapPin, Menu, Search, ShoppingBag, Tag, Truck, UserRound, X } from 'lucide-react';
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
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') ?? '');
  const [isVoucherPopupOpen, setIsVoucherPopupOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const { data: settings } = useSiteSettings();
  const hasPageActionBar =
    location.pathname === ROUTES.CART || /^\/products\/[^/]+$/.test(location.pathname);

  const siteName = settings?.siteName ?? DEFAULT_SITE_NAME;

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    navigate(trimmed ? `${ROUTES.PRODUCTS}?search=${encodeURIComponent(trimmed)}` : ROUTES.PRODUCTS);
    setIsMobileSearchOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 shadow-xs border-t-2 border-gold-500">
        <div className="hidden md:block text-xs text-gold-200 bg-brand-950 border-b border-brand-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between">
            <span>{settings?.topBarMessage ?? DEFAULT_TOP_BAR_MESSAGE}</span>
            <div className="flex items-center gap-5">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-gold-300" />
                {settings?.deliverToText ?? DEFAULT_DELIVER_TO_TEXT}
              </span>
              <Link to={ROUTES.ORDERS} className="flex items-center gap-1.5 hover:text-gold-50 transition-colors">
                <Truck className="w-3.5 h-3.5 text-gold-300" />
                {t('header.trackOrder')}
              </Link>
              <button
                type="button"
                onClick={() => setIsVoucherPopupOpen(true)}
                className="flex items-center gap-1.5 hover:text-gold-50 transition-colors"
              >
                <Tag className="w-3.5 h-3.5 text-gold-300" />
                {t('header.allOffers')}
              </button>
            </div>
          </div>
        </div>

        <div className="border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-lg text-gold-700 hover:bg-gold-50 dark:text-gold-300 dark:hover:bg-slate-800"
              aria-label="Mở danh mục"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link to={ROUTES.HOME} className="flex min-w-0 items-center gap-2 sm:gap-2.5 font-bold text-lg text-gold-700 dark:text-gold-200 shrink-0">
              {settings?.logoUrl ? (
                <img src={settings.logoUrl} alt={siteName} className="h-9 object-contain" />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-gold-500 flex items-center justify-center text-brand-950 text-xs font-bold">
                  VX
                </div>
              )}
              <span className="truncate text-base sm:text-2xl">{siteName}</span>
            </Link>

            <form onSubmit={handleSearchSubmit} className="hidden md:block flex-1 max-w-xl">
              <Input
                placeholder={t('header.searchPlaceholder')}
                leftIcon={<Search className="w-4 h-4 text-gold-700 dark:text-gold-300" />}
                rightIcon={<List className="w-4 h-4 text-gold-700 dark:text-gold-300" />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              />
            </form>

            <div className="flex items-center gap-1 sm:gap-4 ml-auto">
              <button
                type="button"
                onClick={() => setIsMobileSearchOpen((open) => !open)}
                className="md:hidden p-2 rounded-lg text-gold-700 hover:bg-gold-50 dark:text-gold-300 dark:hover:bg-slate-800"
                aria-label={t('header.searchPlaceholder')}
                aria-expanded={isMobileSearchOpen}
              >
                <Search className="w-5 h-5" />
              </button>
              {isAuthenticated ? (
                <>
                  <CartBadge />
                  <UserMenu />
                </>
              ) : (
                <>
                  <Link
                    to={ROUTES.LOGIN}
                    className="flex items-center gap-1.5 p-2 sm:p-0 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-gold-700 dark:hover:text-gold-300"
                  >
                    <LogIn className="w-5 h-5 text-gold-700 dark:text-gold-300" />
                    <span className="hidden sm:inline">{t('header.signInSignUp')}</span>
                  </Link>
                  <span className="hidden sm:block h-6 w-px bg-slate-200 dark:bg-slate-700" />
                  <CartBadge />
                </>
              )}
            </div>
          </div>
        </div>

        {isMobileSearchOpen && (
          <form onSubmit={handleSearchSubmit} className="md:hidden border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
            <Input
              autoFocus
              placeholder={t('header.searchPlaceholder')}
              leftIcon={<Search className="w-4 h-4 text-gold-700 dark:text-gold-300" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            />
          </form>
        )}

        <div className="hidden md:block bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <CategoryPillNav />
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Danh mục sản phẩm">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/45"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Đóng danh mục"
          />
          <aside className="relative flex h-full w-[min(21rem,88vw)] flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <span className="font-semibold text-slate-900">Danh mục sản phẩm</span>
              <button type="button" onClick={() => setIsMobileMenuOpen(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-4">
              <CategoryPillNav variant="mobile" onNavigate={() => setIsMobileMenuOpen(false)} />
            </div>
            <div className="mt-auto border-t border-slate-200 p-4">
              <Link to={ROUTES.ORDERS} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-sm font-medium text-brand-700">
                <Truck className="w-4 h-4" />
                {t('header.trackOrder')}
              </Link>
            </div>
          </aside>
        </div>
      )}

      <main className={`flex-1 ${hasPageActionBar ? 'pb-0' : 'pb-[4.5rem] md:pb-0'}`}>
        <Outlet />
      </main>

      <Footer />
      {!hasPageActionBar && <nav className="fixed inset-x-0 bottom-0 z-40 flex h-[4.5rem] items-center justify-around border-t border-slate-200 bg-white px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-900 md:hidden" aria-label="Điều hướng chính">
        <MobileNavLink to={ROUTES.HOME} isActive={location.pathname === ROUTES.HOME} icon={<House className="w-5 h-5" />} label="Trang chủ" />
        <MobileNavLink to={ROUTES.PRODUCTS} isActive={location.pathname.startsWith(ROUTES.PRODUCTS) || location.pathname.startsWith('/categories')} icon={<LayoutGrid className="w-5 h-5" />} label="Sản phẩm" />
        <MobileNavLink to={ROUTES.CART} isActive={location.pathname === ROUTES.CART} icon={<ShoppingBag className="w-5 h-5" />} label={t('header.cart')} />
        <MobileNavLink
          to={isAuthenticated ? ROUTES.ACCOUNT_SECURITY : ROUTES.LOGIN}
          isActive={
            location.pathname === ROUTES.ACCOUNT_SECURITY ||
            location.pathname === ROUTES.PROFILE ||
            location.pathname === ROUTES.LOGIN
          }
          icon={isAuthenticated ? <UserRound className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
          label="Tài khoản"
        />
      </nav>}
      <LanguageSwitcher />
      <ContactWidget channels={settings?.contactChannels ?? []} />
      <VoucherFloatingButton onClick={() => setIsVoucherPopupOpen(true)} />
      <VoucherPopup isOpen={isVoucherPopupOpen} onClose={() => setIsVoucherPopupOpen(false)} />
    </div>
  );
};

const MobileNavLink = ({
  to,
  isActive,
  icon,
  label,
}: {
  to: string;
  isActive: boolean;
  icon: ReactNode;
  label: string;
}) => (
  <Link
    to={to}
    className={`flex min-w-14 flex-col items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-medium transition-colors ${
      isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500 dark:text-slate-400'
    }`}
  >
    {icon}
    <span>{label}</span>
  </Link>
);
