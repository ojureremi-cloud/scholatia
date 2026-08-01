'use client';

import React from 'react';
import StatisticCard from '@/components/ui/StatisticCard';
import { formatCompactNumber } from './format';
import type { PublisherStatistics as PublisherStatisticsData } from '@/types/publisher';

type PublisherStatisticsProps = {
  statistics: PublisherStatisticsData;
  className?: string;
};

export default function PublisherStatistics({ statistics, className = '' }: PublisherStatisticsProps) {
  const cards = [
    {
      title: 'Publishers',
      value: statistics.totalPublishers.toString(),
      trend: `${statistics.verifiedPublishers} verified · ${statistics.trustedPublishers} trusted`,
      trendPositive: true,
      icon: '🏛️',
    },
    {
      title: 'Journals',
      value: formatCompactNumber(statistics.totalJournals),
      icon: '📄',
    },
    {
      title: 'Conferences',
      value: statistics.totalConferences.toLocaleString('en-US'),
      trend: `${statistics.totalProceedings.toLocaleString('en-US')} proceedings`,
      trendPositive: true,
      icon: '🎤',
    },
    {
      title: 'Books',
      value: statistics.totalBooks.toLocaleString('en-US'),
      trend: `${statistics.totalBookSeries} book series`,
      icon: '📚',
    },
    {
      title: 'Editorial offices',
      value: statistics.totalEditorialOffices.toString(),
      icon: '🏢',
    },
    {
      title: 'Countries served',
      value: statistics.countriesServed.toString(),
      trend: `${statistics.continentsServed} continents`,
      trendPositive: true,
      icon: '🌍',
    },
    {
      title: 'Articles published',
      value: formatCompactNumber(statistics.totalArticlesPublished),
      icon: '✍️',
    },
    {
      title: 'Average trust score',
      value: `${statistics.averageTrustScore}/100`,
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
