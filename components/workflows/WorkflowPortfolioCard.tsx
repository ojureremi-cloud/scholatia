import { WorkflowBadge } from './WorkflowBadge';
import { WorkflowStatusBadge } from './WorkflowStatusBadge';
import { formatRelative } from './format';
import { workflowProgress, workflowUrl } from '@/lib/workflows';
import type { WorkflowInstance } from '@/types/workflows';

type WorkflowPortfolioCardProps = {
  workflow: WorkflowInstance;
};

export function WorkflowPortfolioCard({ workflow }: WorkflowPortfolioCardProps) {
  const progress = Math.round(workflowProgress(workflow) * 100);
  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            <a href={workflowUrl(workflow)} className="hover:underline">
              {workflow.title}
            </a>
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            {workflow.ownerName ?? workflow.owner} · {formatRelative(workflow.updatedAt)}
          </p>
        </div>
        <WorkflowStatusBadge status={workflow.status} />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <WorkflowBadge kind={workflow.kind} />
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Progress</span>
          <span className="font-bold text-slate-600 dark:text-slate-300">{progress}%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div className="h-full rounded-full bg-sky-500" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </article>
  );
}
