import { useEffect, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Layers, Link2 } from 'lucide-react';
import { Button, ImageDropzone, Input, Modal } from '@/shared/components/ui';
import { slugify } from '@/shared/utils/slugify';
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
  showInProductSections: z.boolean(),
  homeSectionTitle: z.string().max(100, 'Tối đa 100 ký tự').optional(),
  homeSortOrder: z.string().optional(),
  homeDisplayStyle: z.enum(['grid', 'carousel']),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export interface CategoryFormSubmitData {
  name: string;
  slug: string;
  parentId?: number;
  description?: string;
  thumbnailUrl?: string;
  showInProductSections: boolean;
  homeSectionTitle?: string;
  homeSortOrder?: number;
  homeDisplayStyle: 'grid' | 'carousel';
}

export interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormSubmitData) => Promise<void>;
  categoryToEdit?: FlatCategory | null;
  defaultParentId?: number | null;
  parentOptions: FlatCategory[];
  isLoading?: boolean;
}

export const CategoryFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  categoryToEdit,
  defaultParentId,
  parentOptions,
  isLoading = false,
}: CategoryFormModalProps) => {
  const isEditing = Boolean(categoryToEdit);

  const isSlugManuallyEditedRef = useRef(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
      parentId: '',
      description: '',
      thumbnailUrl: '',
      showInProductSections: true,
      homeSectionTitle: '',
      homeSortOrder: '0',
      homeDisplayStyle: 'grid',
    },
  });

  const isRootCategory = !watch('parentId');
  const nameValue = watch('name');

  useEffect(() => {
    if (isSlugManuallyEditedRef.current) return;
    const generatedSlug = slugify(nameValue || '');
    if (!generatedSlug) return;
    setValue('slug', generatedSlug);
  }, [nameValue, setValue]);

  useEffect(() => {
    if (isOpen) {
      isSlugManuallyEditedRef.current = Boolean(categoryToEdit);
      if (categoryToEdit) {
        reset({
          name: categoryToEdit.name,
          slug: categoryToEdit.slug,
          parentId: categoryToEdit.parentId ? String(categoryToEdit.parentId) : '',
          description: categoryToEdit.description ?? '',
          thumbnailUrl: categoryToEdit.thumbnailUrl ?? '',
          showInProductSections: categoryToEdit.showInProductSections,
          homeSectionTitle: categoryToEdit.homeSectionTitle ?? '',
          homeSortOrder: String(categoryToEdit.homeSortOrder ?? 0),
          homeDisplayStyle: categoryToEdit.homeDisplayStyle ?? 'grid',
        });
      } else {
        reset({
          name: '',
          slug: '',
          parentId: defaultParentId ? String(defaultParentId) : '',
          description: '',
          thumbnailUrl: '',
          showInProductSections: true,
          homeSectionTitle: '',
          homeSortOrder: '0',
          homeDisplayStyle: 'grid',
        });
      }
    }
  }, [isOpen, categoryToEdit, defaultParentId, reset]);

  const handleFormSubmit = async (data: CategoryFormData) => {
    await onSubmit({
      name: data.name,
      slug: data.slug,
      parentId: data.parentId ? Number(data.parentId) : undefined,
      description: data.description || undefined,
      thumbnailUrl: data.thumbnailUrl || undefined,
      showInProductSections: data.showInProductSections,
      homeSectionTitle: data.homeSectionTitle || undefined,
      homeSortOrder: data.homeSortOrder ? Number(data.homeSortOrder) : undefined,
      homeDisplayStyle: data.homeDisplayStyle,
    });
    onClose();
  };

  const selectableParents = parentOptions.filter((c) => c.id !== categoryToEdit?.id);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        isEditing
          ? 'Chỉnh Sửa Danh Mục'
          : defaultParentId
            ? 'Thêm Phân Loại Nhỏ'
            : 'Tạo Danh Mục Mới'
      }
      description={
        isEditing
          ? `Cập nhật thông tin danh mục #${categoryToEdit?.id}`
          : defaultParentId
            ? 'Tạo danh mục con thuộc danh mục gốc đã chọn'
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
          helperText="Chữ thường, không dấu, cách nhau bằng dấu gạch ngang — quyết định đường link /categories/slug. Tự động sinh theo tên, có thể sửa tay."
          {...register('slug', {
            onChange: () => {
              isSlugManuallyEditedRef.current = true;
            },
          })}
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
            className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:border-brand-500 focus:ring-brand-500/20"
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

        <Controller
          name="thumbnailUrl"
          control={control}
          render={({ field }) => (
            <ImageDropzone
              label="Ảnh Đại Diện"
              value={field.value}
              onChange={field.onChange}
              error={errors.thumbnailUrl?.message}
              helperText="Hiển thị ở lưới danh mục trang chủ và banner trang danh mục"
            />
          )}
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
            className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:border-brand-500 focus:ring-brand-500/20"
            {...register('description')}
          />
        </div>

        <div className="space-y-3 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Hiển thị trên trang chủ
          </p>
          {isRootCategory && (
            <>
              <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500/20 dark:border-slate-700"
                  {...register('showInProductSections')}
                />
                Hiện thành khối sản phẩm riêng ở trang chủ (kèm nút "Xem Tất Cả")
              </label>
              <Input
                label="Tiêu đề khối trên trang chủ"
                placeholder={`Để trống sẽ dùng tên danh mục`}
                helperText='Tên hiển thị ở tiêu đề khối trên trang chủ, khác với "Tên danh mục" nếu cần'
                error={errors.homeSectionTitle?.message}
                {...register('homeSectionTitle')}
              />
            </>
          )}
          <Input
            label="Thứ tự hiển thị"
            type="number"
            placeholder="0"
            helperText="Số nhỏ hơn hiển thị trước"
            {...register('homeSortOrder')}
          />
          <div className="w-full space-y-1.5">
            <label
              htmlFor="homeDisplayStyle"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Kiểu hiển thị sản phẩm
            </label>
            <select
              id="homeDisplayStyle"
              className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:border-brand-500 focus:ring-brand-500/20"
              {...register('homeDisplayStyle')}
            >
              <option value="grid">Lưới (Grid)</option>
              <option value="carousel">Cuộn ngang (Carousel)</option>
            </select>
          </div>
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
