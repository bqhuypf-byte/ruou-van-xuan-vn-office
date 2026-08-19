import { Injectable } from '@nestjs/common';
import { SiteSettingsRepository } from './repositories/site-settings.repository';
import { UpdateSiteSettingsDto } from './dto/update-site-settings.dto';
import {
  SITE_SETTINGS_ID,
  SiteSettings,
} from './entities/site-settings.entity';

const DEFAULT_SETTINGS: Omit<SiteSettings, 'id' | 'updatedAt'> = {
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
};

@Injectable()
export class SiteSettingsService {
  constructor(private readonly repository: SiteSettingsRepository) {}

  private async findOrCreate(): Promise<SiteSettings> {
    const existing = await this.repository.findById(SITE_SETTINGS_ID);
    if (existing) {
      return existing;
    }
    const settings = this.repository.create({
      id: SITE_SETTINGS_ID,
      ...DEFAULT_SETTINGS,
    });
    return this.repository.save(settings);
  }

  async get(): Promise<SiteSettings> {
    return this.findOrCreate();
  }

  async update(dto: UpdateSiteSettingsDto): Promise<SiteSettings> {
    const settings = await this.findOrCreate();
    Object.assign(settings, dto);
    return this.repository.save(settings);
  }
}
