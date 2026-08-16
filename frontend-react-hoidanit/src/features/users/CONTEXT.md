# Feature: Users Management (Admin)

Provides Admin CRUD operations for user accounts in the system (`/admin/users`).

## Components

- `UserTable`: Render table of users with role badge, active/inactive status, and action buttons (Edit, Delete).
- `UserFormModal`: Modal dialog with React Hook Form + Zod validation for user create & update. Password is required on create, optional on edit (leave blank to keep current password). Role is selected from the `roles` feature's list via `useRoles`.
- `UserDeleteModal`: Confirmation modal before user deletion.

## Services & Hooks

- `userService`: REST API calls to `/users` (GET, POST, PATCH, DELETE).
- `useUsers`: TanStack Query hook with client-side search filtering (by name, email, id).
- `useCreateUser`, `useUpdateUser`, `useDeleteUser`: TanStack Query mutations with automatic query invalidation.

## Pages

- `UsersPage`: Primary admin page rendered under `/admin/users`.

## Cross-Feature Dependency

- Imports `useRoles` and the `Role` type from `@/features/roles` (barrel export) to populate the role selector and resolve role names for display.
