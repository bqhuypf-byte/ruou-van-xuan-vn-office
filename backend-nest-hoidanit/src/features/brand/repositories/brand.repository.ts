import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from '../entities/brand.entity';

@Injectable()
export class BrandRepository {
  constructor(
    @InjectRepository(Brand)
    private readonly repository: Repository<Brand>,
  ) {}

  findActiveSorted(): Promise<Brand[]> {
    return this.repository.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC' },
    });
  }

  findAllSorted(): Promise<Brand[]> {
    return this.repository.find({ order: { sortOrder: 'ASC' } });
  }

  findById(id: number): Promise<Brand | null> {
    return this.repository.findOne({ where: { id } });
  }

  create(data: Partial<Brand>): Brand {
    return this.repository.create(data);
  }

  save(brand: Brand): Promise<Brand> {
    return this.repository.save(brand);
  }

  async remove(brand: Brand): Promise<void> {
    await this.repository.remove(brand);
  }
}
