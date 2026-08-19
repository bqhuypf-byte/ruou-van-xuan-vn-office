import { DataSource } from 'typeorm';
import {
  SITE_SETTINGS_ID,
  SiteSettings,
} from '../../features/site-settings/entities/site-settings.entity';

export async function seedSiteSettings(dataSource: DataSource) {
  const repo = dataSource.getRepository(SiteSettings);

  const existing = await repo.findOne({ where: { id: SITE_SETTINGS_ID } });
  if (existing) {
    console.log('⏭ Site settings already seeded');
    return;
  }

  await repo.save(
    repo.create({
      id: SITE_SETTINGS_ID,
      siteName: 'MegaMart',
      logoUrl: null,
      topBarMessage: 'Welcome to worldwide MegaMart!',
      deliverToText: 'Deliver to 423651',
      contactPhone: '+1 202-918-2132',
      whatsappNumber: '+1 202-918-2132',
      appStoreUrl: null,
      playStoreUrl: null,
      copyrightText: `© ${new Date().getFullYear()} All rights reserved.`,
      popularCategoriesTitle: 'Most Popular Categories',
      popularCategoriesLinks: [
        { label: 'Staples', url: '/products' },
        { label: 'Beverages', url: '/products' },
        { label: 'Personal Care', url: '/products' },
        { label: 'Home Care', url: '/products' },
        { label: 'Baby Care', url: '/products' },
        { label: 'Vegetables & Fruits', url: '/products' },
        { label: 'Snacks & Foods', url: '/products' },
        { label: 'Dairy & Bakery', url: '/products' },
      ],
      customerServiceTitle: 'Customer Services',
      customerServiceLinks: [
        { label: 'About Us', url: '/about' },
        { label: 'Terms & Conditions', url: '/terms' },
        { label: 'FAQ', url: '/faq' },
        { label: 'Privacy Policy', url: '/privacy' },
        { label: 'E-waste Policy', url: '/e-waste-policy' },
        { label: 'Cancellation & Return Policy', url: '/return-policy' },
      ],
    }),
  );

  console.log('✓ Seeded site settings');
}
