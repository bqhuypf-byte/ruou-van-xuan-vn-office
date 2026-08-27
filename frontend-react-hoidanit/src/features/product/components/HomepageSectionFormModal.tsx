import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Modal } from '@/shared/components/ui';
import type { HomepageSection } from '../types/homepage-section.types';

const sectionSchema = z.object({
  title: z.string().min(1, 'Bắt buộc').max(150, 'Tối đa 150 ký tự'),
  displayStyle: z.enum(['grid', 'carousel']),
  isActive: z.boolean(),
});

type SectionFormData = z.infer<typeof sectionSchema>;

export interface HomepageSectionFormSubmitData {
  title: string;
  displayStyle: 'grid' | 'carousel';
  isActive: boolean;
}

export interface HomepageSectionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: HomepageSectionFormSubmitData) => Promise<void>;
  sectionToEdit?: HomepageSection | null;
  isLoading?: boolean;
}

export const HomepageSectionFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  sectionToEdit,
  isLoading = false,
}: HomepageSectionFormModalProps) => {
  const isEditing = Boolean(sectionToEdit);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SectionFormData>({
    resolver: zodResolver(sectionSchema),
    defaultValues: { title: '', displayStyle: 'grid', isActive: true },
  });

  useEffect(() => {
    if (isOpen) {
      reset(
        sectionToEdit
          ? {
              title: sectionToEdit.title,
              displayStyle: sectionToEdit.displayStyle,
              isActive: sectionToEdit.isActive,
            }
          : { title: '', displayStyle: 'grid', isActive: true },
      );
    }
  }, [isOpen, sectionToEdit, reset]);

  const submit = async (data: SectionFormData) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Sửa Mục Trang Chủ' : 'Thêm Mục Trang Chủ'}
      description="Mục hiển thị một dải sản phẩm trên trang chủ, bạn chọn sản phẩm sau khi tạo."
    >
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <Input
          label="Tiêu đề"
          placeholder="VD: Sản Phẩm Nổi Bật"
          error={errors.title?.message}
          {...register('title')}
        />

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Kiểu hiển thị
          </label>
          <select
            className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:border-brand-500 focus:ring-brand-500/20"
            {...register('displayStyle')}
          >
            <option value="grid">Lưới (grid)</option>
            <option value="carousel">Cuộn ngang (carousel)</option>
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <input type="checkbox" className="rounded" {...register('isActive')} />
          Hiển thị trên trang chủ
        </label>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {isEditing ? 'Lưu Thay Đổi' : 'Tạo Mục'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
