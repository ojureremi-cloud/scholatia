import React from 'react';
import { entityTypeIcon, formatEntityType, formatDate } from './format';
import type { PromotableObject } from '@/types/ads';

type PromotableObjectCardProps = {
  object: PromotableObject;
  featured?: boolean;
};

export default function PromotableObjectCard({ object, featured = false }: PromotableObjectCardProps) {
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {entityTypeIcon(object.entityType)} {formatEntityType(object.entityType)}
        </span>
        <span className="text-xs font-medium text-slate-400">{object.id}</span>
      </div>
      <h3
        className={[
          'mt-3 font-semibold leading-7 text-slate-900',
          featured ? 'text-2xl' : 'text-lg',
        ].join(' ')}
      >
        <a href={object.url} className="transition hover:text-sky-700">
          {object.title}
        </a>
      </h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{object.summary}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {object.keywords.slice(0, 4).map((keyword) => (
          <span key={keyword} className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-700">
            {keyword}
          </span>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
        {object.stageId ? (
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-slate-600">{object.stageId}</span>
        ) : null}
        {object.country ? <span>🌍 {object.country}</span> : null}
        <span className="ml-auto">{formatDate(object.dateAdded)}</span>
      </div>
    </article>
  );
}
