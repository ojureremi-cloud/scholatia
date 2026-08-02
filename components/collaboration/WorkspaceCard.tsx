import { WorkspaceBadge } from './WorkspaceBadge';
import { WorkspaceStatusBadge } from './WorkspaceStatusBadge';
import { WorkspaceVisibilityBadge } from './WorkspaceVisibilityBadge';
import { formatKindIcon, formatNumber, formatPercent, formatRelative } from './format';
import { memberCount, taskProgress, workspaceUrl } from '@/lib/collaboration';
import type { CollaborationWorkspace } from '@/types/collaboration';

type WorkspaceCardProps = {
  workspace: CollaborationWorkspace;
};

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  const progress = taskProgress(workspace);

  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xl dark:bg-slate-800">
          {formatKindIcon(workspace.kind)}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            <a href={workspaceUrl(workspace)} className="hover:underline">
              {workspace.name}
            </a>
          </h3>
          <p className="text-xs text-slate-400">
            {workspace.ownerName ?? workspace.owner} · updated {formatRelative(workspace.updatedAt)}
          </p>
        </div>
        <WorkspaceStatusBadge status={workspace.status} />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <WorkspaceBadge kind={workspace.kind} />
        <WorkspaceVisibilityBadge visibility={workspace.visibility} />
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{workspace.description}</p>

      {workspace.sourceTitle && (
        <p className="mt-2 text-xs text-slate-400">
          Source: <span className="font-semibold text-slate-600 dark:text-slate-300">{workspace.sourceTitle}</span>
        </p>
      )}

      {workspace.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {workspace.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-bold text-sky-600 dark:bg-sky-900 dark:text-sky-300"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-400 dark:border-slate-800">
        <span>👥 {formatNumber(memberCount(workspace))} members</span>
        <span>✅ {formatNumber(workspace.tasks.filter((task) => task.status === 'done').length)}/{formatNumber(workspace.tasks.length)} tasks</span>
      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div className="h-full rounded-full bg-sky-500" style={{ width: `${Math.round(progress * 100)}%` }} />
      </div>
      <p className="mt-1 text-right text-[10px] font-medium text-slate-400">{formatPercent(progress)} complete</p>
    </article>
  );
}
