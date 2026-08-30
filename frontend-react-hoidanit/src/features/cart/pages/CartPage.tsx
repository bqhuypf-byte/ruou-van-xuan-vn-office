import { useState } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  AlertCircle,
  ShoppingCart,
  Trash2,
  ArrowRight,
  Truck,
  ChevronRight,
  Tag,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { PromoBand } from '@/shared/components/layout';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { formatPrice } from '@/shared/utils/formatPrice';
import { useSiteSettings } from '@/features/home';
import { ROUTES } from '@/routes/routes';
import { CartItemRow } from '../components/CartItemRow';
import { useCart } from '../hooks/useCart';
import {
  useClearCart,
  useRemoveCartItem,
  useUpdateCartItem,
} from '../hooks/useCartMutations';

export const CartPage = () => {
  const { t } = useTranslation();
  const { items, itemCount, subtotal, isLoading, isError, error, refetch } = useCart();
  const { data: settings } = useSiteSettings();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const clearCart = useClearCart();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [busyItemId, setBusyItemId] = useState<number | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const freeShippingThreshold = Number(settings?.freeShippingThreshold ?? 0);
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingProgress =
    freeShippingThreshold > 0
      ? Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))
      : 100;

  const handleQuantityChange = async (itemId: number, quantity: number) => {
    setFeedback(null);
    setBusyItemId(itemId);
    try {
      await updateItem.mutateAsync({ id: itemId, input: { quantity } });
    } catch (err) {
      setFeedback(getApiErrorMessage(err, t('cart.updateQtyError')));
    } finally {
      setBusyItemId(null);
    }
  };

  const handleRemove = async (itemId: number) => {
    setFeedback(null);
    setBusyItemId(itemId);
    try {
      await removeItem.mutateAsync(itemId);
    } catch (err) {
      setFeedback(getApiErrorMessage(err, t('cart.removeError')));
    } finally {
      setBusyItemId(null);
    }
  };

  const handleClear = async () => {
    setFeedback(null);
    try {
      await clearCart.mutateAsync();
    } catch (err) {
      setFeedback(getApiErrorMessage(err, t('cart.clearError')));
    }
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setAppliedCoupon(couponCode.trim().toUpperCase());
  };

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          <Link to={ROUTES.HOME} className="hover:text-brand-700 dark:hover:text-brand-400 transition-colors">
            {t('common.home', 'Trang chủ')}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 dark:text-white font-semibold">{t('cart.title')}</span>
        </nav>

        {/* Page Title & Clear Button */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading uppercase">
              {t('cart.title')}
            </h1>
            {items.length > 0 && (
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Bạn đang có <strong className="text-slate-900 dark:text-white">{itemCount}</strong> sản phẩm trong giỏ hàng
              </p>
            )}
          </div>
          {items.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              isLoading={clearCart.isPending}
              leftIcon={<Trash2 className="w-4 h-4" />}
              className="text-xs rounded-xl border-slate-200 dark:border-slate-800 hover:text-rose-600 hover:border-rose-300"
            >
              <span className="hidden sm:inline">{t('cart.clearAll')}</span>
              <span className="sm:hidden">Xóa hết</span>
            </Button>
          )}
        </div>

        {feedback && (
          <div className="p-4 rounded-2xl text-sm bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {isError && (
          <div className="bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 p-4 rounded-2xl border border-rose-200 dark:border-rose-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>
                {t('cart.loadError', {
                  reason: error instanceof Error ? error.message : t('common.connectionError'),
                })}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetch()} className="rounded-xl">
              {t('common.tryAgain')}
            </Button>
          </div>
        )}

        {isLoading ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm animate-pulse space-y-4">
            <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 sm:p-20 text-center shadow-xs">
            <div className="w-20 h-20 bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-400 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-inner">
              <ShoppingCart className="w-10 h-10" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {t('cart.emptyTitle')}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
              {t('cart.emptySubtitle')}
            </p>
            <Link to={ROUTES.PRODUCTS}>
              <Button size="lg" className="rounded-full shadow-md px-8" rightIcon={<ArrowRight className="w-4 h-4" />}>
                {t('common.continueShopping')}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Cart Items List */}
            <div className="lg:col-span-7 xl:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xs space-y-1">
              {/* Free Shipping Bar */}
              {freeShippingThreshold > 0 && (
                <div className="p-4 mb-4 rounded-2xl bg-brand-50/70 dark:bg-brand-950/30 border border-brand-200/60 dark:border-brand-900/60 space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-brand-900 dark:text-brand-300">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-brand-700 dark:text-brand-400 shrink-0" />
                      <span>
                        {amountToFreeShipping === 0
                          ? '🎉 Chúc mừng! Đơn hàng của bạn đã đủ điều kiện Freeship.'
                          : `Mua thêm ${formatPrice(amountToFreeShipping)} để được Miễn phí giao hàng`}
                      </span>
                    </div>
                    <span className="text-xs text-brand-700 dark:text-brand-400 font-bold">{shippingProgress}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-brand-200/50 dark:bg-brand-900/50 overflow-hidden">
                    <div
                      className="h-full bg-brand-600 transition-all duration-500 rounded-full"
                      style={{ width: `${shippingProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Items */}
              {items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onQuantityChange={(quantity) => handleQuantityChange(item.id, quantity)}
                  onRemove={() => handleRemove(item.id)}
                  isUpdating={busyItemId === item.id && updateItem.isPending}
                  isRemoving={busyItemId === item.id && removeItem.isPending}
                />
              ))}
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-5 xl:col-span-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs lg:sticky lg:top-24 space-y-5">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                {t('cart.orderSummary')}
              </h2>

              {/* Price Details */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>{t('cart.itemCount')}</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{itemCount} sản phẩm</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>{t('cart.subtotal')}</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Phí vận chuyển</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    {amountToFreeShipping === 0 ? 'Miễn phí' : 'Tính khi thanh toán'}
                  </span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" />
                      Mã: {appliedCoupon}
                    </span>
                    <span>Đã áp dụng</span>
                  </div>
                )}
              </div>

              {/* Promo Code Input */}
              <form onSubmit={handleApplyCoupon} className="pt-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Mã ưu đãi / Voucher"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-600"
                    />
                  </div>
                  <Button type="submit" variant="outline" size="sm" className="rounded-xl text-xs px-3.5">
                    Áp dụng
                  </Button>
                </div>
              </form>

              {/* Total & Checkout CTA */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-base font-bold text-slate-900 dark:text-white">Tổng thanh toán</span>
                  <span className="text-xl sm:text-2xl font-extrabold text-brand-700 dark:text-brand-400 font-heading">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <Link to={ROUTES.CHECKOUT} className="block">
                  <Button size="lg" className="w-full rounded-2xl py-3.5 font-bold shadow-md shadow-brand-900/10">
                    {t('cart.proceedToCheckout')}
                  </Button>
                </Link>

                <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <ShieldCheck className="w-4 h-4 text-brand-600" />
                  <span>Thanh toán an toàn & Bảo mật 100%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Promo Band */}
        <div className="pt-6">
          <PromoBand />
        </div>
      </div>

      {/* Mobile Bottom Sticky Bar (when cart has items) */}
      {items.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 lg:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-3.5 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between gap-4 max-w-md mx-auto">
            <div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block leading-tight">Tổng cộng</span>
              <span className="text-lg font-extrabold text-brand-700 dark:text-brand-400 font-heading leading-tight">
                {formatPrice(subtotal)}
              </span>
            </div>
            <Link to={ROUTES.CHECKOUT} className="flex-1 max-w-[200px]">
              <Button size="md" className="w-full rounded-xl font-bold">
                {t('cart.proceedToCheckout')}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
