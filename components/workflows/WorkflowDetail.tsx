'use client';

import { useWorkflow } from '@/hooks';
import { Button } from '@/components/ui';
import { WorkflowBadge } from './WorkflowBadge';
import { WorkflowDeadlines } from './WorkflowDeadlines';
import { WorkflowMilestones } from './WorkflowMilestones';
import { WorkflowPriorityBadge } from './WorkflowPriorityBadge';
import { WorkflowStages } from './WorkflowStages';
import { WorkflowStatusBadge } from './WorkflowStatusBadge';
import { WorkflowTimeline } from './WorkflowTimeline';
import { formatDate, formatRelative } from './format';

type WorkflowDetailProps = {
  workflowId: string;
};

export function WorkflowDetail({ workflowId }: WorkflowDetailProps) {
  const { workflowById, submitForReview, requestRevision, submitRevision, approve, complete } = useWorkflow();
  const workflow = workflowById(workflowId);

  if (!workflow) {
    return <p className="text-sm text-slate-400">Workflow not found.</p>;
  }

  return (
    <div className="space-y-8">
      <header className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{workflow.title}</h1>
            <p className="mt-1 text-sm text-slate-400">
              {workflow.ownerName ?? workflow.owner} · created {formatDate(workflow.createdAt)} · updated {formatRelative(workflow.updatedAt)}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <WorkflowStatusBadge status={workflow.status} />
            <WorkflowBadge kind={workflow.kind} />
            <WorkflowPriorityBadge priority={workflow.priority} />
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{workflow.description}</p>

        {workflow.sourceTitle && (
          <p className="mt-3 text-xs text-slate-400">
            Source: <span className="font-semibold text-slate-600 dark:text-slate-300">{workflow.sourceTitle}</span>
            <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
              {workflow.sourceEntity}
            </span>
            <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
              {workflow.sourceId}
            </span>
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-6 dark:border-slate-800">
          {workflow.status === 'in-progress' && (
            <Button size="sm" onClick={() => submitForReview(workflow.id)}>
              Submit for review
            </Button>
          )}
          {workflow.status === 'awaiting-review' && (
            <Button size="sm" onClick={() => requestRevision(workflow.id, 'Revision requested by the reviewer.')}>
              Request revision
            </Button>
          )}
          {workflow.status === 'revision-requested' && (
            <Button size="sm" onClick={() => submitRevision(workflow.id)}>
              Submit revision
            </Button>
          )}
          {workflow.status === 'awaiting-review' && (
            <Button size="sm" variant="secondary" onClick={() => approve(workflow.id, 'Approved by the current user.')}>
              Approve
            </Button>
          )}
          {workflow.status === 'approved' && (
            <Button size="sm" onClick={() => complete(workflow.id)}>
              Mark completed
            </Button>
          )}
        </div>
      </header>

      <section>
        <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Stages</h2>
        <WorkflowStages stages={workflow.stages} currentStageId={workflow.currentStageId} />
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Deadlines</h2>
          <WorkflowDeadlines deadlines={workflow.deadlines} />
        </section>
        <section>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Milestones</h2>
          <WorkflowMilestones milestones={workflow.milestones} />
        </section>
      </div>

      <section>
        <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Audit trail</h2>
        <WorkflowTimeline log={workflow.log} />
      </section>
    </div>
  );
}
