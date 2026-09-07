import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useAuthStore } from '@/features/auth';
import { ReviewForm } from './ReviewForm';

const renderForm = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ReviewForm productId={1} productName="Rượu Nếp Vạn Xuân" mode="modal" />
    </QueryClientProvider>,
  );
};

describe('ReviewForm', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, isAuthenticated: false, isInitializing: false });
  });

  it('shows public reviewer fields without requiring a purchase', () => {
    renderForm();

    expect(screen.getByText('Rượu Nếp Vạn Xuân')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nhập họ tên của bạn')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nhập email của bạn')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nhập số điện thoại của bạn')).toBeInTheDocument();
    expect(screen.getByText(/Đính kèm tối đa 3 ảnh/)).toBeInTheDocument();
  });

  it('enables submission after required fields are filled', () => {
    renderForm();

    const submit = screen.getByRole('button', { name: 'Gửi Đánh Giá' });
    expect(submit).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText('Nhập họ tên của bạn'), {
      target: { value: 'Nguyễn Văn A' },
    });
    fireEvent.change(screen.getByPlaceholderText('Nhập email của bạn'), {
      target: { value: 'nguyen@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Nhập số điện thoại của bạn'), {
      target: { value: '0901234567' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Chia sẻ trải nghiệm/), {
      target: { value: 'Sản phẩm rất tốt' },
    });

    expect(submit).toBeEnabled();
  });
});
