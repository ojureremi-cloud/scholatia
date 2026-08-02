import Badge from '@/components/ui/Badge';
import { formatDate, formatInvitationStatus, formatInvitationStatusIcon, formatRole, formatRoleIcon } from './format';
import type { CollaborationWorkspace } from '@/types/collaboration';

type WorkspaceInvitationsProps = {
  workspace: CollaborationWorkspace;
};

export function WorkspaceInvitations({ workspace }: WorkspaceInvitationsProps) {
  if (workspace.invitations.length === 0) {
    return <p className="text-sm text-slate-400">No invitations in flight for this workspace.</p>;
  }

  return (
    <ul className="space-y-3">
      {workspace.invitations.map((invitation) => (
        <li
          key={invitation.id}
          className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
        >
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {invitation.inviteeName ?? invitation.invitee}
            </p>
            <Badge variant="default">
              {formatRoleIcon(invitation.role)} {formatRole(invitation.role)}
            </Badge>
            <Badge variant={invitation.status === 'pending' ? 'warning' : invitation.status === 'accepted' ? 'success' : invitation.status === 'declined' ? 'danger' : 'default'}>
              {formatInvitationStatusIcon(invitation.status)} {formatInvitationStatus(invitation.status)}
            </Badge>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            invited by {invitation.invitedByName ?? invitation.invitedBy} · {formatDate(invitation.createdAt)}
          </p>
        </li>
      ))}
    </ul>
  );
}
