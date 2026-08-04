import Badge from '@/components/ui/Badge';
import { formatDate, formatNumber, formatPollStatus, formatPollStatusIcon, pollStatusVariant } from './format';
import type { Community, CommunityPoll } from '@/types/communities';

type CommunityPollsProps = {
  community: Community;
};

export function CommunityPolls({ community }: CommunityPollsProps) {
  if (community.polls.length === 0) {
    return <p className="text-sm text-slate-400">No polls have been run in this community yet.</p>;
  }

  return (
    <ul className="space-y-3">
      {community.polls.map((poll) => (
        <PollCard key={poll.id} poll={poll} />
      ))}
    </ul>
  );
}

type PollCardProps = {
  poll: CommunityPoll;
};

function PollCard({ poll }: PollCardProps) {
  const total = Object.values(poll.votes).reduce((sum, count) => sum + count, 0);

  return (
    <li className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-lg">{formatPollStatusIcon(poll.status)}</span>
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{poll.question}</p>
        <Badge variant={pollStatusVariant(poll.status)}>{formatPollStatus(poll.status)}</Badge>
      </div>
      <p className="mt-1 text-xs text-slate-400">
        {poll.authorName ?? poll.author} · {formatDate(poll.createdAt)} · {formatNumber(total)} votes
      </p>
      {poll.options.length > 0 && (
        <ul className="mt-3 space-y-2">
          {poll.options.map((option) => {
            const count = poll.votes[option] ?? 0;
            const share = total > 0 ? (count / total) * 100 : 0;
            return (
              <li key={option}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-300">{option}</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {formatNumber(count)} · {Math.round(share)}%
                  </span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className="h-2 rounded-full bg-sky-500" style={{ width: `${share}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}
