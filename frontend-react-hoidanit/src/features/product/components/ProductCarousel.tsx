import { useRef, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface ProductCarouselProps {
  children: ReactNode;
  showControls?: boolean;
}

export const ProductCarousel = ({ children, showControls = true }: ProductCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollByAmount = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <div className="relative group/carousel">
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
      {showControls && (
        <>
          <button
            type="button"
            onClick={() => scrollByAmount('left')}
            aria-label="Trước"
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-slate-100 hover:bg-brand-600 hover:text-white text-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-all items-center justify-center shrink-0 shadow-sm opacity-0 group-hover/carousel:opacity-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollByAmount('right')}
            aria-label="Sau"
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-10 h-10 rounded-full bg-slate-100 hover:bg-brand-600 hover:text-white text-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-all items-center justify-center shrink-0 shadow-sm opacity-0 group-hover/carousel:opacity-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
    </div>
  );
};
