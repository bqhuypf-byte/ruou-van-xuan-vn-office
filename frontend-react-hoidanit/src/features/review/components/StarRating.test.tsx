import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StarRating } from './StarRating';

describe('StarRating', () => {
  it('renders 5 stars with an accessible label describing the rating', () => {
    render(<StarRating rating={4} />);

    expect(screen.getByRole('img', { name: '4.0 trên 5 sao' })).toBeInTheDocument();
  });

  it('fills the rounded number of stars', () => {
    const { container } = render(<StarRating rating={3.6} />);

    const filled = container.querySelectorAll('.fill-amber-400');
    expect(filled).toHaveLength(4);
  });

  it('renders no filled stars for a zero rating', () => {
    const { container } = render(<StarRating rating={0} />);

    expect(container.querySelectorAll('.fill-amber-400')).toHaveLength(0);
  });
});
