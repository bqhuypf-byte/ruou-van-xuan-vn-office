import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { PackageSearch, Search, X } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { ProductGrid } from '../components/ProductGrid';
import { ErrorBanner } from '../components/ErrorBanner';
import { EmptyState } from '../components/EmptyState';
import { PaginationBar } from '../components/PaginationBar';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';

export const ProductListPage = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') ?? '';
  const [page, setPage] = useState(1);
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);

  const filterKey = `${search}-${categoryId}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setPage(1);
  }

  const { products, isLoading, isError, error, refetch, meta } = useProducts({
    page,
    limit: 12,
    categoryId,
    search: search || undefined,
    isActive: true,
  });
  const { tree: categoryTree } = useCategories();

  const clearSearch = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('search');
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase text-slate-900 dark:text-white">
            {search ? (
              <>
                {t('productList.searchResultsTitle')}{' '}
                <span className="text-brand-600 dark:text-brand-400">"{search}"</span>
              </>
            ) : (
              <>
                {t('home.allProductsPrefix')}{' '}
                <span className="text-brand-600 dark:text-brand-400">{t('home.allProductsHighlight')}</span>
              </>
            )}
          </h1>
          {search && (
            <button
              onClick={clearSearch}
              className="mt-2 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
            >
              <X className="w-3.5 h-3.5" />
              {t('productList.clearSearch')}
            </button>
          )}
        </div>

        <div className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 py-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0">
          <Button
            variant={categoryId === undefined ? 'primary' : 'outline'}
            size="sm"
            className="rounded-full"
            onClick={() => {
              setCategoryId(undefined);
              setPage(1);
            }}
          >
            {t('common.all')}
          </Button>
          {categoryTree.map((category) => (
            <Button
              key={category.id}
              variant={categoryId === category.id ? 'primary' : 'outline'}
              size="sm"
              className="rounded-full"
              onClick={() => {
                setCategoryId(category.id);
                setPage(1);
              }}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {isError && (
          <ErrorBanner
            message={t('productList.loadError', {
              reason: error instanceof Error ? error.message : t('common.connectionError'),
            })}
            onRetry={() => refetch()}
          />
        )}

        {!isLoading && products.length === 0 ? (
          <EmptyState
            icon={search ? <Search className="w-8 h-8" /> : <PackageSearch className="w-8 h-8" />}
            title={search ? t('productList.noResultsFor', { term: search }) : t('home.noProducts')}
            subtitle={search ? t('productList.tryDifferentTerm') : undefined}
          />
        ) : (
          <ProductGrid products={products} isLoading={isLoading} />
        )}

        {meta && meta.totalPages > 1 && (
          <PaginationBar
            page={page}
            totalPages={meta.totalPages}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => p + 1)}
            label={t('productList.resultCount', {
              page: meta.page,
              totalPages: meta.totalPages,
              total: meta.total,
            })}
          />
        )}
      </div>
    </div>
  );
};
