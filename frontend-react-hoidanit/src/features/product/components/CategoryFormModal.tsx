import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Layers, Link2, Image as ImageIcon } from 'lucide-react';
import { Button, Input, Modal } from '@/shared/components/ui';
import type { FlatCategory } from '../hooks/useCategories';

const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'Tên danh mục không được để trống')
    .max(100, 'Tên danh mục tối đa 100 ký tự'),
  slug: z
    .string()
    .min(1, 'Slug không được để trống')
    .max(100, 'Slug tối đa 100 ký tự')
    .regex(/^[a-z0-9-]+$/, 'Slug chỉ chứa chữ thường, số và dấu gạch ngang (-)'),
  parentId: z.string().optional(),
  description: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  showInTopCategories: z.boolean(),
  showInDailyEssentials: z.boolean(),
  homeSortOrder: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export interface CategoryFormSubmitData {
  name: string;
  slug: string;
  parentId?: number;
  description?: string;
  thumbnailUrl?: string;
  showInTopCategories: boolean;
  showInDailyEssentials: boolean;
  homeSortOrder?: number;
}

export interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormSubmitData) => Promise<void>;
  categoryToEdit?: FlatCategory | null;
  parentOptions: FlatCategory[];
  isLoading?: boolean;
}

export const CategoryFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  categoryToEdit,
  parentOptions,
  isLoading = false,
}: CategoryFormModalProps) => {
  const isEditing = Boolean(categoryToEdit);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
      parentId: '',
      description: '',
      thumbnailUrl: '',
      showInTopCategories: false,
      showInDailyEssentials: false,
      homeSortOrder: '0',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (categoryToEdit) {
        reset({
          name: categoryToEdit.name,
          slug: categoryToEdit.slug,
          parentId: categoryToEdit.parentId ? String(categoryToEdit.parentId) : '',
          description: categoryToEdit.description ?? '',
          thumbnailUrl: categoryToEdit.thumbnailUrl ?? '',
          showInTopCategories: categoryToEdit.showInTopCategories,
          showInDailyEssentials: categoryToEdit.showInDailyEssentials,
          homeSortOrder: String(categoryToEdit.homeSortOrder ?? 0),
        });
      } else {
        reset({
          name: '',
          slug: '',
          parentId: '',
          description: '',
          thumbnailUrl: '',
          showInTopCategories: false,
          showInDailyEssentials: false,
          homeSortOrder: '0',
        });
      }
    }
  }, [isOpen, categoryToEdit, reset]);

  const handleFormSubmit = async (data: CategoryFormData) => {
    await onSubmit({
      name: data.name,
      slug: data.slug,
      parentId: data.parentId ? Number(data.parentId) : undefined,
      description: data.description || undefined,
      thumbnailUrl: data.thumbnailUrl || undefined,
      showInTopCategories: data.showInTopCategories,
      showInDailyEssentials: data.showInDailyEssentials,
      homeSortOrder: data.homeSortOrder ? Number(data.homeSortOrder) : undefined,
    });
    onClose();
  };

  const selectableParents = parentOptions.filter((c) => c.id !== categoryToEdit?.id);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Chỉnh Sửa Danh Mục' : 'Tạo Danh Mục Mới'}
      description={
        isEditing
          ? `Cập nhật thông tin danh mục #${categoryToEdit?.id}`
          : 'Nhập thông tin để tạo danh mục sản phẩm mới'
      }
      size="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5 mt-2">
        <Input
          label="Tên danh mục"
          placeholder="Ví dụ: Điện thoại"
          leftIcon={<Layers className="w-4 h-4" />}
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Slug (đường link)"
          placeholder="vi-du: dien-thoai"
          leftIcon={<Link2 className="w-4 h-4" />}
          error={errors.slug?.message}
          helperText="Chữ thường, không dấu, cách nhau bằng dấu gạch ngang — quyết định đường link /categories/slug"
          {...register('slug')}
        />

        <div className="w-full space-y-1.5">
          <label
            htmlFor="parentId"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Danh Mục Cha
          </label>
          <select
            id="parentId"
            className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:border-indigo-500 focus:ring-indigo-500/20"
            {...register('parentId')}
          >
            <option value="">-- Không có (Danh mục gốc) --</option>
            {selectableParents.map((category) => (
              <option key={category.id} value={category.id}>
                {'—'.repeat(category.depth)} {category.name}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Ảnh Đại Diện (URL)"
          placeholder="https://..."
          leftIcon={<ImageIcon className="w-4 h-4" />}
          error={errors.thumbnailUrl?.message}
          helperText="Hiển thị ở lưới danh mục trang chủ và banner trang danh mục"
          {...register('thumbnailUrl')}
        />

        <div className="w-full space-y-1.5">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Nội Dung Mô Tả
          </label>
          <textarea
            id="description"
            rows={3}
            placeholder="Mô tả ngắn về danh mục..."
            className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:border-indigo-500 focus:ring-indigo-500/20"
            {...register('description')}
          />
        </div>

        <div className="space-y-3 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Hiển thị trên trang chủ
          </p>
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20 dark:border-slate-700"
              {...register('showInTopCategories')}
            />
            Hiện trong "Danh Mục Nổi Bật" (Shop From Top Categories)
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20 dark:border-slate-700"
              {...register('showInDailyEssentials')}
            />
            Hiện trong "Nhu Yếu Phẩm Hàng Ngày" (Daily Essentials)
          </label>
          <Input
            label="Thứ tự hiển thị"
            type="number"
            placeholder="0"
            helperText="Số nhỏ hơn hiển thị trước"
            {...register('homeSortOrder')}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" onClick={onClose} type="button">
            Hủy
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {isEditing ? 'Cập Nhật' : 'Tạo Mới'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
