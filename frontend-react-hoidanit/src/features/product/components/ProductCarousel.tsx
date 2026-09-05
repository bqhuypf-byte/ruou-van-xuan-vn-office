import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface ProductCarouselProps {
  children: ReactNode;
  showControls?: boolean;
  contentClassName?: string;
}

export const ProductCarousel = ({
  children,
  showControls = true,
  contentClassName = '',
}: ProductCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const updateCanScroll = () => {
      setCanScroll(el.scrollWidth > el.clientWidth + 1);
    };

    updateCanScroll();
    const resizeObserver = new ResizeObserver(updateCanScroll);
    resizeObserver.observe(el);
    return () => resizeObserver.disconnect();
  }, [children]);

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
        className={`flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${contentClassName}`}
      >
        {children}
      </div>
      {showControls && canScroll && (
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
