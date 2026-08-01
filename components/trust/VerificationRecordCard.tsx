import React from 'react';
import VerificationBadge from './VerificationBadge';
import { VerificationChecklist } from './VerificationChecklist';
import { formatDateLabel, formatPercent } from './format';
import { verificationProgress } from '@/lib/trust';
import type { VerificationRecord } from '@/types/trust';

type VerificationRecordCardProps = {
  record: VerificationRecord;
  featured?: boolean;
};

export default function VerificationRecordCard({ record, featured = false }: VerificationRecordCardProps) {
  const progress = verificationProgress(record);
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <VerificationBadge entityType={record.entityType} status={record.status} />
        <span className="text-xs font-medium text-slate-400">Level {record.verificationLevel}</span>
      </div>
      <h3 className={['mt-3 font-semibold text-slate-900', featured ? 'text-2xl leading-8' : 'text-lg leading-7'].join(' ')}>
        {record.entityName}
      </h3>
      <p className="mt-1 text-xs font-medium text-slate-400">{record.entityId}</p>
      <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{record.summary}</p>
      <div className="mt-4 flex items-center justify-between gap-3 text-xs text-slate-500">
        <span>
          Verified by {record.verifiedBy} · {formatDateLabel(record.verifiedAt)}
        </span>
        <span className="font-semibold text-slate-700">{formatPercent(progress)} complete</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-sky-600" style={{ width: `${progress}%` }} />
      </div>
      <div className="mt-5">
        <VerificationChecklist checks={record.checks} />
      </div>
    </article>
  );
}
