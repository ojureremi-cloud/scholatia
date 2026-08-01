'use client';

import React from 'react';
import Badge from '@/components/ui/Badge';
import type { TravelGrant } from '@/types/conference';

type TravelGrantCardProps = {
  grant: TravelGrant;
  className?: string;
};

const statusVariant: Record<TravelGrant['status'], 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  Open: 'success',
  Upcoming: 'info',
  Closed: 'default',
};

export default function TravelGrantCard({ grant, className = '' }: TravelGrantCardProps) {
  return (
    <div className={['rounded-2xl border border-slate-200 bg-white p-4 shadow-card', className].filter(Boolean).join(' ')}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-slate-900">{grant.name}</p>
        <Badge variant={statusVariant[grant.status]}>{grant.status}</Badge>
      </div>
      <p className="mt-2 text-sm font-medium text-slate-700">{grant.amount}</p>
      {grant.region ? <p className="mt-1 text-xs text-slate-500">Region: {grant.region}</p> : null}
      <p className="mt-1 text-xs text-slate-500">Deadline: {grant.deadline}</p>
      <p className="mt-2 text-sm leading-5 text-slate-600">{grant.eligibility}</p>
      {grant.fundingPartner ? (
        <p className="mt-2 text-xs text-slate-500">Funded by {grant.fundingPartner}</p>
      ) : null}
    </div>
  );
}
