import { Injectable, NotFoundException } from '@nestjs/common';
import { assignDefined } from '../../shared/utils/assign-defined.util';
import { FaqRepository } from './repositories/faq.repository';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { Faq } from './entities/faq.entity';

@Injectable()
export class FaqService {
  constructor(private readonly faqRepository: FaqRepository) {}

  findActive(): Promise<Faq[]> {
    return this.faqRepository.findActiveSorted();
  }

  findAll(): Promise<Faq[]> {
    return this.faqRepository.findAllSorted();
  }

  async create(dto: CreateFaqDto): Promise<Faq> {
    const faq = this.faqRepository.create(dto);
    return this.faqRepository.save(faq);
  }

  async update(id: number, dto: UpdateFaqDto): Promise<Faq> {
    const faq = await this.faqRepository.findById(id);
    if (!faq) {
      throw new NotFoundException(`Faq #${id} not found`);
    }
    assignDefined(faq, dto);
    return this.faqRepository.save(faq);
  }

  async remove(id: number): Promise<void> {
    const faq = await this.faqRepository.findById(id);
    if (!faq) {
      throw new NotFoundException(`Faq #${id} not found`);
    }
    await this.faqRepository.remove(faq);
  }
}
