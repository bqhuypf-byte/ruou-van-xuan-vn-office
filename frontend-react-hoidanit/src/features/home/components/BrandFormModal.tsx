import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link2, Tag, Type } from 'lucide-react';
import { Button, ImageDropzone, Input, Modal } from '@/shared/components/ui';
import type { Brand } from '../types/home.types';

const brandSchema = z.object({
  name: z.string().min(1, 'Bắt buộc').max(100, 'Tối đa 100 ký tự'),
  badgeText: z.string().max(100, 'Tối đa 100 ký tự').optional(),
  imageUrl: z.string().max(500).optional(),
  bgColor: z.string().max(20).optional(),
  tagPillColor: z.string().max(20).optional(),
  ctaLink: z.string().max(500).optional(),
  sortOrder: z.string().optional(),
  isActive: z.boolean(),
});

type BrandFormData = z.infer<typeof brandSchema>;

export interface BrandFormSubmitData {
  name: string;
  badgeText?: string;
  imageUrl?: string;
  bgColor?: string;
  tagPillColor?: string;
  ctaLink?: string;
  sortOrder?: number;
  isActive: boolean;
}

export interface BrandFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BrandFormSubmitData) => Promise<void>;
  brandToEdit?: Brand | null;
  isLoading?: boolean;
}

const emptyValues: BrandFormData = {
  name: '',
  badgeText: '',
  imageUrl: '',
  bgColor: '',
  tagPillColor: '',
  ctaLink: '',
  sortOrder: '0',
  isActive: true,
};

export const BrandFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  brandToEdit,
  isLoading = false,
}: BrandFormModalProps) => {
  const isEditing = Boolean(brandToEdit);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BrandFormData>({
    resolver: zodResolver(brandSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (isOpen) {
      if (brandToEdit) {
        reset({
          name: brandToEdit.name,
          badgeText: brandToEdit.badgeText ?? '',
          imageUrl: brandToEdit.imageUrl ?? '',
          bgColor: brandToEdit.bgColor ?? '',
          tagPillColor: brandToEdit.tagPillColor ?? '',
          ctaLink: brandToEdit.ctaLink ?? '',
          sortOrder: String(brandToEdit.sortOrder),
          isActive: brandToEdit.isActive,
        });
      } else {
        reset(emptyValues);
      }
    }
  }, [isOpen, brandToEdit, reset]);

  const handleFormSubmit = async (data: BrandFormData) => {
    await onSubmit({
      name: data.name,
      badgeText: data.badgeText || undefined,
      imageUrl: data.imageUrl || undefined,
      bgColor: data.bgColor || undefined,
      tagPillColor: data.tagPillColor || undefined,
      ctaLink: data.ctaLink || undefined,
      sortOrder: data.sortOrder ? Number(data.sortOrder) : undefined,
      isActive: data.isActive,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Chỉnh Sửa Thương Hiệu' : 'Thêm Thương Hiệu Mới'}
      description='Thẻ quảng cáo hiển thị ở mục "Top Electronics Brands" trang chủ'
      size="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5 mt-2">
        <Input
          label="Tên thương hiệu"
          placeholder="IPHONE"
          leftIcon={<Type className="w-4 h-4" />}
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Nhãn khuyến mãi"
          placeholder="UP to 80% OFF"
          leftIcon={<Tag className="w-4 h-4" />}
          error={errors.badgeText?.message}
          {...register('badgeText')}
        />
        <Controller
          name="imageUrl"
          control={control}
          render={({ field }) => (
            <ImageDropzone
              label="Ảnh"
              value={field.value}
              onChange={field.onChange}
              error={errors.imageUrl?.message}
            />
          )}
        />
        <Input
          label="Liên kết CTA"
          placeholder="/products"
          leftIcon={<Link2 className="w-4 h-4" />}
          error={errors.ctaLink?.message}
          {...register('ctaLink')}
        />
        <div className="grid sm:grid-cols-3 gap-4">
          <Input
            label="Màu nền (hex)"
            placeholder="#313131"
            error={errors.bgColor?.message}
            {...register('bgColor')}
          />
          <Input
            label="Màu nhãn (hex)"
            placeholder="#494949"
            error={errors.tagPillColor?.message}
            {...register('tagPillColor')}
          />
          <Input
            label="Thứ tự hiển thị"
            type="number"
            placeholder="0"
            {...register('sortOrder')}
          />
        </div>

        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            className="rounded border-slate-300 text-brand-600 focus:ring-brand-500/20 dark:border-slate-700"
            {...register('isActive')}
          />
          Hiển thị trên trang chủ
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
