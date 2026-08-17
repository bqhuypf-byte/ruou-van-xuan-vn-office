import { useState } from 'react';
import { AlertCircle, ChevronLeft, ChevronRight, PackageSearch } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { ProductCard } from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';

export const HomePage = () => {
  const [page, setPage] = useState(1);
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);

  const { products, isLoading, isError, error, refetch, meta } = useProducts({
    page,
    limit: 12,
    categoryId,
  });
  const { tree: categoryTree, allCategories } = useCategories();

  const categoryName = (id: number) => allCategories.find((c) => c.id === id)?.name;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <section className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Chào mừng đến với Rượu Văn Xuân
          </h1>
          <p className="mt-3 text-indigo-100 max-w-xl mx-auto">
            Khám phá các sản phẩm chất lượng với giá tốt nhất.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant={categoryId === undefined ? 'primary' : 'outline'}
            size="sm"
            onClick={() => {
              setCategoryId(undefined);
              setPage(1);
            }}
          >
            Tất cả
          </Button>
          {categoryTree.map((category) => (
            <Button
              key={category.id}
              variant={categoryId === category.id ? 'primary' : 'outline'}
              size="sm"
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
              Chưa có sản phẩm nào
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                categoryName={categoryName(product.categoryId)}
              />
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
