Labeled text field used across search bars, forms, and admin CRUD modals.

```jsx
<Input label="Tên sản phẩm" placeholder="Ví dụ: iPhone 15" error={errors.name?.message} />
```

`leftIcon`/`rightIcon` accept a ReactNode (search icon in header search bar, etc). `error` swaps the border to rose and shows the message below; `helperText` shows in muted gray when there's no error. Search bars pair this with `style={{borderRadius:'var(--radius-full)', background:'var(--surface-alt)', border:'1px solid transparent'}}`.
