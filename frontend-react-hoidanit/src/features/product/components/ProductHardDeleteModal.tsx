import { AlertTriangle } from 'lucide-react';
import { Button, Modal } from '@/shared/components/ui';
import type { Product } from '../types/product.types';

export interface ProductHardDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  productToDelete?: Product | null;
  isLoading?: boolean;
}

export const ProductHardDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  productToDelete,
  isLoading = false,
}: ProductHardDeleteModalProps) => {
  if (!productToDelete) return null;

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
          Xóa vĩnh viễn sản phẩm?
        </h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Bạn có chắc chắn muốn xóa vĩnh viễn sản phẩm{' '}
          <span className="font-semibold text-slate-900 dark:text-white">
            "{productToDelete.name}"
          </span>{' '}
          (ID: #{productToDelete.id})? Toàn bộ biến thể và hình ảnh của sản phẩm sẽ bị xóa khỏi hệ
          thống. Hành động này{' '}
          <span className="font-semibold text-rose-600 dark:text-rose-400">
            không thể hoàn tác
          </span>
          .
        </p>

        <div className="flex justify-center gap-3 mt-6">
          <Button variant="outline" onClick={onClose} type="button">
            Hủy Bỏ
          </Button>
          <Button variant="danger" onClick={handleConfirm} isLoading={isLoading}>
            Xóa Vĩnh Viễn
          </Button>
        </div>
      </div>
    </Modal>
  );
};
