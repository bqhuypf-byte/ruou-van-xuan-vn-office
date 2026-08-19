import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Banner } from '../entities/banner.entity';

@Injectable()
export class BannerRepository {
  constructor(
    @InjectRepository(Banner)
    private readonly repository: Repository<Banner>,
  ) {}

  findActiveSorted(): Promise<Banner[]> {
    return this.repository.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC' },
    });
  }

  findAllSorted(): Promise<Banner[]> {
    return this.repository.find({ order: { sortOrder: 'ASC' } });
  }

  findById(id: number): Promise<Banner | null> {
    return this.repository.findOne({ where: { id } });
  }

  create(data: Partial<Banner>): Banner {
    return this.repository.create(data);
  }

  save(banner: Banner): Promise<Banner> {
    return this.repository.save(banner);
  }

  async remove(banner: Banner): Promise<void> {
    await this.repository.remove(banner);
  }
}
