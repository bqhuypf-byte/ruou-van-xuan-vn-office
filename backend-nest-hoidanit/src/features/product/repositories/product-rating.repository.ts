import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../../review/entities/review.entity';

export interface ProductRatingSummary {
  productId: number;
  avgRating: number;
  reviewCount: number;
}

@Injectable()
export class ProductRatingRepository {
  constructor(
    @InjectRepository(Review)
    private readonly repository: Repository<Review>,
  ) {}

  async findByProductIds(productIds: number[]): Promise<ProductRatingSummary[]> {
    if (productIds.length === 0) return [];

    const rows = await this.repository
      .createQueryBuilder('review')
      .select('review.productId', 'productId')
      .addSelect('AVG(review.rating)', 'avgRating')
      .addSelect('COUNT(*)', 'reviewCount')
      .where('review.productId IN (:...productIds)', { productIds })
      .groupBy('review.productId')
      .getRawMany<{ productId: string; avgRating: string; reviewCount: string }>();

    return rows.map((row) => ({
      productId: Number(row.productId),
      avgRating: Number(row.avgRating),
      reviewCount: Number(row.reviewCount),
    }));
  }
}
