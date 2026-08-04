import Badge from '@/components/ui/Badge';
import { formatDate } from './format';
import { CommunityAnswer } from './CommunityAnswer';
import { communityAnswerCount } from '@/lib/communities';
import type { Community } from '@/types/communities';

type CommunityQuestionProps = {
  community: Community;
};

const questionStatusVariant: Record<'open' | 'answered' | 'closed', 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  open: 'info',
  answered: 'success',
  closed: 'default',
};

export function CommunityQuestion({ community }: CommunityQuestionProps) {
  if (community.questions.length === 0) {
    return <p className="text-sm text-slate-400">No questions asked in this community yet.</p>;
  }

  return (
    <ul className="space-y-3">
      {community.questions.map((question) => (
        <li
          key={question.id}
          className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
        >
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{question.title}</p>
            <Badge variant={questionStatusVariant[question.status]}>{question.status}</Badge>
          </div>
          {question.body && (
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{question.body}</p>
          )}
          <p className="mt-1 text-xs text-slate-400">
            {question.authorName ?? question.author} · asked {formatDate(question.createdAt)} ·{' '}
            {communityAnswerCount(question)} answer{communityAnswerCount(question) === 1 ? '' : 's'}
          </p>
          {question.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {question.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
          {question.answers.length > 0 && (
            <div className="mt-3 space-y-2 border-l-2 border-slate-100 pl-4 dark:border-slate-800">
              {question.answers.map((answer) => (
                <CommunityAnswer key={answer.id} question={question} answer={answer} />
              ))}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
