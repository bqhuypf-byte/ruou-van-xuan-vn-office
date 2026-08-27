import { useState } from 'react';
import type { DragEvent } from 'react';
import {
  ArrowDown,
  ArrowUp,
  GripVertical,
  LayoutGrid,
  GalleryHorizontal,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import { Badge, Button } from '@/shared/components/ui';
import { HomepageSectionItemRow } from './HomepageSectionItemRow';
import { HomepageSectionProductPickerModal } from './HomepageSectionProductPickerModal';
import { PositionInput } from './PositionInput';
import type { HomepageSection, UpdateSectionItemInput } from '../types/homepage-section.types';
import {
  useAddSectionItem,
  useRemoveSectionItem,
  useReorderSectionItems,
  useUpdateSectionItem,
} from '../hooks/useAdminHomepageSections';

export interface HomepageSectionCardProps {
  section: HomepageSection;
  position: number;
  totalCount: number;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onChangePosition: (position: number) => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onDragHandleStart?: (e: DragEvent<HTMLButtonElement>) => void;
  onDragHandleEnd?: () => void;
}

export const HomepageSectionCard = ({
  section,
  position,
  totalCount,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  onChangePosition,
  canMoveUp,
  canMoveDown,
  onDragHandleStart,
  onDragHandleEnd,
}: HomepageSectionCardProps) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [itemDragIndex, setItemDragIndex] = useState<number | null>(null);
  const [itemDragOverIndex, setItemDragOverIndex] = useState<number | null>(null);

  const addItemMutation = useAddSectionItem();
  const updateItemMutation = useUpdateSectionItem();
  const removeItemMutation = useRemoveSectionItem();
  const reorderItemsMutation = useReorderSectionItems();

  const items = [...section.items].sort((a, b) => a.sortOrder - b.sortOrder);

  const handlePickProduct = (productId: number) => {
    addItemMutation.mutate(
      { sectionId: section.id, input: { productId } },
      { onSuccess: () => setIsPickerOpen(false) },
    );
  };

  const handleSaveItem = (itemId: number, input: UpdateSectionItemInput) => {
    updateItemMutation.mutate({ sectionId: section.id, itemId, input });
  };

  const handleRemoveItem = (itemId: number) => {
    removeItemMutation.mutate({ sectionId: section.id, itemId });
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const reordered = [...items];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    reorderItemsMutation.mutate({
      sectionId: section.id,
      ids: reordered.map((item) => item.id),
    });
  };

  const moveItemTo = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    const reordered = [...items];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    reorderItemsMutation.mutate({
      sectionId: section.id,
      ids: reordered.map((item) => item.id),
    });
  };

  const handleItemDragStart = (index: number) => () => {
    setItemDragIndex(index);
  };

  const handleItemDragOver = (index: number) => (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (itemDragIndex === null) return;
    if (index !== itemDragOverIndex) setItemDragOverIndex(index);
  };

  const handleItemDrop = (index: number) => (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (itemDragIndex !== null) moveItemTo(itemDragIndex, index);
    setItemDragIndex(null);
    setItemDragOverIndex(null);
  };

  const handleItemDragEnd = () => {
    setItemDragIndex(null);
    setItemDragOverIndex(null);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            draggable
            onDragStart={onDragHandleStart}
            onDragEnd={onDragHandleEnd}
            title="Kéo để sắp xếp"
            className="p-1.5 rounded text-slate-300 hover:text-slate-600 dark:hover:text-slate-300 cursor-grab active:cursor-grabbing shrink-0"
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
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                {section.title}
              </h3>
              {!section.isActive && (
                <Badge variant="default" size="sm">
                  Đã ẩn
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
              {section.displayStyle === 'carousel' ? (
                <GalleryHorizontal className="w-3.5 h-3.5" />
              ) : (
                <LayoutGrid className="w-3.5 h-3.5" />
              )}
              <span>{section.displayStyle === 'carousel' ? 'Cuộn ngang' : 'Lưới'}</span>
              <span>•</span>
              <span>{items.length} sản phẩm</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            size="sm"
            variant="outline"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setIsPickerOpen(true)}
          >
            Thêm sản phẩm
          </Button>
          <button
            type="button"
            onClick={onEdit}
            className="p-2 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-5 space-y-2.5">
        {items.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">
            Chưa có sản phẩm nào trong mục này.
          </p>
        ) : (
          items.map((item, index) => (
            <div
              key={item.id}
              onDragOver={handleItemDragOver(index)}
              onDrop={handleItemDrop(index)}
              className={`rounded-xl transition-shadow ${
                itemDragOverIndex === index && itemDragIndex !== null && itemDragIndex !== index
                  ? 'ring-2 ring-brand-500'
                  : ''
              } ${itemDragIndex === index ? 'opacity-50' : ''}`}
            >
              <HomepageSectionItemRow
                item={item}
                position={index + 1}
                totalCount={items.length}
                onSave={(input) => handleSaveItem(item.id, input)}
                onRemove={() => handleRemoveItem(item.id)}
                onMoveUp={() => moveItem(index, -1)}
                onMoveDown={() => moveItem(index, 1)}
                onChangePosition={(newPosition) => moveItemTo(index, newPosition - 1)}
                canMoveUp={index > 0}
                canMoveDown={index < items.length - 1}
                onDragHandleStart={handleItemDragStart(index)}
                onDragHandleEnd={handleItemDragEnd}
                isSaving={
                  updateItemMutation.isPending &&
                  updateItemMutation.variables?.itemId === item.id
                }
              />
            </div>
          ))
        )}
      </div>

      <HomepageSectionProductPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onPick={handlePickProduct}
        excludeProductIds={items.map((item) => item.productId)}
        isAdding={addItemMutation.isPending}
      />
    </div>
  );
};
