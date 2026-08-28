import { AlertTriangle } from 'lucide-react';
import { Button, Modal } from '@/shared/components/ui';
import type { FlatCategory } from '../hooks/useCategories';

export interface CategoryBulkDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  categoriesToDelete: FlatCategory[];
  isLoading?: boolean;
}

export const CategoryBulkDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  categoriesToDelete,
  isLoading = false,
}: CategoryBulkDeleteModalProps) => {
  if (categoriesToDelete.length === 0) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center pt-2">
        <div className="w-12 h-12 bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Xóa {categoriesToDelete.length} danh mục đã chọn?
        </h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Danh mục con sẽ được xóa trước danh mục cha. Danh mục còn sản phẩm hoặc còn danh mục con
          chưa chọn sẽ bị bỏ qua, bạn sẽ được báo lại danh mục nào xóa được.
        </p>
        <ul className="mt-4 max-h-40 overflow-y-auto text-left text-sm bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 space-y-1">
          {categoriesToDelete.map((c) => (
            <li key={c.id} className="text-slate-700 dark:text-slate-300">
              {'—'.repeat(c.depth)} {c.name}
            </li>
          ))}
        </ul>

        <div className="flex justify-center gap-3 mt-6">
          <Button variant="outline" onClick={onClose} type="button">
            Hủy Bỏ
          </Button>
          <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>
            Xóa {categoriesToDelete.length} Danh Mục
          </Button>
        </div>
      </div>
    </Modal>
  );
};
