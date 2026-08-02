import { Badge } from '@/components/ui';
import { formatDate, formatMilestoneStatus, formatMilestoneStatusIcon, milestoneVariant } from './format';
import type { WorkflowMilestone } from '@/types/workflows';

type WorkflowMilestonesProps = {
  milestones: WorkflowMilestone[];
};

export function WorkflowMilestones({ milestones }: WorkflowMilestonesProps) {
  if (milestones.length === 0) {
    return <p className="text-sm text-slate-400">No milestones defined for this workflow.</p>;
  }
  return (
    <ul className="space-y-3">
      {milestones.map((milestone) => (
        <li key={milestone.id} className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{milestone.title}</p>
            <p className="text-xs text-slate-400">
              Stage: <span className="font-semibold text-slate-600 dark:text-slate-300">{milestone.stageId}</span>
              {milestone.targetDate ? <> · Target {formatDate(milestone.targetDate)}</> : null}
            </p>
            {milestone.achievedAt && <p className="mt-1 text-xs text-emerald-600">Achieved {formatDate(milestone.achievedAt)}</p>}
          </div>
          <Badge variant={milestoneVariant(milestone.status)}>
            {formatMilestoneStatusIcon(milestone.status)} {formatMilestoneStatus(milestone.status)}
          </Badge>
        </li>
      ))}
    </ul>
  );
}
