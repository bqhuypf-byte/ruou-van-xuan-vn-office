import { useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Phone, MapPin, Sparkles, X } from 'lucide-react';
import { Button, Input, Modal, Select } from '@/shared/components/ui';
import { useDebounce } from '@/shared/hooks/useDebounce';
import {
  vietnamProvinces,
  getDistrictsByProvinceCode,
  getWardsByDistrictCode,
  detectAddressFromText,
  stripDetectedPortion,
  type District,
  type Ward,
  type DetectedAddress,
} from '@/shared/lib/vietnamAddress';
import type { Address } from '../types/address.types';

const addressSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Họ tên không được để trống')
    .max(100, 'Họ tên tối đa 100 ký tự'),
  phone: z
    .string()
    .min(1, 'Số điện thoại không được để trống')
    .regex(/^0\d{9}$/, 'Số điện thoại không hợp lệ'),
  streetAddress: z
    .string()
    .min(1, 'Số nhà, tên đường không được để trống')
    .max(200, 'Tối đa 200 ký tự'),
  provinceCode: z.string().min(1, 'Vui lòng chọn Tỉnh/Thành phố'),
  districtCode: z.string().min(1, 'Vui lòng chọn Quận/Huyện'),
  wardCode: z.string().min(1, 'Vui lòng chọn Phường/Xã'),
  isDefault: z.boolean(),
});

type AddressFormData = z.infer<typeof addressSchema>;
export interface AddressFormSubmitData {
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  isDefault: boolean;
}

export interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddressFormSubmitData) => Promise<void>;
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
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      phone: '',
      streetAddress: '',
      provinceCode: '',
      districtCode: '',
      wardCode: '',
      isDefault: false,
    },
  });

  const provinceCode = watch('provinceCode');
  const districtCode = watch('districtCode');
  const streetAddress = watch('streetAddress');
  const debouncedStreetAddress = useDebounce(streetAddress, 600);

  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [isLoadingWards, setIsLoadingWards] = useState(false);
  const [detected, setDetected] = useState<DetectedAddress | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      reset({
        fullName: addressToEdit?.fullName ?? '',
        phone: addressToEdit?.phone ?? '',
        streetAddress: addressToEdit?.addressLine ?? '',
        provinceCode: '',
        districtCode: '',
        wardCode: '',
        isDefault: addressToEdit?.isDefault ?? false,
      });
      setDistricts([]);
      setWards([]);
      setDetected(null);
    }
  }, [isOpen, addressToEdit, reset]);

  // Auto-detect Tỉnh/Quận/Phường from the free-typed street text, e.g. pasted addresses
  // like "183 HT44 phường Hiệp Thành Quận 12". Only runs while no province is chosen yet,
  // so it never fights a selection the user already made.
  useEffect(() => {
    if (!isOpen || provinceCode) return;
    const text = debouncedStreetAddress.trim();
    if (text.length < 6) {
      setDetected(null);
      return;
    }
    let cancelled = false;
    setIsDetecting(true);
    detectAddressFromText(text)
      .then((result) => {
        if (cancelled) return;
        setDetected(result);
        if (result) {
          setValue('provinceCode', result.province.code);
          setValue('districtCode', result.district.code);
          if (result.ward) setValue('wardCode', result.ward.code);
          setValue('streetAddress', stripDetectedPortion(text, result));
        }
      })
      .finally(() => {
        if (!cancelled) setIsDetecting(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedStreetAddress, provinceCode, isOpen, setValue]);

  useEffect(() => {
    if (!provinceCode) {
      setDistricts([]);
      return;
    }
    setDistricts(getDistrictsByProvinceCode(provinceCode));
  }, [provinceCode]);

  useEffect(() => {
    if (!districtCode) {
      setWards([]);
      return;
    }
    let cancelled = false;
    setIsLoadingWards(true);
    getWardsByDistrictCode(districtCode)
      .then((result) => {
        if (!cancelled) setWards(result);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingWards(false);
      });
    return () => {
      cancelled = true;
    };
  }, [districtCode]);

  const selectedProvinceName = useMemo(
    () => vietnamProvinces.find((p) => p.code === provinceCode)?.name ?? '',
    [provinceCode],
  );

  const handleFormSubmit = async (data: AddressFormData) => {
    const districtName = districts.find((d) => d.code === data.districtCode)?.name ?? '';
    const wardName = wards.find((w) => w.code === data.wardCode)?.name ?? '';

    await onSubmit({
      fullName: data.fullName,
      phone: data.phone,
      addressLine: [data.streetAddress, wardName, districtName].filter(Boolean).join(', '),
      city: selectedProvinceName,
      isDefault: data.isDefault,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Chỉnh Sửa Địa Chỉ' : 'Thêm Địa Chỉ Mới'}
      description={
        isEditing
          ? `Cập nhật địa chỉ #${addressToEdit?.id}. Vui lòng chọn lại Tỉnh/Huyện/Xã.`
          : 'Nhập thông tin địa chỉ giao hàng'
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

        <Controller
          control={control}
          name="phone"
          render={({ field }) => (
            <Input
              label="Số Điện Thoại"
              placeholder="0901234567"
              inputMode="numeric"
              maxLength={10}
              leftIcon={<Phone className="w-4 h-4" />}
              error={errors.phone?.message}
              name={field.name}
              value={field.value}
              onBlur={field.onBlur}
              ref={field.ref}
              onChange={(e) => field.onChange(e.target.value.replace(/\D/g, '').slice(0, 10))}
            />
          )}
        />

        <Input
          label="Số Nhà, Tên Đường"
          placeholder="123 Đường Lê Lợi, Phường ABC, Quận XYZ"
          helperText="Dán cả địa chỉ đầy đủ vào đây — hệ thống sẽ tự nhận diện Tỉnh/Quận/Phường bên dưới."
          leftIcon={<MapPin className="w-4 h-4" />}
          error={errors.streetAddress?.message}
          {...register('streetAddress')}
        />

        {isDetecting && (
          <p className="text-xs text-slate-400 flex items-center gap-1.5 -mt-3">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Đang nhận diện Tỉnh/Quận/Phường...
          </p>
        )}

        {detected && provinceCode === detected.province.code && (
          <div className="flex items-start gap-2.5 rounded-xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 p-3 -mt-3">
            <Sparkles className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
            <p className="text-xs text-brand-800 dark:text-brand-300 flex-1">
              Đã tự động nhận diện:{' '}
              <span className="font-semibold">
                {[detected.ward?.name, detected.district.name, detected.province.name]
                  .filter(Boolean)
                  .join(', ')}
              </span>
              . Kiểm tra lại bên dưới, chọn lại nếu chưa đúng.
            </p>
            <button
              type="button"
              onClick={() => setDetected(null)}
              aria-label="Đóng thông báo"
              className="text-brand-500 hover:text-brand-700 dark:hover:text-brand-200 shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Controller
            control={control}
            name="provinceCode"
            render={({ field }) => (
              <Select
                label="Tỉnh / Thành Phố"
                error={errors.provinceCode?.message}
                value={field.value}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  setValue('districtCode', '');
                  setValue('wardCode', '');
                  setDetected(null);
                }}
              >
                <option value="">Chọn Tỉnh/Thành phố</option>
                {vietnamProvinces.map((province) => (
                  <option key={province.code} value={province.code}>
                    {province.name}
                  </option>
                ))}
              </Select>
            )}
          />

          <Controller
            control={control}
            name="districtCode"
            render={({ field }) => (
              <Select
                label="Quận / Huyện"
                error={errors.districtCode?.message}
                value={field.value}
                disabled={!provinceCode}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  setValue('wardCode', '');
                  setDetected(null);
                }}
              >
                <option value="">Chọn Quận/Huyện</option>
                {districts.map((district) => (
                  <option key={district.code} value={district.code}>
                    {district.name}
                  </option>
                ))}
              </Select>
            )}
          />

          <Controller
            control={control}
            name="wardCode"
            render={({ field }) => (
              <Select
                label="Phường / Xã"
                error={errors.wardCode?.message}
                value={field.value}
                disabled={!districtCode || isLoadingWards}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  setDetected(null);
                }}
              >
                <option value="">{isLoadingWards ? 'Đang tải...' : 'Chọn Phường/Xã'}</option>
                {wards.map((ward) => (
                  <option key={ward.code} value={ward.code}>
                    {ward.name}
                  </option>
                ))}
              </Select>
            )}
          />
        </div>

        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            className="rounded border-slate-300 text-brand-600 focus:ring-brand-500/20 dark:border-slate-700"
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
