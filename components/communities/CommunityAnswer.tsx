import Badge from '@/components/ui/Badge';
import { formatDate } from './format';
import type { CommunityAnswer as CommunityAnswerType, CommunityQuestion } from '@/types/communities';

type CommunityAnswerProps = {
  question: CommunityQuestion;
  answer: CommunityAnswerType;
};

export function CommunityAnswer({ question, answer }: CommunityAnswerProps) {
  return (
    <div className="text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="info">✅ Answer</Badge>
        <span className="ml-auto text-xs text-slate-400">👍 {answer.upvotes}</span>
      </div>
      <p className="mt-1 text-slate-600 dark:text-slate-300">{answer.body}</p>
      <p className="mt-0.5 text-xs text-slate-400">
        {answer.authorName ?? answer.author} · {formatDate(answer.createdAt)}
      </p>
      {question.status === 'answered' && (
        <p className="mt-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">Accepted answer</p>
      )}
    </div>
  );
}
