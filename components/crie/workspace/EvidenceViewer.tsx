import { crieClaims, crieContradictions, crieEvidence, crieEvidenceAssessments } from '@/lib/crie/access';
import { claimStatistics } from '@/lib/crie/evidence';
import { CRIEStats } from '../core';
import type { CRIEStat } from '../core';
import { Chip, ConfidenceMeter, Panel, Stack } from '../primitives';
import { confidenceTone, formatNumber, formatPercent } from '../format';

const VERDICT_TONE: Record<string, 'success' | 'danger' | 'warning' | 'default'> = {
  supports: 'success',
  contradicts: 'danger',
  refutes: 'danger',
  neutral: 'default',
};

export function EvidenceViewer() {
  const claims = crieClaims();
  const evidence = crieEvidence();
  const assessments = crieEvidenceAssessments();
  const contradiction = crieContradictions()[0];
  const claimStats = claimStatistics(claims, assessments);

  const stats: CRIEStat[] = [
    { title: 'Claims', value: formatNumber(claimStats.total), icon: '💬' },
    { title: 'Supported', value: formatNumber(claimStats.supported), icon: '✅' },
    { title: 'Refuted', value: formatNumber(claimStats.refuted), icon: '❌' },
    { title: 'Avg confidence', value: formatPercent(claimStats.averageConfidence), icon: '📏' },
  ];

  return (
    <Stack>
      <CRIEStats stats={stats} />

      <div className="grid gap-8 lg:grid-cols-2">
        {claims.map((claim) => {
          const claimAssessments = assessments.filter((assessment) => assessment.claimId === claim.id);
          return (
            <Panel key={claim.id} eyebrow="Claim" title={claim.statement} icon="💬">
              <div className="flex flex-wrap gap-2">
                <Chip tone={confidenceTone(claim.confidence)}>{claim.claimType}</Chip>
                <Chip>{claim.lifecycleState}</Chip>
              </div>
              <div className="mt-4">
                <ConfidenceMeter confidence={claim.confidence} />
              </div>
              <ul className="mt-4 space-y-2">
                {claimAssessments.map((assessment) => {
                  const record = evidence.find((candidate) => candidate.id === assessment.evidenceRecordId);
                  return (
                    <li key={`${assessment.claimId}-${assessment.evidenceRecordId}`} className="flex items-start justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{record?.summary ?? assessment.evidenceRecordId}</p>
                        <p className="mt-0.5 text-xs text-slate-400">Evidence · {assessment.evidenceRecordId}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <Chip tone={VERDICT_TONE[assessment.assessment] ?? 'default'}>{assessment.assessment}</Chip>
                        <p className="mt-1 text-xs text-slate-400">strength {formatPercent(assessment.strength)}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Panel>
          );
        })}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
        <Panel eyebrow="Evidence records" title="Supporting records" icon="🧾">
          <ul className="space-y-3">
            {evidence.map((record) => (
              <li key={record.id} className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{record.summary}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {record.evidenceType} · {record.provenance.sourceType} · {record.provenance.method}
                    </p>
                  </div>
                  <Chip tone={confidenceTone(record.confidence)}>{formatPercent(record.confidence.value)}</Chip>
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel eyebrow="Contradiction" title={contradiction?.id ?? 'None'} icon="⚖️">
          {contradiction ? (
            <>
              <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                Claim A <span className="font-semibold text-slate-900 dark:text-slate-100">{contradiction.claimA}</span>
              </p>
              <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                Claim B <span className="font-semibold text-slate-900 dark:text-slate-100">{contradiction.claimB}</span>
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Chip tone="warning">Severity: {contradiction.severity}</Chip>
                <Chip>State: {contradiction.resolutionState}</Chip>
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">No contradiction is on record.</p>
          )}
        </Panel>
      </div>
    </Stack>
  );
}
