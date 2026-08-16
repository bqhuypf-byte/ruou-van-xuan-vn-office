# Feature: Auth

Login, register, and session management per `01-share-docs/API_SPEC.md`'s Auth Feature.

## Components

- `LoginForm` / `RegisterForm`: React Hook Form + Zod forms, presentational only (`onSubmit` is injected).
- `AuthProvider`: wraps the whole app (mounted in `main.tsx`). On mount, calls `authService.refresh()` (using the httpOnly refresh cookie) then `authService.getMe()` to restore a session after a page reload, since the access token lives in memory only (see [[axios lib]]). Shows a full-page spinner while `isInitializing`.

## Store

- `useAuthStore` (Zustand): `user`, `isAuthenticated`, `isInitializing`. `bootstrap()` restores the session on load; `logout()` calls the API then clears state regardless of the API result.

## Services & Hooks

- `authService`: calls `/auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout`, `/auth/me` (GET/PATCH), `/auth/change-password`. `login`/`refresh` also call `setAccessToken()` on the shared axios instance.
- `useLogin`, `useRegister`, `useLogout`: TanStack Query mutations. `useLogin` syncs the store's `user` on success; register does not log the user in (matches the API — register just creates the account).
- `useMe`: query gated on `isAuthenticated`, for profile pages.
- `useUpdateProfile`, `useChangePassword`: profile mutations.

## Pages & Routing

- `LoginPage` / `RegisterPage`, rendered under a new `AuthLayout` (`src/layouts/AuthLayout.tsx`) at `/login` and `/register`.
- `src/routes/ProtectedRoute.tsx`: redirects to `/login` when unauthenticated.
- `src/routes/AdminRoute.tsx`: redirects to `/login` when unauthenticated, or to `/` when the user isn't `role === 'admin'`. Now wraps `/admin/*` in `routes/index.tsx` — previously those routes had no auth check at all.
- `AdminLayout` shows the real logged-in user (`fullName`/`email`) and a working logout button (was hardcoded to a fake "Administrator" account).

## Known Gap

There is currently no way to reach an `admin`-role account through the UI: `/auth/register` always assigns the `customer` role (per API_SPEC), and no admin user is seeded yet. Seeding one (e.g. via the `seed-data` skill, extending the `roles` seed already in place) is the natural next step before `/admin` is reachable end-to-end.
