import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, User as UserIcon, Phone, Lock } from 'lucide-react';
import { Button, Input, Modal } from '@/shared/components/ui';
import { useRoles } from '@/features/roles';
import type { User } from '../types/user.types';

const userSchema = z.object({
  email: z
    .string()
    .min(1, 'Email không được để trống')
    .email('Email không hợp lệ'),
  password: z
    .string()
    .max(100, 'Mật khẩu tối đa 100 ký tự')
    .optional()
    .refine((val) => !val || val.length >= 8, {
      message: 'Mật khẩu tối thiểu 8 ký tự',
    }),
  fullName: z
    .string()
    .min(1, 'Họ tên không được để trống')
    .max(100, 'Họ tên tối đa 100 ký tự'),
  phone: z.string().max(20, 'Số điện thoại tối đa 20 ký tự').optional(),
  roleId: z.string().optional(),
  isActive: z.boolean(),
});

type UserFormData = z.infer<typeof userSchema>;

export interface UserFormSubmitData {
  email: string;
  password?: string;
  fullName: string;
  phone?: string;
  roleId?: number;
  isActive: boolean;
}

export interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormSubmitData) => Promise<void>;
  userToEdit?: User | null;
  isLoading?: boolean;
}

export const UserFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  userToEdit,
  isLoading = false,
}: UserFormModalProps) => {
  const isEditing = Boolean(userToEdit);
  const { roles } = useRoles();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: '',
      password: '',
      fullName: '',
      phone: '',
      roleId: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (userToEdit) {
        reset({
          email: userToEdit.email,
          password: '',
          fullName: userToEdit.fullName,
          phone: userToEdit.phone ?? '',
          roleId: userToEdit.roleId ? String(userToEdit.roleId) : '',
          isActive: userToEdit.isActive,
        });
      } else {
        reset({
          email: '',
          password: '',
          fullName: '',
          phone: '',
          roleId: '',
          isActive: true,
        });
      }
    }
  }, [isOpen, userToEdit, reset]);

  const handleFormSubmit = async (data: UserFormData) => {
    if (!isEditing && !data.password) {
      setError('password', { message: 'Mật khẩu không được để trống' });
      return;
    }

    await onSubmit({
      email: data.email,
      password: data.password || undefined,
      fullName: data.fullName,
      phone: data.phone || undefined,
      roleId: data.roleId ? Number(data.roleId) : undefined,
      isActive: data.isActive,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Chỉnh Sửa Người Dùng' : 'Tạo Người Dùng Mới'}
      description={
        isEditing
          ? `Cập nhật thông tin người dùng #${userToEdit?.id}`
          : 'Nhập thông tin để tạo tài khoản người dùng mới'
      }
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5 mt-2">
        <Input
          label="Email"
          placeholder="user@example.com"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label={isEditing ? 'Mật khẩu (để trống nếu không đổi)' : 'Mật khẩu'}
          type="password"
          placeholder="Tối thiểu 8 ký tự"
          leftIcon={<Lock className="w-4 h-4" />}
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          label="Họ Tên"
          placeholder="Nguyễn Văn A"
          leftIcon={<UserIcon className="w-4 h-4" />}
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

        <div className="w-full space-y-1.5">
          <label
            htmlFor="roleId"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Vai Trò
          </label>
          <select
            id="roleId"
            className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:border-brand-500 focus:ring-brand-500/20"
            {...register('roleId')}
          >
            <option value="">-- Chưa gán vai trò --</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            className="rounded border-slate-300 text-brand-600 focus:ring-brand-500/20 dark:border-slate-700"
            {...register('isActive')}
          />
          Kích hoạt tài khoản
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
