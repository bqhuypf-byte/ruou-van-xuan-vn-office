import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../entities/cart.entity';

@Injectable()
export class CartRepository {
  constructor(
    @InjectRepository(Cart)
    private readonly repository: Repository<Cart>,
  ) {}

  findById(id: number): Promise<Cart | null> {
    return this.repository.findOne({ where: { id } });
  }

  findByUserId(userId: number): Promise<Cart | null> {
    return this.repository.findOne({ where: { userId } });
  }

  findBySessionId(sessionId: string): Promise<Cart | null> {
    return this.repository.findOne({ where: { sessionId } });
  }

  create(data: Partial<Cart>): Cart {
    return this.repository.create(data);
  }

  save(cart: Cart): Promise<Cart> {
    return this.repository.save(cart);
  }

  async remove(cart: Cart): Promise<void> {
    await this.repository.remove(cart);
  }
}
