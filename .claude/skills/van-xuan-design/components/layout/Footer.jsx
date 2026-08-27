import React from 'react';

/**
 * Footer — dark full-width site footer with brand blurb + two link columns, mounted once per page.
 */
export function Footer({
  siteName = 'Rượu Vạn Xuân',
  contactPhone,
  whatsappNumber,
  popularTitle = 'Danh Mục Phổ Biến',
  popularLinks = [],
  serviceTitle = 'Chăm Sóc Khách Hàng',
  serviceLinks = [],
  copyrightText = `© ${new Date().getFullYear()} Rượu Vạn Xuân. All rights reserved.`,
  linkComponent: A = 'a',
}) {
  return (
    <footer style={{ background: 'var(--surface-inverse)', color: 'var(--surface-inverse-text)', fontFamily: 'var(--font-sans)' }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: 'var(--section-py) var(--container-px)', display: 'grid', gap: '2.5rem', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))' }}>
        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.625rem', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-lg)' }}>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-xl)', background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>VX</div>
            {siteName}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem', fontSize: 'var(--text-sm)' }}>
            {whatsappNumber && (
              <div><p style={{ margin: 0, color: 'var(--surface-inverse-muted)' }}>WhatsApp</p><p style={{ margin: 0, fontWeight: 'var(--weight-semibold)' }}>{whatsappNumber}</p></div>
            )}
            {contactPhone && (
              <div><p style={{ margin: 0, color: 'var(--surface-inverse-muted)' }}>Hotline</p><p style={{ margin: 0, fontWeight: 'var(--weight-semibold)' }}>{contactPhone}</p></div>
            )}
          </div>
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)' }}>{popularTitle}</h3>
          <ul style={{ listStyle: 'none', margin: '1rem 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: '.625rem', fontSize: 'var(--text-sm)', color: 'var(--surface-inverse-muted)' }}>
            {popularLinks.map((l) => <li key={l.label}><A href={l.url} style={{ color: 'inherit' }}>{l.label}</A></li>)}
          </ul>
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)' }}>{serviceTitle}</h3>
          <ul style={{ listStyle: 'none', margin: '1rem 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: '.625rem', fontSize: 'var(--text-sm)', color: 'var(--surface-inverse-muted)' }}>
            {serviceLinks.map((l) => <li key={l.label}><A href={l.url} style={{ color: 'inherit' }}>{l.label}</A></li>)}
          </ul>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,.15)' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '1.25rem var(--container-px)', fontSize: 'var(--text-xs)', color: 'var(--surface-inverse-muted)', textAlign: 'center' }}>
          {copyrightText}
        </div>
      </div>
    </footer>
  );
}
