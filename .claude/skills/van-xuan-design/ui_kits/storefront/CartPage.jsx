function CartPage() {
  const { Badge, Button } = window.VNXuNDesignSystem_8cbe37;
  const [items, setItems] = React.useState([
    { id: 1, name: 'Vang Đỏ Đà Lạt 2021', variant: ['Đỏ', '750ml'], price: 320000, qty: 2, bg: '#5b2333' },
    { id: 2, name: 'Rượu Nếp Cẩm Thượng Hạng', variant: ['500ml'], price: 180000, qty: 1, bg: '#7a4b1e' },
  ]);
  const setQty = (id, qty) => setItems((its) => its.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)));
  const remove = (id) => setItems((its) => its.filter((i) => i.id !== id));
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const fmt = (n) => n.toLocaleString('vi-VN') + '₫';

  return (
    <div style={{ background: 'var(--surface-alt)', minHeight: 500 }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px var(--container-px)', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-bold)', color: 'var(--ink)' }}>Giỏ Hàng Của Bạn</h1>
          {items.length > 0 && <Button variant="outline" size="sm" leftIcon={<i data-lucide="trash-2" style={{ width: 14, height: 14 }}></i>} onClick={() => setItems([])}>Xóa Tất Cả</Button>}
        </div>

        {items.length === 0 ? (
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--border)', padding: 64, textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ margin: 0, fontWeight: 'var(--weight-semibold)' }}>Giỏ hàng của bạn đang trống</h3>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
            <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--border)', padding: 24, boxShadow: 'var(--shadow-sm)' }}>
              {items.map((it, idx) => (
                <div key={it.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 0', borderBottom: idx < items.length - 1 ? '1px solid var(--slate-100)' : 'none' }}>
                  <div style={{ width: 64, height: 64, borderRadius: 'var(--radius-lg)', background: it.bg, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,.8)' }}><i data-lucide="wine" style={{ width: 24, height: 24 }}></i></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontWeight: 'var(--weight-semibold)', color: 'var(--ink)' }}>{it.name}</p>
                    <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>{it.variant.map((v) => <Badge key={v} size="sm">{v}</Badge>)}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Button variant="outline" size="sm" onClick={() => setQty(it.id, it.qty - 1)}><i data-lucide="minus" style={{ width: 14, height: 14 }}></i></Button>
                    <span style={{ width: 28, textAlign: 'center', fontSize: 'var(--text-sm)' }}>{it.qty}</span>
                    <Button variant="outline" size="sm" onClick={() => setQty(it.id, it.qty + 1)}><i data-lucide="plus" style={{ width: 14, height: 14 }}></i></Button>
                  </div>
                  <div style={{ width: 110, textAlign: 'right', fontWeight: 'var(--weight-semibold)' }}>{fmt(it.price * it.qty)}</div>
                  <Button variant="ghost" size="sm" onClick={() => remove(it.id)} style={{ color: 'var(--danger)' }}><i data-lucide="trash-2" style={{ width: 16, height: 16 }}></i></Button>
                </div>
              ))}
            </div>
            <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--border)', padding: 24, boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: 16, height: 'fit-content' }}>
              <h2 style={{ margin: 0, fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)' }}>Tóm Tắt Đơn Hàng</h2>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', color: 'var(--muted)' }}><span>Số lượng sản phẩm</span><span>{items.reduce((s, i) => s + i.qty, 0)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-base)', fontWeight: 'var(--weight-semibold)', paddingTop: 12, borderTop: '1px solid var(--slate-100)' }}><span>Tạm tính</span><span>{fmt(subtotal)}</span></div>
              <Button style={{ width: '100%' }} disabled title="Chức năng thanh toán sẽ sớm ra mắt">Thanh Toán (Sắp Ra Mắt)</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
window.CartPage = CartPage;
