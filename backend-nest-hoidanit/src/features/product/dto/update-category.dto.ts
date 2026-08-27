import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  slug?: string;

  @IsOptional()
  @IsInt()
  parentId?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  thumbnailUrl?: string;

  @IsOptional()
  @IsInt()
  homeSortOrder?: number;

  @IsOptional()
  @IsBoolean()
  showInProductSections?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  homeSectionTitle?: string;

  @IsOptional()
  @IsIn(['grid', 'carousel'])
  homeDisplayStyle?: 'grid' | 'carousel';
}
