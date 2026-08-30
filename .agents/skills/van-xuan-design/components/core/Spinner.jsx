import React from 'react';

let injected = false;
function injectStyles() {
  if (injected || typeof document === 'undefined') return;
  injected = true;
  const style = document.createElement('style');
  style.textContent = `@keyframes vx-spin-rotate{to{transform:rotate(360deg)}}
.vx-spinner{animation:vx-spin-rotate .7s linear infinite;border-radius:50%;border-style:solid;border-color:var(--brand);border-top-color:transparent;display:inline-block}`;
  document.head.appendChild(style);
}

const SIZES = { sm: 16, md: 24, lg: 32, xl: 48 };

/**
 * Spinner — indeterminate loading indicator used on buttons, page loaders, and skeleton states.
 */
export function Spinner({ size = 'md', style, ...props }) {
  injectStyles();
  const px = SIZES[size] || SIZES.md;
  const border = Math.max(2, Math.round(px / 8));
  return <span className="vx-spinner" style={{ width: px, height: px, borderWidth: border, ...style }} {...props} />;
}
