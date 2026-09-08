import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

const DEFAULT_SERVICES = JSON.stringify([
  {
    icon: 'Handshake',
    title: 'Giá Sỉ Cho Đơn Số Lượng Lớn',
    description: 'Chính sách riêng cho nhà hàng, quán ăn, quán nhậu và đại lý.',
  },
  {
    icon: 'ShieldCheck',
    title: 'Chất Lượng Ổn Định, Hợp Tác Lâu Dài',
    description:
      'Nguồn rượu ổn định, đồng hành bền vững cùng đối tác kinh doanh.',
  },
  {
    icon: 'Gift',
    title: 'Quà Biếu Theo Yêu Cầu',
    description: 'Tư vấn chọn rượu và chuẩn bị quà tặng chỉn chu cho từng dịp.',
  },
]);

export class AddProductDetailServices1788441000000 implements MigrationInterface {
  name = 'AddProductDetailServices1788441000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('site_settings', [
      new TableColumn({
        name: 'product_detail_services_title',
        type: 'varchar',
        length: '150',
        default: "'Dành Cho Đối Tác & Quà Tặng'",
      }),
      new TableColumn({
        name: 'product_detail_services',
        type: 'json',
        isNullable: true,
      }),
    ]);

    await queryRunner.query(
      'UPDATE site_settings SET product_detail_services = ? WHERE product_detail_services IS NULL',
      [DEFAULT_SERVICES],
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('site_settings', 'product_detail_services');
    await queryRunner.dropColumn(
      'site_settings',
      'product_detail_services_title',
    );
  }
}
