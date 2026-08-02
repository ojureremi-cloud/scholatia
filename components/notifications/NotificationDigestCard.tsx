import React from 'react';
import Badge from '@/components/ui/Badge';
import { formatCategory, formatDateTime, formatFrequency, formatNumber, formatPriority } from './format';
import type { NotificationDigest } from '@/types/notifications';

type NotificationDigestCardProps = {
  digest: NotificationDigest;
};

export default function NotificationDigestCard({ digest }: NotificationDigestCardProps) {
  const { summary } = digest;
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-900">{formatFrequency(digest.frequency)}</p>
          <p className="mt-1 text-xs text-slate-400">
            for {digest.target.name ?? digest.target.username ?? digest.target.userId ?? 'all'} · generated{' '}
            {formatDateTime(digest.generatedAt)}
          </p>
        </div>
        <Badge variant={digest.sentAt ? 'success' : 'info'}>{digest.sentAt ? 'Sent' : 'Ready'}</Badge>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-2xl font-semibold text-slate-900">{formatNumber(summary.total)}</p>
          <p className="text-xs text-slate-500">notifications</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-2xl font-semibold text-slate-900">{formatNumber(summary.unread)}</p>
          <p className="text-xs text-slate-500">unread</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-2xl font-semibold text-slate-900">{formatNumber(summary.byCategory.length)}</p>
          <p className="text-xs text-slate-500">categories</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {summary.byCategory.slice(0, 4).map((entry) => (
          <div key={entry.category} className="flex items-center justify-between text-sm">
            <span className="text-slate-500">{formatCategory(entry.category)}</span>
            <span className="font-medium text-slate-700">{formatNumber(entry.count)}</span>
          </div>
        ))}
        {summary.byPriority.slice(0, 4).map((entry) => (
          <div key={entry.priority} className="flex items-center justify-between text-sm">
            <span className="text-slate-500">{formatPriority(entry.priority)}</span>
            <span className="font-medium text-slate-700">{formatNumber(entry.count)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
