'use client';

import React from 'react';
import StatisticCard from '@/components/ui/StatisticCard';
import { formatAmount } from './format';
import type { FundingStatistics as FundingStatisticsData } from '@/types/funding';

type FundingStatisticsProps = {
  statistics: FundingStatisticsData;
  className?: string;
};

export default function FundingStatistics({ statistics, className = '' }: FundingStatisticsProps) {
  const cards = [
    {
      title: 'Opportunities',
      value: statistics.totalOpportunities.toString(),
      icon: '📣',
    },
    {
      title: 'Open now',
      value: statistics.openOpportunities.toString(),
      trend: `${statistics.upcomingOpportunities} upcoming`,
      trendPositive: true,
      icon: '🟢',
    },
    {
      title: 'Agencies',
      value: statistics.totalAgencies.toString(),
      icon: '🏛️',
    },
    {
      title: 'Total awarded',
      value: formatAmount(statistics.totalAwarded, statistics.currency),
      icon: '💰',
    },
    {
      title: 'Active grants',
      value: statistics.activeGrants.toString(),
      trend: `${statistics.pendingApplications} pending applications`,
      icon: '📋',
    },
    {
      title: 'Countries',
      value: statistics.totalCountries.toString(),
      trend: `${statistics.totalContinents} continents`,
      trendPositive: true,
      icon: '🌍',
    },
    {
      title: 'Disciplines',
      value: statistics.totalDisciplines.toString(),
      icon: '🧬',
    },
    {
      title: 'Avg award size',
      value: formatAmount(statistics.averageAwardSize, statistics.currency),
      icon: '🎯',
    },
  ];

  return (
    <div className={['grid gap-6 sm:grid-cols-2 lg:grid-cols-4', className].filter(Boolean).join(' ')}>
      {cards.map((card) => (
        <StatisticCard key={card.title} {...card} />
      ))}
    </div>
  );
}
