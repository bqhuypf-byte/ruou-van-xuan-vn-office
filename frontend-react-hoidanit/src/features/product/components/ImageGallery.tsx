import { ImageOff, Trash2 } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import type { ProductImage } from '../types/image.types';

export interface ImageGalleryProps {
  images: ProductImage[];
  isLoading: boolean;
  onDelete: (image: ProductImage) => void;
  deletingId?: number | null;
}

export const ImageGallery = ({ images, isLoading, onDelete, deletingId }: ImageGalleryProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="aspect-square rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-10 text-center shadow-sm">
        <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <ImageOff className="w-7 h-7" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Chưa có hình ảnh nào</h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Thêm hình ảnh cho sản phẩm này để hiển thị cho khách hàng.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {images
        .slice()
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((image) => (
          <div
            key={image.id}
            className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800"
          >
            <img
              src={image.imageUrl}
              alt={`Hình ảnh sản phẩm #${image.id}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/50 transition-colors flex items-center justify-center">
              <Button
                variant="danger"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onDelete(image)}
                isLoading={deletingId === image.id}
                leftIcon={<Trash2 className="w-4 h-4" />}
              >
                Xóa
              </Button>
            </div>
          </div>
        ))}
    </div>
  );
};
