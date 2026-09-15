# Bản duyệt tối ưu SEO toàn bộ sản phẩm

Ngày kiểm kê: 2026-09-14

Nguồn: cơ sở dữ liệu MySQL hiện tại (chỉ đọc), mã nguồn storefront và ảnh mẫu
“Rượu Nếp Vạn Xuân 1 Lít”.

Trạng thái: **Đã điều chỉnh phạm vi ngày 2026-09-15** — nội dung được giữ cho ID
33 và 34. Các hộp/set quà ID 27, 28, 30 đã được hoàn tác theo yêu cầu; ID 32,
35, 36, 37 vẫn được giữ nguyên vì còn blocker dữ liệu.
SEO kỹ thuật đã được triển khai trong mã nguồn nhưng chưa được xác nhận trên môi
trường production.

## 1. Chuẩn tham chiếu

- Người tìm kiếm chính: khách cần tìm đúng loại rượu, dung tích/nồng độ hoặc
  hộp quà trước khi quyết định mua.
- Giọng điệu: tiếng Việt tự nhiên, rõ thông tin, trang trọng vừa phải, không
  nhồi từ khóa và không đưa tuyên bố chưa có bằng chứng.
- Thứ tự nội dung: nhận diện sản phẩm → thông tin đã xác minh → lựa chọn/biến
  thể → cách sử dụng hoặc đối tượng quà tặng khi có dữ liệu → lưu ý 18+.
- Không tái sử dụng câu hướng dẫn AI, nội dung mẫu hoặc các tuyên bố về sức khỏe.
- SEO authority: hướng dẫn hiện hành của Google Search Central; sản phẩm mẫu chỉ
  là tham chiếu thương hiệu và bố cục.

## 2. Kiểm kê danh mục

| ID | Sản phẩm | Chủ đề tìm kiếm chính | Trạng thái | Cảnh báo/blocker |
|---:|---|---|---|---|
| 27 | Set Quà Whisky Song Hành | — | **Loại khỏi phạm vi** | Hộp/set quà không cần tối ưu trong đợt này. |
| 28 | Hộp Quà Rượu Vang Nhập Khẩu | — | **Loại khỏi phạm vi** | Hộp/set quà không cần tối ưu trong đợt này. |
| 30 | Hộp Quà Whisky Chivas 18 | — | **Loại khỏi phạm vi** | Hộp/set quà không cần tối ưu trong đợt này. |
| 32 | Rượu Nếp Sữa Vạn Xuân (Nếp Đuc) | rượu nếp sữa Vạn Xuân | **Blocker** | Tên sai chính tả và chưa rõ sản phẩm là “nếp sữa” hay “nếp đục”; URL ảnh dùng `localhost`. |
| 33 | Rượu Nếp Vạn Xuân Can 10 Lít | rượu nếp can 10 lít | Có thể duyệt nội dung | Video YouTube `dQw4w9WgXcQ` là nội dung thử/không liên quan; URL ảnh dùng `localhost`; thiếu nồng độ. |
| 34 | Rượu Nếp Chuối Hột Vạn Xuân | rượu chuối hột Vạn Xuân | Có thể duyệt nội dung | URL ảnh dùng `localhost`; thiếu dung tích và nồng độ. |
| 35 | Rượu Nếp Than Vạn Xuân | rượu nếp than Vạn Xuân | **Blocker** | Hai SKU không có thuộc tính phân biệt; một SKU hết hàng; URL ảnh dùng `localhost`; mô tả hiện có tuyên bố sức khỏe. |
| 36 | Rượu Nếp Vạn Xuân 1 Lít 40 Độ | rượu nếp 40 độ 1 lít | **Blocker** | Giá hiện tại 5.000đ có dấu hiệu dữ liệu thử; video/ảnh dùng `localhost`; cần xác minh claim “không pha cồn”. |
| 37 | Rượu Nếp Đục Vạn Xuân | rượu nếp đục Vạn Xuân | **Blocker** | Tên thuộc tính `đôhj`, giá trị `30 đọ/35 đọ`, giá/tồn kho bất thường; một SKU dùng thuộc tính khác ma trận; ảnh mẫu 40° không khớp biến thể đang chọn. |

Tổng quan: 9 sản phẩm; lần chạy audit tự động ghi nhận **18 blocker và 22
warning** (mỗi URL/trường lỗi được tính riêng); 4 sản phẩm có blocker nội dung
hoặc dữ liệu thương mại; 2 sản phẩm không có ảnh; 7 sản phẩm dùng URL ảnh tuyệt
đối `localhost`; tất cả sản phẩm thiếu `shortDescription`; chỉ sản phẩm ID 37
có gallery. Các sản phẩm gắn “Có thể duyệt nội dung” chỉ an toàn để duyệt phần
copy; chúng vẫn chưa đạt toàn bộ gate SEO kỹ thuật nếu còn lỗi media.

## 3. Bản nháp nội dung đề xuất

Nội dung đầy đủ trước/sau được lưu trong
`01-share-docs/SEO_PRODUCT_BATCH_MANIFEST.json`, khóa theo ID sản phẩm.

