Full-width dark strip used at the bottom of the Homepage and Product Detail page, above the Footer.

```jsx
<PromoBand title="Đừng bỏ lỡ các ưu đãi rượu vang mới nhất" ctaText="Xem Ưu Đãi" ButtonComponent={Button} />
```

Pass the design system's `Button` as `ButtonComponent` to get the real pill CTA style; falls back to a plain styled `<button>` if omitted. Plain CTA only — no newsletter email-capture field (the real product doesn't have a subscriber backend; don't imply one).
