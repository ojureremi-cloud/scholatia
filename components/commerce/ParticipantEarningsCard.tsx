import React from 'react';
import { ParticipantTypeBadge } from './CommerceBadge';
import { formatCurrency } from './format';
import type { CommerceParticipantEarnings } from '@/types/commerce';

type ParticipantEarningsCardProps = {
  earnings: CommerceParticipantEarnings;
  featured?: boolean;
};

export default function ParticipantEarningsCard({ earnings, featured = false }: ParticipantEarningsCardProps) {
  const maxRow = Math.max(earnings.grossRevenue, earnings.platformFees, earnings.commissions, earnings.refunds, earnings.netRevenue, 1);

  return (
    <article
      className={[
        'flex flex-col rounded-[1.75rem] border bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]',
        featured ? 'border-slate-900 ring-2 ring-slate-900/10' : 'border-slate-200',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-900">{earnings.participantName}</p>
          <p className="mt-0.5 text-xs text-slate-400">
            {earnings.periodStart} – {earnings.periodEnd}
          </p>
        </div>
        <ParticipantTypeBadge type={earnings.participantType} />
      </div>

      <div className="mt-4 rounded-2xl bg-slate-50 px-5 py-4">
        <p className="text-2xl font-semibold text-slate-900">{formatCurrency(earnings.netRevenue, earnings.currency)}</p>
        <p className="text-xs text-slate-500">Net revenue this period</p>
      </div>

      <div className="mt-4 flex-1 space-y-3">
        {([
          { label: 'Gross revenue', value: earnings.grossRevenue, color: 'bg-slate-900' },
          { label: 'Platform fees', value: earnings.platformFees, color: 'bg-amber-500' },
          { label: 'Commissions', value: earnings.commissions, color: 'bg-sky-600' },
          { label: 'Refunds', value: earnings.refunds, color: 'bg-rose-500' },
        ] as const).map((row) => (
          <div key={row.label}>
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="text-slate-500">{row.label}</span>
              <span className="font-semibold text-slate-800">{formatCurrency(row.value, earnings.currency)}</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${row.color}`}
                style={{ width: `${maxRow > 0 ? Math.round((row.value / maxRow) * 100) : 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-xs">
        <div>
          <p className="text-slate-500">Available</p>
          <p className="mt-0.5 font-semibold text-slate-900">{formatCurrency(earnings.availableBalance, earnings.currency)}</p>
        </div>
        <div>
          <p className="text-slate-500">Pending</p>
          <p className="mt-0.5 font-semibold text-slate-900">{formatCurrency(earnings.pendingBalance, earnings.currency)}</p>
        </div>
      </div>
    </article>
  );
}
