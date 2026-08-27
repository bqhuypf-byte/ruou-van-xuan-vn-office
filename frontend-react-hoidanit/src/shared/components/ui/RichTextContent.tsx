import { twMerge } from 'tailwind-merge';
import { sanitizeRichText } from '@/shared/utils/sanitizeRichText';

export interface RichTextContentProps {
  html: string;
  className?: string;
}

/** Renders HTML produced by RichTextEditor.tsx (product description, etc.) — sanitized, with
 * matching prose/table/video styling so it looks the same on the storefront as in the editor. */
export const RichTextContent = ({ html, className = '' }: RichTextContentProps) => (
  <div
    className={twMerge(
      'prose prose-sm dark:prose-invert max-w-none [&_table]:border-collapse [&_td]:border [&_td]:border-slate-300 [&_td]:p-2 [&_th]:border [&_th]:border-slate-300 [&_th]:p-2 [&_th]:bg-slate-100 dark:[&_td]:border-slate-700 dark:[&_th]:border-slate-700 dark:[&_th]:bg-slate-800 [&_.video-embed]:my-4',
      className,
    )}
    dangerouslySetInnerHTML={{ __html: sanitizeRichText(html) }}
  />
);
