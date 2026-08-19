import { useState } from 'react';
import { AlertCircle, GalleryHorizontal, Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { BannerTable } from '../components/BannerTable';
import { BannerFormModal } from '../components/BannerFormModal';
import type { BannerFormSubmitData } from '../components/BannerFormModal';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { useAdminBanners } from '../hooks/useBanners';
import { useCreateBanner, useDeleteBanner, useUpdateBanner } from '../hooks/useBannerMutations';
import type { Banner } from '../types/home.types';

export const BannersPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );

  const { data, isLoading, isError, error, refetch } = useAdminBanners();
  const banners = data ?? [];

  const createMutation = useCreateBanner();
  const updateMutation = useUpdateBanner();
  const deleteMutation = useDeleteBanner();

  const handleOpenCreate = () => {
    setSelectedBanner(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (banner: Banner) => {
    setSelectedBanner(banner);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (banner: Banner) => {
    setSelectedBanner(banner);
    setIsDeleteOpen(true);
  };

  const handleSaveForm = async (data: BannerFormSubmitData) => {
    setFeedback(null);
    try {
      if (selectedBanner) {
        await updateMutation.mutateAsync({ id: selectedBanner.id, input: data });
        setFeedback({ type: 'success', message: `Đã cập nhật banner "${data.title}".` });
      } else {
        await createMutation.mutateAsync(data);
        setFeedback({ type: 'success', message: `Đã tạo banner "${data.title}".` });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: getApiErrorMessage(err, 'Có lỗi xảy ra khi lưu banner.') });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBanner) return;
    setFeedback(null);
    try {
      await deleteMutation.mutateAsync(selectedBanner.id);
      setFeedback({ type: 'success', message: `Đã xóa banner "${selectedBanner.title}".` });
      setIsDeleteOpen(false);
    } catch (err) {
      setFeedback({ type: 'error', message: getApiErrorMessage(err, 'Có lỗi xảy ra khi xóa banner.') });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <GalleryHorizontal className="w-6 h-6 text-indigo-600" />
            Banner Trang Chủ
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Quản lý dải banner luân phiên hiển thị ở đầu trang chủ.
          </p>
        </div>
        <Button onClick={handleOpenCreate} leftIcon={<Plus className="w-4 h-4" />}>
          Thêm Banner
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
              Không thể tải banner ({error instanceof Error ? error.message : 'Lỗi kết nối'}).
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Thử Lại
          </Button>
        </div>
      )}

      <BannerTable
        banners={banners}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      <BannerFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSaveForm}
        bannerToEdit={selectedBanner}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={selectedBanner?.title ?? ''}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
