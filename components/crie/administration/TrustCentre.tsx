import { crieGraph } from '@/lib/crie/access';
import { crieTrustModel } from '../data';
import { CRIEStats } from '../core';
import type { CRIEStat } from '../core';
import { Panel, Stack, Chip, ProgressBar } from '../primitives';
import { formatNumber, formatPercent } from '../format';

export function TrustCentre() {
  const model = crieTrustModel(crieGraph());

  const stats: CRIEStat[] = [
    { title: 'Scores', value: formatNumber(model.statistics.total), icon: '🛡️' },
    { title: 'Entities', value: formatNumber(model.statistics.entities), icon: '🕸️' },
    { title: 'Relations', value: formatNumber(model.statistics.relations), icon: '🔗' },
    { title: 'High trust', value: formatNumber(model.statistics.high), icon: '✅' },
  ];

  const sorted = [...model.scores].sort((a, b) => b.trust - a.trust);

  return (
    <Stack>
      <CRIEStats stats={stats} />
      <Panel eyebrow="Trust engine" title="Trust scores" icon="🛡️">
        <p className="mb-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
          Trust propagates over the knowledge graph with calibrated confidence. Average trust is {formatPercent(model.statistics.averageTrust)}.
        </p>
        <ul className="space-y-3">
          {sorted.map((score) => (
            <li key={`${score.subjectType}-${score.subjectId}`} className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{score.subjectId}</p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {score.subjectType} · rule: <code className="font-mono">{score.rule}</code>
                  </p>
                </div>
                <Chip tone={score.trust >= 0.6 ? 'success' : score.trust >= 0.4 ? 'warning' : 'danger'}>
                  {formatPercent(score.trust)}
                </Chip>
              </div>
              <div className="mt-3">
                <ProgressBar percent={score.trust * 100} label={`${score.subjectId} trust`} />
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </Stack>
  );
}
