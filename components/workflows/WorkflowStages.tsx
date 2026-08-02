import { Badge } from '@/components/ui';
import { formatRole, formatStageKind, formatStageKindIcon, formatStageStatus, formatDate, stageStatusVariant } from './format';
import type { WorkflowStage } from '@/types/workflows';

type WorkflowStagesProps = {
  stages: WorkflowStage[];
  currentStageId?: string;
};

export function WorkflowStages({ stages, currentStageId }: WorkflowStagesProps) {
  const ordered = [...stages].sort((a, b) => a.order - b.order);
  return (
    <ol className="space-y-3">
      {ordered.map((stage) => {
        const isCurrent = stage.id === currentStageId;
        return (
          <li
            key={stage.id}
            className={[
              'rounded-2xl border p-4 transition',
              isCurrent
                ? 'border-sky-300 bg-sky-50 dark:border-sky-700 dark:bg-sky-950'
                : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
            ].join(' ')}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-base dark:bg-slate-800">
                  {formatStageKindIcon(stage.kind)}
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {stage.order}. {stage.name}
                    {isCurrent && <span className="ml-2 rounded-full bg-sky-500 px-2 py-0.5 text-[10px] font-bold text-white">CURRENT</span>}
                  </p>
                  <p className="text-xs text-slate-400">
                    {formatStageKind(stage.kind)} · {formatRole(stage.role)}
                  </p>
                  {stage.description && <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">{stage.description}</p>}
                  {stage.dueAt && <p className="mt-1 text-xs text-slate-400">Due {formatDate(stage.dueAt)}</p>}
                </div>
              </div>
              <Badge variant={stageStatusVariant(stage.status)}>{formatStageStatus(stage.status)}</Badge>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
