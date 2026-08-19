# Brand Feature

Thẻ quảng cáo thương hiệu ("Top Electronics Brands") trên trang chủ. Admin quản lý danh sách, storefront chỉ lấy brand `isActive=true` sắp xếp theo `sortOrder`.

## Endpoints
- `GET /brands` — public, brand active sắp xếp theo sortOrder.
- `GET /admin/brands` — admin, toàn bộ brand (kể cả inactive).
- `POST /admin/brands` — tạo brand.
- `PATCH /admin/brands/:id` — cập nhật brand.
- `DELETE /admin/brands/:id` — xoá brand.
