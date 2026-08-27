Centered dialog for admin create/edit forms and delete confirmations. Locks page scroll and closes on Escape or backdrop click.

```jsx
<Modal isOpen={open} onClose={close} title="Tạo Sản Phẩm Mới" description="Nhập thông tin để tạo sản phẩm mới" size="lg">
  <form>...</form>
</Modal>
```

`size` controls max-width (`sm` 448px → `xl` 896px; admin product/variant forms use `lg`). Pair the footer of your form with a right-aligned `outline` Cancel + `primary` submit `Button` pair, matching the admin CRUD modals.
