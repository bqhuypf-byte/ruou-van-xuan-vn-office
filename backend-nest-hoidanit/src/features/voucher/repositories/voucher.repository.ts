import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Voucher } from '../entities/voucher.entity';

@Injectable()
export class VoucherRepository {
  constructor(
    @InjectRepository(Voucher)
    private readonly repository: Repository<Voucher>,
  ) {}

  async findActiveSorted(): Promise<Voucher[]> {
    const today = new Date().toISOString().slice(0, 10);
    const all = await this.repository.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });
    return all.filter(
      (v) =>
        (!v.startDate || v.startDate <= today) && (!v.endDate || v.endDate >= today),
    );
  }

  findAllSorted(): Promise<Voucher[]> {
    return this.repository.find({ order: { sortOrder: 'ASC', createdAt: 'DESC' } });
  }

  findById(id: number): Promise<Voucher | null> {
    return this.repository.findOne({ where: { id } });
  }

  findByCode(code: string): Promise<Voucher | null> {
    return this.repository.findOne({ where: { code } });
  }

  create(data: Partial<Voucher>): Voucher {
    return this.repository.create(data);
  }

  save(voucher: Voucher): Promise<Voucher> {
    return this.repository.save(voucher);
  }

  async remove(voucher: Voucher): Promise<void> {
    await this.repository.remove(voucher);
  }
}
