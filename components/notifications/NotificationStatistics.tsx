import React from 'react';
import StatisticCard from '@/components/ui/StatisticCard';
import { formatNumber, formatPercent } from './format';
import type { NotificationStatistics } from '@/types/notifications';

type NotificationStatisticsProps = {
  statistics: NotificationStatistics;
};

export default function NotificationStatistics({ statistics }: NotificationStatisticsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatisticCard
        title="Notifications"
        value={formatNumber(statistics.totalNotifications)}
        icon="🔔"
        trend={`${formatNumber(statistics.totalUnread)} unread`}
      />
      <StatisticCard
        title="Categories"
        value={formatNumber(statistics.totalCategories)}
        icon="🗂️"
        trend={`${formatNumber(statistics.totalTemplates)} templates`}
      />
      <StatisticCard
        title="Deliveries"
        value={formatNumber(statistics.totalDeliveries)}
        icon="📤"
        trend={`${formatPercent(statistics.deliverySuccessRate)} success`}
      />
      <StatisticCard
        title="Active alerts"
        value={formatNumber(statistics.activeAlerts)}
        icon="⚠️"
        trend={`${formatNumber(statistics.totalSubscriptions)} subscriptions`}
      />
    </div>
  );
}
