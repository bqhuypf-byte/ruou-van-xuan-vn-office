import {
  CheckCircle,
  Clock,
  CreditCard,
  Headphones,
  Package,
  RotateCcw,
  ShieldCheck,
  Star,
  Truck,
  type LucideIcon,
} from 'lucide-react';
import type { TrustBadge } from '../types/home.types';

const ICON_MAP: Record<string, LucideIcon> = {
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  CreditCard,
  Package,
  Star,
  Clock,
};

export interface TrustBadgeStripProps {
  badges: TrustBadge[];
}

export const TrustBadgeStrip = ({ badges }: TrustBadgeStripProps) => {
  if (badges.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {badges.map((badge, index) => {
          const Icon = ICON_MAP[badge.icon] ?? CheckCircle;
          return (
            <div key={`${badge.title}-${index}`} className="flex flex-col items-center text-center gap-2">
              <Icon className="w-8 h-8 text-brand-600 dark:text-brand-400" />
              <p className="font-semibold text-slate-900 dark:text-white">{badge.title}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{badge.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
