import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class AddSectionItemDto {
  @IsInt()
  productId: number;

  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  overridePrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  overrideOriginalPrice?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  badgeText?: string;
}
