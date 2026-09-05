import { Link, useParams } from 'react-router';
import { ROUTES } from '@/routes/routes';
import { useCategories } from '../hooks/useCategories';

export const CategoryPillNav = ({
  variant = 'desktop',
  onNavigate,
}: {
  variant?: 'desktop' | 'mobile';
  onNavigate?: () => void;
}) => {
  const { tree } = useCategories();
  const { slug: activeSlug } = useParams<{ slug: string }>();

  if (tree.length === 0) return null;

  if (variant === 'mobile') {
    return (
      <nav className="flex flex-col">
        {tree.map((category) => (
          <Link
            key={category.id}
            to={ROUTES.CATEGORY.replace(':slug', category.slug)}
            onClick={onNavigate}
            className={`border-b border-slate-100 px-3 py-3 text-sm font-semibold transition-colors last:border-0 ${
              category.slug === activeSlug
                ? 'bg-brand-50 text-brand-700'
                : 'text-slate-800 hover:bg-slate-50'
            }`}
          >
            {category.name}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className="flex flex-wrap items-center justify-center gap-2.5">
      {tree.map((category) => (
        <Link
          key={category.id}
          to={ROUTES.CATEGORY.replace(':slug', category.slug)}
          className={`shrink-0 whitespace-nowrap rounded-full border px-3.5 py-2 text-sm font-medium transition-colors ${
            category.slug === activeSlug
              ? 'border-brand-600 bg-brand-600 text-white'
              : 'border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:text-brand-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
          }`}
        >
          {category.name}
        </Link>
      ))}
    </nav>
  );
};
