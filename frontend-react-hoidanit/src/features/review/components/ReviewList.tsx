import { MessageSquareOff, User } from 'lucide-react';
import { StarRating } from './StarRating';
import type { Review } from '../types/review.types';

export interface ReviewListProps {
  reviews: Review[];
  isLoading: boolean;
}

export const ReviewList = ({ reviews, isLoading }: ReviewListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-20 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-10 text-center">
        <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <MessageSquareOff className="w-6 h-6" />
        </div>
        <p className="text-sm font-medium text-slate-900 dark:text-white">Chưa có đánh giá nào</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Hãy là người đầu tiên đánh giá sản phẩm này.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <p className="font-semibold text-slate-900 dark:text-white">
                  {review.user.fullName}
                </p>
                <span className="text-xs text-slate-400">
                  {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <StarRating rating={review.rating} />
              {review.comment && (
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  {review.comment}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
