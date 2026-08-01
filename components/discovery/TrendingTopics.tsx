'use client';

import React from 'react';
import DiscoverySuggestionCard from './DiscoverySuggestionCard';
import type { DiscoverySuggestion } from '@/types/discovery';

type TrendingTopicsProps = {
  topics: DiscoverySuggestion[];
  className?: string;
};

export default function TrendingTopics({ topics, className = '' }: TrendingTopicsProps) {
  return (
    <div className={['grid gap-3 sm:grid-cols-2 lg:grid-cols-5', className].filter(Boolean).join(' ')}>
      {topics.map((topic) => (
        <DiscoverySuggestionCard key={topic.id} suggestion={topic} />
      ))}
    </div>
  );
}
