import React from 'react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

type OrcidStatusCardProps = {
  connected: boolean;
  orcidId: string;
  name: string;
  lastSynced: string;
  recordUrl: string;
};

export default function OrcidStatusCard({ connected, orcidId, name, lastSynced, recordUrl }: OrcidStatusCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">ORCID connection</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h3 className="font-mono text-lg font-semibold text-slate-900">{orcidId}</h3>
            <Badge variant={connected ? 'success' : 'default'}>{connected ? 'Connected' : 'Not connected'}</Badge>
          </div>
          <p className="mt-2 text-sm text-slate-600">Record owner: <span className="font-medium text-slate-700">{name}</span></p>
          <p className="mt-1 text-sm text-slate-500">Last synchronised {lastSynced}</p>
        </div>
      </div>
      <div className="mt-5 rounded-2xl bg-slate-50 p-4">
        <p className="text-sm leading-6 text-slate-600">
          Your ORCID iD uniquely distinguishes you from every other researcher. Linking it to Scholatia keeps your
          publications, affiliations, and peer review activity consistently attributed across the ecosystem.
        </p>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="primary">Synchronise with ORCID</Button>
        <Button variant="secondary" href={recordUrl}>View ORCID record</Button>
      </div>
    </div>
  );
}
