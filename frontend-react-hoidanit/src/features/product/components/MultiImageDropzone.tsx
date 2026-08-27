import { useEffect, useRef, useState } from 'react';
import type { DragEvent } from 'react';
import { AlertCircle, Loader2, Upload, X } from 'lucide-react';
import { uploadService } from '@/shared/services/upload.service';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

interface QueueItem {
  id: string;
  file: File;
  previewUrl: string;
  status: 'uploading' | 'done' | 'error';
  url?: string;
  error?: string;
}

export interface MultiImageDropzoneProps {
  onUploadedUrlsChange: (urls: string[]) => void;
  label?: string;
  helperText?: string;
}

export const MultiImageDropzone = ({
  onUploadedUrlsChange,
  label,
  helperText,
}: MultiImageDropzoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [queue, setQueue] = useState<QueueItem[]>([]);

  useEffect(() => {
    onUploadedUrlsChange(
      queue.filter((item) => item.status === 'done' && item.url).map((item) => item.url!),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue]);

  useEffect(() => {
    return () => {
      queue.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const uploadOne = (item: QueueItem) => {
    uploadService
      .uploadImage(item.file)
      .then((url) => {
        setQueue((prev) => prev.map((q) => (q.id === item.id ? { ...q, status: 'done', url } : q)));
      })
      .catch(() => {
        setQueue((prev) =>
          prev.map((q) =>
            q.id === item.id ? { ...q, status: 'error', error: 'Tải ảnh lên thất bại' } : q,
          ),
        );
      });
  };

  const handleFiles = (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    const newItems: QueueItem[] = files.map((file) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      if (!ALLOWED_TYPES.includes(file.type)) {
        return {
          id,
          file,
          previewUrl: '',
          status: 'error',
          error: 'Chỉ chấp nhận JPEG, PNG hoặc WebP',
        };
      }
      if (file.size > MAX_SIZE_BYTES) {
        return { id, file, previewUrl: '', status: 'error', error: 'Kích thước tối đa 5MB' };
      }
      return { id, file, previewUrl: URL.createObjectURL(file), status: 'uploading' };
    });

    setQueue((prev) => [...prev, ...newItems]);
    newItems.filter((item) => item.status === 'uploading').forEach(uploadOne);
  };

  const handleRemove = (id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  };

  const isUploading = queue.some((item) => item.status === 'uploading');

  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed p-6 cursor-pointer transition-colors text-center ${
          isDragging
            ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/30'
            : 'border-slate-300 hover:border-brand-400 dark:border-slate-700 dark:hover:border-brand-500'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ALLOWED_TYPES.join(',')}
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) handleFiles(e.target.files);
            e.target.value = '';
          }}
        />
        <Upload className="w-5 h-5 text-slate-400" />
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Kéo thả nhiều ảnh vào đây hoặc bấm để chọn
        </p>
        <p className="text-xs text-slate-400">JPEG, PNG, WebP — tối đa 5MB mỗi ảnh</p>
      </div>

      {helperText && <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>}

      {queue.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {queue.map((item) => (
            <div
              key={item.id}
              className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800"
            >
              {item.previewUrl ? (
                <img src={item.previewUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-rose-500">
                  <AlertCircle className="w-6 h-6" />
                </div>
              )}

              {item.status === 'uploading' && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                </div>
              )}

              {item.status === 'error' && (
                <div className="absolute inset-0 bg-rose-950/60 flex items-center justify-center p-1">
                  <p className="text-[10px] text-white text-center leading-tight">{item.error}</p>
                </div>
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(item.id);
                }}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
                aria-label="Xóa ảnh"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {isUploading && (
        <p className="text-xs text-slate-500 dark:text-slate-400">Đang tải ảnh lên...</p>
      )}
    </div>
  );
};
