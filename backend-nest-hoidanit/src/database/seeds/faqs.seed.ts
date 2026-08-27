import { DataSource } from 'typeorm';
import { Faq } from '../../features/faq/entities/faq.entity';

const FAQS = [
  {
    question: 'Thời gian giao hàng mất bao lâu?',
    answer:
      'Đơn hàng thường được giao trong 2-4 ngày làm việc đối với nội thành và 4-7 ngày đối với các tỉnh xa. Bạn sẽ nhận được mã theo dõi đơn hàng qua email/SMS ngay khi đơn được xác nhận.',
    sortOrder: 0,
  },
  {
    question: 'Tôi có thể đổi trả sản phẩm không?',
    answer:
      'Chúng tôi hỗ trợ đổi trả trong vòng 7 ngày kể từ ngày nhận hàng nếu sản phẩm bị lỗi từ nhà sản xuất hoặc giao sai sản phẩm. Vui lòng giữ nguyên bao bì và hóa đơn mua hàng.',
    sortOrder: 1,
  },
  {
    question: 'Cửa hàng hỗ trợ những phương thức thanh toán nào?',
    answer:
      'Bạn có thể thanh toán khi nhận hàng (COD), chuyển khoản ngân hàng, hoặc thanh toán online qua thẻ Visa/Mastercard, MoMo, VNPay.',
    sortOrder: 2,
  },
  {
    question: 'Làm sao để theo dõi trạng thái đơn hàng của tôi?',
    answer:
      'Sau khi đăng nhập, vào mục "Đơn hàng của tôi" để xem trạng thái xử lý, vận chuyển và giao hàng theo thời gian thực.',
    sortOrder: 3,
  },
  {
    question: 'Sản phẩm có được bảo hành hoặc cam kết chính hãng không?',
    answer:
      'Tất cả sản phẩm tại Rượu Vạn Xuân đều có tem chống hàng giả và cam kết 100% chính hãng, có nguồn gốc xuất xứ rõ ràng.',
    sortOrder: 4,
  },
];

export async function seedFaqs(dataSource: DataSource) {
  const repo = dataSource.getRepository(Faq);

  const existingCount = await repo.count();
  if (existingCount > 0) {
    console.log('⏭ FAQs already seeded');
    return;
  }

  const faqs = FAQS.map((faq) => repo.create({ ...faq, isActive: true }));
  await repo.save(faqs);

  console.log(`✓ Seeded ${faqs.length} FAQs`);
}
