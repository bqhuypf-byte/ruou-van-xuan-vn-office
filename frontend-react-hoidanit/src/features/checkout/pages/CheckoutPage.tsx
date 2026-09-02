import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  AlertCircle,
  Banknote,
  CheckCircle2,
  MapPin,
  Store,
  Truck,
  PackageCheck,
} from 'lucide-react';
import { Button, Spinner } from '@/shared/components/ui';
import { BottleIcon } from '@/shared/components/icons';
import { formatPrice } from '@/shared/utils/formatPrice';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { getPlaceholderTint } from '@/shared/utils/placeholderTint';
import { useCart } from '@/features/cart';
import { useSiteSettings, useVoucherValidation } from '@/features/home';
import { useAddresses } from '@/features/user-profile';
import { ROUTES } from '@/routes/routes';
import { useCheckout } from '../hooks/useCheckout';
import type { PaymentMethod } from '../types/checkout.types';

const PAYMENT_METHODS: {
  value: PaymentMethod;
  icon: typeof Truck;
  labelKey: string;
  descriptionKey: string;
  settingsField: 'codDescription' | 'storePickupDescription' | 'bankTransferDescription';
}[] = [
  {
    value: 'cod',
    icon: Truck,
    labelKey: 'checkout.paymentCod',
    descriptionKey: 'checkout.paymentCodDesc',
    settingsField: 'codDescription',
  },
  {
    value: 'store_pickup',
    icon: Store,
    labelKey: 'checkout.paymentPickup',
    descriptionKey: 'checkout.paymentPickupDesc',
    settingsField: 'storePickupDescription',
  },
  {
    value: 'bank_transfer',
    icon: Banknote,
    labelKey: 'checkout.paymentBankTransfer',
    descriptionKey: 'checkout.paymentBankTransferDesc',
    settingsField: 'bankTransferDescription',
  },
];

