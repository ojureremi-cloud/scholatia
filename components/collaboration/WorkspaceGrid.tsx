import { WorkspaceCard } from './WorkspaceCard';
import type { CollaborationWorkspace } from '@/types/collaboration';

type WorkspaceGridProps = {
  workspaces: CollaborationWorkspace[];
};

export function WorkspaceGrid({ workspaces }: WorkspaceGridProps) {
  if (workspaces.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400 dark:border-slate-700">
        No workspaces match your current filters.
      </p>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {workspaces.map((workspace) => (
        <WorkspaceCard key={workspace.id} workspace={workspace} />
      ))}
    </div>
  );
}
