import React from 'react';
import Badge from '@/components/ui/Badge';
import type { GrantOpportunity } from '@/constants/placeholder-research';

type GrantOpportunityCardProps = {
  opportunities: GrantOpportunity[];
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

export function GrantOpportunityCard({ opportunities }: GrantOpportunityCardProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {opportunities.map((opportunity) => (
        <div key={opportunity.id} className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
          <div className="flex items-start justify-between gap-3">
            <h4 className="font-semibold text-slate-900">{opportunity.title}</h4>
            <Badge variant="info">Open</Badge>
          </div>
          <p className="mt-1 text-sm font-medium text-sky-700">{opportunity.funder}</p>
          <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{opportunity.focus}</p>
          <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3 text-sm">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Funding</p>
              <p className="mt-1 font-semibold text-slate-900">{opportunity.amount}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Deadline</p>
              <p className="mt-1 font-semibold text-slate-900">{formatDate(opportunity.deadline)}</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500">Eligibility: {opportunity.eligibility}</p>
        </div>
      ))}
    </div>
  );
}
