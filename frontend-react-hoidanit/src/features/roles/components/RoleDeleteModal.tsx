import { AlertTriangle } from 'lucide-react';
import { Button, Modal } from '@/shared/components/ui';
import type { Role } from '../types/role.types';

export interface RoleDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  roleToDelete?: Role | null;
  isLoading?: boolean;
}

export const RoleDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  roleToDelete,
  isLoading = false,
}: RoleDeleteModalProps) => {
  if (!roleToDelete) return null;

  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center pt-2">
        <div className="w-12 h-12 bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Xác nhận xóa vai trò?
        </h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Bạn có chắc chắn muốn xóa vai trò{' '}
          <span className="font-semibold text-slate-900 dark:text-white">
            "{roleToDelete.name}"
          </span>{' '}
          (ID: #{roleToDelete.id})? Hành động này không thể hoàn tác.
        </p>

        <div className="flex justify-center gap-3 mt-6">
          <Button variant="outline" onClick={onClose} type="button">
            Hủy Bỏ
          </Button>
          <Button variant="danger" onClick={handleConfirm} isLoading={isLoading}>
            Xóa Vai Trò
          </Button>
        </div>
      </div>
    </Modal>
  );
};
