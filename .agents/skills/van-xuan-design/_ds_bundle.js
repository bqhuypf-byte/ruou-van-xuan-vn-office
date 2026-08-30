/* @ds-bundle: {"format":4,"namespace":"VNXuNDesignSystem_8cbe37","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"Modal","sourcePath":"components/core/Modal.jsx"},{"name":"Spinner","sourcePath":"components/core/Spinner.jsx"},{"name":"CartBadge","sourcePath":"components/layout/CartBadge.jsx"},{"name":"CategoryNavMenu","sourcePath":"components/layout/CategoryNavMenu.jsx"},{"name":"Footer","sourcePath":"components/layout/Footer.jsx"},{"name":"PromoBand","sourcePath":"components/layout/PromoBand.jsx"},{"name":"UserMenu","sourcePath":"components/layout/UserMenu.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"57b68bfc1a80","components/core/Button.jsx":"7e9b602dc3f5","components/core/Input.jsx":"3cd486903c04","components/core/Modal.jsx":"722e05dd9485","components/core/Spinner.jsx":"dd21ffa46457","components/layout/CartBadge.jsx":"eabce10c4094","components/layout/CategoryNavMenu.jsx":"6a762f88444a","components/layout/Footer.jsx":"514aa64c3e28","components/layout/PromoBand.jsx":"716e288e2df2","components/layout/UserMenu.jsx":"cdb32a56f254","ui_kits/admin/CategoriesScreen.jsx":"56dc9f48c610","ui_kits/admin/HomeContentScreen.jsx":"c308d3fc7564","ui_kits/admin/ProductsScreen.jsx":"c1231d3d69f9","ui_kits/admin/SiteSettingsScreen.jsx":"4e17e396dd1e","ui_kits/admin/image-slot.js":"fff26d081c8d","ui_kits/storefront/CartPage.jsx":"c033d275bc6f","ui_kits/storefront/HomePage.jsx":"150283bd6355","ui_kits/storefront/ProductViewPage.jsx":"c77ba3d0c3f7","ui_kits/storefront/shared.jsx":"aacab1bee402"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.VNXuNDesignSystem_8cbe37 = window.VNXuNDesignSystem_8cbe37 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const VARIANTS = {
  default: {
    bg: 'var(--neutral-subtle)',
    text: 'var(--neutral-subtle-text)',
    border: 'var(--neutral-subtle-border)'
  },
  primary: {
    bg: 'var(--brand-subtle)',
    text: 'var(--brand-subtle-text)',
    border: 'var(--brand-subtle-border)'
  },
  success: {
    bg: 'var(--success-subtle)',
    text: 'var(--success-subtle-text)',
    border: 'var(--success-subtle-border)'
  },
  warning: {
    bg: 'var(--warning-subtle)',
    text: 'var(--warning-subtle-text)',
    border: 'var(--warning-subtle-border)'
  },
  danger: {
    bg: 'var(--danger-subtle)',
    text: 'var(--danger-subtle-text)',
    border: 'var(--danger-subtle-border)'
  },
  info: {
    bg: 'var(--info-subtle)',
    text: 'var(--info-subtle-text)',
    border: 'var(--info-subtle-border)'
  }
};
const SIZES = {
  sm: {
    padding: '.125rem .5rem',
    fontSize: 'var(--text-xs)',
    fontWeight: 'var(--weight-medium)'
  },
  md: {
    padding: '.25rem .625rem',
    fontSize: 'var(--text-xs)',
    fontWeight: 'var(--weight-semibold)'
  }
};

/**
 * Badge — small status/category pill. Variants: default, primary, success, warning, danger, info.
 */
function Badge({
  children,
  variant = 'default',
  size = 'md',
  style,
  ...props
}) {
  const v = VARIANTS[variant] || VARIANTS.default;
  const s = SIZES[size] || SIZES.md;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '.25rem',
      borderRadius: 'var(--radius-full)',
      border: `1px solid ${v.border}`,
      background: v.bg,
      color: v.text,
      fontFamily: 'var(--font-sans)',
      ...s,
      ...style
    }
  }, props), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const VARIANTS = {
  primary: {
    bg: 'var(--brand)',
    bgHover: 'var(--brand-hover)',
    color: '#fff',
    border: 'transparent',
    shadow: 'var(--shadow-sm)'
  },
  secondary: {
    bg: 'var(--slate-100)',
    bgHover: 'var(--slate-200)',
    color: 'var(--slate-700)',
    border: 'transparent',
    shadow: 'none'
  },
  danger: {
    bg: 'var(--danger)',
    bgHover: 'var(--danger-hover)',
    color: '#fff',
    border: 'transparent',
    shadow: 'var(--shadow-sm)'
  },
  outline: {
    bg: 'var(--surface)',
    bgHover: 'var(--slate-50)',
    color: 'var(--slate-700)',
    border: 'var(--border-strong)',
    shadow: 'none'
  },
  ghost: {
    bg: 'transparent',
    bgHover: 'var(--slate-100)',
    color: 'var(--slate-600)',
    border: 'transparent',
    shadow: 'none'
  }
};
const SIZES = {
  sm: {
    fontSize: 'var(--text-xs)',
    padding: '.375rem .625rem',
    gap: '.375rem'
  },
  md: {
    fontSize: 'var(--text-sm)',
    padding: '.5rem 1rem',
    gap: '.5rem'
  },
  lg: {
    fontSize: 'var(--text-base)',
    padding: '.625rem 1.25rem',
    gap: '.625rem'
  }
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
function Button({
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
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled || isLoading,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    onClick: onClick,
    className: "vx-btn",
    style: {
      background: hover && !disabled && !isLoading ? v.bgHover : v.bg,
      color: v.color,
      borderColor: v.border,
      boxShadow: v.shadow,
      fontSize: s.fontSize,
      padding: s.padding,
      gap: s.gap,
      ...style
    }
  }, props), isLoading ? /*#__PURE__*/React.createElement("span", {
    className: "vx-spin",
    style: {
      width: 14,
      height: 14,
      borderRadius: '50%',
      border: '2px solid currentColor',
      borderTopColor: 'transparent',
      display: 'inline-block'
    }
  }) : leftIcon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      flexShrink: 0
    }
  }, leftIcon), /*#__PURE__*/React.createElement("span", null, children), !isLoading && rightIcon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      flexShrink: 0
    }
  }, rightIcon));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  id,
  style,
  ...props
}) {
  injectStyles();
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '.375rem',
      fontFamily: 'var(--font-sans)'
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-medium)',
      color: 'var(--slate-700)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, leftIcon && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      paddingLeft: '.75rem',
      display: 'flex',
      alignItems: 'center',
      color: 'var(--faint)',
      pointerEvents: 'none'
    }
  }, leftIcon), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    className: `vx-input${error ? ' vx-input-error' : ''}`,
    style: {
      paddingLeft: leftIcon ? '2.5rem' : undefined,
      paddingRight: rightIcon ? '2.5rem' : undefined,
      ...style
    }
  }, props)), rightIcon && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      paddingRight: '.75rem',
      display: 'flex',
      alignItems: 'center',
      color: 'var(--faint)',
      pointerEvents: 'none'
    }
  }, rightIcon)), error ? /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--danger)',
      margin: 0
    }
  }, error) : helperText ? /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--muted)',
      margin: 0
    }
  }, helperText) : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/core/Modal.jsx
try { (() => {
const SIZES = {
  sm: '28rem',
  md: '32rem',
  lg: '42rem',
  xl: '56rem'
};

/**
 * Modal — centered dialog with backdrop blur, used for admin CRUD forms and confirmations.
 */
function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  closeIcon = '\u2715'
}) {
  React.useEffect(() => {
    if (!isOpen) return;
    const onKey = e => e.key === 'Escape' && onClose && onClose();
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      overflowY: 'auto',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(15,23,42,.6)',
      backdropFilter: 'blur(4px)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      minHeight: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      maxWidth: SIZES[size] || SIZES.md,
      borderRadius: 'var(--radius-2xl)',
      background: 'var(--surface)',
      padding: '1.5rem',
      textAlign: 'left',
      boxShadow: 'var(--shadow-2xl)',
      border: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Close",
    style: {
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      color: 'var(--faint)',
      background: 'none',
      border: 'none',
      borderRadius: 'var(--radius-lg)',
      padding: '.375rem',
      cursor: 'pointer',
      fontSize: 'var(--text-sm)',
      lineHeight: 1
    }
  }, closeIcon), (title || description) && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: '1rem',
      paddingRight: '1.5rem'
    }
  }, title && /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: 'var(--text-lg)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--ink)'
    }
  }, title), description && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '.25rem 0 0',
      fontSize: 'var(--text-sm)',
      color: 'var(--muted)'
    }
  }, description)), /*#__PURE__*/React.createElement("div", null, children))));
}
Object.assign(__ds_scope, { Modal });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Modal.jsx", error: String((e && e.message) || e) }); }

// components/core/Spinner.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
let injected = false;
function injectStyles() {
  if (injected || typeof document === 'undefined') return;
  injected = true;
  const style = document.createElement('style');
  style.textContent = `@keyframes vx-spin-rotate{to{transform:rotate(360deg)}}
.vx-spinner{animation:vx-spin-rotate .7s linear infinite;border-radius:50%;border-style:solid;border-color:var(--brand);border-top-color:transparent;display:inline-block}`;
  document.head.appendChild(style);
}
const SIZES = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48
};

/**
 * Spinner — indeterminate loading indicator used on buttons, page loaders, and skeleton states.
 */
function Spinner({
  size = 'md',
  style,
  ...props
}) {
  injectStyles();
  const px = SIZES[size] || SIZES.md;
  const border = Math.max(2, Math.round(px / 8));
  return /*#__PURE__*/React.createElement("span", _extends({
    className: "vx-spinner",
    style: {
      width: px,
      height: px,
      borderWidth: border,
      ...style
    }
  }, props));
}
Object.assign(__ds_scope, { Spinner });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Spinner.jsx", error: String((e && e.message) || e) }); }

// components/layout/CartBadge.jsx
try { (() => {
/**
 * CartBadge — small header icon button showing the live cart item count.
 */
function CartBadge({
  itemCount = 0,
  icon = '\u{1F6D2}',
  linkComponent: A = 'a',
  href = '/cart'
}) {
  return /*#__PURE__*/React.createElement(A, {
    href: href,
    "aria-label": "Gi\u1ECF h\xE0ng",
    style: {
      position: 'relative',
      padding: '.5rem',
      borderRadius: 'var(--radius-lg)',
      color: 'var(--slate-600)',
      display: 'inline-flex',
      fontSize: 'var(--text-lg)',
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, icon), itemCount > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: -4,
      right: -4,
      minWidth: 18,
      height: 18,
      padding: '0 4px',
      borderRadius: 'var(--radius-full)',
      background: 'var(--brand)',
      color: '#fff',
      fontSize: 10,
      fontWeight: 'var(--weight-bold)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, itemCount > 99 ? '99+' : itemCount));
}
Object.assign(__ds_scope, { CartBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/CartBadge.jsx", error: String((e && e.message) || e) }); }

// components/layout/CategoryNavMenu.jsx
try { (() => {
function TreeLinks({
  categories,
  depth,
  linkComponent: A,
  onNavigate
}) {
  return categories.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.id
  }, /*#__PURE__*/React.createElement(A, {
    href: c.href || '#',
    onClick: onNavigate,
    style: {
      display: 'block',
      paddingLeft: 12 + depth * 16,
      paddingRight: 12,
      paddingTop: 8,
      paddingBottom: 8,
      borderRadius: 'var(--radius-xl)',
      fontSize: 'var(--text-sm)',
      textDecoration: 'none',
      fontWeight: depth === 0 ? 'var(--weight-semibold)' : 'var(--weight-normal)',
      color: depth === 0 ? 'var(--ink)' : 'var(--muted)'
    }
  }, c.name), c.children?.length > 0 && /*#__PURE__*/React.createElement(TreeLinks, {
    categories: c.children,
    depth: depth + 1,
    linkComponent: A,
    onNavigate: onNavigate
  })));
}

/**
 * CategoryNavMenu — header dropdown listing the full category tree.
 */
function CategoryNavMenu({
  tree = [],
  icon = '\u2630',
  linkComponent: A = 'a'
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const onClick = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);
  if (tree.length === 0) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      fontFamily: 'var(--font-sans)'
    },
    ref: ref
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(o => !o),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '.375rem',
      padding: '.5rem .75rem',
      borderRadius: 'var(--radius-lg)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-medium)',
      color: 'var(--slate-700)',
      background: 'none',
      border: 'none',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, icon), " Danh M\u1EE5c ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '.7rem',
      transform: open ? 'rotate(180deg)' : 'none',
      display: 'inline-block'
    }
  }, "\u25BE")), open && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      marginTop: 8,
      width: 288,
      borderRadius: 'var(--radius-2xl)',
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      boxShadow: 'var(--shadow-xl)',
      overflow: 'hidden',
      zIndex: 50,
      maxHeight: '70vh',
      overflowY: 'auto'
    }
  }, /*#__PURE__*/React.createElement("nav", {
    style: {
      padding: '.5rem'
    }
  }, /*#__PURE__*/React.createElement(TreeLinks, {
    categories: tree,
    depth: 0,
    linkComponent: A,
    onNavigate: () => setOpen(false)
  }))));
}
Object.assign(__ds_scope, { CategoryNavMenu });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/CategoryNavMenu.jsx", error: String((e && e.message) || e) }); }

// components/layout/Footer.jsx
try { (() => {
/**
 * Footer — dark full-width site footer with brand blurb + two link columns, mounted once per page.
 */
function Footer({
  siteName = 'Rượu Vạn Xuân',
  contactPhone,
  whatsappNumber,
  popularTitle = 'Danh Mục Phổ Biến',
  popularLinks = [],
  serviceTitle = 'Chăm Sóc Khách Hàng',
  serviceLinks = [],
  copyrightText = `© ${new Date().getFullYear()} Rượu Vạn Xuân. All rights reserved.`,
  linkComponent: A = 'a'
}) {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--surface-inverse)',
      color: 'var(--surface-inverse-text)',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: 'var(--section-py) var(--container-px)',
      display: 'grid',
      gap: '2.5rem',
      gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: 'span 2',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '.625rem',
      fontWeight: 'var(--weight-bold)',
      fontSize: 'var(--text-lg)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      borderRadius: 'var(--radius-xl)',
      background: 'var(--brand)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, "VX"), siteName), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '.75rem',
      fontSize: 'var(--text-sm)'
    }
  }, whatsappNumber && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      color: 'var(--surface-inverse-muted)'
    }
  }, "WhatsApp"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontWeight: 'var(--weight-semibold)'
    }
  }, whatsappNumber)), contactPhone && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      color: 'var(--surface-inverse-muted)'
    }
  }, "Hotline"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontWeight: 'var(--weight-semibold)'
    }
  }, contactPhone)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-semibold)'
    }
  }, popularTitle), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: '1rem 0 0',
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: '.625rem',
      fontSize: 'var(--text-sm)',
      color: 'var(--surface-inverse-muted)'
    }
  }, popularLinks.map(l => /*#__PURE__*/React.createElement("li", {
    key: l.label
  }, /*#__PURE__*/React.createElement(A, {
    href: l.url,
    style: {
      color: 'inherit'
    }
  }, l.label))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-semibold)'
    }
  }, serviceTitle), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: '1rem 0 0',
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: '.625rem',
      fontSize: 'var(--text-sm)',
      color: 'var(--surface-inverse-muted)'
    }
  }, serviceLinks.map(l => /*#__PURE__*/React.createElement("li", {
    key: l.label
  }, /*#__PURE__*/React.createElement(A, {
    href: l.url,
    style: {
      color: 'inherit'
    }
  }, l.label)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid rgba(255,255,255,.15)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '1.25rem var(--container-px)',
      fontSize: 'var(--text-xs)',
      color: 'var(--surface-inverse-muted)',
      textAlign: 'center'
    }
  }, copyrightText)));
}
Object.assign(__ds_scope, { Footer });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/Footer.jsx", error: String((e && e.message) || e) }); }

