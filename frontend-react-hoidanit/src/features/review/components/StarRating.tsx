import { Star } from 'lucide-react';

export interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md';
}

export const StarRating = ({ rating, size = 'sm' }: StarRatingProps) => {
  const starSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5';
  const rounded = Math.round(rating);

  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`${rating.toFixed(1)} trên 5 sao`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`${starSize} ${
            i < rounded ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'
          }`}
        />
      ))}
    </div>
  );
};
