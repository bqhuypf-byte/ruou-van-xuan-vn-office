function StatCard({ icon, label, value, color }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-2xl)', padding: 20, boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-xl)', background: color.bg, color: color.fg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i data-lucide={icon} style={{ width: 22, height: 22 }}></i></div>
      <div><p style={{ margin: 0, fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-medium)', color: 'var(--muted)' }}>{label}</p><p style={{ margin: '2px 0 0', fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', color: 'var(--ink)' }}>{value}</p></div>
    </div>
  );
}
function ProductsScreen() {
  const { Button, Input, Badge, Modal } = window.VNXuNDesignSystem_8cbe37;
  const [products, setProducts] = React.useState([
    { id: 1, name: 'Vang Đỏ Đà Lạt 2021', slug: 'vang-do-da-lat-2021', category: 'Rượu Vang', active: true },
    { id: 2, name: 'Rượu Nếp Cẩm Thượng Hạng', slug: 'nep-cam-thuong-hang', category: 'Rượu Ngâm', active: true },
    { id: 3, name: 'Chivas Regal 12', slug: 'chivas-regal-12', category: 'Nhập Khẩu', active: false },
  ]);
  const [formOpen, setFormOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState(null);
  const [editing, setEditing] = React.useState(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 32, maxWidth: 1120, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><h1 style={{ margin: 0, fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-bold)', color: 'var(--ink)' }}>Quản Lý Sản Phẩm</h1><p style={{ margin: '4px 0 0', fontSize: 'var(--text-sm)', color: 'var(--muted)' }}>Quản lý danh sách sản phẩm trong hệ thống e-commerce.</p></div>
        <Button leftIcon={<i data-lucide="plus" style={{ width: 16, height: 16 }}></i>} onClick={() => { setEditing(null); setFormOpen(true); }}>Thêm Sản Phẩm</Button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        <StatCard icon="package" label="Tổng Sản Phẩm" value={products.length} color={{ bg: 'var(--brand-subtle)', fg: 'var(--brand)' }} />
        <StatCard icon="check-circle-2" label="Đang Bán" value={products.filter((p) => p.active).length} color={{ bg: 'var(--success-subtle)', fg: 'var(--success)' }} />
        <StatCard icon="x-circle" label="Ngừng Bán" value={products.filter((p) => !p.active).length} color={{ bg: 'var(--danger-subtle)', fg: 'var(--danger)' }} />
      </div>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-2xl)', padding: 16, boxShadow: 'var(--shadow-sm)', display: 'flex', gap: 16 }}>
        <div style={{ width: 320 }}><Input placeholder="Tìm theo tên hoặc slug..." leftIcon={<i data-lucide="search" style={{ width: 16, height: 16 }}></i>} /></div>
        <select style={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-strong)', fontSize: 'var(--text-sm)', padding: '8px 12px' }}><option>Tất cả danh mục</option></select>
        <select style={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-strong)', fontSize: 'var(--text-sm)', padding: '8px 12px' }}><option>Tất cả trạng thái</option></select>
      </div>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-2xl)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
          <thead><tr style={{ background: 'rgba(248,250,252,.8)', color: 'var(--muted)', fontWeight: 600, textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
            <th style={{ padding: '14px 24px' }}>ID</th><th style={{ padding: '14px 24px' }}>Sản Phẩm</th><th style={{ padding: '14px 24px' }}>Danh Mục</th><th style={{ padding: '14px 24px' }}>Trạng Thái</th><th style={{ padding: '14px 24px', textAlign: 'right' }}>Thao Tác</th>
          </tr></thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                <td style={{ padding: '16px 24px', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)' }}>#{p.id}</td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-lg)', background: 'var(--slate-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--faint)' }}><i data-lucide="wine" style={{ width: 18, height: 18 }}></i></div>
                    <div><p style={{ margin: 0, fontWeight: 600, color: 'var(--ink)' }}>{p.name}</p><p style={{ margin: 0, fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{p.slug}</p></div>
                  </div>
                </td>
                <td style={{ padding: '16px 24px' }}><Badge variant="primary" size="sm">{p.category}</Badge></td>
                <td style={{ padding: '16px 24px' }}>{p.active ? <Badge variant="success">Đang Bán</Badge> : <Badge variant="danger">Ngừng Bán</Badge>}</td>
                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                    <Button variant="ghost" size="sm" leftIcon={<i data-lucide="settings-2" style={{ width: 14, height: 14 }}></i>}>Quản Lý</Button>
                    <Button variant="ghost" size="sm" leftIcon={<i data-lucide="edit-2" style={{ width: 14, height: 14 }}></i>} onClick={() => { setEditing(p); setFormOpen(true); }}>Sửa</Button>
                    <Button variant="ghost" size="sm" style={{ color: 'var(--danger)' }} leftIcon={<i data-lucide="trash-2" style={{ width: 14, height: 14 }}></i>} onClick={() => setDeleteTarget(p)}>Xóa</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={formOpen} onClose={() => setFormOpen(false)} title={editing ? 'Chỉnh Sửa Sản Phẩm' : 'Tạo Sản Phẩm Mới'} description={editing ? `Cập nhật thông tin sản phẩm #${editing.id}` : 'Nhập thông tin để tạo sản phẩm mới'} size="lg">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Input label="Tên sản phẩm" defaultValue={editing?.name} placeholder="Ví dụ: Vang Đỏ Đà Lạt 2021" leftIcon={<i data-lucide="package" style={{ width: 16, height: 16 }}></i>} />
          <Input label="Slug" defaultValue={editing?.slug} placeholder="vang-do-da-lat-2021" leftIcon={<i data-lucide="link-2" style={{ width: 16, height: 16 }}></i>} />
          <div><label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 500, marginBottom: 6 }}>Danh Mục</label><select style={{ width: '100%', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-strong)', padding: '8px 12px', fontSize: 'var(--text-sm)' }}><option>-- Chọn danh mục --</option><option>Rượu Vang</option><option>Rượu Ngâm</option></select></div>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 500, marginBottom: 6 }}>Ảnh Đại Diện</label>
            <image-slot id={`product-thumb-${editing?.id ?? 'new'}`} shape="rounded" radius="12" placeholder="Kéo thả ảnh sản phẩm vào đây" style={{ width: '100%', height: 160 }}></image-slot>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-sm)', fontWeight: 500 }}><input type="checkbox" defaultChecked={editing?.active ?? true} /> Đang bán (hiển thị cho khách hàng)</label>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, paddingTop: 16, borderTop: '1px solid var(--slate-100)' }}>
            <Button variant="outline" onClick={() => setFormOpen(false)}>Hủy</Button>
            <Button onClick={() => setFormOpen(false)}>{editing ? 'Cập Nhật' : 'Tạo Mới'}</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Ngừng Bán Sản Phẩm" size="sm">
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)' }}>Bạn có chắc muốn ngừng bán "{deleteTarget?.name}"? Sản phẩm sẽ bị ẩn khỏi trang khách hàng.</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 16 }}>
          <Button variant="outline" onClick={() => setDeleteTarget(null)}>Hủy</Button>
          <Button variant="danger" onClick={() => setDeleteTarget(null)}>Ngừng Bán</Button>
        </div>
      </Modal>
    </div>
  );
}
window.ProductsScreen = ProductsScreen;
window.StatCard = StatCard;
