import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { HomepageSectionRepository } from './repositories/homepage-section.repository';
import { HomepageSectionItemRepository } from './repositories/homepage-section-item.repository';
import { ProductService } from '../product/services/product.service';
import { CreateHomepageSectionDto } from './dto/create-homepage-section.dto';
import { UpdateHomepageSectionDto } from './dto/update-homepage-section.dto';
import { AddSectionItemDto } from './dto/add-section-item.dto';
import { UpdateSectionItemDto } from './dto/update-section-item.dto';
import { HomepageSection } from './entities/homepage-section.entity';
import { HomepageSectionItem } from './entities/homepage-section-item.entity';
import {
  HomepageSectionItemView,
  HomepageSectionView,
} from './types/homepage-section.types';

@Injectable()
export class HomepageSectionService {
  private readonly logger = new Logger(HomepageSectionService.name);

  constructor(
    private readonly sectionRepository: HomepageSectionRepository,
    private readonly itemRepository: HomepageSectionItemRepository,
    private readonly productService: ProductService,
  ) {}

  /**
   * Homepage sections are auto-generated from category names at seed time but
   * have no FK to categories. When a category is deleted, drop the homepage
   * section that shares its exact title so stale sections don't linger.
   */
  @OnEvent('category.deleted')
  async handleCategoryDeleted({ name }: { id: number; name: string }): Promise<void> {
    const section = await this.sectionRepository.findByTitle(name);
    if (!section) return;
    await this.sectionRepository.remove(section);
    this.logger.log(
      `Removed homepage section "${name}" after its source category was deleted`,
    );
  }

  /**
   * Keeps the homepage section that mirrors a category (matched by title,
   * same convention as handleCategoryDeleted) in sync with that category's
   * own display settings — title, sort order, display style and whether it
   * should show at all — every time the category is created or edited.
   */
  @OnEvent('category.saved')
  async handleCategorySaved(payload: {
    previousTitle: string | null;
    name: string;
    homeSectionTitle: string | null;
    showInProductSections: boolean;
    homeSortOrder: number;
    homeDisplayStyle: 'grid' | 'carousel';
  }): Promise<void> {
    const newTitle = payload.homeSectionTitle || payload.name;
    let section = payload.previousTitle
      ? await this.sectionRepository.findByTitle(payload.previousTitle)
      : null;
    if (!section) {
      section = await this.sectionRepository.findByTitle(newTitle);
    }

    if (!payload.showInProductSections) {
      if (section && section.isActive) {
        section.isActive = false;
        await this.sectionRepository.save(section);
        this.logger.log(`Deactivated homepage section "${section.title}"`);
      }
      return;
    }

    if (!section) {
      section = this.sectionRepository.create({
        title: newTitle,
        displayStyle: payload.homeDisplayStyle,
        sortOrder: payload.homeSortOrder,
        isActive: true,
      });
      this.logger.log(`Created homepage section "${newTitle}" from category`);
    } else {
      section.title = newTitle;
      section.displayStyle = payload.homeDisplayStyle;
      section.sortOrder = payload.homeSortOrder;
      section.isActive = true;
    }
    await this.sectionRepository.save(section);
  }

  private async buildViews(
    sections: HomepageSection[],
    { onlyActiveProducts }: { onlyActiveProducts: boolean },
  ): Promise<HomepageSectionView[]> {
    const sectionIds = sections.map((section) => section.id);
    const items = await this.itemRepository.findBySectionIds(sectionIds);

    const productIds = [...new Set(items.map((item) => item.productId))];
    const products = await this.productService.findManyWithPricing(productIds);
    const productById = new Map(
      products.map((product) => [product.id, product]),
    );

    const itemsBySection = new Map<number, HomepageSectionItem[]>();
    for (const item of items) {
      const list = itemsBySection.get(item.sectionId) ?? [];
      list.push(item);
      itemsBySection.set(item.sectionId, list);
    }

    return sections.map((section) => {
      const sectionItems = (itemsBySection.get(section.id) ?? [])
        .map((item): HomepageSectionItemView | null => {
          const product = productById.get(item.productId);
          if (!product || (onlyActiveProducts && !product.isActive))
            return null;

          return {
            id: item.id,
            productId: item.productId,
            sortOrder: item.sortOrder,
            badgeText: item.badgeText,
            overridePrice:
              item.overridePrice !== null ? Number(item.overridePrice) : null,
            overrideOriginalPrice:
              item.overrideOriginalPrice !== null
                ? Number(item.overrideOriginalPrice)
                : null,
            product: {
              id: product.id,
              name: product.name,
              slug: product.slug,
              thumbnailUrl: product.thumbnailUrl,
              price: product.price,
              salePrice: product.salePrice,
              rating: product.rating,
              reviewCount: product.reviewCount,
            },
          };
        })
        .filter((item): item is HomepageSectionItemView => item !== null);

      return {
        id: section.id,
        title: section.title,
        displayStyle: section.displayStyle,
        sortOrder: section.sortOrder,
        isActive: section.isActive,
        items: sectionItems,
      };
    });
  }

