import { useEffect, useMemo, useRef, useState } from 'react';
import { ImageOff } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { generateVariantSku } from '@/shared/utils/generateSku';
import type { VariantAttributeGroup } from '../types/product.types';
import type { ProductVariant } from '../types/variant.types';

const cartesian = (groups: VariantAttributeGroup[]): Record<string, string>[] => {
  if (groups.length === 0) return [];
  return groups.reduce<Record<string, string>[]>(
    (rows, group) =>
      rows.flatMap((row) => group.values.map((value) => ({ ...row, [group.name]: value }))),
    [{}],
  );
};

const stableSuffix = (input: string): string => {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(hash).toString(36).slice(0, 4).toUpperCase().padStart(4, '0');
};

interface MatrixRow {
  key: string;
  attributes: Record<string, string>;
  groupValue: string;
  variantId: number | null;
  sku: string;
  price: string;
  salePrice: string;
  stockQuantity: string;
}

const buildRows = (
  groups: VariantAttributeGroup[],
  variants: ProductVariant[],
  productSlug: string,
): MatrixRow[] => {
  const combinations = cartesian(groups);
  const usedVariantIds = new Set<number>();

  return combinations.map((attributes, combinationIndex) => {
    const exactVariant = variants.find(
      (candidate) =>
        !usedVariantIds.has(candidate.id) &&
        groups.every((group) => candidate.attributes?.[group.name] === attributes[group.name]),
    );
    const sameValuesVariant = variants.find((candidate) => {
      const attributeValues = Object.values(candidate.attributes ?? {});
      return (
        !usedVariantIds.has(candidate.id) &&
        attributeValues.length === groups.length &&
        attributeValues.every((value, index) => value === attributes[groups[index]?.name])
      );
    });
    const positionalVariant =
      combinations.length === variants.length && !usedVariantIds.has(variants[combinationIndex]?.id)
        ? variants[combinationIndex]
        : undefined;
    const variant = exactVariant ?? sameValuesVariant ?? positionalVariant;
    if (variant) usedVariantIds.add(variant.id);
    const key = groups.map((g) => attributes[g.name]).join('__');
    return {
      key,
      attributes,
      groupValue: groups[0] ? attributes[groups[0].name] : key,
      variantId: variant?.id ?? null,
      sku: variant?.sku ?? generateVariantSku(productSlug, groups.map((g) => attributes[g.name]), stableSuffix(key)),
      price: variant?.price ?? '',
      salePrice: variant?.salePrice ?? '',
      stockQuantity: variant ? String(variant.stockQuantity) : '0',
    };
  });
};

/** Resolves each group-1 value's thumbnail: prefers the image configured on the product's "Phân loại 1"
 * options (set from the product edit form), falling back to whatever image an existing variant already has. */
const buildGroupImages = (groups: VariantAttributeGroup[], variants: ProductVariant[]): Record<string, string> => {
  if (groups.length === 0) return {};
  const configured = groups[0].images ?? {};
  const images: Record<string, string> = {};
  for (const attributes of cartesian(groups)) {
    const groupValue = attributes[groups[0].name];
    if (images[groupValue]) continue;
    if (configured[groupValue]) {
      images[groupValue] = configured[groupValue];
      continue;
    }
    const variant = variants.find((v) => v.attributes?.[groups[0].name] === groupValue && v.imageUrl);
    if (variant?.imageUrl) images[groupValue] = variant.imageUrl;
  }
  return images;
};

export interface VariantMatrixSaveRow {
  variantId: number | null;
  attributes: Record<string, string>;
  sku: string;
  price: number;
  salePrice?: number;
  stockQuantity: number;
  imageUrl?: string;
}

export interface VariantMatrixChangeState {
  rows: VariantMatrixSaveRow[];
  hasChanges: boolean;
  hasInvalidRows: boolean;
}

export interface VariantMatrixTableProps {
  productName: string;
  productSlug: string;
  groups: VariantAttributeGroup[];
  variants: ProductVariant[];
  onChangeState: (state: VariantMatrixChangeState) => void;
}

