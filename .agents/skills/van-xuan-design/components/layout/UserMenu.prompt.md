Header avatar + name button that opens a dark dropdown (profile, orders, admin link if `isAdmin`, logout). Renders `null` when `user` is falsy — pair with a "Sign Up/Sign In" button in that case.

```jsx
<UserMenu user={{fullName:'Nguyen Van A', email:'a@x.com'}} isAdmin onLogout={handleLogout} routes={{orders:'/orders', admin:'/admin'}} />
```
