import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

export class ValidateVoucherDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/^[A-Z0-9]+$/)
  code: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  orderAmount: number;
}
