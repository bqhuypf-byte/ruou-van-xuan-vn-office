import React from 'react';

/**
 * CartBadge — small header icon button showing the live cart item count.
 */
export function CartBadge({ itemCount = 0, icon = '\u{1F6D2}', linkComponent: A = 'a', href = '/cart' }) {
  return (
    <A href={href} aria-label="Giỏ hàng" style={{ position: 'relative', padding: '.5rem', borderRadius: 'var(--radius-lg)', color: 'var(--slate-600)', display: 'inline-flex', fontSize: 'var(--text-lg)', textDecoration: 'none' }}>
      <span aria-hidden="true">{icon}</span>
      {itemCount > 0 && (
        <span style={{ position: 'absolute', top: -4, right: -4, minWidth: 18, height: 18, padding: '0 4px', borderRadius: 'var(--radius-full)', background: 'var(--brand)', color: '#fff', fontSize: 10, fontWeight: 'var(--weight-bold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </A>
  );
}
