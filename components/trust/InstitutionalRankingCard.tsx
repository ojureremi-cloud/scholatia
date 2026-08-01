import React from 'react';
import { ScorePill } from './TrustBadge';
import { formatCompactNumber } from './format';
import type { InstitutionalReputation } from '@/types/trust';

type InstitutionalRankingCardProps = {
  reputation: InstitutionalReputation;
};

export default function InstitutionalRankingCard({ reputation }: InstitutionalRankingCardProps) {
  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Institutional reputation</p>
        <ScorePill score={reputation.reputationScore} />
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-7 text-slate-900">{reputation.name}</h3>
      <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <div>
          <p className="font-semibold text-slate-800">{formatCompactNumber(reputation.publications)}</p>
          <p className="text-xs text-slate-500">Publications</p>
        </div>
        <div>
          <p className="font-semibold text-slate-800">{formatCompactNumber(reputation.citations)}</p>
          <p className="text-xs text-slate-500">Citations</p>
        </div>
        <div>
          <p className="font-semibold text-slate-800">h{reputation.hIndex}</p>
          <p className="text-xs text-slate-500">h-index</p>
        </div>
        <div>
          <p className="font-semibold text-slate-800">{reputation.peerEndorsements}</p>
          <p className="text-xs text-slate-500">Peer endorsements</p>
        </div>
      </div>
      <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">Rankings</p>
        {reputation.rankings.length > 0 ? (
          <ul className="space-y-1.5">
            {reputation.rankings.map((ranking, index) => (
              <li key={`${ranking.source}-${index}`} className="flex items-center justify-between text-sm">
                <span className="text-slate-600">{ranking.source}</span>
                <span className="font-semibold text-slate-800">
                  #{ranking.rank}
                  {ranking.totalRanked ? ` of ${ranking.totalRanked}` : ''} · {ranking.year}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500">No external rankings on record.</p>
        )}
      </div>
    </article>
  );
}
