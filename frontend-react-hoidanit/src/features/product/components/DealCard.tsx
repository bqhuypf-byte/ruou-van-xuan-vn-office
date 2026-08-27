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
}

export const DealCard = ({ deal }: DealCardProps) => {
  const { t } = useTranslation();
  const { product, price, originalPrice, discountPercent, savings, badgeText } = deal;
  const rating = product.rating ?? 0;
  const reviewCount = product.reviewCount ?? 0;

  return (
    <Link
      to={ROUTES.PRODUCT_DETAIL.replace(':slug', product.slug)}
      className="group relative block shrink-0 w-[227px] rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-brand-600 transition-all"
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
            className="w-full h-full flex items-center justify-center text-white/85"
            style={{ backgroundColor: getPlaceholderTint(product.id) }}
          >
            <BottleIcon className="w-10 h-10" />
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-b-2xl p-4 space-y-1.5">
        <p className="font-semibold text-slate-900 dark:text-white text-[16px] line-clamp-2 min-h-[2.5em]">
          {product.name}
        </p>
        {reviewCount > 0 && (
          <div className="flex items-center gap-1.5">
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
        <div className="flex items-baseline gap-2">
          <span className="font-bold text-slate-900 dark:text-white text-[16px]">
            {formatPrice(price)}
          </span>
          {originalPrice !== null && (
            <span className="text-slate-400 line-through text-sm">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>
        {savings !== null && savings > 0 && (
          <p className="text-[#249b3e] font-semibold text-sm">
            {t('productCard.savings', { amount: formatPrice(savings) })}
          </p>
        )}
        <span className="mt-2 block text-center rounded-full border border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400 text-xs font-semibold py-1.5 group-hover:bg-brand-600 group-hover:text-white transition-colors">
          {t('productCard.viewProduct')}
        </span>
      </div>
    </Link>
  );
};
