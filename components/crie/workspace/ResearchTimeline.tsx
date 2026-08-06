import { LIFECYCLE_STAGE_IDS } from '@/types/crie';
import type { LifecycleStageId } from '@/types/crie';
import { lifecycleStageIcon, lifecycleStageLabel } from '../format';

type ResearchTimelineProps = {
  currentStage: LifecycleStageId;
};

export function ResearchTimeline({ currentStage }: ResearchTimelineProps) {
  const currentIndex = LIFECYCLE_STAGE_IDS.indexOf(currentStage);

  return (
    <section aria-label="Research lifecycle" className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Lifecycle</h3>
      <ol className="mt-6 flex flex-wrap items-start gap-2">
        {LIFECYCLE_STAGE_IDS.map((stage, index) => {
          const reached = index <= currentIndex;
          const isCurrent = stage === currentStage;
          return (
            <li key={stage} className="flex items-center gap-2">
              <div
                aria-current={isCurrent ? 'step' : undefined}
                className={[
                  'flex flex-col items-center gap-1 rounded-2xl px-3 py-2 text-center transition',
                  isCurrent
                    ? 'bg-sky-50 ring-2 ring-sky-500 dark:bg-sky-950'
                    : reached
                      ? 'bg-emerald-50 dark:bg-emerald-950'
                      : 'bg-slate-50 dark:bg-slate-800',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <span className="text-lg" aria-hidden="true">{lifecycleStageIcon(stage)}</span>
                <span
                  className={[
                    'text-[11px] font-semibold',
                    isCurrent
                      ? 'text-sky-700 dark:text-sky-300'
                      : reached
                        ? 'text-emerald-700 dark:text-emerald-300'
                        : 'text-slate-400',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {lifecycleStageLabel(stage)}
                </span>
              </div>
              {index < LIFECYCLE_STAGE_IDS.length - 1 ? (
                <span className="text-slate-300 dark:text-slate-600" aria-hidden="true">→</span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
