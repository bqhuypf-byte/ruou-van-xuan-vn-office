import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('renders email and password fields', () => {
    render(<LoginForm onSubmit={vi.fn()} />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mật khẩu/i)).toBeInTheDocument();
  });

  it('shows a validation error for an invalid email', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={vi.fn()} />);

    await user.type(screen.getByLabelText(/email/i), 'not-an-email');
    await user.type(screen.getByLabelText(/mật khẩu/i), 'password123');
    await user.click(screen.getByRole('button', { name: /đăng nhập/i }));

    expect(await screen.findByText('Email không hợp lệ')).toBeInTheDocument();
  });

  it('shows a validation error for a short password', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={vi.fn()} />);

    await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await user.type(screen.getByLabelText(/mật khẩu/i), 'short');
    await user.click(screen.getByRole('button', { name: /đăng nhập/i }));

    expect(await screen.findByText('Mật khẩu tối thiểu 8 ký tự')).toBeInTheDocument();
  });

  it('submits valid credentials', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<LoginForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await user.type(screen.getByLabelText(/mật khẩu/i), 'password123');
    await user.click(screen.getByRole('button', { name: /đăng nhập/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0][0]).toEqual({
      email: 'jane@example.com',
      password: 'password123',
    });
  });

  it('renders the given error message', () => {
    render(<LoginForm onSubmit={vi.fn()} errorMessage="Email hoặc mật khẩu không đúng." />);

    expect(screen.getByText('Email hoặc mật khẩu không đúng.')).toBeInTheDocument();
  });

  it('disables the submit button while loading', () => {
    render(<LoginForm onSubmit={vi.fn()} isLoading />);

    expect(screen.getByRole('button', { name: /đăng nhập/i })).toBeDisabled();
  });
});
