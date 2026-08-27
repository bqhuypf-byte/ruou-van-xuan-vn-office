import { useState } from 'react';
import { ArrowDown, ArrowUp, Save } from 'lucide-react';
import { ImageDropzone } from '@/shared/components/ui';
import type { Category } from '../types/category.types';

export interface ShopTopCategoryRowProps {
  category: Category;
  onSaveName: (name: string) => void;
  onThumbnailChange: (url: string) => void;
  onToggleVisible: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  isSavingName?: boolean;
  dashed?: boolean;
}

export const ShopTopCategoryRow = ({
  category,
  onSaveName,
  onThumbnailChange,
  onToggleVisible,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  isSavingName = false,
  dashed = false,
}: ShopTopCategoryRowProps) => {
  const [name, setName] = useState(category.name);
  const isDirty = name.trim() !== '' && name !== category.name;

  const handleSave = () => {
    if (!isDirty) return;
    onSaveName(name.trim());
  };

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-xl border ${
        dashed
          ? 'border-dashed border-slate-200 dark:border-slate-800 opacity-70'
          : 'border-slate-200 dark:border-slate-800'
      }`}
    >
      {onMoveUp && onMoveDown && (
        <div className="flex flex-col gap-0.5 shrink-0">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={100}
        className="w-36 shrink-0 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm font-medium py-1.5 px-2.5 focus:outline-none focus:ring-2 focus:border-brand-500 focus:ring-brand-500/20"
      />

      <button
        type="button"
        onClick={handleSave}
        disabled={!isDirty || isSavingName}
        title="Lưu tên"
        className={`shrink-0 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
          isDirty
            ? 'bg-brand-600 text-white hover:bg-brand-700'
            : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed'
        }`}
      >
        <Save className="w-3.5 h-3.5" />
        {isSavingName ? 'Đang lưu...' : 'Lưu'}
      </button>

      {!dashed && (
        <div className="flex-1 min-w-0 max-w-md">
          <ImageDropzone
            value={category.thumbnailUrl ?? undefined}
            onChange={onThumbnailChange}
          />
        </div>
      )}

      <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 shrink-0 ml-auto">
        <input
          type="checkbox"
          className="rounded"
          checked={category.showInProductSections}
          onChange={onToggleVisible}
        />
        Hiển thị
      </label>
    </div>
  );
};
