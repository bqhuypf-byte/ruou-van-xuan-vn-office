import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class AddAgeGateAndMemberVouchers1788414000000
  implements MigrationInterface
{
  name = 'AddAgeGateAndMemberVouchers1788414000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    const siteSettingsColumns = [
      new TableColumn({ name: 'age_gate_enabled', type: 'boolean', default: true }),
      new TableColumn({
        name: 'age_gate_title',
        type: 'varchar',
        length: '150',
        default: "'Chào Mừng Bạn Đến Với Rượu Vạn Xuân'",
      }),
      new TableColumn({ name: 'age_gate_description', type: 'text', isNullable: true }),
      new TableColumn({
        name: 'age_gate_confirm_label',
        type: 'varchar',
        length: '80',
        default: "'Tôi Trên 18 Tuổi'",
      }),
      new TableColumn({
        name: 'age_gate_reject_label',
        type: 'varchar',
        length: '80',
        default: "'Chưa Đủ 18 Tuổi'",
      }),
    ];

    for (const column of siteSettingsColumns) {
      if (!(await queryRunner.hasColumn('site_settings', column.name))) {
        await queryRunner.addColumn('site_settings', column);
      }
    }

    if (!(await queryRunner.hasColumn('vouchers', 'new_member_only'))) {
      await queryRunner.addColumn(
        'vouchers',
        new TableColumn({ name: 'new_member_only', type: 'boolean', default: false }),
      );
    }

    if (!(await queryRunner.hasTable('user_vouchers'))) {
      await queryRunner.createTable(
        new Table({
          name: 'user_vouchers',
          columns: [
            { name: 'id', type: 'bigint', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
            { name: 'user_id', type: 'bigint' },
            { name: 'voucher_id', type: 'bigint' },
            { name: 'redeemed_order_id', type: 'bigint', isNullable: true },
            { name: 'redeemed_at', type: 'datetime', isNullable: true },
            { name: 'granted_at', type: 'datetime', default: 'CURRENT_TIMESTAMP' },
          ],
        }),
      );
      await queryRunner.createIndex(
        'user_vouchers',
        new TableIndex({
          name: 'idx_user_vouchers_user_voucher',
          columnNames: ['user_id', 'voucher_id'],
          isUnique: true,
        }),
      );
      await queryRunner.createForeignKeys('user_vouchers', [
        new TableForeignKey({
          name: 'fk_user_vouchers_user',
          columnNames: ['user_id'],
          referencedTableName: 'users',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
        }),
        new TableForeignKey({
          name: 'fk_user_vouchers_voucher',
          columnNames: ['voucher_id'],
          referencedTableName: 'vouchers',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
        }),
        new TableForeignKey({
          name: 'fk_user_vouchers_order',
          columnNames: ['redeemed_order_id'],
          referencedTableName: 'orders',
          referencedColumnNames: ['id'],
          onDelete: 'SET NULL',
        }),
      ]);
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasTable('user_vouchers')) {
      await queryRunner.dropTable('user_vouchers');
    }
    if (await queryRunner.hasColumn('vouchers', 'new_member_only')) {
      await queryRunner.dropColumn('vouchers', 'new_member_only');
    }
    for (const columnName of [
      'age_gate_reject_label',
      'age_gate_confirm_label',
      'age_gate_description',
      'age_gate_title',
      'age_gate_enabled',
    ]) {
      if (await queryRunner.hasColumn('site_settings', columnName)) {
        await queryRunner.dropColumn('site_settings', columnName);
      }
    }
  }
}
