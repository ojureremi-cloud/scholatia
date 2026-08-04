import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import { communityFlattenedReplies, communityThreadDepth } from '@/lib/communities';
import { discussionStatusVariant, formatDate, formatDiscussionStatus, formatDiscussionStatusIcon } from './format';
import type { Community, CommunityReply } from '@/types/communities';

type CommunityDiscussionProps = {
  community: Community;
};

export function CommunityDiscussion({ community }: CommunityDiscussionProps) {
  if (community.discussions.length === 0) {
    return <p className="text-sm text-slate-400">No discussions open in this community.</p>;
  }

  return (
    <ul className="space-y-3">
      {community.discussions.map((discussion) => (
        <li
          key={discussion.id}
          className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
        >
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{discussion.title}</p>
            {discussion.pinned && <Badge variant="warning">📌 Pinned</Badge>}
            <Badge variant={discussionStatusVariant(discussion.status)}>
              {formatDiscussionStatusIcon(discussion.status)} {formatDiscussionStatus(discussion.status)}
            </Badge>
            {discussion.reportCount > 0 && <Badge variant="danger">🚩 {discussion.reportCount}</Badge>}
          </div>
          {discussion.body && (
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{discussion.body}</p>
          )}
          <p className="mt-1 text-xs text-slate-400">
            {discussion.authorName ?? discussion.author} · opened {formatDate(discussion.createdAt)} ·{' '}
            {discussion.replies.length} repl{discussion.replies.length === 1 ? 'y' : 'ies'} · depth{' '}
            {communityThreadDepth(discussion)}
          </p>
          {discussion.replies.length > 0 && (
            <ReplyTree replies={communityFlattenedReplies(discussion)} />
          )}
        </li>
      ))}
    </ul>
  );
}

type ReplyTreeProps = {
  replies: CommunityReply[];
};

function ReplyTree({ replies }: ReplyTreeProps) {
  return (
    <ul className="mt-3 space-y-2 border-l-2 border-slate-100 pl-4 dark:border-slate-800">
      {replies.map((reply) => (
        <li key={reply.id} className="text-sm">
          <div className="flex items-start gap-2">
            <Avatar name={reply.authorName ?? reply.author} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-slate-600 dark:text-slate-300">{reply.body}</p>
              <p className="mt-0.5 text-xs text-slate-400">
                {reply.authorName ?? reply.author} · {formatDate(reply.createdAt)}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
