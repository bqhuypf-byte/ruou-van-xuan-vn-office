import { useState } from 'react';
import { Plus, Search, FolderTree, Layers, Network, AlertCircle } from 'lucide-react';
import { Button, Input } from '@/shared/components/ui';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { CategoryTable } from '../components/CategoryTable';
import { CategoryFormModal } from '../components/CategoryFormModal';
import type { CategoryFormSubmitData } from '../components/CategoryFormModal';
import { CategoryDeleteModal } from '../components/CategoryDeleteModal';
import { useCategories } from '../hooks/useCategories';
import type { FlatCategory } from '../hooks/useCategories';
import {
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from '../hooks/useCategoryMutations';

export const CategoriesPage = () => {
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<FlatCategory | null>(null);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const { categories, allCategories, isLoading, isError, error, refetch } =
    useCategories({ search });

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const handleOpenCreate = () => {
    setSelectedCategory(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (category: FlatCategory) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (category: FlatCategory) => {
    setSelectedCategory(category);
    setIsDeleteOpen(true);
  };

  const handleSaveForm = async (data: CategoryFormSubmitData) => {
    setFeedback(null);
    try {
      if (selectedCategory) {
        await updateMutation.mutateAsync({ id: selectedCategory.id, input: data });
        setFeedback({
          type: 'success',
          message: `Đã cập nhật danh mục "${data.name}" thành công.`,
        });
      } else {
        await createMutation.mutateAsync(data);
        setFeedback({
          type: 'success',
          message: `Đã tạo danh mục "${data.name}" thành công.`,
        });
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: getApiErrorMessage(err, 'Có lỗi xảy ra khi lưu danh mục.'),
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCategory) return;
    setFeedback(null);
    try {
      await deleteMutation.mutateAsync(selectedCategory.id);
      setFeedback({
        type: 'success',
        message: `Đã xóa danh mục "${selectedCategory.name}" thành công.`,
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: getApiErrorMessage(err, 'Có lỗi xảy ra khi xóa danh mục.'),
      });
    }
  };

  const totalCount = allCategories.length;
  const rootCount = allCategories.filter((c) => c.parentId === null).length;
  const childCount = totalCount - rootCount;

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Quản Lý Danh Mục (Category CRUD)
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Quản lý cây danh mục sản phẩm trong hệ thống e-commerce.
          </p>
        </div>
        <Button onClick={handleOpenCreate} leftIcon={<Plus className="w-4 h-4" />} size="md">
          Thêm Danh Mục
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <FolderTree className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Tổng Danh Mục</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{totalCount}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Danh Mục Gốc</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{rootCount}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Danh Mục Con</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{childCount}</p>
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
              Không thể tải danh sách danh mục ({error instanceof Error ? error.message : 'Lỗi kết nối'}).
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Thử Lại
          </Button>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Tìm theo tên hoặc slug..."
            leftIcon={<Search className="w-4 h-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <CategoryTable
        categories={categories}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      <CategoryFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSaveForm}
        categoryToEdit={selectedCategory}
        parentOptions={allCategories}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <CategoryDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        categoryToDelete={selectedCategory}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
