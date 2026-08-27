import { useRef, useState } from 'react';
import type { DragEvent } from 'react';
import { ImageOff, Loader2, Upload, X } from 'lucide-react';
import { uploadService } from '@/shared/services/upload.service';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export interface ImageDropzoneProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  error?: string;
  helperText?: string;
}

export const ImageDropzone = ({
  label,
  value,
  onChange,
  error,
  helperText,
}: ImageDropzoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setUploadError(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadError('Chỉ chấp nhận file ảnh JPEG, PNG hoặc WebP');
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setUploadError('Kích thước ảnh tối đa 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const url = await uploadService.uploadImage(file);
      onChange(url);
    } catch {
      setUploadError('Tải ảnh lên thất bại, vui lòng thử lại');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const combinedError = error ?? uploadError ?? undefined;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}

      <div
        onClick={() => !isUploading && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative flex items-center gap-4 rounded-lg border-2 border-dashed p-4 cursor-pointer transition-colors ${
          isDragging
            ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/30'
            : combinedError
              ? 'border-rose-300 dark:border-rose-800'
              : 'border-slate-300 hover:border-brand-400 dark:border-slate-700 dark:hover:border-brand-500'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_TYPES.join(',')}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = '';
          }}
        />

        <div className="w-16 h-16 shrink-0 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center text-slate-400">
          {isUploading ? (
            <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
          ) : value ? (
            <img src={value} alt="" className="w-full h-full object-cover" />
          ) : (
            <ImageOff className="w-6 h-6" />
          )}
        </div>

        <div className="flex-1 text-sm">
          {isUploading ? (
            <p className="text-slate-500 dark:text-slate-400">Đang tải ảnh lên...</p>
          ) : (
            <>
              <p className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Upload className="w-4 h-4" />
                Kéo thả ảnh vào đây hoặc bấm để chọn
              </p>
              <p className="text-xs text-slate-400 mt-0.5">JPEG, PNG, WebP — tối đa 5MB</p>
            </>
          )}
        </div>

        {value && !isUploading && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange('');
            }}
            className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-slate-800"
            aria-label="Xóa ảnh"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {combinedError ? (
        <p className="text-xs text-rose-600 dark:text-rose-400">{combinedError}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
};
