import { useState } from 'react';
import { AlertCircle, LayoutList, Plus } from 'lucide-react';
import { Button, Spinner } from '@/shared/components/ui';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { HomepageSectionCard } from '../components/HomepageSectionCard';
import { ShopTopCategoriesCard } from '../components/ShopTopCategoriesCard';
import { HomepageSectionFormModal } from '../components/HomepageSectionFormModal';
import type { HomepageSectionFormSubmitData } from '../components/HomepageSectionFormModal';
import {
  useAdminHomepageSections,
  useCreateHomepageSection,
  useDeleteHomepageSection,
  useReorderHomepageSections,
  useUpdateHomepageSection,
} from '../hooks/useAdminHomepageSections';
import type { HomepageSection } from '../types/homepage-section.types';

export const HomepageSectionsPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [sectionToEdit, setSectionToEdit] = useState<HomepageSection | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const { sections, isLoading, isError, error, refetch } = useAdminHomepageSections();
  const createMutation = useCreateHomepageSection();
  const updateMutation = useUpdateHomepageSection();
  const deleteMutation = useDeleteHomepageSection();
  const reorderMutation = useReorderHomepageSections();

  const sortedSections = [...sections].sort((a, b) => a.sortOrder - b.sortOrder);

  const handleOpenCreate = () => {
    setSectionToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (section: HomepageSection) => {
    setSectionToEdit(section);
    setIsFormOpen(true);
  };

  const handleSubmitForm = async (data: HomepageSectionFormSubmitData) => {
    setFeedback(null);
    try {
      if (sectionToEdit) {
        await updateMutation.mutateAsync({ id: sectionToEdit.id, input: data });
        setFeedback({ type: 'success', message: `Đã cập nhật mục "${data.title}".` });
      } else {
        await createMutation.mutateAsync(data);
        setFeedback({ type: 'success', message: `Đã tạo mục "${data.title}".` });
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: getApiErrorMessage(err, 'Có lỗi xảy ra khi lưu mục trang chủ.'),
      });
    }
  };

  const handleDelete = async (section: HomepageSection) => {
    if (!window.confirm(`Xóa mục "${section.title}"? Toàn bộ sản phẩm trong mục sẽ bị gỡ bỏ.`)) {
      return;
    }
    setFeedback(null);
    try {
      await deleteMutation.mutateAsync(section.id);
      setFeedback({ type: 'success', message: `Đã xóa mục "${section.title}".` });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: getApiErrorMessage(err, 'Có lỗi xảy ra khi xóa mục.'),
      });
    }
  };

  const moveSection = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= sortedSections.length) return;
    const reordered = [...sortedSections];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    reorderMutation.mutate(reordered.map((section) => section.id));
  };

  const moveSectionTo = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    const reordered = [...sortedSections];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    reorderMutation.mutate(reordered.map((section) => section.id));
  };

  const handleDragStart = (index: number) => (e: React.DragEvent) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (index: number) => (e: React.DragEvent) => {
    e.preventDefault();
    if (dragIndex === null) return;
    if (index !== dragOverIndex) setDragOverIndex(index);
  };

  const handleDrop = (index: number) => (e: React.DragEvent) => {
    e.preventDefault();
    if (dragIndex !== null) moveSectionTo(dragIndex, index);
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <LayoutList className="w-6 h-6 text-brand-600" />
            Quản Lý Mục Trang Chủ
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Tạo các dải sản phẩm hiển thị trên trang chủ (Sản Phẩm Nổi Bật, Ưu Đãi, theo danh
            mục...), chọn tay từng sản phẩm và chỉnh giá/khuyến mãi hiển thị riêng cho từng mục.
          </p>
        </div>
        <Button onClick={handleOpenCreate} leftIcon={<Plus className="w-4 h-4" />}>
          Thêm Mục
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
              Không thể tải danh sách mục ({error instanceof Error ? error.message : 'Lỗi kết nối'}).
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Thử Lại
          </Button>
        </div>
      )}

      <ShopTopCategoriesCard />

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner />
        </div>
      ) : sortedSections.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-10 text-center">
          <p className="text-slate-500 dark:text-slate-400">
            Chưa có mục nào. Bấm "Thêm Mục" để tạo dải sản phẩm đầu tiên cho trang chủ.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedSections.map((section, index) => (
            <div
              key={section.id}
              onDragOver={handleDragOver(index)}
              onDrop={handleDrop(index)}
              className={`rounded-2xl transition-shadow ${
                dragOverIndex === index && dragIndex !== null && dragIndex !== index
                  ? 'ring-2 ring-brand-500'
                  : ''
              } ${dragIndex === index ? 'opacity-50' : ''}`}
            >
              <HomepageSectionCard
                section={section}
                position={index + 1}
                totalCount={sortedSections.length}
                onEdit={() => handleOpenEdit(section)}
                onDelete={() => handleDelete(section)}
                onMoveUp={() => moveSection(index, -1)}
                onMoveDown={() => moveSection(index, 1)}
                onChangePosition={(newPosition) => moveSectionTo(index, newPosition - 1)}
                canMoveUp={index > 0}
                canMoveDown={index < sortedSections.length - 1}
                onDragHandleStart={handleDragStart(index)}
                onDragHandleEnd={handleDragEnd}
              />
            </div>
          ))}
        </div>
      )}

      <HomepageSectionFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmitForm}
        sectionToEdit={sectionToEdit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};
