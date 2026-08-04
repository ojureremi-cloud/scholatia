'use client';

import { CredentialKindBadge, CredentialStatusBadge } from './Badges';
import { LearningEmptyState } from './LearningEmptyState';
import { formatDate, formatNumber } from './format';
import useLearning from '@/hooks/useLearning';

export function BadgePanel() {
  const { passport } = useLearning();
  const badges = passport.badges;

  if (badges.length === 0) {
    return (
      <LearningEmptyState
        title="No badges yet"
        description="Digital badges earned for demonstrated skills will appear here."
      />
    );
  }

  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
      <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
        Digital badges ({formatNumber(badges.length)})
      </h2>
      <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {badges.map((badge) => (
          <li
            key={badge.id}
            className="rounded-2xl border border-slate-200 p-4 text-center dark:border-slate-700"
          >
            <span
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-4xl dark:bg-amber-900/40"
              aria-hidden="true"
            >
              🎖️
            </span>
            <p className="mt-3 text-sm font-bold text-slate-900 dark:text-slate-100">{badge.title}</p>
            {badge.competencyKey ? (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">#{badge.competencyKey}</p>
            ) : null}
            <p className="mt-1 text-xs text-slate-400">
              {badge.issuerName} · {formatDate(badge.issuedAt)}
            </p>
            {badge.standard ? <p className="mt-1 text-xs text-slate-400">{badge.standard}</p> : null}
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <CredentialKindBadge kind={badge.kind} />
              <CredentialStatusBadge status={badge.status} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
