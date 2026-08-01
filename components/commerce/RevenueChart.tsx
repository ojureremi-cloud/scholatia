import React from 'react';
import { formatCurrency, formatNumber } from './format';
import type { CommerceRevenueReport } from '@/types/commerce';

type RevenueChartProps = {
  report: CommerceRevenueReport;
  /** Optional title shown above the chart. */
  title?: string;
};

export default function RevenueChart({ report, title = 'Revenue by period' }: RevenueChartProps) {
  const max = Math.max(...report.byPeriod.map((entry) => entry.revenue), 1);

  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">{title}</p>

      {report.byPeriod.length > 0 ? (
        <div className="mt-6 flex h-48 items-end gap-3">
          {report.byPeriod.map((entry) => (
            <div key={entry.period} className="group flex h-full flex-1 flex-col items-center justify-end gap-2">
              <span className="text-[0.65rem] font-semibold text-slate-700 opacity-0 transition-opacity group-hover:opacity-100">
                {formatCurrency(entry.revenue, 'USD')}
              </span>
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-sky-700 to-sky-400 transition-opacity group-hover:opacity-80"
                style={{ height: `${Math.round((entry.revenue / max) * 100)}%` }}
              />
              <span className="text-[0.65rem] text-slate-400">{entry.period.slice(2)}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-6 text-sm text-slate-500">No revenue recorded across periods yet.</p>
      )}

      <div className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-500">
        <div className="flex justify-between">
          <span>Periods tracked</span>
          <span className="font-medium text-slate-800">{formatNumber(report.byPeriod.length)}</span>
        </div>
        <div className="mt-1.5 flex justify-between">
          <span>Peak period</span>
          <span className="font-medium text-slate-800">
            {report.byPeriod.length > 0 ? report.byPeriod[report.byPeriod.length - 1].period : '—'}
          </span>
        </div>
      </div>
    </article>
  );
}
