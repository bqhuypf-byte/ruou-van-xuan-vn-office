# Feature: Auth

JWT authentication per `01-share-docs/API_SPEC.md`: register, login, refresh, logout, current user, profile update, password change. Owns the `refresh_tokens` table (per `01-share-docs/DATABASE.md`); depends on the `users` and `roles` features via their public service exports (no cross-feature internal imports).

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/register` | No | Register, assigned the `customer` role by default |
| POST | `/auth/login` | No | Validate credentials, issue access token + refresh cookie |
| POST | `/auth/refresh` | No* | Rotate refresh token (read from httpOnly cookie), issue new access token |
| POST | `/auth/logout` | Yes | Revoke the current refresh token, clear cookie |
| GET | `/auth/me` | Yes | Current user profile |
| PATCH | `/auth/me` | Yes | Update `fullName` / `phone` |
| PATCH | `/auth/change-password` | Yes | Verify current password, set new one, revoke all refresh tokens |

*Uses the `refreshToken` httpOnly cookie instead of a Bearer token.

## Tokens

- **Access token**: JWT signed with `JWT_SECRET`, `sub`/`email`/`role` payload, `JWT_EXPIRES_IN` lifetime (default 15m). Returned in the response body; the frontend keeps it in memory only (see [[axios lib]]).
- **Refresh token**: opaque random value (`crypto.randomBytes(48)`), stored as a SHA-256 hash (`refresh_tokens.token_hash`) — not bcrypt, since the token itself is high-entropy and needs to be looked up by exact hash. Sent as an `httpOnly`, `sameSite=lax` cookie scoped to `/api/v1/auth`, lifetime `JWT_REFRESH_EXPIRES_IN` (default 7d).
- Refresh rotates the token (old one revoked, new one issued) on every use. Change-password revokes all of a user's refresh tokens.

## Cross-Feature Additions

To support login/register without duplicating logic, small internal methods were added to the features auth depends on:

- `UsersService.findRawByEmail` / `findRawById` — return the full `User` entity (including `passwordHash`), for this feature's credential checks only. Never returned to a client.
- `UsersService.setPasswordHash` — used by change-password; the existing `update()` deliberately excludes password (see [[users feature]]).
- `RolesService.findByName` — resolves the default `customer` role at registration time.

## Guards & Decorators

Uses the pre-existing `JwtAuthGuard` (`src/shared/guards`) applied per-route via `@UseGuards`, plus `@CurrentUser()` to read the authenticated payload. There is no global default guard — routes are public unless explicitly guarded. `roles`/`users` CRUD endpoints remain unguarded for now (see their CONTEXT.md notes); locking those down with `@Roles('admin')` is a follow-up, deferred here to avoid breaking their existing e2e tests (which don't register a JWT strategy).

## Server Setup

- `main.ts`: `cookie-parser` middleware (reads `req.cookies`) and `enableCors({ credentials: true })` so the browser sends/receives the refresh cookie cross-origin.
- `shared/utils/duration.util.ts`: parses `"15m"` / `"7d"`-style config strings into milliseconds for cookie `maxAge` and refresh-token expiry.
