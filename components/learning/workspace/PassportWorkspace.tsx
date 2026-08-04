'use client';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { WorkspaceEmptyState } from './WorkspaceEmptyState';
import { credentialKindIcon, credentialKindLabel, credentialStatusVariant, formatDate, formatHours } from '../format';
import useLearning from '@/hooks/useLearning';

export function PassportWorkspace() {
  const { passportWorkspace } = useLearning();
  const model = passportWorkspace();

  const achievementCards = [
    { label: 'Certificates', value: model.achievements.certificates, icon: '📜' },
    { label: 'Badges', value: model.achievements.badges, icon: '🏅' },
    { label: 'CPD records', value: model.achievements.cpdRecords, icon: '📚' },
    { label: 'CPD hours', value: formatHours(model.achievements.cpdHours), icon: '⏱️' },
  ];

  return (
    <>
      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Passport workspace
            </h2>
            <p className="mt-1 text-xs text-slate-400">Every credential you have earned, in one verifiable record.</p>
          </div>
          <Button size="sm" variant="outline" onClick={() => undefined} title="Export placeholder">
            ⬇️ Export passport
          </Button>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {achievementCards.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-slate-200 p-4 text-center dark:border-slate-700"
            >
              <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{card.value}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                {card.icon} {card.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {model.timeline.length === 0 ? (
        <WorkspaceEmptyState title="No credentials yet" description="Earned certificates and badges will appear here." />
      ) : null}

      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          Credential timeline
        </h2>
        <ol className="mt-5 space-y-4">
          {model.timeline.map((entry) => (
            <li key={entry.id} className="flex items-start gap-3">
              <span aria-hidden="true" className="mt-0.5 text-xl">
                {entry.kind === 'cpd'
                  ? '📚'
                  : credentialKindIcon(entry.kind as Parameters<typeof credentialKindIcon>[0])}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{entry.title}</p>
                  <Badge variant="default">
                    {entry.kind === 'cpd'
                      ? credentialKindLabel('cpd')
                      : credentialKindLabel(entry.kind as Parameters<typeof credentialKindLabel>[0])}
                  </Badge>
                </div>
                <p className="mt-0.5 text-xs text-slate-400">
                  {entry.issuerName} · {formatDate(entry.issuedAt)}
                </p>
                <p className="mt-0.5 text-xs text-slate-400">Verification: {entry.verificationReference}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          Verification
        </h2>
        {model.verification.length === 0 ? (
          <p className="mt-4 text-sm text-slate-400">No verifiable credentials yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {model.verification.map((item) => (
              <li key={item.reference} className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{item.title}</p>
                  <p className="text-xs text-slate-400">{item.reference}</p>
                </div>
                <Badge variant={credentialStatusVariant(item.status as Parameters<typeof credentialStatusVariant>[0])}>
                  {item.status}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
