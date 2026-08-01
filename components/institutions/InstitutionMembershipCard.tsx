'use client';

import React from 'react';
import type { InstitutionMembership } from '@/types/institution';

type InstitutionMembershipCardProps = {
  memberships: InstitutionMembership[];
  className?: string;
};

const statusStyles: Record<InstitutionMembership['status'], string> = {
  Active: 'bg-emerald-100 text-emerald-800',
  Inactive: 'bg-slate-100 text-slate-700',
  Pending: 'bg-amber-100 text-amber-800',
};

export default function InstitutionMembershipCard({ memberships, className = '' }: InstitutionMembershipCardProps) {
  return (
    <div className={['grid gap-4 sm:grid-cols-2', className].filter(Boolean).join(' ')}>
      {memberships.map((membership) => (
        <div key={membership.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-slate-900">{membership.organisation}</p>
            <span
              className={['rounded-full px-2 py-0.5 text-xs font-medium', statusStyles[membership.status]].join(' ')}
            >
              {membership.status}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            {membership.role ? <span>{membership.role}</span> : null}
            {membership.sinceYear ? <span>Since {membership.sinceYear}</span> : null}
          </div>
          {membership.description ? (
            <p className="mt-2 text-sm leading-6 text-slate-600">{membership.description}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
