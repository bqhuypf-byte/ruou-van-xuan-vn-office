import { DataSource } from 'typeorm';
import { Product } from '../../features/product/entities/product.entity';
import { slugifyVi } from './slugify-vi.util';

const API_ORIGIN = process.env.API_ORIGIN ?? 'http://localhost:3000';

const IMAGE_BY_PRODUCT_NAME: Record<string, string> = {
  'Rượu Nếp Đục Vạn Xuân': 'vanxuan-rice-wine-duc-sua-b1cb04c011b4.webp',
  'Rượu Nếp Sữa Vạn Xuân': 'vanxuan-rice-wine-duc-sua-b1cb04c011b4.webp',
  'Rượu Nếp Vạn Xuân Can 10 Lít': 'vanxuan-rice-wine-can-10l-8857190b3380.webp',
  'Rượu Nếp Chuối Hột Vạn Xuân': 'vanxuan-rice-wine-chuoi-hot-7123e13fa644.webp',
  'Rượu Nếp Than Vạn Xuân': 'vanxuan-rice-wine-than-4e5e95d5c313.webp',
  'Rượu Nếp Vạn Xuân 40 Độ': 'vanxuan-rice-wine-40-do-fdb4d3b9b02e.webp',
};

export async function seedVanXuanProductImages(dataSource: DataSource) {
  const productRepo = dataSource.getRepository(Product);

  let updated = 0;
  for (const [name, filename] of Object.entries(IMAGE_BY_PRODUCT_NAME)) {
    const slug = slugifyVi(name);
    const product = await productRepo.findOne({ where: { slug } });
    if (!product) {
      console.warn(`⚠ Product "${name}" not found, skipping image attach`);
      continue;
    }
    product.thumbnailUrl = `${API_ORIGIN}/uploads/${filename}`;
    await productRepo.save(product);
    updated += 1;
  }

  console.log(`✓ Attached real photos to ${updated} Rượu Vạn Xuân products`);
}
