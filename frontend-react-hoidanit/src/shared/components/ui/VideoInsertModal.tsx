import { useRef, useState } from 'react';
import type { DragEvent } from 'react';
import { Link2, Upload, Loader2, Video as VideoIcon } from 'lucide-react';
import { Button } from './Button';
import { Modal } from './Modal';
import { uploadService } from '@/shared/services/upload.service';

const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

export interface VideoInsertResult {
  src: string;
  provider: 'iframe' | 'file';
}

export interface VideoInsertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (result: VideoInsertResult) => void;
}

const parseVideoLink = (rawUrl: string): VideoInsertResult | null => {
  const url = rawUrl.trim();
  if (!url) return null;

  const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/);
  if (youtubeMatch) return { src: `https://www.youtube.com/embed/${youtubeMatch[1]}`, provider: 'iframe' };

  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return { src: `https://player.vimeo.com/video/${vimeoMatch[1]}`, provider: 'iframe' };

  if (/^https?:\/\/.+\.(mp4|webm|ogg)(\?.*)?$/i.test(url)) return { src: url, provider: 'file' };

  return null;
};

export const VideoInsertModal = ({ isOpen, onClose, onInsert }: VideoInsertModalProps) => {
  const [mode, setMode] = useState<'link' | 'upload'>('link');
  const [linkValue, setLinkValue] = useState('');
  const [uploadedPreviewUrl, setUploadedPreviewUrl] = useState<string | null>(null);
  const [uploadedHostedUrl, setUploadedHostedUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const linkResult = parseVideoLink(linkValue);

  const resetState = () => {
    setMode('link');
    setLinkValue('');
    setUploadedPreviewUrl(null);
    setUploadedHostedUrl(null);
    setIsUploading(false);
    setIsDragging(false);
    setError(null);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleFile = async (file: File) => {
    setError(null);
    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
      setError('Chỉ chấp nhận file video MP4, WebM hoặc OGG');
      return;
    }
    if (file.size > MAX_VIDEO_SIZE) {
      setError('Kích thước video tối đa 50MB');
      return;
    }

    setUploadedPreviewUrl(URL.createObjectURL(file));
    setUploadedHostedUrl(null);
    setIsUploading(true);
    try {
      const hostedUrl = await uploadService.uploadVideo(file);
      setUploadedHostedUrl(hostedUrl);
    } catch {
      setError('Tải video lên thất bại, vui lòng thử lại');
      setUploadedPreviewUrl(null);
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

  const handleInsert = () => {
    if (mode === 'link' && linkResult) {
      onInsert(linkResult);
      handleClose();
    } else if (mode === 'upload' && uploadedHostedUrl) {
      onInsert({ src: uploadedHostedUrl, provider: 'file' });
      handleClose();
    }
  };

  const canInsert = mode === 'link' ? Boolean(linkResult) : Boolean(uploadedHostedUrl) && !isUploading;

  const tabClass = (active: boolean) =>
    `flex-1 flex items-center justify-center gap-1.5 rounded-md py-1.5 text-sm font-medium transition-colors ${
      active
        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
    }`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Chèn Video"
      description="Dán link YouTube/Vimeo/MP4 hoặc kéo thả file video từ máy tính"
    >
      <div className="space-y-4 mt-2">
        <div className="flex gap-1 rounded-lg bg-slate-100 dark:bg-slate-800 p-1">
          <button type="button" onClick={() => setMode('link')} className={tabClass(mode === 'link')}>
            <Link2 className="w-4 h-4" />
            Dán Link
          </button>
          <button type="button" onClick={() => setMode('upload')} className={tabClass(mode === 'upload')}>
            <Upload className="w-4 h-4" />
            Kéo Thả / Tải Lên
          </button>
        </div>

        {mode === 'link' ? (
          <div className="space-y-1.5">
            <input
              type="text"
              autoFocus
              value={linkValue}
              onChange={(e) => setLinkValue(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=... hoặc link .mp4"
              className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:border-brand-500 focus:ring-brand-500/20"
            />
            {linkValue.trim() && !linkResult && (
              <p className="text-xs text-rose-600 dark:text-rose-400">
                Link không hợp lệ. Hỗ trợ YouTube, Vimeo, hoặc link file .mp4/.webm/.ogg
              </p>
            )}
          </div>
        ) : (
          <div
            onClick={() => !isUploading && inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 cursor-pointer transition-colors text-center ${
              isDragging
                ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/30'
                : 'border-slate-300 hover:border-brand-400 dark:border-slate-700 dark:hover:border-brand-500'
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept={ALLOWED_VIDEO_TYPES.join(',')}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
                e.target.value = '';
              }}
            />
            <VideoIcon className="w-6 h-6 text-slate-400" />
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Kéo thả video vào đây hoặc bấm để chọn
            </p>
            <p className="text-xs text-slate-400">MP4, WebM, OGG — tối đa 50MB</p>
          </div>
        )}

        {error && <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>}

        {((mode === 'link' && linkResult) || (mode === 'upload' && uploadedPreviewUrl)) && (
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Xem trước</p>
            <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-black">
              {mode === 'link' && linkResult && (
                <iframe
                  src={linkResult.src}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  frameBorder={0}
                  referrerPolicy="strict-origin-when-cross-origin"
                  title="Xem trước video"
                />
              )}
              {mode === 'upload' && uploadedPreviewUrl && (
                <video src={uploadedPreviewUrl} controls className="w-full h-full" />
              )}
              {mode === 'upload' && isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Loader2 className="w-6 h-6 animate-spin text-white" />
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" type="button" onClick={handleClose}>
            Hủy
          </Button>
          <Button type="button" onClick={handleInsert} disabled={!canInsert} isLoading={mode === 'upload' && isUploading}>
            Chèn Video
          </Button>
        </div>
      </div>
    </Modal>
  );
};
