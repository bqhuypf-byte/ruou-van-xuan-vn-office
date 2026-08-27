export type FlagCode = 'vi' | 'en';

const VNFlag = ({ className }: { className: string }) => (
  <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
    <rect width="30" height="20" fill="#DA251D" />
    <polygon
      points="15,5 16.76,10.47 22.51,10.47 17.88,13.85 19.63,19.32 15,15.94 10.37,19.32 12.12,13.85 7.49,10.47 13.24,10.47"
      fill="#FFCD00"
    />
  </svg>
);

const USFlag = ({ className }: { className: string }) => (
  <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
    <rect width="30" height="20" fill="#FFFFFF" />
    {Array.from({ length: 7 }, (_, i) => (
      <rect key={i} y={i * 2 * (20 / 13)} width="30" height={20 / 13} fill="#B22234" />
    ))}
    <rect width="12" height={20 * (7 / 13)} fill="#3C3B6E" />
  </svg>
);

const FLAGS: Record<FlagCode, (props: { className: string }) => React.JSX.Element> = {
  vi: VNFlag,
  en: USFlag,
};

export const FlagIcon = ({ code, className }: { code: FlagCode; className?: string }) => {
  const Flag = FLAGS[code];
  return (
    <span className="inline-flex shrink-0 overflow-hidden rounded-[2px] shadow-sm ring-1 ring-black/10">
      <Flag className={className ?? 'w-5 h-[14px]'} />
    </span>
  );
};
