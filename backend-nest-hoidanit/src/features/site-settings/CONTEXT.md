# Site Settings Feature

Cấu hình thương hiệu/liên hệ toàn site (singleton row, id cố định = 1) — chỗ chủ sở hữu mới đổi "tiền tố" thương hiệu (tên site, logo, liên hệ, danh sách link footer) khi được bàn giao, không cần sửa code. Theo đúng pattern `site-content/homepage-content` (`findOrCreate`, seed mặc định khi chưa có row).

## Endpoints
- `GET /site-settings` — public.
- `PATCH /admin/site-settings` — admin, cập nhật một phần (partial).
