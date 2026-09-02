import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  MaxLength,
  ValidateNested,
  Matches,
} from 'class-validator';
import { CheckoutItemDto } from './checkout-item.dto';

export class CheckoutDto {
  @IsInt()
  addressId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  paymentMethod: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  pickupStoreIndex?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Matches(/^[A-Z0-9]+$/)
  voucherCode?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CheckoutItemDto)
  items: CheckoutItemDto[];
}
