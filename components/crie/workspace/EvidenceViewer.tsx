import {
  CRIE_CLAIM_1,
  CRIE_CLAIM_2,
  CRIE_CLAIM_STATISTICS,
  CRIE_CONTRADICTION,
  CRIE_EVIDENCE_1,
  CRIE_EVIDENCE_2,
  CRIE_EVIDENCE_ASSESSMENTS,
} from '@/constants/placeholder-crie';
import { CRIEStats } from '../core';
import type { CRIEStat } from '../core';
import { Chip, ConfidenceMeter, Panel, Stack } from '../primitives';
import { confidenceTone, formatNumber, formatPercent } from '../format';

const CLAIMS = [CRIE_CLAIM_1, CRIE_CLAIM_2];
const EVIDENCE = [CRIE_EVIDENCE_1, CRIE_EVIDENCE_2];

const VERDICT_TONE: Record<string, 'success' | 'danger' | 'warning' | 'default'> = {
  supports: 'success',
  contradicts: 'danger',
  refutes: 'danger',
  neutral: 'default',
};

export function EvidenceViewer() {
  const stats: CRIEStat[] = [
    { title: 'Claims', value: formatNumber(CRIE_CLAIM_STATISTICS.total), icon: '💬' },
    { title: 'Supported', value: formatNumber(CRIE_CLAIM_STATISTICS.supported), icon: '✅' },
    { title: 'Refuted', value: formatNumber(CRIE_CLAIM_STATISTICS.refuted), icon: '❌' },
    { title: 'Avg confidence', value: formatPercent(CRIE_CLAIM_STATISTICS.averageConfidence), icon: '📏' },
  ];

  return (
    <Stack>
      <CRIEStats stats={stats} />

      <div className="grid gap-8 lg:grid-cols-2">
        {CLAIMS.map((claim) => {
          const assessments = CRIE_EVIDENCE_ASSESSMENTS.filter((assessment) => assessment.claimId === claim.id);
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
                {assessments.map((assessment) => {
                  const record = EVIDENCE.find((candidate) => candidate.id === assessment.evidenceRecordId);
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
            {EVIDENCE.map((record) => (
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

        <Panel eyebrow="Contradiction" title={CRIE_CONTRADICTION.id} icon="⚖️">
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
            Claim A <span className="font-semibold text-slate-900 dark:text-slate-100">{CRIE_CONTRADICTION.claimA}</span>
          </p>
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
            Claim B <span className="font-semibold text-slate-900 dark:text-slate-100">{CRIE_CONTRADICTION.claimB}</span>
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Chip tone="warning">Severity: {CRIE_CONTRADICTION.severity}</Chip>
            <Chip>State: {CRIE_CONTRADICTION.resolutionState}</Chip>
          </div>
        </Panel>
      </div>
    </Stack>
  );
}
