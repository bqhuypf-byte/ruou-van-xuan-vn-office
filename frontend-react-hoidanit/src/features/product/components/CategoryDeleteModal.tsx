import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button, Modal } from '@/shared/components/ui';
import type { FlatCategory } from '../hooks/useCategories';

export interface CategoryDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (targetCategoryId?: number) => Promise<void>;
  categoryToDelete?: FlatCategory | null;
  categoryOptions: FlatCategory[];
  needsReassignTarget: boolean;
  isLoading?: boolean;
}

export const CategoryDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  categoryToDelete,
  categoryOptions,
  needsReassignTarget,
  isLoading = false,
}: CategoryDeleteModalProps) => {
  const [targetCategoryId, setTargetCategoryId] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTargetCategoryId('');
    }
  }, [isOpen, categoryToDelete]);

  if (!categoryToDelete) return null;

  const reassignOptions = categoryOptions.filter((c) => c.id !== categoryToDelete.id);

  const handleConfirm = async () => {
    if (needsReassignTarget) {
      if (!targetCategoryId) return;
      await onConfirm(Number(targetCategoryId));
    } else {
      await onConfirm();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center pt-2">
        <div className="w-12 h-12 bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Xác nhận xóa danh mục?
        </h3>

        {!needsReassignTarget ? (
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Bạn có chắc chắn muốn xóa danh mục{' '}
            <span className="font-semibold text-slate-900 dark:text-white">
              "{categoryToDelete.name}"
            </span>{' '}
            (ID: #{categoryToDelete.id})? Danh mục còn danh mục con sẽ không thể xóa.
          </p>
        ) : (
          <div className="mt-2 text-left space-y-3">
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
              Danh mục{' '}
              <span className="font-semibold text-slate-900 dark:text-white">
                "{categoryToDelete.name}"
              </span>{' '}
              vẫn còn sản phẩm bên trong. Chọn danh mục để chuyển các sản phẩm đó sang trước khi xóa:
            </p>
            <select
              value={targetCategoryId}
              onChange={(e) => setTargetCategoryId(e.target.value)}
              className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:border-brand-500 focus:ring-brand-500/20"
            >
              <option value="">-- Chọn danh mục --</option>
              {reassignOptions.map((category) => (
                <option key={category.id} value={category.id}>
                  {'—'.repeat(category.depth)} {category.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex justify-center gap-3 mt-6">
          <Button variant="outline" onClick={onClose} type="button">
            Hủy Bỏ
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
            isLoading={isLoading}
            disabled={needsReassignTarget && !targetCategoryId}
          >
            {needsReassignTarget ? 'Chuyển & Xóa' : 'Xóa Danh Mục'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
