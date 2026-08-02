import Badge from '@/components/ui/Badge';
import { formatDateTime, formatMeetingStatus, formatMeetingStatusIcon } from './format';
import type { CollaborationWorkspace } from '@/types/collaboration';

type WorkspaceMeetingsProps = {
  workspace: CollaborationWorkspace;
};

export function WorkspaceMeetings({ workspace }: WorkspaceMeetingsProps) {
  if (workspace.meetings.length === 0) {
    return <p className="text-sm text-slate-400">No meetings scheduled for this workspace.</p>;
  }

  return (
    <ul className="space-y-3">
      {workspace.meetings.map((meeting) => (
        <li
          key={meeting.id}
          className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
        >
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{meeting.title}</p>
            <Badge variant={meeting.status === 'scheduled' ? 'info' : meeting.status === 'completed' ? 'success' : 'default'}>
              {formatMeetingStatusIcon(meeting.status)} {formatMeetingStatus(meeting.status)}
            </Badge>
          </div>
          <p className="mt-1 text-xs text-slate-400">{formatDateTime(meeting.scheduledAt)}</p>
          {meeting.agenda && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{meeting.agenda}</p>}
          <p className="mt-1 text-xs text-slate-400">
            Attendees: {meeting.attendees.length > 0 ? meeting.attendees.map((attendee) => `@${attendee}`).join(', ') : '—'}
          </p>
        </li>
      ))}
    </ul>
  );
}
