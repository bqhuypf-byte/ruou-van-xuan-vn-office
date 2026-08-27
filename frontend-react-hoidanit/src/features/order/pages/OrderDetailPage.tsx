import { useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Banknote,
  Check,
  CheckCircle2,
  Copy,
  CreditCard,
  Landmark,
  Loader2,
  MapPin,
  MessageSquareText,
  QrCode,
  RotateCcw,
  Store,
  User,
  XCircle,
} from 'lucide-react';
import { Button, Modal, Spinner } from '@/shared/components/ui';
import { useSiteSettings } from '@/features/home';
import { useAddCartItem } from '@/features/cart';
import { formatPrice } from '@/shared/utils/formatPrice';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { buildVietQrImageUrl } from '@/shared/utils/vietqr';
import { ROUTES } from '@/routes/routes';
import { OrderItemRow } from '../components/OrderItemRow';
import { OrderStatusBadge, PaymentStatusBadge } from '../components/OrderStatusBadge';
import { useOrderDetail } from '../hooks/useOrderDetail';
import { useCancelOrder } from '../hooks/useOrderMutations';

const CANCELLABLE_STATUSES = ['pending', 'confirmed'];

export const OrderDetailPage = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = id ? Number(id) : undefined;
  const { data: order, isLoading, isError, error, refetch } = useOrderDetail(orderId);
  const { data: settings } = useSiteSettings();
  const cancelOrder = useCancelOrder();
  const addCartItem = useAddCartItem();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showPlacedBanner, setShowPlacedBanner] = useState(
    Boolean((location.state as { justPlaced?: boolean } | null)?.justPlaced),
  );
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyContent = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available, ignore
    }
  };

  const handleCancel = async () => {
    if (!order) return;
    setFeedback(null);
    try {
      await cancelOrder.mutateAsync(order.id);
      setIsCancelModalOpen(false);
      setFeedback({ type: 'success', message: t('order.cancelSuccess') });
    } catch (err) {
      setIsCancelModalOpen(false);
      setFeedback({ type: 'error', message: getApiErrorMessage(err, t('order.cancelError')) });
    }
  };

  const handleReorder = async () => {
    if (!order) return;
    setFeedback(null);
    setIsReordering(true);
    try {
      await Promise.all(
        order.items.map((item) =>
          addCartItem.mutateAsync({
            productVariantId: item.productVariantId,
            quantity: item.quantity,
          }),
        ),
      );
      navigate(ROUTES.CART);
    } catch (err) {
      setFeedback({ type: 'error', message: getApiErrorMessage(err, t('order.reorderError')) });
    } finally {
      setIsReordering(false);
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
              {t('order.loadDetailError', {
                reason: error instanceof Error ? error.message : t('common.notFound'),
              })}
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            {t('common.tryAgain')}
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
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('order.backToList')}
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {t('order.orderNumber', { id: order.id })}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {t('order.placedAt', { date: new Date(order.createdAt).toLocaleString(i18n.language) })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <OrderStatusBadge status={order.status} />
            <PaymentStatusBadge status={order.paymentStatus} />
          </div>
        </div>

        {showPlacedBanner && (
          <div className="relative rounded-2xl p-8 text-center bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
            <button
              onClick={() => setShowPlacedBanner(false)}
              aria-label={t('common.close')}
              className="absolute top-3 right-3 text-emerald-700/70 hover:text-emerald-900 dark:text-emerald-400/70 dark:hover:text-emerald-200 text-xs font-medium hover:underline"
            >
              {t('common.close')}
            </button>
            <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-800 dark:text-emerald-300">
              {t('order.placedSuccessTitle')}
            </p>
            <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">
              {t('order.placedSuccess')}
            </p>
          </div>
        )}

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
            <MapPin className="w-5 h-5 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
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

        {order.paymentMethod === 'bank_transfer' && order.paymentStatus === 'unpaid' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            {settings?.bankName && settings?.bankAccountNumber ? (
              <>
                {/* Shared header: title, live status, amount */}
                <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-50 dark:bg-brand-950/50 flex items-center justify-center shrink-0">
                      <Banknote className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {t('checkout.bankTransferInfoTitle')}
                      </p>
                      <p className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        {t('checkout.paymentPending')}
                      </p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {t('checkout.amountToPay')}
                    </p>
                    <p className="text-xl font-bold text-brand-700 dark:text-brand-400">
                      {formatPrice(Number(order.totalAmount))}
                    </p>
                  </div>
                </div>

                {/* Two ways to pay, sharing one visual language */}
                <div className="grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                  {/* Manual transfer */}
                  <div className="md:col-span-3 p-6 space-y-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {t('checkout.manualTransferTitle')}
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Landmark className="w-4 h-4 shrink-0 mt-0.5 text-brand-600 dark:text-brand-400" />
                        <div className="min-w-0">
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {t('checkout.bankNameLabel')}
                          </p>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {settings.bankName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CreditCard className="w-4 h-4 shrink-0 mt-0.5 text-brand-600 dark:text-brand-400" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {t('checkout.bankAccountNumberLabel')}
                          </p>
                          <p className="font-medium text-slate-900 dark:text-white flex items-center gap-1.5">
                            {settings.bankAccountNumber}
                            <button
                              type="button"
                              onClick={() => handleCopyContent(settings.bankAccountNumber ?? '')}
                              className="text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 shrink-0"
                              aria-label={t('checkout.copyContent')}
                            >
                              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </p>
                        </div>
                      </div>
                      {settings.bankAccountHolder && (
                        <div className="flex items-start gap-3">
                          <User className="w-4 h-4 shrink-0 mt-0.5 text-brand-600 dark:text-brand-400" />
                          <div className="min-w-0">
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {t('checkout.bankAccountHolderLabel')}
                            </p>
                            <p className="font-medium text-slate-900 dark:text-white">
                              {settings.bankAccountHolder}
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-start gap-3">
                        <MessageSquareText className="w-4 h-4 shrink-0 mt-0.5 text-brand-600 dark:text-brand-400" />
                        <div className="min-w-0">
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {t('checkout.bankTransferContentLabel')}
                          </p>
                          <p className="flex items-center gap-1.5">
                            <span className="font-mono font-semibold text-sm text-brand-700 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 px-2 py-0.5 rounded">
                              DH{order.id}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyContent(`DH${order.id}`)}
                              className="text-slate-400 hover:text-brand-600 dark:hover:text-brand-400"
                              aria-label={t('checkout.copyContent')}
                            >
                              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Scan QR */}
                  {settings.bankBin && (
                    <div className="md:col-span-2 p-6 bg-slate-50/70 dark:bg-slate-950/30 text-center space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        {t('checkout.scanQrTitle')}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {t('checkout.scanQrInstruction')}
                      </p>
                      <img
                        src={buildVietQrImageUrl({
                          bankBin: settings.bankBin,
                          accountNumber: settings.bankAccountNumber,
                          accountName: settings.bankAccountHolder ?? settings.siteName,
                          amount: Number(order.totalAmount),
                          content: `DH${order.id}`,
                        })}
                        alt={t('checkout.scanQrTitle')}
                        className="mx-auto w-full max-w-[200px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white"
                      />
                      <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                        <QrCode className="w-3 h-3" />
                        VietQR · NAPAS 247
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <p className="p-6 text-sm text-slate-500 dark:text-slate-400">
                {t('checkout.bankTransferInfoNote', {
                  phone: settings?.contactPhone ?? '',
                  orderId: order.id,
                })}
              </p>
            )}
          </div>
        )}

        {order.paymentMethod === 'store_pickup' && (
          <div className="bg-brand-50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-800 rounded-2xl p-6 flex items-start gap-3">
            <Store className="w-5 h-5 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-brand-900 dark:text-brand-200">
                {t('checkout.storePickupInfoTitle')}
              </p>
              <p className="text-sm text-brand-800/90 dark:text-brand-300/90 mt-0.5">
                {t('checkout.storePickupInfoNote', { orderId: order.id })}
              </p>
              {order.pickupStoreAddress ? (
                <p className="text-sm text-brand-800/90 dark:text-brand-300/90 mt-1">
                  {order.pickupStoreLabel}: {order.pickupStoreAddress}
                </p>
              ) : (
                settings?.contactAddresses?.[0] && (
                  <p className="text-sm text-brand-800/90 dark:text-brand-300/90 mt-1">
                    {settings.contactAddresses[0].label}: {settings.contactAddresses[0].address}
                  </p>
                )
              )}
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            {t('order.productsHeading')}
          </h2>
          {order.items.map((item) => (
            <OrderItemRow key={item.id} item={item} />
          ))}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-2">
          <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
            <span>{t('order.shippingFee')}</span>
            <span>{formatPrice(Number(order.shippingFee))}</span>
          </div>
          <div className="flex justify-between text-base font-semibold text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>{t('order.total')}</span>
            <span>{formatPrice(Number(order.totalAmount))}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {canCancel && (
            <Button
              variant="danger"
              onClick={() => setIsCancelModalOpen(true)}
              leftIcon={<XCircle className="w-4 h-4" />}
            >
              {t('order.cancelOrder')}
            </Button>
          )}

          {order.status === 'cancelled' && (
            <Button
              onClick={handleReorder}
              isLoading={isReordering}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              {t('order.reorder')}
            </Button>
          )}
        </div>
      </div>

      <Modal isOpen={isCancelModalOpen} onClose={() => setIsCancelModalOpen(false)} size="sm">
        <div className="text-center pt-2">
          <div className="w-12 h-12 bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {t('order.cancelConfirmTitle')}
          </h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {t('order.cancelConfirmMessage', { id: order.id })}
          </p>
          <div className="flex justify-center gap-3 mt-6">
            <Button variant="outline" onClick={() => setIsCancelModalOpen(false)} type="button">
              {t('common.no')}
            </Button>
            <Button variant="danger" onClick={handleCancel} isLoading={cancelOrder.isPending}>
              {t('common.yes')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
