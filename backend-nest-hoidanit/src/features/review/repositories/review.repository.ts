import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../entities/review.entity';
import { QueryAdminReviewsDto } from '../dto/query-admin-reviews.dto';

@Injectable()
export class ReviewRepository {
  constructor(
    @InjectRepository(Review)
    private readonly repository: Repository<Review>,
  ) {}

  findByProductId(productId: number): Promise<Review[]> {
    return this.repository.find({
      where: { productId, status: 'approved' },
      order: { createdAt: 'DESC' },
    });
  }

  findAllAdmin(query: QueryAdminReviewsDto): Promise<Review[]> {
    const qb = this.repository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.product', 'product')
      .orderBy('review.createdAt', 'DESC');

    if (query.status)
      qb.andWhere('review.status = :status', { status: query.status });
    if (query.rating)
      qb.andWhere('review.rating = :rating', { rating: query.rating });
    if (query.productId) {
      qb.andWhere('review.productId = :productId', {
        productId: query.productId,
      });
    }
    if (query.search?.trim()) {
      qb.andWhere(
        `(review.reviewerName LIKE :search
          OR review.reviewerEmail LIKE :search
          OR review.reviewerPhone LIKE :search
          OR review.comment LIKE :search
          OR product.name LIKE :search)`,
        { search: `%${query.search.trim()}%` },
      );
    }

    return qb.getMany();
  }

  findByUserAndProduct(
    userId: number,
    productId: number,
  ): Promise<Review | null> {
    return this.repository.findOne({ where: { userId, productId } });
  }

  findById(id: number): Promise<Review | null> {
    return this.repository.findOne({ where: { id } });
  }

  create(data: Partial<Review>): Review {
    return this.repository.create(data);
  }

  save(review: Review): Promise<Review> {
    return this.repository.save(review);
  }

  async remove(review: Review): Promise<void> {
    await this.repository.remove(review);
  }
}
