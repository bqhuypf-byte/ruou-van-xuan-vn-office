import { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Package,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Trash2,
  XOctagon,
} from 'lucide-react';
import { Button, Input } from '@/shared/components/ui';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { ProductTable } from '../components/ProductTable';
import { ProductFormModal } from '../components/ProductFormModal';
import type { ProductFormSubmitData } from '../components/ProductFormModal';
import { ProductDeleteModal } from '../components/ProductDeleteModal';
import { ProductHardDeleteModal } from '../components/ProductHardDeleteModal';
import { ProductBulkDeleteModal } from '../components/ProductBulkDeleteModal';
import { ProductBulkHardDeleteModal } from '../components/ProductBulkHardDeleteModal';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import {
  useCreateProduct,
  useDeleteProduct,
  useHardDeleteProduct,
  useUpdateProduct,
} from '../hooks/useProductMutations';
import type { Product } from '../types/product.types';

export const ProductsPage = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'' | 'active' | 'inactive'>('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isHardDeleteOpen, setIsHardDeleteOpen] = useState(false);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [isBulkHardDeleteOpen, setIsBulkHardDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const { products, isLoading, isError, error, refetch, meta } = useProducts({
    search,
    page,
    categoryId: categoryFilter ? Number(categoryFilter) : undefined,
    isActive: statusFilter === '' ? undefined : statusFilter === 'active',
  });
  const { allCategories } = useCategories();

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();
  const hardDeleteMutation = useHardDeleteProduct();

  useEffect(() => {
    setSelectedIds(new Set());
  }, [search, page, categoryFilter, statusFilter]);

  const handleToggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleToggleSelectAll = () => {
    setSelectedIds((prev) => {
      const allSelected = products.length > 0 && products.every((p) => prev.has(p.id));
      if (allSelected) return new Set();
      return new Set(products.map((p) => p.id));
    });
  };

  const handleOpenCreate = () => {
    setIsFormOpen(true);
  };

  const handleOpenDelete = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteOpen(true);
  };

  const handleOpenHardDelete = (product: Product) => {
    setSelectedProduct(product);
    setIsHardDeleteOpen(true);
  };

  const handleSaveForm = async (data: ProductFormSubmitData) => {
    setFeedback(null);
    try {
      await createMutation.mutateAsync(data);
      setFeedback({
        type: 'success',
        message: `Đã tạo sản phẩm "${data.name}" thành công.`,
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: getApiErrorMessage(err, 'Có lỗi xảy ra khi lưu sản phẩm.'),
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;
    setFeedback(null);
    try {
      await deleteMutation.mutateAsync(selectedProduct.id);
      setFeedback({
        type: 'success',
        message: `Đã ngừng bán sản phẩm "${selectedProduct.name}" thành công.`,
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: getApiErrorMessage(err, 'Có lỗi xảy ra khi ngừng bán sản phẩm.'),
      });
    }
  };

  const handleHardDeleteConfirm = async () => {
    if (!selectedProduct) return;
    setFeedback(null);
    try {
      await hardDeleteMutation.mutateAsync(selectedProduct.id);
      setFeedback({
        type: 'success',
        message: `Đã xóa vĩnh viễn sản phẩm "${selectedProduct.name}".`,
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: getApiErrorMessage(err, 'Có lỗi xảy ra khi xóa vĩnh viễn sản phẩm.'),
      });
    }
  };

  const handleChangeCategory = async (product: Product, newCategoryId: number) => {
    setFeedback(null);
    try {
      await updateMutation.mutateAsync({ id: product.id, input: { categoryId: newCategoryId } });
      setFeedback({
        type: 'success',
        message: `Đã chuyển "${product.name}" sang danh mục khác.`,
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: getApiErrorMessage(err, 'Có lỗi xảy ra khi đổi danh mục.'),
      });
    }
  };

  const handleBulkDeleteConfirm = async () => {
    const ids = Array.from(selectedIds);
    setFeedback(null);
    const results = await Promise.allSettled(ids.map((id) => deleteMutation.mutateAsync(id)));
    const failedCount = results.filter((r) => r.status === 'rejected').length;
    const succeededCount = ids.length - failedCount;

    if (failedCount === 0) {
      setFeedback({
        type: 'success',
        message: `Đã ngừng bán ${succeededCount} sản phẩm thành công.`,
      });
    } else {
      setFeedback({
        type: 'error',
        message: `Đã ngừng bán ${succeededCount} sản phẩm, ${failedCount} sản phẩm thất bại.`,
      });
    }
    setSelectedIds(new Set());
  };

  const handleBulkHardDeleteConfirm = async () => {
    const ids = products.filter((p) => selectedIds.has(p.id) && !p.isActive).map((p) => p.id);
    setFeedback(null);
    const results = await Promise.allSettled(ids.map((id) => hardDeleteMutation.mutateAsync(id)));
    const failedCount = results.filter((r) => r.status === 'rejected').length;
    const succeededCount = ids.length - failedCount;

    if (failedCount === 0) {
      setFeedback({
        type: 'success',
        message: `Đã xóa vĩnh viễn ${succeededCount} sản phẩm thành công.`,
      });
    } else {
      setFeedback({
        type: 'error',
        message: `Đã xóa vĩnh viễn ${succeededCount} sản phẩm, ${failedCount} sản phẩm thất bại.`,
      });
    }
    setSelectedIds(new Set());
  };

  const totalCount = meta?.total ?? 0;
  const activeCount = products.filter((p) => p.isActive).length;
  const inactiveCount = products.filter((p) => !p.isActive).length;
  const selectedInactiveCount = products.filter(
    (p) => selectedIds.has(p.id) && !p.isActive,
  ).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Quản Lý Sản Phẩm (Product CRUD)
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Quản lý danh sách sản phẩm trong hệ thống e-commerce.
          </p>
        </div>
        <Button onClick={handleOpenCreate} leftIcon={<Plus className="w-4 h-4" />} size="md">
          Thêm Sản Phẩm
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Tổng Sản Phẩm</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{totalCount}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Đang Bán (Trang Này)</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{activeCount}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Ngừng Bán (Trang Này)</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{inactiveCount}</p>
          </div>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center justify-between transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-xs font-medium hover:underline ml-4">
            Đóng
          </button>
        </div>
      )}

      {isError && (
        <div className="bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 p-4 rounded-xl border border-rose-200 dark:border-rose-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>
              Không thể tải danh sách sản phẩm ({error instanceof Error ? error.message : 'Lỗi kết nối'}).
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Thử Lại
          </Button>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Tìm theo tên hoặc slug..."
            leftIcon={<Search className="w-4 h-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:border-brand-500 focus:ring-brand-500/20"
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="">Tất cả danh mục</option>
          {allCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          className="rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:border-brand-500 focus:ring-brand-500/20"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as '' | 'active' | 'inactive');
            setPage(1);
          }}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="active">Đang bán</option>
          <option value="inactive">Ngừng bán</option>
        </select>
      </div>

      {selectedIds.size > 0 && (
        <div className="bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 rounded-xl p-3 flex items-center justify-between">
          <p className="text-sm font-medium text-brand-800 dark:text-brand-300">
            Đã chọn {selectedIds.size} sản phẩm
            {selectedInactiveCount > 0 && ` (${selectedInactiveCount} đã ngừng bán)`}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setSelectedIds(new Set())}>
              Bỏ Chọn
            </Button>
            {selectedInactiveCount > 0 && (
              <Button
                variant="danger"
                size="sm"
                leftIcon={<XOctagon className="w-4 h-4" />}
                onClick={() => setIsBulkHardDeleteOpen(true)}
              >
                Xóa Vĩnh Viễn ({selectedInactiveCount})
              </Button>
            )}
            <Button
              variant="danger"
              size="sm"
              leftIcon={<Trash2 className="w-4 h-4" />}
              onClick={() => setIsBulkDeleteOpen(true)}
            >
              Xóa Đã Chọn
            </Button>
          </div>
        </div>
      )}

      <ProductTable
        products={products}
        categories={allCategories}
        isLoading={isLoading}
        onDelete={handleOpenDelete}
        onHardDelete={handleOpenHardDelete}
        onChangeCategory={handleChangeCategory}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
        onToggleSelectAll={handleToggleSelectAll}
        startIndex={((meta?.page ?? page) - 1) * (meta?.limit ?? 10)}
      />

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Trang {meta.page} / {meta.totalPages} ({meta.total} sản phẩm)
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

      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSaveForm}
        categoryOptions={allCategories}
        isLoading={createMutation.isPending}
      />

      <ProductDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        productToDelete={selectedProduct}
        isLoading={deleteMutation.isPending}
      />

      <ProductHardDeleteModal
        isOpen={isHardDeleteOpen}
        onClose={() => setIsHardDeleteOpen(false)}
        onConfirm={handleHardDeleteConfirm}
        productToDelete={selectedProduct}
        isLoading={hardDeleteMutation.isPending}
      />

      <ProductBulkDeleteModal
        isOpen={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        onConfirm={handleBulkDeleteConfirm}
        selectedCount={selectedIds.size}
        isLoading={deleteMutation.isPending}
      />

      <ProductBulkHardDeleteModal
        isOpen={isBulkHardDeleteOpen}
        onClose={() => setIsBulkHardDeleteOpen(false)}
        onConfirm={handleBulkHardDeleteConfirm}
        selectedCount={selectedInactiveCount}
        isLoading={hardDeleteMutation.isPending}
      />
    </div>
  );
};
