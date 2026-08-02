import { WorkflowCard } from './WorkflowCard';
import type { WorkflowInstance } from '@/types/workflows';

type WorkflowGridProps = {
  workflows: WorkflowInstance[];
};

export function WorkflowGrid({ workflows }: WorkflowGridProps) {
  if (workflows.length === 0) {
    return (
      <div className="rounded-[1.75rem] border border-dashed border-slate-300 p-12 text-center text-sm text-slate-400 dark:border-slate-700">
        No workflows match the current view.
      </div>
    );
  }
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {workflows.map((workflow) => (
        <WorkflowCard key={workflow.id} workflow={workflow} />
      ))}
    </div>
  );
}
