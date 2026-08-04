import { CommunityCard } from './CommunityCard';
import type { Community } from '@/types/communities';

type CommunityGridProps = {
  communities: Community[];
};

export function CommunityGrid({ communities }: CommunityGridProps) {
  if (communities.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400 dark:border-slate-700">
        No communities match your current filters.
      </p>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {communities.map((community) => (
        <CommunityCard key={community.id} community={community} />
      ))}
    </div>
  );
}
