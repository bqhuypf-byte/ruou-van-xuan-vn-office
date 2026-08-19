# Banner Feature

Hero carousel banners hiển thị ở đầu trang chủ. Admin quản lý danh sách, storefront chỉ lấy banner `isActive=true` sắp xếp theo `sortOrder`.

## Endpoints
- `GET /banners` — public, banner active sắp xếp theo sortOrder.
- `GET /admin/banners` — admin, toàn bộ banner (kể cả inactive).
- `POST /admin/banners` — tạo banner.
- `PATCH /admin/banners/:id` — cập nhật banner.
- `DELETE /admin/banners/:id` — xoá banner.
