import { useState } from 'react';
import type { DragEvent } from 'react';
import { ArrowDown, ArrowUp, GripVertical, Save, Trash2 } from 'lucide-react';
import { formatPrice } from '@/shared/utils/formatPrice';
import { PositionInput } from './PositionInput';
import type { HomepageSectionItem, UpdateSectionItemInput } from '../types/homepage-section.types';

export interface HomepageSectionItemRowProps {
  item: HomepageSectionItem;
  position: number;
  totalCount: number;
  onSave: (input: UpdateSectionItemInput) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onChangePosition: (position: number) => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onDragHandleStart?: (e: DragEvent<HTMLButtonElement>) => void;
  onDragHandleEnd?: () => void;
  isSaving?: boolean;
}

const toInputValue = (value: number | null): string => (value === null ? '' : String(value));

export const HomepageSectionItemRow = ({
  item,
  position,
  totalCount,
  onSave,
  onRemove,
  onMoveUp,
  onMoveDown,
  onChangePosition,
  canMoveUp,
  canMoveDown,
  onDragHandleStart,
  onDragHandleEnd,
  isSaving = false,
}: HomepageSectionItemRowProps) => {
  const [overridePrice, setOverridePrice] = useState(toInputValue(item.overridePrice));
  const [overrideOriginalPrice, setOverrideOriginalPrice] = useState(
    toInputValue(item.overrideOriginalPrice),
  );
  const [badgeText, setBadgeText] = useState(item.badgeText ?? '');

  const isDirty =
    overridePrice !== toInputValue(item.overridePrice) ||
    overrideOriginalPrice !== toInputValue(item.overrideOriginalPrice) ||
    badgeText !== (item.badgeText ?? '');

  const handleSave = () => {
    const parsedPrice = overridePrice.trim() === '' ? null : Number(overridePrice);
    const parsedOriginalPrice =
      overrideOriginalPrice.trim() === '' ? null : Number(overrideOriginalPrice);
    const trimmedBadge = badgeText.trim();

    const input: UpdateSectionItemInput = {
      overridePrice: parsedPrice !== null && Number.isNaN(parsedPrice) ? null : parsedPrice,
      overrideOriginalPrice:
        parsedOriginalPrice !== null && Number.isNaN(parsedOriginalPrice)
          ? null
          : parsedOriginalPrice,
      badgeText: trimmedBadge === '' ? null : trimmedBadge,
    };
    onSave(input);
  };

  const product = item.product;

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
      <button
        type="button"
        draggable
        onDragStart={onDragHandleStart}
        onDragEnd={onDragHandleEnd}
        title="Kéo để sắp xếp"
        className="p-1 rounded text-slate-300 hover:text-slate-600 dark:hover:text-slate-300 cursor-grab active:cursor-grabbing shrink-0"
      >
        <GripVertical className="w-4 h-4" />
      </button>
      <PositionInput position={position} totalCount={totalCount} onChangePosition={onChangePosition} />
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

      <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
        {product?.thumbnailUrl && (
          <img src={product.thumbnailUrl} alt={product.name} className="w-full h-full object-cover" />
        )}
      </div>

      <div className="min-w-0 w-44 shrink-0">
        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
          {product?.name ?? `#${item.productId}`}
        </p>
        <p className="text-xs text-slate-400">
          Giá gốc:{' '}
          {product?.price != null ? formatPrice(product.salePrice ?? product.price) : '—'}
        </p>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-2">
        <input
          type="number"
          placeholder="Giá bán (ghi đè)"
          value={overridePrice}
          onChange={(e) => setOverridePrice(e.target.value)}
          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm py-1.5 px-2.5 focus:outline-none focus:ring-2 focus:border-brand-500 focus:ring-brand-500/20"
        />
        <input
          type="number"
          placeholder="Giá gạch (ghi đè)"
          value={overrideOriginalPrice}
          onChange={(e) => setOverrideOriginalPrice(e.target.value)}
          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm py-1.5 px-2.5 focus:outline-none focus:ring-2 focus:border-brand-500 focus:ring-brand-500/20"
        />
        <input
          type="text"
          placeholder="Nhãn (VD: HOT, -20%)"
          value={badgeText}
          onChange={(e) => setBadgeText(e.target.value)}
          maxLength={50}
          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm py-1.5 px-2.5 focus:outline-none focus:ring-2 focus:border-brand-500 focus:ring-brand-500/20"
        />
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={!isDirty || isSaving}
        title="Lưu thay đổi"
        className={`shrink-0 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
          isDirty
            ? 'bg-brand-600 text-white hover:bg-brand-700'
            : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed'
        }`}
      >
        <Save className="w-3.5 h-3.5" />
        {isSaving ? 'Đang lưu...' : 'Lưu'}
      </button>

      <button
        type="button"
        onClick={onRemove}
        className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 shrink-0"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};
