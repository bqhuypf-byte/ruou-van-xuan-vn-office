import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Modal, Select } from '@/shared/components/ui';
import type { Voucher } from '../types/home.types';

const voucherSchema = z.object({
  code: z
    .string()
    .min(1, 'Bắt buộc')
    .max(50, 'Tối đa 50 ký tự')
    .regex(/^[A-Z0-9]+$/, 'Chỉ chữ in hoa và số (vd: SALE10)'),
  title: z.string().min(1, 'Bắt buộc').max(255, 'Tối đa 255 ký tự'),
  description: z.string().max(2000, 'Tối đa 2000 ký tự').optional(),
  discountType: z.enum(['percent', 'fixed']),
  discountValue: z
    .string()
    .min(1, 'Bắt buộc')
    .refine((val) => Number(val) > 0, 'Phải lớn hơn 0'),
  minOrderAmount: z.string().optional(),
  maxDiscountAmount: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isActive: z.boolean(),
}).superRefine((data, ctx) => {
  if (data.discountType === 'percent' && Number(data.discountValue) > 100) {
    ctx.addIssue({
      code: 'custom',
      path: ['discountValue'],
      message: 'Phần trăm giảm không được vượt quá 100%',
    });
  }
});

type VoucherFormData = z.infer<typeof voucherSchema>;

export interface VoucherFormSubmitData {
  code: string;
  title: string;
  description?: string;
  discountType: 'percent' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
}

export interface VoucherFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: VoucherFormSubmitData) => Promise<void>;
  voucherToEdit?: Voucher | null;
  isLoading?: boolean;
}

const emptyValues: VoucherFormData = {
  code: '',
  title: '',
  description: '',
  discountType: 'percent',
  discountValue: '',
  minOrderAmount: '0',
  maxDiscountAmount: '',
  startDate: '',
  endDate: '',
  isActive: true,
};

export const VoucherFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  voucherToEdit,
  isLoading = false,
}: VoucherFormModalProps) => {
  const isEditing = Boolean(voucherToEdit);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VoucherFormData>({
    resolver: zodResolver(voucherSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (isOpen) {
      if (voucherToEdit) {
        reset({
          code: voucherToEdit.code,
          title: voucherToEdit.title,
          description: voucherToEdit.description ?? '',
          discountType: voucherToEdit.discountType,
          discountValue: String(Number(voucherToEdit.discountValue)),
          minOrderAmount: String(Number(voucherToEdit.minOrderAmount)),
          maxDiscountAmount: voucherToEdit.maxDiscountAmount
            ? String(Number(voucherToEdit.maxDiscountAmount))
            : '',
          startDate: voucherToEdit.startDate ?? '',
          endDate: voucherToEdit.endDate ?? '',
          isActive: voucherToEdit.isActive,
        });
      } else {
        reset(emptyValues);
      }
    }
  }, [isOpen, voucherToEdit, reset]);

  const handleFormSubmit = async (data: VoucherFormData) => {
    await onSubmit({
      code: data.code,
      title: data.title,
      description: data.description || undefined,
      discountType: data.discountType,
      discountValue: Number(data.discountValue),
      minOrderAmount: data.minOrderAmount ? Number(data.minOrderAmount) : undefined,
      maxDiscountAmount: data.maxDiscountAmount ? Number(data.maxDiscountAmount) : undefined,
      startDate: data.startDate || undefined,
      endDate: data.endDate || undefined,
      isActive: data.isActive,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Chỉnh Sửa Voucher' : 'Thêm Voucher Mới'}
      description="Hiển thị trong popup 'Tất Cả Ưu Đãi' ở đầu trang cho khách hàng"
      size="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5 mt-2">
        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Mã voucher"
            placeholder="SALE10"
            disabled={isEditing}
            error={errors.code?.message}
            {...register('code')}
          />
          <Input
            label="Tiêu đề"
            placeholder="Giảm 10% cho đơn hàng đầu tiên"
            error={errors.title?.message}
            {...register('title')}
          />
        </div>

        <div className="w-full space-y-1.5">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Mô tả (tùy chọn)
          </label>
          <textarea
            id="description"
            rows={2}
            placeholder="Điều kiện áp dụng chi tiết..."
            className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:border-brand-500 focus:ring-brand-500/20"
            {...register('description')}
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <Select label="Loại giảm giá" {...register('discountType')}>
            <option value="percent">Phần trăm (%)</option>
            <option value="fixed">Số tiền cố định (VNĐ)</option>
          </Select>
          <Input
            label="Giá trị giảm"
            type="number"
            min={0}
            step={1}
            placeholder="10"
            error={errors.discountValue?.message}
            {...register('discountValue')}
          />
          <Input
            label="Giảm tối đa (VNĐ)"
            type="number"
            min={0}
            step={1000}
            placeholder="Để trống nếu không giới hạn"
            helperText="Chỉ áp dụng cho loại %"
            error={errors.maxDiscountAmount?.message}
            {...register('maxDiscountAmount')}
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <Input
            label="Đơn tối thiểu (VNĐ)"
            type="number"
            min={0}
            step={10000}
            placeholder="0"
            error={errors.minOrderAmount?.message}
            {...register('minOrderAmount')}
          />
          <Input label="Bắt đầu" type="date" {...register('startDate')} />
          <Input label="Kết thúc" type="date" {...register('endDate')} />
        </div>

        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            className="rounded border-slate-300 text-brand-600 focus:ring-brand-500/20 dark:border-slate-700"
            {...register('isActive')}
          />
          Hiển thị voucher này cho khách hàng
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
