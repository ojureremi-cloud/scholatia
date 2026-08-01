'use client';

import React from 'react';
import StatisticCard from '@/components/ui/StatisticCard';
import { formatCompactNumber } from './format';
import type { DiscoveryStatistics } from '@/types/discovery';

type DiscoveryStatisticsProps = {
  statistics: DiscoveryStatistics;
  className?: string;
};

export default function DiscoveryStatistics({ statistics, className = '' }: DiscoveryStatisticsProps) {
  const cards = [
    {
      title: 'Searchable items',
      value: formatCompactNumber(statistics.totalItems),
      trend: `${statistics.totalCollections} curated collections`,
      trendPositive: true,
      icon: '🔍',
    },
    {
      title: 'Researchers',
      value: formatCompactNumber(statistics.totalResearchers),
      trend: `${statistics.totalCountries} countries`,
      trendPositive: true,
      icon: '👩‍🔬',
    },
    {
      title: 'Journals',
      value: statistics.totalJournals.toLocaleString('en-US'),
      icon: '📄',
    },
    {
      title: 'Conferences',
      value: statistics.totalConferences.toLocaleString('en-US'),
      icon: '🎤',
    },
    {
      title: 'Institutions',
      value: statistics.totalInstitutions.toLocaleString('en-US'),
      icon: '🏛️',
    },
    {
      title: 'Publishers',
      value: statistics.totalPublishers.toLocaleString('en-US'),
      icon: '🏢',
    },
    {
      title: 'Projects & publications',
      value: formatCompactNumber(statistics.totalProjects + statistics.totalPublications),
      trend: `${statistics.totalProjects} projects`,
      trendPositive: true,
      icon: '🚀',
    },
    {
      title: 'Datasets & manuscripts',
      value: formatCompactNumber(statistics.totalDatasets + statistics.totalManuscripts),
      icon: '📊',
    },
    {
      title: 'Funding opportunities',
      value: statistics.totalFunding.toLocaleString('en-US'),
      icon: '💰',
    },
    {
      title: 'Keywords tracked',
      value: formatCompactNumber(statistics.totalKeywords),
      trend: `top: ${statistics.topKeyword}`,
      trendPositive: true,
      icon: '🏷️',
    },
    {
      title: 'Disciplines',
      value: statistics.totalDisciplines.toLocaleString('en-US'),
      trend: `${statistics.totalContinents} continents`,
      trendPositive: true,
      icon: '🌍',
    },
    {
      title: 'Average relevance',
      value: `${statistics.averageScore}/100`,
      icon: '⭐',
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
