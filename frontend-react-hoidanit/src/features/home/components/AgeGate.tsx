import { useEffect, useState, type ReactNode } from 'react';
import { Wine } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';

const AGE_CONFIRMED_KEY = 'van-xuan-age-confirmed-v1';

export const AgeGate = ({ children }: { children: ReactNode }) => {
  const { data: settings, isLoading } = useSiteSettings();
  const [confirmed, setConfirmed] = useState(() => {
    try {
      return localStorage.getItem(AGE_CONFIRMED_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [rejected, setRejected] = useState(false);

  useEffect(() => {
    if (!confirmed && settings?.ageGateEnabled) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [confirmed, settings?.ageGateEnabled]);

  if (confirmed || settings?.ageGateEnabled === false) return <>{children}</>;
  if (isLoading) return null;
  if (!settings) return <>{children}</>;

  const accept = () => {
    try {
      localStorage.setItem(AGE_CONFIRMED_KEY, 'true');
    } catch {
      // Storage can be unavailable in strict privacy mode; keep access for this page load.
    }
    document.body.style.overflow = '';
    setConfirmed(true);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="age-gate-title">
      <div className="w-full max-w-2xl rounded-2xl border border-amber-200 bg-[#fffaf0] p-6 text-center shadow-2xl sm:p-10">
        <Wine className="mx-auto mb-4 h-10 w-10 text-brand-700" aria-hidden="true" />
        <h1 id="age-gate-title" className="text-2xl font-bold uppercase leading-tight text-brand-800 sm:text-3xl">
          {settings.ageGateTitle}
        </h1>
        {rejected ? (
          <div className="mt-6 space-y-4">
            <p className="text-sm leading-6 text-slate-600">Rất tiếc, website này chỉ dành cho người từ đủ 18 tuổi.</p>
            <button type="button" onClick={() => history.length > 1 ? history.back() : window.location.replace('about:blank')} className="rounded-lg bg-slate-700 px-5 py-3 text-sm font-semibold uppercase text-white hover:bg-slate-800">Rời Website</button>
          </div>
        ) : (
          <>
            <p className="mx-auto mt-5 max-w-xl whitespace-pre-line text-sm leading-6 text-amber-900/70 sm:text-base">{settings.ageGateDescription}</p>
            <p className="mt-3 text-sm font-semibold uppercase text-brand-800">Quý khách đã đủ 18 tuổi?</p>
            <div className="mt-6 flex flex-col-reverse justify-center gap-3 sm:flex-row">
              <button type="button" onClick={() => setRejected(true)} className="rounded-lg border border-amber-700/30 bg-amber-100 px-6 py-3 font-semibold uppercase text-amber-950 hover:bg-amber-200">{settings.ageGateRejectLabel}</button>
              <button type="button" autoFocus onClick={accept} className="rounded-lg bg-brand-700 px-6 py-3 font-semibold uppercase text-white hover:bg-brand-800">{settings.ageGateConfirmLabel}</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
