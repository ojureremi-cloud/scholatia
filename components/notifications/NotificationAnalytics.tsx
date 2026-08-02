import React from 'react';
import { formatChannel, formatNumber, formatPercent } from './format';
import type { NotificationAnalytics } from '@/types/notifications';

type NotificationAnalyticsProps = {
  analytics: NotificationAnalytics;
};

export default function NotificationAnalytics({ analytics }: NotificationAnalyticsProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Delivery</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{formatPercent(analytics.deliveryRate)}</p>
          <p className="mt-1 text-sm text-slate-500">
            {formatNumber(analytics.totalDelivered)} of {formatNumber(analytics.totalSent)} sent
          </p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Opened</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{formatPercent(analytics.openRate)}</p>
          <p className="mt-1 text-sm text-slate-500">{formatNumber(analytics.totalOpened)} total opens</p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Clicked</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{formatPercent(analytics.clickRate)}</p>
          <p className="mt-1 text-sm text-slate-500">{formatNumber(analytics.totalClicked)} total clicks</p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Failed</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{formatNumber(analytics.totalFailed)}</p>
          <p className="mt-1 text-sm text-slate-500">{formatNumber(analytics.totalDeliveries)} total deliveries</p>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Delivery by channel</p>
        <div className="mt-4 space-y-3">
          {analytics.deliveryByChannel.map((stat) => (
            <div key={stat.channel} className="flex items-center gap-4">
              <span className="w-24 shrink-0 text-sm text-slate-500">{formatChannel(stat.channel)}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-sky-600"
                  style={{
                    width: `${analytics.totalDelivered ? Math.round((stat.delivered / analytics.totalDelivered) * 100) : 0}%`,
                  }}
                />
              </div>
              <span className="w-24 shrink-0 text-right text-xs text-slate-400">
                {formatNumber(stat.delivered)} delivered
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
