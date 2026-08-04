type ProgressBarProps = {
  percent: number;
  className?: string;
};

export function ProgressBar({ percent, className = '' }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));
  const barColor =
    clamped >= 100 ? 'bg-emerald-500' : clamped >= 50 ? 'bg-sky-500' : clamped > 0 ? 'bg-amber-500' : 'bg-slate-300';
  return (
    <div
      className={[
        'h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${Math.round(clamped)}% complete`}
    >
      <div className={['h-full rounded-full transition-all', barColor].join(' ')} style={{ width: `${clamped}%` }} />
    </div>
  );
}
