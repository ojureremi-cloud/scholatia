import type { KGEntity } from '@/types/crie';
import { Panel, ProgressBar, Chip } from '../primitives';
import { formatDate, formatNumber, kgEntityClassIcon, kgEntityClassLabel, kgEntityLabel } from '../format';

type EntityTimelineProps = {
  entities: KGEntity[];
};

export function EntityTimeline({ entities }: EntityTimelineProps) {
  const sorted = [...entities].sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  return (
    <Panel eyebrow="Research Knowledge Graph" title="Entity arrival timeline" icon="📅">
      {sorted.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">No entities to show.</p>
      ) : (
        <ol className="relative space-y-6 border-l border-slate-200 pl-6 dark:border-slate-700">
          {sorted.map((entity) => (
            <li key={entity.crieId} className="relative">
              <span
                className="absolute -left-[1.85rem] flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-xs dark:bg-sky-950"
                aria-hidden="true"
              >
                {kgEntityClassIcon(entity.entityClass)}
              </span>
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{kgEntityLabel(entity)}</p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {kgEntityClassLabel(entity.entityClass)} · {entity.crieId}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Chip tone="info">{formatDate(entity.createdAt)}</Chip>
                    <span className="text-xs text-slate-400">v{entity.version}</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex-1">
                    <ProgressBar percent={entity.confidence.value * 100} label={`${kgEntityLabel(entity)} confidence`} />
                  </div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {formatNumber(Math.round(entity.confidence.value * 100))}%
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </Panel>
  );
}
