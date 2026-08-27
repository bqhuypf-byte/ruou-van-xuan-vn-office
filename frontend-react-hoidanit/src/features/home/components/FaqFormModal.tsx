import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Modal } from '@/shared/components/ui';
import type { Faq } from '../types/home.types';

const faqSchema = z.object({
  question: z.string().min(1, 'Bắt buộc').max(500, 'Tối đa 500 ký tự'),
  answer: z.string().min(1, 'Bắt buộc').max(2000, 'Tối đa 2000 ký tự'),
  sortOrder: z.string().optional(),
  isActive: z.boolean(),
});

type FaqFormData = z.infer<typeof faqSchema>;

export interface FaqFormSubmitData {
  question: string;
  answer: string;
  sortOrder?: number;
  isActive: boolean;
}

export interface FaqFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FaqFormSubmitData) => Promise<void>;
  faqToEdit?: Faq | null;
  isLoading?: boolean;
}

const emptyValues: FaqFormData = {
  question: '',
  answer: '',
  sortOrder: '0',
  isActive: true,
};

export const FaqFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  faqToEdit,
  isLoading = false,
}: FaqFormModalProps) => {
  const isEditing = Boolean(faqToEdit);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FaqFormData>({
    resolver: zodResolver(faqSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (isOpen) {
      if (faqToEdit) {
        reset({
          question: faqToEdit.question,
          answer: faqToEdit.answer,
          sortOrder: String(faqToEdit.sortOrder),
          isActive: faqToEdit.isActive,
        });
      } else {
        reset(emptyValues);
      }
    }
  }, [isOpen, faqToEdit, reset]);

  const handleFormSubmit = async (data: FaqFormData) => {
    await onSubmit({
      question: data.question,
      answer: data.answer,
      sortOrder: data.sortOrder ? Number(data.sortOrder) : undefined,
      isActive: data.isActive,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Chỉnh Sửa Câu Hỏi' : 'Thêm Câu Hỏi Mới'}
      description="Câu hỏi thường gặp hiển thị ở cuối trang chủ"
      size="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5 mt-2">
        <div className="w-full space-y-1.5">
          <label
            htmlFor="question"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Câu hỏi
          </label>
          <textarea
            id="question"
            rows={2}
            placeholder="Làm sao để đổi trả sản phẩm?"
            className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:border-brand-500 focus:ring-brand-500/20"
            {...register('question')}
          />
          {errors.question?.message && (
            <p className="text-xs text-rose-600 dark:text-rose-400">{errors.question.message}</p>
          )}
        </div>

        <div className="w-full space-y-1.5">
          <label
            htmlFor="answer"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Câu trả lời
          </label>
          <textarea
            id="answer"
            rows={4}
            placeholder="Bạn có thể đổi trả trong vòng 7 ngày..."
            className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:border-brand-500 focus:ring-brand-500/20"
            {...register('answer')}
          />
          {errors.answer?.message && (
            <p className="text-xs text-rose-600 dark:text-rose-400">{errors.answer.message}</p>
          )}
        </div>

        <Input
          label="Thứ tự hiển thị"
          type="number"
          placeholder="0"
          {...register('sortOrder')}
        />

        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            className="rounded border-slate-300 text-brand-600 focus:ring-brand-500/20 dark:border-slate-700"
            {...register('isActive')}
          />
          Hiển thị trên trang chủ
        </label>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" onClick={onClose} type="button">
            Hủy
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {isEditing ? 'Cập Nhật' : 'Tạo Mới'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
