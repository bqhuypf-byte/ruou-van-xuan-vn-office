function HomeContentScreen() {
  const { Button, Input } = window.VNXuNDesignSystem_8cbe37;
  const Section = ({ title, children }) => (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-2xl)', padding: 20, boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 style={{ margin: 0, fontWeight: 600, fontSize: 'var(--text-base)', color: 'var(--ink)' }}>{title}</h2>
      {children}
    </div>
  );
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: 8, margin: 0, fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-bold)', color: 'var(--ink)' }}><i data-lucide="sparkles" style={{ width: 22, height: 22, color: 'var(--brand)' }}></i>Nội Dung Trang Chủ</h1>
        <p style={{ margin: '4px 0 0', fontSize: 'var(--text-sm)', color: 'var(--muted)' }}>Chỉnh sửa tiêu đề, mô tả và nút gọi hành động hiển thị trên trang chủ — không cần sửa code.</p>
      </div>
      <Section title="Banner Chính (Hero)">
        <Input label="Nhãn phụ" defaultValue="Bộ Sưu Tập Mới" />
        <Input label="Tiêu đề" defaultValue="Rượu Vang Việt Nam" />
        <Input label="Dòng chữ ưu đãi" defaultValue="Giảm đến 30%" />
        <Input label="Chữ trên nút" defaultValue="Mua Ngay" />
      </Section>
      <Section title="Dải Ưu Đãi (Promo Band)">
        <Input label="Tiêu đề" defaultValue="Đừng bỏ lỡ các ưu đãi rượu vang mới nhất" />
        <Input label="Chữ trên nút" defaultValue="Xem Ưu Đãi" />
      </Section>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}><Button>Lưu Thay Đổi</Button></div>
    </div>
  );
}
window.HomeContentScreen = HomeContentScreen;
