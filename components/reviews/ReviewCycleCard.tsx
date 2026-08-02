import { ReviewKindBadge } from './ReviewBadges';
import { formatNumber, formatRelative } from './format';
import type { ReviewCycle, ReviewCycleStatus } from '@/types/reviews';

export function cycleStatusVariant(status: ReviewCycleStatus): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (status) {
    case 'completed':
      return 'success';
    case 'in-progress':
      return 'info';
    case 'open':
      return 'warning';
    default:
      return 'default';
  }
}

export function formatCycleStatus(status: ReviewCycleStatus): string {
  switch (status) {
    case 'completed':
      return 'Completed';
    case 'in-progress':
      return 'In Progress';
    case 'open':
      return 'Open';
    default:
      return 'Cancelled';
  }
}

type ReviewCycleCardProps = {
  cycle: ReviewCycle;
};

export function ReviewCycleCard({ cycle }: ReviewCycleCardProps) {
  const completed = cycle.reviews.filter((review) => review.status === 'completed').length;
  const voiceNotes = cycle.reviews.reduce((total, review) => total + review.voiceNotes.length, 0);

  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {cycle.sourceId ?? cycle.artefactId ?? cycle.id} — Round {cycle.round}
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Opened {formatRelative(cycle.openedAt)}
            {cycle.closedAt ? <> · closed {formatRelative(cycle.closedAt)}</> : null}
          </p>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-bold ${
            cycleStatusVariant(cycle.status) === 'success'
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
              : cycleStatusVariant(cycle.status) === 'danger'
                ? 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
          }`}
        >
          {formatCycleStatus(cycle.status)}
        </span>
      </div>

      {cycle.sourceEntity && (
        <p className="mt-2 text-xs text-slate-400">
          Source: <span className="font-semibold text-slate-600 dark:text-slate-300">{cycle.sourceEntity}</span>
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {cycle.reviews.map((review) => (
          <ReviewKindBadge key={review.id} kind={review.kind} />
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-400 dark:border-slate-800">
        <span>🔬 {formatNumber(cycle.reviews.length)} reviews ({formatNumber(completed)} completed)</span>
        <span>🎙️ {formatNumber(voiceNotes)} voice notes</span>
        <span>🔄 Round {cycle.round}</span>
      </div>
    </article>
  );
}
