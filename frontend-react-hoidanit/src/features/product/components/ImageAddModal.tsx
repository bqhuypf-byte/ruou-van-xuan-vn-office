import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Image as ImageIcon } from 'lucide-react';
import { Button, Input, Modal } from '@/shared/components/ui';

const imageSchema = z.object({
  imageUrl: z
    .string()
    .min(1, 'URL hình ảnh không được để trống')
    .max(500, 'URL hình ảnh tối đa 500 ký tự'),
});

type ImageFormData = z.infer<typeof imageSchema>;

export interface ImageAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (imageUrl: string) => Promise<void>;
  isLoading?: boolean;
}

export const ImageAddModal = ({ isOpen, onClose, onSubmit, isLoading = false }: ImageAddModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ImageFormData>({
    resolver: zodResolver(imageSchema),
    defaultValues: { imageUrl: '' },
  });

  useEffect(() => {
    if (isOpen) {
      reset({ imageUrl: '' });
    }
  }, [isOpen, reset]);

  const handleFormSubmit = async (data: ImageFormData) => {
    await onSubmit(data.imageUrl);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Thêm Hình Ảnh"
      description="Nhập URL hình ảnh sản phẩm"
      size="sm"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5 mt-2">
        <Input
          label="URL Hình Ảnh"
          placeholder="https://..."
          leftIcon={<ImageIcon className="w-4 h-4" />}
          error={errors.imageUrl?.message}
          {...register('imageUrl')}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" onClick={onClose} type="button">
            Hủy
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Thêm Ảnh
          </Button>
        </div>
      </form>
    </Modal>
  );
};
