import React from 'react';
import { entityTypeIcon, entityTypeLabel } from '@/components/discovery';
import type { EmergingTopic } from '@/types/intelligence';

const stageStyles: Record<EmergingTopic['adoptionStage'], string> = {
  exploratory: 'bg-slate-100 text-slate-600',
  growing: 'bg-amber-50 text-amber-700',
  established: 'bg-emerald-50 text-emerald-700',
};

type EmergingTopicCardProps = {
  topic: EmergingTopic;
  featured?: boolean;
};

export default function EmergingTopicCard({ topic, featured = false }: EmergingTopicCardProps) {
  const metrics = [
    { label: 'Novelty', value: topic.novelty, color: 'bg-violet-600' },
    { label: 'Momentum', value: topic.momentum, color: 'bg-sky-600' },
    { label: 'Potential', value: topic.potential, color: 'bg-emerald-600' },
  ];
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{topic.discipline}</span>
        <span className={['rounded-full px-3 py-1 text-xs font-semibold capitalize', stageStyles[topic.adoptionStage]].join(' ')}>
          {topic.adoptionStage}
        </span>
      </div>
      <h3
        className={[
          'mt-3 font-semibold text-slate-900',
          featured ? 'text-2xl leading-8' : 'text-lg leading-7',
        ].join(' ')}
      >
        {topic.topic}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{topic.description}</p>
      <div className="mt-4 space-y-3">
        {metrics.map((metric) => (
          <div key={metric.label}>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium uppercase tracking-[0.2em]">{metric.label}</span>
              <span className="font-semibold">{metric.value}/100</span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div className={['h-full rounded-full', metric.color].join(' ')} style={{ width: `${metric.value}%` }} />
            </div>
          </div>
        ))}
      </div>
      {topic.sources.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
          {topic.sources.map((source) => (
            <span key={source.entityType} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-slate-600">
              {entityTypeIcon(source.entityType)} {entityTypeLabel(source.entityType)} · {source.count}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}
