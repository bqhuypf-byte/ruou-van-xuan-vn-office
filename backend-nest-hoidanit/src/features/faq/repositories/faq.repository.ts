import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Faq } from '../entities/faq.entity';

@Injectable()
export class FaqRepository {
  constructor(
    @InjectRepository(Faq)
    private readonly repository: Repository<Faq>,
  ) {}

  findActiveSorted(): Promise<Faq[]> {
    return this.repository.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC' },
    });
  }

  findAllSorted(): Promise<Faq[]> {
    return this.repository.find({ order: { sortOrder: 'ASC' } });
  }

  findById(id: number): Promise<Faq | null> {
    return this.repository.findOne({ where: { id } });
  }

  create(data: Partial<Faq>): Faq {
    return this.repository.create(data);
  }

  save(faq: Faq): Promise<Faq> {
    return this.repository.save(faq);
  }

  async remove(faq: Faq): Promise<void> {
    await this.repository.remove(faq);
  }
}
