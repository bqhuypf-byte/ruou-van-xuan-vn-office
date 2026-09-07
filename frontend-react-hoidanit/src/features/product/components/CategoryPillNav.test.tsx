import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { CategoryPillNav } from './CategoryPillNav';

vi.mock('../hooks/useCategories', () => ({
  useCategories: () => ({
    tree: [
      {
        id: 1,
        parentId: null,
        name: 'Rượu Gạo',
        slug: 'ruou-gao',
        description: null,
        thumbnailUrl: null,
        homeSortOrder: 0,
        showInProductSections: false,
        homeSectionTitle: null,
        homeDisplayStyle: 'grid',
        variantValues: ['1 Lít', '5 Lít'],
        children: [],
      },
    ],
  }),
}));

describe('CategoryPillNav', () => {
  it('keeps the parent link and renders volume filter links', () => {
    render(
      <MemoryRouter initialEntries={['/categories/ruou-gao']}>
        <CategoryPillNav />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: /Rượu Gạo/i })).toHaveAttribute(
      'href',
      '/categories/ruou-gao',
    );
    expect(screen.getByRole('link', { name: '1 Lít' })).toHaveAttribute(
      'href',
      '/categories/ruou-gao?variant=1%20L%C3%ADt',
    );
    expect(screen.getByRole('link', { name: '5 Lít' })).toBeInTheDocument();
  });
});
