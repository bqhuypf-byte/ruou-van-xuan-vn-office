import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useFaqs } from '../hooks/useFaqs';

export const FaqAccordion = () => {
  const { data: faqs } = useFaqs();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-3xl mx-auto">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={faq.id} className="border-b border-slate-200 dark:border-slate-800 py-4">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between gap-4 text-left"
              >
                <span className="font-semibold text-slate-900 dark:text-white">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 shrink-0 text-slate-400 transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{faq.answer}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
