import { useEffect, useRef, useState, type DragEvent } from 'react';
import { GripVertical, ImageOff, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import type { ProductImage } from '../types/image.types';

export interface ImageGalleryProps {
  images: ProductImage[];
  isLoading: boolean;
  onDelete: (image: ProductImage) => void;
  onReorder: (imageIds: number[]) => Promise<void>;
  deletingId?: number | null;
  isReordering?: boolean;
}

const sortImages = (images: ProductImage[]) =>
  images.slice().sort((a, b) => a.sortOrder - b.sortOrder);

export const ImageGallery = ({
  images,
  isLoading,
  onDelete,
  onReorder,
  deletingId,
  isReordering = false,
}: ImageGalleryProps) => {
  const [orderedImages, setOrderedImages] = useState(() => sortImages(images));
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const orderedImagesRef = useRef(orderedImages);
  const initialOrderRef = useRef<ProductImage[]>([]);

  const replaceOrder = (nextImages: ProductImage[]) => {
    orderedImagesRef.current = nextImages;
    setOrderedImages(nextImages);
  };

  useEffect(() => {
    const nextImages = sortImages(images);
    orderedImagesRef.current = nextImages;
    setOrderedImages(nextImages);
  }, [images]);

  const handleDragStart = (event: DragEvent<HTMLDivElement>, imageId: number) => {
    initialOrderRef.current = orderedImagesRef.current;
    setDraggingId(imageId);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', String(imageId));
  };

  const handleDragEnter = (targetId: number) => {
    if (draggingId === null || draggingId === targetId || isReordering) return;

    const currentImages = orderedImagesRef.current;
    const fromIndex = currentImages.findIndex((image) => image.id === draggingId);
    const toIndex = currentImages.findIndex((image) => image.id === targetId);
    if (fromIndex < 0 || toIndex < 0) return;

    const nextImages = currentImages.slice();
    const [movedImage] = nextImages.splice(fromIndex, 1);
    nextImages.splice(toIndex, 0, movedImage);
    replaceOrder(nextImages);
  };

  const handleDragEnd = async () => {
    const previousImages = initialOrderRef.current;
    const nextImages = orderedImagesRef.current;
    setDraggingId(null);

    if (
      previousImages.length === nextImages.length &&
      previousImages.every((image, index) => image.id === nextImages[index]?.id)
    ) {
      return;
    }

    try {
      await onReorder(nextImages.map((image) => image.id));
    } catch {
      replaceOrder(previousImages);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="aspect-square rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
        ))}
      </div>
    );
  }

  if (orderedImages.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-10 text-center shadow-sm">
        <div className="w-14 h-14 bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
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
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <p>Kéo và thả ảnh để thay đổi vị trí hiển thị.</p>
        {isReordering && (
          <span className="inline-flex shrink-0 items-center gap-1.5 text-brand-600 dark:text-brand-400">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Đang lưu thứ tự...
          </span>
        )}
      </div>

      <div role="list" className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {orderedImages.map((image, index) => (
          <div
            key={image.id}
            role="listitem"
            aria-label={`Ảnh sản phẩm vị trí ${index + 1}`}
            draggable={!isReordering && deletingId == null}
            onDragStart={(event) => handleDragStart(event, image.id)}
            onDragEnter={() => handleDragEnter(image.id)}
            onDragOver={(event) => event.preventDefault()}
            onDragEnd={handleDragEnd}
            className={`relative group aspect-square rounded-xl overflow-hidden border bg-slate-100 transition dark:bg-slate-800 ${
              draggingId === image.id
                ? 'scale-[0.98] border-brand-500 opacity-60 shadow-inner'
                : 'border-slate-200 dark:border-slate-800'
            } ${isReordering ? 'cursor-wait' : 'cursor-grab active:cursor-grabbing'}`}
          >
            <img
              src={image.imageUrl}
              alt={`Hình ảnh sản phẩm #${image.id}`}
              className="w-full h-full object-cover"
              draggable={false}
            />
            <div className="absolute left-2 top-2 flex items-center gap-1 rounded-lg bg-slate-950/70 px-2 py-1 text-xs font-medium text-white shadow-sm">
              <GripVertical className="h-3.5 w-3.5" />
              {index + 1}
            </div>
            <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/50 transition-colors flex items-center justify-center">
              <Button
                variant="danger"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onDelete(image)}
                isLoading={deletingId === image.id}
                disabled={isReordering}
                leftIcon={<Trash2 className="w-4 h-4" />}
              >
                Xóa
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