| ID | Tên đề xuất | Short description đề xuất |
|---:|---|---|
| 27 | Giữ nguyên | Set quà whisky gồm 2 chai mini kèm hộp quà, được chuẩn bị cho nhu cầu quà tặng doanh nhân gọn gàng và trang trọng. |
| 28 | Giữ nguyên | Hộp quà rượu vang nhập khẩu được đóng gói trang trọng và kèm thiệp chúc, phù hợp cho nhu cầu biếu tặng. |
| 30 | Hộp Quà Chivas Regal 18 Năm | Hộp quà Chivas Regal 18 năm dành cho nhu cầu biếu tặng; khách hàng nên kiểm tra phiên bản và thành phần bộ quà trước khi đặt. |
| 32 | Rượu Nếp Sữa Vạn Xuân | Rượu Nếp Sữa Vạn Xuân sử dụng nước cốt nếp sữa, lên men tự nhiên và chưng cất theo phương pháp truyền thống. |
| 33 | Giữ nguyên | Rượu Nếp Vạn Xuân can 10 lít, làm từ nếp và men rượu truyền thống, phù hợp cho nhu cầu sử dụng số lượng lớn. |
| 34 | Giữ nguyên | Rượu Nếp Chuối Hột Vạn Xuân kết hợp nếp và chuối hột rừng, lên men tự nhiên và chưng cất theo phương pháp truyền thống. |
| 35 | Giữ nguyên | Rượu Nếp Than Vạn Xuân được làm từ nếp than tự nhiên, lên men và chưng cất theo phương pháp truyền thống. |
| 36 | Giữ nguyên | Rượu Nếp Vạn Xuân 1 lít 40 độ, lên men tự nhiên và chưng cất theo phương pháp truyền thống. |
| 37 | Rượu Nếp Đục Vạn Xuân 1 Lít | Rượu Nếp Đục Vạn Xuân lên men tự nhiên từ nếp cái hoa vàng và men rượu gia truyền, chưng cất theo phương pháp truyền thống. |

Các tên đề xuất ở ID 32 và 37 chỉ được áp dụng sau khi chủ sản phẩm xác nhận
đúng dòng rượu và dung tích. Slug hiện tại được giữ nguyên để tránh đổi URL khi
chưa có cơ chế redirect 301.

## 4. Audit kỹ thuật Google

### Pass

- Trang chi tiết có một `h1` dùng tên sản phẩm.
- Liên kết sản phẩm và breadcrumb dùng liên kết crawlable.
- Ảnh chính có alt là tên sản phẩm; thumbnail trang danh sách cũng có alt.
- Mỗi trang đang tạo title, meta description, canonical và Open Graph theo sản
  phẩm sau khi React tải dữ liệu.
- `robots.txt` cho phép crawl storefront và khai báo sitemap.

### Warning

- Title/meta/canonical chỉ được chèn phía client bằng `useEffect`; cần kiểm tra
  HTML render mà Google nhận được và cân nhắc prerender/SSR cho dữ liệu quan
  trọng.
- Alt của thumbnail gallery đang rỗng. Điều này hợp lý nếu hoàn toàn trang trí,
  nhưng ảnh thể hiện góc/biến thể khác cần alt riêng và phải được quản lý từ
  Admin.
- Chưa có trường Admin riêng cho SEO title, meta description, image alt hoặc
  redirect khi đổi slug.

### Blocker kỹ thuật

- Sitemap tĩnh chỉ có `/` và `/products`, không có URL chi tiết của 9 sản phẩm.
- Không tìm thấy `Product`/`ProductGroup` JSON-LD trong mã nguồn storefront.
- Nhiều ảnh/video trong dữ liệu dùng `http://localhost:3000/...`; URL này không
  phải URL public hợp lệ cho người dùng hoặc Google trên máy khác.
- Dữ liệu biến thể ID 37 không đủ nhất quán để tạo ProductGroup/Offer chính xác.
- Giá ID 36 và một số giá/tồn kho ID 37 phải được xác minh trước khi đưa vào
  structured data.

## 5. Phạm vi cần phê duyệt

### Gói A — cập nhật nội dung Admin/API

- Ghi `shortDescription` và `description` theo manifest cho các sản phẩm không
  có blocker.
- Giữ nguyên ID, category, slug, SKU, giá, tồn kho, trạng thái và ảnh.
- Không cập nhật ID 32, 35, 36, 37 cho đến khi dữ liệu blocker được xác nhận.

### Gói B — triển khai SEO kỹ thuật trong code

- Sitemap sản phẩm động bằng URL canonical tuyệt đối.
- Product/ProductGroup JSON-LD khớp biến thể, giá, VND, tồn kho, ảnh và review
  hiển thị.
- Chuẩn hóa URL upload public thay cho `localhost`.
- Bổ sung trường Admin-managed cho SEO title, meta description và alt ảnh; thêm
  redirect 301 khi đổi slug.
- Kiểm thử rendered HTML, Rich Results Test và build frontend/backend.

Google có thể tự viết lại title/snippet và không đảm bảo rich result hoặc thứ
hạng. Merchant Center free listings/Shopping Ads cho đồ uống có cồn nhắm tới
Việt Nam hiện không đủ điều kiện; điều này tách biệt với tìm kiếm web tự nhiên.

## 6. Thông tin cần xác nhận cho các blocker

1. ID 32 là **Rượu Nếp Sữa** hay **Rượu Nếp Đục**?
2. ID 35: hai SKU khác nhau ở dung tích, màu hay nồng độ nào?
3. ID 36: giá bán đúng và các video nào phải giữ?
4. ID 37: các nồng độ đúng (30/35 hay 30/40/50), dung tích, giá, tồn kho và ảnh
   tương ứng từng biến thể?
5. Có cho phép đổi toàn bộ URL media `localhost` sang đường dẫn public
   `/uploads/...` không?

Chỉ thực hiện ghi dữ liệu sau khi có phê duyệt rõ Gói A và/hoặc Gói B.
