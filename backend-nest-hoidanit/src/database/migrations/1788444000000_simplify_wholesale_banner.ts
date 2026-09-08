import { MigrationInterface, QueryRunner } from 'typeorm';

const WHOLESALE_BANNER = JSON.stringify([
  {
    icon: 'PhoneCall',
    title: 'Liên hệ lấy giá sỉ',
    description: 'Bỏ sỉ cho quán ăn, quán nhậu, đại lý & người kinh doanh rượu',
  },
]);

export class SimplifyWholesaleBanner1788444000000 implements MigrationInterface {
  name = 'SimplifyWholesaleBanner1788444000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE site_settings
       SET product_detail_services_title = ?,
           product_detail_services = ?,
           contact_phone = ?
       WHERE id = 1`,
      [
        'RƯỢU NHÀ NẤU – NHẬN BỎ SỈ SỐ LƯỢNG LỚN',
        WHOLESALE_BANNER,
        '0964995498',
      ],
    );
  }

  async down(): Promise<void> {
    // Content changes are intentionally kept when rolling back schema code.
  }
}
