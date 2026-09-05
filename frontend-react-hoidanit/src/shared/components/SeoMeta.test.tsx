import { beforeEach, describe, expect, it } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { SeoMeta } from './SeoMeta';

describe('SeoMeta', () => {
  beforeEach(() => {
    document.title = 'Trang chủ';
    document.head.querySelectorAll('meta, link[rel="canonical"]').forEach((element) => element.remove());
    const description = document.createElement('meta');
    description.name = 'description';
    description.content = 'Mô tả mặc định';
    document.head.appendChild(description);
  });

  it('applies page metadata and restores the defaults on unmount', async () => {
    const { unmount } = render(
      <SeoMeta
        title="Rượu Nếp Vạn Xuân | Vạn Xuân"
        description="Mô tả sản phẩm"
        canonicalUrl="https://ruouvanxuan.vn/products/ruou-nep-van-xuan"
        imageUrl="https://ruouvanxuan.vn/product.jpg"
        fallbackTitle="Rượu Vạn Xuân"
        type="product"
      />,
    );

    await waitFor(() => {
      expect(document.title).toBe('Rượu Nếp Vạn Xuân | Vạn Xuân');
      expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
        'content',
        'Mô tả sản phẩm',
      );
      expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
        'href',
        'https://ruouvanxuan.vn/products/ruou-nep-van-xuan',
      );
      expect(document.querySelector('meta[property="og:type"]')).toHaveAttribute(
        'content',
        'product',
      );
      expect(document.querySelector('meta[property="og:image"]')).toHaveAttribute(
        'content',
        'https://ruouvanxuan.vn/product.jpg',
      );
    });

    unmount();

    expect(document.title).toBe('Rượu Vạn Xuân');
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      'content',
      'Mô tả mặc định',
    );
    expect(document.querySelector('link[rel="canonical"]')).not.toBeInTheDocument();
  });
});
