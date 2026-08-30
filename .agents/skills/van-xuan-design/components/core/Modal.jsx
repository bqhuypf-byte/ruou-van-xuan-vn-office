import React from 'react';

const SIZES = { sm: '28rem', md: '32rem', lg: '42rem', xl: '56rem' };

/**
 * Modal — centered dialog with backdrop blur, used for admin CRUD forms and confirmations.
 */
export function Modal({ isOpen, onClose, title, description, children, size = 'md', closeIcon = '\u2715' }) {
  React.useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === 'Escape' && onClose && onClose();
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, overflowY: 'auto', fontFamily: 'var(--font-sans)' }}>
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,.6)', backdropFilter: 'blur(4px)' }}
      />
      <div style={{ display: 'flex', minHeight: '100%', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: SIZES[size] || SIZES.md,
            borderRadius: 'var(--radius-2xl)',
            background: 'var(--surface)',
            padding: '1.5rem',
            textAlign: 'left',
            boxShadow: 'var(--shadow-2xl)',
            border: '1px solid var(--border)',
          }}
        >
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: 'absolute', top: '1rem', right: '1rem', color: 'var(--faint)', background: 'none',
              border: 'none', borderRadius: 'var(--radius-lg)', padding: '.375rem', cursor: 'pointer', fontSize: 'var(--text-sm)', lineHeight: 1,
            }}
          >
            {closeIcon}
          </button>
          {(title || description) && (
            <div style={{ marginBottom: '1rem', paddingRight: '1.5rem' }}>
              {title && <h3 style={{ margin: 0, fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)', color: 'var(--ink)' }}>{title}</h3>}
              {description && <p style={{ margin: '.25rem 0 0', fontSize: 'var(--text-sm)', color: 'var(--muted)' }}>{description}</p>}
            </div>
          )}
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
