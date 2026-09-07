import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
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
  @ArrayUnique((value: string) => value.trim().toLocaleLowerCase('vi-VN'))
  @IsString({ each: true })
  values: string[];

  @IsOptional()
  @IsObject()
  images?: Record<string, string>;
}
