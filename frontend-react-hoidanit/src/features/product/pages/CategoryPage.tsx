import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ChevronRight, PackageSearch, SlidersHorizontal, X, RotateCcw } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { ROUTES } from '@/routes/routes';
import { ProductGrid } from '../components/ProductGrid';
import { ErrorBanner } from '../components/ErrorBanner';
import { EmptyState } from '../components/EmptyState';
import { PaginationBar } from '../components/PaginationBar';
import { CategoryFilterSidebar } from '../components/CategoryFilterSidebar';
import { useProducts } from '../hooks/useProducts';
import { useCategoryDetail } from '../hooks/useCategoryDetail';
import { formatPrice } from '@/shared/utils/formatPrice';

export const CategoryPage = () => {
  const { t } = useTranslation();
  const { slug = '' } = useParams<{ slug: string }>();

  const [page, setPage] = useState(1);
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Reset page and filters when slug changes
  useEffect(() => {
    setPage(1);
    setMinPrice(undefined);
    setMaxPrice(undefined);
  }, [slug]);

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
    minPrice,
    maxPrice,
    isActive: true,
  });

  const handlePriceChange = (min?: number, max?: number) => {
    setMinPrice(min);
    setMaxPrice(max);
    setPage(1);
  };

  const handleResetFilters = () => {
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setPage(1);
  };

  const hasActiveFilters = minPrice !== undefined || maxPrice !== undefined;

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
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          <Link to={ROUTES.HOME} className="hover:text-brand-700 dark:hover:text-brand-400 transition-colors">
            {t('category.home')}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 dark:text-white font-semibold">{category.name}</span>
        </nav>

        {/* Category Hero / Banner */}
        {category.thumbnailUrl ? (
          <div className="relative rounded-3xl overflow-hidden h-44 sm:h-60 shadow-md">
            <img
              src={category.thumbnailUrl}
              alt={category.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <h1 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-white font-heading">
                {category.name}
              </h1>
              {category.description && (
                <p className="mt-2 max-w-2xl text-xs sm:text-sm text-slate-200 line-clamp-2">
                  {category.description}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
            <h1 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-slate-900 dark:text-white font-heading">
              {category.name}
            </h1>
            {category.description && (
              <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-400">
                {category.description}
              </p>
            )}
          </div>
        )}

        {/* Subcategory Chips */}
        {category.children.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1">
              Phân loại:
            </span>
            {category.children.map((child) => (
              <Link key={child.id} to={ROUTES.CATEGORY.replace(':slug', child.slug)}>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-brand-600 hover:text-brand-700 font-medium text-xs shadow-2xs"
                >
                  {child.name}
                </Button>
              </Link>
            ))}
          </div>
        )}

        {/* Main Content Layout: 2 Columns on Desktop */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-64 xl:w-72 shrink-0 sticky top-24 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <CategoryFilterSidebar
              currentCategory={category}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onPriceChange={handlePriceChange}
              onReset={handleResetFilters}
            />
          </aside>

          {/* Right Column: Products & Controls */}
          <main className="flex-1 min-w-0 w-full space-y-6">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              <div className="flex items-center gap-2">
                {/* Mobile Filter Button */}
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-400 font-semibold text-xs border border-brand-200 dark:border-brand-900"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Bộ lọc</span>
                  {hasActiveFilters && (
                    <span className="w-2 h-2 rounded-full bg-brand-600"></span>
                  )}
                </button>

                {/* Product Count */}
                <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  {isLoading ? (
                    'Đang tải sản phẩm...'
                  ) : meta ? (
                    <span>
                      Tổng cộng <strong className="text-slate-900 dark:text-white font-semibold">{meta.total}</strong> sản phẩm
                    </span>
                  ) : (
                    `${products.length} sản phẩm`
                  )}
                </span>
              </div>

              {/* Active Filter Tags */}
              {hasActiveFilters && (
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-400 text-xs font-medium border border-brand-200 dark:border-brand-900">
                    <span>
                      {minPrice && maxPrice
                        ? `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`
                        : minPrice
                        ? `Từ ${formatPrice(minPrice)}`
                        : `Đến ${formatPrice(maxPrice!)}`}
                    </span>
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      aria-label="Xóa bộ lọc giá"
                      className="hover:text-rose-600 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Error Banner */}
            {isError && (
              <ErrorBanner
                message={t('category.loadProductsError', {
                  reason: error instanceof Error ? error.message : t('common.connectionError'),
                })}
                onRetry={() => refetch()}
              />
            )}

            {/* Product Grid or Empty State */}
            {!isLoading && products.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center space-y-4">
                <EmptyState
                  icon={<PackageSearch className="w-10 h-10 text-slate-400" />}
                  title={hasActiveFilters ? 'Không tìm thấy sản phẩm phù hợp' : t('category.noProducts')}
                />
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-2 rounded-xl text-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Xóa tất cả bộ lọc
                  </Button>
                )}
              </div>
            ) : (
              <ProductGrid products={products} isLoading={isLoading} />
            )}

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
              <div className="pt-4">
                <PaginationBar
                  page={page}
                  totalPages={meta.totalPages}
                  onPrev={() => {
                    setPage((p) => Math.max(1, p - 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onNext={() => {
                    setPage((p) => p + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  label={t('common.page', { page: meta.page, totalPages: meta.totalPages })}
                />
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Slide-over Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          {/* Drawer content */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-white dark:bg-slate-900 shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-slate-900 dark:text-white">Bộ lọc tìm kiếm</span>
                  <button
                    type="button"
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    aria-label="Đóng"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <CategoryFilterSidebar
                  currentCategory={category}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  onPriceChange={handlePriceChange}
                  onReset={handleResetFilters}
                  onCloseMobile={() => setIsMobileFilterOpen(false)}
                />
              </div>

              <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-800">
                <Button
                  variant="primary"
                  className="w-full rounded-xl"
                  onClick={() => setIsMobileFilterOpen(false)}
                >
                  Xem kết quả
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
