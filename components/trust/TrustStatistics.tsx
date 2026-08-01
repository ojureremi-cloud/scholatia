import React from 'react';
import StatisticCard from '@/components/ui/StatisticCard';
import { formatPercent, formatTierLabel } from './format';
import type { TrustStatistics } from '@/types/trust';

type TrustStatisticsProps = {
  statistics: TrustStatistics;
};

export default function TrustStatistics({ statistics }: TrustStatisticsProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatisticCard
        icon="🛡️"
        title="Verified records"
        value={String(statistics.totalVerifiedRecords)}
        trend={`${statistics.trustedEntities} trusted entities`}
        trendPositive
      />
      <StatisticCard
        icon="🏅"
        title="Badges awarded"
        value={String(statistics.totalBadges)}
        trend={statistics.badgesByTier.map((entry) => `${formatTierLabel(entry.tier)} ${entry.count}`).join(' · ')}
        trendPositive
      />
      <StatisticCard
        icon="📋"
        title="Peer review"
        value={String(statistics.completedReviews)}
        trend={`${statistics.activeReviewAssignments} active assignments`}
        trendPositive
      />
      <StatisticCard
        icon="🔍"
        title="Integrity events"
        value={String(statistics.integrityEvents)}
        trend={`${statistics.resolvedIntegrityEvents} resolved`}
        trendPositive
      />
      <StatisticCard
        icon="🆔"
        title="ORCID linked"
        value={String(statistics.orcidLinkedResearchers)}
        trend={`${statistics.trackedResearchers} tracked researchers`}
        trendPositive
      />
      <StatisticCard
        icon="🏛️"
        title="Verified institutions"
        value={String(statistics.verifiedInstitutions)}
        trend={`${statistics.verifiedJournals} journals`}
        trendPositive
      />
      <StatisticCard
        icon="🎪"
        title="Verified conferences"
        value={String(statistics.verifiedConferences)}
        trend={`${statistics.verifiedPublishers} publishers`}
        trendPositive
      />
      <StatisticCard
        icon="📊"
        title="Average trust score"
        value={formatPercent(statistics.avgTrustScore)}
        trend={`JQI ${statistics.avgJournalQuality} · CQI ${statistics.avgConferenceQuality}`}
        trendPositive
      />
    </div>
  );
}
