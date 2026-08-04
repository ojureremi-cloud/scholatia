'use client';

import StatisticCard from '@/components/ui/StatisticCard';
import { formatNumber } from '../format';
import useLearning from '@/hooks/useLearning';

export function WorkspaceStatistics() {
  const { workspace, reading } = useLearning();
  const stats = workspace().statistics;
  const model = reading();

  const cards = [
    { title: 'Courses', value: formatNumber(stats.totalCourses), icon: '📘' },
    { title: 'Lessons', value: formatNumber(stats.totalLessons), icon: '📖' },
    { title: 'Reading resources', value: formatNumber(stats.totalReadingLists + stats.totalReadingPlaylists), icon: '📚' },
    { title: 'Reading progress', value: `${model.progress}%`, icon: '🔖' },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <StatisticCard key={card.title} title={card.title} value={card.value} icon={card.icon} />
      ))}
    </section>
  );
}
