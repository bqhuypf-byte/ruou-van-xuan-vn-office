import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Star } from 'lucide-react';
import { formatPrice } from '@/shared/utils/formatPrice';
import { ROUTES } from '@/routes/routes';
import type { FeaturedDeal } from '../hooks/useFeaturedDeals';
import { getPlaceholderTint } from '@/shared/utils/placeholderTint';
import { BottleIcon } from '@/shared/components/icons';

export interface DealCardProps {
  deal: FeaturedDeal;
  className?: string;
}

export const DealCard = ({ deal, className = '' }: DealCardProps) => {
  const { t } = useTranslation();
  const { product, price, originalPrice, discountPercent, savings, badgeText } = deal;
  const rating = product.rating ?? 0;
  const reviewCount = product.reviewCount ?? 0;

  return (
    <Link
      to={ROUTES.PRODUCT_DETAIL.replace(':slug', product.slug)}
      className={`group relative block min-w-0 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-brand-600 transition-all ${className}`}
    >
      {badgeText ? (
        <span className="absolute top-0 right-0 z-10 bg-rose-600 text-white text-xs font-semibold px-3 py-1 rounded-bl-2xl">
          {badgeText}
        </span>
      ) : (
        discountPercent !== null &&
        discountPercent > 0 && (
          <span className="absolute top-0 right-0 z-10 bg-rose-600 text-white text-xs font-semibold px-3 py-1 rounded-bl-2xl">
            {t('productCard.off', { percent: discountPercent })}
          </span>
        )
      )}

      <div className="aspect-square flex items-center justify-center overflow-hidden">
        {product.thumbnailUrl ? (
          <img
            src={product.thumbnailUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div
            className="w-full h-full relative flex flex-col items-center justify-center gap-2 text-white/90 overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${getPlaceholderTint(product.id)} 0%, ${getPlaceholderTint(product.id)}dd 50%, ${getPlaceholderTint(product.id)}99 100%)` }}
          >
            {/* Decorative rings */}
            <div
              className="absolute -right-6 -top-6 w-28 h-28 rounded-full border-[3px] border-white/10"
              aria-hidden
            />
            <div
              className="absolute -left-4 -bottom-4 w-20 h-20 rounded-full border-[3px] border-white/10"
              aria-hidden
            />
            <BottleIcon className="w-14 h-14 sm:w-16 sm:h-16 drop-shadow-lg" />
            <span className="text-[10px] sm:text-xs font-medium text-white/70 text-center px-3 line-clamp-1">
              {product.name}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-1.5 rounded-b-2xl bg-white p-2.5 sm:p-4 dark:bg-slate-900">
        <p className="min-h-[2.5em] text-center text-sm font-semibold text-slate-900 line-clamp-2 sm:text-left sm:text-[16px] dark:text-white">
          {product.name}
        </p>
        {reviewCount > 0 && (
          <div className="hidden items-center gap-1.5 sm:flex">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.round(rating)
                      ? 'fill-brand-600 text-brand-600'
                      : 'fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">({reviewCount})</span>
          </div>
        )}
        <div className="flex items-baseline justify-center gap-2 sm:justify-start">
          <span className="text-sm font-bold text-rose-600 sm:text-[16px] dark:text-rose-400">
            {formatPrice(price)}
          </span>
          {originalPrice !== null && (
            <span className="text-slate-400 line-through text-sm">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>
        {savings !== null && savings > 0 && (
          <p className="hidden text-sm font-semibold text-[#249b3e] sm:block">
            {t('productCard.savings', { amount: formatPrice(savings) })}
          </p>
        )}
        <span className="mt-2 hidden rounded-full border border-brand-600 py-1.5 text-center text-xs font-semibold text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white sm:block dark:border-brand-400 dark:text-brand-400">
          {t('productCard.viewProduct')}
        </span>
      </div>
    </Link>
  );
};
