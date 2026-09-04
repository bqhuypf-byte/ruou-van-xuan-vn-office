import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ChevronRight } from 'lucide-react';
import { ROUTES } from '@/routes/routes';
import type { FeaturedDeal } from '../hooks/useFeaturedDeals';
import { DealCard } from './DealCard';
import { ProductCarousel } from './ProductCarousel';

export interface DealsSectionProps {
  title: string;
  deals: FeaturedDeal[];
  layout?: 'grid' | 'carousel';
}

export const DealsSection = ({ title, deals, layout = 'grid' }: DealsSectionProps) => {
  const { t } = useTranslation();

  if (deals.length === 0) return null;

  const previewDeals = deals.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-5">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <h2 className="text-xl sm:text-2xl font-extrabold text-gold-800 dark:text-gold-200">
          {title}
        </h2>
        <Link
          to={ROUTES.PRODUCTS}
          className="hidden lg:inline-flex items-center gap-1 text-sm font-semibold text-gold-700 dark:text-gold-300 hover:underline shrink-0"
        >
          {t('common.viewAll')}
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      {/* Mobile uses a contained two-column preview. Horizontal carousels caused cards to
          look clipped beside each other and hid the section's completion point. */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5 lg:hidden">
        {previewDeals.map((deal) => (
          <DealCard key={deal.product.id} deal={deal} className="w-full" />
        ))}
      </div>

      <Link
        to={ROUTES.PRODUCTS}
        className="mx-auto flex min-h-11 w-fit items-center gap-1 rounded-full border border-gold-600 px-5 py-2 text-sm font-semibold text-gold-700 transition-colors hover:bg-gold-500 hover:text-brand-950 lg:hidden"
      >
        {t('common.viewAll')}
        <ChevronRight className="w-4 h-4" />
      </Link>

      <div className="hidden lg:block">
        {layout === 'carousel' ? (
          <ProductCarousel>
            {previewDeals.map((deal) => (
              <div
                key={deal.product.id}
                className="snap-start shrink-0"
                style={{ width: 'calc(25% - 15px)' }}
              >
                <DealCard deal={deal} className="w-full" />
              </div>
            ))}
          </ProductCarousel>
        ) : (
          <div className="grid grid-cols-4 gap-5">
            {previewDeals.map((deal) => (
              <DealCard key={deal.product.id} deal={deal} className="w-full" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
