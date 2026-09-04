import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Heart, Star } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { BottleIcon } from '@/shared/components/icons';
import { useAddCartItem } from '@/features/cart';
import type { Product } from '../types/product.types';
import { ROUTES } from '@/routes/routes';
import { getPlaceholderTint } from '@/shared/utils/placeholderTint';
import { formatPrice } from '@/shared/utils/formatPrice';
import { stripHtml } from '@/shared/utils/stripHtml';

export interface ProductCardProps {
  product: Product;
  categoryName?: string;
  categorySlug?: string;
}

export const ProductCard = ({ product, categoryName, categorySlug }: ProductCardProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isWished, setIsWished] = useState(false);
  const addCartItem = useAddCartItem();

  const handleCategoryClick = (e: React.MouseEvent) => {
    if (!categorySlug) return;
    e.preventDefault();
    e.stopPropagation();
    navigate(ROUTES.CATEGORY.replace(':slug', categorySlug));
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWished((prev) => !prev);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.defaultVariantId) return;
    addCartItem.mutate({ productVariantId: product.defaultVariantId, quantity: 1 });
  };

  const rating = product.rating ?? 0;
  const reviewCount = product.reviewCount ?? 0;

  return (
    <Link
      to={ROUTES.PRODUCT_DETAIL.replace(':slug', product.slug)}
      className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all"
    >
      <div className="relative aspect-square bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <button
          onClick={handleWishlistClick}
          aria-label={t('productCard.wishlist')}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 hidden w-8 h-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition-colors hover:bg-white sm:flex dark:bg-slate-900/90 dark:hover:bg-slate-900"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWished ? 'fill-brand-600 text-brand-600' : 'text-slate-500'
            }`}
          />
        </button>
        {categoryName && (
          <button
            onClick={handleCategoryClick}
            className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 text-[11px] font-medium text-slate-700 dark:text-slate-200 shadow-sm hover:bg-white dark:hover:bg-slate-900 transition-colors"
          >
            {categoryName}
          </button>
        )}
        {product.thumbnailUrl ? (
          <img
            src={product.thumbnailUrl}
            alt={product.name}
            className="w-full h-full object-contain p-3 sm:p-6 group-hover:scale-105 transition-transform duration-300"
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

      <div className="flex flex-col flex-1 gap-1.5 p-2.5 sm:p-4">
        <div className="flex flex-col items-start gap-0.5 sm:flex-row sm:justify-between sm:gap-2">
          <h3 className="w-full text-center text-sm font-semibold text-gold-900 line-clamp-2 transition-colors group-hover:text-gold-700 sm:text-left sm:text-base dark:text-gold-100 dark:group-hover:text-gold-300">
            {product.name}
          </h3>
          {product.priceFrom != null && (
            <span className="w-full shrink-0 text-center text-sm font-bold text-gold-800 sm:w-auto sm:text-right sm:text-base dark:text-gold-200">
              {formatPrice(product.priceFrom)}
            </span>
          )}
        </div>

        {product.description && (
          <p className="hidden text-sm text-slate-500 line-clamp-1 sm:block dark:text-slate-400">
            {stripHtml(product.description)}
          </p>
        )}

        {reviewCount > 0 && (
          <div className="hidden items-center gap-1.5 sm:flex">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.round(rating)
                      ? 'fill-gold-400 text-gold-400'
                      : 'fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">({reviewCount})</span>
          </div>
        )}

        <div className="mt-auto hidden pt-2 sm:block">
          <Button
            variant="outline"
            size="sm"
            className="w-full rounded-full"
            isLoading={addCartItem.isPending}
            disabled={!product.defaultVariantId}
            onClick={handleAddToCart}
          >
            {t('product.addToCart')}
          </Button>
        </div>
      </div>
    </Link>
  );
};
