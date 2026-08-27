import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link2, Tag, Type } from 'lucide-react';
import { Button, ImageDropzone, Input, Modal } from '@/shared/components/ui';
import type { Banner } from '../types/home.types';

const bannerSchema = z.object({
  title: z.string().min(1, 'Bắt buộc').max(255, 'Tối đa 255 ký tự'),
  subtitle: z.string().max(255, 'Tối đa 255 ký tự').optional(),
  badgeText: z.string().max(100, 'Tối đa 100 ký tự').optional(),
  imageUrl: z.string().max(500).optional(),
  ctaLink: z.string().max(500).optional(),
  bgColor: z.string().max(20).optional(),
  sortOrder: z.string().optional(),
  isActive: z.boolean(),
});

type BannerFormData = z.infer<typeof bannerSchema>;

export interface BannerFormSubmitData {
  title: string;
  subtitle?: string;
  badgeText?: string;
  imageUrl?: string;
  ctaLink?: string;
  bgColor?: string;
  sortOrder?: number;
  isActive: boolean;
}

export interface BannerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BannerFormSubmitData) => Promise<void>;
  bannerToEdit?: Banner | null;
  isLoading?: boolean;
}

const emptyValues: BannerFormData = {
  title: '',
  subtitle: '',
  badgeText: '',
  imageUrl: '',
  ctaLink: '',
  bgColor: '',
  sortOrder: '0',
  isActive: true,
};

export const BannerFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  bannerToEdit,
  isLoading = false,
}: BannerFormModalProps) => {
  const isEditing = Boolean(bannerToEdit);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BannerFormData>({
    resolver: zodResolver(bannerSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (isOpen) {
      if (bannerToEdit) {
        reset({
          title: bannerToEdit.title,
          subtitle: bannerToEdit.subtitle ?? '',
          badgeText: bannerToEdit.badgeText ?? '',
          imageUrl: bannerToEdit.imageUrl ?? '',
          ctaLink: bannerToEdit.ctaLink ?? '',
          bgColor: bannerToEdit.bgColor ?? '',
          sortOrder: String(bannerToEdit.sortOrder),
          isActive: bannerToEdit.isActive,
        });
      } else {
        reset(emptyValues);
      }
    }
  }, [isOpen, bannerToEdit, reset]);

  const handleFormSubmit = async (data: BannerFormData) => {
    await onSubmit({
      title: data.title,
      subtitle: data.subtitle || undefined,
      badgeText: data.badgeText || undefined,
      imageUrl: data.imageUrl || undefined,
      ctaLink: data.ctaLink || undefined,
      bgColor: data.bgColor || undefined,
      sortOrder: data.sortOrder ? Number(data.sortOrder) : undefined,
      isActive: data.isActive,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Chỉnh Sửa Banner' : 'Thêm Banner Mới'}
      description="Banner hiển thị ở khu vực hero đầu trang chủ"
      size="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5 mt-2">
        <Input
          label="Tiêu đề"
          placeholder="SMART WEARABLE."
          leftIcon={<Type className="w-4 h-4" />}
          error={errors.title?.message}
          {...register('title')}
        />
        <Input
          label="Phụ đề"
          placeholder="Best Deal Online on smart watches"
          error={errors.subtitle?.message}
          {...register('subtitle')}
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
        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Màu nền (hex)"
            placeholder="#212844"
            error={errors.bgColor?.message}
            {...register('bgColor')}
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
