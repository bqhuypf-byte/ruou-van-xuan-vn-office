import { DataSource } from 'typeorm';
import { Brand } from '../../features/brand/entities/brand.entity';

const BRANDS = [
  {
    name: 'IPHONE',
    badgeText: 'UP to 80% OFF',
    imageUrl:
      'https://images.unsplash.com/photo-1592286927505-1def25115481?w=400',
    bgColor: '#313131',
    tagPillColor: '#494949',
    ctaLink: '/products',
    sortOrder: 0,
  },
  {
    name: 'REALME',
    badgeText: 'UP to 80% OFF',
    imageUrl:
      'https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?w=400',
    bgColor: '#FFF3CC',
    tagPillColor: '#F6DE8D',
    ctaLink: '/products',
    sortOrder: 1,
  },
  {
    name: 'XIAOMI',
    badgeText: 'UP to 80% OFF',
    imageUrl:
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400',
    bgColor: '#FFECDF',
    tagPillColor: '#FFD1B0',
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

  const brands = BRANDS.map((brand) => repo.create({ ...brand, isActive: true }));
  await repo.save(brands);

  console.log(`✓ Seeded ${brands.length} brands`);
}
