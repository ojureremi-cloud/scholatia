import React from 'react';
import StatisticCard from '@/components/ui/StatisticCard';
import { formatCurrency } from './format';
import type { CommerceParticipantEarnings } from '@/types/commerce';

type InstitutionRevenueCardProps = {
  participants: CommerceParticipantEarnings[];
};

export default function InstitutionRevenueCard({ participants }: InstitutionRevenueCardProps) {
  const gross = participants.reduce((sum, entry) => sum + entry.grossRevenue, 0);
  const net = participants.reduce((sum, entry) => sum + entry.netRevenue, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatisticCard title="Institution gross" value={formatCurrency(gross, 'USD')} icon="🏛️" trend={`${participants.length} institutions`} />
        <StatisticCard title="Institution net" value={formatCurrency(net, 'USD')} icon="📈" trendPositive />
        <StatisticCard
          title="Licensing & membership"
          value={formatCurrency(gross, 'USD')}
          icon="🔑"
          trend="enterprise licences & membership"
        />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {participants.map((entry) => (
          <article key={entry.id} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
            <p className="font-semibold text-slate-900">{entry.participantName}</p>
            <p className="mt-0.5 text-xs text-slate-400">{entry.participantId}</p>
            <p className="mt-4 text-2xl font-semibold text-slate-900">{formatCurrency(entry.grossRevenue, entry.currency)}</p>
            <p className="text-xs text-slate-500">gross spend this period</p>
            <div className="mt-4 space-y-1 border-t border-slate-100 pt-3 text-xs text-slate-500">
              <div className="flex justify-between">
                <span>Net</span>
                <span className="font-semibold text-slate-800">{formatCurrency(entry.netRevenue, entry.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>Pending</span>
                <span className="font-semibold text-slate-800">{formatCurrency(entry.pendingBalance, entry.currency)}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
