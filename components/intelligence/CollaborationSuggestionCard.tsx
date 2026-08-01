import React from 'react';
import { formatScore } from './format';
import type { CollaborationSuggestion } from '@/types/intelligence';

type CollaborationSuggestionCardProps = {
  suggestion: CollaborationSuggestion;
};

export default function CollaborationSuggestionCard({ suggestion }: CollaborationSuggestionCardProps) {
  const researcher = suggestion.researcher;
  const partner = suggestion.partner;
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-fuchsia-50 px-3 py-1 text-xs font-semibold text-fuchsia-700">
          Collaboration pair
        </span>
        <span className="text-xs font-semibold text-slate-500">
          {suggestion.countries.join(' ↔ ')}
        </span>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <a
          href={researcher.url}
          className="rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:border-sky-200"
        >
          <p className="text-sm font-semibold text-slate-900">{researcher.displayName}</p>
          <p className="mt-1 text-xs text-slate-500">{researcher.institution}</p>
          <p className="mt-1 text-xs text-slate-500">{researcher.discipline}</p>
        </a>
        <a
          href={partner.url}
          className="rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:border-sky-200"
        >
          <p className="text-sm font-semibold text-slate-900">{partner.displayName}</p>
          <p className="mt-1 text-xs text-slate-500">{partner.institution}</p>
          <p className="mt-1 text-xs text-slate-500">{partner.discipline}</p>
        </a>
      </div>
      {suggestion.sharedInterests.length > 0 ? (
        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Shared interests</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {suggestion.sharedInterests.map((interest) => (
              <span key={interest} className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-700">
                {interest}
              </span>
            ))}
          </div>
        </div>
      ) : null}
      {suggestion.complementarySkills.length > 0 ? (
        <div className="mt-3">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Complementary skills</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {suggestion.complementarySkills.map((skill) => (
              <span key={skill} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600">
                {skill}
              </span>
            ))}
          </div>
        </div>
      ) : null}
      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 text-sm">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Overlap</p>
          <p className="mt-1 font-semibold text-slate-800">{formatScore(suggestion.overlapScore)}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Potential</p>
          <p className="mt-1 font-semibold text-fuchsia-700">{formatScore(suggestion.collaborationPotential)}</p>
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{suggestion.recommendation}</p>
    </article>
  );
}
