import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class FooterLinkDto {
  @IsString()
  @MaxLength(100)
  label: string;

  @IsString()
  @MaxLength(500)
  url: string;
}

export class ContactAddressDto {
  @IsString()
  @MaxLength(100)
  label: string;

  @IsString()
  @MaxLength(255)
  address: string;
}

export class TrustBadgeDto {
  @IsString()
  @MaxLength(100)
  icon: string;

  @IsString()
  @MaxLength(100)
  title: string;

  @IsString()
  @MaxLength(255)
  description: string;
}

export class PaymentMethodIconDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @MaxLength(500)
  iconUrl: string;
}

export class ContactChannelLocationDto {
  @IsString()
  @MaxLength(100)
  label: string;

  @IsString()
  @MaxLength(500)
  link: string;
}

export class ContactChannelDto {
  @IsString()
  @MaxLength(50)
  icon: string;

  @IsString()
  @MaxLength(100)
  label: string;

  @IsString()
  @MaxLength(50)
  hours: string;

  @IsString()
  @MaxLength(500)
  link: string;

  @IsString()
  @MaxLength(20)
  bgColor: string;

  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => ContactChannelLocationDto)
  locations?: ContactChannelLocationDto[];
}

export class UpdateSiteSettingsDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  siteName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  logoUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  browserTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  faviconUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  topBarMessage?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  deliverToText?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  contactPhone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  whatsappNumber?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => ContactAddressDto)
  contactAddresses?: ContactAddressDto[];

  @IsOptional()
  @IsString()
  @MaxLength(500)
  facebookUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  zaloUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  appStoreUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  playStoreUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  copyrightText?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  footerDescription?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  dealsSectionTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  featuredBrandsSectionTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  popularCategoriesTitle?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => FooterLinkDto)
  popularCategoriesLinks?: FooterLinkDto[];

  @IsOptional()
  @IsString()
  @MaxLength(100)
  customerServiceTitle?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => FooterLinkDto)
  customerServiceLinks?: FooterLinkDto[];

  @IsOptional()
  @IsString()
  @MaxLength(100)
  footerAboutTitle?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => FooterLinkDto)
  footerAboutLinks?: FooterLinkDto[];

  @IsOptional()
  @IsString()
  @MaxLength(100)
  footerServicesTitle?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => FooterLinkDto)
  footerServicesLinks?: FooterLinkDto[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => FooterLinkDto)
  footerBottomLinks?: FooterLinkDto[];

  @IsOptional()
  @IsString()
  @MaxLength(100)
  topCategoriesSectionTitle?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => TrustBadgeDto)
  trustBadges?: TrustBadgeDto[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => PaymentMethodIconDto)
  paymentMethodIcons?: PaymentMethodIconDto[];

  @IsOptional()
  @IsString()
  @MaxLength(255)
  codDescription?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  storePickupDescription?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  bankTransferDescription?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  bankName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  bankAccountNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  bankAccountHolder?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  bankBin?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  shippingFee?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  freeShippingThreshold?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  checkoutReviewNote?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  checkoutShippingNote?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  checkoutPaymentNote?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  checkoutSummaryNote?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => ContactChannelDto)
  contactChannels?: ContactChannelDto[];
}
