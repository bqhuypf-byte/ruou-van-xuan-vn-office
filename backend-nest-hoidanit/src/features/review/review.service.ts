import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ReviewRepository } from './repositories/review.repository';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';
import { ReviewResponse } from './types/review.types';
import { OrderService } from '../order/services/order.service';
import { ProductVariantService } from '../product/services/product-variant.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly orderService: OrderService,
    private readonly variantService: ProductVariantService,
    private readonly usersService: UsersService,
  ) {}

  private async toResponse(review: Review): Promise<ReviewResponse> {
    const user = await this.usersService.findOne(review.userId);
    return {
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      user: { id: user.id, fullName: user.fullName },
    };
  }

  async findByProduct(productId: number): Promise<ReviewResponse[]> {
    const reviews = await this.reviewRepository.findByProductId(productId);
    return Promise.all(reviews.map((review) => this.toResponse(review)));
  }

  private async assertPurchased(
    productId: number,
    userId: number,
    orderId: number,
  ): Promise<void> {
    const order = await this.orderService.findOneForUser(orderId, userId);

    for (const item of order.items) {
      try {
        const variant = await this.variantService.findById(
          item.productVariantId,
        );
        if (Number(variant.productId) === productId) {
          return;
        }
      } catch {
        // Variant no longer resolves (e.g. stale snapshot); treat as non-matching
        // rather than letting a lookup failure masquerade as a purchase-verification error.
        continue;
      }
    }

    throw new ForbiddenException(
      'You must purchase this product before reviewing it',
    );
  }

  async create(
    productId: number,
    userId: number,
    dto: CreateReviewDto,
  ): Promise<ReviewResponse> {
    await this.assertPurchased(productId, userId, dto.orderId);

    const existing = await this.reviewRepository.findByUserAndProduct(
      userId,
      productId,
    );
    if (existing) {
      throw new BadRequestException('You have already reviewed this product');
    }

    const review = this.reviewRepository.create({
      userId,
      productId,
      orderId: dto.orderId,
      rating: dto.rating,
      comment: dto.comment ?? null,
    });
    const saved = await this.reviewRepository.save(review);
    return this.toResponse(saved);
  }

  private async findOwned(id: number, userId: number): Promise<Review> {
    const review = await this.reviewRepository.findById(id);
    if (!review || review.userId !== userId) {
      throw new NotFoundException(`Review #${id} not found`);
    }
    return review;
  }

  async update(
    id: number,
    userId: number,
    dto: UpdateReviewDto,
  ): Promise<ReviewResponse> {
    const review = await this.findOwned(id, userId);
    Object.assign(review, dto);
    const saved = await this.reviewRepository.save(review);
    return this.toResponse(saved);
  }

  async remove(id: number, userId: number): Promise<void> {
    const review = await this.findOwned(id, userId);
    await this.reviewRepository.remove(review);
  }

  async removeAsAdmin(id: number): Promise<void> {
    const review = await this.reviewRepository.findById(id);
    if (!review) {
      throw new NotFoundException(`Review #${id} not found`);
    }
    await this.reviewRepository.remove(review);
  }
}
