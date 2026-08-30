function HomePage({ nav }) {
  const { Button } = window.VNXuNDesignSystem_8cbe37;
  const { ProductCard } = window;
  const categories = ['Rượu Vang Đỏ', 'Rượu Vang Trắng', 'Rượu Ngâm', 'Rượu Đế', 'Rượu Nhập Khẩu'];
  const [activeCat, setActiveCat] = React.useState('Tất cả');
  const deals = [
    { name: 'Vang Đỏ Đà Lạt 2021', category: 'Rượu Vang', price: '320.000₫', bg: '#5b2333' },
    { name: 'Rượu Nếp Cẩm Thượng Hạng', category: 'Rượu Ngâm', price: '180.000₫', bg: '#7a4b1e' },
    { name: 'Chivas Regal 12', category: 'Nhập Khẩu', price: '890.000₫', bg: '#2e2a1f' },
    { name: 'Rượu Táo Mèo Sơn La', category: 'Rượu Ngâm', price: '150.000₫', bg: '#8a5a2a' },
    { name: 'Vang Trắng Chardonnay', category: 'Rượu Vang', price: '410.000₫', bg: '#c9b458' },
  ];
  const products = [...deals, { name: 'Rượu Đế Gò Đen', category: 'Rượu Đế', price: '95.000₫', bg: '#4a4a4a' }, { name: 'Whisky Johnnie Walker', category: 'Nhập Khẩu', price: '750.000₫', bg: '#1f1f1f' }, { name: 'Rượu Mơ Yên Tử', category: 'Rượu Ngâm', price: '165.000₫', bg: '#6b3f2a' }];

  return (
    <div style={{ background: 'var(--surface)' }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '24px var(--container-px) 0' }}>
        <section style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-2xl)', minHeight: 280, display: 'flex', alignItems: 'center', padding: '0 48px', background: '#2b1626' }}>
          <div style={{ maxWidth: 480, padding: '40px 0', color: '#fff' }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 'var(--text-lg)', opacity: .9 }}>Bộ Sưu Tập Mới</p>
            <h1 style={{ margin: '8px 0 0', fontSize: 'var(--text-4xl)', fontWeight: 'var(--weight-extrabold)', textTransform: 'uppercase', lineHeight: 'var(--leading-tight)' }}>Rượu Vang Việt Nam</h1>
            <p style={{ margin: '12px 0 0', fontSize: 'var(--text-lg)', opacity: .9 }}>Giảm đến 30%</p>
            <Button size="lg" style={{ marginTop: 24, borderRadius: 'var(--radius-full)', padding: '10px 32px', background: '#fff', color: '#2b1626' }}>Mua Ngay</Button>
          </div>
        </section>
      </div>

      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '40px var(--container-px)', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
          <h2 style={{ margin: 0, fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-extrabold)', color: 'var(--slate-700)' }}>Ưu Đãi <span style={{ color: 'var(--brand)' }}>Nổi Bật</span></h2>
          <a href="#" onClick={(e) => e.preventDefault()} style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)' }}>Xem Tất Cả →</a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 'var(--grid-gap)' }}>
          {deals.map((p) => <ProductCard key={p.name} p={p} />)}
        </div>
      </div>

      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 var(--container-px) 40px' }}>
        <h2 style={{ margin: '0 0 20px', fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-extrabold)', color: 'var(--slate-700)', borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>Mua Theo <span style={{ color: 'var(--brand)' }}>Danh Mục</span></h2>
        <div style={{ display: 'flex', gap: 24, overflowX: 'auto' }}>
          {categories.map((c) => (
            <div key={c} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, width: 100, flexShrink: 0, textAlign: 'center' }}>
              <span style={{ width: 100, height: 100, borderRadius: '50%', background: 'var(--surface-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand)' }}>
                <i data-lucide="wine" style={{ width: 32, height: 32 }}></i>
              </span>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--slate-700)' }}>{c}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 var(--container-px) 56px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
          <h2 style={{ margin: 0, fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-extrabold)', color: 'var(--slate-700)' }}>Tất Cả <span style={{ color: 'var(--brand)' }}>Sản Phẩm</span></h2>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['Tất cả', ...categories].map((c) => (
            <Button key={c} variant={activeCat === c ? 'primary' : 'outline'} size="sm" onClick={() => setActiveCat(c)}>{c}</Button>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 'var(--grid-gap)' }}>
          {products.map((p) => <ProductCard key={p.name} p={p} />)}
        </div>
      </div>
    </div>
  );
}
window.HomePage = HomePage;
