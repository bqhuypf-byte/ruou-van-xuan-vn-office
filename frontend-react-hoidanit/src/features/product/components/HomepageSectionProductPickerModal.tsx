import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Button, Input, Modal, Spinner } from '@/shared/components/ui';
import { formatPrice } from '@/shared/utils/formatPrice';
import { useProducts } from '../hooks/useProducts';

export interface HomepageSectionProductPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPick: (productId: number) => void;
  excludeProductIds: number[];
  isAdding?: boolean;
}

export const HomepageSectionProductPickerModal = ({
  isOpen,
  onClose,
  onPick,
  excludeProductIds,
  isAdding = false,
}: HomepageSectionProductPickerModalProps) => {
  const [search, setSearch] = useState('');

  const { products, isLoading } = useProducts({
    search: search || undefined,
    isActive: true,
    limit: 20,
  });

  const excludeSet = new Set(excludeProductIds);
  const availableProducts = products.filter((product) => !excludeSet.has(product.id));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Chọn Sản Phẩm" size="lg">
      <div className="space-y-4">
        <Input
          placeholder="Tìm theo tên hoặc slug..."
          leftIcon={<Search className="w-4 h-4" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
        />

        <div className="max-h-96 overflow-y-auto space-y-2">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : availableProducts.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">
              Không tìm thấy sản phẩm phù hợp.
            </p>
          ) : (
            availableProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand-400"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                  {product.thumbnailUrl && (
                    <img
                      src={product.thumbnailUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {product.name}
                  </p>
                  {product.priceFrom != null && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {formatPrice(product.priceFrom)}
                    </p>
                  )}
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  disabled={isAdding}
                  onClick={() => onPick(product.id)}
                >
                  Thêm
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
};
