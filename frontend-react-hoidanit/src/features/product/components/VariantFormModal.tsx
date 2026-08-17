import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Hash, Palette, Ruler, DollarSign, Boxes } from 'lucide-react';
import { Button, Input, Modal } from '@/shared/components/ui';
import type { ProductVariant } from '../types/variant.types';

const variantSchema = z.object({
  sku: z.string().min(1, 'SKU không được để trống').max(50, 'SKU tối đa 50 ký tự'),
  color: z.string().max(50, 'Màu sắc tối đa 50 ký tự').optional(),
  size: z.string().max(20, 'Kích cỡ tối đa 20 ký tự').optional(),
  price: z
    .string()
    .min(1, 'Giá không được để trống')
    .refine((val) => Number(val) > 0, 'Giá phải lớn hơn 0'),
  salePrice: z
    .string()
    .optional()
    .refine((val) => !val || Number(val) > 0, 'Giá khuyến mãi phải lớn hơn 0'),
  stockQuantity: z
    .string()
    .min(1, 'Tồn kho không được để trống')
    .refine((val) => Number.isInteger(Number(val)) && Number(val) >= 0, 'Tồn kho không được âm'),
});

type VariantFormData = z.infer<typeof variantSchema>;

export interface VariantFormSubmitData {
  sku: string;
  color?: string;
  size?: string;
  price: number;
  salePrice?: number;
  stockQuantity: number;
}

export interface VariantFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: VariantFormSubmitData) => Promise<void>;
  variantToEdit?: ProductVariant | null;
  isLoading?: boolean;
}

export const VariantFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  variantToEdit,
  isLoading = false,
}: VariantFormModalProps) => {
  const isEditing = Boolean(variantToEdit);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VariantFormData>({
    resolver: zodResolver(variantSchema),
    defaultValues: {
      sku: '',
      color: '',
      size: '',
      price: '',
      salePrice: '',
      stockQuantity: '0',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (variantToEdit) {
        reset({
          sku: variantToEdit.sku,
          color: variantToEdit.color ?? '',
          size: variantToEdit.size ?? '',
          price: variantToEdit.price,
          salePrice: variantToEdit.salePrice ?? '',
          stockQuantity: String(variantToEdit.stockQuantity),
        });
      } else {
        reset({ sku: '', color: '', size: '', price: '', salePrice: '', stockQuantity: '0' });
      }
    }
  }, [isOpen, variantToEdit, reset]);

  const handleFormSubmit = async (data: VariantFormData) => {
    await onSubmit({
      sku: data.sku,
      color: data.color || undefined,
      size: data.size || undefined,
      price: Number(data.price),
      salePrice: data.salePrice ? Number(data.salePrice) : undefined,
      stockQuantity: Number(data.stockQuantity),
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Chỉnh Sửa Biến Thể' : 'Thêm Biến Thể Mới'}
      description={isEditing ? `Cập nhật biến thể #${variantToEdit?.id}` : 'Nhập thông tin biến thể sản phẩm'}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5 mt-2">
        <Input
          label="SKU"
          placeholder="Ví dụ: IP15-BLK-128"
          leftIcon={<Hash className="w-4 h-4" />}
          error={errors.sku?.message}
          {...register('sku')}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Màu Sắc"
            placeholder="Đen"
            leftIcon={<Palette className="w-4 h-4" />}
            error={errors.color?.message}
            {...register('color')}
          />
          <Input
            label="Kích Cỡ"
            placeholder="128GB"
            leftIcon={<Ruler className="w-4 h-4" />}
            error={errors.size?.message}
            {...register('size')}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Giá Gốc"
            type="number"
            step="0.01"
            placeholder="999.99"
            leftIcon={<DollarSign className="w-4 h-4" />}
            error={errors.price?.message}
            {...register('price')}
          />
          <Input
            label="Giá Khuyến Mãi"
            type="number"
            step="0.01"
            placeholder="Tùy chọn"
            leftIcon={<DollarSign className="w-4 h-4" />}
            error={errors.salePrice?.message}
            {...register('salePrice')}
          />
        </div>

        <Input
          label="Tồn Kho"
          type="number"
          leftIcon={<Boxes className="w-4 h-4" />}
          error={errors.stockQuantity?.message}
          {...register('stockQuantity')}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" onClick={onClose} type="button">
            Hủy
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {isEditing ? 'Cập Nhật' : 'Thêm Mới'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
