import React from 'react';
import { FraudSeverityBadge } from './AdsBadge';
import { formatDate, formatFraudType } from './format';
import type { AdFraudSignal } from '@/types/ads';

type FraudSignalCardProps = {
  signal: AdFraudSignal;
};

const statusVariant: Record<AdFraudSignal['status'], string> = {
  open: 'bg-rose-100 text-rose-800',
  investigating: 'bg-amber-100 text-amber-800',
  resolved: 'bg-emerald-100 text-emerald-800',
  dismissed: 'bg-slate-100 text-slate-600',
};

export default function FraudSignalCard({ signal }: FraudSignalCardProps) {
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {formatFraudType(signal.type)}
        </span>
        <FraudSeverityBadge severity={signal.severity} />
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-7 text-slate-900">{signal.campaignId}</h3>
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">{signal.advertiserId}</p>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{signal.description}</p>
      <div className="mt-3 grid grid-cols-3 gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Clicks</p>
          <p className="mt-1 font-semibold text-slate-900">{signal.invalidClicks ?? 0}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Impressions</p>
          <p className="mt-1 font-semibold text-slate-900">{signal.invalidImpressions ?? 0}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Conversions</p>
          <p className="mt-1 font-semibold text-slate-900">{signal.invalidConversions ?? 0}</p>
        </div>
      </div>
      {signal.evidence.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {signal.evidence.slice(0, 3).map((evidence) => (
            <span key={evidence} className="rounded-full bg-slate-50 px-2.5 py-0.5 text-xs text-slate-500">
              {evidence}
            </span>
          ))}
        </div>
      ) : null}
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs">
        <span className={`rounded-full px-3 py-1 font-semibold capitalize ${statusVariant[signal.status]}`}>
          {signal.status}
        </span>
        <span className="text-slate-500">Detected {formatDate(signal.detectedAt)}</span>
      </div>
    </article>
  );
}
