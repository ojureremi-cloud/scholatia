import React from 'react';
import { formatScore } from './format';
import type { ExpertiseMatch } from '@/types/intelligence';

type ExpertiseMatchCardProps = {
  match: ExpertiseMatch;
};

export default function ExpertiseMatchCard({ match }: ExpertiseMatchCardProps) {
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">{match.discipline}</p>
          <h3 className="mt-1 text-lg font-semibold leading-7 text-slate-900">
            <a href={match.researcher.url} className="transition hover:text-sky-700">
              {match.researcher.displayName}
            </a>
          </h3>
          <p className="mt-1 text-xs text-slate-500">{match.researcher.institution}</p>
        </div>
        <span className="text-2xl font-bold text-sky-700">{formatScore(match.score)}</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Best matched to <span className="font-semibold text-slate-800">{match.topic}</span>
      </p>
      {match.evidence.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {match.evidence.map((item) => (
            <span key={item} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600">
              {item}
            </span>
          ))}
        </div>
      ) : null}
      {match.gap ? (
        <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">{match.gap}</p>
      ) : null}
    </article>
  );
}