  async findPublicSections(): Promise<HomepageSectionView[]> {
    const sections = await this.sectionRepository.findActiveSorted();
    return this.buildViews(sections, { onlyActiveProducts: true });
  }

  async findAllForAdmin(): Promise<HomepageSectionView[]> {
    const sections = await this.sectionRepository.findAllSorted();
    return this.buildViews(sections, { onlyActiveProducts: false });
  }

  private async getSectionById(id: number): Promise<HomepageSection> {
    const section = await this.sectionRepository.findById(id);
    if (!section) {
      throw new NotFoundException(`Homepage section #${id} not found`);
    }
    return section;
  }

  async createSection(dto: CreateHomepageSectionDto): Promise<HomepageSection> {
    const section = this.sectionRepository.create(dto);
    return this.sectionRepository.save(section);
  }

  async updateSection(
    id: number,
    dto: UpdateHomepageSectionDto,
  ): Promise<HomepageSection> {
    const section = await this.getSectionById(id);
    if (dto.title !== undefined) section.title = dto.title;
    if (dto.displayStyle !== undefined) section.displayStyle = dto.displayStyle;
    if (dto.sortOrder !== undefined) section.sortOrder = dto.sortOrder;
    if (dto.isActive !== undefined) section.isActive = dto.isActive;
    return this.sectionRepository.save(section);
  }

  async removeSection(id: number): Promise<void> {
    const section = await this.getSectionById(id);
    await this.sectionRepository.remove(section);
  }

  async reorderSections(ids: number[]): Promise<void> {
    const sections = await this.sectionRepository.findByIds(ids);
    const sectionById = new Map(
      sections.map((section) => [section.id, section]),
    );

    const toSave: HomepageSection[] = [];
    ids.forEach((id, index) => {
      const section = sectionById.get(id);
      if (section && section.sortOrder !== index) {
        section.sortOrder = index;
        toSave.push(section);
      }
    });
    await this.sectionRepository.saveMany(toSave);
  }

  async addItem(
    sectionId: number,
    dto: AddSectionItemDto,
  ): Promise<HomepageSectionItem> {
    await this.getSectionById(sectionId);

    const product = await this.productService.findByIdOrNull(dto.productId);
    if (!product) {
      throw new NotFoundException(`Product #${dto.productId} not found`);
    }

    const existing = await this.itemRepository.findBySectionAndProduct(
      sectionId,
      dto.productId,
    );
    if (existing) {
      throw new ConflictException('Product already added to this section');
    }

    const item = this.itemRepository.create({
      sectionId,
      productId: dto.productId,
      sortOrder: dto.sortOrder ?? 0,
      overridePrice:
        dto.overridePrice !== undefined ? String(dto.overridePrice) : null,
      overrideOriginalPrice:
        dto.overrideOriginalPrice !== undefined
          ? String(dto.overrideOriginalPrice)
          : null,
      badgeText: dto.badgeText ?? null,
    });
    return this.itemRepository.save(item);
  }

  async updateItem(
    sectionId: number,
    itemId: number,
    dto: UpdateSectionItemDto,
  ): Promise<HomepageSectionItem> {
    const item = await this.itemRepository.findById(itemId);
    if (!item || item.sectionId !== sectionId) {
      throw new NotFoundException(
        `Item #${itemId} not found in section #${sectionId}`,
      );
    }

    if (dto.sortOrder !== undefined) item.sortOrder = dto.sortOrder;
    if (dto.overridePrice !== undefined) {
      item.overridePrice =
        dto.overridePrice !== null ? String(dto.overridePrice) : null;
    }
    if (dto.overrideOriginalPrice !== undefined) {
      item.overrideOriginalPrice =
        dto.overrideOriginalPrice !== null
          ? String(dto.overrideOriginalPrice)
          : null;
    }
    if (dto.badgeText !== undefined) {
      item.badgeText = dto.badgeText ?? null;
    }

    return this.itemRepository.save(item);
  }

  async removeItem(sectionId: number, itemId: number): Promise<void> {
    const item = await this.itemRepository.findById(itemId);
    if (!item || item.sectionId !== sectionId) {
      throw new NotFoundException(
        `Item #${itemId} not found in section #${sectionId}`,
      );
    }
    await this.itemRepository.remove(item);
  }

  async reorderItems(sectionId: number, ids: number[]): Promise<void> {
    await this.getSectionById(sectionId);
    const items = await this.itemRepository.findBySectionId(sectionId);
    const itemById = new Map(items.map((item) => [item.id, item]));

    const toSave: HomepageSectionItem[] = [];
    ids.forEach((id, index) => {
      const item = itemById.get(id);
      if (item && item.sortOrder !== index) {
        item.sortOrder = index;
        toSave.push(item);
      }
    });
    await this.itemRepository.saveMany(toSave);
  }
}
