import React from 'react';

function TreeLinks({ categories, depth, linkComponent: A, onNavigate }) {
  return categories.map((c) => (
    <div key={c.id}>
      <A href={c.href || '#'} onClick={onNavigate} style={{ display: 'block', paddingLeft: 12 + depth * 16, paddingRight: 12, paddingTop: 8, paddingBottom: 8, borderRadius: 'var(--radius-xl)', fontSize: 'var(--text-sm)', textDecoration: 'none', fontWeight: depth === 0 ? 'var(--weight-semibold)' : 'var(--weight-normal)', color: depth === 0 ? 'var(--ink)' : 'var(--muted)' }}>
        {c.name}
      </A>
      {c.children?.length > 0 && <TreeLinks categories={c.children} depth={depth + 1} linkComponent={A} onNavigate={onNavigate} />}
    </div>
  ));
}

/**
 * CategoryNavMenu — header dropdown listing the full category tree.
 */
export function CategoryNavMenu({ tree = [], icon = '\u2630', linkComponent: A = 'a' }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);
  if (tree.length === 0) return null;
  return (
    <div style={{ position: 'relative', fontFamily: 'var(--font-sans)' }} ref={ref}>
      <button onClick={() => setOpen((o) => !o)} style={{ display: 'flex', alignItems: 'center', gap: '.375rem', padding: '.5rem .75rem', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--slate-700)', background: 'none', border: 'none', cursor: 'pointer' }}>
        <span aria-hidden="true">{icon}</span> Danh Mục <span style={{ fontSize: '.7rem', transform: open ? 'rotate(180deg)' : 'none', display: 'inline-block' }}>▾</span>
      </button>
      {open && (
        <div style={{ position: 'absolute', left: 0, marginTop: 8, width: 288, borderRadius: 'var(--radius-2xl)', background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-xl)', overflow: 'hidden', zIndex: 50, maxHeight: '70vh', overflowY: 'auto' }}>
          <nav style={{ padding: '.5rem' }}>
            <TreeLinks categories={tree} depth={0} linkComponent={A} onNavigate={() => setOpen(false)} />
          </nav>
        </div>
      )}
    </div>
  );
}
