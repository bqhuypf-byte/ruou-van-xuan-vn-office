import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';

export class UpdateSectionItemDto {
  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @ValidateIf((_, value) => value !== null)
  @IsOptional()
  @IsNumber()
  @Min(0)
  overridePrice?: number | null;

  @ValidateIf((_, value) => value !== null)
  @IsOptional()
  @IsNumber()
  @Min(0)
  overrideOriginalPrice?: number | null;

  @ValidateIf((_, value) => value !== null)
  @IsOptional()
  @IsString()
  @MaxLength(50)
  badgeText?: string | null;
}
