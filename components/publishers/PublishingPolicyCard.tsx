'use client';

import React from 'react';
import { formatDate } from './format';
import type { PublishingPolicy } from '@/types/publisher';

type PublishingPolicyCardProps = {
  policies: PublishingPolicy[];
  className?: string;
};

const statusVariant: Record<string, string> = {
  Active: 'bg-emerald-100 text-emerald-800',
  'Under Review': 'bg-amber-100 text-amber-800',
  Draft: 'bg-slate-100 text-slate-700',
};

export default function PublishingPolicyCard({ policies, className = '' }: PublishingPolicyCardProps) {
  if (policies.length === 0) {
    return <p className="text-sm text-slate-500">No publishing policies recorded for this publisher.</p>;
  }
  return (
    <div className={['grid gap-4 sm:grid-cols-2 xl:grid-cols-3', className].filter(Boolean).join(' ')}>
      {policies.map((entry) => (
        <div key={entry.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-start justify-between gap-3">
            <p className="font-semibold text-slate-900">{entry.name}</p>
            <span
              className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${statusVariant[entry.status] ?? 'bg-slate-100 text-slate-700'}`}
            >
              {entry.status}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">{entry.type}</p>
          {entry.description ? <p className="mt-2 text-xs leading-5 text-slate-600">{entry.description}</p> : null}
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
            {entry.effectiveDate ? (
              <span className="rounded-full bg-white px-2 py-0.5 font-medium text-slate-700">
                Effective {formatDate(entry.effectiveDate)}
              </span>
            ) : null}
            {entry.scope ? (
              <span className="rounded-full bg-white px-2 py-0.5 font-medium text-slate-700">{entry.scope}</span>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
