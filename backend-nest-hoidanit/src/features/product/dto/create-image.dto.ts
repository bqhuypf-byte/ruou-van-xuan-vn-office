import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateImageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  imageUrl: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
