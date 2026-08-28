import { DataSource } from 'typeorm';
import {
  SITE_SETTINGS_ID,
  SiteSettings,
} from '../../features/site-settings/entities/site-settings.entity';

export async function seedSiteSettings(dataSource: DataSource) {
  const repo = dataSource.getRepository(SiteSettings);

  const existing = await repo.findOne({ where: { id: SITE_SETTINGS_ID } });
  if (existing) {
    if (!existing.browserTitle) {
      existing.browserTitle =
        'Rượu Vạn Xuân - Rượu Nếp, Rượu Ngâm, Rượu Gạo Truyền Thống';
      await repo.save(existing);
      console.log('✓ Backfilled browser title on existing site settings');
    }

    const needsFooterBackfill =
      !existing.footerDescription ||
      !existing.footerAboutLinks ||
      !existing.footerServicesLinks ||
      !existing.footerBottomLinks;
    if (needsFooterBackfill) {
      existing.footerDescription ||=
        'Rượu Vạn Xuân mang đến các dòng rượu truyền thống và nhập khẩu chất lượng, giao hàng toàn quốc.';
      existing.footerAboutTitle ||= 'Về Chúng Tôi';
      existing.footerAboutLinks ||= [
        { label: 'Giới Thiệu', url: '/about' },
        { label: 'Tuyển Dụng', url: '/careers' },
        { label: 'Tin Tức', url: '/blog' },
        { label: 'Trung Tâm Báo Chí', url: '/press' },
      ];
      existing.footerServicesTitle ||= 'Dịch Vụ';
      existing.footerServicesLinks ||= [
        { label: 'Thẻ Quà Tặng', url: '/gift-card' },
        { label: 'Giao Hàng', url: '/shipping' },
        { label: 'Đặt Hàng Tại Cửa Hàng', url: '/order-pickup' },
      ];
      existing.footerBottomLinks ||= [
        { label: 'Trở Thành Đại Lý', url: '/become-seller' },
        { label: 'Thẻ Quà Tặng', url: '/gift-card' },
        { label: 'Trung Tâm Trợ Giúp', url: '/faq' },
        { label: 'Điều Khoản Sử Dụng', url: '/terms' },
        { label: 'Chính Sách Bảo Mật', url: '/privacy' },
      ];
      await repo.save(existing);
      console.log('✓ Backfilled footer content on existing site settings');
    }
    if (!existing.contactAddresses) {
      existing.contactAddresses = [
        {
          label: 'Chi nhánh 1',
          address: '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
        },
        {
          label: 'Chi nhánh 2',
          address: '45 Lê Lợi, Quận Hải Châu, TP. Đà Nẵng',
        },
      ];
      await repo.save(existing);
      console.log('✓ Backfilled contact addresses on existing site settings');
    } else if (existing.contactAddresses.length === 1) {
      existing.contactAddresses = [
        ...existing.contactAddresses,
        {
          label: 'Chi nhánh 2',
          address: '45 Lê Lợi, Quận Hải Châu, TP. Đà Nẵng',
        },
      ];
      await repo.save(existing);
      console.log('✓ Backfilled second contact address on existing site settings');
    }
    if (!existing.trustBadges || !existing.paymentMethodIcons) {
      existing.topCategoriesSectionTitle ||= 'Danh Mục Nổi Bật';
      existing.trustBadges ||= [
        {
          icon: 'Truck',
          title: 'Giao Hàng Nhanh',
          description: 'Giao hàng toàn quốc trong 2-4 ngày',
        },
        {
          icon: 'ShieldCheck',
          title: 'Cam Kết Chính Hãng',
          description: '100% sản phẩm có tem chống hàng giả',
        },
        {
          icon: 'RotateCcw',
          title: 'Đổi Trả Dễ Dàng',
          description: 'Đổi trả trong 7 ngày nếu lỗi từ nhà sản xuất',
        },
        {
          icon: 'Headphones',
          title: 'Hỗ Trợ 24/7',
          description: 'Tư vấn nhiệt tình qua hotline và Zalo',
        },
      ];
      existing.paymentMethodIcons ||= [
        { name: 'Visa', iconUrl: '' },
        { name: 'Mastercard', iconUrl: '' },
        { name: 'MoMo', iconUrl: '' },
        { name: 'VNPay', iconUrl: '' },
        { name: 'COD', iconUrl: '' },
      ];
      await repo.save(existing);
      console.log(
        '✓ Backfilled trust badges / payment icons on existing site settings',
      );
    }
    if (
      !existing.codDescription ||
      !existing.storePickupDescription ||
      !existing.bankTransferDescription
    ) {
      existing.codDescription ||= 'Thanh toán bằng tiền mặt khi nhận được hàng';
      existing.storePickupDescription ||=
        'Đến trực tiếp cửa hàng để nhận và thanh toán';
      existing.bankTransferDescription ||=
        'Chuyển khoản trước, đơn hàng xử lý sau khi xác nhận';
      existing.bankName ||= 'Vietcombank';
      existing.bankAccountNumber ||= '0123456789';
      existing.bankAccountHolder ||= 'CONG TY TNHH RUOU VAN XUAN';
      await repo.save(existing);
      console.log(
        '✓ Backfilled checkout payment settings on existing site settings',
      );
    }
    if (!existing.bankBin) {
      existing.bankBin = '970436';
      await repo.save(existing);
      console.log('✓ Backfilled bank BIN (VietQR) on existing site settings');
    }
    if (existing.checkoutSummaryNote === null) {
      existing.checkoutSummaryNote =
        'Vui lòng kiểm tra kỹ thông tin trước khi đặt hàng. Đơn hàng sẽ được xác nhận qua số điện thoại của bạn.';
      await repo.save(existing);
      console.log('✓ Backfilled checkout notes on existing site settings');
    }
    if (existing.freeShippingThreshold === null || existing.freeShippingThreshold === undefined) {
      existing.freeShippingThreshold = '500000.00';
      await repo.save(existing);
      console.log(
        '✓ Backfilled free shipping threshold on existing site settings',
      );
    }
    if (!existing.contactChannels) {
      existing.contactChannels = [
        {
          icon: 'MessageCircle',
          label: 'Chat Messenger',
          hours: '8h - 20h',
          link: existing.facebookUrl ?? 'https://m.me/',
          bgColor: '#0084FF',
          isActive: Boolean(existing.facebookUrl),
        },
        {
          icon: 'Send',
          label: 'Chat Zalo',
          hours: '8h - 20h',
          link: existing.zaloUrl ?? 'https://zalo.me/',
          bgColor: '#0068FF',
          isActive: Boolean(existing.zaloUrl),
        },
        {
          icon: 'Phone',
          label: existing.contactPhone,
          hours: '8h - 20h',
          link: `tel:${existing.contactPhone.replace(/\s+/g, '')}`,
          bgColor: '#E11D48',
          isActive: true,
        },
        {
          icon: 'Store',
          label: 'Vị trí cửa hàng',
          hours: '9h - 21h',
          link: existing.contactAddresses?.[0]?.address
            ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(existing.contactAddresses[0].address)}`
            : '#',
          bgColor: '#16A34A',
          isActive: true,
          locations: (existing.contactAddresses ?? []).map((addr) => ({
            label: `${addr.label} - ${addr.address}`,
            link: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr.address)}`,
          })),
        },
      ];
      await repo.save(existing);
      console.log(
        '✓ Backfilled contact channels widget on existing site settings',
      );
    } else {
      const storeChannel = existing.contactChannels.find(
        (c) => c.icon === 'Store',
      );
      if (storeChannel && !storeChannel.locations?.length) {
        storeChannel.locations = (existing.contactAddresses ?? []).map(
          (addr) => ({
            label: `${addr.label} - ${addr.address}`,
            link: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr.address)}`,
          }),
        );
        if (storeChannel.locations.length > 0) {
          await repo.save(existing);
          console.log(
            '✓ Backfilled store locations on existing contact channel',
          );
        }
      }
    }
    if (
      existing.footerDescription &&
      existing.contactAddresses &&
      existing.trustBadges &&
      existing.paymentMethodIcons &&
      existing.codDescription
    ) {
      console.log('⏭ Site settings already seeded');
    }
    return;
  }

  await repo.save(
    repo.create({
      id: SITE_SETTINGS_ID,
      siteName: 'Rượu Vạn Xuân',
      logoUrl: null,
      browserTitle: 'Rượu Vạn Xuân - Rượu Nếp, Rượu Ngâm, Rượu Gạo Truyền Thống',
      faviconUrl: null,
      topBarMessage: 'Chào mừng đến với Rượu Vạn Xuân!',
      deliverToText: 'Giao Hàng Toàn Quốc',
      contactPhone: '+84 90 123 4567',
      whatsappNumber: '+84 90 123 4567',
      contactAddresses: [
        {
          label: 'Chi nhánh 1',
          address: '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
        },
        {
          label: 'Chi nhánh 2',
          address: '45 Lê Lợi, Quận Hải Châu, TP. Đà Nẵng',
        },
      ],
      facebookUrl: 'https://facebook.com/ruouvanxuan',
      zaloUrl: 'https://zalo.me/840901234567',
      appStoreUrl: null,
      playStoreUrl: null,
      copyrightText: `© ${new Date().getFullYear()} Rượu Vạn Xuân. All rights reserved.`,
      footerDescription:
        'Rượu Vạn Xuân mang đến các dòng rượu truyền thống và nhập khẩu chất lượng, giao hàng toàn quốc.',
      dealsSectionTitle: 'Ưu Đãi Nổi Bật',
      featuredBrandsSectionTitle: 'Thương Hiệu Nổi Bật',
      popularCategoriesTitle: 'Danh Mục Phổ Biến',
      popularCategoriesLinks: [
        { label: 'Rượu Vang', url: '/products' },
        { label: 'Rượu Ngâm', url: '/products' },
        { label: 'Rượu Đế', url: '/products' },
        { label: 'Rượu Nhập Khẩu', url: '/products' },
        { label: 'Quà Tặng', url: '/products' },
      ],
      customerServiceTitle: 'Hỗ Trợ',
      customerServiceLinks: [
        { label: 'Câu Hỏi Thường Gặp', url: '/faq' },
        { label: 'Chính Sách Đổi Trả', url: '/return-policy' },
        { label: 'Theo Dõi Đơn Hàng', url: '/orders' },
        { label: 'Liên Hệ', url: '/contact' },
      ],
      footerAboutTitle: 'Về Chúng Tôi',
      footerAboutLinks: [
        { label: 'Giới Thiệu', url: '/about' },
        { label: 'Tuyển Dụng', url: '/careers' },
        { label: 'Tin Tức', url: '/blog' },
        { label: 'Trung Tâm Báo Chí', url: '/press' },
      ],
      footerServicesTitle: 'Dịch Vụ',
      footerServicesLinks: [
        { label: 'Thẻ Quà Tặng', url: '/gift-card' },
        { label: 'Giao Hàng', url: '/shipping' },
        { label: 'Đặt Hàng Tại Cửa Hàng', url: '/order-pickup' },
      ],
      footerBottomLinks: [
        { label: 'Trở Thành Đại Lý', url: '/become-seller' },
        { label: 'Thẻ Quà Tặng', url: '/gift-card' },
        { label: 'Trung Tâm Trợ Giúp', url: '/faq' },
        { label: 'Điều Khoản Sử Dụng', url: '/terms' },
        { label: 'Chính Sách Bảo Mật', url: '/privacy' },
      ],
      topCategoriesSectionTitle: 'Danh Mục Nổi Bật',
      trustBadges: [
        {
          icon: 'Truck',
          title: 'Giao Hàng Nhanh',
          description: 'Giao hàng toàn quốc trong 2-4 ngày',
        },
        {
          icon: 'ShieldCheck',
          title: 'Cam Kết Chính Hãng',
          description: '100% sản phẩm có tem chống hàng giả',
        },
        {
          icon: 'RotateCcw',
          title: 'Đổi Trả Dễ Dàng',
          description: 'Đổi trả trong 7 ngày nếu lỗi từ nhà sản xuất',
        },
        {
          icon: 'Headphones',
          title: 'Hỗ Trợ 24/7',
          description: 'Tư vấn nhiệt tình qua hotline và Zalo',
        },
      ],
      paymentMethodIcons: [
        { name: 'Visa', iconUrl: '' },
        { name: 'Mastercard', iconUrl: '' },
        { name: 'MoMo', iconUrl: '' },
        { name: 'VNPay', iconUrl: '' },
        { name: 'COD', iconUrl: '' },
      ],
      codDescription: 'Thanh toán bằng tiền mặt khi nhận được hàng',
      storePickupDescription: 'Đến trực tiếp cửa hàng để nhận và thanh toán',
      bankTransferDescription:
        'Chuyển khoản trước, đơn hàng xử lý sau khi xác nhận',
      bankName: 'Vietcombank',
      bankAccountNumber: '0123456789',
      bankAccountHolder: 'CONG TY TNHH RUOU VAN XUAN',
      bankBin: '970436',
      shippingFee: '30000.00',
      freeShippingThreshold: '500000.00',
      checkoutSummaryNote:
        'Vui lòng kiểm tra kỹ thông tin trước khi đặt hàng. Đơn hàng sẽ được xác nhận qua số điện thoại của bạn.',
      contactChannels: [
        {
          icon: 'MessageCircle',
          label: 'Chat Messenger',
          hours: '8h - 20h',
          link: 'https://m.me/ruouvanxuan',
          bgColor: '#0084FF',
          isActive: true,
        },
        {
          icon: 'Send',
          label: 'Chat Zalo',
          hours: '8h - 20h',
          link: 'https://zalo.me/840901234567',
          bgColor: '#0068FF',
          isActive: true,
        },
        {
          icon: 'Phone',
          label: '+84 90 123 4567',
          hours: '8h - 20h',
          link: 'tel:+84901234567',
          bgColor: '#E11D48',
          isActive: true,
        },
        {
          icon: 'Store',
          label: 'Vị trí cửa hàng',
          hours: '9h - 21h',
          link: 'https://www.google.com/maps/search/?api=1&query=123+Nguyễn+Huệ+Quận+1+TP.+Hồ+Chí+Minh',
          bgColor: '#16A34A',
          isActive: true,
          locations: [
            {
              label: 'Chi nhánh 1 - 123 Nguyễn Huệ, Q.1, TP. HCM',
              link: 'https://www.google.com/maps/search/?api=1&query=123+Nguyễn+Huệ+Quận+1+TP.+Hồ+Chí+Minh',
            },
            {
              label: 'Chi nhánh 2 - 45 Lê Lợi, Hải Châu, Đà Nẵng',
              link: 'https://www.google.com/maps/search/?api=1&query=45+Lê+Lợi+Hải+Châu+Đà+Nẵng',
            },
          ],
        },
      ],
    }),
  );

  console.log('✓ Seeded site settings');
}
