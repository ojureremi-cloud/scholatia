import { CommentCard } from './CommentCard';
import type { ActivityComment } from '@/types/activity';

type CommentListProps = {
  comments: ActivityComment[];
  onReply?: (commentId: string, body: string) => void;
};

export function CommentList({ comments, onReply }: CommentListProps) {
  if (comments.length === 0) {
    return <p className="text-sm text-slate-400">No comments yet.</p>;
  }
  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} onReply={onReply} />
      ))}
    </div>
  );
}
