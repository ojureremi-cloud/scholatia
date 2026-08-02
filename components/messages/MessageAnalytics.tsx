import React from 'react';
import StatisticCard from '@/components/ui/StatisticCard';
import { formatNumber, formatPercent } from './format';
import type { MessageAnalytics } from '@/types/messages';

type MessageAnalyticsProps = {
  analytics: MessageAnalytics;
};

export default function MessageAnalytics({ analytics }: MessageAnalyticsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatisticCard
        title="Messages per day"
        value={formatNumber(analytics.messagesPerDay)}
        icon="📅"
        trend={`${formatNumber(analytics.activeConversations)} active`}
      />
      <StatisticCard
        title="Reply rate"
        value={formatPercent(analytics.replyRate)}
        icon="↩️"
        trend={`${formatNumber(analytics.mentionsPerMessage)} mentions/msg`}
      />
      <StatisticCard
        title="Avg reactions"
        value={formatNumber(analytics.averageReactions)}
        icon="❤️"
        trend={`${formatNumber(analytics.editRate)} edits/msg`}
      />
      <StatisticCard
        title="Attachment kinds"
        value={formatNumber(analytics.attachmentByType.length)}
        icon="🧾"
        trend={`${formatNumber(analytics.mostActiveConversations.length)} busiest threads`}
      />
    </div>
  );
}
