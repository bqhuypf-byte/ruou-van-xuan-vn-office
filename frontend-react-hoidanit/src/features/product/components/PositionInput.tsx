import { useEffect, useState } from 'react';

export interface PositionInputProps {
  position: number;
  totalCount: number;
  onChangePosition: (position: number) => void;
}

export const PositionInput = ({ position, totalCount, onChangePosition }: PositionInputProps) => {
  const [value, setValue] = useState(String(position));

  useEffect(() => {
    setValue(String(position));
  }, [position]);

  const commit = () => {
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > totalCount || parsed === position) {
      setValue(String(position));
      return;
    }
    onChangePosition(parsed);
  };

  return (
    <input
      type="number"
      min={1}
      max={totalCount}
      value={value}
      title="Vị trí hiển thị"
      onChange={(e) => setValue(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.currentTarget.blur();
        }
      }}
      className="w-12 shrink-0 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-xs text-center py-1.5 focus:outline-none focus:ring-2 focus:border-brand-500 focus:ring-brand-500/20"
    />
  );
};
