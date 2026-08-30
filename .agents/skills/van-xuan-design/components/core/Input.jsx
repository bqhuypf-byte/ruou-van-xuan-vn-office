import React from 'react';

let injected = false;
function injectStyles() {
  if (injected || typeof document === 'undefined') return;
  injected = true;
  const style = document.createElement('style');
  style.textContent = `.vx-input{width:100%;border-radius:var(--radius-lg);border:1px solid var(--border-strong);font-size:var(--text-sm);padding:.5rem .75rem;color:var(--ink);font-family:var(--font-sans);transition:border-color .15s,box-shadow .15s}
.vx-input::placeholder{color:var(--faint)}
.vx-input:focus{outline:none;border-color:var(--brand);box-shadow:0 0 0 3px var(--focus-ring)}
.vx-input.vx-input-error{border-color:var(--rose-400);color:var(--rose-800)}
.vx-input.vx-input-error:focus{border-color:var(--danger);box-shadow:0 0 0 3px rgba(225,29,72,.15)}`;
  document.head.appendChild(style);
}

/**
 * Input — labeled text field with optional icon slots, error, and helper text.
 */
export function Input({ label, error, helperText, leftIcon, rightIcon, id, style, ...props }) {
  injectStyles();
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '.375rem', fontFamily: 'var(--font-sans)' }}>
      {label && (
        <label htmlFor={inputId} style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--slate-700)' }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {leftIcon && (
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, paddingLeft: '.75rem', display: 'flex', alignItems: 'center', color: 'var(--faint)', pointerEvents: 'none' }}>
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={`vx-input${error ? ' vx-input-error' : ''}`}
          style={{ paddingLeft: leftIcon ? '2.5rem' : undefined, paddingRight: rightIcon ? '2.5rem' : undefined, ...style }}
          {...props}
        />
        {rightIcon && (
          <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, paddingRight: '.75rem', display: 'flex', alignItems: 'center', color: 'var(--faint)', pointerEvents: 'none' }}>
            {rightIcon}
          </div>
        )}
      </div>
      {error ? (
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--danger)', margin: 0 }}>{error}</p>
      ) : helperText ? (
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', margin: 0 }}>{helperText}</p>
      ) : null}
    </div>
  );
}
