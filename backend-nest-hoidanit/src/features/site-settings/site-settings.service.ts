import { Injectable } from '@nestjs/common';
import { assignDefined } from '../../shared/utils/assign-defined.util';
import { SiteSettingsRepository } from './repositories/site-settings.repository';
import { UpdateSiteSettingsDto } from './dto/update-site-settings.dto';
import {
  SITE_SETTINGS_ID,
  SiteSettings,
} from './entities/site-settings.entity';

const DEFAULT_SETTINGS: Omit<SiteSettings, 'id' | 'updatedAt'> = {
  siteName: 'MegaMart',
  logoUrl: null,
  browserTitle: null,
  faviconUrl: null,
  topBarMessage: 'Welcome to worldwide MegaMart!',
  deliverToText: 'Deliver to 423651',
  contactPhone: '+1 202-918-2132',
  whatsappNumber: '+1 202-918-2132',
  contactAddresses: null,
  facebookUrl: null,
  zaloUrl: null,
  appStoreUrl: null,
  playStoreUrl: null,
  copyrightText: `© ${new Date().getFullYear()} All rights reserved.`,
  footerDescription: null,
  dealsSectionTitle: 'Featured Deals',
  featuredBrandsSectionTitle: 'Featured Brands',
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
  footerAboutTitle: 'About Us',
  footerAboutLinks: [
    { label: 'About Shopcart', url: '/about' },
    { label: 'Careers', url: '/careers' },
    { label: 'News & Blog', url: '/blog' },
  ],
  footerServicesTitle: 'Services',
  footerServicesLinks: [
    { label: 'Gift Card', url: '/gift-card' },
    { label: 'Shipping & Delivery', url: '/shipping' },
  ],
  footerBottomLinks: [
    { label: 'Terms of Service', url: '/terms' },
    { label: 'Privacy & Policy', url: '/privacy' },
  ],
  topCategoriesSectionTitle: 'Shop Top Categories',
  trustBadges: [],
  paymentMethodIcons: [],
  codDescription: 'Pay in cash when your order arrives',
  storePickupDescription: 'Pick up and pay in person at the store',
  bankTransferDescription: 'Transfer first, order processed after confirmation',
  bankName: null,
  bankAccountNumber: null,
  bankAccountHolder: null,
  bankBin: null,
  shippingFee: '0.00',
  freeShippingThreshold: '500000.00',
  checkoutReviewNote: null,
  checkoutShippingNote: null,
  checkoutPaymentNote: null,
  checkoutSummaryNote:
    "Please double-check your details before ordering. We'll confirm your order by phone.",
  contactChannels: [],
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
    assignDefined(settings, dto);
    return this.repository.save(settings);
  }
}
