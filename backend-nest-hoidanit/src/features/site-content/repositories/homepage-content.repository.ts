import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HomepageContent } from '../entities/homepage-content.entity';

@Injectable()
export class HomepageContentRepository {
  constructor(
    @InjectRepository(HomepageContent)
    private readonly repository: Repository<HomepageContent>,
  ) {}

  findById(id: number): Promise<HomepageContent | null> {
    return this.repository.findOne({ where: { id } });
  }

  create(data: Partial<HomepageContent>): HomepageContent {
    return this.repository.create(data);
  }

  save(content: HomepageContent): Promise<HomepageContent> {
    return this.repository.save(content);
  }
}
