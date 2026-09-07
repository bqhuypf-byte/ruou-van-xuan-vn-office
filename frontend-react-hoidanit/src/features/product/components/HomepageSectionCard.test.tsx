import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HomepageSectionCard } from './HomepageSectionCard';
import type { HomepageSection } from '../types/homepage-section.types';

const mocks = vi.hoisted(() => ({
  addItem: vi.fn(),
}));

vi.mock('../hooks/useAdminHomepageSections', () => ({
  useAddSectionItem: () => ({ mutate: mocks.addItem, isPending: false }),
  useUpdateSectionItem: () => ({ mutate: vi.fn(), isPending: false, variables: undefined }),
  useRemoveSectionItem: () => ({ mutate: vi.fn() }),
  useReorderSectionItems: () => ({ mutate: vi.fn() }),
}));

vi.mock('./HomepageSectionProductPickerModal', () => ({
  HomepageSectionProductPickerModal: ({
    isOpen,
    onPick,
    excludeProductIds,
  }: {
    isOpen: boolean;
    onPick: (productId: number) => void;
    excludeProductIds: number[];
  }) =>
    isOpen ? (
      <div data-testid="product-picker">
        <span>{excludeProductIds.join(',')}</span>
        <button type="button" onClick={() => onPick(99)}>
          Chọn sản phẩm thử
        </button>
      </div>
    ) : null,
}));

const section: HomepageSection = {
  id: 1,
  title: 'Rượu Nếp',
  displayStyle: 'grid',
  sortOrder: 0,
  isActive: true,
  items: [],
};

describe('HomepageSectionCard', () => {
  beforeEach(() => {
    mocks.addItem.mockReset();
    mocks.addItem.mockImplementation(
      (_variables: unknown, options?: { onSuccess?: () => void }) => options?.onSuccess?.(),
    );
  });

  it('keeps the picker open and excludes each successfully added product', () => {
    render(
      <HomepageSectionCard
        section={section}
        position={1}
        totalCount={1}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onMoveUp={vi.fn()}
        onMoveDown={vi.fn()}
        onChangePosition={vi.fn()}
        canMoveUp={false}
        canMoveDown={false}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /thêm sản phẩm/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Chọn sản phẩm thử' }));

    expect(screen.getByTestId('product-picker')).toBeInTheDocument();
    expect(screen.getByTestId('product-picker')).toHaveTextContent('99');
    expect(mocks.addItem).toHaveBeenCalledWith(
      { sectionId: 1, input: { productId: 99 } },
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    );
  });
});
