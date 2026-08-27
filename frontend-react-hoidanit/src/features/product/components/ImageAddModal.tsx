import { useEffect, useState } from 'react';
import { Button, Modal } from '@/shared/components/ui';
import { MultiImageDropzone } from './MultiImageDropzone';

export interface ImageAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (imageUrls: string[]) => Promise<void>;
  isLoading?: boolean;
}

export const ImageAddModal = ({ isOpen, onClose, onSubmit, isLoading = false }: ImageAddModalProps) => {
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setUploadedUrls([]);
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (uploadedUrls.length === 0) {
      setError('Vui lòng thêm ít nhất 1 ảnh');
      return;
    }
    setError(null);
    await onSubmit(uploadedUrls);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Thêm Hình Ảnh"
      description="Kéo thả hoặc chọn nhiều ảnh sản phẩm để tải lên cùng lúc"
      size="sm"
    >
      <div className="space-y-5 mt-2">
        <MultiImageDropzone label="Hình Ảnh" onUploadedUrlsChange={setUploadedUrls} />
        {error && <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>}

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" onClick={onClose} type="button">
            Hủy
          </Button>
          <Button type="button" onClick={handleSubmit} isLoading={isLoading}>
            {uploadedUrls.length > 0 ? `Thêm ${uploadedUrls.length} Ảnh` : 'Thêm Ảnh'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
