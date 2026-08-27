import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateFaqDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  question?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  answer?: string;

  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
