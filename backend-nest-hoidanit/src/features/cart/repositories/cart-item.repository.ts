import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from '../entities/cart-item.entity';

@Injectable()
export class CartItemRepository {
  constructor(
    @InjectRepository(CartItem)
    private readonly repository: Repository<CartItem>,
  ) {}

  findByCartId(cartId: number): Promise<CartItem[]> {
    return this.repository.find({ where: { cartId } });
  }

  findByIdAndCart(id: number, cartId: number): Promise<CartItem | null> {
    return this.repository.findOne({ where: { id, cartId } });
  }

  findByCartAndVariant(
    cartId: number,
    productVariantId: number,
  ): Promise<CartItem | null> {
    return this.repository.findOne({ where: { cartId, productVariantId } });
  }

  create(data: Partial<CartItem>): CartItem {
    return this.repository.create(data);
  }

  save(item: CartItem): Promise<CartItem> {
    return this.repository.save(item);
  }

  async remove(item: CartItem): Promise<void> {
    await this.repository.remove(item);
  }

  async removeAllByCart(cartId: number): Promise<void> {
    await this.repository.delete({ cartId });
  }
}
