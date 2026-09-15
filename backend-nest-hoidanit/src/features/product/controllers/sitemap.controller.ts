import { Controller, Get, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { ProductService } from '../services/product.service';

const escapeXml = (value: string) =>
  value.replace(
    /[<>&'\"]/g,
    (character) =>
      ({
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        "'": '&apos;',
        '"': '&quot;',
      })[character]!,
  );

@Controller()
export class SitemapController {
  constructor(
    private readonly productService: ProductService,
    private readonly configService: ConfigService,
  ) {}

  @Get('sitemap.xml')
  async getSitemap(@Res() response: Response) {
    const siteUrl = this.configService.get<string>('app.publicSiteUrl')!;
    const products = await this.productService.findAllActiveForSitemap();
    const staticUrls = [
      { path: '/', changefreq: 'weekly', priority: '1.0' },
      { path: '/products', changefreq: 'daily', priority: '0.9' },
    ];
    const entries = [
      ...staticUrls.map(
        ({ path, changefreq, priority }) =>
          `<url><loc>${escapeXml(`${siteUrl}${path}`)}</loc><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`,
      ),
      ...products.map(
        (product) =>
          `<url><loc>${escapeXml(`${siteUrl}/products/${product.slug}`)}</loc><lastmod>${product.updatedAt.toISOString()}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`,
      ),
    ];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`;

    response.type('application/xml').send(xml);
  }
}
