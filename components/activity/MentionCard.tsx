import Badge from '@/components/ui/Badge';
import type { ActivityMention } from '@/types/activity';

type MentionCardProps = {
  mention: ActivityMention;
};

export function MentionCard({ mention }: MentionCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
      <span className="text-xl">🧑‍🔬</span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{mention.name}</p>
        <p className="text-xs text-slate-400">
          {mention.username ?? mention.userId ?? 'member'} mentioned via{' '}
          <span className="font-medium">{mention.entityId ?? '—'}</span>
        </p>
      </div>
      <Badge variant="info">{mention.entityType ?? 'researcher'}</Badge>
    </div>
  );
}
