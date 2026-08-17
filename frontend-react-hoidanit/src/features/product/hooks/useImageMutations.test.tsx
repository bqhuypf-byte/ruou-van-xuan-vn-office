import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTestQueryClient } from '@/test/test-utils';
import { useAddImages, useDeleteImage } from './useImageMutations';
import { imageService } from '../services/image.service';
import type { ProductImage } from '../types/image.types';

vi.mock('../services/image.service', () => ({
  imageService: {
    addImages: vi.fn(),
    deleteImage: vi.fn(),
  },
}));

const mockImages: ProductImage[] = [{ id: 1, productId: 1, imageUrl: 'https://example.com/a.jpg', sortOrder: 0 }];

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('useAddImages', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls imageService.addImages with productId and input', async () => {
    vi.mocked(imageService.addImages).mockResolvedValue(mockImages);
    const { result } = renderHook(() => useAddImages(), { wrapper });

    result.current.mutate({
      productId: 1,
      input: { images: [{ imageUrl: 'https://example.com/a.jpg' }] },
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(imageService.addImages).toHaveBeenCalledWith(1, {
      images: [{ imageUrl: 'https://example.com/a.jpg' }],
    });
  });
});

describe('useDeleteImage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls imageService.deleteImage with the id', async () => {
    vi.mocked(imageService.deleteImage).mockResolvedValue(undefined);
    const { result } = renderHook(() => useDeleteImage(), { wrapper });

    result.current.mutate(1);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(imageService.deleteImage).toHaveBeenCalledWith(1);
  });
});
