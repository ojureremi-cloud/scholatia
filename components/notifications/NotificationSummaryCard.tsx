import React from 'react';
import Badge from '@/components/ui/Badge';
import { formatNumber, formatPercent } from './format';

type NotificationSummaryCardProps = {
  unread: number;
  read: number;
  archived: number;
  dismissed: number;
  deliveryRate?: number;
};

export default function NotificationSummaryCard({
  unread,
  read,
  archived,
  dismissed,
  deliveryRate,
}: NotificationSummaryCardProps) {
  const total = unread + read + archived + dismissed;
  const rows: { label: string; value: number; variant: 'default' | 'success' | 'warning' | 'danger' | 'info' }[] = [
    { label: 'Unread', value: unread, variant: 'warning' },
    { label: 'Read', value: read, variant: 'info' },
    { label: 'Archived', value: archived, variant: 'default' },
    { label: 'Dismissed', value: dismissed, variant: 'danger' },
  ];

  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Inbox summary</p>
        <span className="text-xs text-slate-400">{formatNumber(total)} total</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {rows.map((row) => (
          <Badge key={row.label} variant={row.variant}>
            {row.label}: {formatNumber(row.value)}
          </Badge>
        ))}
      </div>
      {deliveryRate != null ? (
        <div className="mt-4 border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Delivery success</span>
            <span className="font-semibold text-slate-900">{formatPercent(deliveryRate)}</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${Math.min(100, Math.max(0, deliveryRate))}%` }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
