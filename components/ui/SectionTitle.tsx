import React from 'react';

type SectionTitleProps = {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
};

function SectionTitle({ eyebrow, title, description, className = '' }: SectionTitleProps) {
  return (
    <div className={className}>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">{eyebrow}</p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{title}</h2>
      {description ? <p className="mt-4 text-base leading-8 text-slate-600">{description}</p> : null}
    </div>
  );
}

export default SectionTitle;
