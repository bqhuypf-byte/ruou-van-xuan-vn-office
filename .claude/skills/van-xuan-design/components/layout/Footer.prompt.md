Dark full-width footer mounted once in the main layout, on every public page. Brand blurb + two admin-editable link columns.

```jsx
<Footer siteName="Rượu Vạn Xuân" contactPhone="1900-xxxx" popularLinks={[{label:'Rượu Vang',url:'/categories/ruou-vang'}]} serviceLinks={[{label:'Chính Sách Đổi Trả',url:'/policy'}]} />
```

`linkComponent` lets a consumer pass their router's Link (defaults to plain `<a>`). Real site: link labels/URLs are admin-managed via Site Settings, not hardcoded — never invent "About/FAQ/Contact" links that don't map to a real route.
