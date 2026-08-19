import { AlertTriangle } from 'lucide-react';
import { Button, Modal } from '@/shared/components/ui';

export interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  itemName: string;
  isLoading?: boolean;
}

export const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  isLoading = false,
}: ConfirmDeleteModalProps) => (
  <Modal isOpen={isOpen} onClose={onClose} size="sm">
    <div className="text-center pt-2">
      <div className="w-12 h-12 bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Xác nhận xóa?</h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Bạn có chắc chắn muốn xóa{' '}
        <span className="font-semibold text-slate-900 dark:text-white">"{itemName}"</span>?
      </p>
      <div className="flex justify-center gap-3 mt-6">
        <Button variant="outline" onClick={onClose} type="button">
          Hủy Bỏ
        </Button>
        <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>
          Xóa
        </Button>
      </div>
    </div>
  </Modal>
);
