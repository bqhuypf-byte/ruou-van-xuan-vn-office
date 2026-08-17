import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Package, Link2, Image as ImageIcon } from 'lucide-react';
import { Button, Input, Modal } from '@/shared/components/ui';
import type { Product } from '../types/product.types';
import type { FlatCategory } from '../hooks/useCategories';

const productSchema = z.object({
  categoryId: z.string().min(1, 'Vui lòng chọn danh mục'),
  name: z
    .string()
    .min(1, 'Tên sản phẩm không được để trống')
    .max(255, 'Tên sản phẩm tối đa 255 ký tự'),
  slug: z
    .string()
    .min(1, 'Slug không được để trống')
    .max(255, 'Slug tối đa 255 ký tự')
    .regex(/^[a-z0-9-]+$/, 'Slug chỉ chứa chữ thường, số và dấu gạch ngang (-)'),
  description: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  isActive: z.boolean(),
});

type ProductFormData = z.infer<typeof productSchema>;

export interface ProductFormSubmitData {
  categoryId: number;
  name: string;
  slug: string;
  description?: string;
  thumbnailUrl?: string;
  isActive: boolean;
}

export interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormSubmitData) => Promise<void>;
  productToEdit?: Product | null;
  categoryOptions: FlatCategory[];
  isLoading?: boolean;
}

export const ProductFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  productToEdit,
  categoryOptions,
  isLoading = false,
}: ProductFormModalProps) => {
  const isEditing = Boolean(productToEdit);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      categoryId: '',
      name: '',
      slug: '',
      description: '',
      thumbnailUrl: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (productToEdit) {
        reset({
          categoryId: String(productToEdit.categoryId),
          name: productToEdit.name,
          slug: productToEdit.slug,
          description: productToEdit.description ?? '',
          thumbnailUrl: productToEdit.thumbnailUrl ?? '',
          isActive: productToEdit.isActive,
        });
      } else {
        reset({
          categoryId: '',
          name: '',
          slug: '',
          description: '',
          thumbnailUrl: '',
          isActive: true,
        });
      }
    }
  }, [isOpen, productToEdit, reset]);

  const handleFormSubmit = async (data: ProductFormData) => {
    await onSubmit({
      categoryId: Number(data.categoryId),
      name: data.name,
      slug: data.slug,
      description: data.description || undefined,
      thumbnailUrl: data.thumbnailUrl || undefined,
      isActive: data.isActive,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Chỉnh Sửa Sản Phẩm' : 'Tạo Sản Phẩm Mới'}
      description={
        isEditing
          ? `Cập nhật thông tin sản phẩm #${productToEdit?.id}`
          : 'Nhập thông tin để tạo sản phẩm mới'
      }
      size="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5 mt-2">
        <Input
          label="Tên sản phẩm"
          placeholder="Ví dụ: iPhone 15"
          leftIcon={<Package className="w-4 h-4" />}
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Slug"
          placeholder="vi-du: iphone-15"
          leftIcon={<Link2 className="w-4 h-4" />}
          error={errors.slug?.message}
          {...register('slug')}
        />

        <div className="w-full space-y-1.5">
          <label
            htmlFor="categoryId"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Danh Mục
          </label>
          <select
            id="categoryId"
            className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:border-indigo-500 focus:ring-indigo-500/20"
            {...register('categoryId')}
          >
            <option value="">-- Chọn danh mục --</option>
            {categoryOptions.map((category) => (
              <option key={category.id} value={category.id}>
                {'—'.repeat(category.depth)} {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="text-xs text-rose-600 dark:text-rose-400">
              {errors.categoryId.message}
            </p>
          )}
        </div>

        <Input
          label="Ảnh Đại Diện (URL)"
          placeholder="https://..."
          leftIcon={<ImageIcon className="w-4 h-4" />}
          error={errors.thumbnailUrl?.message}
          {...register('thumbnailUrl')}
        />

        <div className="w-full space-y-1.5">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Mô Tả
          </label>
          <textarea
            id="description"
            rows={3}
            placeholder="Mô tả sản phẩm..."
            className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:border-indigo-500 focus:ring-indigo-500/20"
            {...register('description')}
          />
        </div>

        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20 dark:border-slate-700"
            {...register('isActive')}
          />
          Đang bán (hiển thị cho khách hàng)
        </label>

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
