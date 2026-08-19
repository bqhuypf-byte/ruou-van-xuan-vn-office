import { useRef, useState } from 'react';
import { Link } from 'react-router';
import { ChevronDown, FolderTree } from 'lucide-react';
import { useClickOutside } from '@/shared/hooks/useClickOutside';
import { ROUTES } from '@/routes/routes';
import { useCategories } from '../hooks/useCategories';
import type { Category } from '../types/category.types';

const CategoryTreeLinks = ({
  categories,
  depth,
  onNavigate,
}: {
  categories: Category[];
  depth: number;
  onNavigate: () => void;
}) => (
  <>
    {categories.map((category) => (
      <div key={category.id}>
        <Link
          to={ROUTES.CATEGORY.replace(':slug', category.slug)}
          onClick={onNavigate}
          style={{ paddingLeft: `${12 + depth * 16}px` }}
          className={`block pr-3 py-2 rounded-xl text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
            depth === 0
              ? 'font-semibold text-slate-900 dark:text-white'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          {category.name}
        </Link>
        {category.children.length > 0 && (
          <CategoryTreeLinks
            categories={category.children}
            depth={depth + 1}
            onNavigate={onNavigate}
          />
        )}
      </div>
    ))}
  </>
);

export const CategoryNavMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { tree } = useCategories();

  useClickOutside(containerRef, () => setIsOpen(false), isOpen);

  if (tree.length === 0) return null;

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen((open) => !open)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
      >
        <FolderTree className="w-4 h-4" />
        Danh Mục
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden z-50 max-h-[70vh] overflow-y-auto">
          <nav className="p-2">
            <CategoryTreeLinks categories={tree} depth={0} onNavigate={() => setIsOpen(false)} />
          </nav>
        </div>
      )}
    </div>
  );
};
