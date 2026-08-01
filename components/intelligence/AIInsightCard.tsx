import React from 'react';
import { SeverityBadge } from './IntelligenceBadge';
import { formatDateLabel, formatInsightType } from './format';
import { entityTypeIcon, entityTypeLabel } from '@/components/discovery';
import type { IntelligenceInsight } from '@/types/intelligence';

type AIInsightCardProps = {
  insight: IntelligenceInsight;
  featured?: boolean;
};

export default function AIInsightCard({ insight, featured = false }: AIInsightCardProps) {
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SeverityBadge severity={insight.severity} />
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {formatInsightType(insight.type)}
        </span>
      </div>
      <h3
        className={[
          'mt-3 font-semibold text-slate-900',
          featured ? 'text-2xl leading-8' : 'text-lg leading-7',
        ].join(' ')}
      >
        {insight.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{insight.summary}</p>
      {insight.entityType ? (
        <p className="mt-3 text-xs font-medium text-slate-500">
          {entityTypeIcon(insight.entityType)} {entityTypeLabel(insight.entityType)}
        </p>
      ) : null}
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
        {insight.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-slate-600">
            {tag}
          </span>
        ))}
        <span className="ml-auto">{formatDateLabel(insight.date)}</span>
      </div>
    </article>
  );
}
