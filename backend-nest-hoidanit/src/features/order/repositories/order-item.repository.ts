import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { OrderItem } from '../entities/order-item.entity';

@Injectable()
export class OrderItemRepository {
  constructor(
    @InjectRepository(OrderItem)
    private readonly repository: Repository<OrderItem>,
  ) {}

  findByOrderId(orderId: number): Promise<OrderItem[]> {
    return this.repository.find({ where: { orderId } });
  }

  create(data: Partial<OrderItem>): OrderItem {
    return this.repository.create(data);
  }

  save(items: OrderItem[]): Promise<OrderItem[]> {
    return this.repository.save(items);
  }

  async removeByOrderIds(orderIds: number[]): Promise<void> {
    if (orderIds.length === 0) return;
    await this.repository.delete({ orderId: In(orderIds) });
  }
}
