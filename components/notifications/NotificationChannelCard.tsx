import React from 'react';
import { formatChannel, formatChannelIcon, formatNumber, formatPercent } from './format';
import type { NotificationChannelStat } from '@/types/notifications';

type NotificationChannelCardProps = {
  stat: NotificationChannelStat;
  totalDelivered: number;
};

export default function NotificationChannelCard({ stat, totalDelivered }: NotificationChannelCardProps) {
  const share = totalDelivered ? (stat.delivered / totalDelivered) * 100 : 0;
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{formatChannelIcon(stat.channel)}</span>
        <p className="font-semibold text-slate-900">{formatChannel(stat.channel)}</p>
      </div>
      <p className="mt-4 text-3xl font-semibold text-slate-900">{formatNumber(stat.count)}</p>
      <p className="mt-1 text-sm text-slate-500">{formatNumber(stat.delivered)} delivered</p>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-sky-600" style={{ width: `${Math.round(share)}%` }} />
      </div>
      <p className="mt-2 text-xs text-slate-400">{formatPercent(share)} of delivery volume</p>
    </div>
  );
}
