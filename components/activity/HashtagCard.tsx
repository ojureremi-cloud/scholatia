import { formatNumber } from './format';

type Hashtag = { tag: string; count: number };

type HashtagCardProps = {
  hashtag: Hashtag;
};

export function HashtagCard({ hashtag }: HashtagCardProps) {
  return (
    <a
      href="#"
      className="block rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-sky-400 dark:border-slate-700 dark:bg-slate-900"
    >
      <p className="text-sm font-bold text-sky-600 dark:text-sky-400">#{hashtag.tag}</p>
      <p className="mt-1 text-xs text-slate-400">
        {formatNumber(hashtag.count)} activity{hashtag.count === 1 ? '' : 'ies'}
      </p>
    </a>
  );
}
