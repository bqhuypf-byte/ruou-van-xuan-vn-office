# Project: hoidanit-ecommerce

## Overview
A full-featured e-commerce platform inspired by Amazon. This project demonstrates building a complete online shopping experience including product catalog, user authentication, shopping cart, checkout process, order management, and admin dashboard.

## Tech Stack
  - Frontend: React 19/Vite, TypeScript
  - Backend: NestJS v11, TypeScript
  - Database: MySQL

## Lệnh thường dùng
- Frontend dev: `cd frontend-react-hoidanit && npm run dev`
- Backend dev: `cd backend-nest-hoidanit && npm run dev`
- Frontend build: `cd frontend-react-hoidanit && npm run build`
- Backend build: `cd backend-nest-hoidanit && npm run build`
- Frontend test: `cd frontend-react-hoidanit && npm run test`
- Backend test: `cd backend-nest-hoidanit && npm run test`
- Frontend lint: `cd frontend-react-hoidanit && npm run lint`
- Backend lint: `cd backend-nest-hoidanit && npm run lint`
- Seed database: `cd backend-nest-hoidanit && npm run seed`

## Quy ước quan trọng (áp dụng mọi lúc)
- Typography: heading (`h1`–`h3`) và body text đều dùng font **Be Vietnam Pro** (đổi từ Sora/Inter để dễ đọc hơn, hỗ trợ dấu tiếng Việt rõ nét) — tải qua Google Fonts `<link>` trong `index.html`, đăng ký thành `--font-heading`/`--font-sans` trong `@theme` của `src/index.css`. Không tự ý đổi sang font khác khi code UI.
- Toàn bộ elements trên Frontend phải cấu hình/chỉnh sửa được từ trang **Admin** — không hardcode nội dung có thể cần đổi sau này.
- Sản phẩm: mỗi màu/biến thể của 1 sản phẩm = 1 **SKU** riêng; SKU phải **sinh tự động** khi tạo sản phẩm mới.
- Có đơn hàng/thông báo mới → số **badge** cạnh mục thông báo phải tự động cập nhật.
- Footer: nội dung + link đều chỉnh sửa được từ Admin, quản lý tập trung 1 nơi.
- Brand color hiện tại: **brand-600** (`#003D29`, xanh rêu đậm) — token tự định nghĩa trong `@theme` của `src/index.css` (không phải màu Tailwind mặc định), dùng xuyên suốt storefront + admin (nút, badge, active state) qua các class `bg-brand-*`/`text-brand-*`/`border-brand-*`. Xem `frontend-react-hoidanit/docs/DESIGN_TOKENS.md` để biết lý do/lịch sử.
- Màu đỏ (rose-600, biến thể `danger` của `Badge`) chỉ dùng cho **badge giảm giá/khuyến mãi** và cảnh báo (hết hàng...) — không thay thế brand color chính.

## Structure
```
├── frontend/    → @frontend-react-hoidanit/AGENTS.md
├── backend/     → @backend-nest-hoidanit/AGENTS.md
└── 01-share-docs/        → Shared documentation
```

## Shared Docs
- @01-share-docs/API_SPEC.md
- @01-share-docs/DATABASE.md
## Available Skills

### Project Setup
- `/init-base [backend|frontend]` - Setup project architecture & environment

### Feature Development
- `/be-crud [feature]` - Generate backend CRUD (entity, controller, service, dto)
- `/fe-crud [feature]` - Generate frontend CRUD (pages, components, hooks)
- `/be-test [feature]` - Write backend tests (unit + integration)
- `/fe-test [feature]` - Write frontend tests (component + hook)
- `/responsive-van-xuan [scope]` - Review or implement responsive storefront/admin behavior for mobile and tablet

### Skill Routing
When user asks to:
- "tạo feature", "add entity", "generate crud" → Use `/be-crud` or `/fe-crud`
- "viết test", "add tests" → Use `/be-test` or `/fe-test`
- "init project", "setup structure" → Use `/init-base`

### Important
- Always read the skill's required docs BEFORE generating code
- Follow existing patterns in codebase
- Do NOT create feature code when running `/init-base`
