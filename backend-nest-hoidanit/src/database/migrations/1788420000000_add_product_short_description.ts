import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddProductShortDescription1788420000000
  implements MigrationInterface
{
  name = 'AddProductShortDescription1788420000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasColumn('products', 'short_description'))) {
      await queryRunner.addColumn(
        'products',
        new TableColumn({
          name: 'short_description',
          type: 'varchar',
          length: '500',
          isNullable: true,
        }),
      );
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasColumn('products', 'short_description')) {
      await queryRunner.dropColumn('products', 'short_description');
    }
  }
}