export const VariantMatrixTable = ({
  productName,
  productSlug,
  groups,
  variants,
  onChangeState,
}: VariantMatrixTableProps) => {
  const variantsSignature = useMemo(
    () =>
      JSON.stringify(
        variants.map((v) => [v.id, v.sku, v.price, v.salePrice, v.stockQuantity, v.imageUrl, v.attributes]),
      ),
    [variants],
  );
  const groupsSignature = useMemo(() => JSON.stringify(groups), [groups]);

  const [rows, setRows] = useState<MatrixRow[]>(() => buildRows(groups, variants, productSlug));
  const signatureRef = useRef(`${variantsSignature}|${groupsSignature}`);

  useEffect(() => {
    const signature = `${variantsSignature}|${groupsSignature}`;
    if (signatureRef.current !== signature) {
      signatureRef.current = signature;
      setRows(buildRows(groups, variants, productSlug));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variantsSignature, groupsSignature]);

  const groupImages = useMemo(() => buildGroupImages(groups, variants), [groupsSignature, variantsSignature]);

  const updateRow = (key: string, patch: Partial<MatrixRow>) => {
    setRows((prev) => prev.map((row) => (row.key === key ? { ...row, ...patch } : row)));
  };

  const [bulk, setBulk] = useState({ price: '', stockQuantity: '', salePrice: '' });

  const applyBulk = () => {
    setRows((prev) =>
      prev.map((row) => ({
        ...row,
        price: bulk.price !== '' ? bulk.price : row.price,
        salePrice: bulk.salePrice !== '' ? bulk.salePrice : row.salePrice,
        stockQuantity: bulk.stockQuantity !== '' ? bulk.stockQuantity : row.stockQuantity,
      })),
    );
  };

  useEffect(() => {
    const dirtyRows: VariantMatrixSaveRow[] = [];
    let hasChanges = false;
    let hasInvalidRows = false;

    for (const row of rows) {
      const originalVariant = variants.find((v) => v.id === row.variantId);
      const imageUrl = groups[0] ? groupImages[row.groupValue] : undefined;
      const changed =
        !originalVariant ||
        originalVariant.sku !== row.sku ||
        originalVariant.price !== row.price ||
        (originalVariant.salePrice ?? '') !== row.salePrice ||
        String(originalVariant.stockQuantity) !== row.stockQuantity ||
        (originalVariant.imageUrl ?? '') !== (imageUrl ?? '') ||
        JSON.stringify(originalVariant.attributes ?? {}) !== JSON.stringify(row.attributes);

      if (!changed) continue;
      hasChanges = true;

      const price = Number(row.price);
      if (!row.price || Number.isNaN(price) || price <= 0) {
        hasInvalidRows = true;
        continue;
      }

      dirtyRows.push({
        variantId: row.variantId,
        attributes: row.attributes,
        sku: row.sku,
        price,
        salePrice: row.salePrice ? Number(row.salePrice) : undefined,
        stockQuantity: Number(row.stockQuantity) || 0,
        imageUrl: imageUrl || undefined,
      });
    }

    onChangeState({ rows: dirtyRows, hasChanges, hasInvalidRows });
    // groupsSignature/variantsSignature intentionally represent the array inputs;
    // depending on the arrays directly would re-run forever because the form
    // derives a fresh groups array on every parent render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupImages, groupsSignature, onChangeState, rows, variantsSignature]);

  let lastGroupValue: string | null = null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Danh sách phân loại hàng</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Điền giá và tồn kho cho từng tổ hợp. Nút Lưu Thay Đổi chung bên dưới sẽ lưu tất cả cùng lúc. Ảnh lấy từ mục
            "Phân Loại Hàng" ở trên.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
        <div className="flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 px-2.5 py-1.5 bg-white dark:bg-slate-900">
          <span className="text-slate-400 text-xs">₫</span>
          <input
            type="number"
            step="0.01"
            value={bulk.price}
            onChange={(e) => setBulk((b) => ({ ...b, price: e.target.value }))}
            className="w-28 bg-transparent text-sm focus:outline-none dark:text-white"
            placeholder="Giá"
          />
        </div>
        <div className="flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 px-2.5 py-1.5 bg-white dark:bg-slate-900">
          <span className="text-slate-400 text-xs">₫</span>
          <input
            type="number"
            step="0.01"
            value={bulk.salePrice}
            onChange={(e) => setBulk((b) => ({ ...b, salePrice: e.target.value }))}
            className="w-28 bg-transparent text-sm focus:outline-none dark:text-white"
            placeholder="Giá khuyến mãi"
          />
        </div>
        <input
          type="number"
          value={bulk.stockQuantity}
          onChange={(e) => setBulk((b) => ({ ...b, stockQuantity: e.target.value }))}
          className="w-28 rounded-lg border border-slate-300 dark:border-slate-700 px-2.5 py-1.5 text-sm bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:text-white"
          placeholder="Kho hàng"
        />
        <Button size="sm" variant="outline" onClick={applyBulk}>
          Áp dụng cho tất cả phân loại
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
              <th className="py-3 px-5">{productName}</th>
              {groups.length > 1 && <th className="py-3 px-5">{groups[1].name}</th>}
              <th className="py-3 px-5">Giá</th>
              <th className="py-3 px-5">Giá Khuyến Mãi</th>
              <th className="py-3 px-5">Kho</th>
              <th className="py-3 px-5">SKU</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {rows.map((row) => {
              const isNewGroup = row.groupValue !== lastGroupValue;
              lastGroupValue = row.groupValue;
              const rowSpan = rows.filter((r) => r.groupValue === row.groupValue).length;

              return (
                <tr key={row.key} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  {isNewGroup && (
                    <td rowSpan={rowSpan} className="py-3.5 px-5 align-top border-r border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-3">
                        {groupImages[row.groupValue] ? (
                          <img
                            src={groupImages[row.groupValue]}
                            alt={row.groupValue}
                            className="w-12 h-12 shrink-0 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                          />
                        ) : (
                          <div className="w-12 h-12 shrink-0 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
                            <ImageOff className="w-4 h-4" />
                          </div>
                        )}
                        <p className="font-medium text-slate-900 dark:text-white">
                          {productName}
                          {row.groupValue ? ` ${row.groupValue}` : ''}
                        </p>
                      </div>
                    </td>
                  )}
                  {groups.length > 1 && (
                    <td className="py-3.5 px-5 text-slate-700 dark:text-slate-300">
                      {row.attributes[groups[1].name]}
                    </td>
                  )}
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500">
                      <span className="text-slate-400 text-xs">₫</span>
                      <input
                        type="number"
                        step="0.01"
                        value={row.price}
                        onChange={(e) => updateRow(row.key, { price: e.target.value })}
                        className="w-full bg-transparent text-sm focus:outline-none dark:text-white"
                        placeholder="0"
                      />
                    </div>
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500">
                      <span className="text-slate-400 text-xs">₫</span>
                      <input
                        type="number"
                        step="0.01"
                        value={row.salePrice}
                        onChange={(e) => updateRow(row.key, { salePrice: e.target.value })}
                        className="w-full bg-transparent text-sm focus:outline-none dark:text-white"
                        placeholder="Tùy chọn"
                      />
                    </div>
                  </td>
                  <td className="py-3.5 px-5">
                    <input
                      type="number"
                      value={row.stockQuantity}
                      onChange={(e) => updateRow(row.key, { stockQuantity: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 px-2.5 py-1.5 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:text-white"
                      placeholder="0"
                    />
                  </td>
                  <td className="py-3.5 px-5">
                    <input
                      type="text"
                      value={row.sku}
                      onChange={(e) => updateRow(row.key, { sku: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 px-2.5 py-1.5 text-xs font-mono bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:text-white"
                      placeholder="Nhập vào"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
