import { useRef, useState } from 'react';
import { Link, useParams } from 'react-router';
import { ChevronDown } from 'lucide-react';
import { useClickOutside } from '@/shared/hooks/useClickOutside';
import { ROUTES } from '@/routes/routes';
import { useCategories } from '../hooks/useCategories';
import type { Category } from '../types/category.types';

const CategoryPill = ({
  category,
  isActive,
  isOpen,
  onToggle,
  onClose,
}: {
  category: Category;
  isActive: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  useClickOutside(containerRef, onClose, isOpen);

  const hasChildren = category.children.length > 0;

  return (
    <div className="relative shrink-0" ref={containerRef}>
      <Link
        to={ROUTES.CATEGORY.replace(':slug', category.slug)}
        onClick={hasChildren ? (e) => e.preventDefault() : undefined}
        onMouseDown={hasChildren ? onToggle : undefined}
        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-colors ${
          isActive
            ? 'bg-brand-600 border-brand-600 text-white'
            : 'bg-white border-slate-200 text-slate-700 hover:border-brand-300 hover:text-brand-700 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300'
        }`}
      >
        {category.name}
        {hasChildren && (
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform ${
              isActive ? 'text-white' : 'text-brand-600 dark:text-brand-400'
            } ${isOpen ? 'rotate-180' : ''}`}
          />
        )}
      </Link>

      {hasChildren && isOpen && (
        <div className="absolute left-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden z-50 p-2">
          {category.children.map((child) => (
            <Link
              key={child.id}
              to={ROUTES.CATEGORY.replace(':slug', child.slug)}
              onClick={onClose}
              className="block px-3 py-2 rounded-xl text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {child.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export const CategoryPillNav = () => {
  const { tree } = useCategories();
  const { slug: activeSlug } = useParams<{ slug: string }>();
  const [openId, setOpenId] = useState<number | null>(null);

  if (tree.length === 0) return null;

  return (
    <nav className="flex items-center justify-center flex-wrap gap-2.5">
      {tree.map((category) => (
        <CategoryPill
          key={category.id}
          category={category}
          isActive={category.slug === activeSlug}
          isOpen={openId === category.id}
          onToggle={() => setOpenId((id) => (id === category.id ? null : category.id))}
          onClose={() => setOpenId((id) => (id === category.id ? null : id))}
        />
      ))}
    </nav>
  );
};
