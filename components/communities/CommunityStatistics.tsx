import StatisticCard from '@/components/ui/StatisticCard';
import { formatNumber } from './format';
import type { CommunityStatistics } from '@/types/communities';

type CommunityStatisticsProps = {
  statistics: CommunityStatistics;
};

export function CommunityStatistics({ statistics }: CommunityStatisticsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
      <StatisticCard title="Communities" value={formatNumber(statistics.totalCommunities)} icon="🌍" />
      <StatisticCard title="Members" value={formatNumber(statistics.totalMembers)} icon="👥" />
      <StatisticCard title="Followers" value={formatNumber(statistics.totalFollowers)} icon="🔔" />
      <StatisticCard title="Discussions" value={formatNumber(statistics.totalDiscussions)} icon="💬" />
      <StatisticCard title="Questions" value={formatNumber(statistics.totalQuestions)} icon="❓" />
      <StatisticCard title="Answers" value={formatNumber(statistics.totalAnswers)} icon="✅" />
      <StatisticCard title="Resources" value={formatNumber(statistics.totalResources)} icon="📚" />
      <StatisticCard title="Events" value={formatNumber(statistics.totalEvents)} icon="📅" />
      <StatisticCard title="Polls" value={formatNumber(statistics.totalPolls)} icon="🗳️" />
      <StatisticCard title="Opportunities" value={formatNumber(statistics.totalOpportunities)} icon="💼" />
    </div>
  );
}
