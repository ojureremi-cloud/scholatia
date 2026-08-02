import { WorkflowBadge } from './WorkflowBadge';
import { WorkflowPriorityBadge } from './WorkflowPriorityBadge';
import { WorkflowStatusBadge } from './WorkflowStatusBadge';
import { formatNumber, formatRelative } from './format';
import { completedStages, workflowProgress, workflowUrl } from '@/lib/workflows';
import type { WorkflowInstance } from '@/types/workflows';

type WorkflowCardProps = {
  workflow: WorkflowInstance;
};

export function WorkflowCard({ workflow }: WorkflowCardProps) {
  const progress = Math.round(workflowProgress(workflow) * 100);

  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            <a href={workflowUrl(workflow)} className="hover:underline">
              {workflow.title}
            </a>
          </h3>
          <p className="text-xs text-slate-400">
            {workflow.ownerName ?? workflow.owner} · updated {formatRelative(workflow.updatedAt)}
          </p>
        </div>
        <WorkflowStatusBadge status={workflow.status} />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <WorkflowBadge kind={workflow.kind} />
        <WorkflowPriorityBadge priority={workflow.priority} />
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{workflow.description}</p>

      {workflow.sourceTitle && (
        <p className="mt-2 text-xs text-slate-400">
          Source: <span className="font-semibold text-slate-600 dark:text-slate-300">{workflow.sourceTitle}</span>
        </p>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-400 dark:border-slate-800">
        <span>📈 {formatNumber(progress)}% complete</span>
        <span>🧩 {formatNumber(completedStages(workflow))}/{formatNumber(workflow.stages.length)} stages</span>
        <span>🏷️ {formatNumber(workflow.milestones.filter((milestone) => milestone.status === 'achieved').length)}/{formatNumber(workflow.milestones.length)} milestones</span>
      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div className="h-full rounded-full bg-sky-500" style={{ width: `${progress}%` }} />
      </div>
    </article>
  );
}
