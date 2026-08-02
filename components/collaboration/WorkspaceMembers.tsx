import Badge from '@/components/ui/Badge';
import { formatDate, formatRole, formatRoleIcon, initialsOf, roleVariant } from './format';
import { activeMembers } from '@/lib/collaboration';
import type { CollaborationWorkspace } from '@/types/collaboration';

type WorkspaceMembersProps = {
  workspace: CollaborationWorkspace;
};

export function WorkspaceMembers({ workspace }: WorkspaceMembersProps) {
  const members = activeMembers(workspace);

  return (
    <div className="space-y-3">
      {members.map((member) => (
        <div
          key={member.username}
          className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {member.avatar ?? initialsOf(member.name)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{member.name}</p>
            <p className="text-xs text-slate-400">
              @{member.username} · joined {formatDate(member.joinedAt)}
            </p>
          </div>
          <Badge variant={roleVariant(member.role)}>
            {formatRoleIcon(member.role)} {formatRole(member.role)}
          </Badge>
        </div>
      ))}
    </div>
  );
}
