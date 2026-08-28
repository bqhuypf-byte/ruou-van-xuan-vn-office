import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import { useClickOutside } from '@/shared/hooks/useClickOutside';
import { FlagIcon } from '@/shared/components/icons/FlagIcon';
import type { FlagCode } from '@/shared/components/icons/FlagIcon';
import type { SupportedLanguage } from '@/shared/i18n/config';

const LANGUAGES: { code: SupportedLanguage; flag: FlagCode; labelKey: 'language.vi' | 'language.en' }[] = [
  { code: 'vi', flag: 'vi', labelKey: 'language.vi' },
  { code: 'en', flag: 'en', labelKey: 'language.en' },
];

export const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useClickOutside(containerRef, () => setIsOpen(false), isOpen);

  const current =
    LANGUAGES.find((lang) => lang.code === i18n.resolvedLanguage) ?? LANGUAGES[0];

  const handleSelect = (code: SupportedLanguage) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-4 left-4 z-50" ref={containerRef}>
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base text-left transition-colors ${
                lang.code === current.code
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              <FlagIcon code={lang.flag} className="w-7 h-5" />
              {t(lang.labelKey)}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => setIsOpen((open) => !open)}
        aria-label={t('language.label')}
        className="flex items-center justify-center gap-2.5 w-11 h-11 sm:w-auto sm:justify-start sm:px-4 sm:py-3 rounded-full sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-base font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
      >
        <FlagIcon code={current.flag} className="w-6 h-4 sm:w-7 sm:h-5" />
        <span className="hidden sm:inline">{current.code.toUpperCase()}</span>
        <ChevronDown
          className={`hidden sm:block w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
    </div>
  );
};
