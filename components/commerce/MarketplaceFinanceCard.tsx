import React from 'react';
import { formatCurrency } from './format';
import type { CommerceRevenueReport } from '@/types/commerce';

type MarketplaceFinanceCardProps = {
  report: CommerceRevenueReport;
  title?: string;
};

export default function MarketplaceFinanceCard({ report, title = 'Marketplace finance' }: MarketplaceFinanceCardProps) {
  const maxRow = Math.max(report.grossRevenue, report.platformFees, report.commissions, report.refunds, report.netRevenue, 1);

  const rows = [
    { label: 'Gross revenue', value: report.grossRevenue, color: 'bg-slate-900' },
    { label: 'Platform fees', value: report.platformFees, color: 'bg-amber-500' },
    { label: 'Commissions', value: report.commissions, color: 'bg-sky-600' },
    { label: 'Refunds', value: report.refunds, color: 'bg-rose-500' },
  ] as const;

  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">{title}</p>

      <div className="mt-4 rounded-2xl bg-slate-50 px-5 py-4">
        <p className="text-2xl font-semibold text-slate-900">{formatCurrency(report.netRevenue, 'USD')}</p>
        <p className="text-xs text-slate-500">Net revenue after fees, commissions & refunds</p>
      </div>

      <div className="mt-4 space-y-3">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="text-slate-500">{row.label}</span>
              <span className="font-semibold text-slate-800">{formatCurrency(row.value, 'USD')}</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div className={`h-full rounded-full ${row.color}`} style={{ width: `${Math.round((row.value / maxRow) * 100)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
