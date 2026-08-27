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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-5">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-700 dark:text-slate-200">
          {title}
        </h2>
        <Link
          to={ROUTES.PRODUCTS}
          className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:underline shrink-0"
        >
          {t('common.viewAll')}
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      {layout === 'carousel' ? (
        <ProductCarousel>
          {deals.map((deal) => (
            <div key={deal.product.id} className="snap-start shrink-0">
              <DealCard deal={deal} />
            </div>
          ))}
        </ProductCarousel>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {deals.map((deal) => (
            <DealCard key={deal.product.id} deal={deal} />
          ))}
        </div>
      )}
    </div>
  );
};
