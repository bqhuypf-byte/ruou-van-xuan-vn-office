import { IsIn } from 'class-validator';
import { REVIEW_STATUSES } from '../entities/review.entity';
import type { ReviewStatus } from '../entities/review.entity';

export class ModerateReviewDto {
  @IsIn(REVIEW_STATUSES)
  status: ReviewStatus;
}
