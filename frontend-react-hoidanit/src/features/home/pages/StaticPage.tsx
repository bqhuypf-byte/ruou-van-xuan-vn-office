import { Link, useParams } from 'react-router';
import { ArrowLeft, FileQuestion } from 'lucide-react';
import { Spinner } from '@/shared/components/ui';
import { ROUTES } from '@/routes/routes';
import { usePage } from '../hooks/usePages';

export const StaticPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: page, isLoading, isError } = usePage(slug);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !page) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
          <FileQuestion className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Không tìm thấy trang
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Trang này chưa được tạo hoặc đã bị ẩn.
        </p>
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Về trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Về trang chủ
        </Link>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
            {page.title}
          </h1>
          <div className="text-sm sm:text-base text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed">
            {page.content}
          </div>
        </div>
      </div>
    </div>
  );
};