export const CheckoutPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { items, itemCount, subtotal, isLoading: isCartLoading } = useCart();
  const { addresses, isLoading: isAddressesLoading } = useAddresses();
  const { data: settings } = useSiteSettings();
  const checkout = useCheckout();
  const voucherCode = searchParams.get('voucher')?.trim().toUpperCase() || null;
  const voucherValidation = useVoucherValidation(voucherCode, subtotal);
  const appliedVoucher = voucherValidation.data;

  const [selectedAddressIdOverride, setSelectedAddressIdOverride] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [selectedStoreIndex, setSelectedStoreIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const defaultAddressId = addresses.find((a) => a.isDefault)?.id ?? addresses[0]?.id ?? null;
  const selectedAddressId = selectedAddressIdOverride ?? defaultAddressId;

  const stores = settings?.contactAddresses ?? [];

  const freeShippingThreshold = Number(settings?.freeShippingThreshold ?? 0);
  const isPickup = paymentMethod === 'store_pickup';
  const isFreeShipping = isPickup || (freeShippingThreshold > 0 && subtotal >= freeShippingThreshold);
  const shippingFee = isFreeShipping ? 0 : Number(settings?.shippingFee ?? 0);
  const discountAmount = appliedVoucher?.discountAmount ?? 0;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);
  const amountToFreeShipping = freeShippingThreshold - subtotal;
  const checkoutError =
    error ??
    (voucherValidation.isError
      ? getApiErrorMessage(voucherValidation.error, 'Mã khuyến mãi không còn hợp lệ.')
      : null);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) return;
    setError(null);
    try {
      const order = await checkout.mutateAsync({
        addressId: selectedAddressId,
        paymentMethod,
        pickupStoreIndex: isPickup ? selectedStoreIndex : undefined,
        voucherCode: appliedVoucher?.code,
        items: items.map((item) => ({
          productVariantId: item.productVariantId,
          productName: item.productName ?? item.sku,
          sku: item.sku,
          price: Number(item.salePrice ?? item.price),
          quantity: item.quantity,
          thumbnailUrl: item.thumbnailUrl ?? undefined,
        })),
      });
      navigate(ROUTES.ORDER_DETAIL.replace(':id', String(order.id)), {
        state: { justPlaced: true },
      });
    } catch (err) {
      setError(getApiErrorMessage(err, t('checkout.placeOrderError')));
    }
  };

  if (isCartLoading || isAddressesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t('checkout.emptyCartTitle')}
        </h1>
        <p className="text-slate-500 dark:text-slate-400">{t('checkout.emptyCartSubtitle')}</p>
        <Link to={ROUTES.HOME}>
          <Button>{t('common.continueShopping')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t('checkout.title')}
        </h1>

        {checkoutError && (
          <div className="p-4 rounded-xl text-sm bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{checkoutError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Order review */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {t('checkout.reviewItems')}
              </h2>
              <div className="space-y-4">
                {items.map((item) => {
                  const unitPrice = Number(item.salePrice ?? item.price);
                  return (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 flex items-center justify-center">
                        {item.thumbnailUrl ? (
                          <img
                            src={item.thumbnailUrl}
                            alt={item.productName ?? item.sku}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center text-white/85"
                            style={{ backgroundColor: getPlaceholderTint(item.productVariantId) }}
                          >
                            <BottleIcon className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 dark:text-white truncate">
                          {item.productName ?? item.sku}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {Object.values(item.attributes ?? {}).filter(Boolean).join(' / ') || item.sku}
                          {' · '}
                          {t('checkout.qty', { count: item.quantity })}
                        </p>
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-white shrink-0">
                        {formatPrice(unitPrice * item.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>
              {settings?.checkoutReviewNote && (
                <p className="text-xs text-slate-400 pt-1">{settings.checkoutReviewNote}</p>
              )}
            </div>

            {/* Shipping address */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {t('checkout.shippingInfo')}
              </h2>
              {addresses.length === 0 ? (
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {t('checkout.noAddress')}{' '}
                  <Link to={ROUTES.PROFILE} className="text-brand-600 dark:text-brand-400 font-medium hover:underline">
                    {t('checkout.addAddress')}
                  </Link>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {addresses.map((address) => (
                    <label
                      key={address.id}
                      className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-colors ${
                        selectedAddressId === address.id
                          ? 'border-brand-600 bg-brand-50 dark:bg-brand-950/30'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="addressId"
                        checked={selectedAddressId === address.id}
                        onChange={() => setSelectedAddressIdOverride(address.id)}
                        className="mt-1 text-brand-600 focus:ring-brand-500/20"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                          {address.fullName}
                          {address.isDefault && (
                            <span className="text-[11px] font-semibold text-brand-700 bg-brand-100 dark:bg-brand-900/50 dark:text-brand-300 px-2 py-0.5 rounded-full">
                              {t('checkout.defaultAddress')}
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{address.phone}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {address.addressLine}, {address.city}
                        </p>
                      </div>
                    </label>
                  ))}
                  <Link
                    to={ROUTES.PROFILE}
                    className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    {t('checkout.addAddress')}
                  </Link>
                </div>
              )}
              {settings?.checkoutShippingNote && (
                <p className="text-xs text-slate-400 pt-1">{settings.checkoutShippingNote}</p>
              )}
            </div>

            {/* Payment method */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {t('checkout.paymentMethod')}
              </h2>
              <div className="space-y-2.5">
                {PAYMENT_METHODS.map(({ value, icon: Icon, labelKey, descriptionKey, settingsField }) => (
                  <label
                    key={value}
                    className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-colors ${
                      paymentMethod === value
                        ? 'border-brand-600 bg-brand-50 dark:bg-brand-950/30'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === value}
                      onChange={() => setPaymentMethod(value)}
                      className="text-brand-600 focus:ring-brand-500/20"
                    />
                    <Icon className="w-5 h-5 text-brand-600 dark:text-brand-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 dark:text-white">{t(labelKey)}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {settings?.[settingsField] || t(descriptionKey)}
                      </p>
                    </div>
                    {paymentMethod === value && (
                      <CheckCircle2 className="w-5 h-5 text-brand-600 dark:text-brand-400 shrink-0" />
                    )}
                  </label>
                ))}
              </div>
              {isPickup && (
                <div className="space-y-2.5 pt-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {t('checkout.selectPickupStore')}
                  </p>
                  {stores.length === 0 ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {t('checkout.noPickupStore')}
                    </p>
                  ) : (
                    stores.map((store, index) => (
                      <label
                        key={`${store.label}-${index}`}
                        className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-colors ${
                          selectedStoreIndex === index
                            ? 'border-brand-600 bg-brand-50 dark:bg-brand-950/30'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="pickupStore"
                          checked={selectedStoreIndex === index}
                          onChange={() => setSelectedStoreIndex(index)}
                          className="mt-1 text-brand-600 focus:ring-brand-500/20"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 dark:text-white">{store.label}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{store.address}</p>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              )}
              {settings?.checkoutPaymentNote && (
                <p className="text-xs text-slate-400 pt-1">{settings.checkoutPaymentNote}</p>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm h-fit space-y-4 lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              {t('cart.orderSummary')}
            </h2>
            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
              <span>{t('cart.itemCount')}</span>
              <span>{itemCount}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
              <span>{t('cart.subtotal')}</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {appliedVoucher && (
              <div className="flex justify-between text-sm text-emerald-600 dark:text-emerald-400">
                <span>Mã giảm giá ({appliedVoucher.code})</span>
                <span className="font-semibold">-{formatPrice(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
              <span>{t('order.shippingFee')}</span>
              <span>{isFreeShipping ? t('checkout.freeShipping') : formatPrice(shippingFee)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-slate-900 dark:text-white pt-3 border-t border-slate-100 dark:border-slate-800">
              <span>{t('order.total')}</span>
              <span>{formatPrice(total)}</span>
            </div>
            {isFreeShipping ? (
              <div className="flex items-start gap-2 text-xs text-brand-700 bg-brand-50 dark:bg-brand-950/30 dark:text-brand-300 rounded-lg p-3">
                <PackageCheck className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{t('cart.freeShippingReached')}</span>
              </div>
            ) : (
              freeShippingThreshold > 0 && (
                <div className="flex items-start gap-2 text-xs text-brand-700 bg-brand-50 dark:bg-brand-950/30 dark:text-brand-300 rounded-lg p-3">
                  <Truck className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    {t('cart.freeShippingNotice', { amount: formatPrice(amountToFreeShipping) })}
                  </span>
                </div>
              )
            )}
            <Button
              className="w-full"
              size="lg"
              disabled={
                !selectedAddressId ||
                (isPickup && stores.length === 0) ||
                (Boolean(voucherCode) &&
                  (voucherValidation.isLoading || voucherValidation.isError))
              }
              isLoading={checkout.isPending}
              onClick={handlePlaceOrder}
            >
              {t('checkout.placeOrder')}
            </Button>
            <p className="flex items-start gap-1.5 text-xs text-slate-400">
              <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              {settings?.checkoutSummaryNote || t('checkout.confirmNote')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
