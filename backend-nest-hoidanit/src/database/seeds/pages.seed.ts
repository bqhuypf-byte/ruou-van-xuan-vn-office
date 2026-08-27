import { DataSource } from 'typeorm';
import { Page } from '../../features/page/entities/page.entity';

const PAGES: { slug: string; title: string; content: string }[] = [
  {
    slug: 'about',
    title: 'Giới Thiệu',
    content:
      'Rượu Vạn Xuân mang đến các dòng rượu truyền thống và nhập khẩu chất lượng, giao hàng toàn quốc.\n\nChúng tôi cam kết nguồn gốc sản phẩm rõ ràng, giá cả hợp lý và dịch vụ chăm sóc khách hàng tận tâm.',
  },
  {
    slug: 'terms',
    title: 'Điều Khoản Sử Dụng',
    content:
      'Khi truy cập và sử dụng website, quý khách đồng ý tuân thủ các điều khoản sử dụng dưới đây.\n\nNội dung chi tiết đang được cập nhật. Vui lòng liên hệ hotline nếu cần hỗ trợ thêm.',
  },
  {
    slug: 'privacy',
    title: 'Chính Sách Bảo Mật',
    content:
      'Chúng tôi cam kết bảo mật thông tin cá nhân của khách hàng, chỉ sử dụng cho mục đích xử lý đơn hàng và chăm sóc khách hàng.\n\nNội dung chi tiết đang được cập nhật.',
  },
  {
    slug: 'return-policy',
    title: 'Chính Sách Đổi Trả',
    content:
      'Sản phẩm được đổi trả trong vòng 7 ngày nếu lỗi từ nhà sản xuất hoặc giao sai sản phẩm.\n\nVui lòng liên hệ hotline để được hướng dẫn quy trình đổi trả.',
  },
  {
    slug: 'careers',
    title: 'Tuyển Dụng',
    content:
      'Rượu Vạn Xuân luôn chào đón những ứng viên nhiệt huyết, yêu thích ngành hàng đồ uống.\n\nHiện chưa có vị trí tuyển dụng nào. Vui lòng quay lại sau.',
  },
  {
    slug: 'blog',
    title: 'Tin Tức',
    content: 'Các bài viết, tin tức mới nhất từ Rượu Vạn Xuân sẽ được cập nhật tại đây.',
  },
  {
    slug: 'press',
    title: 'Trung Tâm Báo Chí',
    content: 'Thông tin báo chí, hình ảnh thương hiệu Rượu Vạn Xuân sẽ được cập nhật tại đây.',
  },
  {
    slug: 'gift-card',
    title: 'Thẻ Quà Tặng',
    content: 'Thông tin về thẻ quà tặng Rượu Vạn Xuân đang được cập nhật.',
  },
  {
    slug: 'shipping',
    title: 'Giao Hàng',
    content:
      'Rượu Vạn Xuân giao hàng toàn quốc trong 2-4 ngày làm việc.\n\nPhí vận chuyển được tính tự động tại trang thanh toán.',
  },
  {
    slug: 'order-pickup',
    title: 'Đặt Hàng Tại Cửa Hàng',
    content:
      'Quý khách có thể đặt hàng online và chọn nhận tại cửa hàng khi thanh toán để được miễn phí vận chuyển.',
  },
  {
    slug: 'become-seller',
    title: 'Trở Thành Đại Lý',
    content:
      'Chương trình hợp tác đại lý Rượu Vạn Xuân đang được xây dựng. Vui lòng liên hệ hotline để biết thêm chi tiết.',
  },
];

export async function seedPages(dataSource: DataSource) {
  const repo = dataSource.getRepository(Page);

  const existingCount = await repo.count();
  if (existingCount > 0) {
    console.log('⏭ Pages already seeded');
    return;
  }

  await repo.save(
    PAGES.map((p) =>
      repo.create({ slug: p.slug, title: p.title, content: p.content, isActive: true }),
    ),
  );

  console.log(`✓ Seeded ${PAGES.length} static pages`);
}
