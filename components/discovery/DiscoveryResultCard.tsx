'use client';

import React from 'react';
import DiscoveryBadge from './DiscoveryBadge';
import { formatDate, formatYear } from './format';
import type { DiscoveryItem } from '@/types/discovery';

type DiscoveryResultCardProps = {
  item: DiscoveryItem;
  relevanceScore?: number;
  matchedFields?: string[];
  className?: string;
};

export default function DiscoveryResultCard({
  item,
  relevanceScore,
  className = '',
}: DiscoveryResultCardProps) {
  return (
    <div className={['flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <div className="flex items-start justify-between gap-3">
        <DiscoveryBadge entityType={item.entityType} />
        {relevanceScore !== undefined ? (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {Math.round(relevanceScore)}% match
          </span>
        ) : null}
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-6 text-slate-900">
        <a href={item.url} className="transition hover:text-sky-700">
          {item.title}
        </a>
      </h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{item.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{formatYear(item.year)}</span>
        {item.country ? (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{item.country}</span>
        ) : null}
        {item.status ? (
          <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700">{item.status}</span>
        ) : null}
      </div>
      <div className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-400">
        {item.organizations && item.organizations.length > 0 ? (
          <p className="truncate">{item.organizations.join(' · ')}</p>
        ) : null}
        <p className="mt-1">{formatDate(item.dateAdded)}</p>
      </div>
    </div>
  );
}
