import { useState } from 'react';
import { CheckCircle2, ImagePlus, Star, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/features/auth';
import { Button } from '@/shared/components/ui';
import { uploadService } from '@/shared/services/upload.service';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { useCreateReview } from '../hooks/useCreateReview';

export interface ReviewFormProps {
  productId: number;
  productName: string;
  mode?: 'card' | 'modal';
}

export const ReviewForm = ({
  productId,
  productName,
  mode = 'card',
}: ReviewFormProps) => {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const createReview = useCreateReview(productId);
  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (
      fullName.trim() === '' ||
      email.trim() === '' ||
      phone.trim() === '' ||
      comment.trim() === ''
    ) {
      return;
    }

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
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
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

  if (success) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
        <CheckCircle2 className="h-5 w-5 shrink-0" />
        <span>{t('review.submitSuccess')}</span>
      </div>
    );
  }

  const inputClass =
    'w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white';

  return (
    <div
      className={
        mode === 'card'
          ? 'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900'
          : ''
      }
    >
      <div className={mode === 'modal' ? 'mb-7 pr-8 text-center' : 'mb-5'}>
        <h2 className="text-lg font-medium text-slate-800 dark:text-white">
          {mode === 'modal' ? t('review.modalTitle') : t('review.writeTitle')}
        </h2>
        <p className="mt-1.5 text-base font-bold text-slate-900 dark:text-white sm:text-lg">
          {productName}
        </p>
      </div>

      <div className={mode === 'modal' ? 'space-y-4' : 'space-y-5'}>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
          <span className="text-sm text-slate-700 dark:text-slate-300">
            {t('review.yourRating')}:
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
          <label className="sm:col-span-2">
            <span className="sr-only">{t('review.fullName')}</span>
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              maxLength={100}
              required
              placeholder={t('review.fullNamePlaceholder')}
              className={inputClass}
            />
          </label>
          <label>
            <span className="sr-only">{t('review.email')}</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              maxLength={150}
              required
              placeholder={t('review.emailPlaceholder')}
              className={inputClass}
            />
          </label>
          <label>
            <span className="sr-only">{t('review.phone')}</span>
            <input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              maxLength={20}
              required
              placeholder={t('review.phonePlaceholder')}
              className={inputClass}
            />
          </label>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-300 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 dark:border-slate-700">
          <label className="sr-only" htmlFor={`review-comment-${productId}`}>
            {t('review.comment')}
          </label>
          <textarea
            id={`review-comment-${productId}`}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            maxLength={2000}
            rows={5}
            required
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
        </div>

        {images.length > 0 && (
          <div className="flex flex-wrap gap-2">
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

        {(createReview.isError || uploadError) && (
          <p className="text-sm text-rose-600 dark:text-rose-400">
            {uploadError ?? getApiErrorMessage(createReview.error, t('review.submitError'))}
          </p>
        )}

        <Button
          type="button"
          onClick={handleSubmit}
          isLoading={createReview.isPending}
          disabled={
            fullName.trim() === '' ||
            email.trim() === '' ||
            phone.trim() === '' ||
            comment.trim() === ''
          }
          className={mode === 'modal' ? 'mx-auto flex rounded-md px-6' : 'rounded-full px-6'}
        >
          {t('review.submit')}
        </Button>
      </div>
    </div>
  );
};
