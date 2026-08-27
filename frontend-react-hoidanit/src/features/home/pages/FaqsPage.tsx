import { useState } from 'react';
import { AlertCircle, HelpCircle, Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { FaqTable } from '../components/FaqTable';
import { FaqFormModal } from '../components/FaqFormModal';
import type { FaqFormSubmitData } from '../components/FaqFormModal';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { useAdminFaqs } from '../hooks/useFaqs';
import { useCreateFaq, useDeleteFaq, useUpdateFaq } from '../hooks/useFaqMutations';
import type { Faq } from '../types/home.types';

export const FaqsPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<Faq | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );

  const { data, isLoading, isError, error, refetch } = useAdminFaqs();
  const faqs = data ?? [];

  const createMutation = useCreateFaq();
  const updateMutation = useUpdateFaq();
  const deleteMutation = useDeleteFaq();

  const handleOpenCreate = () => {
    setSelectedFaq(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (faq: Faq) => {
    setSelectedFaq(faq);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (faq: Faq) => {
    setSelectedFaq(faq);
    setIsDeleteOpen(true);
  };

  const handleSaveForm = async (data: FaqFormSubmitData) => {
    setFeedback(null);
    try {
      if (selectedFaq) {
        await updateMutation.mutateAsync({ id: selectedFaq.id, input: data });
        setFeedback({ type: 'success', message: `Đã cập nhật câu hỏi "${data.question}".` });
      } else {
        await createMutation.mutateAsync(data);
        setFeedback({ type: 'success', message: `Đã tạo câu hỏi "${data.question}".` });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: getApiErrorMessage(err, 'Có lỗi xảy ra khi lưu câu hỏi.') });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedFaq) return;
    setFeedback(null);
    try {
      await deleteMutation.mutateAsync(selectedFaq.id);
      setFeedback({ type: 'success', message: `Đã xóa câu hỏi "${selectedFaq.question}".` });
      setIsDeleteOpen(false);
    } catch (err) {
      setFeedback({ type: 'error', message: getApiErrorMessage(err, 'Có lỗi xảy ra khi xóa câu hỏi.') });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-brand-600" />
            Câu Hỏi Thường Gặp
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Quản lý danh sách câu hỏi/trả lời hiển thị ở cuối trang chủ.
          </p>
        </div>
        <Button onClick={handleOpenCreate} leftIcon={<Plus className="w-4 h-4" />}>
          Thêm Câu Hỏi
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
              Không thể tải câu hỏi ({error instanceof Error ? error.message : 'Lỗi kết nối'}).
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Thử Lại
          </Button>
        </div>
      )}

      <FaqTable
        faqs={faqs}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      <FaqFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSaveForm}
        faqToEdit={selectedFaq}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={selectedFaq?.question ?? ''}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
