import type { Annotation } from '@/types/annotations';
import { annotationAnalytics, annotationsByStatus } from '@/lib/annotations';

type AnnotationInsightsProps = {
  annotations: Annotation[];
};

export function AnnotationInsights({ annotations }: AnnotationInsightsProps) {
  const analytics = annotationAnalytics(annotations);
  const open = annotationsByStatus(annotations, 'open').length;
  const pending = annotationsByStatus(annotations, 'pending').length;
  const needsAction = open + pending;

  const authorCounts = new Map<string, number>();
  annotations.forEach((annotation) => {
    authorCounts.set(annotation.authorName, (authorCounts.get(annotation.authorName) ?? 0) + 1);
  });
  const topContributor = [...authorCounts.entries()].sort((a, b) => b[1] - a[1])[0];

  const topSource = analytics.bySource[0];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
        <p className="text-2xl">{needsAction}</p>
        <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">
          annotations need action (open or pending) — replies and decisions keep the thread moving.
        </p>
      </div>
      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
        <p className="text-2xl">
          {topContributor ? `${topContributor[0].split(' ').pop()}` : '—'}
        </p>
        <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">
          is the most active annotator with {topContributor ? topContributor[1] : 0} annotations.
        </p>
      </div>
      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
        <p className="text-2xl">{analytics.suggestionRate}%</p>
        <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">
          of annotations are review suggestions — the rest are notes, questions, and observations.
        </p>
      </div>
      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
        <p className="text-lg">
          {topSource ? `${topSource.sourceEntity} · ${topSource.sourceId}` : '—'}
        </p>
        <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">
          is the most-annotated source with {topSource ? topSource.count : 0} comments and replies.
        </p>
      </div>
    </div>
  );
}
