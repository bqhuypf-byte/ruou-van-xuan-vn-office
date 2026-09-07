import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { CheckCircle2, ImagePlus, MessageSquarePlus, Star, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/features/auth';
import { useOrders } from '@/features/order';
import { ROUTES } from '@/routes/routes';
import { Button, Spinner } from '@/shared/components/ui';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { uploadService } from '@/shared/services/upload.service';
import { useCreateReview } from '../hooks/useCreateReview';
import type { Review } from '../types/review.types';
import { getEligibleReviewOrders } from '../utils/eligibleReviewOrders';

export interface ReviewFormProps {
  productId: number;
  productName: string;
  variantIds: number[];
  reviews: Review[];
  mode?: 'card' | 'modal';
}

export const ReviewForm = ({
  productId,
  productName,
  variantIds,
  reviews,
  mode = 'card',
}: ReviewFormProps) => {
  const { t, i18n } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { orders, isLoading: ordersLoading } = useOrders(isAuthenticated);
  const createReview = useCreateReview(productId);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const eligibleOrders = useMemo(
    () => getEligibleReviewOrders(orders, variantIds),
    [orders, variantIds],
  );
  const effectiveOrderId =
    selectedOrderId !== null && eligibleOrders.some((order) => order.id === selectedOrderId)
      ? selectedOrderId
      : eligibleOrders[0]?.id ?? null;
  const selectedOrder = eligibleOrders.find((order) => order.id === effectiveOrderId) ?? null;
  const hasReviewed = Boolean(user && reviews.some((review) => review.user.id === user.id));

  const handleSubmit = async () => {
    if (effectiveOrderId === null || comment.trim() === '') return;
    setUploadError(null);
    let imageUrls: string[];
    try {
      imageUrls = await Promise.all(images.map(uploadService.uploadReviewImage));
    } catch (error) {
      setUploadError(getApiErrorMessage(error, t('review.imageUploadError')));
      return;
    }

    try {
      await createReview.mutateAsync({
        orderId: effectiveOrderId,
        rating,
        comment: comment.trim(),
        imageUrls,
      });
      setSuccess(true);
      setComment('');
      setImages([]);
    } catch {
      // The mutation exposes the API error below the form.
    }
  };

  const handleImageSelection = (files: FileList | null) => {
    if (!files) return;
    const accepted = Array.from(files).filter((file) =>
      ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
    );
    setImages((current) => [...current, ...accepted].slice(0, 3));
    setUploadError(accepted.length === files.length ? null : t('review.imageTypeError'));
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="rounded-2xl border border-brand-200 bg-brand-50/60 p-6 text-center dark:border-brand-900 dark:bg-brand-950/30">
        <MessageSquarePlus className="mx-auto mb-3 h-7 w-7 text-brand-600 dark:text-brand-400" />
        <p className="font-semibold text-slate-900 dark:text-white">{t('review.writeTitle')}</p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          {t('review.loginRequired')}
        </p>
        <Link
          to={ROUTES.LOGIN}
          className="mt-4 inline-flex rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          {t('review.loginAction')}
        </Link>
      </div>
    );
  }

  if (ordersLoading) {
    return (
      <div className="flex min-h-32 items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800">
        <Spinner />
      </div>
    );
  }

  if (success || hasReviewed) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
        <CheckCircle2 className="h-5 w-5 shrink-0" />
        <span>{success ? t('review.submitSuccess') : t('review.alreadyReviewed')}</span>
      </div>
    );
  }

  if (eligibleOrders.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center dark:border-slate-800 dark:bg-slate-900">
        <p className="font-semibold text-slate-900 dark:text-white">{t('review.writeTitle')}</p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          {t('review.purchaseRequired')}
        </p>
      </div>
    );
  }

  return (
    <div
      className={
        mode === 'card'
          ? 'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900'
          : ''
      }
    >
      {mode === 'card' && (
        <div className="mb-5">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {t('review.writeTitle')}
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t('review.reviewingProduct', { product: productName })}
          </p>
        </div>
      )}

      {mode === 'modal' && (
        <div className="mb-7 pr-8 text-center">
          <h2 className="text-lg font-medium text-slate-800 dark:text-white">
            {t('review.modalTitle')}
          </h2>
          <p className="mt-1.5 text-base font-bold text-slate-900 dark:text-white sm:text-lg">
            {productName}
          </p>
        </div>
      )}

      <div className={mode === 'modal' ? 'space-y-4' : 'space-y-5'}>
        <div className={mode === 'modal' ? 'flex flex-wrap items-center justify-center gap-3 sm:justify-start' : ''}>
          <span className={mode === 'modal' ? 'text-sm text-slate-700 dark:text-slate-300' : 'mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300'}>
            {t('review.yourRating')}
          </span>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, index) => index + 1).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                aria-label={t('review.selectStars', { count: value })}
                className="rounded p-0.5 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              >
                <Star
                  className={`h-7 w-7 ${
                    value <= rating
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-300 dark:text-slate-700'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className={mode === 'modal' ? 'sm:col-span-2' : 'text-sm font-medium text-slate-700 dark:text-slate-300'}>
            <span className={mode === 'modal' ? 'sr-only' : ''}>{t('review.fullName')}</span>
            <input
              value={user.fullName}
              readOnly
              placeholder={t('review.fullName')}
              className={`${mode === 'modal' ? '' : 'mt-1.5'} w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-slate-700 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300`}
            />
          </label>
          <label className={mode === 'modal' ? '' : 'text-sm font-medium text-slate-700 dark:text-slate-300'}>
            <span className={mode === 'modal' ? 'sr-only' : ''}>{t('review.email')}</span>
            <input
              value={user.email}
              readOnly
              placeholder={t('review.email')}
              className={`${mode === 'modal' ? '' : 'mt-1.5'} w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-slate-700 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300`}
            />
          </label>
          <label className={mode === 'modal' ? '' : 'text-sm font-medium text-slate-700 dark:text-slate-300'}>
            <span className={mode === 'modal' ? 'sr-only' : ''}>{t('review.phone')}</span>
            <input
              value={selectedOrder?.shippingAddress.phone ?? ''}
              readOnly
              placeholder={t('review.phone')}
              className={`${mode === 'modal' ? '' : 'mt-1.5'} w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-slate-700 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300`}
            />
          </label>
          <label className={`${mode === 'modal' && eligibleOrders.length === 1 ? 'hidden' : ''} text-sm font-medium text-slate-700 dark:text-slate-300 sm:col-span-2`}>
            {t('review.order')}
            <select
              value={effectiveOrderId ?? ''}
              onChange={(event) => setSelectedOrderId(Number(event.target.value))}
              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              {eligibleOrders.map((order) => (
                <option key={order.id} value={order.id}>
                  {t('review.orderOption', {
                    id: order.id,
                    date: new Date(order.createdAt).toLocaleDateString(i18n.language),
                  })}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-300 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 dark:border-slate-700">
          <label className="sr-only" htmlFor={`review-comment-${productId}`}>{t('review.comment')}</label>
          <textarea
            id={`review-comment-${productId}`}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            maxLength={2000}
            rows={5}
            placeholder={t('review.commentPlaceholder')}
            className="block w-full resize-y border-0 bg-white px-3.5 py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none dark:bg-slate-950 dark:text-white"
          />
          <label className="flex cursor-pointer items-center gap-2 border-t border-slate-300 px-3.5 py-3 text-sm text-slate-400 transition-colors hover:text-brand-600 dark:border-slate-700 dark:hover:text-brand-400">
            <ImagePlus className="h-5 w-5" />
            <span>{t('review.imagesHint')}</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              disabled={images.length >= 3}
              onChange={(event) => {
                handleImageSelection(event.target.files);
                event.target.value = '';
              }}
              className="sr-only"
            />
          </label>
          <span className="sr-only">{comment.length}/2000</span>
        </div>

        <div>
          {images.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {images.map((file, index) => (
                <span
                  key={`${file.name}-${file.lastModified}`}
                  className="inline-flex max-w-full items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                >
                  <span className="max-w-48 truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => setImages((current) => current.filter((_, i) => i !== index))}
                    aria-label={t('review.removeImage', { name: file.name })}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {(createReview.isError || uploadError) && (
          <p className="text-sm text-rose-600 dark:text-rose-400">
            {uploadError ?? getApiErrorMessage(createReview.error, t('review.submitError'))}
          </p>
        )}

        <Button
          type="button"
          onClick={handleSubmit}
          isLoading={createReview.isPending}
          disabled={comment.trim() === '' || effectiveOrderId === null}
          className={mode === 'modal' ? 'mx-auto flex rounded-md px-6' : 'rounded-full px-6'}
        >
          {t('review.submit')}
        </Button>
      </div>
    </div>
  );
};
