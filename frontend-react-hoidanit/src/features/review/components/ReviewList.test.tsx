import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ReviewList } from './ReviewList';
import type { Review } from '../types/review.types';

const reviews: Review[] = [
  { id: 1, rating: 5, comment: 'Sản phẩm rất tốt', createdAt: '2026-01-01T00:00:00Z', user: { id: 1, fullName: 'Nguyen Van A' } },
  { id: 2, rating: 2, comment: null, createdAt: '2026-01-02T00:00:00Z', user: { id: 2, fullName: 'Tran Thi B' } },
];

describe('ReviewList', () => {
  it('renders a loading skeleton when isLoading is true', () => {
    const { container } = render(<ReviewList reviews={[]} isLoading />);

    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });

  it('renders an empty state when there are no reviews', () => {
    render(<ReviewList reviews={[]} isLoading={false} />);

    expect(screen.getByText('Chưa có đánh giá nào')).toBeInTheDocument();
  });

  it('renders each review with reviewer name and comment', () => {
    render(<ReviewList reviews={reviews} isLoading={false} />);

    expect(screen.getByText('Nguyen Van A')).toBeInTheDocument();
    expect(screen.getByText('Sản phẩm rất tốt')).toBeInTheDocument();
    expect(screen.getByText('Tran Thi B')).toBeInTheDocument();
  });

  it('does not render a comment paragraph when comment is null', () => {
    render(<ReviewList reviews={[reviews[1]]} isLoading={false} />);

    expect(screen.getByText('Tran Thi B')).toBeInTheDocument();
    expect(screen.queryByText('null')).not.toBeInTheDocument();
  });
});
