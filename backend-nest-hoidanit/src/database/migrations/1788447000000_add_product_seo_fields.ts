import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddProductSeoFields1788447000000 implements MigrationInterface {
  name = 'AddProductSeoFields1788447000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    const columns = [
      new TableColumn({
        name: 'seo_title',
        type: 'varchar',
        length: '255',
        isNullable: true,
      }),
      new TableColumn({
        name: 'seo_description',
        type: 'varchar',
        length: '500',
        isNullable: true,
      }),
      new TableColumn({
        name: 'image_alt_text',
        type: 'varchar',
        length: '255',
        isNullable: true,
      }),
    ];

    for (const column of columns) {
      if (!(await queryRunner.hasColumn('products', column.name))) {
        await queryRunner.addColumn('products', column);
      }
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    for (const columnName of [
      'image_alt_text',
      'seo_description',
      'seo_title',
    ]) {
      if (await queryRunner.hasColumn('products', columnName)) {
        await queryRunner.dropColumn('products', columnName);
      }
    }
  }
}
