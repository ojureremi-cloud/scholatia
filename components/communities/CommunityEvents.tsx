import Badge from '@/components/ui/Badge';
import {
  eventStatusVariant,
  formatDateTime,
  formatEventMode,
  formatEventStatus,
  formatEventStatusIcon,
  formatEventType,
  formatEventTypeIcon,
} from './format';
import type { Community } from '@/types/communities';

type CommunityEventsProps = {
  community: Community;
};

export function CommunityEvents({ community }: CommunityEventsProps) {
  if (community.events.length === 0) {
    return <p className="text-sm text-slate-400">No events scheduled for this community.</p>;
  }

  return (
    <ul className="space-y-3">
      {community.events.map((event) => (
        <li
          key={event.id}
          className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-lg">{formatEventTypeIcon(event.type)}</span>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{event.title}</p>
            <Badge variant="default">{formatEventType(event.type)}</Badge>
            <Badge variant="default">{formatEventMode(event.mode)}</Badge>
            <Badge variant={eventStatusVariant(event.status)}>
              {formatEventStatusIcon(event.status)} {formatEventStatus(event.status)}
            </Badge>
          </div>
          {event.description && (
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{event.description}</p>
          )}
          <p className="mt-1 text-xs text-slate-400">
            {formatDateTime(event.scheduledAt)}
            {event.durationHours ? ` · ${event.durationHours}h` : ''}
            {event.location ? ` · ${event.location}` : ''}
          </p>
          {event.speakers.length > 0 && (
            <p className="mt-1 text-xs text-slate-400">
              Speakers: {event.speakers.map((speaker) => `@${speaker}`).join(', ')}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
