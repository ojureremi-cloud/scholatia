import { GroupCard } from './GroupCard';
import type { Group } from '@/types/groups';

type GroupGridProps = {
  groups: Group[];
};

export function GroupGrid({ groups }: GroupGridProps) {
  if (groups.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400 dark:border-slate-700">
        No groups match your current filters.
      </p>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {groups.map((group) => (
        <GroupCard key={group.id} group={group} />
      ))}
    </div>
  );
}
