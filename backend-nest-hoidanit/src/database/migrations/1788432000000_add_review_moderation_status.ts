import { MigrationInterface, QueryRunner, TableColumn, TableIndex } from 'typeorm';

export class AddReviewModerationStatus1788432000000 implements MigrationInterface {
  name = 'AddReviewModerationStatus1788432000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasColumn('reviews', 'status'))) {
      await queryRunner.addColumn(
        'reviews',
        new TableColumn({
          name: 'status',
          type: 'varchar',
          length: '20',
          default: "'approved'",
        }),
      );
    }

    const table = await queryRunner.getTable('reviews');
    if (!table?.indices.some((index) => index.name === 'IDX_reviews_status')) {
      await queryRunner.createIndex(
        'reviews',
        new TableIndex({ name: 'IDX_reviews_status', columnNames: ['status'] }),
      );
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('reviews');
    if (table?.indices.some((index) => index.name === 'IDX_reviews_status')) {
      await queryRunner.dropIndex('reviews', 'IDX_reviews_status');
    }
    if (await queryRunner.hasColumn('reviews', 'status')) {
      await queryRunner.dropColumn('reviews', 'status');
    }
  }
}
