function SiteSettingsScreen() {
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
        <h1 style={{ display: 'flex', alignItems: 'center', gap: 8, margin: 0, fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-bold)', color: 'var(--ink)' }}><i data-lucide="settings" style={{ width: 22, height: 22, color: 'var(--brand)' }}></i>Cấu Hình Thương Hiệu</h1>
        <p style={{ margin: '4px 0 0', fontSize: 'var(--text-sm)', color: 'var(--muted)' }}>Đổi tên site, logo, thông tin liên hệ và các liên kết footer.</p>
      </div>
      <Section title="Thương hiệu">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>
          <Input label="Tên site" defaultValue="Rượu Vạn Xuân" />
          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 500, marginBottom: 6 }}>Logo</label>
            <image-slot id="site-logo" shape="rounded" radius="12" placeholder="Kéo thả logo vào đây" style={{ width: '100%', height: 96 }}></image-slot>
          </div>
        </div>
      </Section>
      <Section title="Liên hệ & Ứng dụng">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Input label="Số điện thoại" defaultValue="1900 6750" />
          <Input label="Số WhatsApp" placeholder="+84..." />
        </div>
        <Input label="Chữ bản quyền footer" defaultValue="© 2026 Rượu Vạn Xuân. All rights reserved." />
      </Section>
      <Section title="Kiểu Chữ">
        <div>
          <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 500, marginBottom: 6 }}>Font chữ toàn trang</label>
          <select defaultValue="inter" style={{ width: '100%', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-strong)', padding: '8px 12px', fontSize: 'var(--text-sm)' }}>
            <option value="system">Font hệ thống (mặc định)</option>
            <option value="inter">Inter (sans hiện đại)</option>
            <option value="playfair">Playfair Display + Inter (serif tiêu đề)</option>
          </select>
          <p style={{ margin: '6px 0 0', fontSize: 'var(--text-xs)', color: 'var(--muted)' }}>Áp dụng cho toàn bộ trang khách hàng và trang quản trị, không cần sửa code.</p>
        </div>
      </Section>
      <Section title='Cột "Danh Mục Phổ Biến" (footer)'>
        <div style={{ display: 'flex', gap: 12 }}>
          <Input placeholder="Nhãn hiển thị" defaultValue="Rượu Vang" />
          <Input placeholder="/categories/ruou-vang" defaultValue="/categories/ruou-vang" />
          <Button variant="ghost" size="sm" style={{ color: 'var(--danger)' }}><i data-lucide="trash-2" style={{ width: 16, height: 16 }}></i></Button>
        </div>
        <Button type="button" variant="outline" size="sm" leftIcon={<i data-lucide="plus" style={{ width: 14, height: 14 }}></i>} style={{ alignSelf: 'flex-start' }}>Thêm</Button>
      </Section>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}><Button>Lưu Thay Đổi</Button></div>
    </div>
  );
}
window.SiteSettingsScreen = SiteSettingsScreen;
