import { Injectable, NotFoundException } from '@nestjs/common';
import { CartRepository } from './repositories/cart.repository';
import { CartItemRepository } from './repositories/cart-item.repository';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { CartIdentity } from './types/cart.types';

export interface CartView {
  id: number | null;
  items: CartItem[];
}

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly cartItemRepository: CartItemRepository,
  ) {}

  private async findCart(identity: CartIdentity): Promise<Cart | null> {
    if (identity.userId !== null) {
      return this.cartRepository.findByUserId(identity.userId);
    }
    if (identity.sessionId !== null) {
      return this.cartRepository.findBySessionId(identity.sessionId);
    }
    return null;
  }

  private async findOrCreateCart(identity: CartIdentity): Promise<Cart> {
    const existing = await this.findCart(identity);
    if (existing) {
      return existing;
    }
    const cart = this.cartRepository.create({
      userId: identity.userId,
      sessionId: identity.userId === null ? identity.sessionId : null,
    });
    return this.cartRepository.save(cart);
  }

  async getCart(identity: CartIdentity): Promise<CartView> {
    const cart = await this.findCart(identity);
    if (!cart) {
      return { id: null, items: [] };
    }
    const items = await this.cartItemRepository.findByCartId(cart.id);
    return { id: cart.id, items };
  }

  async addItem(
    identity: CartIdentity,
    dto: AddCartItemDto,
  ): Promise<CartView> {
    const cart = await this.findOrCreateCart(identity);

    const existing = await this.cartItemRepository.findByCartAndVariant(
      cart.id,
      dto.productVariantId,
    );

    if (existing) {
      existing.quantity += dto.quantity;
      await this.cartItemRepository.save(existing);
    } else {
      const item = this.cartItemRepository.create({
        cartId: cart.id,
        productVariantId: dto.productVariantId,
        quantity: dto.quantity,
      });
      await this.cartItemRepository.save(item);
    }

    return this.getCart(identity);
  }

  async updateItem(
    identity: CartIdentity,
    itemId: number,
    dto: UpdateCartItemDto,
  ): Promise<CartView> {
    const cart = await this.findCart(identity);
    if (!cart) {
      throw new NotFoundException(`Cart item #${itemId} not found`);
    }

    const item = await this.cartItemRepository.findByIdAndCart(itemId, cart.id);
    if (!item) {
      throw new NotFoundException(`Cart item #${itemId} not found`);
    }

    item.quantity = dto.quantity;
    await this.cartItemRepository.save(item);

    return this.getCart(identity);
  }

  async removeItem(identity: CartIdentity, itemId: number): Promise<CartView> {
    const cart = await this.findCart(identity);
    if (!cart) {
      throw new NotFoundException(`Cart item #${itemId} not found`);
    }

    const item = await this.cartItemRepository.findByIdAndCart(itemId, cart.id);
    if (!item) {
      throw new NotFoundException(`Cart item #${itemId} not found`);
    }

    await this.cartItemRepository.remove(item);

    return this.getCart(identity);
  }

  async clearCart(identity: CartIdentity): Promise<void> {
    const cart = await this.findCart(identity);
    if (!cart) {
      return;
    }
    await this.cartItemRepository.removeAllByCart(cart.id);
  }

  async mergeGuestCart(
    userId: number,
    sessionId: string | null,
  ): Promise<CartView> {
    const userIdentity: CartIdentity = { userId, sessionId: null };

    if (!sessionId) {
      return this.getCart(userIdentity);
    }

    const guestCart = await this.cartRepository.findBySessionId(sessionId);
    if (!guestCart) {
      return this.getCart(userIdentity);
    }

    const userCart = await this.findOrCreateCart(userIdentity);
    const guestItems = await this.cartItemRepository.findByCartId(guestCart.id);

    for (const guestItem of guestItems) {
      const existing = await this.cartItemRepository.findByCartAndVariant(
        userCart.id,
        guestItem.productVariantId,
      );
      if (existing) {
        existing.quantity += guestItem.quantity;
        await this.cartItemRepository.save(existing);
        await this.cartItemRepository.remove(guestItem);
      } else {
        guestItem.cartId = userCart.id;
        await this.cartItemRepository.save(guestItem);
      }
    }

    await this.cartRepository.remove(guestCart);

    return this.getCart(userIdentity);
  }
}
