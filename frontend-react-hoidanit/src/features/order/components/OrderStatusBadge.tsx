import { useTranslation } from 'react-i18next';
import { Badge } from '@/shared/components/ui';
import type { OrderStatus, PaymentStatus } from '../types/order.types';

const STATUS_KEYS: Record<OrderStatus, string> = {
  pending: 'order.statusPending',
  confirmed: 'order.statusConfirmed',
  shipping: 'order.statusShipping',
  delivered: 'order.statusDelivered',
  cancelled: 'order.statusCancelled',
};

const STATUS_VARIANTS: Record<OrderStatus, 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'> = {
  pending: 'warning',
  confirmed: 'info',
  shipping: 'primary',
  delivered: 'success',
  cancelled: 'danger',
};

export const OrderStatusBadge = ({ status }: { status: OrderStatus }) => {
  const { t } = useTranslation();
  return (
    <Badge variant={STATUS_VARIANTS[status]} size="md">
      {t(STATUS_KEYS[status])}
    </Badge>
  );
};

const PAYMENT_KEYS: Record<PaymentStatus, string> = {
  unpaid: 'order.paymentUnpaid',
  paid: 'order.paymentPaid',
};

export const PaymentStatusBadge = ({ status }: { status: PaymentStatus }) => {
  const { t } = useTranslation();
  return (
    <Badge variant={status === 'paid' ? 'success' : 'default'} size="md">
      {t(PAYMENT_KEYS[status])}
    </Badge>
  );
};
