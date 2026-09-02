import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AccountSecurityPage } from './AccountSecurityPage';

vi.mock('../components/ChangePasswordCard', () => ({
  ChangePasswordCard: () => <div>Biểu mẫu đổi mật khẩu</div>,
}));

describe('AccountSecurityPage', () => {
  it('renders the account security heading and change-password form', () => {
    render(<AccountSecurityPage />);

    expect(screen.getByRole('heading', { name: 'Tài Khoản & Bảo Mật' })).toBeInTheDocument();
    expect(screen.getByText('Biểu mẫu đổi mật khẩu')).toBeInTheDocument();
  });
});
