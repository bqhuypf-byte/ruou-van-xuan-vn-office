# Feature: Users

CRUD for the `users` table (per `01-share-docs/DATABASE.md`): `id`, `role_id` (FK, nullable), `email` (unique), `password_hash`, `full_name`, `phone` (nullable), `is_active`, `created_at`, `updated_at`.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/users` | List all users |
| GET | `/users/:id` | Get user by id |
| POST | `/users` | Create user |
| PATCH | `/users/:id` | Update user |
| DELETE | `/users/:id` | Delete user |

## Notes

- `password` is write-only: hashed with bcrypt (`SALT_ROUNDS = 10`) before storage, never returned in responses.
- Update does not accept a new password — password changes belong to the `auth` feature's `/auth/change-password` endpoint (per `01-share-docs/API_SPEC.md`) once that feature exists.
- `roleId` references `roles.id` (see [[roles feature]]), stored as a plain FK column — no TypeORM relation decorator to avoid a cross-feature entity import.
- Endpoints are currently **not guarded**, same as the `roles` feature: `auth` (JWT strategy, `JwtAuthGuard`) doesn't exist yet in this codebase. Once implemented, lock down write endpoints with `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles('admin')`.
