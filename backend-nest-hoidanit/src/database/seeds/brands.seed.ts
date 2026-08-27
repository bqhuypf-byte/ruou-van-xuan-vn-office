import { DataSource } from 'typeorm';
import { Brand } from '../../features/brand/entities/brand.entity';

const BRANDS = [
  {
    name: 'Chivas Regal',
    badgeText: 'Giảm Đến 20%',
    imageUrl: null,
    bgColor: '#2e2a1f',
    tagPillColor: '#4a4530',
    ctaLink: '/products',
    sortOrder: 0,
  },
  {
    name: 'Johnnie Walker',
    badgeText: 'Giảm Đến 15%',
    imageUrl: null,
    bgColor: '#1f1f1f',
    tagPillColor: '#3a3a3a',
    ctaLink: '/products',
    sortOrder: 1,
  },
  {
    name: 'Hennessy',
    badgeText: 'Hàng Chính Hãng',
    imageUrl: null,
    bgColor: '#5b2333',
    tagPillColor: '#7a3347',
    ctaLink: '/products',
    sortOrder: 2,
  },
];

export async function seedBrands(dataSource: DataSource) {
  const repo = dataSource.getRepository(Brand);

  const existingCount = await repo.count();
  if (existingCount > 0) {
    console.log('⏭ Brands already seeded');
    return;
  }

  const brands = BRANDS.map((brand) =>
    repo.create({ ...brand, isActive: true }),
  );
  await repo.save(brands);

  console.log(`✓ Seeded ${brands.length} brands`);
}
