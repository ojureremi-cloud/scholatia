import React from 'react';
import StatisticCard from '@/components/ui/StatisticCard';
import { entityTypeLabel } from './format';
import type { VerificationEngineSummary } from '@/types/trust';

type VerificationEngineSummaryProps = {
  summary: VerificationEngineSummary;
};

export default function VerificationEngineSummary({ summary }: VerificationEngineSummaryProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatisticCard
        icon="🛡️"
        title="Verified records"
        value={String(summary.verified)}
        trend={`${summary.trusted} trusted · ${summary.pending} pending`}
        trendPositive
      />
      <StatisticCard
        icon="✅"
        title="Trusted entities"
        value={String(summary.trusted)}
        trend={`of ${summary.totalRecords} total records`}
        trendPositive
      />
      <StatisticCard
        icon="⏳"
        title="Pending verification"
        value={String(summary.pending)}
        trend={`${summary.revoked} revoked`}
        trendPositive={summary.revoked === 0}
      />
      <StatisticCard
        icon="🗂️"
        title="By entity type"
        value={String(summary.byEntityType.length)}
        trend={summary.byEntityType.map((entry) => entityTypeLabel(entry.entityType)).join(' · ')}
        trendPositive
      />
    </div>
  );
}
