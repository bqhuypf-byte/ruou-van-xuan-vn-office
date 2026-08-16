import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginPage } from './LoginPage';
import { useLogin } from '../hooks/useLogin';

const navigateMock = vi.fn();

vi.mock('react-router', () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
  useNavigate: () => navigateMock,
}));

vi.mock('../hooks/useLogin', () => ({
  useLogin: vi.fn(),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the login form and a link to register', () => {
    vi.mocked(useLogin).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useLogin>);

    render(<LoginPage />);

    expect(screen.getByRole('heading', { name: 'Đăng Nhập' })).toBeInTheDocument();
    expect(screen.getByText('Đăng ký ngay')).toBeInTheDocument();
  });

  it('navigates home after a successful login', async () => {
    const user = userEvent.setup();
    const mutateAsync = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useLogin).mockReturnValue({ mutateAsync, isPending: false } as unknown as ReturnType<typeof useLogin>);

    render(<LoginPage />);

    await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await user.type(screen.getByLabelText(/mật khẩu/i), 'password123');
    await user.click(screen.getByRole('button', { name: /đăng nhập/i }));

    await waitFor(() =>
      expect(mutateAsync).toHaveBeenCalledWith({
        email: 'jane@example.com',
        password: 'password123',
      }),
    );
    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith('/'));
  });

  it('shows an error message when login fails', async () => {
    const user = userEvent.setup();
    const mutateAsync = vi.fn().mockRejectedValue({
      response: { data: { error: { message: 'Sai email hoặc mật khẩu' } } },
    });
    vi.mocked(useLogin).mockReturnValue({ mutateAsync, isPending: false } as unknown as ReturnType<typeof useLogin>);

    render(<LoginPage />);

    await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await user.type(screen.getByLabelText(/mật khẩu/i), 'wrong-password');
    await user.click(screen.getByRole('button', { name: /đăng nhập/i }));

    expect(await screen.findByText('Sai email hoặc mật khẩu')).toBeInTheDocument();
    expect(navigateMock).not.toHaveBeenCalled();
  });
});
