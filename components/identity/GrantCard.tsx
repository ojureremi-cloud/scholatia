import React from 'react';
import Badge from '@/components/ui/Badge';

type GrantCardProps = {
  title: string;
  funder: string;
  amount: string;
  status: 'Active' | 'Completed' | 'Pending';
  period: string;
  role: string;
};

const grantStatusVariant: Record<GrantCardProps['status'], 'success' | 'default' | 'warning'> = {
  Active: 'success',
  Completed: 'default',
  Pending: 'warning',
};

export default function GrantCard({ title, funder, amount, status, period, role }: GrantCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-600">{funder}</p>
        </div>
        <Badge variant={grantStatusVariant[status]}>{status}</Badge>
      </div>
      <div className="mt-5 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Awarded</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{amount}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Period</p>
          <p className="mt-1 text-sm font-medium text-slate-700">{period}</p>
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-600">Role: <span className="font-medium text-slate-700">{role}</span></p>
    </div>
  );
}
