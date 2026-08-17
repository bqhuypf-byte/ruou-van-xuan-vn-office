import { Badge } from '@/shared/components/ui';
import type { OrderStatus, PaymentStatus } from '../types/order.types';

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Chờ Xác Nhận',
  confirmed: 'Đã Xác Nhận',
  shipping: 'Đang Giao',
  delivered: 'Đã Giao',
  cancelled: 'Đã Hủy',
};

const STATUS_VARIANTS: Record<OrderStatus, 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'> = {
  pending: 'warning',
  confirmed: 'info',
  shipping: 'primary',
  delivered: 'success',
  cancelled: 'danger',
};

export const OrderStatusBadge = ({ status }: { status: OrderStatus }) => (
  <Badge variant={STATUS_VARIANTS[status]} size="md">
    {STATUS_LABELS[status]}
  </Badge>
);

const PAYMENT_LABELS: Record<PaymentStatus, string> = {
  unpaid: 'Chưa Thanh Toán',
  paid: 'Đã Thanh Toán',
};

export const PaymentStatusBadge = ({ status }: { status: PaymentStatus }) => (
  <Badge variant={status === 'paid' ? 'success' : 'default'} size="md">
    {PAYMENT_LABELS[status]}
  </Badge>
);
