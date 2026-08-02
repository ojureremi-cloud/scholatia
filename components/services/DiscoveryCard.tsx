import React from 'react';
import { formatDate } from './format';
import type { DiscoveryItem } from '@/types/discovery';

type DiscoveryCardProps = {
  item: DiscoveryItem;
};

export default function DiscoveryCard({ item }: DiscoveryCardProps) {
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <a href={item.url} className="font-semibold text-slate-900 hover:text-sky-700">
          {item.title}
        </a>
        <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-800">{item.entityType}</span>
      </div>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-500">{item.summary}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {item.keywords.slice(0, 5).map((keyword) => (
          <span key={keyword} className="rounded-full bg-slate-50 px-2.5 py-1 text-xs text-slate-500">
            {keyword}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span>
          {item.organizations?.slice(0, 1).join(', ') || '—'}
          {item.year ? ` · ${item.year}` : ''}
        </span>
        <span className="font-medium text-slate-800">score {item.score}</span>
      </div>

      <p className="mt-2 text-xs text-slate-400">
        {item.stageId ? `${item.stageId} · ` : ''}added {formatDate(item.dateAdded)}
      </p>
    </article>
  );
}
