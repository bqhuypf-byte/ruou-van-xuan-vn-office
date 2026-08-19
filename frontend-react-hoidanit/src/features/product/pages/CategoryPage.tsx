import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { AlertCircle, ChevronLeft, ChevronRight, PackageSearch } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { ROUTES } from '@/routes/routes';
import { ProductCard } from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { useCategoryDetail } from '../hooks/useCategoryDetail';

export const CategoryPage = () => {
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (isCategoryError || !category) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 p-4 rounded-xl border border-rose-200 dark:border-rose-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>
              Không tìm thấy danh mục (
              {categoryError instanceof Error ? categoryError.message : 'Lỗi kết nối'}).
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetchCategory()}>
            Thử Lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <nav className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
          <Link to={ROUTES.HOME} className="hover:text-indigo-600 dark:hover:text-indigo-400">
            Trang chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 dark:text-white font-medium">{category.name}</span>
        </nav>

        {category.thumbnailUrl ? (
          <div className="relative rounded-2xl overflow-hidden h-48 sm:h-64">
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
                <Button variant="outline" size="sm">
                  {child.name}
                </Button>
              </Link>
            ))}
          </div>
        )}

        {isError && (
          <div className="bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 p-4 rounded-xl border border-rose-200 dark:border-rose-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>
                Không thể tải sản phẩm ({error instanceof Error ? error.message : 'Lỗi kết nối'}).
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Thử Lại
            </Button>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-16 text-center shadow-sm">
            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <PackageSearch className="w-8 h-8" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Chưa có sản phẩm nào trong danh mục này
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Trang {meta.page} / {meta.totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                leftIcon={<ChevronLeft className="w-4 h-4" />}
              >
                Trước
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
