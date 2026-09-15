# Báo cáo hoàn tất đợt tối ưu SEO sản phẩm

Ngày thực hiện: 2026-09-14

Phạm vi được duyệt: nội dung an toàn trong Gói A và SEO kỹ thuật trong Gói B.

## Nội dung đang được giữ qua Admin API

Chỉ hai trường `shortDescription` và `description` được giữ cho các sản phẩm rượu:

| ID | Slug | Kết quả xác minh |
|---:|---|---|
| 33 | `ruou-nep-van-xuan-can-10-lit` | Đã lưu; short description 108 ký tự. |
| 34 | `ruou-nep-chuoi-hot-van-xuan` | Đã lưu; short description 119 ký tự. |

ID, tên, slug, danh mục, SKU, giá, tồn kho, trạng thái và media không bị thay đổi.

Ngày 2026-09-15, nội dung SEO đã áp dụng trước đó cho ID 27, 28 và 30 được hoàn
tác vì các hộp/set quà không còn thuộc phạm vi. Ba sản phẩm vẫn hoạt động bình
thường; `shortDescription` đã trở về `null` và mô tả gốc đã được khôi phục.

## SEO kỹ thuật đã triển khai

- Thêm sitemap XML động gồm trang chủ, danh sách sản phẩm và mọi sản phẩm active.
- Thêm `Product`/`ProductGroup` JSON-LD; dữ liệu offer lấy từ SKU, giá VND và tồn
  kho thực tế. Khi ma trận biến thể không nhất quán, hệ thống không khai báo sai
  `ProductGroup` mà hạ xuống `Product` với nhiều offer.
- Chuẩn hóa URL media `localhost` sang origin public ở lớp hiển thị, không sửa âm
  thầm dữ liệu gốc.
- Thêm các trường do Admin quản lý: SEO title, SEO description và alt ảnh chính.
- Meta title/description và alt ảnh ưu tiên trường Admin mới, có fallback an toàn.
- Nginx chuyển `/sitemap.xml` đến sitemap động của backend.

Chưa thêm hệ thống redirect 301 vì đợt này không đổi slug và chưa có mapping URL
cũ → mới được duyệt. JSON-LD/meta hiện được React chèn phía client; cần kiểm tra
rendered HTML trên production và cân nhắc SSR/prerender nếu Google không thu nhận
ổn định.

## Sản phẩm được giữ nguyên do blocker

- ID 32: chưa xác nhận đây là rượu nếp sữa hay nếp đục.
- ID 35: hai SKU chưa có thuộc tính phân biệt; mô tả cũ có claim sức khỏe.
- ID 36: giá 5.000đ và media thử/localhost chưa được xác minh.
- ID 37: tên/giá trị thuộc tính, giá, tồn kho và ảnh biến thể mâu thuẫn.

Không tự suy đoán các dữ kiện này để tránh tạo nội dung hoặc structured data sai.

## Kết quả kiểm chứng cục bộ

- Frontend production build: đạt.
- Backend production build: đạt.
- Test SEO/frontend liên quan: 15/15 đạt.
- Toàn bộ test backend: 116/116 đạt.
- Sitemap API: HTTP 200, `application/xml`, 11 URL (2 trang tĩnh + 9 sản phẩm).
- Đọc lại API xác nhận hai sản phẩm rượu đang giữ nội dung mới; ba sản phẩm quà
  tặng đã được hoàn tác đúng dữ liệu trước cập nhật.
- Kết quả audit 18 blocker/17 warning ghi ngày 2026-09-14 không còn là số liệu
  hiện hành sau khi loại các hộp quà; cần chạy lại khi bốn sản phẩm rượu bị chặn
  được bổ sung dữ liệu thật.

## Việc cần làm trên production

1. Chạy migration và triển khai đồng thời backend/frontend/nginx.
2. Đặt `PUBLIC_SITE_URL=https://ruouvanxuan.com` trên backend production.
3. Kiểm tra URL sản phẩm, canonical, sitemap và rendered JSON-LD sau triển khai.
4. Chạy Rich Results Test và theo dõi Product snippets trong Search Console.
5. Cung cấp dữ liệu thật cho bốn sản phẩm đang bị chặn và thay media localhost.

Kết quả hiện tại được mô tả là phù hợp với các kiểm tra cục bộ và định hướng hiện
hành của Google, không phải cam kết thứ hạng hay bảo đảm hiển thị rich result.
