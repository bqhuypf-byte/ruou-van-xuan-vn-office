import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegisterPage } from './RegisterPage';
import { useRegister } from '../hooks/useRegister';

const navigateMock = vi.fn();

vi.mock('react-router', () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
  useNavigate: () => navigateMock,
}));

vi.mock('../hooks/useRegister', () => ({
  useRegister: vi.fn(),
}));

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the register form and a link to login', () => {
    vi.mocked(useRegister).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useRegister>);

    render(<RegisterPage />);

    expect(screen.getByRole('heading', { name: 'Tạo Tài Khoản' })).toBeInTheDocument();
    expect(screen.getByText('Đăng nhập')).toBeInTheDocument();
  });

  it('shows a success state and redirects to login after registering', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup();
    const mutateAsync = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useRegister).mockReturnValue({ mutateAsync, isPending: false } as unknown as ReturnType<typeof useRegister>);

    render(<RegisterPage />);

    await user.type(screen.getByLabelText(/họ và tên/i), 'Jane Doe');
    await user.type(screen.getByLabelText(/^email$/i), 'jane@example.com');
    await user.type(screen.getByLabelText(/mật khẩu/i), 'password123');
    await user.click(screen.getByRole('button', { name: /đăng ký/i }));

    await waitFor(() =>
      expect(mutateAsync).toHaveBeenCalledWith({
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        phone: undefined,
        password: 'password123',
      }),
    );
    expect(await screen.findByText('Đăng Ký Thành Công')).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(1500);
    });
    expect(navigateMock).toHaveBeenCalledWith('/login');
  });

  it('shows an error message when registration fails', async () => {
    const user = userEvent.setup();
    const mutateAsync = vi.fn().mockRejectedValue({
      response: { data: { error: { message: 'Email đã tồn tại' } } },
    });
    vi.mocked(useRegister).mockReturnValue({ mutateAsync, isPending: false } as unknown as ReturnType<typeof useRegister>);

    render(<RegisterPage />);

    await user.type(screen.getByLabelText(/họ và tên/i), 'Jane Doe');
    await user.type(screen.getByLabelText(/^email$/i), 'jane@example.com');
    await user.type(screen.getByLabelText(/mật khẩu/i), 'password123');
    await user.click(screen.getByRole('button', { name: /đăng ký/i }));

    expect(await screen.findByText('Email đã tồn tại')).toBeInTheDocument();
    expect(navigateMock).not.toHaveBeenCalled();
  });
});
