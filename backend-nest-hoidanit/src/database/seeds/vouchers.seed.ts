import { DataSource } from 'typeorm';
import { Voucher } from '../../features/voucher/entities/voucher.entity';

const VOUCHERS: {
  code: string;
  title: string;
  description: string;
  discountType: 'percent' | 'fixed';
  discountValue: string;
  minOrderAmount: string;
  maxDiscountAmount: string | null;
  sortOrder: number;
}[] = [
  {
    code: 'VANXUAN10',
    title: 'Giảm 10% cho đơn hàng đầu tiên',
    description: 'Áp dụng cho khách hàng mới, tối đa giảm 100.000đ.',
    discountType: 'percent',
    discountValue: '10.00',
    minOrderAmount: '300000.00',
    maxDiscountAmount: '100000.00',
    sortOrder: 0,
  },
  {
    code: 'FREESHIP',
    title: 'Miễn phí vận chuyển',
    description: 'Áp dụng cho đơn hàng từ 500.000đ trở lên.',
    discountType: 'fixed',
    discountValue: '30000.00',
    minOrderAmount: '500000.00',
    maxDiscountAmount: null,
    sortOrder: 1,
  },
  {
    code: 'GIAM50K',
    title: 'Giảm ngay 50.000đ',
    description: 'Áp dụng cho đơn hàng từ 1.000.000đ.',
    discountType: 'fixed',
    discountValue: '50000.00',
    minOrderAmount: '1000000.00',
    maxDiscountAmount: null,
    sortOrder: 2,
  },
];

export async function seedVouchers(dataSource: DataSource) {
  const repo = dataSource.getRepository(Voucher);

  const existingCount = await repo.count();
  if (existingCount > 0) {
    console.log('⏭ Vouchers already seeded');
    return;
  }

  await repo.save(
    VOUCHERS.map((v) =>
      repo.create({
        code: v.code,
        title: v.title,
        description: v.description,
        discountType: v.discountType,
        discountValue: v.discountValue,
        minOrderAmount: v.minOrderAmount,
        maxDiscountAmount: v.maxDiscountAmount,
        sortOrder: v.sortOrder,
        isActive: true,
      }),
    ),
  );

  console.log(`✓ Seeded ${VOUCHERS.length} vouchers`);
}
