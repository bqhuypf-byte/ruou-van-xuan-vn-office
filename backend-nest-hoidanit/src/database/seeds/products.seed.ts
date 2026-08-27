import { DataSource } from 'typeorm';
import { Category } from '../../features/product/entities/category.entity';
import { Product } from '../../features/product/entities/product.entity';
import { ProductVariant } from '../../features/product/entities/product-variant.entity';
import { seedCategories } from './categories.seed';
import { slugifyVi } from './slugify-vi.util';

interface SeedVariant {
  size: string | null;
  price: number;
  salePrice?: number;
}

interface SeedProduct {
  name: string;
  categoryName: string;
  description: string;
  variants: SeedVariant[];
  isFeaturedDeal?: boolean;
}

const PRODUCTS: SeedProduct[] = [
  // Vang Đỏ
  {
    name: 'Vang Đỏ Đà Lạt 2021',
    categoryName: 'Vang Đỏ',
    description:
      'Rượu vang đỏ ủ từ giống nho Cabernet Sauvignon trồng tại Đà Lạt, hương vị đậm đà, hậu vị êm dịu.',
    variants: [{ size: '750ml', price: 320000, salePrice: 289000 }],
    isFeaturedDeal: true,
  },
  {
    name: 'Vang Đỏ Ninh Thuận Cabernet',
    categoryName: 'Vang Đỏ',
    description:
      'Vang đỏ sản xuất từ nho Ninh Thuận, vị chát nhẹ, rất hợp dùng cùng các món nướng.',
    variants: [{ size: '750ml', price: 285000 }],
  },
  {
    name: 'Vang Đỏ Bordeaux Reserve',
    categoryName: 'Vang Đỏ',
    description:
      'Vang đỏ phong cách Bordeaux, ủ trong thùng gỗ sồi 12 tháng, hương vị đậm đà và tinh tế.',
    variants: [{ size: '750ml', price: 650000 }],
  },
  // Vang Trắng
  {
    name: 'Vang Trắng Chardonnay Đà Lạt',
    categoryName: 'Vang Trắng',
    description:
      'Vang trắng Chardonnay vị chua thanh, hương trái cây nhiệt đới.',
    variants: [{ size: '750ml', price: 410000, salePrice: 369000 }],
    isFeaturedDeal: true,
  },
  {
    name: 'Vang Trắng Sauvignon Blanc',
    categoryName: 'Vang Trắng',
    description: 'Vang trắng tươi mát, hương cam quýt, thích hợp dùng khai vị.',
    variants: [{ size: '750ml', price: 380000 }],
  },
  {
    name: 'Vang Trắng Moscato Ngọt',
    categoryName: 'Vang Trắng',
    description:
      'Vang trắng vị ngọt nhẹ, độ cồn thấp, dễ uống cho người mới bắt đầu.',
    variants: [{ size: '750ml', price: 295000 }],
  },
  // Rượu Trái Cây
  {
    name: 'Rượu Táo Mèo Sơn La',
    categoryName: 'Rượu Trái Cây',
    description:
      'Rượu ngâm táo mèo Sơn La, vị chua ngọt hài hòa, tốt cho tiêu hóa.',
    variants: [
      { size: '500ml', price: 150000 },
      { size: '1000ml', price: 270000 },
    ],
    isFeaturedDeal: true,
  },
  {
    name: 'Rượu Mơ Yên Tử',
    categoryName: 'Rượu Trái Cây',
    description: 'Rượu mơ ngâm theo phương pháp truyền thống vùng Yên Tử.',
    variants: [{ size: '500ml', price: 165000 }],
  },
  {
    name: 'Rượu Dâu Tằm Đà Lạt',
    categoryName: 'Rượu Trái Cây',
    description: 'Rượu dâu tằm lên men tự nhiên, màu tím đậm bắt mắt.',
    variants: [{ size: '500ml', price: 145000 }],
  },
  // Rượu Thuốc
  {
    name: 'Rượu Nếp Cẩm Thượng Hạng',
    categoryName: 'Rượu Thuốc',
    description: 'Rượu nếp cẩm ủ men truyền thống, màu tím than đặc trưng.',
    variants: [{ size: '500ml', price: 180000, salePrice: 162000 }],
    isFeaturedDeal: true,
  },
  {
    name: 'Rượu Ba Kích Tây Bắc',
    categoryName: 'Rượu Thuốc',
    description: 'Rượu ngâm ba kích tím Tây Bắc, theo bài thuốc dân gian.',
    variants: [{ size: '1000ml', price: 320000 }],
  },
  {
    name: 'Rượu Đông Trùng Hạ Thảo',
    categoryName: 'Rượu Thuốc',
    description:
      'Rượu ngâm đông trùng hạ thảo cao cấp, món quà biếu sang trọng.',
    variants: [{ size: '500ml', price: 890000 }],
  },
  // Rượu Nếp
  {
    name: 'Rượu Nếp Cái Hoa Vàng',
    categoryName: 'Rượu Nếp',
    description:
      'Rượu nấu từ nếp cái hoa vàng, hương thơm đặc trưng của lúa mới.',
    variants: [{ size: '500ml', price: 120000 }],
  },
  {
    name: 'Rượu Nếp Than Cần Thơ',
    categoryName: 'Rượu Nếp',
    description: 'Rượu nếp than miền Tây, vị ngọt dịu, màu đen tự nhiên.',
    variants: [{ size: '500ml', price: 135000 }],
  },
  {
    name: 'Rượu Nếp Mường Lát',
    categoryName: 'Rượu Nếp',
    description: 'Rượu nếp truyền thống của đồng bào Mường Lát, Thanh Hóa.',
    variants: [{ size: '500ml', price: 110000 }],
  },
  // Rượu Gạo
  {
    name: 'Rượu Đế Gò Đen',
    categoryName: 'Rượu Gạo',
    description:
      'Rượu đế Gò Đen trứ danh Long An, nồng độ cao, hương gạo thơm.',
    variants: [
      { size: '500ml', price: 95000 },
      { size: '1000ml', price: 175000 },
    ],
  },
  {
    name: 'Rượu Gạo Xuân Thạnh',
    categoryName: 'Rượu Gạo',
    description: 'Rượu gạo làng nghề Xuân Thạnh, Trà Vinh, chưng cất thủ công.',
    variants: [{ size: '500ml', price: 105000 }],
  },
  {
    name: 'Rượu Gạo Bàu Đá',
    categoryName: 'Rượu Gạo',
    description: 'Rượu Bàu Đá Bình Định, một trong tứ đại danh tửu Việt Nam.',
    variants: [{ size: '500ml', price: 115000 }],
  },
  // Whisky
  {
    name: 'Chivas Regal 12',
    categoryName: 'Whisky',
    description: 'Whisky Scotch pha trộn 12 năm tuổi, hương vani và mật ong.',
    variants: [{ size: '750ml', price: 890000, salePrice: 799000 }],
    isFeaturedDeal: true,
  },
  {
    name: 'Johnnie Walker Black Label',
    categoryName: 'Whisky',
    description: 'Whisky Scotch Blended 12 năm, hương khói nhẹ đặc trưng.',
    variants: [{ size: '750ml', price: 750000 }],
  },
  {
    name: "Ballantine's Finest",
    categoryName: 'Whisky',
    description: 'Whisky Scotland pha trộn nhẹ nhàng, dễ uống, giá hợp lý.',
    variants: [{ size: '700ml', price: 620000 }],
  },
  // Vang Nhập Khẩu
  {
    name: 'Vang Ý Chianti Classico',
    categoryName: 'Vang Nhập Khẩu',
    description: 'Vang đỏ Ý vùng Tuscany, hương anh đào và thảo mộc.',
    variants: [{ size: '750ml', price: 550000 }],
  },
  {
    name: 'Vang Pháp Bordeaux AOC',
    categoryName: 'Vang Nhập Khẩu',
    description: 'Vang đỏ Pháp chuẩn AOC, đậm đà, phù hợp dịp đặc biệt.',
    variants: [{ size: '750ml', price: 720000 }],
  },
  {
    name: 'Vang Chile Cabernet Sauvignon',
    categoryName: 'Vang Nhập Khẩu',
    description: 'Vang đỏ Chile, vị trái cây chín mọng, giá thành hợp lý.',
    variants: [{ size: '750ml', price: 480000 }],
  },
  // Set Quà Tặng
  {
    name: 'Set Quà Vang Đỏ & Ly Pha Lê',
    categoryName: 'Set Quà Tặng',
    description: 'Hộp quà gồm 1 chai vang đỏ và 2 ly pha lê cao cấp.',
    variants: [{ size: 'Hộp', price: 550000 }],
  },
  {
    name: 'Set Quà Rượu Ngâm Tết',
    categoryName: 'Set Quà Tặng',
    description: 'Set quà rượu ngâm truyền thống dịp Tết, hộp gỗ sang trọng.',
    variants: [{ size: 'Hộp', price: 480000 }],
  },
  {
    name: 'Set Quà Whisky Song Hành',
    categoryName: 'Set Quà Tặng',
    description: 'Set 2 chai whisky mini kèm hộp quà tặng dành cho doanh nhân.',
    variants: [{ size: 'Hộp', price: 690000 }],
  },
  // Hộp Quà Cao Cấp
  {
    name: 'Hộp Quà Rượu Vang Nhập Khẩu',
    categoryName: 'Hộp Quà Cao Cấp',
    description:
      'Hộp quà vang nhập khẩu cao cấp, đóng gói sang trọng, kèm thiệp chúc.',
    variants: [{ size: 'Hộp', price: 890000 }],
  },
  {
    name: 'Hộp Quà Đông Trùng Hạ Thảo & Rượu',
    categoryName: 'Hộp Quà Cao Cấp',
    description: 'Hộp quà kết hợp đông trùng hạ thảo và rượu ngâm bổ dưỡng.',
    variants: [{ size: 'Hộp', price: 1250000 }],
  },
  {
    name: 'Hộp Quà Whisky Chivas 18',
    categoryName: 'Hộp Quà Cao Cấp',
    description: 'Hộp quà Chivas Regal 18 năm, phiên bản quà tặng giới hạn.',
    variants: [{ size: 'Hộp', price: 1650000 }],
  },
];

