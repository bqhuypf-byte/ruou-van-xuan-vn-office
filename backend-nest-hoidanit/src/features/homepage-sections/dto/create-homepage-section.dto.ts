import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import type { HomepageSectionDisplayStyle } from '../entities/homepage-section.entity';

export class CreateHomepageSectionDto {
  @IsString()
  @MaxLength(150)
  title: string;

  @IsOptional()
  @IsIn(['grid', 'carousel'])
  displayStyle?: HomepageSectionDisplayStyle;

  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
