import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AllowGuestProductReviews1788429000000 implements MigrationInterface {
  name = 'AllowGuestProductReviews1788429000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    const columns = [
      new TableColumn({
        name: 'reviewer_name',
        type: 'varchar',
        length: '100',
        isNullable: true,
      }),
      new TableColumn({
        name: 'reviewer_email',
        type: 'varchar',
        length: '150',
        isNullable: true,
      }),
      new TableColumn({
        name: 'reviewer_phone',
        type: 'varchar',
        length: '20',
        isNullable: true,
      }),
    ];

    for (const column of columns) {
      if (!(await queryRunner.hasColumn('reviews', column.name))) {
        await queryRunner.addColumn('reviews', column);
      }
    }

    await queryRunner.query(
      'ALTER TABLE `reviews` MODIFY `user_id` BIGINT NULL, MODIFY `order_id` BIGINT NULL',
    );
    await queryRunner.query(`
      UPDATE reviews r
      INNER JOIN users u ON u.id = r.user_id
      SET r.reviewer_name = u.full_name,
          r.reviewer_email = u.email,
          r.reviewer_phone = u.phone
      WHERE r.reviewer_name IS NULL
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DELETE FROM `reviews` WHERE `user_id` IS NULL OR `order_id` IS NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `reviews` MODIFY `user_id` BIGINT NOT NULL, MODIFY `order_id` BIGINT NOT NULL',
    );

    for (const columnName of [
      'reviewer_phone',
      'reviewer_email',
      'reviewer_name',
    ]) {
      if (await queryRunner.hasColumn('reviews', columnName)) {
        await queryRunner.dropColumn('reviews', columnName);
      }
    }
  }
}
