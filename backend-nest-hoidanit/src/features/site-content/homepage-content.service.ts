import { Injectable } from '@nestjs/common';
import { assignDefined } from '../../shared/utils/assign-defined.util';
import { HomepageContentRepository } from './repositories/homepage-content.repository';
import { UpdateHomepageContentDto } from './dto/update-homepage-content.dto';
import {
  HOMEPAGE_CONTENT_ID,
  HomepageContent,
} from './entities/homepage-content.entity';

const DEFAULT_CONTENT: Omit<HomepageContent, 'id' | 'updatedAt'> = {
  headline: 'Tìm chai rượu vang hợp gu của bạn',
  subtitle:
    'Khám phá bộ sưu tập rượu vang được tuyển chọn kỹ lưỡng từ khắp thế giới, mang đến trải nghiệm thưởng thức trọn vẹn cho mọi khoảnh khắc của bạn.',
  ctaText: 'Mua Ngay',
  ctaLink: '/products',
  stats: [
    { value: '200+', label: 'Nhà sản xuất' },
    { value: '2.000+', label: 'Sản phẩm cao cấp' },
    { value: '30.000+', label: 'Khách hàng hài lòng' },
  ],
  partnerBrands: [
    'Château Margaux',
    'ĐÀ LẠT WINE',
    'Bordeaux Cellars',
    'Moët & Chandon',
    'Napa Valley',
  ],
};

@Injectable()
export class HomepageContentService {
  constructor(private readonly repository: HomepageContentRepository) {}

  private async findOrCreate(): Promise<HomepageContent> {
    const existing = await this.repository.findById(HOMEPAGE_CONTENT_ID);
    if (existing) {
      return existing;
    }
    const content = this.repository.create({
      id: HOMEPAGE_CONTENT_ID,
      ...DEFAULT_CONTENT,
    });
    return this.repository.save(content);
  }

  async get(): Promise<HomepageContent> {
    return this.findOrCreate();
  }

  async update(dto: UpdateHomepageContentDto): Promise<HomepageContent> {
    const content = await this.findOrCreate();
    assignDefined(content, dto);
    return this.repository.save(content);
  }
}
