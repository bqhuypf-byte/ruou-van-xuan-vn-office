import React from 'react';

/**
 * PromoBand — dark CTA strip above the footer, drives to the product catalog.
 */
export function PromoBand({
  title = 'Đừng bỏ lỡ các ưu đãi rượu vang mới nhất',
  ctaText = 'Xem Ưu Đãi',
  onCtaClick,
  ButtonComponent,
}) {
  const Btn = ButtonComponent;
  return (
    <section style={{ background: 'var(--surface-inverse)', fontFamily: 'var(--font-sans)' }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '2.5rem var(--container-px)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.25rem' }}>
        <h2 style={{ margin: 0, fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', color: 'var(--surface-inverse-text)' }}>{title}</h2>
        {Btn ? (
          <Btn variant="primary" size="lg" onClick={onCtaClick} style={{ borderRadius: 'var(--radius-full)', padding: '.625rem 2rem', flexShrink: 0 }}>{ctaText}</Btn>
        ) : (
          <button onClick={onCtaClick} style={{ flexShrink: 0, borderRadius: 'var(--radius-full)', padding: '.625rem 2rem', background: 'var(--brand)', color: '#fff', border: 'none', fontWeight: 'var(--weight-medium)', fontSize: 'var(--text-base)', cursor: 'pointer' }}>{ctaText}</button>
        )}
      </div>
    </section>
  );
}