// components/layout/PromoBand.jsx
try { (() => {
/**
 * PromoBand — dark CTA strip above the footer, drives to the product catalog.
 */
function PromoBand({
  title = 'Đừng bỏ lỡ các ưu đãi rượu vang mới nhất',
  ctaText = 'Xem Ưu Đãi',
  onCtaClick,
  ButtonComponent
}) {
  const Btn = ButtonComponent;
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-inverse)',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '2.5rem var(--container-px)',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1.25rem'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 'var(--text-xl)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--surface-inverse-text)'
    }
  }, title), Btn ? /*#__PURE__*/React.createElement(Btn, {
    variant: "primary",
    size: "lg",
    onClick: onCtaClick,
    style: {
      borderRadius: 'var(--radius-full)',
      padding: '.625rem 2rem',
      flexShrink: 0
    }
  }, ctaText) : /*#__PURE__*/React.createElement("button", {
    onClick: onCtaClick,
    style: {
      flexShrink: 0,
      borderRadius: 'var(--radius-full)',
      padding: '.625rem 2rem',
      background: 'var(--brand)',
      color: '#fff',
      border: 'none',
      fontWeight: 'var(--weight-medium)',
      fontSize: 'var(--text-base)',
      cursor: 'pointer'
    }
  }, ctaText)));
}
Object.assign(__ds_scope, { PromoBand });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/PromoBand.jsx", error: String((e && e.message) || e) }); }

