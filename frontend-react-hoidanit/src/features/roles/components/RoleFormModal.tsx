import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Shield } from 'lucide-react';
import { Button, Input, Modal } from '@/shared/components/ui';
import type { Role } from '../types/role.types';

const roleSchema = z.object({
  name: z
    .string()
    .min(1, 'Tên vai trò không được để trống')
    .max(50, 'Tên vai trò tối đa 50 ký tự')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Tên vai trò chỉ chứa chữ cái, số, dấu gạch ngang (-) hoặc gạch dưới (_)',
    ),
});

type RoleFormData = z.infer<typeof roleSchema>;

export interface RoleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RoleFormData) => Promise<void>;
  roleToEdit?: Role | null;
  isLoading?: boolean;
}

export const RoleFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  roleToEdit,
  isLoading = false,
}: RoleFormModalProps) => {
  const isEditing = Boolean(roleToEdit);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (roleToEdit) {
        reset({ name: roleToEdit.name });
      } else {
        reset({ name: '' });
      }
    }
  }, [isOpen, roleToEdit, reset]);

  const handleFormSubmit = async (data: RoleFormData) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Chỉnh Sửa Vai Trò' : 'Tạo Vai Trò Mới'}
      description={
        isEditing
          ? `Cập nhật thông tin vai trò #${roleToEdit?.id}`
          : 'Nhập tên vai trò mới để cấp quyền truy cập hệ thống'
      }
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5 mt-2">
        <Input
          label="Tên vai trò (Role Name)"
          placeholder="Ví dụ: admin, manager, editor..."
          leftIcon={<Shield className="w-4 h-4" />}
          error={errors.name?.message}
          helperText="Viết liền, không dấu (ví dụ: admin, moderator, staff)"
          {...register('name')}
        />

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
