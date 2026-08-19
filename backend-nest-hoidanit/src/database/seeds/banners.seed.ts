import { DataSource } from 'typeorm';
import { Banner } from '../../features/banner/entities/banner.entity';

const BANNERS = [
  {
    title: 'SMART WEARABLE.',
    subtitle: 'Best Deal Online on smart watches',
    badgeText: 'UP to 80% OFF',
    imageUrl:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
    ctaLink: '/products',
    bgColor: '#212844',
    sortOrder: 0,
  },
  {
    title: 'SUMMER SALE.',
    subtitle: 'Best Deal Online on fashion',
    badgeText: 'UP to 50% OFF',
    imageUrl:
      'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600',
    ctaLink: '/products',
    bgColor: '#008ECC',
    sortOrder: 1,
  },
];

export async function seedBanners(dataSource: DataSource) {
  const repo = dataSource.getRepository(Banner);

  const existingCount = await repo.count();
  if (existingCount > 0) {
    console.log('⏭ Banners already seeded');
    return;
  }

  const banners = BANNERS.map((banner) =>
    repo.create({ ...banner, isActive: true }),
  );
  await repo.save(banners);

  console.log(`✓ Seeded ${banners.length} banners`);
}