// components/layout/UserMenu.jsx
try { (() => {
/**
 * UserMenu — avatar dropdown in the header for a signed-in user (profile, orders, admin, logout).
 */
function UserMenu({
  user,
  onLogout,
  isAdmin = false,
  linkComponent: A = 'a',
  routes = {}
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const onClick = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);
  if (!user) return null;
  const initial = (user.fullName || '?').charAt(0).toUpperCase();
  const itemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '.75rem',
    padding: '.625rem .75rem',
    borderRadius: 'var(--radius-xl)',
    fontSize: 'var(--text-sm)',
    color: 'var(--slate-300)',
    textDecoration: 'none',
    cursor: 'pointer'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      fontFamily: 'var(--font-sans)'
    },
    ref: ref
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(o => !o),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '.5rem',
      paddingLeft: '.5rem',
      marginLeft: '.25rem',
      paddingTop: '.375rem',
      paddingBottom: '.375rem',
      paddingRight: '.5rem',
      borderRadius: 'var(--radius-full)',
      borderLeft: '1px solid var(--border)',
      background: 'none',
      border: 'none',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 32,
      height: 32,
      borderRadius: '50%',
      background: 'var(--brand)',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-semibold)',
      flexShrink: 0
    }
  }, initial), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-medium)',
      color: 'var(--slate-700)'
    }
  }, user.fullName), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--faint)',
      fontSize: '.7rem',
      transform: open ? 'rotate(180deg)' : 'none',
      display: 'inline-block'
    }
  }, "\u25BE")), open && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: 0,
      marginTop: 8,
      width: 256,
      borderRadius: 'var(--radius-2xl)',
      background: 'var(--surface-inverse)',
      border: '1px solid var(--slate-800)',
      boxShadow: 'var(--shadow-xl)',
      overflow: 'hidden',
      zIndex: 50
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '1rem',
      borderBottom: '1px solid var(--slate-800)'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontWeight: 'var(--weight-semibold)',
      color: '#fff'
    }
  }, user.fullName), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-xs)',
      color: 'var(--slate-400)'
    }
  }, user.email)), /*#__PURE__*/React.createElement("nav", {
    style: {
      padding: '.5rem'
    }
  }, /*#__PURE__*/React.createElement(A, {
    href: routes.profile || '#',
    style: itemStyle
  }, "\u0110\u1ECBa Ch\u1EC9 C\u1EE7a T\xF4i"), /*#__PURE__*/React.createElement(A, {
    href: routes.orders || '#',
    style: itemStyle
  }, "\u0110\u01A1n H\xE0ng C\u1EE7a T\xF4i"), isAdmin && /*#__PURE__*/React.createElement(A, {
    href: routes.admin || '#',
    style: itemStyle
  }, "Trang Qu\u1EA3n Tr\u1ECB")), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--slate-800)',
      padding: '.5rem'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onLogout,
    style: {
      ...itemStyle,
      width: '100%',
      color: 'var(--rose-400)',
      background: 'none',
      border: 'none',
      textAlign: 'left'
    }
  }, "\u0110\u0103ng Xu\u1EA5t"))));
}
Object.assign(__ds_scope, { UserMenu });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/UserMenu.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/CategoriesScreen.jsx
try { (() => {
function CategoriesScreen() {
  const {
    Button,
    Badge
  } = window.VNXuNDesignSystem_8cbe37;
  const rows = [{
    id: 1,
    depth: 0,
    name: 'Rượu Vang',
    slug: 'ruou-vang',
    products: 24
  }, {
    id: 2,
    depth: 1,
    name: 'Vang Đỏ',
    slug: 'vang-do',
    products: 14
  }, {
    id: 3,
    depth: 1,
    name: 'Vang Trắng',
    slug: 'vang-trang',
    products: 10
  }, {
    id: 4,
    depth: 0,
    name: 'Rượu Ngâm',
    slug: 'ruou-ngam',
    products: 18
  }, {
    id: 5,
    depth: 0,
    name: 'Rượu Nhập Khẩu',
    slug: 'nhap-khau',
    products: 9
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      padding: 32,
      maxWidth: 1120,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 'var(--text-3xl)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)'
    }
  }, "Danh M\u1EE5c"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 0',
      fontSize: 'var(--text-sm)',
      color: 'var(--muted)'
    }
  }, "C\xE2y danh m\u1EE5c s\u1EA3n ph\u1EA9m, hi\u1EC3n th\u1ECB theo c\u1EA5p \u0111\u1ED9 th\u1EE5t l\u1EC1.")), /*#__PURE__*/React.createElement(Button, {
    leftIcon: /*#__PURE__*/React.createElement("i", {
      "data-lucide": "plus",
      style: {
        width: 16,
        height: 16
      }
    })
  }, "Th\xEAm Danh M\u1EE5c")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-2xl)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: 'var(--text-sm)'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      background: 'rgba(248,250,252,.8)',
      color: 'var(--muted)',
      fontWeight: 600,
      textAlign: 'left',
      borderBottom: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '14px 24px'
    }
  }, "T\xEAn Danh M\u1EE5c"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '14px 24px'
    }
  }, "Slug"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '14px 24px'
    }
  }, "S\u1EA3n Ph\u1EA9m"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '14px 24px',
      textAlign: 'right'
    }
  }, "Thao T\xE1c"))), /*#__PURE__*/React.createElement("tbody", null, rows.map(r => /*#__PURE__*/React.createElement("tr", {
    key: r.id,
    style: {
      borderBottom: '1px solid var(--slate-100)'
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 24px',
      paddingLeft: 24 + r.depth * 24,
      fontWeight: r.depth === 0 ? 600 : 400,
      color: 'var(--ink)'
    }
  }, r.depth > 0 && '— ', r.name), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 24px',
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--muted)'
    }
  }, r.slug), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 24px'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    size: "sm"
  }, r.products)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 24px',
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    leftIcon: /*#__PURE__*/React.createElement("i", {
      "data-lucide": "edit-2",
      style: {
        width: 14,
        height: 14
      }
    })
  }, "S\u1EEDa"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    style: {
      color: 'var(--danger)'
    },
    leftIcon: /*#__PURE__*/React.createElement("i", {
      "data-lucide": "trash-2",
      style: {
        width: 14,
        height: 14
      }
    })
  }, "X\xF3a")))))))));
}
window.CategoriesScreen = CategoriesScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/CategoriesScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/HomeContentScreen.jsx
try { (() => {
function HomeContentScreen() {
  const {
    Button,
    Input
  } = window.VNXuNDesignSystem_8cbe37;
  const Section = ({
    title,
    children
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-2xl)',
      padding: 20,
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontWeight: 600,
      fontSize: 'var(--text-base)',
      color: 'var(--ink)'
    }
  }, title), children);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 800,
      margin: '0 auto',
      padding: 32,
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      margin: 0,
      fontSize: 'var(--text-3xl)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "sparkles",
    style: {
      width: 22,
      height: 22,
      color: 'var(--brand)'
    }
  }), "N\u1ED9i Dung Trang Ch\u1EE7"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 0',
      fontSize: 'var(--text-sm)',
      color: 'var(--muted)'
    }
  }, "Ch\u1EC9nh s\u1EEDa ti\xEAu \u0111\u1EC1, m\xF4 t\u1EA3 v\xE0 n\xFAt g\u1ECDi h\xE0nh \u0111\u1ED9ng hi\u1EC3n th\u1ECB tr\xEAn trang ch\u1EE7 \u2014 kh\xF4ng c\u1EA7n s\u1EEDa code.")), /*#__PURE__*/React.createElement(Section, {
    title: "Banner Ch\xEDnh (Hero)"
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Nh\xE3n ph\u1EE5",
    defaultValue: "B\u1ED9 S\u01B0u T\u1EADp M\u1EDBi"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Ti\xEAu \u0111\u1EC1",
    defaultValue: "R\u01B0\u1EE3u Vang Vi\u1EC7t Nam"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "D\xF2ng ch\u1EEF \u01B0u \u0111\xE3i",
    defaultValue: "Gi\u1EA3m \u0111\u1EBFn 30%"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Ch\u1EEF tr\xEAn n\xFAt",
    defaultValue: "Mua Ngay"
  })), /*#__PURE__*/React.createElement(Section, {
    title: "D\u1EA3i \u01AFu \u0110\xE3i (Promo Band)"
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Ti\xEAu \u0111\u1EC1",
    defaultValue: "\u0110\u1EEBng b\u1ECF l\u1EE1 c\xE1c \u01B0u \u0111\xE3i r\u01B0\u1EE3u vang m\u1EDBi nh\u1EA5t"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Ch\u1EEF tr\xEAn n\xFAt",
    defaultValue: "Xem \u01AFu \u0110\xE3i"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(Button, null, "L\u01B0u Thay \u0110\u1ED5i")));
}
window.HomeContentScreen = HomeContentScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/HomeContentScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/ProductsScreen.jsx
try { (() => {
function StatCard({
  icon,
  label,
  value,
  color
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-2xl)',
      padding: 20,
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 48,
      height: 48,
      borderRadius: 'var(--radius-xl)',
      background: color.bg,
      color: color.fg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": icon,
    style: {
      width: 22,
      height: 22
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-medium)',
      color: 'var(--muted)'
    }
  }, label), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '2px 0 0',
      fontSize: 'var(--text-2xl)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)'
    }
  }, value)));
}
function ProductsScreen() {
  const {
    Button,
    Input,
    Badge,
    Modal
  } = window.VNXuNDesignSystem_8cbe37;
  const [products, setProducts] = React.useState([{
    id: 1,
    name: 'Vang Đỏ Đà Lạt 2021',
    slug: 'vang-do-da-lat-2021',
    category: 'Rượu Vang',
    active: true
  }, {
    id: 2,
    name: 'Rượu Nếp Cẩm Thượng Hạng',
    slug: 'nep-cam-thuong-hang',
    category: 'Rượu Ngâm',
    active: true
  }, {
    id: 3,
    name: 'Chivas Regal 12',
    slug: 'chivas-regal-12',
    category: 'Nhập Khẩu',
    active: false
  }]);
  const [formOpen, setFormOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState(null);
  const [editing, setEditing] = React.useState(null);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      padding: 32,
      maxWidth: 1120,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 'var(--text-3xl)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)'
    }
  }, "Qu\u1EA3n L\xFD S\u1EA3n Ph\u1EA9m"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 0',
      fontSize: 'var(--text-sm)',
      color: 'var(--muted)'
    }
  }, "Qu\u1EA3n l\xFD danh s\xE1ch s\u1EA3n ph\u1EA9m trong h\u1EC7 th\u1ED1ng e-commerce.")), /*#__PURE__*/React.createElement(Button, {
    leftIcon: /*#__PURE__*/React.createElement("i", {
      "data-lucide": "plus",
      style: {
        width: 16,
        height: 16
      }
    }),
    onClick: () => {
      setEditing(null);
      setFormOpen(true);
    }
  }, "Th\xEAm S\u1EA3n Ph\u1EA9m")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    icon: "package",
    label: "T\u1ED5ng S\u1EA3n Ph\u1EA9m",
    value: products.length,
    color: {
      bg: 'var(--brand-subtle)',
      fg: 'var(--brand)'
    }
  }), /*#__PURE__*/React.createElement(StatCard, {
    icon: "check-circle-2",
    label: "\u0110ang B\xE1n",
    value: products.filter(p => p.active).length,
    color: {
      bg: 'var(--success-subtle)',
      fg: 'var(--success)'
    }
  }), /*#__PURE__*/React.createElement(StatCard, {
    icon: "x-circle",
    label: "Ng\u1EEBng B\xE1n",
    value: products.filter(p => !p.active).length,
    color: {
      bg: 'var(--danger-subtle)',
      fg: 'var(--danger)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-2xl)',
      padding: 16,
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 320
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "T\xECm theo t\xEAn ho\u1EB7c slug...",
    leftIcon: /*#__PURE__*/React.createElement("i", {
      "data-lucide": "search",
      style: {
        width: 16,
        height: 16
      }
    })
  })), /*#__PURE__*/React.createElement("select", {
    style: {
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-strong)',
      fontSize: 'var(--text-sm)',
      padding: '8px 12px'
    }
  }, /*#__PURE__*/React.createElement("option", null, "T\u1EA5t c\u1EA3 danh m\u1EE5c")), /*#__PURE__*/React.createElement("select", {
    style: {
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-strong)',
      fontSize: 'var(--text-sm)',
      padding: '8px 12px'
    }
  }, /*#__PURE__*/React.createElement("option", null, "T\u1EA5t c\u1EA3 tr\u1EA1ng th\xE1i"))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-2xl)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: 'var(--text-sm)'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      background: 'rgba(248,250,252,.8)',
      color: 'var(--muted)',
      fontWeight: 600,
      textAlign: 'left',
      borderBottom: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '14px 24px'
    }
  }, "ID"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '14px 24px'
    }
  }, "S\u1EA3n Ph\u1EA9m"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '14px 24px'
    }
  }, "Danh M\u1EE5c"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '14px 24px'
    }
  }, "Tr\u1EA1ng Th\xE1i"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '14px 24px',
      textAlign: 'right'
    }
  }, "Thao T\xE1c"))), /*#__PURE__*/React.createElement("tbody", null, products.map(p => /*#__PURE__*/React.createElement("tr", {
    key: p.id,
    style: {
      borderBottom: '1px solid var(--slate-100)'
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '16px 24px',
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--muted)'
    }
  }, "#", p.id), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '16px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 'var(--radius-lg)',
      background: 'var(--slate-100)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--faint)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "wine",
    style: {
      width: 18,
      height: 18
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontWeight: 600,
      color: 'var(--ink)'
    }
  }, p.name), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 11,
      color: 'var(--muted)',
      fontFamily: 'var(--font-mono)'
    }
  }, p.slug)))), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '16px 24px'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    variant: "primary",
    size: "sm"
  }, p.category)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '16px 24px'
    }
  }, p.active ? /*#__PURE__*/React.createElement(Badge, {
    variant: "success"
  }, "\u0110ang B\xE1n") : /*#__PURE__*/React.createElement(Badge, {
    variant: "danger"
  }, "Ng\u1EEBng B\xE1n")), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '16px 24px',
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    leftIcon: /*#__PURE__*/React.createElement("i", {
      "data-lucide": "settings-2",
      style: {
        width: 14,
        height: 14
      }
    })
  }, "Qu\u1EA3n L\xFD"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    leftIcon: /*#__PURE__*/React.createElement("i", {
      "data-lucide": "edit-2",
      style: {
        width: 14,
        height: 14
      }
    }),
    onClick: () => {
      setEditing(p);
      setFormOpen(true);
    }
  }, "S\u1EEDa"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    style: {
      color: 'var(--danger)'
    },
    leftIcon: /*#__PURE__*/React.createElement("i", {
      "data-lucide": "trash-2",
      style: {
        width: 14,
        height: 14
      }
    }),
    onClick: () => setDeleteTarget(p)
  }, "X\xF3a")))))))), /*#__PURE__*/React.createElement(Modal, {
    isOpen: formOpen,
    onClose: () => setFormOpen(false),
    title: editing ? 'Chỉnh Sửa Sản Phẩm' : 'Tạo Sản Phẩm Mới',
    description: editing ? `Cập nhật thông tin sản phẩm #${editing.id}` : 'Nhập thông tin để tạo sản phẩm mới',
    size: "lg"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "T\xEAn s\u1EA3n ph\u1EA9m",
    defaultValue: editing?.name,
    placeholder: "V\xED d\u1EE5: Vang \u0110\u1ECF \u0110\xE0 L\u1EA1t 2021",
    leftIcon: /*#__PURE__*/React.createElement("i", {
      "data-lucide": "package",
      style: {
        width: 16,
        height: 16
      }
    })
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Slug",
    defaultValue: editing?.slug,
    placeholder: "vang-do-da-lat-2021",
    leftIcon: /*#__PURE__*/React.createElement("i", {
      "data-lucide": "link-2",
      style: {
        width: 16,
        height: 16
      }
    })
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontSize: 'var(--text-sm)',
      fontWeight: 500,
      marginBottom: 6
    }
  }, "Danh M\u1EE5c"), /*#__PURE__*/React.createElement("select", {
    style: {
      width: '100%',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-strong)',
      padding: '8px 12px',
      fontSize: 'var(--text-sm)'
    }
  }, /*#__PURE__*/React.createElement("option", null, "-- Ch\u1ECDn danh m\u1EE5c --"), /*#__PURE__*/React.createElement("option", null, "R\u01B0\u1EE3u Vang"), /*#__PURE__*/React.createElement("option", null, "R\u01B0\u1EE3u Ng\xE2m"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontSize: 'var(--text-sm)',
      fontWeight: 500,
      marginBottom: 6
    }
  }, "\u1EA2nh \u0110\u1EA1i Di\u1EC7n"), /*#__PURE__*/React.createElement("image-slot", {
    id: `product-thumb-${editing?.id ?? 'new'}`,
    shape: "rounded",
    radius: "12",
    placeholder: "K\xE9o th\u1EA3 \u1EA3nh s\u1EA3n ph\u1EA9m v\xE0o \u0111\xE2y",
    style: {
      width: '100%',
      height: 160
    }
  })), /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 'var(--text-sm)',
      fontWeight: 500
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    defaultChecked: editing?.active ?? true
  }), " \u0110ang b\xE1n (hi\u1EC3n th\u1ECB cho kh\xE1ch h\xE0ng)"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 12,
      paddingTop: 16,
      borderTop: '1px solid var(--slate-100)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    onClick: () => setFormOpen(false)
  }, "H\u1EE7y"), /*#__PURE__*/React.createElement(Button, {
    onClick: () => setFormOpen(false)
  }, editing ? 'Cập Nhật' : 'Tạo Mới')))), /*#__PURE__*/React.createElement(Modal, {
    isOpen: !!deleteTarget,
    onClose: () => setDeleteTarget(null),
    title: "Ng\u1EEBng B\xE1n S\u1EA3n Ph\u1EA9m",
    size: "sm"
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--muted)'
    }
  }, "B\u1EA1n c\xF3 ch\u1EAFc mu\u1ED1n ng\u1EEBng b\xE1n \"", deleteTarget?.name, "\"? S\u1EA3n ph\u1EA9m s\u1EBD b\u1ECB \u1EA9n kh\u1ECFi trang kh\xE1ch h\xE0ng."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 12,
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    onClick: () => setDeleteTarget(null)
  }, "H\u1EE7y"), /*#__PURE__*/React.createElement(Button, {
    variant: "danger",
    onClick: () => setDeleteTarget(null)
  }, "Ng\u1EEBng B\xE1n"))));
}
window.ProductsScreen = ProductsScreen;
window.StatCard = StatCard;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/ProductsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/SiteSettingsScreen.jsx
try { (() => {
function SiteSettingsScreen() {
  const {
    Button,
    Input
  } = window.VNXuNDesignSystem_8cbe37;
  const Section = ({
    title,
    children
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-2xl)',
      padding: 20,
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontWeight: 600,
      fontSize: 'var(--text-base)',
      color: 'var(--ink)'
    }
  }, title), children);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 800,
      margin: '0 auto',
      padding: 32,
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      margin: 0,
      fontSize: 'var(--text-3xl)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "settings",
    style: {
      width: 22,
      height: 22,
      color: 'var(--brand)'
    }
  }), "C\u1EA5u H\xECnh Th\u01B0\u01A1ng Hi\u1EC7u"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 0',
      fontSize: 'var(--text-sm)',
      color: 'var(--muted)'
    }
  }, "\u0110\u1ED5i t\xEAn site, logo, th\xF4ng tin li\xEAn h\u1EC7 v\xE0 c\xE1c li\xEAn k\u1EBFt footer.")), /*#__PURE__*/React.createElement(Section, {
    title: "Th\u01B0\u01A1ng hi\u1EC7u"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "T\xEAn site",
    defaultValue: "R\u01B0\u1EE3u V\u1EA1n Xu\xE2n"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontSize: 'var(--text-sm)',
      fontWeight: 500,
      marginBottom: 6
    }
  }, "Logo"), /*#__PURE__*/React.createElement("image-slot", {
    id: "site-logo",
    shape: "rounded",
    radius: "12",
    placeholder: "K\xE9o th\u1EA3 logo v\xE0o \u0111\xE2y",
    style: {
      width: '100%',
      height: 96
    }
  })))), /*#__PURE__*/React.createElement(Section, {
    title: "Li\xEAn h\u1EC7 & \u1EE8ng d\u1EE5ng"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i",
    defaultValue: "1900 6750"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "S\u1ED1 WhatsApp",
    placeholder: "+84..."
  })), /*#__PURE__*/React.createElement(Input, {
    label: "Ch\u1EEF b\u1EA3n quy\u1EC1n footer",
    defaultValue: "\xA9 2026 R\u01B0\u1EE3u V\u1EA1n Xu\xE2n. All rights reserved."
  })), /*#__PURE__*/React.createElement(Section, {
    title: "Ki\u1EC3u Ch\u1EEF"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontSize: 'var(--text-sm)',
      fontWeight: 500,
      marginBottom: 6
    }
  }, "Font ch\u1EEF to\xE0n trang"), /*#__PURE__*/React.createElement("select", {
    defaultValue: "inter",
    style: {
      width: '100%',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-strong)',
      padding: '8px 12px',
      fontSize: 'var(--text-sm)'
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: "system"
  }, "Font h\u1EC7 th\u1ED1ng (m\u1EB7c \u0111\u1ECBnh)"), /*#__PURE__*/React.createElement("option", {
    value: "inter"
  }, "Inter (sans hi\u1EC7n \u0111\u1EA1i)"), /*#__PURE__*/React.createElement("option", {
    value: "playfair"
  }, "Playfair Display + Inter (serif ti\xEAu \u0111\u1EC1)")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '6px 0 0',
      fontSize: 'var(--text-xs)',
      color: 'var(--muted)'
    }
  }, "\xC1p d\u1EE5ng cho to\xE0n b\u1ED9 trang kh\xE1ch h\xE0ng v\xE0 trang qu\u1EA3n tr\u1ECB, kh\xF4ng c\u1EA7n s\u1EEDa code."))), /*#__PURE__*/React.createElement(Section, {
    title: "C\u1ED9t \"Danh M\u1EE5c Ph\u1ED5 Bi\u1EBFn\" (footer)"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Nh\xE3n hi\u1EC3n th\u1ECB",
    defaultValue: "R\u01B0\u1EE3u Vang"
  }), /*#__PURE__*/React.createElement(Input, {
    placeholder: "/categories/ruou-vang",
    defaultValue: "/categories/ruou-vang"
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    style: {
      color: 'var(--danger)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "trash-2",
    style: {
      width: 16,
      height: 16
    }
  }))), /*#__PURE__*/React.createElement(Button, {
    type: "button",
    variant: "outline",
    size: "sm",
    leftIcon: /*#__PURE__*/React.createElement("i", {
      "data-lucide": "plus",
      style: {
        width: 14,
        height: 14
      }
    }),
    style: {
      alignSelf: 'flex-start'
    }
  }, "Th\xEAm")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(Button, null, "L\u01B0u Thay \u0110\u1ED5i")));
}
window.SiteSettingsScreen = SiteSettingsScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/SiteSettingsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/image-slot.js
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)
// Copied omelette starter. Re-running copy_starter_component with this kind overwrites this file with the latest version (page content is unaffected).
/* BEGIN USAGE */
/**
 * <image-slot> — user-fillable image placeholder.
 *
 * Drop this into a deck, mockup, or page wherever a design needs an image.
 * You control the slot's shape; it sizes to its container by default. When the search_stock_photos tool
 * is available, prefill the slot by default — write the photo's URL into
 * src (with credit/credit-href); the user can still fill or replace it
 * by dragging an image file onto it (or clicking to browse). The dropped
 * image persists across reloads via a .image-slots.state.json sidecar —
 * same read-via-fetch / write-via-window.omelette pattern as
 * design_canvas.jsx, so the filled slot shows on share links, downloaded
 * zips, and PPTX export. Outside the omelette runtime the slot is read-only.
 *
 * The sidecar is a SIBLING of the HTML file that uses this component: the
 * read is a document-relative fetch, and the host resolves the bridge's
 * sidecar writes into the previewed file's directory to match (same
 * contract as design_canvas.jsx). Pages in the same directory share one
 * sidecar; keep slot ids distinct across them.
 *
 * Attributes:
 *   id           Persistence key. REQUIRED for the drop to survive reload —
 *                every slot on the page needs a distinct id.
 *   shape        'rect' | 'rounded' | 'circle' | 'pill'   (default 'rounded')
 *                'circle' applies 50% border-radius; on a non-square slot
 *                that's an ellipse — set equal width and height for a true
 *                circle.
 *   radius       Corner radius in px for 'rounded'.       (default 12)
 *   mask         Any CSS clip-path value. Overrides `shape` — use this for
 *                hexagons, blobs, arbitrary polygons.
 *   fit          Initial framing baseline: cover | contain.   (default 'cover')
 *                cover starts the image filling the frame (overflow cropped);
 *                contain starts it fully visible (letterboxed). Either way the
 *                user can always pan/scale from there — double-click, or the
 *                Edit control, enters reframe mode (drag to move, scroll or
 *                corner-handles to scale; Escape / click-out commits). The
 *                crop persists alongside the image in the sidecar.
 *   placeholder  Empty-state caption.                      (default 'Drop an image')
 *   src          Optional initial/fallback image URL. Prefill it with a real
 *                photo via search_stock_photos when that tool is available
 *                (set credit/credit-href from the result). A user drop
 *                overrides it; clearing the drop reveals src again.
 *   credit       Attribution text shown as a small overlay at the
 *                bottom-left of the filled slot. REQUIRED whenever src
 *                points at any Unsplash host (images.unsplash.com,
 *                plus.unsplash.com, …): an Unsplash src with no credit
 *                renders an error tile INSTEAD of the photo (Unsplash
 *                terms forbid showing their photos unattributed). Use the
 *                exact form 'Photo by {photographer name} on Unsplash' —
 *                the overlay then links the name to credit-href and
 *                'Unsplash' to the Unsplash homepage, and links back to
 *                unsplash.com automatically get the required utm referral
 *                params appended at render time. The credit belongs to
 *                the src image, so it only shows while src is what's
 *                displayed — a user-dropped image hides it.
 *   credit-href  Link for the photographer's name in the credit overlay
 *                (their Unsplash profile URL from the stock-photo search
 *                results). http(s) URLs only — anything else renders the
 *                name as plain text.
 *
 * Sizing: the slot fills its container by default (width/height 100%).
 * Put it in a sized wrapper — absolutely positioned, a grid cell, a fixed
 * frame — and it takes exactly that box. When the parent's height is
 * indefinite (ordinary flow), it falls back to full width at a 3:2 aspect
 * ratio instead of collapsing. In a shrink-to-fit parent (a float,
 * width:max-content, an unsized absolute wrapper), percentages have
 * nothing to resolve against — size the slot or its wrapper explicitly
 * there. For a fixed-size slot, set
 * width/height on the element itself (inline style), which overrides the
 * default. When
 * layering content above a slot (full-bleed layouts), make the overlay
 * click-through — pointer-events: none on scrims/text plates, re-enabled
 * on interactive children — so the slot's hover controls stay reachable.
 * Keep the slot's bottom-left corner visually clear as well: the credit
 * overlay renders there, and a dark fade or text plate covering it hides
 * the attribution Unsplash's terms require — end the fade above that
 * corner, or keep it nearly transparent where the credit sits.
 *
 * Usage:
 *   <div style="position:relative;width:100%;height:100%">      <!-- full-bleed: -->
 *     <image-slot id="bg" shape="rect"></image-slot>            <!-- fills the wrapper -->
 *   </div>
 *   <image-slot id="hero"   style="width:800px;height:450px" shape="rounded" radius="20"
 *               placeholder="Drop a hero image"></image-slot>
 *   <image-slot id="avatar" style="width:120px;height:120px" shape="circle"></image-slot>
 *   <image-slot id="kite"   style="width:300px;height:300px"
 *               mask="polygon(50% 0, 100% 50%, 50% 100%, 0 50%)"></image-slot>
 */
