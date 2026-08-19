import { IsInt, IsOptional } from 'class-validator';

export class ReassignCategoryProductsDto {
  @IsOptional()
  @IsInt()
  targetCategoryId?: number;
}
