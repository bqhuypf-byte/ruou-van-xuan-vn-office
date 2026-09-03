import { MigrationInterface, QueryRunner } from 'typeorm';

type DisplayStyle = 'grid' | 'carousel';

interface SectionDefinition {
  title: string;
  displayStyle: DisplayStyle;
  sortOrder: number;
  productSlugs: string[];
  sourceTitle?: string;
  itemOverrides?: Record<
    string,
    {
      badgeText: string;
      overridePrice: number;
      overrideOriginalPrice: number;
    }
  >;
}

interface IdRow {
  id: string | number;
}

interface ProductRow extends IdRow {
  slug: string;
}

const LOCAL_HOMEPAGE: SectionDefinition[] = [
  {
    title: 'Sản Phẩm Nổi Bật',
    displayStyle: 'grid',
    sortOrder: 0,
    productSlugs: [
      'ruou-nep-van-xuan-40-do',
      'ruou-nep-chuoi-hot-van-xuan',
      'ruou-nep-than-van-xuan',
    ],
    itemOverrides: {
      'ruou-nep-van-xuan-40-do': {
        badgeText: '20%',
        overridePrice: 480000,
        overrideOriginalPrice: 520000,
      },
    },
  },
  {
    title: 'Rượu Nếp',
    displayStyle: 'grid',
    sortOrder: 1,
    productSlugs: ['ruou-nep-van-xuan-40-do', 'ruou-nep-van-xuan-can-10-lit'],
  },
  {
    title: 'Rượu Ngâm',
    displayStyle: 'grid',
    sortOrder: 2,
    productSlugs: ['ruou-nep-chuoi-hot-van-xuan', 'ruou-nep-than-van-xuan'],
  },
  {
    title: 'Rượu Gạo',
    sourceTitle: 'Quà Tặng',
    displayStyle: 'carousel',
    sortOrder: 3,
    productSlugs: ['ruou-nep-van-xuan-can-10-lit', 'ruou-nep-sua-van-xuan'],
  },
];

const PREVIOUS_PRODUCTION_HOMEPAGE: SectionDefinition[] = [
  {
    title: 'Sản Phẩm Nổi Bật',
    displayStyle: 'carousel',
    sortOrder: 0,
    productSlugs: ['ruou-nep-chuoi-hot-van-xuan', 'ruou-nep-van-xuan-40-do'],
  },
  {
    title: 'Rượu Ngâm',
    displayStyle: 'grid',
    sortOrder: 0,
    productSlugs: ['hop-qua-whisky-chivas-18', 'ruou-nep-than-van-xuan'],
  },
  {
    title: 'Quà Tặng',
    sourceTitle: 'Rượu Gạo',
    displayStyle: 'grid',
    sortOrder: 0,
    productSlugs: ['hop-qua-whisky-chivas-18', 'ruou-nep-van-xuan-can-10-lit'],
  },
];

export class SyncHomepageSectionsWithLocal1788417000000 implements MigrationInterface {
  name = 'SyncHomepageSectionsWithLocal1788417000000';

  private async findSectionId(
    queryRunner: QueryRunner,
    title: string,
  ): Promise<number | null> {
    const rows = (await queryRunner.query(
      'SELECT `id` FROM `homepage_sections` WHERE `title` = ? LIMIT 1',
      [title],
    )) as IdRow[];
    return rows.length > 0 ? Number(rows[0].id) : null;
  }

  private async getProductIds(
    queryRunner: QueryRunner,
    definitions: SectionDefinition[],
  ): Promise<Map<string, number>> {
    const slugs = [
      ...new Set(definitions.flatMap((section) => section.productSlugs)),
    ];
    const placeholders = slugs.map(() => '?').join(', ');
    const rows = (await queryRunner.query(
      `SELECT \`id\`, \`slug\` FROM \`products\` WHERE \`slug\` IN (${placeholders}) AND \`is_active\` = 1`,
      slugs,
    )) as ProductRow[];
    const ids = new Map(rows.map((row) => [row.slug, Number(row.id)]));
    const missing = slugs.filter((slug) => !ids.has(slug));

    if (missing.length > 0) {
      throw new Error(
        `Cannot sync homepage sections. Missing active products: ${missing.join(', ')}`,
      );
    }

    return ids;
  }

  private async syncSections(
    queryRunner: QueryRunner,
    definitions: SectionDefinition[],
  ): Promise<void> {
    const productIds = await this.getProductIds(queryRunner, definitions);

    for (const definition of definitions) {
      let sectionId = await this.findSectionId(queryRunner, definition.title);

      if (sectionId === null && definition.sourceTitle) {
        sectionId = await this.findSectionId(
          queryRunner,
          definition.sourceTitle,
        );
      }

      if (sectionId === null) {
        const result = (await queryRunner.query(
          'INSERT INTO `homepage_sections` (`title`, `display_style`, `sort_order`, `is_active`) VALUES (?, ?, ?, 1)',
          [definition.title, definition.displayStyle, definition.sortOrder],
        )) as { insertId: number };
        sectionId = Number(result.insertId);
      } else {
        await queryRunner.query(
          'UPDATE `homepage_sections` SET `title` = ?, `display_style` = ?, `sort_order` = ?, `is_active` = 1 WHERE `id` = ?',
          [
            definition.title,
            definition.displayStyle,
            definition.sortOrder,
            sectionId,
          ],
        );
      }

      await queryRunner.query(
        'DELETE FROM `homepage_section_items` WHERE `section_id` = ?',
        [sectionId],
      );

      for (const [itemIndex, slug] of definition.productSlugs.entries()) {
        const overrides = definition.itemOverrides?.[slug];
        await queryRunner.query(
          'INSERT INTO `homepage_section_items` (`section_id`, `product_id`, `sort_order`, `override_price`, `override_original_price`, `badge_text`) VALUES (?, ?, ?, ?, ?, ?)',
          [
            sectionId,
            productIds.get(slug),
            itemIndex,
            overrides?.overridePrice ?? null,
            overrides?.overrideOriginalPrice ?? null,
            overrides?.badgeText ?? null,
          ],
        );
      }
    }
  }

  async up(queryRunner: QueryRunner): Promise<void> {
    await this.syncSections(queryRunner, LOCAL_HOMEPAGE);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    const localOnlySectionId = await this.findSectionId(
      queryRunner,
      'Rượu Nếp',
    );
    if (localOnlySectionId !== null) {
      await queryRunner.query(
        'DELETE FROM `homepage_sections` WHERE `id` = ?',
        [localOnlySectionId],
      );
    }

    await this.syncSections(queryRunner, PREVIOUS_PRODUCTION_HOMEPAGE);
  }
}
