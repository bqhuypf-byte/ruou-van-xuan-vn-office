import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HomepageSection } from '../entities/homepage-section.entity';

@Injectable()
export class HomepageSectionRepository {
  constructor(
    @InjectRepository(HomepageSection)
    private readonly repository: Repository<HomepageSection>,
  ) {}

  findActiveSorted(): Promise<HomepageSection[]> {
    return this.repository.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC' },
    });
  }

  findAllSorted(): Promise<HomepageSection[]> {
    return this.repository.find({ order: { sortOrder: 'ASC' } });
  }

  findById(id: number): Promise<HomepageSection | null> {
    return this.repository.findOne({ where: { id } });
  }

  findByIds(ids: number[]): Promise<HomepageSection[]> {
    if (ids.length === 0) return Promise.resolve([]);
    return this.repository
      .createQueryBuilder('section')
      .where('section.id IN (:...ids)', { ids })
      .getMany();
  }

  create(data: Partial<HomepageSection>): HomepageSection {
    return this.repository.create(data);
  }

  save(section: HomepageSection): Promise<HomepageSection> {
    return this.repository.save(section);
  }

  saveMany(sections: HomepageSection[]): Promise<HomepageSection[]> {
    return this.repository.save(sections);
  }

  async remove(section: HomepageSection): Promise<void> {
    await this.repository.remove(section);
  }
}
