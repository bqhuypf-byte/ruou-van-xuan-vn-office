import { Injectable, NotFoundException } from '@nestjs/common';
import { assignDefined } from '../../shared/utils/assign-defined.util';
import { ReviewRepository } from './repositories/review.repository';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review, ReviewStatus } from './entities/review.entity';
import { AdminReviewResponse, ReviewResponse } from './types/review.types';
import { UsersService } from '../users/users.service';
import { QueryAdminReviewsDto } from './dto/query-admin-reviews.dto';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly usersService: UsersService,
  ) {}

  private async toResponse(review: Review): Promise<ReviewResponse> {
    const user = review.userId
      ? await this.usersService.findOne(review.userId)
      : null;
    return {
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      imageUrls: review.imageUrls ?? [],
      createdAt: review.createdAt,
      user: {
        id: user?.id ?? null,
        fullName: review.reviewerName ?? user?.fullName ?? 'Khách hàng',
      },
    };
  }

  async findByProduct(productId: number): Promise<ReviewResponse[]> {
    const reviews = await this.reviewRepository.findByProductId(productId);
    return Promise.all(reviews.map((review) => this.toResponse(review)));
  }

  async findAllAdmin(
    query: QueryAdminReviewsDto,
  ): Promise<AdminReviewResponse[]> {
    const reviews = await this.reviewRepository.findAllAdmin(query);
    return Promise.all(reviews.map((review) => this.toAdminResponse(review)));
  }

  private async toAdminResponse(review: Review): Promise<AdminReviewResponse> {
    return {
      ...(await this.toResponse(review)),
      status: review.status,
      reviewerEmail: review.reviewerEmail,
      reviewerPhone: review.reviewerPhone,
      orderId: review.orderId,
      product: {
        id: review.product.id,
        name: review.product.name,
        slug: review.product.slug,
        thumbnailUrl: review.product.thumbnailUrl,
      },
    };
  }

  async create(
    productId: number,
    dto: CreateReviewDto,
  ): Promise<ReviewResponse> {
    const review = this.reviewRepository.create({
      userId: null,
      productId,
      orderId: null,
      reviewerName: dto.fullName.trim(),
      reviewerEmail: dto.email.trim().toLowerCase(),
      reviewerPhone: dto.phone.trim(),
      rating: dto.rating,
      comment: dto.comment ?? null,
      imageUrls: dto.imageUrls?.length ? dto.imageUrls : null,
      status: 'pending',
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
    assignDefined(review, dto);
    review.status = 'pending';
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

  async moderate(id: number, status: ReviewStatus): Promise<void> {
    const review = await this.reviewRepository.findById(id);
    if (!review) {
      throw new NotFoundException(`Review #${id} not found`);
    }
    review.status = status;
    await this.reviewRepository.save(review);
  }
}