/* END USAGE */

(() => {
  const STATE_FILE = '.image-slots.state.json';

  // Unsplash terms require visible attribution wherever their photos
  // display, and every link back to unsplash.com must carry utm referral
  // params. Two render-time rules enforce that here:
  //  - an Unsplash-src slot with NO credit attribute renders an error
  //    tile INSTEAD of the photo (an uncredited Unsplash photo on screen
  //    is itself the terms violation, so it never renders bare);
  //  - rendered credit links pointing at unsplash.com get the referral
  //    params appended when absent (credit-href values live in page
  //    content that can't be edited after the fact).
  // Keep the utm_source value in sync with UTM_SOURCE in
  // platform/web-agent/unsplash.ts — this file is a project-local
  // artifact and cannot import it (equality is pinned by tests).
  const UNSPLASH_HOMEPAGE_HREF = 'https://unsplash.com/?utm_source=claude_design&utm_medium=referral';
  // Host rule mirrors the hotlink validator that admits Unsplash srcs into
  // pages in the first place (cdn$ in unsplash.ts: apex or any subdomain)
  // — Unsplash+ results serve from plus.unsplash.com, not just images.*,
  // and an admitted-but-uncredited photo must error whatever unsplash
  // host it rides on.
  // Trailing-dot FQDNs (images.unsplash.com.) are the same host to the
  // browser but would miss the regex — strip one dot so the check fails
  // CLOSED (unrecognized-but-real Unsplash srcs must error, not render).
  const isUnsplashHost = u => {
    try {
      return /(^|\.)unsplash\.com$/.test(new URL(u, document.baseURI).hostname.replace(/\.$/, ''));
    } catch {
      return false;
    }
  };
  // Render-time referral normalization for links back to Unsplash:
  // appends utm_source/utm_medium when absent, preserves every existing
  // query param, never overwrites an existing utm_source, and passes
  // non-Unsplash URLs through untouched. Input is an ABSOLUTE validated
  // http(s) URL (the credit render funnel resolves + validates first).
  const withReferral = href => {
    try {
      const u = new URL(href);
      if (!/(^|\.)unsplash\.com$/.test(u.hostname.replace(/\.$/, ''))) {
        return href;
      }
      if (!u.searchParams.has('utm_source')) {
        u.searchParams.set('utm_source', 'claude_design');
      }
      if (!u.searchParams.has('utm_medium')) {
        u.searchParams.set('utm_medium', 'referral');
      }
      return u.toString();
    } catch (e) {
      return href;
    }
  };
  // 2× a ~600px slot in a 1920-wide deck — retina-sharp without making the
  // sidecar enormous. A 1200px WebP at q=0.85 is ~150-300KB.
  const MAX_DIM = 1200;
  // Raster formats only. SVG is excluded (can carry script; createImageBitmap
  // on SVG blobs is inconsistent). GIF is excluded because the canvas
  // re-encode keeps only the first frame, so an animated GIF would silently
  // go still — better to reject than surprise.
  const ACCEPT = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'];

  // ── Shared sidecar store ────────────────────────────────────────────────
  // One fetch + immediate write-on-change for every <image-slot> on the
  // page. Reads via fetch() so viewing works anywhere the HTML and sidecar
  // are served together; writes go through window.omelette.writeFile, which
  // the host allowlists to *.state.json basenames only.
  const subs = new Set();
  let slots = {};
  // ids explicitly cleared before the sidecar fetch resolved — otherwise
  // the merge below can't tell "never set" from "just deleted" and would
  // resurrect the sidecar's stale value.
  const tombstones = new Set();
  let loaded = false;
  let loadP = null;
  function load() {
    if (loadP) return loadP;
    loadP = fetch(STATE_FILE).then(r => r.ok ? r.json() : null).then(j => {
      // Merge: sidecar loses to any in-memory change that raced ahead of
      // the fetch (drop or clear) so neither is clobbered by hydration.
      if (j && typeof j === 'object') {
        const merged = Object.assign({}, j, slots);
        // A framing-only write that raced ahead of hydration must not
        // drop a user image that's only on disk — inherit u from the
        // sidecar for any in-memory entry that lacks one.
        for (const k in slots) {
          if (merged[k] && !merged[k].u && j[k]) {
            merged[k].u = typeof j[k] === 'string' ? j[k] : j[k].u;
          }
        }
        for (const id of tombstones) delete merged[id];
        slots = merged;
      }
      tombstones.clear();
    }).catch(() => {}).then(() => {
      loaded = true;
      subs.forEach(fn => fn());
    });
    return loadP;
  }

  // Serialize writes so two near-simultaneous drops on different slots
  // can't reorder at the backend and leave the sidecar with only the
  // first. A save requested mid-flight just marks dirty and re-fires on
  // completion with the then-current slots.
  let saving = false;
  let saveDirty = false;
  // Unload-time flush: save()'s serialization defers a mid-RTT re-fire to a
  // .then that never runs in an unloading document, silently dropping a
  // pagehide commit. Post the current slots immediately instead — content
  // is a superset snapshot of any in-flight save's, the write is a
  // whole-file last-writer-wins replace, and postMessage FIFO delivers it
  // to the host after the in-flight one, so a backend-side reorder at
  // worst reproduces the dropped-commit outcome this flush improves on.
  // Guarded on the initial sidecar read: pre-hydration slots can miss
  // other slots' persisted entries, and flushing it would clobber them —
  // that narrow case stays best-effort (the in-memory merge in load()
  // cannot happen in an unloading document anyway).
  function flushNow() {
    if (!loaded) return;
    const w = window.omelette && window.omelette.writeFile;
    if (!w) return;
    try {
      Promise.resolve(w(STATE_FILE, JSON.stringify(slots))).catch(() => {});
    } catch (e) {}
  }
  function save() {
    if (saving) {
      saveDirty = true;
      return;
    }
    const w = window.omelette && window.omelette.writeFile;
    if (!w) return;
    saving = true;
    Promise.resolve(w(STATE_FILE, JSON.stringify(slots))).catch(() => {}).then(() => {
      saving = false;
      if (saveDirty) {
        saveDirty = false;
        save();
      }
    });
  }
  const S_MAX = 5;
  const clampS = s => Math.max(1, Math.min(S_MAX, s));

  // Normalize a stored slot value. Pre-reframe sidecars stored a bare
  // data-URL string; newer ones store {u, s, x, y}. Either shape is valid.
  function getSlot(id) {
    const v = slots[id];
    if (!v) return null;
    return typeof v === 'string' ? {
      u: v,
      s: 1,
      x: 0,
      y: 0
    } : v;
  }
  function setSlot(id, val) {
    if (!id) return;
    if (val) {
      slots[id] = val;
      tombstones.delete(id);
    } else {
      delete slots[id];
      if (!loaded) tombstones.add(id);
    }
    subs.forEach(fn => fn());
    // A drop is rare + high-value — write immediately so nav-away can't lose
    // it. Gate on the initial read so we don't overwrite a sidecar we haven't
    // merged yet; the merge in load() keeps this change once the read lands.
    if (loaded) save();else load().then(save);
  }

  // ── Image downscale ─────────────────────────────────────────────────────
  // Encode through a canvas so the sidecar carries resized bytes, not the
  // raw upload. Longest side is capped at 2× the slot's rendered width
  // (retina) and at MAX_DIM. WebP keeps alpha and is ~10× smaller than PNG
  // for photos, so there's no need for per-image format picking.
  async function toDataUrl(file, targetW) {
    const bitmap = await createImageBitmap(file);
    try {
      const cap = Math.min(MAX_DIM, Math.max(1, Math.round(targetW * 2)) || MAX_DIM);
      const scale = Math.min(1, cap / Math.max(bitmap.width, bitmap.height));
      const w = Math.max(1, Math.round(bitmap.width * scale));
      const h = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h);
      return canvas.toDataURL('image/webp', 0.85);
    } finally {
      bitmap.close && bitmap.close();
    }
  }

  // ── Custom element ──────────────────────────────────────────────────────
  const stylesheet =
  // Fill the container by default: slots are usually placed inside a
  // sized wrapper (a hero frame, a grid cell, an inset:0 layer) and are
  // expected to take that box — a fixed intrinsic size would render as
  // a small tile in the corner of a full-bleed wrapper instead.
  // aspect-ratio is the companion fallback that keeps a bare slot
  // visible when the parent's height is indefinite: height:100%
  // resolves to auto there, and the ratio then derives height from
  // width instead of letting the slot collapse to zero height.
  // Explicit width/height on the element override all of this.
  // color:inherit (not a fixed near-black): the placeholder chrome —
  // empty-state icon/caption (currentColor) and the dashed ring — must
  // read on dark decks too, and the slide's own text color is the one
  // color guaranteed to contrast with the slide background. The soft
  // look comes from opacity on those parts, not from a baked-in alpha.
  ':host{display:block;position:relative;' + '  font:13px/1.3 system-ui,-apple-system,sans-serif;' + '  width:100%;height:100%;aspect-ratio:3/2}' + '.empty .cap,.empty .sub{opacity:.75}' + '.frame{position:absolute;inset:0;overflow:hidden;background:rgba(127,127,127,.08)}' +
  // .frame img (clipped) and .spill (unclipped ghost + handles) share the
  // same left/top/width/height in frame-%, computed by _applyView(), so the
  // inside-mask crop and the outside-mask spill stay pixel-aligned.
  '.frame img{position:absolute;max-width:none;transform:translate(-50%,-50%);' + '  -webkit-user-drag:none;user-select:none;touch-action:none}' +
  // Reframe mode (double-click): the full image spills past the mask. The
  // spill layer is sized to the IMAGE bounds so its corners are where the
  // resize handles belong. The ghost <img> inside is translucent; the real
  // clipped <img> underneath shows the opaque in-mask crop.
  // popover=manual promotes the spill to the top layer on reframe, so it is
  // not clipped by any overflow:hidden / clip-path / scroll-container
  // ancestor (a plain z-index can't escape overflow clipping). UA popover
  // defaults (inset:0;margin:auto) are reset; _applyView sets viewport px.
  '.spill{position:fixed;margin:0;inset:auto;border:0;padding:0;background:transparent;' + '  overflow:visible;transform:translate(-50%,-50%);z-index:1;cursor:grab;touch-action:none}' + ':host([data-panning]) .spill{cursor:grabbing}' + '.spill .ghost{position:absolute;inset:0;width:100%;height:100%;opacity:.35;' + '  pointer-events:none;-webkit-user-drag:none;user-select:none;' + '  box-shadow:0 0 0 1px rgba(0,0,0,.2),0 12px 32px rgba(0,0,0,.2)}' + '.spill .handle{position:absolute;width:12px;height:12px;border-radius:50%;' + '  background:#fff;box-shadow:0 0 0 1.5px #c96442,0 1px 3px rgba(0,0,0,.3);' + '  transform:translate(-50%,-50%)}' + '.spill .handle[data-c=nw]{left:0;top:0;cursor:nwse-resize}' + '.spill .handle[data-c=ne]{left:100%;top:0;cursor:nesw-resize}' + '.spill .handle[data-c=sw]{left:0;top:100%;cursor:nesw-resize}' + '.spill .handle[data-c=se]{left:100%;top:100%;cursor:nwse-resize}' + ':host([data-reframe]){z-index:10}' + ':host([data-reframe]) .frame{box-shadow:0 0 0 2px #c96442}' + '.empty{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;' + '  justify-content:center;gap:6px;text-align:center;padding:12px;box-sizing:border-box;' + '  cursor:pointer;user-select:none}' + '.empty svg{opacity:.45}' + '.empty .cap{max-width:90%;font-weight:500;letter-spacing:.01em}' + '.empty .sub{font-size:11px}' + '.empty .sub u{text-underline-offset:2px}' + '.empty:hover .sub{opacity:1}' + ':host([data-over]) .frame{outline:2px solid #c96442;outline-offset:-2px;' + '  background:rgba(201,100,66,.10)}' + '.ring{position:absolute;inset:0;pointer-events:none;border:1.5px dashed currentColor;' + '  opacity:.35;transition:border-color .12s,opacity .12s}' + ':host([data-over]) .ring{border-color:#c96442;opacity:1}' + ':host([data-filled]) .ring{display:none}' +
  // Controls overlay INSIDE the frame, pinned to the top-right corner, so
  // a full-bleed slot in an overflow:hidden container still shows them
  // (the old below-mask placement got clipped). Credit sits bottom-left,
  // so top-right avoids collision. The blurred pill background keeps them
  // legible over the image.
  // The UA [popover] base rule styles the element in EVERY state (only
  // display:none is gated on :not(:popover-open), and the display:flex
  // below overrides that) — so the UA resets live HERE, like .spill's,
  // or the ordinary hover-state strip renders as a bordered Canvas box
  // centered by margin:auto. inset:auto precedes top/right (shorthand).
  '.ctl{position:absolute;inset:auto;top:8px;right:8px;margin:0;border:0;padding:0;' + '  background:transparent;overflow:visible;' + '  display:flex;gap:6px;opacity:0;pointer-events:none;transition:opacity .12s;z-index:2;' + '  white-space:nowrap}' +
  // While reframing, the spill owns the top layer and would swallow every
  // click on the in-frame controls. Promoting .ctl into the top layer
  // ABOVE the spill (shown after it — later popovers stack higher) keeps
  // Edit-as-toggle and Replace clickable mid-reframe. _applyView pins it
  // to the frame's top-right in viewport px (translateX(-100%)
  // right-aligns against the computed left edge); inset:auto clears the
  // base rule's top/right so the inline left/top position it alone.
  '.ctl:popover-open{position:fixed;inset:auto;transform:translateX(-100%)}' + ':host([data-filled][data-editable]:hover) .ctl,:host([data-reframe]) .ctl' + '  {opacity:1;pointer-events:auto}' + '.ctl button{appearance:none;border:0;border-radius:6px;padding:5px 10px;cursor:pointer;' + '  background:rgba(0,0,0,.65);color:#fff;font:11px/1 system-ui,-apple-system,sans-serif;' + '  backdrop-filter:blur(6px)}' + '.ctl button:hover{background:rgba(0,0,0,.8)}' + '.err{position:absolute;left:8px;bottom:8px;right:8px;color:#b3261e;font-size:11px;' + '  background:rgba(255,255,255,.85);padding:4px 6px;border-radius:5px;pointer-events:none}' +
  // Replacement in flight: after a src swap the browser keeps painting
  // the PREVIOUS image until the new one decodes, so a Replace would
  // flash the old photo and then pop. Hide the stale frame (visibility,
  // not display — _applyView geometry still applies) and spin until the
  // new image reports in (load/error clears data-swapping).
  ':host([data-swapping]) .frame img{visibility:hidden}' + '.loading{position:absolute;inset:0;display:none;align-items:center;' + '  justify-content:center;pointer-events:none}' + ':host([data-swapping]) .loading{display:flex}' + '.loading::after{content:"";width:22px;height:22px;border-radius:50%;' + '  border:2px solid rgba(127,127,127,.25);border-top-color:currentColor;' + '  animation:om-slot-spin .7s linear infinite}' + '@keyframes om-slot-spin{to{transform:rotate(360deg)}}' +
  // Reduced motion: the static two-tone ring still reads as "working".
  '@media (prefers-reduced-motion:reduce){.loading::after{animation:none}}' + '.credit{position:absolute;left:6px;bottom:6px;max-width:calc(100% - 12px);display:none;' + '  padding:3px 7px;border-radius:5px;background:rgba(0,0,0,.55);color:#fff;' + '  font:10px/1.2 system-ui,-apple-system,sans-serif;text-decoration:none;' + '  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;backdrop-filter:blur(6px)}' +
  // The credit is a SPAN holding one or two <a>s (Unsplash's prescribed
  // form links the photographer AND Unsplash) — anchors style inline so
  // the overlay reads as one line of text.
  '.credit a{color:inherit;text-decoration:none}' + '.credit a:hover,.credit a:focus-visible{text-decoration:underline}' + ':host([data-filled][data-credit]) .credit{display:block}' +
  // Exports must ship JUST the image — no hover controls, no credit chip
  // (the host marks <html data-om-exporting> for the capture window; the
  // page-level hide script can't reach shadow DOM, this rule can).
  ':host-context([data-om-exporting]) .ctl,' + ':host-context([data-om-exporting]) .credit{display:none !important}' +
  // Print must ship just the image too: the hover-gated controls can be
  // mid-hover when print() fires, and the credit chip is screen chrome —
  // the same rule the capture window gets, keyed on print media instead
  // of the host's data-om-exporting mark (the print path sets no mark).
  '@media print{.ctl,.credit{display:none !important}}' +
  // No export-window mask rules here on purpose: the export capture
  // releases the replacement mask by REMOVING data-swapping (the
  // shadow-root pass in pages/export/shared.ts HIDE_EXPORT_CHROME_SCRIPT)
  // — attribute removal works in every engine (:host-context is
  // Chromium-only), is scoped by construction to slots actually
  // mid-swap, and hides the spinner through the same gate. A masked img
  // would otherwise be silently dropped from PPTX decks (the capture
  // walk skips visibility:hidden imgs).
  // Attribution error tile: REPLACES the photo when an Unsplash src has
  // no credit attribute — rendering the photo uncredited is the terms
  // violation, so the photo must not appear at all.
  // Calm and neutral on purpose (review feedback): the tile informs the
  // user; the fix instructions are machine-facing (usage docblock, tool
  // description, and the turn-end scan's bounce copy name the attributes
  // for the agent).
  '.attr-error{position:absolute;inset:0;display:none;flex-direction:column;align-items:center;' + '  justify-content:center;gap:6px;text-align:center;padding:12px;box-sizing:border-box;' + '  background:#f2f1ef;color:#6e6c66;user-select:none;' + '  font:13px/1.45 system-ui,-apple-system,sans-serif}' + '.attr-error svg{opacity:.55}' + '.attr-error .cap{max-width:92%;font-weight:500;letter-spacing:.01em}' + ':host([data-attribution-error]) .attr-error{display:flex}' + ':host([data-attribution-error]) .ring{display:none}';
  const icon = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' + 'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>' + '<path d="m21 15-5-5L5 21"/></svg>';
  const warnIcon = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' + 'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + '<path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>' + '<path d="M12 9v4"/><path d="M12 17h.01"/></svg>';
  class ImageSlot extends HTMLElement {
    static get observedAttributes() {
      return ['shape', 'radius', 'mask', 'fit', 'placeholder', 'src', 'id', 'credit', 'credit-href'];
    }

    /** Duplicate-slide hook (called by deck-stage, see its
     *  _remintDuplicateIds): copy this id's stored image, if any, under a
     *  freshly minted key and return that key — so a duplicated slide's
     *  slot keeps its dropped photo instead of reverting to the
     *  placeholder. 'isFree' is the caller's uniqueness check (document
     *  ids); candidates must ALSO be unused in the sidecar, which can
     *  hold keys from other pages sharing the project root. (An EMPTY
     *  slot on another page leaves no sidecar entry, so its id is not
     *  detectable here — a minted key can collide with it and that slot
     *  would show this photo. Same blast radius as two pages reusing an
     *  id by hand, which the shared sidecar already permits.) Returns null
     *  when no id could be minted (caller strips the id, today's
     *  behavior). */
    static cloneSlot(fromId, isFree) {
      if (typeof fromId !== 'string' || !fromId) return null;
      // Pre-hydration the store can't veto candidates or source the copy
      // — degrade to the strip (today's behavior) rather than mint
      // against keys we can't see yet. Any rendered (= droppable) slot
      // means load() has already settled.
      if (!loaded) return null;
      const stem = fromId.replace(/-\d+$/, '') || fromId;
      for (let n = 2; n < 100; n++) {
        const toId = stem + '-' + n;
        if (toId === fromId) continue;
        if (slots[toId] !== undefined) {
          // Reuse a key holding this exact value (bytes AND crop) if no
          // live element here owns it — a duplicate op the host refused
          // after minting leaves such a key behind, and reusing keeps
          // refused retries from accumulating one orphaned copy per
          // attempt. Full equality (not just bytes) so a byte-identical
          // key another PAGE owns with its own crop is stepped past, not
          // adopted or rewritten. (Entries without .u never match.)
          const prev = getSlot(toId);
          const cur = getSlot(fromId);
          if (!(prev && cur && prev.u && prev.u === cur.u && prev.s === cur.s && prev.x === cur.x && prev.y === cur.y && (typeof isFree !== 'function' || isFree(toId)))) continue;
          return toId;
        }
        if (typeof isFree === 'function' && !isFree(toId)) continue;
        const v = getSlot(fromId);
        if (v) setSlot(toId, Object.assign({}, v));
        return toId;
      }
      return null;
    }
    constructor() {
      super();
      // clonable: rail thumbnails deep-clone slides and carry this shadow
      // along; reuse an already-cloned root so upgrade-after-clone works.
      // (Deliberately NOT serializable — a getHTML consumer would embed
      // multi-MB sidecar data-URLs into serialized page HTML.)
      const root = this.shadowRoot || this.attachShadow({
        mode: 'open',
        clonable: true
      });
      // .spill and .ctl sit OUTSIDE .frame so overflow:hidden + border-radius
      // on the frame (circle, pill, rounded) can't clip them.
      root.innerHTML = '<style>' + stylesheet + '</style>' + '<div class="frame" part="frame">' + '  <img part="image" alt="" draggable="false" style="display:none">' + '  <div class="empty" part="empty">' + icon + '    <div class="cap"></div>' + '    <div class="sub">or <u>browse files</u></div></div>' + '  <div class="attr-error" part="attribution-error">' + warnIcon + '    <div class="cap">This photo needs attribution</div></div>' + '  <div class="loading" part="loading"></div>' + '  <div class="ring" part="ring"></div>' + '</div>' +
      // Outside .frame, like .spill/.ctl — the frame's overflow:hidden +
      // border-radius/clip-path would cut the credit off on circle/pill/mask.
      // A SPAN, not an <a>: the prescribed Unsplash credit holds two links
      // (photographer + Unsplash), built per-render in _render().
      '<span class="credit" part="credit"></span>' + '<div class="spill" popover="manual" data-dc-edit-transparent>' + '  <img class="ghost" alt="" draggable="false">' + '  <div class="handle" data-c="nw"></div><div class="handle" data-c="ne"></div>' + '  <div class="handle" data-c="sw"></div><div class="handle" data-c="se"></div>' + '</div>' +
      // data-dc-edit-transparent: the DC editor's edit-mode picker lets
      // clicks through for chrome marked with it (EDIT_TRANSPARENT_SEL)
      // — without it, Replace/Edit clicks in Edit mode are swallowed by
      // element selection and the controls look dead.
      '<div class="ctl" popover="manual" data-dc-edit-transparent><button data-act="replace" title="Replace image">Replace</button>' + '  <button data-act="edit" title="Reframe image">Edit</button></div>' + '<input type="file" accept="' + ACCEPT.join(',') + '" hidden>';
      this._frame = root.querySelector('.frame');
      this._ring = root.querySelector('.ring');
      this._img = root.querySelector('.frame img');
      this._empty = root.querySelector('.empty');
      this._cap = root.querySelector('.cap');
      this._sub = root.querySelector('.sub');
      this._spill = root.querySelector('.spill');
      this._ctl = root.querySelector('.ctl');
      this._credit = root.querySelector('.credit');
      this._attrError = root.querySelector('.attr-error');
      // Credit clicks open the link, not browse/reframe.
      this._credit.addEventListener('click', e => e.stopPropagation());
      this._credit.addEventListener('dblclick', e => e.stopPropagation());
      this._ghost = root.querySelector('.ghost');
      this._err = null;
      this._input = root.querySelector('input');
      this._depth = 0;
      this._gen = 0;
      // Encode-in-flight marker (the owning _ingest generation): while set,
      // the same-src "nothing in flight" clear in _render must not fire —
      // the stored value still points at the OLD image until the encode
      // lands, so that clear would unmask the stale image mid-replace.
      this._swapGen = 0;
      // Render-owned swap in flight: set when _render assigns a new src,
      // cleared only by the img's own load/error (or the empty branch).
      // img.complete CANNOT stand in for this — setting src only QUEUES
      // the current-request swap (a microtask), so synchronously after an
      // assignment, complete still reports the OLD settled request. The
      // pick path does exactly that: the host sets src, credit, and
      // credit-href back-to-back in one task, and renders #2/#3 would
      // read the stale complete === true and drop the mask one render
      // after it was set.
      this._loadPending = false;
      // See _render's empty branch: a transient attribution-error wipe of a
      // showing image must make the follow-up render a replacement (spinner),
      // not a first fill (blank frame).
      this._hidShowing = false;
      this._view = {
        s: 1,
        x: 0,
        y: 0
      };
      this._subFn = () => this._render();
      // Shadow-DOM listeners live with the shadow DOM — bound once here so
      // disconnect/reconnect (e.g. React remount) doesn't stack handlers.
      this._empty.addEventListener('click', () => this._input.click());
      root.addEventListener('click', e => {
        const act = e.target && e.target.getAttribute && e.target.getAttribute('data-act');
        if (!act) return;
        // The hidden controls are opacity-0 but still tabbable — without
        // this gate a keyboard user could drive them on a read-only share
        // link (mirrors the dblclick handler's editable gate).
        if (!this.hasAttribute('data-editable')) return;
        if (act === 'replace') {
          this._exitReframe(true);
          // Host-owned picker (Unsplash modal; it also offers local import).
          this.dispatchEvent(new CustomEvent('image-slot:pick', {
            bubbles: true,
            composed: true,
            detail: {
              id: this.id || null
            }
          }));
        }
        if (act === 'edit') {
          if (!this._reframes()) return;
          if (this.hasAttribute('data-reframe')) this._exitReframe(true);else this._enterReframe();
        }
      });
      this._input.addEventListener('change', () => {
        const f = this._input.files && this._input.files[0];
        if (f) this._ingest(f);
        this._input.value = '';
      });
      // naturalWidth/Height aren't known until load — re-apply so the cover
      // baseline is computed from real dimensions, not the 100%×100% fallback.
      // load/error also release the replacement-in-flight mask (via the
      // single discipline in _releaseMask): the swap is only revealed once
      // the new image can actually paint (on error the frame shows its
      // background, same as a fresh slot with a broken src).
      this._img.addEventListener('load', () => {
        this._loadPending = false;
        this._releaseMask(true);
        this._applyView();
      });
      this._img.addEventListener('error', () => {
        this._loadPending = false;
        this._releaseMask(true);
      });
      // Gated only on editable — any filled slot can be repositioned/scaled,
      // regardless of fit. Share links (no writeFile) stay static.
      this.addEventListener('dblclick', e => {
        if (!this.hasAttribute('data-editable') || !this._reframes()) return;
        e.preventDefault();
        if (this.hasAttribute('data-reframe')) this._exitReframe(true);else this._enterReframe();
      });
      // Pan + resize both originate on the spill layer. A handle pointerdown
      // drives an aspect-locked resize anchored at the opposite corner; any
      // other pointerdown on the spill pans. Offsets are frame-% so a
      // reframed slot survives responsive resize / PPTX export.
      this._spill.addEventListener('pointerdown', e => {
        if (e.button !== 0 || !this.hasAttribute('data-reframe')) return;
        e.preventDefault();
        e.stopPropagation();
        this._spill.setPointerCapture(e.pointerId);
        const rect = this.getBoundingClientRect();
        const fw = rect.width || 1,
          fh = rect.height || 1;
        const corner = e.target.getAttribute && e.target.getAttribute('data-c');
        let move;
        if (corner) {
          // Resize about the OPPOSITE corner. Viewport-px throughout (rect
          // fw/fh, not clientWidth) so the math survives a transform:scale()
          // ancestor — deck_stage renders slides scaled-to-fit.
          const iw = this._img.naturalWidth || 1,
            ih = this._img.naturalHeight || 1;
          const contain = (this.getAttribute('fit') || 'cover').toLowerCase() === 'contain';
          const base = contain ? Math.min(fw / iw, fh / ih) : Math.max(fw / iw, fh / ih);
          const sx = corner.includes('e') ? 1 : -1;
          const sy = corner.includes('s') ? 1 : -1;
          const s0 = this._view.s;
          const w0 = iw * base * s0,
            h0 = ih * base * s0;
          const cx0 = (50 + this._view.x) / 100 * fw;
          const cy0 = (50 + this._view.y) / 100 * fh;
          const ox = cx0 - sx * w0 / 2,
            oy = cy0 - sy * h0 / 2;
          const diag0 = Math.hypot(w0, h0);
          const ux = sx * w0 / diag0,
            uy = sy * h0 / diag0;
          move = ev => {
            const proj = (ev.clientX - rect.left - ox) * ux + (ev.clientY - rect.top - oy) * uy;
            const s = clampS(s0 * proj / diag0);
            const d = diag0 * s / s0;
            this._view.s = s;
            this._view.x = (ox + ux * d / 2) / fw * 100 - 50;
            this._view.y = (oy + uy * d / 2) / fh * 100 - 50;
            this._clampView();
            this._applyView();
          };
        } else {
          this.setAttribute('data-panning', '');
          const start = {
            px: e.clientX,
            py: e.clientY,
            x: this._view.x,
            y: this._view.y
          };
          move = ev => {
            this._view.x = start.x + (ev.clientX - start.px) / fw * 100;
            this._view.y = start.y + (ev.clientY - start.py) / fh * 100;
            this._clampView();
            this._applyView();
          };
        }
        const up = () => {
          try {
            this._spill.releasePointerCapture(e.pointerId);
          } catch {}
          this._spill.removeEventListener('pointermove', move);
          this._spill.removeEventListener('pointerup', up);
          this._spill.removeEventListener('pointercancel', up);
          this.removeAttribute('data-panning');
          this._dragUp = null;
        };
        // Stashed so _exitReframe (Escape / outside-click mid-drag) can
        // tear the capture + listeners down synchronously.
        this._dragUp = up;
        this._spill.addEventListener('pointermove', move);
        this._spill.addEventListener('pointerup', up);
        this._spill.addEventListener('pointercancel', up);
      });
      // Wheel zoom stays available inside reframe mode as a trackpad nicety —
      // zooms toward the cursor (offset' = cursor·(1-k) + offset·k).
      this.addEventListener('wheel', e => {
        if (!this.hasAttribute('data-reframe')) return;
        e.preventDefault();
        const r = this.getBoundingClientRect();
        const cx = (e.clientX - r.left) / r.width * 100 - 50;
        const cy = (e.clientY - r.top) / r.height * 100 - 50;
        const prev = this._view.s;
        const next = clampS(prev * Math.pow(1.0015, -e.deltaY));
        if (next === prev) return;
        const k = next / prev;
        this._view.s = next;
        this._view.x = cx * (1 - k) + this._view.x * k;
        this._view.y = cy * (1 - k) + this._view.y * k;
        this._clampView();
        this._applyView();
      }, {
        passive: false
      });
    }
    connectedCallback() {
      // Warn once per page — an id-less slot works for the session but
      // cannot persist, and two id-less slots would share nothing.
      if (!this.id && !ImageSlot._warned) {
        ImageSlot._warned = true;
        console.warn('<image-slot> without an id will not persist its dropped image.');
      }
      this.addEventListener('dragenter', this);
      this.addEventListener('dragover', this);
      this.addEventListener('dragleave', this);
      this.addEventListener('drop', this);
      subs.add(this._subFn);
      // The host may inject window.omelette.writeFile AFTER the first render;
      // re-render on hover so the editable-gated controls reliably appear.
      this.addEventListener('pointerenter', this._subFn);
      // width%/height% in _applyView encode the frame aspect at call time —
      // a host resize (responsive grid, pane divider) would stretch the
      // image until the next _render. Re-render on size change: _render()
      // re-seeds _view from stored before clamp/apply, so a shrink→grow
      // cycle round-trips instead of ratcheting x/y toward the narrower
      // frame's clamp range.
      this._ro = new ResizeObserver(() => this._render());
      this._ro.observe(this);
      load();
      this._render();
    }
    disconnectedCallback() {
      subs.delete(this._subFn);
      this.removeEventListener('pointerenter', this._subFn);
      this.removeEventListener('dragenter', this);
      this.removeEventListener('dragover', this);
      this.removeEventListener('dragleave', this);
      this.removeEventListener('drop', this);
      if (this._ro) {
        this._ro.disconnect();
        this._ro = null;
      }
      // commit=false: a disconnect is not a user intent — committing here
      // would persist whatever half-finished drag a React remount or DOM
      // splice happened to interrupt. Deliberate exits commit on their own
      // paths (Escape/click-out/toggle), and unloads commit via pagehide.
      this._exitReframe(false);
    }
    _enterReframe() {
      if (this.hasAttribute('data-reframe')) return;
      this.setAttribute('data-reframe', '');
      this._signalReframe(true);
      // Best-effort commit when the document unloads mid-reframe (a host
      // navigation racing the enter signal, a manual reload, tab close):
      // the sidecar write rides the host bridge, which outlives this
      // document, so the crop survives even though the mode dies with the
      // DOM. Held on the instance so _exitReframe detaches exactly what
      // was attached.
      this._pagehide = () => {
        this._exitReframe(true);
        flushNow();
      };
      window.addEventListener('pagehide', this._pagehide);
      // Promote spill to the top layer, then keep it pinned over the frame:
      // scroll/resize cover the common cases, and a per-frame rect check
      // catches layout shifts that fire neither (an image above finishing
      // load, streamed DOM pushing the slot down, an ancestor transform
      // change) so the overlay can't detach from the frame.
      try {
        this._spill.showPopover();
      } catch {}
      // After the spill, so the controls stack above it in the top layer.
      try {
        this._ctl.showPopover();
      } catch {}
      this._reposition = () => {
        if (this.hasAttribute('data-reframe')) this._applyView();
      };
      window.addEventListener('scroll', this._reposition, true);
      window.addEventListener('resize', this._reposition);
      this._lastRect = '';
      this._watch = () => {
        if (!this.hasAttribute('data-reframe')) return;
        const r = this.getBoundingClientRect();
        const key = r.left + ',' + r.top + ',' + r.width + ',' + r.height;
        if (key !== this._lastRect) {
          this._lastRect = key;
          this._applyView();
        }
        this._watchId = requestAnimationFrame(this._watch);
      };
      this._watchId = requestAnimationFrame(this._watch);
      this._applyView();
      // Close on click outside (the spill handler stopPropagation()s so
      // in-image drags don't reach this) and on Escape. Listeners are held
      // on the instance so _exitReframe / disconnectedCallback can detach
      // exactly what was attached.
      this._outside = e => {
        if (e.composedPath && e.composedPath().includes(this)) return;
        this._exitReframe(true);
      };
      this._esc = e => {
        if (e.key === 'Escape') this._exitReframe(true);
      };
      document.addEventListener('pointerdown', this._outside, true);
      document.addEventListener('keydown', this._esc, true);
    }
    _exitReframe(commit) {
      if (!this.hasAttribute('data-reframe')) return;
      if (this._dragUp) this._dragUp();
      this.removeAttribute('data-reframe');
      this.removeAttribute('data-panning');
      if (this._outside) document.removeEventListener('pointerdown', this._outside, true);
      if (this._esc) document.removeEventListener('keydown', this._esc, true);
      this._outside = this._esc = null;
      if (this._reposition) {
        window.removeEventListener('scroll', this._reposition, true);
        window.removeEventListener('resize', this._reposition);
        this._reposition = null;
      }
      if (this._watchId) {
        cancelAnimationFrame(this._watchId);
        this._watchId = 0;
      }
      if (this._pagehide) {
        window.removeEventListener('pagehide', this._pagehide);
        this._pagehide = null;
      }
      try {
        this._spill.hidePopover();
      } catch {}
      try {
        this._ctl.hidePopover();
      } catch {}
      this._ctl.style.left = '';
      this._ctl.style.top = '';
      if (commit) this._commitView();
      this._signalReframe(false);
    }

    // Reframe state lives only in this DOM until commit, invisible to the
    // host's dirty signals — announce enter/exit so the host can hold
    // auto-reloads for exactly the gesture (the guest bundle forwards
    // image-slot:reframe to the host as imageSlotReframe). Dispatched on
    // the element (composed, so it escapes shadow roots) while connected;
    // a disconnected exit (disconnectedCallback) falls back to document so
    // the host still hears it.
    _signalReframe(active) {
      const target = this.isConnected ? this : document;
      target.dispatchEvent(new CustomEvent('image-slot:reframe', {
        bubbles: true,
        composed: true,
        detail: {
          active: active,
          id: this.id || null
        }
      }));
    }

    // Public: host's "Import from computer" calls this to run local browse.
    openFilePicker() {
      this._exitReframe(true);
      this._input.click();
    }

    // A src write is a newer intent for this slot's content — the host
    // pick path (setImageSlotImage) or an agent edit — so it must win
    // over any encode still in flight from an earlier drop: left live,
    // that encode lands later, passes _ingest's gen guard, and its
    // setSlot silently overwrites the pick (the stored value shadows
    // src in _render). Bumping _gen kills the encode before its own
    // _swapGen clear runs, so clear the dead claim here too — otherwise
    // _releaseMask (gated on !_swapGen) never fires and the pick's
    // spinner is stranded. src ONLY: the pick sets credit/credit-href
    // in the same task, and clearing _swapGen on those would let the
    // same-src branch unmask the old image mid-encode.
    attributeChangedCallback(name, oldVal, newVal) {
      if (name === 'src' && oldVal !== newVal) {
        this._gen++;
        this._swapGen = 0;
      }
      if (this.shadowRoot) this._render();
    }

    // handleEvent — one listener object for all four drag events keeps the
    // add/remove symmetric and the depth counter correct.
    handleEvent(e) {
      if (e.type === 'dragenter' || e.type === 'dragover') {
        // Without preventDefault the browser never fires 'drop'.
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
        if (e.type === 'dragenter') this._depth++;
        this.setAttribute('data-over', '');
      } else if (e.type === 'dragleave') {
        // dragenter/leave fire for every descendant crossing — count depth
        // so hovering the icon inside the empty state doesn't flicker.
        if (--this._depth <= 0) {
          this._depth = 0;
          this.removeAttribute('data-over');
        }
      } else if (e.type === 'drop') {
        e.preventDefault();
        e.stopPropagation();
        this._depth = 0;
        this.removeAttribute('data-over');
        const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (f) this._ingest(f);
      }
    }
    async _ingest(file) {
      this._setError(null);
      if (!file || ACCEPT.indexOf(file.type) < 0) {
        this._setError('Drop a PNG, JPEG, WebP, or AVIF image.');
        return;
      }
      // toDataUrl can take hundreds of ms on a large photo. A Clear or a
      // newer drop during that window would be clobbered when this await
      // resumes — bump + capture a generation so stale encodes bail.
      const gen = ++this._gen;
      // Replacing a shown image: surface the swap through the encode too,
      // not just the decode — otherwise the old photo sits there with no
      // feedback while the canvas re-encode runs. An empty slot keeps its
      // placeholder (no spinner) until the encode lands, as before.
      // _swapGen guards the mask against re-renders DURING the encode
      // (pointerenter, ResizeObserver, another slot's store write): the
      // stored value still resolves to the old image there, so _render's
      // same-src clear would otherwise unmask it mid-replace.
      if (this.hasAttribute('data-filled')) {
        this.setAttribute('data-swapping', '');
        this._swapGen = gen;
      }
      try {
        const w = this.clientWidth || this.offsetWidth || MAX_DIM;
        const url = await toDataUrl(file, w);
        if (gen !== this._gen) return;
        // Only exit reframe once the new image is in hand — a rejected type
        // or decode failure leaves the in-progress crop untouched.
        this._exitReframe(false);
        // Clear BEFORE setSlot: its synchronous re-render must see no
        // pending encode, so a byte-identical re-upload (same data URL, no
        // load event coming) still clears the mask via the complete branch.
        this._swapGen = 0;
        const val = {
          u: url,
          s: 1,
          x: 0,
          y: 0
        };
        setSlot(this.id || '', val);
        // Keep a session-local copy for id-less slots so the drop still
        // shows, even though it cannot persist.
        if (!this.id) {
          this._local = val;
          this._render();
        }
      } catch (err) {
        if (gen !== this._gen) return;
        this._swapGen = 0;
        // Reveal the kept old image — unless another replacement (a
        // remote pick's src swap) is still in flight, in which case the
        // mask stays until THAT image settles (its load/error releases).
        this._releaseMask();
        this._setError('Could not read that image.');
        console.warn('<image-slot> ingest failed:', err);
      }
    }
    _setError(msg) {
      if (this._err) {
        this._err.remove();
        this._err = null;
      }
      if (!msg) return;
      const d = document.createElement('div');
      d.className = 'err';
      d.textContent = msg;
      this.shadowRoot.appendChild(d);
      this._err = d;
      setTimeout(() => {
        if (this._err === d) {
          d.remove();
          this._err = null;
        }
      }, 3000);
    }

    // Reframing (pan/resize) is available on any filled slot — the user can
    // always reposition/scale. `fit` only sets the initial baseline (see
    // _geom): contain starts fully-visible, cover starts frame-filling.
    _reframes() {
      return this.hasAttribute('data-filled');
    }

    // The single release discipline for the replacement-in-flight mask
    // (data-swapping). The mask comes off only when BOTH hold:
    //  - no encode is pending (_swapGen) — mid-encode the stored value
    //    still resolves to the old image, so any reveal paints it;
    //  - the frame img has settled on its current src — an unsettled src
    //    means some replacement is still in flight (e.g. a remote pick),
    //    whoever started it, and revealing would paint the previous
    //    frame. The load/error listeners pass settled=true (the event IS
    //    the settlement signal, per spec complete is true by then);
    //    other callers rely on the complete flag (covers loaded AND
    //    failed).
    // Every release path funnels through here EXCEPT _render's empty
    // branch (the img is being cleared — nothing will ever settle).
    _releaseMask(settled) {
      if (!this._swapGen && !this._loadPending && (settled || this._img.complete)) {
        this.removeAttribute('data-swapping');
      }
    }

    // Baseline geometry, shared by clamp/apply/resize. `base` is the scale at
    // view-scale s=1: cover = fill the frame (overflow on the looser axis),
    // contain = fit fully inside (letterboxed). Zooming a contain image past
    // s where it overflows naturally becomes a crop. Null until the img has
    // loaded (naturalWidth is 0 before that) or when the slot has no layout
    // box — ResizeObserver fires with a 0×0 rect under display:none, and
    // clamping against a degenerate 1×1 frame would silently pull the stored
    // pan toward zero.
    _geom() {
      const iw = this._img.naturalWidth,
        ih = this._img.naturalHeight;
      const fw = this.clientWidth,
        fh = this.clientHeight;
      if (!iw || !ih || !fw || !fh) return null;
      const contain = (this.getAttribute('fit') || 'cover').toLowerCase() === 'contain';
      const base = contain ? Math.min(fw / iw, fh / ih) : Math.max(fw / iw, fh / ih);
      return {
        iw,
        ih,
        fw,
        fh,
        base
      };
    }
    _clampView() {
      // Pan range on each axis is half the overflow past the frame edge.
      const g = this._geom();
      if (!g) return;
      const mx = Math.max(0, (g.iw * g.base * this._view.s / g.fw - 1) * 50);
      const my = Math.max(0, (g.ih * g.base * this._view.s / g.fh - 1) * 50);
      this._view.x = Math.max(-mx, Math.min(mx, this._view.x));
      this._view.y = Math.max(-my, Math.min(my, this._view.y));
    }
    _applyView() {
      const g = this._geom();
      // Top-layer controls: pin to the frame's top-right in viewport px
      // (the same 8px inset as the in-frame layout; unscaled — top-layer UI
      // reads as chrome, not page content). BEFORE the geometry branch:
      // placement needs only the frame rect, and a not-yet-loaded or broken
      // src must not leave the promoted strip floating unpositioned. Gated
      // on the popover actually being open: without the Popover API,
      // showPopover() threw (swallowed in _enterReframe), .ctl stays in
      // its in-frame absolute layout, and viewport-px coordinates would
      // shove it off-frame — and matches(':popover-open') itself throws
      // there (unknown pseudo-class), hence the try/catch.
      if (this.hasAttribute('data-reframe')) {
        let onTop = false;
        try {
          onTop = this._ctl.matches(':popover-open');
        } catch {}
        if (onTop) {
          const r = this.getBoundingClientRect();
          this._ctl.style.left = r.right - 8 + 'px';
          this._ctl.style.top = r.top + 8 + 'px';
        }
      }
      if (!g) {
        // Dimensions not known yet (before img load) — centered fit so there
        // is no flash of an unpositioned image before the geometry lands.
        const contain = (this.getAttribute('fit') || 'cover').toLowerCase() === 'contain';
        this._img.style.width = '100%';
        this._img.style.height = '100%';
        this._img.style.left = '50%';
        this._img.style.top = '50%';
        this._img.style.objectFit = contain ? 'contain' : 'cover';
        return;
      }
      // Baseline (cover-fill or contain-fit) × view scale. Width/height and
      // left/top are all frame-% — depends only on the frame aspect ratio, so
      // a responsive resize keeps the same crop. The spill layer mirrors the
      // same box so its corners = image corners.
      const k = g.base * this._view.s;
      const w = g.iw * k / g.fw * 100 + '%';
      const h = g.ih * k / g.fh * 100 + '%';
      const l = 50 + this._view.x + '%';
      const t = 50 + this._view.y + '%';
      this._img.style.width = w;
      this._img.style.height = h;
      this._img.style.left = l;
      this._img.style.top = t;
      this._img.style.objectFit = '';
      if (this.hasAttribute('data-reframe')) {
        // Top-layer spill: position in viewport px over the frame. The top
        // layer escapes ancestor transforms entirely, so EVERY term must be
        // in viewport units: getBoundingClientRect gives the frame's scaled
        // origin AND size, and the rect/layout ratio rescales the ghost —
        // sizing from layout px alone renders it 1/scale too large under a
        // scaled deck slide. Inner ghost + handles stay box-relative.
        const r = this.getBoundingClientRect();
        const sx = g.fw ? r.width / g.fw : 1;
        const sy = g.fh ? r.height / g.fh : 1;
        this._spill.style.width = g.iw * k * sx + 'px';
        this._spill.style.height = g.ih * k * sy + 'px';
        this._spill.style.left = r.left + (50 + this._view.x) / 100 * r.width + 'px';
        this._spill.style.top = r.top + (50 + this._view.y) / 100 * r.height + 'px';
      }
    }
    _commitView() {
      const v = {
        s: this._view.s,
        x: this._view.x,
        y: this._view.y
      };
      if (this._userUrl) v.u = this._userUrl;
      // Framing-only (no u) persists too so an author-src slot remembers its
      // crop; clearing the sidecar still falls through to src=.
      if (this.id) setSlot(this.id, v);else {
        this._local = v;
      }
    }
    _render() {
      // Shape / mask. Presets use border-radius so the dashed ring can
      // follow the rounded outline; clip-path is only applied for an
      // explicit `mask` (the ring is hidden there since a rectangle
      // dashed border chopped by an arbitrary polygon looks broken).
      const mask = this.getAttribute('mask');
      const shape = (this.getAttribute('shape') || 'rounded').toLowerCase();
      let radius = '';
      if (shape === 'circle') radius = '50%';else if (shape === 'pill') radius = '9999px';else if (shape === 'rounded') {
        const n = parseFloat(this.getAttribute('radius'));
        radius = (Number.isFinite(n) ? n : 12) + 'px';
      }
      this._frame.style.borderRadius = mask ? '' : radius;
      this._frame.style.clipPath = mask || '';
      this._ring.style.borderRadius = mask ? '' : radius;
      this._ring.style.display = mask ? 'none' : '';

      // Controls and reframe entry gate on this so share links stay read-only.
      const editable = !!(window.omelette && window.omelette.writeFile);
      this.toggleAttribute('data-editable', editable);
      this._sub.style.display = editable ? '' : 'none';

      // Content. The sidecar is also writable by the agent's write_file
      // tool, so its value isn't guaranteed canvas-originated — only accept
      // data:image/ URLs from it. The `src` attribute is author-controlled
      // (Claude wrote it into the HTML) so it passes through unchanged.
      let stored = this.id ? getSlot(this.id) : this._local;
      if (stored && stored.u && !/^data:image\//i.test(stored.u)) stored = null;
      const srcAttr = this.getAttribute('src') || '';
      this._userUrl = stored && stored.u || null;
      const url = this._userUrl || srcAttr;
      // Don't clobber an in-flight reframe with a store-triggered re-render.
      if (!this.hasAttribute('data-reframe')) {
        this._view = {
          s: stored && Number.isFinite(stored.s) ? clampS(stored.s) : 1,
          x: stored && Number.isFinite(stored.x) ? stored.x : 0,
          y: stored && Number.isFinite(stored.y) ? stored.y : 0
        };
      }
      this._cap.textContent = this.getAttribute('placeholder') || 'Drop an image';
      // Toggle via style.display — the [hidden] attribute alone loses to
      // the display:flex / display:block rules in the stylesheet above.
      // An Unsplash src with no credit attribute must NOT render — showing
      // the photo uncredited is the Unsplash-terms violation itself. The
      // error tile replaces the photo until the credit is written. A
      // user-dropped image is the user's own content and always renders.
      // Trimmed: credit is agent/user-editable content, and a whitespace-
      // only value must count as missing — otherwise it would suppress the
      // error tile AND render an empty credit box (no text, no links),
      // exactly the unattributed state this gate exists to prevent.
      const credit = (this.getAttribute('credit') || '').trim();
      const attrError = !!(!credit && !this._userUrl && srcAttr && isUnsplashHost(srcAttr));
      this.toggleAttribute('data-attribution-error', attrError);
      if (url && !attrError) {
        const prev = this._img.getAttribute('src');
        if (prev !== url) {
          // Replacing an already-shown image: mark the swap BEFORE setting
          // src so the stale frame is never revealed (see the data-swapping
          // stylesheet rules). First fill (prev empty) keeps the existing
          // placeholder-until-load behavior — no spinner. _hidShowing
          // covers the pick path's transient attribution-error wipe: prev
          // is gone, but an image WAS showing, so this is a replacement.
          if (prev || this._hidShowing) this.setAttribute('data-swapping', '');
          // Mark the swap BEFORE assigning src: complete keeps reporting
          // the old settled request until the browser's
          // update-the-image-data microtask runs, so same-task re-renders
          // (the pick path's credit/credit-href setAttributes) need this
          // flag, not complete, to know a load is in flight.
          this._loadPending = true;
          this._img.src = url;
          this._ghost.src = url;
        } else {
          // Same-src re-render — release if settled, so an ingest-set
          // spinner can't stick after a byte-identical re-upload (same
          // data URL, no further load event ever fires).
          this._releaseMask();
        }
        this._hidShowing = false;
        this._img.style.display = 'block';
        this._empty.style.display = 'none';
        this.setAttribute('data-filled', '');
        this._clampView();
        this._applyView();
      } else {
        this.removeAttribute('data-swapping');
        // The src is being removed — no load/error will ever fire for it.
        this._loadPending = false;
        // A transient attribution-error wipe of a showing image happens on
        // the pick path: the host sets src one setAttribute before credit,
        // so render N hides the old image (attrError) and render N+1
        // restores a URL. Remember the wipe so that restore renders as a
        // replacement (spinner), not a first fill (blank frame).
        this._hidShowing = attrError && !!this._img.getAttribute('src');
        this._img.style.display = 'none';
        this._img.removeAttribute('src');
        this._ghost.removeAttribute('src');
        // The error tile owns the blocked-photo state; .empty stays for
        // the genuinely-empty slot.
        this._empty.style.display = attrError ? 'none' : 'flex';
        this.removeAttribute('data-filled');
      }

      // Credit belongs to the author src, so a user drop hides it.
      // textContent + the http(s)-only funnel keep external strings inert.
      const showCredit = !!(url && credit && !this._userUrl && !attrError);
      this._credit.textContent = '';
      if (showCredit) {
        // Validate once (resolved against the document, http(s) only),
        // then append the terms-required utm referral params to links
        // that point back at unsplash.com.
        let href = '';
        const rawHref = this.getAttribute('credit-href') || '';
        if (rawHref) {
          try {
            const u = new URL(rawHref, document.baseURI);
            if (u.protocol === 'http:' || u.protocol === 'https:') {
              href = withReferral(u.href);
            }
          } catch {}
        }
        const mkLink = (text, linkHref) => {
          const a = document.createElement('a');
          a.setAttribute('target', '_blank');
          a.setAttribute('rel', 'noopener noreferrer');
          a.setAttribute('href', linkHref);
          a.textContent = text;
          return a;
        };
        // Unsplash's prescribed credit is TWO links — the photographer's
        // name to their profile (credit-href) and 'Unsplash' to the
        // homepage. Render that split whenever the text has the canonical
        // shape; other text keeps the legacy single-link rendering.
        const m = /^Photo by (.+) on Unsplash$/.exec(credit);
        if (m) {
          this._credit.appendChild(document.createTextNode('Photo by '));
          this._credit.appendChild(href ? mkLink(m[1], href) : document.createTextNode(m[1]));
          this._credit.appendChild(document.createTextNode(' on '));
          this._credit.appendChild(mkLink('Unsplash', UNSPLASH_HOMEPAGE_HREF));
        } else if (href) {
          this._credit.appendChild(mkLink(credit, href));
        } else {
          this._credit.textContent = credit;
        }
      }
      this.toggleAttribute('data-credit', showCredit);
    }
  }
  if (!customElements.get('image-slot')) {
    customElements.define('image-slot', ImageSlot);
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/image-slot.js", error: String((e && e.message) || e) }); }

// ui_kits/storefront/CartPage.jsx
try { (() => {
function CartPage() {
  const {
    Badge,
    Button
  } = window.VNXuNDesignSystem_8cbe37;
  const [items, setItems] = React.useState([{
    id: 1,
    name: 'Vang Đỏ Đà Lạt 2021',
    variant: ['Đỏ', '750ml'],
    price: 320000,
    qty: 2,
    bg: '#5b2333'
  }, {
    id: 2,
    name: 'Rượu Nếp Cẩm Thượng Hạng',
    variant: ['500ml'],
    price: 180000,
    qty: 1,
    bg: '#7a4b1e'
  }]);
  const setQty = (id, qty) => setItems(its => its.map(i => i.id === id ? {
    ...i,
    qty: Math.max(1, qty)
  } : i));
  const remove = id => setItems(its => its.filter(i => i.id !== id));
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const fmt = n => n.toLocaleString('vi-VN') + '₫';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-alt)',
      minHeight: 500
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 960,
      margin: '0 auto',
      padding: '40px var(--container-px)',
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 'var(--text-3xl)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)'
    }
  }, "Gi\u1ECF H\xE0ng C\u1EE7a B\u1EA1n"), items.length > 0 && /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm",
    leftIcon: /*#__PURE__*/React.createElement("i", {
      "data-lucide": "trash-2",
      style: {
        width: 14,
        height: 14
      }
    }),
    onClick: () => setItems([])
  }, "X\xF3a T\u1EA5t C\u1EA3")), items.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface)',
      borderRadius: 'var(--radius-2xl)',
      border: '1px solid var(--border)',
      padding: 64,
      textAlign: 'center',
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontWeight: 'var(--weight-semibold)'
    }
  }, "Gi\u1ECF h\xE0ng c\u1EE7a b\u1EA1n \u0111ang tr\u1ED1ng")) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface)',
      borderRadius: 'var(--radius-2xl)',
      border: '1px solid var(--border)',
      padding: 24,
      boxShadow: 'var(--shadow-sm)'
    }
  }, items.map((it, idx) => /*#__PURE__*/React.createElement("div", {
    key: it.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '16px 0',
      borderBottom: idx < items.length - 1 ? '1px solid var(--slate-100)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 64,
      height: 64,
      borderRadius: 'var(--radius-lg)',
      background: it.bg,
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'rgba(255,255,255,.8)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "wine",
    style: {
      width: 24,
      height: 24
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--ink)'
    }
  }, it.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      marginTop: 4
    }
  }, it.variant.map(v => /*#__PURE__*/React.createElement(Badge, {
    key: v,
    size: "sm"
  }, v)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm",
    onClick: () => setQty(it.id, it.qty - 1)
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "minus",
    style: {
      width: 14,
      height: 14
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 28,
      textAlign: 'center',
      fontSize: 'var(--text-sm)'
    }
  }, it.qty), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm",
    onClick: () => setQty(it.id, it.qty + 1)
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "plus",
    style: {
      width: 14,
      height: 14
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 110,
      textAlign: 'right',
      fontWeight: 'var(--weight-semibold)'
    }
  }, fmt(it.price * it.qty)), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    onClick: () => remove(it.id),
    style: {
      color: 'var(--danger)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "trash-2",
    style: {
      width: 16,
      height: 16
    }
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface)',
      borderRadius: 'var(--radius-2xl)',
      border: '1px solid var(--border)',
      padding: 24,
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      height: 'fit-content'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 'var(--text-lg)',
      fontWeight: 'var(--weight-semibold)'
    }
  }, "T\xF3m T\u1EAFt \u0110\u01A1n H\xE0ng"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 'var(--text-sm)',
      color: 'var(--muted)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "S\u1ED1 l\u01B0\u1EE3ng s\u1EA3n ph\u1EA9m"), /*#__PURE__*/React.createElement("span", null, items.reduce((s, i) => s + i.qty, 0))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--weight-semibold)',
      paddingTop: 12,
      borderTop: '1px solid var(--slate-100)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "T\u1EA1m t\xEDnh"), /*#__PURE__*/React.createElement("span", null, fmt(subtotal))), /*#__PURE__*/React.createElement(Button, {
    style: {
      width: '100%'
    },
    disabled: true,
    title: "Ch\u1EE9c n\u0103ng thanh to\xE1n s\u1EBD s\u1EDBm ra m\u1EAFt"
  }, "Thanh To\xE1n (S\u1EAFp Ra M\u1EAFt)")))));
}
window.CartPage = CartPage;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/CartPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/HomePage.jsx
try { (() => {
function HomePage({
  nav
}) {
  const {
    Button
  } = window.VNXuNDesignSystem_8cbe37;
  const {
    ProductCard
  } = window;
  const categories = ['Rượu Vang Đỏ', 'Rượu Vang Trắng', 'Rượu Ngâm', 'Rượu Đế', 'Rượu Nhập Khẩu'];
  const [activeCat, setActiveCat] = React.useState('Tất cả');
  const deals = [{
    name: 'Vang Đỏ Đà Lạt 2021',
    category: 'Rượu Vang',
    price: '320.000₫',
    bg: '#5b2333'
  }, {
    name: 'Rượu Nếp Cẩm Thượng Hạng',
    category: 'Rượu Ngâm',
    price: '180.000₫',
    bg: '#7a4b1e'
  }, {
    name: 'Chivas Regal 12',
    category: 'Nhập Khẩu',
    price: '890.000₫',
    bg: '#2e2a1f'
  }, {
    name: 'Rượu Táo Mèo Sơn La',
    category: 'Rượu Ngâm',
    price: '150.000₫',
    bg: '#8a5a2a'
  }, {
    name: 'Vang Trắng Chardonnay',
    category: 'Rượu Vang',
    price: '410.000₫',
    bg: '#c9b458'
  }];
  const products = [...deals, {
    name: 'Rượu Đế Gò Đen',
    category: 'Rượu Đế',
    price: '95.000₫',
    bg: '#4a4a4a'
  }, {
    name: 'Whisky Johnnie Walker',
    category: 'Nhập Khẩu',
    price: '750.000₫',
    bg: '#1f1f1f'
  }, {
    name: 'Rượu Mơ Yên Tử',
    category: 'Rượu Ngâm',
    price: '165.000₫',
    bg: '#6b3f2a'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '24px var(--container-px) 0'
    }
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      overflow: 'hidden',
      borderRadius: 'var(--radius-2xl)',
      minHeight: 280,
      display: 'flex',
      alignItems: 'center',
      padding: '0 48px',
      background: '#2b1626'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 480,
      padding: '40px 0',
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontWeight: 700,
      fontSize: 'var(--text-lg)',
      opacity: .9
    }
  }, "B\u1ED9 S\u01B0u T\u1EADp M\u1EDBi"), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: '8px 0 0',
      fontSize: 'var(--text-4xl)',
      fontWeight: 'var(--weight-extrabold)',
      textTransform: 'uppercase',
      lineHeight: 'var(--leading-tight)'
    }
  }, "R\u01B0\u1EE3u Vang Vi\u1EC7t Nam"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '12px 0 0',
      fontSize: 'var(--text-lg)',
      opacity: .9
    }
  }, "Gi\u1EA3m \u0111\u1EBFn 30%"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    style: {
      marginTop: 24,
      borderRadius: 'var(--radius-full)',
      padding: '10px 32px',
      background: '#fff',
      color: '#2b1626'
    }
  }, "Mua Ngay")))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '40px var(--container-px)',
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid var(--border)',
      paddingBottom: 12
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 'var(--text-2xl)',
      fontWeight: 'var(--weight-extrabold)',
      color: 'var(--slate-700)'
    }
  }, "\u01AFu \u0110\xE3i ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--brand)'
    }
  }, "N\u1ED5i B\u1EADt")), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-semibold)'
    }
  }, "Xem T\u1EA5t C\u1EA3 \u2192")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(5,1fr)',
      gap: 'var(--grid-gap)'
    }
  }, deals.map(p => /*#__PURE__*/React.createElement(ProductCard, {
    key: p.name,
    p: p
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '0 var(--container-px) 40px'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '0 0 20px',
      fontSize: 'var(--text-2xl)',
      fontWeight: 'var(--weight-extrabold)',
      color: 'var(--slate-700)',
      borderBottom: '1px solid var(--border)',
      paddingBottom: 12
    }
  }, "Mua Theo ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--brand)'
    }
  }, "Danh M\u1EE5c")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 24,
      overflowX: 'auto'
    }
  }, categories.map(c => /*#__PURE__*/React.createElement("div", {
    key: c,
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 10,
      width: 100,
      flexShrink: 0,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 100,
      height: 100,
      borderRadius: '50%',
      background: 'var(--surface-alt)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--brand)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "wine",
    style: {
      width: 32,
      height: 32
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-medium)',
      color: 'var(--slate-700)'
    }
  }, c))))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '0 var(--container-px) 56px',
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid var(--border)',
      paddingBottom: 12
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 'var(--text-2xl)',
      fontWeight: 'var(--weight-extrabold)',
      color: 'var(--slate-700)'
    }
  }, "T\u1EA5t C\u1EA3 ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--brand)'
    }
  }, "S\u1EA3n Ph\u1EA9m"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap',
      justifyContent: 'center'
    }
  }, ['Tất cả', ...categories].map(c => /*#__PURE__*/React.createElement(Button, {
    key: c,
    variant: activeCat === c ? 'primary' : 'outline',
    size: "sm",
    onClick: () => setActiveCat(c)
  }, c))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 'var(--grid-gap)'
    }
  }, products.map(p => /*#__PURE__*/React.createElement(ProductCard, {
    key: p.name,
    p: p
  })))));
}
window.HomePage = HomePage;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/HomePage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/ProductViewPage.jsx
try { (() => {
function ProductViewPage() {
  const {
    Badge,
    Button
  } = window.VNXuNDesignSystem_8cbe37;
  const {
    StarRow
  } = window;
  const [color, setColor] = React.useState('Đỏ');
  const [size, setSize] = React.useState('750ml');
  const [qty, setQty] = React.useState(1);
  const [tab, setTab] = React.useState('details');
  const related = [{
    name: 'Vang Trắng Chardonnay',
    category: 'Rượu Vang',
    price: '410.000₫',
    bg: '#c9b458'
  }, {
    name: 'Rượu Táo Mèo Sơn La',
    category: 'Rượu Ngâm',
    price: '150.000₫',
    bg: '#8a5a2a'
  }, {
    name: 'Chivas Regal 12',
    category: 'Nhập Khẩu',
    price: '890.000₫',
    bg: '#2e2a1f'
  }, {
    name: 'Rượu Đế Gò Đen',
    category: 'Rượu Đế',
    price: '95.000₫',
    bg: '#4a4a4a'
  }];
  const {
    ProductCard
  } = window;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '32px var(--container-px)',
      display: 'flex',
      flexDirection: 'column',
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 'var(--text-sm)',
      color: 'var(--muted)'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault()
  }, "Trang ch\u1EE7"), /*#__PURE__*/React.createElement("span", null, "\u203A"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault()
  }, "R\u01B0\u1EE3u Vang"), /*#__PURE__*/React.createElement("span", null, "\u203A"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ink)',
      fontWeight: 'var(--weight-medium)'
    }
  }, "Vang \u0110\u1ECF \u0110\xE0 L\u1EA1t 2021")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
      gap: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      minWidth: 0,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      flexShrink: 0
    }
  }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      width: 76,
      height: 76,
      borderRadius: 'var(--radius-xl)',
      background: i === 0 ? '#5b2333' : 'var(--slate-100)',
      border: i === 0 ? '2px solid var(--brand)' : '2px solid transparent'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '1 1 0%',
      minWidth: 0,
      width: '100%',
      aspectRatio: '1',
      borderRadius: 'var(--radius-2xl)',
      background: '#5b2333',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'rgba(255,255,255,.85)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "wine",
    style: {
      width: 64,
      height: 64
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 'var(--text-3xl)',
      fontWeight: 'var(--weight-extrabold)',
      textTransform: 'uppercase',
      color: 'var(--ink)'
    }
  }, "Vang \u0110\u1ECF \u0110\xE0 L\u1EA1t 2021"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(StarRow, {
    rating: 4
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--muted)'
    }
  }, "4.2/5 (86 \u0111\xE1nh gi\xE1)")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      paddingBottom: 20,
      borderBottom: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-3xl)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)'
    }
  }, "320.000\u20AB"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-lg)',
      color: 'var(--faint)',
      textDecoration: 'line-through'
    }
  }, "400.000\u20AB"), /*#__PURE__*/React.createElement(Badge, {
    variant: "danger"
  }, "-20%")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-sm)',
      color: 'var(--muted)',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "Vang \u0111\u1ECF \u0111\u01B0\u1EE3c tr\u1ED3ng v\xE0 l\xEAn men t\u1EA1i \u0110\xE0 L\u1EA1t, v\u1ECB ch\xE1t nh\u1EB9, h\u1EADu v\u1ECB ng\u1ECDt d\u1ECBu, ph\xF9 h\u1EE3p d\xF9ng trong c\xE1c bu\u1ED5i ti\u1EC7c ho\u1EB7c l\xE0m qu\xE0 t\u1EB7ng."), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 10px',
      fontSize: 'var(--text-sm)',
      color: 'var(--muted)'
    }
  }, "Ch\u1ECDn M\xE0u"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, [{
    n: 'Đỏ',
    c: '#7a1f2b'
  }, {
    n: 'Hồng',
    c: '#d17a94'
  }].map(op => /*#__PURE__*/React.createElement("button", {
    key: op.n,
    onClick: () => setColor(op.n),
    title: op.n,
    style: {
      width: 36,
      height: 36,
      borderRadius: '50%',
      background: op.c,
      border: color === op.n ? '2px solid var(--brand)' : '2px solid var(--border)',
      cursor: 'pointer'
    }
  })))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 10px',
      fontSize: 'var(--text-sm)',
      color: 'var(--muted)'
    }
  }, "Ch\u1ECDn Dung T\xEDch"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, ['375ml', '750ml'].map(s => /*#__PURE__*/React.createElement("button", {
    key: s,
    onClick: () => setSize(s),
    style: {
      padding: '10px 20px',
      borderRadius: 'var(--radius-full)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-medium)',
      border: 'none',
      cursor: 'pointer',
      background: size === s ? 'var(--ink)' : 'var(--slate-100)',
      color: size === s ? '#fff' : 'var(--slate-600)'
    }
  }, s)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    variant: "success"
  }, "C\xF2n 24 s\u1EA3n ph\u1EA9m"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)',
      color: 'var(--muted)'
    }
  }, "SKU: RVD-2021-", size)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      background: 'var(--slate-100)',
      borderRadius: 'var(--radius-full)',
      padding: '12px 20px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setQty(Math.max(1, qty - 1)),
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: 'var(--slate-500)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "minus",
    style: {
      width: 16,
      height: 16
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 16,
      textAlign: 'center',
      fontWeight: 'var(--weight-medium)'
    }
  }, qty), /*#__PURE__*/React.createElement("button", {
    onClick: () => setQty(qty + 1),
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: 'var(--slate-500)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "plus",
    style: {
      width: 16,
      height: 16
    }
  }))), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    style: {
      borderRadius: 'var(--radius-full)',
      flex: 1
    }
  }, "Th\xEAm V\xE0o Gi\u1ECF H\xE0ng")))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 32,
      borderBottom: '1px solid var(--border)'
    }
  }, [['details', 'Mô Tả Sản Phẩm'], ['reviews', 'Đánh Giá & Nhận Xét (86)']].map(([k, l]) => /*#__PURE__*/React.createElement("button", {
    key: k,
    onClick: () => setTab(k),
    style: {
      padding: '16px 0',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-medium)',
      border: 'none',
      borderBottom: tab === k ? '2px solid var(--brand)' : '2px solid transparent',
      marginBottom: -1,
      background: 'none',
      cursor: 'pointer',
      color: tab === k ? 'var(--ink)' : 'var(--muted)'
    }
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '32px 0'
    }
  }, tab === 'details' ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-sm)',
      color: 'var(--muted)',
      lineHeight: 'var(--leading-relaxed)',
      maxWidth: 640
    }
  }, "Vang \u0111\u1ECF \u0111\u01B0\u1EE3c tr\u1ED3ng v\xE0 l\xEAn men t\u1EA1i \u0110\xE0 L\u1EA1t, v\u1ECB ch\xE1t nh\u1EB9, h\u1EADu v\u1ECB ng\u1ECDt d\u1ECBu, ph\xF9 h\u1EE3p d\xF9ng trong c\xE1c bu\u1ED5i ti\u1EC7c ho\u1EB7c l\xE0m qu\xE0 t\u1EB7ng.") : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16
    }
  }, [1, 2].map(i => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-2xl)',
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      borderRadius: '50%',
      background: 'var(--slate-100)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--slate-400)',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "user",
    style: {
      width: 16,
      height: 16
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontWeight: 'var(--weight-semibold)'
    }
  }, "Nguy\u1EC5n V\u0103n A"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: 'var(--faint)'
    }
  }, "12/08/2026")), /*#__PURE__*/React.createElement(StarRow, {
    rating: 5
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '8px 0 0',
      fontSize: 'var(--text-sm)',
      color: 'var(--slate-600)'
    }
  }, "R\u01B0\u1EE3u ngon, \u0111\xF3ng g\xF3i c\u1EA9n th\u1EADn, giao h\xE0ng nhanh.")))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      textAlign: 'center',
      fontSize: 'var(--text-2xl)',
      fontWeight: 'var(--weight-extrabold)',
      textTransform: 'uppercase',
      color: 'var(--ink)'
    }
  }, "C\xF3 Th\u1EC3 B\u1EA1n C\u0169ng Th\xEDch"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 'var(--grid-gap)'
    }
  }, related.map(p => /*#__PURE__*/React.createElement(ProductCard, {
    key: p.name,
    p: p
  }))))));
}
window.ProductViewPage = ProductViewPage;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/ProductViewPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/shared.jsx
try { (() => {
function ProductCard({
  p
}) {
  const {
    Badge
  } = window.VNXuNDesignSystem_8cbe37;
  return /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      display: 'block',
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-2xl)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)',
      textDecoration: 'none',
      transition: 'box-shadow .15s, transform .15s'
    },
    onMouseEnter: e => {
      e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
      e.currentTarget.style.transform = 'translateY(-2px)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      e.currentTarget.style.transform = 'none';
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: '1',
      background: p.bg || 'var(--slate-100)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'rgba(255,255,255,.85)',
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "wine",
    style: {
      width: 40,
      height: 40
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, p.category && /*#__PURE__*/React.createElement(Badge, {
    variant: "primary",
    size: "sm"
  }, p.category), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--ink)'
    }
  }, p.name), p.price && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--ink)'
    }
  }, p.price)));
}
function StarRow({
  rating = 5
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--rating)',
      fontSize: 13,
      letterSpacing: 1
    }
  }, '★'.repeat(rating), '☆'.repeat(5 - rating));
}
window.ProductCard = ProductCard;
window.StarRow = StarRow;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/shared.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Modal = __ds_scope.Modal;

__ds_ns.Spinner = __ds_scope.Spinner;

__ds_ns.CartBadge = __ds_scope.CartBadge;

__ds_ns.CategoryNavMenu = __ds_scope.CategoryNavMenu;

__ds_ns.Footer = __ds_scope.Footer;

__ds_ns.PromoBand = __ds_scope.PromoBand;

__ds_ns.UserMenu = __ds_scope.UserMenu;

})();
