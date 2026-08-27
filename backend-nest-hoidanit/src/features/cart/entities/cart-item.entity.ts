import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Cart } from './cart.entity';
import { bigintTransformer } from '../../../shared/utils/bigint.transformer';

@Entity('cart_items')
export class CartItem {
  @PrimaryColumn({
    type: 'bigint',
    generated: 'increment',
    transformer: bigintTransformer,
  })
  id: number;

  @Column({ type: 'bigint', name: 'cart_id', transformer: bigintTransformer })
  cartId: number;

  @Column({
    type: 'bigint',
    name: 'product_variant_id',
    transformer: bigintTransformer,
  })
  productVariantId: number;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @ManyToOne(() => Cart, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;
}
