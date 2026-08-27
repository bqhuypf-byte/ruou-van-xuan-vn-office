import { DataSource } from 'typeorm';
import { Category } from '../../features/product/entities/category.entity';
import { Product } from '../../features/product/entities/product.entity';
import { ProductVariant } from '../../features/product/entities/product-variant.entity';
import { slugifyVi } from './slugify-vi.util';

interface SeedVariant {
  size: string | null;
  price: number;
}

interface SeedProduct {
  name: string;
  categoryName: string;
  description: string;
  variants: SeedVariant[];
}

const VAN_XUAN_PRODUCTS: SeedProduct[] = [
  {
    name: 'Rượu Nếp Đục Vạn Xuân',
    categoryName: 'Rượu Nếp',
    description:
      'Rượu nếp đục Vạn Xuân, lên men tự nhiên từ nếp cái hoa vàng bằng men rượu gia truyền, chưng cất truyền thống, nguyên chất không pha cồn.',
    variants: [{ size: '1 Lít - 30 độ', price: 150000 }],
  },
  {
    name: 'Rượu Nếp Sữa Vạn Xuân',
    categoryName: 'Rượu Nếp',
    description:
      'Rượu nếp sữa Vạn Xuân, nước cốt nếp sữa tinh khiết, lên men tự nhiên, chưng cất truyền thống, nguyên chất không pha cồn.',
    variants: [{ size: '1 Lít - 30 độ', price: 160000 }],
  },
  {
    name: 'Rượu Nếp Vạn Xuân Can 10 Lít',
    categoryName: 'Rượu Nếp',
    description:
      'Rượu nếp Vạn Xuân đóng can 10 lít, nếp nguyên chất và men rượu truyền thống, chưng cất giữ trọn hương vị thơm ngon tinh khiết, không pha cồn công nghiệp.',
    variants: [{ size: '10 Lít - 30% Vol', price: 950000 }],
  },
  {
    name: 'Rượu Nếp Chuối Hột Vạn Xuân',
    categoryName: 'Rượu Nếp',
    description:
      'Rượu nếp chuối hột Vạn Xuân, lên men tự nhiên và chưng cất truyền thống từ nếp và chuối hột rừng, không hóa chất độc hại.',
    variants: [{ size: '1 Lít - 30 độ', price: 145000 }],
  },
  {
    name: 'Rượu Nếp Than Vạn Xuân',
    categoryName: 'Rượu Nếp',
    description:
      'Rượu nếp than Vạn Xuân, nấu từ nếp than nguyên liệu tự nhiên, lên men và chưng cất truyền thống, an toàn cho sức khỏe.',
    variants: [{ size: '1 Lít', price: 155000 }],
  },
  {
    name: 'Rượu Nếp Vạn Xuân 40 Độ',
    categoryName: 'Rượu Nếp',
    description:
      'Rượu nếp Vạn Xuân 40 độ, lên men tự nhiên, chưng cất truyền thống giữ trọn hương vị thơm ngon tinh khiết, không pha cồn công nghiệp.',
    variants: [{ size: '5 Lít - 40% Vol', price: 480000 }],
  },
];

export async function seedVanXuanProducts(dataSource: DataSource) {
  const categoryRepo = dataSource.getRepository(Category);
  const productRepo = dataSource.getRepository(Product);
  const variantRepo = dataSource.getRepository(ProductVariant);

  const categories = await categoryRepo.find();
  const categoryByName = new Map(categories.map((c) => [c.name, c]));

  let created = 0;
  let variantTotal = 0;

  for (const item of VAN_XUAN_PRODUCTS) {
    const category = categoryByName.get(item.categoryName);
    if (!category) {
      console.warn(
        `⚠ Category "${item.categoryName}" not found, skipping "${item.name}"`,
      );
      continue;
    }

    const slugBase = slugifyVi(item.name);
    const existing = await productRepo.findOne({ where: { slug: slugBase } });
    if (existing) {
      continue;
    }

    const product = await productRepo.save(
      productRepo.create({
        categoryId: category.id,
        name: item.name,
        slug: slugBase,
        description: item.description,
        thumbnailUrl: null,
        isActive: true,
        isFeaturedDeal: false,
        dealSortOrder: 0,
        variantAttributes: [
          { name: 'Dung Tích', values: item.variants.map((v) => v.size).filter((s): s is string => !!s) },
        ],
      }),
    );

    const variants = item.variants.map((v, idx) =>
      variantRepo.create({
        productId: product.id,
        sku: `${slugBase}-${(idx + 1).toString().padStart(2, '0')}`.toUpperCase(),
        attributes: v.size ? { 'Dung Tích': v.size } : null,
        price: v.price.toFixed(2),
        salePrice: null,
        stockQuantity: 50,
      }),
    );
    await variantRepo.save(variants);
    variantTotal += variants.length;
    created += 1;
  }

  if (created > 0) {
    console.log(
      `✓ Seeded ${created} Rượu Vạn Xuân products with ${variantTotal} variants`,
    );
  } else {
    console.log('⏭ Rượu Vạn Xuân products already seeded');
  }
}
