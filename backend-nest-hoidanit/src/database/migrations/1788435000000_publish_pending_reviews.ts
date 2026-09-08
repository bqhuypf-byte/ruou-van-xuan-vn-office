import { MigrationInterface, QueryRunner } from 'typeorm';

export class PublishPendingReviews1788435000000 implements MigrationInterface {
  name = 'PublishPendingReviews1788435000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "UPDATE `reviews` SET `status` = 'approved' WHERE `status` = 'pending'",
    );
  }

  async down(): Promise<void> {
    // Publishing reviews is intentionally not reversed.
  }
}
