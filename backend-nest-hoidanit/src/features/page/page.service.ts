import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { assignDefined } from '../../shared/utils/assign-defined.util';
import { PageRepository } from './repositories/page.repository';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { Page } from './entities/page.entity';

@Injectable()
export class PageService {
  constructor(private readonly pageRepository: PageRepository) {}

  findAll(): Promise<Page[]> {
    return this.pageRepository.findAllSorted();
  }

  async findOne(id: number): Promise<Page> {
    const page = await this.pageRepository.findById(id);
    if (!page) {
      throw new NotFoundException(`Page #${id} not found`);
    }
    return page;
  }

  async findActiveBySlug(slug: string): Promise<Page> {
    const page = await this.pageRepository.findActiveBySlug(slug);
    if (!page) {
      throw new NotFoundException(`Page "${slug}" not found`);
    }
    return page;
  }

  async create(dto: CreatePageDto): Promise<Page> {
    const existing = await this.pageRepository.findBySlug(dto.slug);
    if (existing) {
      throw new ConflictException(`Slug "${dto.slug}" đã được sử dụng`);
    }
    const page = this.pageRepository.create(dto);
    return this.pageRepository.save(page);
  }

  async update(id: number, dto: UpdatePageDto): Promise<Page> {
    const page = await this.findOne(id);
    if (dto.slug && dto.slug !== page.slug) {
      const existing = await this.pageRepository.findBySlug(dto.slug);
      if (existing) {
        throw new ConflictException(`Slug "${dto.slug}" đã được sử dụng`);
      }
    }
    assignDefined(page, dto);
    return this.pageRepository.save(page);
  }

  async remove(id: number): Promise<void> {
    const page = await this.findOne(id);
    await this.pageRepository.remove(page);
  }
}
