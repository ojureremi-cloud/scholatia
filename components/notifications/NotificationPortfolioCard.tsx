import React from 'react';
import { formatNumber } from './format';
import type { NotificationPortfolio } from '@/types/notifications';

type NotificationPortfolioCardProps = {
  portfolio: NotificationPortfolio;
};

export default function NotificationPortfolioCard({ portfolio }: NotificationPortfolioCardProps) {
  const { statistics, analytics, notifications, preferences, templates, channels, deliveries, digests, subscriptions, alerts } =
    portfolio;

  const rows: { label: string; value: number; icon: string }[] = [
    { label: 'Notifications', value: notifications.length, icon: '🔔' },
    { label: 'Preferences', value: preferences.length, icon: '🎛️' },
    { label: 'Templates', value: templates.length, icon: '📝' },
    { label: 'Channels', value: channels.length, icon: '📡' },
    { label: 'Deliveries', value: deliveries.length, icon: '📤' },
    { label: 'Digests', value: digests.length, icon: '📅' },
    { label: 'Subscriptions', value: subscriptions.length, icon: '🔗' },
    { label: 'Alerts', value: alerts.length, icon: '⚠️' },
  ];

  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Engine overview</p>
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {rows.map((row) => (
          <div key={row.label} className="rounded-2xl bg-slate-50 p-4">
            <span className="text-xl">{row.icon}</span>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{formatNumber(row.value)}</p>
            <p className="text-xs text-slate-500">{row.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-4">
        <div>
          <p className="text-2xl font-semibold text-slate-900">{formatNumber(statistics.totalUnread)}</p>
          <p className="text-xs text-slate-500">Unread</p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-slate-900">{formatNumber(analytics.totalDelivered)}</p>
          <p className="text-xs text-slate-500">Delivered</p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-slate-900">{formatNumber(statistics.totalTemplates)}</p>
          <p className="text-xs text-slate-500">Templates</p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-slate-900">{formatNumber(statistics.activeAlerts)}</p>
          <p className="text-xs text-slate-500">Active alerts</p>
        </div>
      </div>
    </div>
  );
}
