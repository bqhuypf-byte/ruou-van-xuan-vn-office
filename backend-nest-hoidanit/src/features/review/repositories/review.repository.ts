import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../entities/review.entity';

@Injectable()
export class ReviewRepository {
  constructor(
    @InjectRepository(Review)
    private readonly repository: Repository<Review>,
  ) {}

  findByProductId(productId: number): Promise<Review[]> {
    return this.repository.find({
      where: { productId },
      order: { createdAt: 'DESC' },
    });
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
