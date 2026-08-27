import React from 'react';

const VARIANTS = {
  primary: { bg: 'var(--brand)', bgHover: 'var(--brand-hover)', color: '#fff', border: 'transparent', shadow: 'var(--shadow-sm)' },
  secondary: { bg: 'var(--slate-100)', bgHover: 'var(--slate-200)', color: 'var(--slate-700)', border: 'transparent', shadow: 'none' },
  danger: { bg: 'var(--danger)', bgHover: 'var(--danger-hover)', color: '#fff', border: 'transparent', shadow: 'var(--shadow-sm)' },
  outline: { bg: 'var(--surface)', bgHover: 'var(--slate-50)', color: 'var(--slate-700)', border: 'var(--border-strong)', shadow: 'none' },
  ghost: { bg: 'transparent', bgHover: 'var(--slate-100)', color: 'var(--slate-600)', border: 'transparent', shadow: 'none' },
};

const SIZES = {
  sm: { fontSize: 'var(--text-xs)', padding: '.375rem .625rem', gap: '.375rem' },
  md: { fontSize: 'var(--text-sm)', padding: '.5rem 1rem', gap: '.5rem' },
  lg: { fontSize: 'var(--text-base)', padding: '.625rem 1.25rem', gap: '.625rem' },
};

let injected = false;
function injectStyles() {
  if (injected || typeof document === 'undefined') return;
  injected = true;
  const style = document.createElement('style');
  style.textContent = `.vx-btn{display:inline-flex;align-items:center;justify-content:center;font-weight:var(--weight-medium);border-radius:var(--radius-lg);transition:all .15s ease;cursor:pointer;border-style:solid;border-width:1px;font-family:var(--font-sans)}
.vx-btn:disabled{opacity:.5;cursor:not-allowed}
.vx-btn:focus-visible{outline:2px solid var(--focus-ring);outline-offset:2px}
.vx-spin{animation:vx-spin .7s linear infinite}
@keyframes vx-spin{to{transform:rotate(360deg)}}`;
  document.head.appendChild(style);
}

/**
 * Button — primary interactive control. Variants: primary, secondary, danger, outline, ghost. Sizes: sm, md, lg.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  style,
  onClick,
  type = 'button',
  ...props
}) {
  injectStyles();
  const [hover, setHover] = React.useState(false);
  const v = VARIANTS[variant] || VARIANTS.primary;
  const s = SIZES[size] || SIZES.md;
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      className="vx-btn"
      style={{
        background: hover && !disabled && !isLoading ? v.bgHover : v.bg,
        color: v.color,
        borderColor: v.border,
        boxShadow: v.shadow,
        fontSize: s.fontSize,
        padding: s.padding,
        gap: s.gap,
        ...style,
      }}
      {...props}
    >
      {isLoading ? (
        <span className="vx-spin" style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid currentColor', borderTopColor: 'transparent', display: 'inline-block' }} />
      ) : (
        leftIcon && <span style={{ display: 'inline-flex', flexShrink: 0 }}>{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span style={{ display: 'inline-flex', flexShrink: 0 }}>{rightIcon}</span>}
    </button>
  );
}
