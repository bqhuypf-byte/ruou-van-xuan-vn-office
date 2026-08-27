import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ChevronRight } from 'lucide-react';
import { formatPrice } from '@/shared/utils/formatPrice';
import { ROUTES } from '@/routes/routes';
import { OrderStatusBadge } from './OrderStatusBadge';
import type { Order } from '../types/order.types';

export interface OrderListItemProps {
  order: Order;
}

export const OrderListItem = ({ order }: OrderListItemProps) => {
  const { t, i18n } = useTranslation();

  return (
    <Link
      to={ROUTES.ORDER_DETAIL.replace(':id', String(order.id))}
      className="block bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-slate-900 dark:text-white">
            {t('order.orderNumber', { id: order.id })}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {new Date(order.createdAt).toLocaleString(i18n.language)} ·{' '}
            {t('order.itemsCount', { count: order.items.length })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <OrderStatusBadge status={order.status} />
          <span className="font-semibold text-slate-900 dark:text-white">
            {formatPrice(Number(order.totalAmount))}
          </span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>
      </div>
    </Link>
  );
};
