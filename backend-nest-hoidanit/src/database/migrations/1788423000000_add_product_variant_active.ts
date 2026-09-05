import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddProductVariantActive1788423000000 implements MigrationInterface {
  name = 'AddProductVariantActive1788423000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasColumn('product_variants', 'is_active'))) {
      await queryRunner.addColumn(
        'product_variants',
        new TableColumn({
          name: 'is_active',
          type: 'boolean',
          default: true,
        }),
      );
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasColumn('product_variants', 'is_active')) {
      await queryRunner.dropColumn('product_variants', 'is_active');
    }
  }
}
