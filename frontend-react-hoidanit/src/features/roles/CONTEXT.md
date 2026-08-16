# Feature: Roles Management (Admin)

Provides Admin CRUD operations for user roles in the system (`/admin/roles`).

## Components

- `RoleTable`: Render table of roles with action buttons (Edit, Delete).
- `RoleFormModal`: Modal dialog with React Hook Form + Zod validation for role create & update.
- `RoleDeleteModal`: Confirmation modal before role deletion.

## Services & Hooks

- `roleService`: REST API calls to `/roles` (GET, POST, PATCH, DELETE).
- `useRoles`: TanStack Query hook with client-side search filtering.
- `useCreateRole`, `useUpdateRole`, `useDeleteRole`: TanStack Query mutations with automatic query invalidation.

## Pages

- `RolesPage`: Primary admin page rendered under `/admin/roles`.
