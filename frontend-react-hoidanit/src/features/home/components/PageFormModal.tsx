import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Modal } from '@/shared/components/ui';
import type { Page } from '../types/home.types';

const pageSchema = z.object({
  slug: z
    .string()
    .min(1, 'Bắt buộc')
    .max(100, 'Tối đa 100 ký tự')
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Chỉ chữ thường, số và dấu gạch ngang (vd: chinh-sach-doi-tra)'),
  title: z.string().min(1, 'Bắt buộc').max(255, 'Tối đa 255 ký tự'),
  content: z.string().min(1, 'Bắt buộc'),
  isActive: z.boolean(),
});

type PageFormData = z.infer<typeof pageSchema>;

export interface PageFormSubmitData {
  slug: string;
  title: string;
  content: string;
  isActive: boolean;
}

export interface PageFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PageFormSubmitData) => Promise<void>;
  pageToEdit?: Page | null;
  isLoading?: boolean;
}

const emptyValues: PageFormData = {
  slug: '',
  title: '',
  content: '',
  isActive: true,
};

export const PageFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  pageToEdit,
  isLoading = false,
}: PageFormModalProps) => {
  const isEditing = Boolean(pageToEdit);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PageFormData>({
    resolver: zodResolver(pageSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (isOpen) {
      if (pageToEdit) {
        reset({
          slug: pageToEdit.slug,
          title: pageToEdit.title,
          content: pageToEdit.content,
          isActive: pageToEdit.isActive,
        });
      } else {
        reset(emptyValues);
      }
    }
  }, [isOpen, pageToEdit, reset]);

  const handleFormSubmit = async (data: PageFormData) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Chỉnh Sửa Trang' : 'Thêm Trang Mới'}
      description="Trang nội dung tĩnh, truy cập tại địa chỉ /{slug} trên website"
      size="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5 mt-2">
        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Tiêu đề"
            placeholder="Giới Thiệu"
            error={errors.title?.message}
            {...register('title')}
          />
          <Input
            label="Đường dẫn (slug)"
            placeholder="about"
            helperText="Trang sẽ hiển thị tại /about"
            error={errors.slug?.message}
            disabled={isEditing}
            {...register('slug')}
          />
        </div>

        <div className="w-full space-y-1.5">
          <label
            htmlFor="content"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Nội dung
          </label>
          <textarea
            id="content"
            rows={10}
            placeholder="Nội dung chi tiết của trang..."
            className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:border-brand-500 focus:ring-brand-500/20"
            {...register('content')}
          />
          {errors.content?.message && (
            <p className="text-xs text-rose-600 dark:text-rose-400">{errors.content.message}</p>
          )}
        </div>

        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            className="rounded border-slate-300 text-brand-600 focus:ring-brand-500/20 dark:border-slate-700"
            {...register('isActive')}
          />
          Hiển thị trang này trên website
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
