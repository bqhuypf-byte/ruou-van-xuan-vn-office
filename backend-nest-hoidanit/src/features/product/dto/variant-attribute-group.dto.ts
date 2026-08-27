import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class VariantAttributeGroupDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @IsString({ each: true })
  values: string[];

  @IsOptional()
  @IsObject()
  images?: Record<string, string>;
}
