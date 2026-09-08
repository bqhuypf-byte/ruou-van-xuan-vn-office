import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveOrphanReviews1788438000000 implements MigrationInterface {
  name = 'RemoveOrphanReviews1788438000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE review
      FROM reviews review
      LEFT JOIN products product ON product.id = review.product_id
      WHERE product.id IS NULL
    `);
  }

  async down(): Promise<void> {
    // Deleted orphan reviews cannot be reconstructed.
  }
}
