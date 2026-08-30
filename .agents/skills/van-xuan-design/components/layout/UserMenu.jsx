import React from 'react';

/**
 * UserMenu — avatar dropdown in the header for a signed-in user (profile, orders, admin, logout).
 */
export function UserMenu({ user, onLogout, isAdmin = false, linkComponent: A = 'a', routes = {} }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);
  if (!user) return null;
  const initial = (user.fullName || '?').charAt(0).toUpperCase();
  const itemStyle = { display: 'flex', alignItems: 'center', gap: '.75rem', padding: '.625rem .75rem', borderRadius: 'var(--radius-xl)', fontSize: 'var(--text-sm)', color: 'var(--slate-300)', textDecoration: 'none', cursor: 'pointer' };
  return (
    <div style={{ position: 'relative', fontFamily: 'var(--font-sans)' }} ref={ref}>
      <button onClick={() => setOpen((o) => !o)} style={{ display: 'flex', alignItems: 'center', gap: '.5rem', paddingLeft: '.5rem', marginLeft: '.25rem', paddingTop: '.375rem', paddingBottom: '.375rem', paddingRight: '.5rem', borderRadius: 'var(--radius-full)', borderLeft: '1px solid var(--border)', background: 'none', border: 'none', cursor: 'pointer' }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--brand)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', flexShrink: 0 }}>{initial}</div>
        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--slate-700)' }}>{user.fullName}</span>
        <span style={{ color: 'var(--faint)', fontSize: '.7rem', transform: open ? 'rotate(180deg)' : 'none', display: 'inline-block' }}>▾</span>
      </button>
      {open && (
        <div style={{ position: 'absolute', right: 0, marginTop: 8, width: 256, borderRadius: 'var(--radius-2xl)', background: 'var(--surface-inverse)', border: '1px solid var(--slate-800)', boxShadow: 'var(--shadow-xl)', overflow: 'hidden', zIndex: 50 }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--slate-800)' }}>
            <p style={{ margin: 0, fontWeight: 'var(--weight-semibold)', color: '#fff' }}>{user.fullName}</p>
            <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--slate-400)' }}>{user.email}</p>
          </div>
          <nav style={{ padding: '.5rem' }}>
            <A href={routes.profile || '#'} style={itemStyle}>Địa Chỉ Của Tôi</A>
            <A href={routes.orders || '#'} style={itemStyle}>Đơn Hàng Của Tôi</A>
            {isAdmin && <A href={routes.admin || '#'} style={itemStyle}>Trang Quản Trị</A>}
          </nav>
          <div style={{ borderTop: '1px solid var(--slate-800)', padding: '.5rem' }}>
            <button onClick={onLogout} style={{ ...itemStyle, width: '100%', color: 'var(--rose-400)', background: 'none', border: 'none', textAlign: 'left' }}>Đăng Xuất</button>
          </div>
        </div>
      )}
    </div>
  );
}
