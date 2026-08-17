import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { AlertCircle, ArrowLeft, MapPin, XCircle } from 'lucide-react';
import { Button, Spinner } from '@/shared/components/ui';
import { formatPrice } from '@/shared/utils/formatPrice';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { ROUTES } from '@/routes/routes';
import { OrderItemRow } from '../components/OrderItemRow';
import { OrderStatusBadge, PaymentStatusBadge } from '../components/OrderStatusBadge';
import { useOrderDetail } from '../hooks/useOrderDetail';
import { useCancelOrder } from '../hooks/useOrderMutations';

const CANCELLABLE_STATUSES = ['pending', 'confirmed'];

export const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const orderId = id ? Number(id) : undefined;
  const { data: order, isLoading, isError, error, refetch } = useOrderDetail(orderId);
  const cancelOrder = useCancelOrder();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleCancel = async () => {
    if (!order) return;
    setFeedback(null);
    try {
      await cancelOrder.mutateAsync(order.id);
      setFeedback({ type: 'success', message: 'Đã hủy đơn hàng thành công.' });
    } catch (err) {
      setFeedback({ type: 'error', message: getApiErrorMessage(err, 'Không thể hủy đơn hàng.') });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <div className="bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 p-4 rounded-xl border border-rose-200 dark:border-rose-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>
              Không thể tải đơn hàng ({error instanceof Error ? error.message : 'Không tìm thấy'}).
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Thử Lại
          </Button>
        </div>
      </div>
    );
  }

  const canCancel = CANCELLABLE_STATUSES.includes(order.status);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <Link
          to={ROUTES.ORDERS}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại danh sách đơn hàng
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Đơn hàng #{order.id}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Đặt lúc {new Date(order.createdAt).toLocaleString('vi-VN')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <OrderStatusBadge status={order.status} />
            <PaymentStatusBadge status={order.paymentStatus} />
          </div>
        </div>

        {feedback && (
          <div
            className={`p-4 rounded-xl text-sm flex items-center gap-2 ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
            }`}
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{feedback.message}</span>
          </div>
        )}

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">
                {order.shippingAddress.fullName} · {order.shippingAddress.phone}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {order.shippingAddress.addressLine}, {order.shippingAddress.city}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Sản Phẩm</h2>
          {order.items.map((item) => (
            <OrderItemRow key={item.id} item={item} />
          ))}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-2">
          <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
            <span>Phí vận chuyển</span>
            <span>{formatPrice(Number(order.shippingFee))}</span>
          </div>
          <div className="flex justify-between text-base font-semibold text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>Tổng cộng</span>
            <span>{formatPrice(Number(order.totalAmount))}</span>
          </div>
        </div>

        {canCancel && (
          <Button
            variant="danger"
            onClick={handleCancel}
            isLoading={cancelOrder.isPending}
            leftIcon={<XCircle className="w-4 h-4" />}
          >
            Hủy Đơn Hàng
          </Button>
        )}
      </div>
    </div>
  );
};
