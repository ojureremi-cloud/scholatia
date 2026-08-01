import React from 'react';
import StatisticCard from '@/components/ui/StatisticCard';
import { formatCurrency } from './format';
import type { CommerceParticipantEarnings } from '@/types/commerce';

type ResearcherRevenueCardProps = {
  participants: CommerceParticipantEarnings[];
};

export default function ResearcherRevenueCard({ participants }: ResearcherRevenueCardProps) {
  const gross = participants.reduce((sum, entry) => sum + entry.grossRevenue, 0);
  const net = participants.reduce((sum, entry) => sum + entry.netRevenue, 0);
  const active = participants.filter((entry) => entry.pendingBalance > 0).length;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatisticCard title="Researcher spend" value={formatCurrency(gross, 'USD')} icon="🧑‍🔬" trend={`${participants.length} researchers`} />
        <StatisticCard title="Researcher net" value={formatCurrency(net, 'USD')} icon="📈" trendPositive />
        <StatisticCard title="Active wallets" value={active.toLocaleString()} icon="💳" trend="with pending balance" />
        <StatisticCard title="Avg per researcher" value={formatCurrency(participants.length > 0 ? gross / participants.length : 0, 'USD')} icon="📊" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {participants.map((entry) => (
          <article key={entry.id} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
            <p className="font-semibold text-slate-900">{entry.participantName}</p>
            <p className="mt-0.5 text-xs text-slate-400">{entry.participantId}</p>
            <p className="mt-4 text-2xl font-semibold text-slate-900">{formatCurrency(entry.netRevenue, entry.currency)}</p>
            <p className="text-xs text-slate-500">net this period</p>
            <div className="mt-4 flex justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
              <span>Available</span>
              <span className="font-semibold text-slate-800">{formatCurrency(entry.availableBalance, entry.currency)}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>Pending</span>
              <span className="font-semibold text-slate-800">{formatCurrency(entry.pendingBalance, entry.currency)}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