export async function seedProducts(dataSource: DataSource) {
  await seedCategories(dataSource);

  const categoryRepo = dataSource.getRepository(Category);
  const productRepo = dataSource.getRepository(Product);
  const variantRepo = dataSource.getRepository(ProductVariant);

  const existingCount = await productRepo.count();
  if (existingCount > 0) {
    console.log('⏭ Products already seeded');
    return;
  }

  const categories = await categoryRepo.find();
  const categoryByName = new Map(categories.map((c) => [c.name, c]));

  let variantTotal = 0;
  let dealSortOrder = 0;

  for (const item of PRODUCTS) {
    const category = categoryByName.get(item.categoryName);
    if (!category) {
      console.warn(
        `⚠ Category "${item.categoryName}" not found, skipping "${item.name}"`,
      );
      continue;
    }

    const slugBase = slugifyVi(item.name);

    const product = await productRepo.save(
      productRepo.create({
        categoryId: category.id,
        name: item.name,
        slug: slugBase,
        description: item.description,
        thumbnailUrl: null,
        isActive: true,
        isFeaturedDeal: item.isFeaturedDeal ?? false,
        dealSortOrder: item.isFeaturedDeal ? dealSortOrder++ : 0,
        variantAttributes: [
          { name: 'Dung Tích', values: item.variants.map((v) => v.size).filter((s): s is string => !!s) },
        ],
      }),
    );

    const variants = item.variants.map((v, idx) =>
      variantRepo.create({
        productId: product.id,
        sku: `${slugBase}-${(idx + 1).toString().padStart(2, '0')}`.toUpperCase(),
        attributes: v.size ? { 'Dung Tích': v.size } : null,
        price: v.price.toFixed(2),
        salePrice: v.salePrice ? v.salePrice.toFixed(2) : null,
        stockQuantity: 50,
      }),
    );
    await variantRepo.save(variants);
    variantTotal += variants.length;
  }

  console.log(
    `✓ Seeded ${PRODUCTS.length} products with ${variantTotal} variants`,
  );
}
