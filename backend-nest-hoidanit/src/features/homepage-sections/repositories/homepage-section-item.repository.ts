import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HomepageSectionItem } from '../entities/homepage-section-item.entity';

@Injectable()
export class HomepageSectionItemRepository {
  constructor(
    @InjectRepository(HomepageSectionItem)
    private readonly repository: Repository<HomepageSectionItem>,
  ) {}

  findBySectionId(sectionId: number): Promise<HomepageSectionItem[]> {
    return this.repository.find({
      where: { sectionId },
      order: { sortOrder: 'ASC' },
    });
  }

  findBySectionIds(sectionIds: number[]): Promise<HomepageSectionItem[]> {
    if (sectionIds.length === 0) return Promise.resolve([]);
    return this.repository
      .createQueryBuilder('item')
      .where('item.sectionId IN (:...sectionIds)', { sectionIds })
      .orderBy('item.sortOrder', 'ASC')
      .getMany();
  }

  findById(id: number): Promise<HomepageSectionItem | null> {
    return this.repository.findOne({ where: { id } });
  }

  findBySectionAndProduct(
    sectionId: number,
    productId: number,
  ): Promise<HomepageSectionItem | null> {
    return this.repository.findOne({ where: { sectionId, productId } });
  }

  create(data: Partial<HomepageSectionItem>): HomepageSectionItem {
    return this.repository.create(data);
  }

  save(item: HomepageSectionItem): Promise<HomepageSectionItem> {
    return this.repository.save(item);
  }

  saveMany(items: HomepageSectionItem[]): Promise<HomepageSectionItem[]> {
    return this.repository.save(items);
  }

  async remove(item: HomepageSectionItem): Promise<void> {
    await this.repository.remove(item);
  }
}
