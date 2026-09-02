import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Modal, Select } from '@/shared/components/ui';
import type { Voucher } from '../types/home.types';

const voucherSchema = z
  .object({
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
    minOrderAmount: z
      .string()
      .optional()
      .refine((value) => !value || Number(value) >= 0, 'Không được nhỏ hơn 0'),
    maxDiscountAmount: z
      .string()
      .optional()
      .refine((value) => !value || Number(value) >= 0, 'Không được nhỏ hơn 0'),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    sortOrder: z
      .string()
      .optional()
      .refine(
        (value) => !value || (Number.isInteger(Number(value)) && Number(value) >= 0),
        'Phải là số nguyên từ 0 trở lên',
      ),
    isActive: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.discountType === 'percent' && Number(data.discountValue) > 100) {
      ctx.addIssue({
        code: 'custom',
        path: ['discountValue'],
        message: 'Phần trăm giảm không được vượt quá 100%',
      });
    }
    if (data.startDate && data.endDate && data.endDate < data.startDate) {
      ctx.addIssue({
        code: 'custom',
        path: ['endDate'],
        message: 'Ngày kết thúc phải sau ngày bắt đầu',
      });
    }
  });

type VoucherFormData = z.infer<typeof voucherSchema>;

export interface VoucherFormSubmitData {
  code: string;
  title: string;
  description?: string | null;
  discountType: 'percent' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  sortOrder?: number;
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
  sortOrder: '0',
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
    setValue,
    control,
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
          sortOrder: String(voucherToEdit.sortOrder),
          isActive: voucherToEdit.isActive,
        });
      } else {
        reset(emptyValues);
      }
    }
  }, [isOpen, voucherToEdit, reset]);

  const discountType = useWatch({ control, name: 'discountType' });

  const handleFormSubmit = async (data: VoucherFormData) => {
    try {
      await onSubmit({
        code: data.code,
        title: data.title,
        description: data.description || (isEditing ? null : undefined),
        discountType: data.discountType,
        discountValue: Number(data.discountValue),
        minOrderAmount: data.minOrderAmount ? Number(data.minOrderAmount) : undefined,
        maxDiscountAmount:
          data.discountType === 'percent' && data.maxDiscountAmount
            ? Number(data.maxDiscountAmount)
            : isEditing
              ? null
              : undefined,
        startDate: data.startDate || (isEditing ? null : undefined),
        endDate: data.endDate || (isEditing ? null : undefined),
        sortOrder: data.sortOrder ? Number(data.sortOrder) : 0,
        isActive: data.isActive,
      });
      onClose();
    } catch {
      // The page displays the API error and keeps this form open for correction.
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Chỉnh Sửa Voucher' : 'Thêm Voucher Mới'}
      description="Cấu hình điều kiện và cách ưu đãi được tự động xét trong giỏ hàng"
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
            onChange={(event) =>
              setValue('code', event.target.value.toUpperCase(), {
                shouldValidate: true,
              })
            }
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
            helperText={
              discountType === 'percent'
                ? 'Giới hạn số tiền giảm của voucher phần trăm'
                : 'Không áp dụng cho giảm số tiền cố định'
            }
            disabled={discountType === 'fixed'}
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
          <Input
            label="Kết thúc"
            type="date"
            error={errors.endDate?.message}
            {...register('endDate')}
          />
        </div>

        <Input
          label="Thứ tự hiển thị"
          type="number"
          min={0}
          step={1}
          helperText="Số nhỏ xuất hiện trước trong danh sách ưu đãi; khi mức giảm bằng nhau, số nhỏ được ưu tiên."
          error={errors.sortOrder?.message}
          {...register('sortOrder')}
        />

        <div className="rounded-xl border border-brand-200 bg-brand-50/70 p-3 text-xs leading-5 text-brand-900 dark:border-brand-900/60 dark:bg-brand-950/30 dark:text-brand-300">
          Khi bật, voucher được hiển thị công khai. Giỏ hàng sẽ tự động áp voucher hợp lệ giúp khách
          tiết kiệm nhiều nhất; khách vẫn có thể nhập mã khác để thay thế.
        </div>

        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            className="rounded border-slate-300 text-brand-600 focus:ring-brand-500/20 dark:border-slate-700"
            {...register('isActive')}
          />
          Kích hoạt, hiển thị công khai và cho phép tự động áp dụng
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
