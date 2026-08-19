# Feature: User Profile (Addresses)

Client-facing address book CRUD, per `01-share-docs/API_SPEC.md`'s User Profile endpoints (`/addresses`). All endpoints are user-scoped server-side — there is no admin split here, unlike `product`.

## Page & Route

- `AddressesPage` (`/profile`, protected): list/create/edit/delete addresses + "set as default." Linked from `MainLayout`'s header (user icon + a dedicated map-pin icon), both pointing at `ROUTES.PROFILE`.

## Structure

Mirrors `roles`/`users`: `types/address.types.ts`, `services/address.service.ts`, `hooks/useAddresses.ts` + `useAddressMutations.ts`, `components/AddressCard.tsx` + `AddressFormModal.tsx` + `AddressDeleteModal.tsx`, `pages/AddressesPage.tsx`.

## Notes

- `PATCH /addresses/:id/default` is a separate mutation (`useSetDefaultAddress`) from the general update — the backend already enforces "only one default address per user" (clearing others), so the frontend just calls it and refetches.
- No admin address management — API_SPEC.md has no `/admin/addresses` endpoints; addresses are purely self-service.
- Delete has no soft-delete semantics here (unlike `product`) — `DELETE /addresses/:id` is a real delete.
