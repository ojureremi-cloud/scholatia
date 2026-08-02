import React from 'react';
import StatisticCard from '@/components/ui/StatisticCard';
import { formatNumber } from './format';
import type { MessageStatistics } from '@/types/messages';

type MessageStatisticsProps = {
  statistics: MessageStatistics;
};

export default function MessageStatistics({ statistics }: MessageStatisticsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatisticCard
        title="Conversations"
        value={formatNumber(statistics.totalConversations)}
        icon="💬"
        trend={`${formatNumber(statistics.totalUnread)} unread`}
      />
      <StatisticCard
        title="Messages"
        value={formatNumber(statistics.totalMessages)}
        icon="📨"
        trend={`${formatNumber(statistics.totalParticipants)} participants`}
      />
      <StatisticCard
        title="Attachments"
        value={formatNumber(statistics.totalAttachments)}
        icon="📎"
        trend={`${formatNumber(statistics.totalReactions)} reactions`}
      />
      <StatisticCard
        title="Pinned"
        value={formatNumber(statistics.totalPinned)}
        icon="📌"
        trend={`${formatNumber(statistics.totalStarred)} starred · ${formatNumber(statistics.totalMuted)} muted`}
      />
    </div>
  );
}
