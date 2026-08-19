import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsOptional,
  IsString,
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
}
