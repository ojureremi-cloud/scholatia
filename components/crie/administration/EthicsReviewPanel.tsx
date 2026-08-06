import { crieSettingsModel } from '../data';
import { Panel, Stack, Chip, ConfidenceMeter } from '../primitives';
import { statusTone } from '../format';

const VERDICT_TONE: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
  approve: 'success',
  'conditionally-approve': 'warning',
  reject: 'danger',
  refer: 'info',
};

export function EthicsReviewPanel() {
  const model = crieSettingsModel();
  const { ethicsReview, ethicsDecision } = model;

  return (
    <Stack>
      <Panel eyebrow="Ethics" title={ethicsReview.id} icon="⚖️">
        <div className="flex flex-wrap gap-2">
          <Chip tone={statusTone(ethicsReview.status)}>{ethicsReview.status}</Chip>
          <Chip tone="info">{ethicsReview.reviewKind} review</Chip>
          <Chip>entity {ethicsReview.researchEntityId}</Chip>
        </div>
        <ul className="mt-5 space-y-3">
          {ethicsReview.assessments.map((assessment) => (
            <li key={assessment.id} className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{assessment.dimension}</p>
                <Chip tone={assessment.riskLevel === 'high' ? 'danger' : assessment.riskLevel === 'medium' ? 'warning' : 'success'}>
                  {assessment.riskLevel} risk
                </Chip>
              </div>
              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{assessment.notes}</p>
              <div className="mt-2 max-w-xs">
                <ConfidenceMeter confidence={assessment.confidence} showLabel={false} />
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel eyebrow="Ethics" title="Decision" icon="🗳️">
        <div className="flex flex-wrap items-center gap-2">
          <Chip tone={VERDICT_TONE[ethicsDecision.decision] ?? 'info'}>{ethicsDecision.decision}</Chip>
          <Chip>decided by {ethicsDecision.decidedBy.name ?? ethicsDecision.decidedBy.username}</Chip>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-700 dark:text-slate-200">{ethicsDecision.rationale}</p>
        {ethicsDecision.conditions.length > 0 ? (
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Conditions</p>
            <ul className="mt-2 space-y-1">
              {ethicsDecision.conditions.map((condition, index) => (
                <li key={index} className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  • {condition}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Panel>
    </Stack>
  );
}
