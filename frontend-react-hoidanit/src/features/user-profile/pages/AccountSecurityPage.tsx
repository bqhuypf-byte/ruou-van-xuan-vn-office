import { ShieldCheck } from 'lucide-react';
import { ChangePasswordCard } from '../components/ChangePasswordCard';

export const AccountSecurityPage = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-heading">
            Tài Khoản &amp; Bảo Mật
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Quản lý mật khẩu và các tùy chọn bảo vệ tài khoản.
          </p>
        </div>
      </div>

      <ChangePasswordCard />
    </div>
  </div>
);
