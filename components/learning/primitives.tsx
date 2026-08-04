import type { ReactNode } from 'react';

export { default as Button } from '@/components/ui/Button';

export type ChipTone = 'default' | 'success' | 'warning' | 'danger' | 'info';

const chipTones: Record<ChipTone, string> = {
  default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
  success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  danger: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
  info: 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200',
};

export type ChipProps = {
  children: ReactNode;
  tone?: ChipTone;
  icon?: string;
  className?: string;
};

export function Chip({ children, tone = 'default', icon, className = '' }: ChipProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold',
        chipTones[tone],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {icon ? <span aria-hidden="true">{icon}</span> : null}
      {children}
    </span>
  );
}

export type PanelProps = {
  eyebrow?: string;
  title?: string;
  icon?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Panel({ eyebrow, title, icon, actions, children, className = '' }: PanelProps) {
  return (
    <section
      className={[
        'rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {eyebrow || title || actions ? (
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            {icon ? (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-lg dark:bg-slate-800" aria-hidden="true">
                {icon}
              </span>
            ) : null}
            <div className="min-w-0">
              {eyebrow ? (
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{eyebrow}</p>
              ) : null}
              {title ? (
                <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h3>
              ) : null}
            </div>
          </div>
          {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
        </div>
      ) : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export type RowProps = {
  children: ReactNode;
  className?: string;
};

export function Row({ children, className = '' }: RowProps) {
  return (
    <div className={['flex flex-wrap items-center gap-3', className].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
}

export type StackProps = {
  children: ReactNode;
  className?: string;
};

export function Stack({ children, className = '' }: StackProps) {
  return <div className={['space-y-4', className].filter(Boolean).join(' ')}>{children}</div>;
}
