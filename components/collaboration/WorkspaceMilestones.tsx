import Badge from '@/components/ui/Badge';
import { formatDate, formatMilestoneStatus, formatMilestoneStatusIcon } from './format';
import type { CollaborationWorkspace } from '@/types/collaboration';

type WorkspaceMilestonesProps = {
  workspace: CollaborationWorkspace;
};

export function WorkspaceMilestones({ workspace }: WorkspaceMilestonesProps) {
  if (workspace.milestones.length === 0) {
    return <p className="text-sm text-slate-400">No milestones tracked for this workspace yet.</p>;
  }

  return (
    <ul className="space-y-3">
      {workspace.milestones.map((milestone) => (
        <li
          key={milestone.id}
          className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
        >
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{milestone.title}</p>
            <Badge variant={milestone.status === 'achieved' ? 'success' : milestone.status === 'in-progress' ? 'info' : 'default'}>
              {formatMilestoneStatusIcon(milestone.status)} {formatMilestoneStatus(milestone.status)}
            </Badge>
          </div>
          {milestone.description && (
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{milestone.description}</p>
          )}
          <p className="mt-1 text-xs text-slate-400">
            {milestone.stageId ? `Lifecycle stage: ${milestone.stageId} · ` : ''}target {formatDate(milestone.targetDate)}
            {milestone.achievedAt ? ` · achieved ${formatDate(milestone.achievedAt)}` : ''}
          </p>
        </li>
      ))}
    </ul>
  );
}
