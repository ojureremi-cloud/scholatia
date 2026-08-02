import Badge from '@/components/ui/Badge';
import { formatDate, formatDiscussionStatus, formatDiscussionStatusIcon } from './format';
import type { CollaborationWorkspace } from '@/types/collaboration';

type WorkspaceDiscussionsProps = {
  workspace: CollaborationWorkspace;
};

export function WorkspaceDiscussions({ workspace }: WorkspaceDiscussionsProps) {
  if (workspace.discussions.length === 0) {
    return <p className="text-sm text-slate-400">No discussions open in this workspace.</p>;
  }

  return (
    <ul className="space-y-3">
      {workspace.discussions.map((discussion) => (
        <li
          key={discussion.id}
          className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
        >
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{discussion.title}</p>
            <Badge variant={discussion.status === 'open' ? 'info' : discussion.status === 'resolved' ? 'success' : 'default'}>
              {formatDiscussionStatusIcon(discussion.status)} {formatDiscussionStatus(discussion.status)}
            </Badge>
          </div>
          {discussion.body && (
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{discussion.body}</p>
          )}
          <p className="mt-1 text-xs text-slate-400">
            {discussion.authorName ?? discussion.author} · opened {formatDate(discussion.createdAt)} ·{' '}
            {discussion.replies.length} repl{discussion.replies.length === 1 ? 'y' : 'ies'}
          </p>
        </li>
      ))}
    </ul>
  );
}
