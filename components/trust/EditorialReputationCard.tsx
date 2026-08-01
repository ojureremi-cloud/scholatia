import React from 'react';
import { ScorePill } from './TrustBadge';
import { formatPercent } from './format';
import type { EditorialReputation } from '@/types/trust';

type EditorialReputationCardProps = {
  editorial: EditorialReputation;
};

export default function EditorialReputationCard({ editorial }: EditorialReputationCardProps) {
  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Editorial reputation</p>
        <ScorePill score={editorial.reputationScore} />
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-7 text-slate-900">{editorial.name}</h3>
      <div className="mt-1 flex flex-wrap gap-2">
        {editorial.roles.map((role) => (
          <span key={role} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
            {role}
          </span>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <div>
          <p className="font-semibold text-slate-800">{editorial.manuscriptsHandled}</p>
          <p className="text-xs text-slate-500">Manuscripts handled</p>
        </div>
        <div>
          <p className="font-semibold text-slate-800">{editorial.decisionsMade}</p>
          <p className="text-xs text-slate-500">Decisions made</p>
        </div>
        <div>
          <p className="font-semibold text-slate-800">{editorial.avgDaysToDecision}d</p>
          <p className="text-xs text-slate-500">Avg days to decision</p>
        </div>
        <div>
          <p className="font-semibold text-slate-800">{formatPercent(editorial.acceptanceRate)}</p>
          <p className="text-xs text-slate-500">Acceptance rate</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
        {editorial.journalsServed.map((journal) => (
          <span key={journal} className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-700">
            {journal}
          </span>
        ))}
      </div>
    </article>
  );
}
