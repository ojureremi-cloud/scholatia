import React from 'react';
import { formatDateLabel } from './format';
import type { OrcidRecord } from '@/types/trust';

type OrcidCardProps = {
  record: OrcidRecord;
};

export default function OrcidCard({ record }: OrcidCardProps) {
  const statusStyles: Record<OrcidRecord['status'], string> = {
    linked: 'bg-emerald-50 text-emerald-700',
    pending: 'bg-amber-50 text-amber-700',
    'not-linked': 'bg-slate-100 text-slate-500',
    expired: 'bg-rose-50 text-rose-700',
    revoked: 'bg-rose-50 text-rose-700',
  };
  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-2xl">🆔</span>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[record.status]}`}>
          {record.status.replace('-', ' ')}
        </span>
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-7 text-slate-900">ORCID integration</h3>
      <p className="mt-1 font-mono text-sm text-sky-700">{record.orcidId}</p>
      <p className="mt-1 text-sm text-slate-600">{record.displayName}</p>
      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <div>
          <p className="font-semibold text-slate-800">{record.worksSynced}</p>
          <p className="text-xs text-slate-500">Works synced</p>
        </div>
        <div>
          <p className="font-semibold text-slate-800">{record.publicRecord ? 'Public' : 'Private'}</p>
          <p className="text-xs text-slate-500">Record visibility</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {record.permissions.map((permission) => (
          <span key={permission} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
            {permission}
          </span>
        ))}
      </div>
      <p className="mt-4 text-xs text-slate-400">
        {record.claimed ? 'Claimed by the researcher' : 'Not claimed'} · last sync {formatDateLabel(record.lastSyncAt)}
      </p>
    </article>
  );
}
