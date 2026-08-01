import React from 'react';
import StatisticCard from '@/components/ui/StatisticCard';
import type { IntelligenceStatistics } from '@/types/intelligence';

type IntelligenceStatisticsProps = {
  statistics: IntelligenceStatistics;
};

export default function IntelligenceStatistics({ statistics }: IntelligenceStatisticsProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatisticCard
        icon="🤖"
        title="Derived insights"
        value={String(statistics.totalInsights)}
        trend="Signals across every module"
        trendPositive
      />
      <StatisticCard
        icon="🎯"
        title="Recommendations"
        value={String(statistics.totalRecommendations)}
        trend={`Avg fit ${statistics.avgRecommendationScore}/100`}
        trendPositive
      />
      <StatisticCard
        icon="📈"
        title="Trends & emerging topics"
        value={String(statistics.totalTrends + statistics.totalEmergingTopics)}
        trend={`${statistics.totalTrends} trends · ${statistics.totalEmergingTopics} emerging`}
        trendPositive
      />
      <StatisticCard
        icon="🔮"
        title="Citation predictions"
        value={String(statistics.totalPredictions)}
        trend={`${statistics.totalCollaborationSuggestions} collaboration pairs`}
        trendPositive
      />
      <StatisticCard
        icon="🧠"
        title="Average confidence"
        value={`${statistics.avgConfidence}%`}
        trend="Across insights, recommendations & forecasts"
        trendPositive
      />
      <StatisticCard
        icon="🧩"
        title="Knowledge graph"
        value={`${statistics.totalGraphNodes} · ${statistics.totalGraphEdges}`}
        trend="Nodes · derived edges"
        trendPositive
      />
      <StatisticCard
        icon="🌍"
        title="Monitored countries"
        value={String(statistics.monitoredCountries)}
        trend={`${statistics.monitoredDisciplines} disciplines`}
        trendPositive
      />
      <StatisticCard
        icon="🏆"
        title="Top topic"
        value={statistics.topTopic.length > 14 ? `${statistics.topTopic.slice(0, 12)}…` : statistics.topTopic}
        trend={statistics.topDiscipline}
        trendPositive
      />
    </div>
  );
}
