import { useState } from 'react';
import { Layers, Save } from 'lucide-react';
import { useSiteSettings, useUpdateSiteSettings } from '@/features/home';
import { useCategories } from '../hooks/useCategories';
import { useUpdateCategory } from '../hooks/useCategoryMutations';
import { ShopTopCategoryRow } from './ShopTopCategoryRow';
import type { Category } from '../types/category.types';

export const ShopTopCategoriesCard = () => {
  const { tree } = useCategories();
  const updateMutation = useUpdateCategory();
  const { data: settings } = useSiteSettings();
  const updateSettingsMutation = useUpdateSiteSettings();

  const [draftTitle, setDraftTitle] = useState<string | null>(null);
  const title = draftTitle ?? settings?.topCategoriesSectionTitle ?? '';
  const isTitleDirty =
    draftTitle !== null &&
    draftTitle.trim() !== '' &&
    draftTitle !== settings?.topCategoriesSectionTitle;

  const handleSaveTitle = () => {
    if (!isTitleDirty || draftTitle === null) return;
    updateSettingsMutation.mutate(
      { topCategoriesSectionTitle: draftTitle.trim() },
      { onSuccess: () => setDraftTitle(null) },
    );
  };

  const rootCategories = [...tree].sort((a, b) => a.homeSortOrder - b.homeSortOrder);
  const visible = rootCategories.filter((c) => c.showInProductSections);
  const hidden = rootCategories.filter((c) => !c.showInProductSections);

  const toggleVisible = (category: Category) => {
    updateMutation.mutate({
      id: category.id,
      input: { showInProductSections: !category.showInProductSections },
    });
  };

  const updateThumbnail = (category: Category, thumbnailUrl: string) => {
    updateMutation.mutate({ id: category.id, input: { thumbnailUrl } });
  };

  const updateName = (category: Category, name: string) => {
    updateMutation.mutate({ id: category.id, input: { name } });
  };

  const moveVisible = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= visible.length) return;
    const a = visible[index];
    const b = visible[targetIndex];
    updateMutation.mutate({ id: a.id, input: { homeSortOrder: b.homeSortOrder } });
    updateMutation.mutate({ id: b.id, input: { homeSortOrder: a.homeSortOrder } });
  };

  const isSavingName = (categoryId: number) =>
    updateMutation.isPending &&
    updateMutation.variables?.id === categoryId &&
    updateMutation.variables?.input.name !== undefined;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-brand-600 shrink-0" />
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 shrink-0">
            Tiêu đề khối
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setDraftTitle(e.target.value)}
            maxLength={100}
            placeholder="Shop Top Categories"
            className="flex-1 min-w-0 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm font-semibold py-1.5 px-2.5 focus:outline-none focus:ring-2 focus:border-brand-500 focus:ring-brand-500/20"
          />
          <button
            type="button"
            onClick={handleSaveTitle}
            disabled={!isTitleDirty || updateSettingsMutation.isPending}
            title="Lưu tiêu đề"
            className={`shrink-0 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              isTitleDirty
                ? 'bg-brand-600 text-white hover:bg-brand-700'
                : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed'
            }`}
          >
            <Save className="w-3.5 h-3.5" />
            {updateSettingsMutation.isPending ? 'Đang lưu...' : 'Lưu'}
          </button>
        </div>
        <p className="text-xs text-slate-400">
          Lưới danh mục hiển thị ở đầu trang chủ. Đổi tiêu đề, tên, bật/tắt, sắp xếp và đổi ảnh
          ngay tại đây.
        </p>
      </div>

      <div className="p-5 space-y-2.5">
        {visible.map((category, index) => (
          <ShopTopCategoryRow
            key={category.id}
            category={category}
            onSaveName={(name) => updateName(category, name)}
            onThumbnailChange={(url) => updateThumbnail(category, url)}
            onToggleVisible={() => toggleVisible(category)}
            onMoveUp={() => moveVisible(index, -1)}
            onMoveDown={() => moveVisible(index, 1)}
            canMoveUp={index > 0}
            canMoveDown={index < visible.length - 1}
            isSavingName={isSavingName(category.id)}
          />
        ))}

        {visible.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-4">Chưa có danh mục nào hiển thị.</p>
        )}

        {hidden.length > 0 && (
          <div className="pt-2 space-y-2.5">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
              Đang ẩn
            </p>
            {hidden.map((category) => (
              <ShopTopCategoryRow
                key={category.id}
                category={category}
                onSaveName={(name) => updateName(category, name)}
                onThumbnailChange={(url) => updateThumbnail(category, url)}
                onToggleVisible={() => toggleVisible(category)}
                isSavingName={isSavingName(category.id)}
                dashed
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
