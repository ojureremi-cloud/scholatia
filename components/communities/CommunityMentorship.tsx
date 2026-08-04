import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import {
  formatDate,
  formatMentorshipStatus,
  formatMentorshipStatusIcon,
  mentorshipStatusVariant,
} from './format';
import type { Community } from '@/types/communities';

type CommunityMentorshipProps = {
  community: Community;
};

export function CommunityMentorship({ community }: CommunityMentorshipProps) {
  const mentors = community.mentors;
  const pairings = community.mentorships;

  if (mentors.length === 0 && pairings.length === 0) {
    return <p className="text-sm text-slate-400">No mentorship programmes active in this community yet.</p>;
  }

  return (
    <div className="space-y-6">
      {mentors.length > 0 && (
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Designated mentors</h4>
          <ul className="mt-3 space-y-2">
            {mentors.map((person) => (
              <li key={person.username} className="flex items-center gap-3">
                <Avatar name={person.name} imageUrl={person.avatar} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{person.name}</p>
                  <p className="text-xs text-slate-400">
                    @{person.username} · joined {formatDate(person.joinedAt)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {pairings.length > 0 && (
        <ul className="space-y-3">
          {pairings.map((pairing) => (
            <li
              key={pairing.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-lg">🤝</span>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{pairing.area}</p>
                <Badge variant={mentorshipStatusVariant(pairing.status)}>
                  {formatMentorshipStatusIcon(pairing.status)} {formatMentorshipStatus(pairing.status)}
                </Badge>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                {pairing.mentorName ?? pairing.mentor} (@{pairing.mentor}) mentoring{' '}
                {pairing.menteeName ?? pairing.mentee} (@{pairing.mentee})
                {pairing.startedAt ? ` · started ${formatDate(pairing.startedAt)}` : ''}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
