import { criePolicyModel } from '../data';
import { CRIEStats } from '../core';
import type { CRIEStat } from '../core';
import { Panel, Stack, Chip } from '../primitives';
import { formatNumber } from '../format';

const DECISION_TONE: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
  grant: 'success',
  'pending-approval': 'warning',
  refuse: 'danger',
};

export function PolicyCentre() {
  const model = criePolicyModel();

  const stats: CRIEStat[] = [
    { title: 'Rules', value: formatNumber(model.statistics.rules), icon: '📜' },
    { title: 'Grants', value: formatNumber(model.statistics.grants), icon: '✅' },
    { title: 'Pending approval', value: formatNumber(model.statistics.pendingApproval), icon: '✋' },
    { title: 'Refusals', value: formatNumber(model.statistics.refusals), icon: '⛔' },
  ];

  return (
    <Stack>
      <CRIEStats stats={stats} />
      <Panel eyebrow="Policy engine" title="Rules for researcher actors" icon="📜">
        <p className="mb-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
          Default CRIE policy set: deny-by-default with explicit approvals. Verdicts below are evaluated for a researcher actor.
        </p>
        <ul className="space-y-3">
          {model.rules.map((rule, index) => {
            const verdict = model.verdicts[index];
            return (
              <li key={rule.id} className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      <code className="font-mono">{rule.key}</code> — {rule.description}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {rule.id} · applies to {rule.appliesTo.join(', ')} · {rule.allow ? 'allowed' : 'denied'}
                      {rule.approvalRequired ? ' · approval required' : ''}
                    </p>
                  </div>
                  {verdict ? (
                    <Chip tone={DECISION_TONE[verdict.decision] ?? 'default'}>{verdict.decision}</Chip>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      </Panel>
    </Stack>
  );
}
