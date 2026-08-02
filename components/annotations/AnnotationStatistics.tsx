import { StatisticCard } from '@/components/ui';
import type { AnnotationStatistics } from '@/types/annotations';
import { formatNumber } from './format';

type AnnotationStatisticsProps = {
  statistics: AnnotationStatistics;
};

export function AnnotationStatistics({ statistics }: AnnotationStatisticsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatisticCard title="Total annotations" value={formatNumber(statistics.totalAnnotations)} icon="📌" />
      <StatisticCard title="Open" value={formatNumber(statistics.openAnnotations)} icon="🟢" />
      <StatisticCard title="Pending" value={formatNumber(statistics.pendingAnnotations)} icon="⏳" />
      <StatisticCard title="Resolved" value={formatNumber(statistics.resolvedAnnotations)} icon="✅" />
      <StatisticCard title="Archived" value={formatNumber(statistics.archivedAnnotations)} icon="🗄️" />
      <StatisticCard title="Thread replies" value={formatNumber(statistics.totalThreadReplies)} icon="💬" />
      <StatisticCard title="Mentions" value={formatNumber(statistics.totalMentions)} icon="@️⃣" />
      <StatisticCard title="Reactions" value={formatNumber(statistics.totalReactions)} icon="👍" />
    </div>
  );
}
