import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import {
  AlertCircle,
  Check,
  EyeOff,
  Mail,
  MessageSquareText,
  Phone,
  Search,
  Trash2,
} from 'lucide-react';
import { Badge, Button, Input, Modal, Select, Spinner } from '@/shared/components/ui';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { StarRating } from '../components/StarRating';
import { useAdminReviews, useDeleteReview, useModerateReview } from '../hooks/useAdminReviews';
import type { AdminReview, ReviewStatus } from '../types/review.types';

const STATUS_META: Record<
  ReviewStatus,
  { label: string; variant: 'success' | 'default' }
> = {
  approved: { label: 'Đang hiển thị', variant: 'success' },
  hidden: { label: 'Đã ẩn', variant: 'default' },
};

export const AdminReviewsPage = () => {
  const { reviews, isLoading, isError, error, refetch } = useAdminReviews();
  const moderateReview = useModerateReview();
  const deleteReview = useDeleteReview();
  const [status, setStatus] = useState<ReviewStatus | 'all'>('all');
  const [rating, setRating] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedReview, setSelectedReview] = useState<AdminReview | null>(null);
  const [reviewToDelete, setReviewToDelete] = useState<AdminReview | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const counts = useMemo(
    () => ({
      all: reviews.length,
      approved: reviews.filter((review) => review.status === 'approved').length,
      hidden: reviews.filter((review) => review.status === 'hidden').length,
    }),
    [reviews],
  );

  const filteredReviews = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('vi');
    return reviews.filter((review) => {
      if (status !== 'all' && review.status !== status) return false;
      if (rating !== 'all' && review.rating !== Number(rating)) return false;
      if (!term) return true;
      return [
        review.user.fullName,
        review.reviewerEmail,
        review.reviewerPhone,
        review.comment,
        review.product.name,
      ].some((value) => value?.toLocaleLowerCase('vi').includes(term));
    });
  }, [rating, reviews, search, status]);

  const handleModerate = async (review: AdminReview, nextStatus: ReviewStatus) => {
    setBusyId(review.id);
    setFeedback(null);
    try {
      await moderateReview.mutateAsync({ id: review.id, status: nextStatus });
      setFeedback({
        type: 'success',
        message: `Đã chuyển đánh giá #${review.id} sang “${STATUS_META[nextStatus].label}”.`,
      });
      setSelectedReview((current) =>
        current?.id === review.id ? { ...current, status: nextStatus } : current,
      );
    } catch (mutationError) {
      setFeedback({
        type: 'error',
        message: getApiErrorMessage(mutationError, 'Không thể cập nhật trạng thái đánh giá.'),
      });
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async () => {
    if (!reviewToDelete) return;
    setBusyId(reviewToDelete.id);
    setFeedback(null);
    try {
      await deleteReview.mutateAsync(reviewToDelete.id);
      setFeedback({ type: 'success', message: `Đã xóa đánh giá #${reviewToDelete.id}.` });
      setSelectedReview(null);
      setReviewToDelete(null);
    } catch (mutationError) {
      setFeedback({
        type: 'error',
        message: getApiErrorMessage(mutationError, 'Không thể xóa đánh giá.'),
      });
    } finally {
      setBusyId(null);
    }
  };

  const renderActions = (review: AdminReview) => (
    <div className="flex flex-wrap gap-2">
      {review.status === 'hidden' && (
        <Button
          size="sm"
          leftIcon={<Check className="h-3.5 w-3.5" />}
          disabled={busyId === review.id}
          onClick={() => handleModerate(review, 'approved')}
        >
          Hiện lại
        </Button>
      )}
      {review.status === 'approved' && (
        <Button
          size="sm"
          variant="secondary"
          leftIcon={<EyeOff className="h-3.5 w-3.5" />}
          disabled={busyId === review.id}
          onClick={() => handleModerate(review, 'hidden')}
        >
          Ẩn
        </Button>
      )}
      <Button
        size="sm"
        variant="danger"
        leftIcon={<Trash2 className="h-3.5 w-3.5" />}
        disabled={busyId === review.id}
        onClick={() => setReviewToDelete(review)}
      >
        Xóa
      </Button>
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          Quản Lý Đánh Giá
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Đánh giá được hiển thị ngay; Admin có thể ẩn, hiện lại hoặc xóa khi cần.
        </p>
      </div>

      {feedback && (
        <div
          className={`flex items-center justify-between rounded-xl border p-4 text-sm ${
            feedback.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
              : 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300'
          }`}
        >
          <span>{feedback.message}</span>
          <button
            className="ml-4 text-xs font-semibold hover:underline"
            onClick={() => setFeedback(null)}
          >
            Đóng
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {(
          [
            ['all', 'Tất cả', MessageSquareText],
            ['approved', 'Đang hiển thị', Check],
            ['hidden', 'Đã ẩn', EyeOff],
          ] as const
        ).map(([value, label, Icon]) => (
          <button
            key={value}
            onClick={() => setStatus(value)}
            className={`rounded-2xl border p-4 text-left transition-colors ${
              status === value
                ? 'border-brand-500 bg-brand-50 dark:border-brand-600 dark:bg-brand-950/40'
                : 'border-slate-200 bg-white hover:border-brand-300 dark:border-slate-800 dark:bg-slate-900'
            }`}
          >
            <Icon className="h-5 w-5 text-brand-600 dark:text-brand-400" />
            <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">{counts[value]}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
          </button>
        ))}
      </div>

      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[1fr_180px] dark:border-slate-800 dark:bg-slate-900">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Tìm theo khách hàng, sản phẩm, email, số điện thoại..."
          leftIcon={<Search className="h-4 w-4" />}
        />
        <Select value={rating} onChange={(event) => setRating(event.target.value)}>
          <option value="all">Tất cả số sao</option>
          {[5, 4, 3, 2, 1].map((value) => (
            <option key={value} value={value}>{value} sao</option>
          ))}
        </Select>
      </div>

      {isError && (
        <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300">
          <span className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            {getApiErrorMessage(error, 'Không thể tải danh sách đánh giá.')}
          </span>
          <button onClick={() => refetch()} className="font-semibold hover:underline">Thử lại</button>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : filteredReviews.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-16 text-center dark:border-slate-800 dark:bg-slate-900">
          <MessageSquareText className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 font-medium text-slate-700 dark:text-slate-200">Không có đánh giá phù hợp</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReviews.map((review) => (
            <article
              key={review.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={STATUS_META[review.status].variant}>
                      {STATUS_META[review.status].label}
                    </Badge>
                    {review.orderId && <Badge variant="primary">Đã mua hàng</Badge>}
                    <span className="text-xs text-slate-400">
                      #{review.id} · {new Date(review.createdAt).toLocaleString('vi-VN')}
                    </span>
                  </div>
                  <button className="mt-3 text-left" onClick={() => setSelectedReview(review)}>
                    <div className="flex items-center gap-2">
                      <StarRating rating={review.rating} />
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {review.user.fullName}
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                      {review.comment || 'Không có nội dung nhận xét.'}
                    </p>
                  </button>
                  {review.product.slug ? (
                    <Link
                      to={`/admin/products/${review.product.slug}`}
                      className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-brand-700 hover:underline dark:text-brand-400"
                    >
                      {review.product.thumbnailUrl && (
                        <img src={review.product.thumbnailUrl} alt="" className="h-8 w-8 rounded-lg object-cover" />
                      )}
                      {review.product.name}
                    </Link>
                  ) : (
                    <p className="mt-3 text-sm font-medium text-slate-400">
                      {review.product.name}
                    </p>
                  )}
                </div>
                <div className="shrink-0">{renderActions(review)}</div>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal
        isOpen={selectedReview !== null}
        onClose={() => setSelectedReview(null)}
        title="Chi tiết đánh giá"
        size="lg"
      >
        {selectedReview && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={STATUS_META[selectedReview.status].variant}>
                {STATUS_META[selectedReview.status].label}
              </Badge>
              <StarRating rating={selectedReview.rating} />
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">{selectedReview.user.fullName}</p>
              <div className="mt-2 flex flex-col gap-1 text-sm text-slate-500 dark:text-slate-400 sm:flex-row sm:gap-5">
                <span className="flex items-center gap-1.5"><Mail className="h-4 w-4" />{selectedReview.reviewerEmail || 'Không có email'}</span>
                <span className="flex items-center gap-1.5"><Phone className="h-4 w-4" />{selectedReview.reviewerPhone || 'Không có số điện thoại'}</span>
              </div>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700 dark:bg-slate-950 dark:text-slate-300">
              {selectedReview.comment || 'Không có nội dung nhận xét.'}
            </div>
            {selectedReview.imageUrls.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {selectedReview.imageUrls.map((url) => (
                  <a key={url} href={url} target="_blank" rel="noreferrer">
                    <img src={url} alt="Ảnh đánh giá" className="h-24 w-24 rounded-xl border border-slate-200 object-cover dark:border-slate-700" />
                  </a>
                ))}
              </div>
            )}
            <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
              {renderActions(selectedReview)}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={reviewToDelete !== null}
        onClose={() => setReviewToDelete(null)}
        title="Xóa đánh giá?"
        size="sm"
      >
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Đánh giá sẽ bị xóa vĩnh viễn và không thể khôi phục. Nếu chỉ muốn ngừng hiển thị,
          hãy dùng trạng thái “Đã ẩn”.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setReviewToDelete(null)}>Hủy</Button>
          <Button variant="danger" isLoading={deleteReview.isPending} onClick={handleDelete}>
            Xóa đánh giá
          </Button>
        </div>
      </Modal>
    </div>
  );
};
