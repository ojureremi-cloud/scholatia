import type { ReactNode } from 'react';

type CRIEHeaderProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
};

export function CRIEHeader({ title, subtitle, actions }: CRIEHeaderProps) {
  return (
    <div className="mb-10 space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600 dark:text-sky-400">
            Cognitive Research Intelligence Environment
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100">{title}</h2>
          {subtitle ? <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400">{subtitle}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}
