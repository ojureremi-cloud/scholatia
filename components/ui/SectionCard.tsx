import React from 'react';

type SectionCardProps = {
  eyebrow: string;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

function SectionCard({ eyebrow, title, description, actions, children, className = '' }: SectionCardProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">{eyebrow}</p>
          {title ? <h3 className="mt-3 text-xl font-semibold text-slate-900">{title}</h3> : null}
          {description ? <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p> : null}
        </div>
        {actions ? <div className="flex-shrink-0">{actions}</div> : null}
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}

export default SectionCard;
