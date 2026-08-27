import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ChevronRight, PackageSearch } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { ROUTES } from '@/routes/routes';
import { ProductGrid } from '../components/ProductGrid';
import { ErrorBanner } from '../components/ErrorBanner';
import { EmptyState } from '../components/EmptyState';
import { PaginationBar } from '../components/PaginationBar';
import { useProducts } from '../hooks/useProducts';
import { useCategoryDetail } from '../hooks/useCategoryDetail';

export const CategoryPage = () => {
  const { t } = useTranslation();
  const { slug = '' } = useParams<{ slug: string }>();
  const [page, setPage] = useState(1);

  const {
    data: category,
    isLoading: isCategoryLoading,
    isError: isCategoryError,
    error: categoryError,
    refetch: refetchCategory,
  } = useCategoryDetail(slug);

  const { products, isLoading, isError, error, refetch, meta } = useProducts({
    page,
    limit: 12,
    categoryId: category?.id,
    isActive: true,
  });

  if (isCategoryLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <ProductGrid products={[]} isLoading />
      </div>
    );
  }

  if (isCategoryError || !category) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <ErrorBanner
          message={t('category.notFound', {
            reason: categoryError instanceof Error ? categoryError.message : t('common.connectionError'),
          })}
          onRetry={() => refetchCategory()}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <nav className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
          <Link to={ROUTES.HOME} className="hover:text-brand-600 dark:hover:text-brand-400">
            {t('category.home')}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 dark:text-white font-medium">{category.name}</span>
        </nav>

        {category.thumbnailUrl ? (
          <div className="relative rounded-3xl overflow-hidden h-48 sm:h-64">
            <img
              src={category.thumbnailUrl}
              alt={category.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <h1 className="text-2xl sm:text-3xl font-extrabold uppercase text-white">
                {category.name}
              </h1>
              {category.description && (
                <p className="mt-1.5 max-w-2xl text-sm text-white/80">{category.description}</p>
              )}
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold uppercase text-slate-900 dark:text-white">
              {category.name}
            </h1>
            {category.description && (
              <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                {category.description}
              </p>
            )}
          </div>
        )}

        {category.children.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {category.children.map((child) => (
              <Link key={child.id} to={ROUTES.CATEGORY.replace(':slug', child.slug)}>
                <Button variant="outline" size="sm" className="rounded-full">
                  {child.name}
                </Button>
              </Link>
            ))}
          </div>
        )}

        {isError && (
          <ErrorBanner
            message={t('category.loadProductsError', {
              reason: error instanceof Error ? error.message : t('common.connectionError'),
            })}
            onRetry={() => refetch()}
          />
        )}

        {!isLoading && products.length === 0 ? (
          <EmptyState icon={<PackageSearch className="w-8 h-8" />} title={t('category.noProducts')} />
        ) : (
          <ProductGrid products={products} isLoading={isLoading} />
        )}

        {meta && meta.totalPages > 1 && (
          <PaginationBar
            page={page}
            totalPages={meta.totalPages}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => p + 1)}
            label={t('common.page', { page: meta.page, totalPages: meta.totalPages })}
          />
        )}
      </div>
    </div>
  );
};
