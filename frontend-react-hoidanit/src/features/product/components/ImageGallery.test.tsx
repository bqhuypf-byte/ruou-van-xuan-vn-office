import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ImageGallery } from './ImageGallery';
import type { ProductImage } from '../types/image.types';

const images: ProductImage[] = [
  { id: 1, productId: 10, imageUrl: 'https://example.com/one.jpg', sortOrder: 0 },
  { id: 2, productId: 10, imageUrl: 'https://example.com/two.jpg', sortOrder: 1 },
];

describe('ImageGallery', () => {
  it('saves image ids in their new order after dragging', async () => {
    const onReorder = vi.fn().mockResolvedValue(undefined);
    render(
      <ImageGallery
        images={images}
        isLoading={false}
        onDelete={vi.fn()}
        onReorder={onReorder}
      />,
    );

    const firstImage = screen.getByRole('listitem', { name: 'Ảnh sản phẩm vị trí 1' });
    const secondImage = screen.getByRole('listitem', { name: 'Ảnh sản phẩm vị trí 2' });
    const dataTransfer = { effectAllowed: 'move', setData: vi.fn() };

    fireEvent.dragStart(firstImage, { dataTransfer });
    fireEvent.dragEnter(secondImage);
    fireEvent.dragEnd(firstImage);

    await waitFor(() => expect(onReorder).toHaveBeenCalledWith([2, 1]));
  });
});
