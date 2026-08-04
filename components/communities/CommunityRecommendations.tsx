import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { COMMUNITIES } from '@/constants/placeholder-communities';
import { communityUrl } from '@/lib/communities';
import { formatCategoryIcon } from './format';
import type { CommunityRecommendation } from '@/types/communities';

type CommunityRecommendationsProps = {
  recommendations: CommunityRecommendation[];
};

export function CommunityRecommendations({ recommendations }: CommunityRecommendationsProps) {
  if (recommendations.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400 dark:border-slate-700">
        No recommendations yet — they are derived from your research profile signals.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {recommendations.map((recommendation) => {
        const community = COMMUNITIES.find((entry) => entry.id === recommendation.communityId);
        if (!community) return null;
        return (
          <li
            key={recommendation.communityId}
            className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-lg dark:bg-slate-800">
                {community.profileImage ?? formatCategoryIcon(community.category)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                  <a href={communityUrl(community)} className="hover:underline">
                    {community.name}
                  </a>
                </p>
                <Badge variant="info">score {recommendation.score}</Badge>
              </div>
            </div>
            {recommendation.reasons.length > 0 && (
              <ul className="mt-2 space-y-1">
                {recommendation.reasons.map((reason) => (
                  <li key={reason} className="text-xs text-slate-500 dark:text-slate-400">
                    • {reason}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-3">
              <Button size="sm" variant="outline" href={communityUrl(community)}>
                Explore community
              </Button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
