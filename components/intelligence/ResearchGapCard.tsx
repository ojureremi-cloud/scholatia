import React from 'react';
import { formatScore } from './format';
import { entityTypeIcon, entityTypeLabel } from '@/components/discovery';
import type { ResearchGap } from '@/types/intelligence';

const severityStyles: Record<ResearchGap['severity'], string> = {
  high: 'bg-rose-50 text-rose-700',
  medium: 'bg-amber-50 text-amber-700',
  low: 'bg-slate-100 text-slate-600',
};

type ResearchGapCardProps = {
  gap: ResearchGap;
};

export default function ResearchGapCard({ gap }: ResearchGapCardProps) {
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{gap.discipline}</span>
        <span className={['rounded-full px-3 py-1 text-xs font-semibold capitalize', severityStyles[gap.severity]].join(' ')}>
          {gap.severity} severity
        </span>
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-7 text-slate-900">{gap.topic}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{gap.rationale}</p>
      {gap.evidence.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {gap.evidence.map((entry) => (
            <span key={entry.entityType} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600">
              {entityTypeIcon(entry.entityType)} {entityTypeLabel(entry.entityType)} · {entry.count}
            </span>
          ))}
        </div>
      ) : null}
      <div className="mt-4 border-t border-slate-100 pt-3">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-medium uppercase tracking-[0.2em]">Opportunity</span>
          <span className="font-semibold">{formatScore(gap.opportunityScore)}</span>
        </div>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-violet-600" style={{ width: `${gap.opportunityScore}%` }} />
        </div>
      </div>
      {gap.recommendations.length > 0 ? (
        <ul className="mt-4 space-y-1.5 border-t border-slate-100 pt-3 text-sm text-slate-600">
          {gap.recommendations.map((recommendation) => (
            <li key={recommendation} className="flex gap-2">
              <span className="text-sky-600">→</span>
              <span>{recommendation}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
