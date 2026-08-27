import { useState } from 'react';
import { AlertCircle, Plus, Tags } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { BrandTable } from '../components/BrandTable';
import { BrandFormModal } from '../components/BrandFormModal';
import type { BrandFormSubmitData } from '../components/BrandFormModal';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { useAdminBrands } from '../hooks/useBrands';
import { useCreateBrand, useDeleteBrand, useUpdateBrand } from '../hooks/useBrandMutations';
import type { Brand } from '../types/home.types';

export const BrandsPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );

  const { data, isLoading, isError, error, refetch } = useAdminBrands();
  const brands = data ?? [];

  const createMutation = useCreateBrand();
  const updateMutation = useUpdateBrand();
  const deleteMutation = useDeleteBrand();

  const handleOpenCreate = () => {
    setSelectedBrand(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (brand: Brand) => {
    setSelectedBrand(brand);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (brand: Brand) => {
    setSelectedBrand(brand);
    setIsDeleteOpen(true);
  };

  const handleSaveForm = async (data: BrandFormSubmitData) => {
    setFeedback(null);
    try {
      if (selectedBrand) {
        await updateMutation.mutateAsync({ id: selectedBrand.id, input: data });
        setFeedback({ type: 'success', message: `Đã cập nhật thương hiệu "${data.name}".` });
      } else {
        await createMutation.mutateAsync(data);
        setFeedback({ type: 'success', message: `Đã tạo thương hiệu "${data.name}".` });
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: getApiErrorMessage(err, 'Có lỗi xảy ra khi lưu thương hiệu.'),
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBrand) return;
    setFeedback(null);
    try {
      await deleteMutation.mutateAsync(selectedBrand.id);
      setFeedback({ type: 'success', message: `Đã xóa thương hiệu "${selectedBrand.name}".` });
      setIsDeleteOpen(false);
    } catch (err) {
      setFeedback({
        type: 'error',
        message: getApiErrorMessage(err, 'Có lỗi xảy ra khi xóa thương hiệu.'),
      });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Tags className="w-6 h-6 text-brand-600" />
            Thương Hiệu Nổi Bật
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Quản lý các thẻ quảng cáo thương hiệu hiển thị ở trang chủ.
          </p>
        </div>
        <Button onClick={handleOpenCreate} leftIcon={<Plus className="w-4 h-4" />}>
          Thêm Thương Hiệu
        </Button>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center justify-between ${
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
              Không thể tải thương hiệu ({error instanceof Error ? error.message : 'Lỗi kết nối'}).
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Thử Lại
          </Button>
        </div>
      )}

      <BrandTable
        brands={brands}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      <BrandFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSaveForm}
        brandToEdit={selectedBrand}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={selectedBrand?.name ?? ''}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
