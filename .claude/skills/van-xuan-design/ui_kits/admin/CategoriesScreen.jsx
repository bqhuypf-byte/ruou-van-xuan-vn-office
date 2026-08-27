function CategoriesScreen() {
  const { Button, Badge } = window.VNXuNDesignSystem_8cbe37;
  const rows = [
    { id: 1, depth: 0, name: 'Rượu Vang', slug: 'ruou-vang', products: 24 },
    { id: 2, depth: 1, name: 'Vang Đỏ', slug: 'vang-do', products: 14 },
    { id: 3, depth: 1, name: 'Vang Trắng', slug: 'vang-trang', products: 10 },
    { id: 4, depth: 0, name: 'Rượu Ngâm', slug: 'ruou-ngam', products: 18 },
    { id: 5, depth: 0, name: 'Rượu Nhập Khẩu', slug: 'nhap-khau', products: 9 },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 32, maxWidth: 1120, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><h1 style={{ margin: 0, fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-bold)', color: 'var(--ink)' }}>Danh Mục</h1><p style={{ margin: '4px 0 0', fontSize: 'var(--text-sm)', color: 'var(--muted)' }}>Cây danh mục sản phẩm, hiển thị theo cấp độ thụt lề.</p></div>
        <Button leftIcon={<i data-lucide="plus" style={{ width: 16, height: 16 }}></i>}>Thêm Danh Mục</Button>
      </div>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-2xl)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
          <thead><tr style={{ background: 'rgba(248,250,252,.8)', color: 'var(--muted)', fontWeight: 600, textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
            <th style={{ padding: '14px 24px' }}>Tên Danh Mục</th><th style={{ padding: '14px 24px' }}>Slug</th><th style={{ padding: '14px 24px' }}>Sản Phẩm</th><th style={{ padding: '14px 24px', textAlign: 'right' }}>Thao Tác</th>
          </tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                <td style={{ padding: '14px 24px', paddingLeft: 24 + r.depth * 24, fontWeight: r.depth === 0 ? 600 : 400, color: 'var(--ink)' }}>{r.depth > 0 && '— '}{r.name}</td>
                <td style={{ padding: '14px 24px', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)' }}>{r.slug}</td>
                <td style={{ padding: '14px 24px' }}><Badge size="sm">{r.products}</Badge></td>
                <td style={{ padding: '14px 24px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                    <Button variant="ghost" size="sm" leftIcon={<i data-lucide="edit-2" style={{ width: 14, height: 14 }}></i>}>Sửa</Button>
                    <Button variant="ghost" size="sm" style={{ color: 'var(--danger)' }} leftIcon={<i data-lucide="trash-2" style={{ width: 14, height: 14 }}></i>}>Xóa</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
window.CategoriesScreen = CategoriesScreen;
