import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegisterForm } from './RegisterForm';

describe('RegisterForm', () => {
  it('renders all form fields', () => {
    render(<RegisterForm onSubmit={vi.fn()} />);

    expect(screen.getByLabelText(/họ và tên/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/số điện thoại/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mật khẩu/i)).toBeInTheDocument();
  });

  it('shows validation errors when submitting an empty form', async () => {
    const user = userEvent.setup();
    render(<RegisterForm onSubmit={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /đăng ký/i }));

    expect(await screen.findByText('Họ tên không được để trống')).toBeInTheDocument();
    expect(screen.getByText('Email không được để trống')).toBeInTheDocument();
    expect(screen.getByText('Mật khẩu tối thiểu 8 ký tự')).toBeInTheDocument();
  });

  it('submits valid data, treating an empty phone as optional', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<RegisterForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/họ và tên/i), 'Jane Doe');
    await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await user.type(screen.getByLabelText(/mật khẩu/i), 'password123');
    await user.click(screen.getByRole('button', { name: /đăng ký/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0][0]).toEqual({
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      phone: '',
      password: 'password123',
    });
  });

  it('renders the given error message', () => {
    render(<RegisterForm onSubmit={vi.fn()} errorMessage="Email đã tồn tại." />);

    expect(screen.getByText('Email đã tồn tại.')).toBeInTheDocument();
  });

  it('disables the submit button while loading', () => {
    render(<RegisterForm onSubmit={vi.fn()} isLoading />);

    expect(screen.getByRole('button', { name: /đăng ký/i })).toBeDisabled();
  });
});
