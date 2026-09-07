import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddReviewImages1788426000000 implements MigrationInterface {
  name = 'AddReviewImages1788426000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasColumn('reviews', 'image_urls'))) {
      await queryRunner.addColumn(
        'reviews',
        new TableColumn({
          name: 'image_urls',
          type: 'json',
          isNullable: true,
        }),
      );
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasColumn('reviews', 'image_urls')) {
      await queryRunner.dropColumn('reviews', 'image_urls');
    }
  }
}
