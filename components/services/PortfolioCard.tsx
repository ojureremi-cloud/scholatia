import React from 'react';
import { CategoryBadge } from './ServiceBadge';
import type { ServicePortfolioItem } from '@/types/services';

type PortfolioCardProps = {
  item: ServicePortfolioItem;
};

export default function PortfolioCard({ item }: PortfolioCardProps) {
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="font-semibold text-slate-900">{item.title}</p>
        <CategoryBadge category={item.category} />
      </div>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-500">{item.description}</p>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
        {item.client ? <span>Client: {item.client}</span> : null}
        {item.year ? <span>Year: {item.year}</span> : null}
      </div>
      {item.result ? (
        <p className="mt-3 rounded-2xl bg-emerald-50 px-4 py-2 text-xs font-medium text-emerald-700">{item.result}</p>
      ) : null}
    </article>
  );
}
