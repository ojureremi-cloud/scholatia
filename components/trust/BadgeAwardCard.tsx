import React from 'react';
import { TierBadge } from './TrustBadge';
import { formatDateLabel } from './format';
import type { BadgeAward } from '@/types/trust';

type BadgeAwardCardProps = {
  award: BadgeAward;
  featured?: boolean;
};

export default function BadgeAwardCard({ award, featured = false }: BadgeAwardCardProps) {
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-2xl">🏅</span>
          <div>
            <h3 className={['font-semibold text-slate-900', featured ? 'text-2xl leading-8' : 'text-lg leading-7'].join(' ')}>
              {award.title}
            </h3>
            <p className="text-xs font-medium text-slate-400">{award.id}</p>
          </div>
        </div>
        <TierBadge tier={award.tier} />
      </div>
      <p className="mt-3 text-sm font-medium text-slate-700">
        Awarded to <span className="font-semibold text-slate-900">{award.entityName}</span>
      </p>
      <ul className="mt-4 flex-1 space-y-1.5 border-t border-slate-100 pt-3">
        {award.criteriaMet.map((criterion) => (
          <li key={criterion} className="flex items-start gap-2 text-sm text-slate-600">
            <span className="mt-0.5 text-emerald-600">✓</span>
            {criterion}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-slate-400">
        Awarded {formatDateLabel(award.awardedAt)}
        {award.expiresAt ? ` · expires ${formatDateLabel(award.expiresAt)}` : ''}
      </p>
    </article>
  );
}
