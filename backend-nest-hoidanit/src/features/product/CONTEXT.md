# Feature: Product (Categories)

CRUD for the `categories` table (per `01-share-docs/DATABASE.md`): `id`, `parent_id` (self-referencing FK, nullable), `name`, `slug` (unique).

Only the `categories` slice of the `product` feature is implemented so far. `products`, `product_variants`, `product_images` (per BE-ARCHITECTURE.md's "Complex Feature" layout — `controllers/`, `services/`, `repositories/` per entity) are not built yet; add them under this same `product.module.ts` when needed.

## Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/categories` | List categories as a nested tree | No |
| GET | `/categories/:slug` | Category by slug + its direct children | No |
| POST | `/admin/categories` | Create category | Admin |
| PATCH | `/admin/categories/:id` | Update category | Admin |
| DELETE | `/admin/categories/:id` | Delete category | Admin |

## Notes

- `CategoryController` has no class-level `@Controller()` prefix — public routes and `/admin/*` routes are declared with full paths per-method, since a single controller can't have two base prefixes. Mirrors the split called out in API_SPEC.md's "Product Feature" vs. "Admin Endpoints" tables.
- Admin routes use `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles('admin')` — the first feature in this codebase to actually apply that combo, now that [[auth feature]] provides a working JWT strategy (`roles`/`users` CONTEXT.md notes describe this as a deferred follow-up; it's no longer deferred here).
- `GET /categories/:slug` returns "category + products" per API_SPEC.md, but only children categories are attached for now — the `products` field will be added once the `products` entity/relation exists.
- Tree building (`CategoryService.buildTree`) loads all rows in one query and nests them in memory by `parentId`, rather than N+1 querying per level.
- `create`/`update` validate `parentId` points to an existing category, and `update` rejects `parentId === id` (self-parenting). Deeper cycles (A → B → A) are not currently checked.
- `remove` refuses to delete a category that still has children, to avoid orphaning rows (self-ref has no cascade rule specified in DATABASE.md).
