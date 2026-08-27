import { DataSource } from 'typeorm';
import { Banner } from '../../features/banner/entities/banner.entity';

const BANNERS = [
  {
    title: 'Rượu Vang Việt Nam',
    subtitle: 'Bộ Sưu Tập Mới',
    badgeText: 'Giảm Đến 30%',
    imageUrl: null,
    ctaLink: '/products',
    bgColor: '#2b1626',
    sortOrder: 0,
  },
  {
    title: 'Rượu Ngâm Truyền Thống',
    subtitle: 'Ưu Đãi Đặc Biệt',
    badgeText: 'Giảm Đến 20%',
    imageUrl: null,
    ctaLink: '/products',
    bgColor: '#3a1c33',
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
