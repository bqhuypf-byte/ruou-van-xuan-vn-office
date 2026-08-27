import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { AlertCircle, PackageSearch, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { ROUTES } from '@/routes/routes';
import { OrderListItem } from '../components/OrderListItem';
import { useOrders } from '../hooks/useOrders';

export const OrdersPage = () => {
  const { t } = useTranslation();
  const { orders, isLoading, isError, error, refetch } = useOrders();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t('order.myOrders')}
        </h1>

        {isError && (
          <div className="bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 p-4 rounded-xl border border-rose-200 dark:border-rose-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>
                {t('order.loadError', {
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
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-16 text-center shadow-sm">
            <div className="w-16 h-16 bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <PackageSearch className="w-8 h-8" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              {t('order.emptyTitle')}
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 mb-6">
              {t('order.emptySubtitle')}
            </p>
            <Link to={ROUTES.HOME}>
              <Button rightIcon={<ArrowRight className="w-4 h-4" />}>{t('common.continueShopping')}</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderListItem key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
