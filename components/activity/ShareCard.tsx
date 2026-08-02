import { formatRelative } from './format';
import type { ActivityShare } from '@/types/activity';

type ShareCardProps = {
  share: ActivityShare;
};

const platformLabels: Record<ActivityShare['platform'], string> = {
  scholatia: 'shared on Scholatia',
  linkedin: 'shared on LinkedIn',
  twitter: 'shared on X',
  facebook: 'shared on Facebook',
  email: 'shared via email',
};

export function ShareCard({ share }: ShareCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
      <span className="text-xl">👤</span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{share.sharedByName}</p>
        <p className="text-xs text-slate-400">
          {platformLabels[share.platform]} · {formatRelative(share.sharedAt)}
        </p>
      </div>
      <span aria-hidden>🔁</span>
    </div>
  );
}
