import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Page } from '../entities/page.entity';

@Injectable()
export class PageRepository {
  constructor(
    @InjectRepository(Page)
    private readonly repository: Repository<Page>,
  ) {}

  findAllSorted(): Promise<Page[]> {
    return this.repository.find({ order: { title: 'ASC' } });
  }

  findById(id: number): Promise<Page | null> {
    return this.repository.findOne({ where: { id } });
  }

  findBySlug(slug: string): Promise<Page | null> {
    return this.repository.findOne({ where: { slug } });
  }

  findActiveBySlug(slug: string): Promise<Page | null> {
    return this.repository.findOne({ where: { slug, isActive: true } });
  }

  create(data: Partial<Page>): Page {
    return this.repository.create(data);
  }

  save(page: Page): Promise<Page> {
    return this.repository.save(page);
  }

  async remove(page: Page): Promise<void> {
    await this.repository.remove(page);
  }
}
