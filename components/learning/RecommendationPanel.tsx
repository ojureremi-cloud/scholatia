'use client';

import Button from '@/components/ui/Button';
import { LearningEmptyState } from './LearningEmptyState';
import {
  formatRelative,
  recommendationKindLabel,
  recommendationScopeLabel,
} from './format';
import useLearning from '@/hooks/useLearning';
import type { LearningRecommendationScope, RecommendationKind } from '@/types/learning';

export function RecommendationPanel() {
  const { recommendations, applyRecommendation, dismissRecommendation } = useLearning();
  const items = recommendations();

  if (items.length === 0) {
    return (
      <LearningEmptyState
        title="No recommendations"
        description="Personalised course, mentor, and competency recommendations will appear here."
      />
    );
  }

  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
      <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
        Recommended for you
      </h2>
      <ul className="mt-5 space-y-4">
        {items.map((item) => (
          <li key={item.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {item.source === 'engine'
                      ? recommendationScopeLabel(item.kind as LearningRecommendationScope)
                      : recommendationKindLabel(item.kind as RecommendationKind)}
                  </span>
                  {item.score !== undefined ? (
                    <span className="text-xs font-semibold text-sky-600 dark:text-sky-400">
                      score {Math.round(item.score * 100)}%
                    </span>
                  ) : null}
                  <span className="text-xs text-slate-400">{formatRelative(item.createdAt)}</span>
                </div>
                <h3 className="mt-2 text-sm font-bold text-slate-900 dark:text-slate-100">{item.title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.description}</p>
                <p className="mt-1 text-xs italic text-slate-500 dark:text-slate-400">Why: {item.reason}</p>
              </div>
              <div className="flex shrink-0 flex-col gap-2">
                {item.applied ? (
                  <Button size="sm" variant="outline" disabled>
                    Applied
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => applyRecommendation(item.id)}>
                    Apply
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={() => dismissRecommendation(item.id)}>
                  Dismiss
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
