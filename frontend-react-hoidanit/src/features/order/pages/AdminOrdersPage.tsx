import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, AlertTriangle, MapPin, Phone, Search, ShoppingBag, Trash2 } from 'lucide-react';
import { Button, Input, Modal, Select, Spinner } from '@/shared/components/ui';
import { formatPrice } from '@/shared/utils/formatPrice';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { OrderItemRow } from '../components/OrderItemRow';
import { OrderStatusBadge, PaymentStatusBadge } from '../components/OrderStatusBadge';
import { useAdminOrders } from '../hooks/useAdminOrders';
import {
  useBulkDeleteOrdersAdmin,
  useUpdateOrderPaymentAdmin,
  useUpdateOrderStatusAdmin,
} from '../hooks/useOrderMutations';
import { ORDER_STATUSES, PAYMENT_STATUSES } from '../types/order.types';
import type { Order, OrderStatus, PaymentStatus } from '../types/order.types';

const STATUS_LABEL_KEYS: Record<OrderStatus, string> = {
  pending: 'order.statusPending',
  confirmed: 'order.statusConfirmed',
  shipping: 'order.statusShipping',
  delivered: 'order.statusDelivered',
  cancelled: 'order.statusCancelled',
};

const PAYMENT_LABEL_KEYS: Record<PaymentStatus, string> = {
  unpaid: 'order.paymentUnpaid',
  paid: 'order.paymentPaid',
};

