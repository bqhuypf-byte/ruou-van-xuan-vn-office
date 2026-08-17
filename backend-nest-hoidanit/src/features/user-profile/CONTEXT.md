# Feature: User Profile (Addresses)

CRUD for the `addresses` table (per `01-share-docs/DATABASE.md`): `id`, `user_id` (FK), `full_name`, `phone`, `address_line`, `city`, `is_default`.

## Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/addresses` | List current user's addresses | Yes |
| GET | `/addresses/:id` | Get address by id | Yes |
| POST | `/addresses` | Create address | Yes |
| PATCH | `/addresses/:id` | Update address | Yes |
| PATCH | `/addresses/:id/default` | Set as default address | Yes |
| DELETE | `/addresses/:id` | Delete address | Yes |

## Notes

- All endpoints are scoped to the authenticated user via `@CurrentUser()` (`JwtAuthGuard`) — every lookup filters by `userId`, so requesting another user's address returns 404 rather than 403 (avoids leaking existence).
- Setting `isDefault: true` on create/update, or calling `PATCH /addresses/:id/default`, clears `is_default` on the user's other addresses first (`AddressRepository.clearDefaultForUser`) so only one default exists per user at a time.
- `userId` is a plain FK column with no TypeORM relation decorator to [[users feature]], consistent with how `roleId` avoids a cross-feature entity import on `User`.
