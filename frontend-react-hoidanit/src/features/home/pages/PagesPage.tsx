import { useState } from 'react';
import { AlertCircle, FileText, Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { PageTable } from '../components/PageTable';
import { PageFormModal } from '../components/PageFormModal';
import type { PageFormSubmitData } from '../components/PageFormModal';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { useAdminPages } from '../hooks/usePages';
import { useCreatePage, useDeletePage, useUpdatePage } from '../hooks/usePageMutations';
import type { Page } from '../types/home.types';

export const PagesPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );

  const { data, isLoading, isError, error, refetch } = useAdminPages();
  const pages = data ?? [];

  const createMutation = useCreatePage();
  const updateMutation = useUpdatePage();
  const deleteMutation = useDeletePage();

  const handleOpenCreate = () => {
    setSelectedPage(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (page: Page) => {
    setSelectedPage(page);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (page: Page) => {
    setSelectedPage(page);
    setIsDeleteOpen(true);
  };

  const handleSaveForm = async (data: PageFormSubmitData) => {
    setFeedback(null);
    try {
      if (selectedPage) {
        await updateMutation.mutateAsync({ id: selectedPage.id, input: data });
        setFeedback({ type: 'success', message: `Đã cập nhật trang "${data.title}".` });
      } else {
        await createMutation.mutateAsync(data);
        setFeedback({ type: 'success', message: `Đã tạo trang "${data.title}".` });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: getApiErrorMessage(err, 'Có lỗi xảy ra khi lưu trang.') });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPage) return;
    setFeedback(null);
    try {
      await deleteMutation.mutateAsync(selectedPage.id);
      setFeedback({ type: 'success', message: `Đã xóa trang "${selectedPage.title}".` });
      setIsDeleteOpen(false);
    } catch (err) {
      setFeedback({ type: 'error', message: getApiErrorMessage(err, 'Có lỗi xảy ra khi xóa trang.') });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-brand-600" />
            Trang Nội Dung
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Nội dung cho các link footer như Giới Thiệu, Điều Khoản, Chính Sách... Mỗi trang có
            đường dẫn riêng (vd: /about), tự viết và chỉnh sửa nội dung không cần sửa code.
          </p>
        </div>
        <Button onClick={handleOpenCreate} leftIcon={<Plus className="w-4 h-4" />}>
          Thêm Trang
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
              Không thể tải danh sách trang ({error instanceof Error ? error.message : 'Lỗi kết nối'}).
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Thử Lại
          </Button>
        </div>
      )}

      <PageTable
        pages={pages}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      <PageFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSaveForm}
        pageToEdit={selectedPage}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={selectedPage?.title ?? ''}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
