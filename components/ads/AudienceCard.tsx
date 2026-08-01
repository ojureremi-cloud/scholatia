import React from 'react';
import { formatCompactNumber } from './format';
import type { AdAudience } from '@/types/ads';

type AudienceCardProps = {
  audience: AdAudience;
};

export default function AudienceCard({ audience }: AudienceCardProps) {
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">Audience</span>
        <span className="text-sm font-semibold text-sky-700">{formatCompactNumber(audience.estimatedReach)} reach</span>
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-7 text-slate-900">{audience.name}</h3>
      {audience.description ? <p className="mt-2 text-sm leading-6 text-slate-600">{audience.description}</p> : null}
      <div className="mt-4 flex-1 space-y-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Disciplines</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {audience.disciplines.slice(0, 5).map((discipline) => (
              <span key={discipline} className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-700">
                {discipline}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Ranks</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {audience.academicRanks.slice(0, 5).map((rank) => (
              <span key={rank} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600">
                {rank}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <p className="flex flex-wrap items-center gap-1">
          <span>🌍 {audience.countries.slice(0, 6).join(', ')}{audience.countries.length > 6 ? '…' : ''}</span>
        </p>
      </div>
    </article>
  );
}
