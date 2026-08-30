function ProductCard({ p }) {
  const { Badge } = window.VNXuNDesignSystem_8cbe37;
  return (
    <a href="#" onClick={(e) => e.preventDefault()} style={{ display: 'block', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-2xl)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', textDecoration: 'none', transition: 'box-shadow .15s, transform .15s' }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'none'; }}>
      <div style={{ aspectRatio: '1', background: p.bg || 'var(--slate-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,.85)', fontSize: 13 }}>
        <i data-lucide="wine" style={{ width: 40, height: 40 }}></i>
      </div>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {p.category && <Badge variant="primary" size="sm">{p.category}</Badge>}
        <h3 style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--ink)' }}>{p.name}</h3>
        {p.price && <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-bold)', color: 'var(--ink)' }}>{p.price}</span>}
      </div>
    </a>
  );
}
function StarRow({ rating = 5 }) {
  return <span style={{ color: 'var(--rating)', fontSize: 13, letterSpacing: 1 }}>{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>;
}
window.ProductCard = ProductCard;
window.StarRow = StarRow;
