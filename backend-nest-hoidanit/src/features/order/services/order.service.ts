import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderRepository } from '../repositories/order.repository';
import { OrderItemRepository } from '../repositories/order-item.repository';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { OrderStatus } from '../types/order-status.type';
import { PaymentStatus } from '../types/payment-status.type';

const NON_CANCELLABLE_STATUSES: OrderStatus[] = [
  'shipping',
  'delivered',
  'cancelled',
];

export type OrderWithItems = Order & { items: OrderItem[] };

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly orderItemRepository: OrderItemRepository,
  ) {}

  private async attachItems(order: Order): Promise<OrderWithItems> {
    const items = await this.orderItemRepository.findByOrderId(order.id);
    return { ...order, items };
  }

  async findAllForUser(userId: number): Promise<OrderWithItems[]> {
    const orders = await this.orderRepository.findAllByUser(userId);
    return Promise.all(orders.map((order) => this.attachItems(order)));
  }

  async findOneForUser(id: number, userId: number): Promise<OrderWithItems> {
    const order = await this.orderRepository.findByIdAndUser(id, userId);
    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    return this.attachItems(order);
  }

  async cancel(id: number, userId: number): Promise<OrderWithItems> {
    const order = await this.orderRepository.findByIdAndUser(id, userId);
    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    if (NON_CANCELLABLE_STATUSES.includes(order.status)) {
      throw new BadRequestException(
        `Order #${id} cannot be cancelled (status: ${order.status})`,
      );
    }

    order.status = 'cancelled';
    const saved = await this.orderRepository.save(order);
    return this.attachItems(saved);
  }

  async findAllAdmin(statusFilter?: string): Promise<OrderWithItems[]> {
    const statuses = statusFilter
      ? (statusFilter.split(',') as OrderStatus[])
      : undefined;
    const orders = await this.orderRepository.findAll(statuses);
    return Promise.all(orders.map((order) => this.attachItems(order)));
  }

  async updateStatus(id: number, status: OrderStatus): Promise<OrderWithItems> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    order.status = status;
    const saved = await this.orderRepository.save(order);
    return this.attachItems(saved);
  }

  async updatePayment(
    id: number,
    paymentStatus: PaymentStatus,
  ): Promise<OrderWithItems> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    order.paymentStatus = paymentStatus;
    const saved = await this.orderRepository.save(order);
    return this.attachItems(saved);
  }
}
