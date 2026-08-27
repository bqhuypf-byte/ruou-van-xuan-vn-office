import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderStatus } from '../types/order-status.type';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(Order)
    private readonly repository: Repository<Order>,
  ) {}

  findAllByUser(userId: number): Promise<Order[]> {
    return this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  findByIdAndUser(id: number, userId: number): Promise<Order | null> {
    return this.repository.findOne({ where: { id, userId } });
  }

  findAll(statuses?: OrderStatus[]): Promise<Order[]> {
    return this.repository.find({
      where: statuses && statuses.length > 0 ? { status: In(statuses) } : {},
      order: { createdAt: 'DESC' },
    });
  }

  findById(id: number): Promise<Order | null> {
    return this.repository.findOne({ where: { id } });
  }

  create(data: Partial<Order>): Order {
    return this.repository.create(data);
  }

  save(order: Order): Promise<Order> {
    return this.repository.save(order);
  }

  async removeByIds(ids: number[]): Promise<void> {
    if (ids.length === 0) return;
    await this.repository.delete({ id: In(ids) });
  }
}
