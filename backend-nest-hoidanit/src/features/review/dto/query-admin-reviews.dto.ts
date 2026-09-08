import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { REVIEW_STATUSES } from '../entities/review.entity';
import type { ReviewStatus } from '../entities/review.entity';

export class QueryAdminReviewsDto {
  @IsOptional()
  @IsIn(REVIEW_STATUSES)
  status?: ReviewStatus;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  productId?: number;

  @IsOptional()
  @IsString()
  search?: string;
}
