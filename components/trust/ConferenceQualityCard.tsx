import React from 'react';
import { ScorePill } from './TrustBadge';
import { formatCompactNumber, formatPercent } from './format';
import type { ConferenceQualityIndex } from '@/types/trust';

type ConferenceQualityCardProps = {
  quality: ConferenceQualityIndex;
};

export default function ConferenceQualityCard({ quality }: ConferenceQualityCardProps) {
  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Conference Quality Index</p>
        <ScorePill score={quality.qualityIndex} />
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-7 text-slate-900">{quality.name}</h3>
      <p className="mt-1 text-xs font-medium text-slate-400">
        {quality.yearsActive} years active · committee of {quality.committeeSize}
      </p>
      <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <div>
          <p className="font-semibold text-slate-800">{formatPercent(quality.acceptanceRate)}</p>
          <p className="text-xs text-slate-500">Acceptance rate</p>
        </div>
        <div>
          <p className="font-semibold text-slate-800">{formatCompactNumber(quality.submissions)}</p>
          <p className="text-xs text-slate-500">Submissions</p>
        </div>
        <div>
          <p className="font-semibold text-slate-800">h{quality.hIndex}</p>
          <p className="text-xs text-slate-500">h-index</p>
        </div>
        <div>
          <p className="font-semibold text-slate-800">{formatPercent(quality.attendeeSatisfaction)}</p>
          <p className="text-xs text-slate-500">Attendee satisfaction</p>
        </div>
      </div>
      <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Repeat submission rate</span>
          <span className="font-semibold text-slate-800">{formatPercent(quality.repeatSubmissionRate)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Tracked citations</span>
          <span className="font-semibold text-slate-800">{formatCompactNumber(quality.citations)}</span>
        </div>
      </div>
    </article>
  );
}
