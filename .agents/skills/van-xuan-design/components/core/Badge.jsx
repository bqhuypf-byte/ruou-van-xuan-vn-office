import React from 'react';

const VARIANTS = {
  default: { bg: 'var(--neutral-subtle)', text: 'var(--neutral-subtle-text)', border: 'var(--neutral-subtle-border)' },
  primary: { bg: 'var(--brand-subtle)', text: 'var(--brand-subtle-text)', border: 'var(--brand-subtle-border)' },
  success: { bg: 'var(--success-subtle)', text: 'var(--success-subtle-text)', border: 'var(--success-subtle-border)' },
  warning: { bg: 'var(--warning-subtle)', text: 'var(--warning-subtle-text)', border: 'var(--warning-subtle-border)' },
  danger: { bg: 'var(--danger-subtle)', text: 'var(--danger-subtle-text)', border: 'var(--danger-subtle-border)' },
  info: { bg: 'var(--info-subtle)', text: 'var(--info-subtle-text)', border: 'var(--info-subtle-border)' },
};

const SIZES = {
  sm: { padding: '.125rem .5rem', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-medium)' },
  md: { padding: '.25rem .625rem', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-semibold)' },
};

/**
 * Badge — small status/category pill. Variants: default, primary, success, warning, danger, info.
 */
export function Badge({ children, variant = 'default', size = 'md', style, ...props }) {
  const v = VARIANTS[variant] || VARIANTS.default;
  const s = SIZES[size] || SIZES.md;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '.25rem',
        borderRadius: 'var(--radius-full)',
        border: `1px solid ${v.border}`,
        background: v.bg,
        color: v.text,
        fontFamily: 'var(--font-sans)',
        ...s,
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  );
}
