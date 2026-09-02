import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ChevronRight } from 'lucide-react';
import { ROUTES } from '@/routes/routes';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from './ProductCard';
import { ProductCarousel } from './ProductCarousel';
import type { CategoryHomeDisplayStyle } from '../types/category.types';

export interface CategoryProductSectionProps {
  categoryId: number;
  categoryName: string;
  categorySlug: string;
  limit?: number;
  displayStyle?: CategoryHomeDisplayStyle;
}

export const CategoryProductSection = ({
  categoryId,
  categoryName,
  categorySlug,
  limit = 8,
  displayStyle = 'grid',
}: CategoryProductSectionProps) => {
  const { t } = useTranslation();
  const { products, isLoading } = useProducts({ categoryId, limit, isActive: true, page: 1 });

  if (!isLoading && products.length === 0) return null;

  const categoryLink = ROUTES.CATEGORY.replace(':slug', categorySlug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-700 dark:text-slate-200">
          {categoryName}
        </h2>
        <Link
          to={categoryLink}
          className="hidden lg:inline-flex items-center gap-1 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:underline shrink-0"
        >
          {t('common.viewAll')}
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:hidden">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <Link
            to={categoryLink}
            className="mx-auto flex min-h-11 w-fit items-center gap-1 rounded-full border border-brand-600 px-5 py-2 text-sm font-semibold text-brand-600 transition-colors hover:bg-brand-600 hover:text-white lg:hidden"
          >
            {t('common.viewAll')}
            <ChevronRight className="w-4 h-4" />
          </Link>

          <div className="hidden lg:block">
            {displayStyle === 'carousel' ? (
              <ProductCarousel>
                {products.map((product) => (
                  <div key={product.id} className="snap-start shrink-0 w-[227px]">
                    <ProductCard product={product} />
                  </div>
                ))}
              </ProductCarousel>
            ) : (
              <div className="grid grid-cols-3 lg:grid-cols-4 gap-5">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
