import { useState } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { AlertCircle, ShoppingCart, Trash2, ArrowRight, Truck } from 'lucide-react';
import { Button } from '@/shared/components/ui';
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

  const freeShippingThreshold = Number(settings?.freeShippingThreshold ?? 0);
  const amountToFreeShipping = freeShippingThreshold - subtotal;

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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t('cart.title')}
          </h1>
          {items.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              isLoading={clearCart.isPending}
              leftIcon={<Trash2 className="w-4 h-4" />}
            >
              {t('cart.clearAll')}
            </Button>
          )}
        </div>

        {feedback && (
          <div className="p-4 rounded-xl text-sm bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {isError && (
          <div className="bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 p-4 rounded-xl border border-rose-200 dark:border-rose-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>
                {t('cart.loadError', {
                  reason: error instanceof Error ? error.message : t('common.connectionError'),
                })}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              {t('common.tryAgain')}
            </Button>
          </div>
        )}

        {isLoading ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm animate-pulse space-y-4">
            <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-16 text-center shadow-sm">
            <div className="w-16 h-16 bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              {t('cart.emptyTitle')}
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 mb-6">
              {t('cart.emptySubtitle')}
            </p>
            <Link to={ROUTES.HOME}>
              <Button rightIcon={<ArrowRight className="w-4 h-4" />}>
                {t('common.continueShopping')}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-sm">
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

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm h-fit space-y-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {t('cart.orderSummary')}
              </h2>
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                <span>{t('cart.itemCount')}</span>
                <span>{itemCount}</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-slate-900 dark:text-white pt-3 border-t border-slate-100 dark:border-slate-800">
                <span>{t('cart.subtotal')}</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {freeShippingThreshold > 0 && amountToFreeShipping > 0 && (
                <div className="flex items-start gap-2 text-xs text-brand-700 bg-brand-50 dark:bg-brand-950/30 dark:text-brand-300 rounded-lg p-3">
                  <Truck className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    {t('cart.freeShippingNotice', { amount: formatPrice(amountToFreeShipping) })}
                  </span>
                </div>
              )}
              <Link to={ROUTES.CHECKOUT}>
                <Button className="w-full">{t('cart.proceedToCheckout')}</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
