import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Phone, MapPin, Building2 } from 'lucide-react';
import { Button, Input, Modal } from '@/shared/components/ui';
import type { Address } from '../types/address.types';

const addressSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Họ tên không được để trống')
    .max(100, 'Họ tên tối đa 100 ký tự'),
  phone: z
    .string()
    .min(1, 'Số điện thoại không được để trống')
    .max(20, 'Số điện thoại tối đa 20 ký tự'),
  addressLine: z
    .string()
    .min(1, 'Địa chỉ không được để trống')
    .max(255, 'Địa chỉ tối đa 255 ký tự'),
  city: z.string().min(1, 'Tỉnh/Thành phố không được để trống').max(100, 'Tối đa 100 ký tự'),
  isDefault: z.boolean(),
});

type AddressFormData = z.infer<typeof addressSchema>;
export type AddressFormSubmitData = AddressFormData;

export interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddressFormData) => Promise<void>;
  addressToEdit?: Address | null;
  isLoading?: boolean;
}

export const AddressFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  addressToEdit,
  isLoading = false,
}: AddressFormModalProps) => {
  const isEditing = Boolean(addressToEdit);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: { fullName: '', phone: '', addressLine: '', city: '', isDefault: false },
  });

  useEffect(() => {
    if (isOpen) {
      if (addressToEdit) {
        reset({
          fullName: addressToEdit.fullName,
          phone: addressToEdit.phone,
          addressLine: addressToEdit.addressLine,
          city: addressToEdit.city,
          isDefault: addressToEdit.isDefault,
        });
      } else {
        reset({ fullName: '', phone: '', addressLine: '', city: '', isDefault: false });
      }
    }
  }, [isOpen, addressToEdit, reset]);

  const handleFormSubmit = async (data: AddressFormData) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Chỉnh Sửa Địa Chỉ' : 'Thêm Địa Chỉ Mới'}
      description={
        isEditing ? `Cập nhật địa chỉ #${addressToEdit?.id}` : 'Nhập thông tin địa chỉ giao hàng'
      }
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5 mt-2">
        <Input
          label="Họ Tên Người Nhận"
          placeholder="Nguyễn Văn A"
          leftIcon={<User className="w-4 h-4" />}
          error={errors.fullName?.message}
          {...register('fullName')}
        />

        <Input
          label="Số Điện Thoại"
          placeholder="0901234567"
          leftIcon={<Phone className="w-4 h-4" />}
          error={errors.phone?.message}
          {...register('phone')}
        />

        <Input
          label="Địa Chỉ"
          placeholder="123 Đường ABC, Phường XYZ"
          leftIcon={<MapPin className="w-4 h-4" />}
          error={errors.addressLine?.message}
          {...register('addressLine')}
        />

        <Input
          label="Tỉnh / Thành Phố"
          placeholder="Hồ Chí Minh"
          leftIcon={<Building2 className="w-4 h-4" />}
          error={errors.city?.message}
          {...register('city')}
        />

        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20 dark:border-slate-700"
            {...register('isDefault')}
          />
          Đặt làm địa chỉ mặc định
        </label>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" onClick={onClose} type="button">
            Hủy
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {isEditing ? 'Cập Nhật' : 'Thêm Địa Chỉ'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
