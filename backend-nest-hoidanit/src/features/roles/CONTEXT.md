# Feature: Roles

CRUD for the `roles` table (per `01-share-docs/DATABASE.md`): `id`, `name` (unique).

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/roles` | List all roles |
| GET | `/roles/:id` | Get role by id |
| POST | `/roles` | Create role |
| PATCH | `/roles/:id` | Update role |
| DELETE | `/roles/:id` | Delete role |

## Notes

- `users.role_id` FK will be added once the `auth` feature (which owns `users`) is built.
- Endpoints are currently **not guarded**: the `auth` feature (JWT strategy, `JwtAuthGuard`) doesn't exist yet in this codebase, so `@UseGuards(JwtAuthGuard)` would fail at request time ("Unknown authentication strategy 'jwt'"). Once `auth` is implemented, lock down write endpoints with `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles('admin')`.
