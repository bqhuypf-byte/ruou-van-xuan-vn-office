import { useState } from 'react';
import { Link } from 'react-router';
import { AlertCircle, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { formatPrice } from '@/shared/utils/formatPrice';
import { ROUTES } from '@/routes/routes';
import { CartItemRow } from '../components/CartItemRow';
import { useCart } from '../hooks/useCart';
import {
  useClearCart,
  useRemoveCartItem,
  useUpdateCartItem,
} from '../hooks/useCartMutations';

export const CartPage = () => {
  const { items, itemCount, subtotal, isLoading, isError, error, refetch } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const clearCart = useClearCart();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [busyItemId, setBusyItemId] = useState<number | null>(null);

  const handleQuantityChange = async (itemId: number, quantity: number) => {
    setFeedback(null);
    setBusyItemId(itemId);
    try {
      await updateItem.mutateAsync({ id: itemId, input: { quantity } });
    } catch (err) {
      setFeedback(getApiErrorMessage(err, 'Không thể cập nhật số lượng.'));
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
      setFeedback(getApiErrorMessage(err, 'Không thể xóa sản phẩm.'));
    } finally {
      setBusyItemId(null);
    }
  };

  const handleClear = async () => {
    setFeedback(null);
    try {
      await clearCart.mutateAsync();
    } catch (err) {
      setFeedback(getApiErrorMessage(err, 'Không thể xóa giỏ hàng.'));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Giỏ Hàng Của Bạn
          </h1>
          {items.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              isLoading={clearCart.isPending}
              leftIcon={<Trash2 className="w-4 h-4" />}
            >
              Xóa Tất Cả
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
                Không thể tải giỏ hàng ({error instanceof Error ? error.message : 'Lỗi kết nối'}).
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Thử Lại
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
            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Giỏ hàng của bạn đang trống
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 mb-6">
              Hãy khám phá sản phẩm và thêm vào giỏ hàng.
            </p>
            <Link to={ROUTES.HOME}>
              <Button rightIcon={<ArrowRight className="w-4 h-4" />}>Tiếp Tục Mua Sắm</Button>
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
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Tóm Tắt Đơn Hàng</h2>
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                <span>Số lượng sản phẩm</span>
                <span>{itemCount}</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-slate-900 dark:text-white pt-3 border-t border-slate-100 dark:border-slate-800">
                <span>Tạm tính</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <Button className="w-full" disabled title="Chức năng thanh toán sẽ sớm ra mắt">
                Thanh Toán (Sắp Ra Mắt)
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
