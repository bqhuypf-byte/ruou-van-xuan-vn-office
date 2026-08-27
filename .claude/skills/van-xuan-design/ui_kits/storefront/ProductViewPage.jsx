function ProductViewPage() {
  const { Badge, Button } = window.VNXuNDesignSystem_8cbe37;
  const { StarRow } = window;
  const [color, setColor] = React.useState('Đỏ');
  const [size, setSize] = React.useState('750ml');
  const [qty, setQty] = React.useState(1);
  const [tab, setTab] = React.useState('details');
  const related = [
    { name: 'Vang Trắng Chardonnay', category: 'Rượu Vang', price: '410.000₫', bg: '#c9b458' },
    { name: 'Rượu Táo Mèo Sơn La', category: 'Rượu Ngâm', price: '150.000₫', bg: '#8a5a2a' },
    { name: 'Chivas Regal 12', category: 'Nhập Khẩu', price: '890.000₫', bg: '#2e2a1f' },
    { name: 'Rượu Đế Gò Đen', category: 'Rượu Đế', price: '95.000₫', bg: '#4a4a4a' },
  ];
  const { ProductCard } = window;

  return (
    <div style={{ background: 'var(--surface)' }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '32px var(--container-px)', display: 'flex', flexDirection: 'column', gap: 32 }}>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-sm)', color: 'var(--muted)' }}>
          <a href="#" onClick={(e) => e.preventDefault()}>Trang chủ</a><span>›</span>
          <a href="#" onClick={(e) => e.preventDefault()}>Rượu Vang</a><span>›</span>
          <span style={{ color: 'var(--ink)', fontWeight: 'var(--weight-medium)' }}>Vang Đỏ Đà Lạt 2021</span>
        </nav>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 40 }}>
          <div style={{ display: 'flex', gap: 12, minWidth: 0, alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ width: 76, height: 76, borderRadius: 'var(--radius-xl)', background: i === 0 ? '#5b2333' : 'var(--slate-100)', border: i === 0 ? '2px solid var(--brand)' : '2px solid transparent' }} />
              ))}
            </div>
            <div style={{ flex: '1 1 0%', minWidth: 0, width: '100%', aspectRatio: '1', borderRadius: 'var(--radius-2xl)', background: '#5b2333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,.85)' }}>
              <i data-lucide="wine" style={{ width: 64, height: 64 }}></i>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
            <h1 style={{ margin: 0, fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-extrabold)', textTransform: 'uppercase', color: 'var(--ink)' }}>Vang Đỏ Đà Lạt 2021</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><StarRow rating={4} /><span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)' }}>4.2/5 (86 đánh giá)</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-bold)', color: 'var(--ink)' }}>320.000₫</span>
              <span style={{ fontSize: 'var(--text-lg)', color: 'var(--faint)', textDecoration: 'line-through' }}>400.000₫</span>
              <Badge variant="danger">-20%</Badge>
            </div>
            <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 'var(--leading-relaxed)' }}>Vang đỏ được trồng và lên men tại Đà Lạt, vị chát nhẹ, hậu vị ngọt dịu, phù hợp dùng trong các buổi tiệc hoặc làm quà tặng.</p>

            <div>
              <p style={{ margin: '0 0 10px', fontSize: 'var(--text-sm)', color: 'var(--muted)' }}>Chọn Màu</p>
              <div style={{ display: 'flex', gap: 10 }}>
                {[{ n: 'Đỏ', c: '#7a1f2b' }, { n: 'Hồng', c: '#d17a94' }].map((op) => (
                  <button key={op.n} onClick={() => setColor(op.n)} title={op.n} style={{ width: 36, height: 36, borderRadius: '50%', background: op.c, border: color === op.n ? '2px solid var(--brand)' : '2px solid var(--border)', cursor: 'pointer' }} />
                ))}
              </div>
            </div>
            <div>
              <p style={{ margin: '0 0 10px', fontSize: 'var(--text-sm)', color: 'var(--muted)' }}>Chọn Dung Tích</p>
              <div style={{ display: 'flex', gap: 10 }}>
                {['375ml', '750ml'].map((s) => (
                  <button key={s} onClick={() => setSize(s)} style={{ padding: '10px 20px', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', border: 'none', cursor: 'pointer', background: size === s ? 'var(--ink)' : 'var(--slate-100)', color: size === s ? '#fff' : 'var(--slate-600)' }}>{s}</button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Badge variant="success">Còn 24 sản phẩm</Badge>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--muted)' }}>SKU: RVD-2021-{size}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'var(--slate-100)', borderRadius: 'var(--radius-full)', padding: '12px 20px' }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate-500)' }}><i data-lucide="minus" style={{ width: 16, height: 16 }}></i></button>
                <span style={{ width: 16, textAlign: 'center', fontWeight: 'var(--weight-medium)' }}>{qty}</span>
                <button onClick={() => setQty(qty + 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate-500)' }}><i data-lucide="plus" style={{ width: 16, height: 16 }}></i></button>
              </div>
              <Button size="lg" style={{ borderRadius: 'var(--radius-full)', flex: 1 }}>Thêm Vào Giỏ Hàng</Button>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', gap: 32, borderBottom: '1px solid var(--border)' }}>
            {[['details', 'Mô Tả Sản Phẩm'], ['reviews', 'Đánh Giá & Nhận Xét (86)']].map(([k, l]) => (
              <button key={k} onClick={() => setTab(k)} style={{ padding: '16px 0', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', border: 'none', borderBottom: tab === k ? '2px solid var(--brand)' : '2px solid transparent', marginBottom: -1, background: 'none', cursor: 'pointer', color: tab === k ? 'var(--ink)' : 'var(--muted)' }}>{l}</button>
            ))}
          </div>
          <div style={{ padding: '32px 0' }}>
            {tab === 'details' ? (
              <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 'var(--leading-relaxed)', maxWidth: 640 }}>Vang đỏ được trồng và lên men tại Đà Lạt, vị chát nhẹ, hậu vị ngọt dịu, phù hợp dùng trong các buổi tiệc hoặc làm quà tặng.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[1, 2].map((i) => (
                  <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-2xl)', padding: 20 }}>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--slate-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--slate-400)', flexShrink: 0 }}><i data-lucide="user" style={{ width: 16, height: 16 }}></i></div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}><p style={{ margin: 0, fontWeight: 'var(--weight-semibold)' }}>Nguyễn Văn A</p><span style={{ fontSize: 11, color: 'var(--faint)' }}>12/08/2026</span></div>
                        <StarRow rating={5} />
                        <p style={{ margin: '8px 0 0', fontSize: 'var(--text-sm)', color: 'var(--slate-600)' }}>Rượu ngon, đóng gói cẩn thận, giao hàng nhanh.</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <h2 style={{ margin: 0, textAlign: 'center', fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-extrabold)', textTransform: 'uppercase', color: 'var(--ink)' }}>Có Thể Bạn Cũng Thích</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 'var(--grid-gap)' }}>
            {related.map((p) => <ProductCard key={p.name} p={p} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
window.ProductViewPage = ProductViewPage;
