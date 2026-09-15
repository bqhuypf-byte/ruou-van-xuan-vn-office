import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { ProductService } from '../services/product.service';
import { SitemapController } from './sitemap.controller';

describe('SitemapController', () => {
  it('returns canonical static and active product URLs as XML', async () => {
    const productService = {
      findAllActiveForSitemap: jest.fn().mockResolvedValue([
        {
          id: 1,
          slug: 'ruou-nep-van-xuan',
          updatedAt: new Date('2026-09-14T00:00:00.000Z'),
        },
      ]),
    } as unknown as ProductService;
    const configService = {
      get: jest.fn().mockReturnValue('https://ruouvanxuan.com'),
    } as unknown as ConfigService;
    const send = jest.fn();
    const response = {
      type: jest.fn().mockReturnThis(),
      send,
    } as unknown as Response;

    await new SitemapController(productService, configService).getSitemap(response);

    expect(response.type).toHaveBeenCalledWith('application/xml');
    expect(send).toHaveBeenCalledWith(
      expect.stringContaining(
        '<loc>https://ruouvanxuan.com/products/ruou-nep-van-xuan</loc>',
      ),
    );
    expect(send).toHaveBeenCalledWith(
      expect.stringContaining('<lastmod>2026-09-14T00:00:00.000Z</lastmod>'),
    );
  });
});
