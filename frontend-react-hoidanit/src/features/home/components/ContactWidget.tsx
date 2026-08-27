import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ChevronDown,
  MapPin,
  Mail,
  MessageCircle,
  MessageSquare,
  Phone,
  Send,
  Store,
  X,
  type LucideIcon,
} from 'lucide-react';
import { useClickOutside } from '@/shared/hooks/useClickOutside';
import type { ContactChannel } from '../types/home.types';

const ICON_MAP: Record<string, LucideIcon> = {
  MessageCircle,
  Send,
  Phone,
  Store,
  Mail,
  MessageSquare,
};

export interface ContactWidgetProps {
  channels: ContactChannel[];
}

export const ContactWidget = ({ channels }: ContactWidgetProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  useClickOutside(containerRef, () => setIsOpen(false), isOpen);

  const activeChannels = channels.filter((c) => c.isActive);
  if (activeChannels.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50" ref={containerRef}>
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
          {activeChannels.map((channel, index) => {
            const Icon = ICON_MAP[channel.icon] ?? MessageCircle;
            const isExternal = /^https?:\/\//.test(channel.link);
            const hasLocations = (channel.locations?.length ?? 0) > 0;
            const isExpanded = expandedIndex === index;

            if (hasLocations) {
              return (
                <div
                  key={`${channel.label}-${index}`}
                  className="border-b border-slate-100 dark:border-slate-800 last:border-0"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedIndex(isExpanded ? null : index)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white"
                      style={{ backgroundColor: channel.bgColor }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1 text-left">
                      <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                        {channel.label}
                      </p>
                      <p className="text-xs text-slate-400">({channel.hours})</p>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isExpanded && (
                    <div className="bg-slate-50 dark:bg-slate-800/60">
                      {channel.locations!.map((loc, locIndex) => (
                        <a
                          key={`${loc.label}-${locIndex}`}
                          href={loc.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 pl-14 pr-4 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                          <span className="text-sm text-slate-700 dark:text-slate-200 truncate">
                            {loc.label}
                          </span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <a
                key={`${channel.label}-${index}`}
                href={channel.link}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white"
                  style={{ backgroundColor: channel.bgColor }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                    {channel.label}
                  </p>
                  <p className="text-xs text-slate-400">({channel.hours})</p>
                </div>
              </a>
            );
          })}
        </div>
      )}

      <div className="relative">
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-brand-500 contact-widget-ping" aria-hidden />
        )}
        <button
          onClick={() => setIsOpen((open) => !open)}
          aria-label={t('contactWidget.toggle')}
          className={`relative flex items-center gap-2 pl-4 pr-5 h-14 rounded-full bg-brand-600 hover:bg-brand-700 text-white shadow-xl transition-colors ${
            isOpen ? '' : 'contact-widget-shake'
          }`}
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6 shrink-0" />}
          {!isOpen && <span className="font-semibold whitespace-nowrap">{t('contactWidget.toggle')}</span>}
        </button>
      </div>
    </div>
  );
};
