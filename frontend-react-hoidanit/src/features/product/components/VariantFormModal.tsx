import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Hash, Tag, DollarSign, Boxes, RefreshCw } from 'lucide-react';
import { Button, ImageDropzone, Input, Modal } from '@/shared/components/ui';
import { generateVariantSku } from '@/shared/utils/generateSku';
import type { ProductVariant } from '../types/variant.types';

const variantSchema = z.object({
  sku: z.string().min(1, 'SKU không được để trống').max(50, 'SKU tối đa 50 ký tự'),
  attributes: z.record(z.string(), z.string()),
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
  imageUrl: z.string().optional(),
});

type VariantFormData = z.infer<typeof variantSchema>;

export interface VariantFormSubmitData {
  sku: string;
  attributes?: Record<string, string>;
  price: number;
  salePrice?: number;
  stockQuantity: number;
  imageUrl?: string;
}

export interface VariantFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: VariantFormSubmitData) => Promise<void>;
  variantToEdit?: ProductVariant | null;
  productSlug: string;
  /** Ordered list of attribute labels the product defines for its variants (admin-configurable, e.g. ["Dung Tích"]). */
  attributeNames: string[];
  isLoading?: boolean;
}

const buildDefaultAttributes = (
  attributeNames: string[],
  source?: Record<string, string> | null,
): Record<string, string> =>
  Object.fromEntries(attributeNames.map((name) => [name, source?.[name] ?? '']));

export const VariantFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  variantToEdit,
  productSlug,
  attributeNames,
  isLoading = false,
}: VariantFormModalProps) => {
  const isEditing = Boolean(variantToEdit);
  const [skuSuffix, setSkuSuffix] = useState('');
  const isSkuManuallyEditedRef = useRef(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<VariantFormData>({
    resolver: zodResolver(variantSchema),
    defaultValues: {
      sku: '',
      attributes: buildDefaultAttributes(attributeNames),
      price: '',
      salePrice: '',
      stockQuantity: '0',
      imageUrl: '',
    },
  });

  const attributes = watch('attributes');

  useEffect(() => {
    if (isOpen) {
      isSkuManuallyEditedRef.current = Boolean(variantToEdit);
      if (variantToEdit) {
        reset({
          sku: variantToEdit.sku,
          attributes: buildDefaultAttributes(attributeNames, variantToEdit.attributes),
          price: variantToEdit.price,
          salePrice: variantToEdit.salePrice ?? '',
          stockQuantity: String(variantToEdit.stockQuantity),
          imageUrl: variantToEdit.imageUrl ?? '',
        });
      } else {
        const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
        setSkuSuffix(suffix);
        reset({
          sku: generateVariantSku(productSlug, [], suffix),
          attributes: buildDefaultAttributes(attributeNames),
          price: '',
          salePrice: '',
          stockQuantity: '0',
          imageUrl: '',
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, variantToEdit, productSlug, reset]);

  useEffect(() => {
    if (isOpen && !isEditing && !isSkuManuallyEditedRef.current) {
      setValue(
        'sku',
        generateVariantSku(productSlug, attributeNames.map((name) => attributes?.[name]), skuSuffix),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isEditing, attributes, productSlug, skuSuffix, setValue]);

  const handleRegenerateSku = () => {
    const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
    setSkuSuffix(suffix);
    isSkuManuallyEditedRef.current = false;
    setValue(
      'sku',
      generateVariantSku(productSlug, attributeNames.map((name) => attributes?.[name]), suffix),
    );
  };

  const handleFormSubmit = async (data: VariantFormData) => {
    const cleanedAttributes = Object.fromEntries(
      Object.entries(data.attributes).filter(([, value]) => value.trim() !== ''),
    );
    await onSubmit({
      sku: data.sku,
      attributes: Object.keys(cleanedAttributes).length > 0 ? cleanedAttributes : undefined,
      price: Number(data.price),
      salePrice: data.salePrice ? Number(data.salePrice) : undefined,
      stockQuantity: Number(data.stockQuantity),
      imageUrl: data.imageUrl || undefined,
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
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Input
              label="SKU"
              leftIcon={<Hash className="w-4 h-4" />}
              helperText={
                isEditing
                  ? undefined
                  : 'Tự động sinh theo tên sản phẩm và thuộc tính biến thể — có thể tự sửa'
              }
              error={errors.sku?.message}
              className={isEditing ? undefined : 'font-mono'}
              {...register('sku', {
                onChange: () => {
                  isSkuManuallyEditedRef.current = true;
                },
              })}
            />
          </div>
          {!isEditing && (
            <Button
              type="button"
              variant="outline"
              onClick={handleRegenerateSku}
              title="Sinh lại mã khác"
              className="mb-1.5 shrink-0 px-3"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          )}
        </div>

        {attributeNames.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {attributeNames.map((name) => (
              <Input
                key={name}
                label={name}
                placeholder={name}
                leftIcon={<Tag className="w-4 h-4" />}
                error={errors.attributes?.[name]?.message}
                {...register(`attributes.${name}` as const)}
              />
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-lg px-3 py-2.5">
            Sản phẩm này chưa có thuộc tính biến thể nào. Thêm ở màn "Chỉnh Sửa Sản Phẩm" nếu cần (ví dụ: Dung
            Tích, Nồng Độ Cồn).
          </p>
        )}

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

        <Controller
          name="imageUrl"
          control={control}
          render={({ field }) => (
            <ImageDropzone
              label="Ảnh Biến Thể"
              value={field.value}
              onChange={field.onChange}
              error={errors.imageUrl?.message}
              helperText="Ảnh riêng cho biến thể này (ví dụ: theo màu sắc). Để trống sẽ dùng ảnh chung của sản phẩm."
            />
          )}
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