export const AdminOrdersPage = () => {
  const { t, i18n } = useTranslation();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const { orders, isLoading, isError, error, refetch } = useAdminOrders(
    statusFilter === 'all' ? undefined : statusFilter,
  );
  const updateStatus = useUpdateOrderStatusAdmin();
  const updatePayment = useUpdateOrderPaymentAdmin();
  const bulkDelete = useBulkDeleteOrdersAdmin();
  const [busyOrderId, setBusyOrderId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return orders;
    return orders.filter(
      (order) =>
        order.id.toString().includes(term) ||
        order.shippingAddress.phone.toLowerCase().includes(term) ||
        order.shippingAddress.fullName.toLowerCase().includes(term),
    );
  }, [orders, search]);

  const toggleSelected = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allVisibleSelected =
    filteredOrders.length > 0 && filteredOrders.every((o) => selectedIds.has(o.id));

  const toggleSelectAll = () => {
    setSelectedIds((prev) => {
      if (allVisibleSelected) {
        const next = new Set(prev);
        filteredOrders.forEach((o) => next.delete(o.id));
        return next;
      }
      const next = new Set(prev);
      filteredOrders.forEach((o) => next.add(o.id));
      return next;
    });
  };

  const handleBulkDelete = async () => {
    setFeedback(null);
    try {
      const ids = [...selectedIds];
      await bulkDelete.mutateAsync(ids);
      setSelectedIds(new Set());
      setIsDeleteModalOpen(false);
      setFeedback({ type: 'success', message: `Đã xóa ${ids.length} đơn hàng.` });
    } catch (err) {
      setFeedback({ type: 'error', message: getApiErrorMessage(err, 'Không thể xóa đơn hàng đã chọn.') });
    }
  };

  const handleStatusChange = async (order: Order, status: OrderStatus) => {
    setFeedback(null);
    setBusyOrderId(order.id);
    try {
      await updateStatus.mutateAsync({ id: order.id, status });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: getApiErrorMessage(err, `Không thể cập nhật trạng thái đơn hàng #${order.id}.`),
      });
    } finally {
      setBusyOrderId(null);
    }
  };

  const handlePaymentChange = async (order: Order, paymentStatus: PaymentStatus) => {
    setFeedback(null);
    setBusyOrderId(order.id);
    try {
      await updatePayment.mutateAsync({ id: order.id, paymentStatus });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: getApiErrorMessage(err, `Không thể cập nhật thanh toán đơn hàng #${order.id}.`),
      });
    } finally {
      setBusyOrderId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Quản Lý Đơn Hàng
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Xem và cập nhật trạng thái đơn hàng, thanh toán của toàn bộ khách hàng.
        </p>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-xs font-medium hover:underline ml-4">
            Đóng
          </button>
        </div>
      )}

      {isError && (
        <div className="bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 p-4 rounded-xl border border-rose-200 dark:border-rose-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>
              Không thể tải danh sách đơn hàng (
              {error instanceof Error ? error.message : 'Lỗi kết nối'}).
            </span>
          </div>
          <button
            onClick={() => refetch()}
            className="text-xs font-semibold text-rose-800 dark:text-rose-300 hover:underline shrink-0"
          >
            Thử Lại
          </button>
        </div>
      )}

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2">
        {(['all', ...ORDER_STATUSES] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
              statusFilter === status
                ? 'bg-brand-600 text-white'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-brand-400'
            }`}
          >
            {status === 'all' ? 'Tất Cả' : t(STATUS_LABEL_KEYS[status])}
          </button>
        ))}
      </div>

      {/* Search + bulk actions toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-3">
        <div className="w-full sm:w-96">
          <Input
            placeholder="Tìm theo mã đơn, tên hoặc số điện thoại..."
            leftIcon={<Search className="w-4 h-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {filteredOrders.length > 0 && (
          <div className="flex items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={allVisibleSelected}
                onChange={toggleSelectAll}
                className="rounded border-slate-300 text-brand-600 focus:ring-brand-500/20 dark:border-slate-700"
              />
              Chọn tất cả ({filteredOrders.length})
            </label>
            {selectedIds.size > 0 && (
              <Button
                variant="danger"
                size="sm"
                leftIcon={<Trash2 className="w-4 h-4" />}
                onClick={() => setIsDeleteModalOpen(true)}
              >
                Xóa Đã Chọn ({selectedIds.size})
              </Button>
            )}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-16 text-center shadow-sm">
          <div className="w-16 h-16 bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            {search ? 'Không tìm thấy đơn hàng phù hợp' : 'Chưa có đơn hàng nào'}
          </h3>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className={`bg-white dark:bg-slate-900 rounded-2xl border shadow-sm overflow-hidden transition-colors ${
                selectedIds.has(order.id)
                  ? 'border-brand-400 dark:border-brand-600'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(order.id)}
                    onChange={() => toggleSelected(order.id)}
                    className="mt-1 rounded border-slate-300 text-brand-600 focus:ring-brand-500/20 dark:border-slate-700"
                  />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      Đơn Hàng #{order.id}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(order.createdAt).toLocaleString(i18n.language)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <OrderStatusBadge status={order.status} />
                  <PaymentStatusBadge status={order.paymentStatus} />
                </div>
              </div>

              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                      Người Đặt
                    </p>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {order.shippingAddress.fullName}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <Phone className="w-3.5 h-3.5 shrink-0" />
                      {order.shippingAddress.phone}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 flex items-start gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      {order.shippingAddress.addressLine}, {order.shippingAddress.city}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Select
                      label="Trạng Thái Đơn Hàng"
                      value={order.status}
                      disabled={busyOrderId === order.id}
                      onChange={(e) => handleStatusChange(order, e.target.value as OrderStatus)}
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {t(STATUS_LABEL_KEYS[status])}
                        </option>
                      ))}
                    </Select>
                    <Select
                      label="Thanh Toán"
                      value={order.paymentStatus}
                      disabled={busyOrderId === order.id}
                      onChange={(e) =>
                        handlePaymentChange(order, e.target.value as PaymentStatus)
                      }
                    >
                      {PAYMENT_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {t(PAYMENT_LABEL_KEYS[status])}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                    Sản Phẩm ({order.items.length})
                  </p>
                  <div className="max-h-56 overflow-y-auto pr-1">
                    {order.items.map((item) => (
                      <OrderItemRow key={item.id} item={item} />
                    ))}
                  </div>
                  <div className="flex justify-between pt-2 text-sm font-semibold text-slate-900 dark:text-white">
                    <span>Tổng Cộng</span>
                    <span>{formatPrice(Number(order.totalAmount))}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} size="sm">
        <div className="text-center pt-2">
          <div className="w-12 h-12 bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Xác nhận xóa {selectedIds.size} đơn hàng?
          </h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Hành động này không thể hoàn tác. Toàn bộ dữ liệu đơn hàng và sản phẩm bên trong sẽ bị
            xóa vĩnh viễn.
          </p>
          <div className="flex justify-center gap-3 mt-6">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} type="button">
              Hủy Bỏ
            </Button>
            <Button variant="danger" onClick={handleBulkDelete} isLoading={bulkDelete.isPending}>
              Xóa {selectedIds.size} Đơn Hàng
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
