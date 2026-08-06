import type { ReasoningTrace } from '@/types/crie';
import { REASONING_PARADIGMS } from '@/types/crie';
import { CRIEStats } from '../core';
import type { CRIEStat } from '../core';
import { Panel, Stack } from '../primitives';
import { formatNumber, formatPercent, reasoningParadigmLabel } from '../format';
import { ReasoningParadigms } from './ReasoningParadigms';

type ReasoningOverviewProps = {
  traces: ReasoningTrace[];
};

export function ReasoningOverview({ traces }: ReasoningOverviewProps) {
  const averageConfidence =
    traces.reduce((sum, trace) => sum + trace.confidence.value, 0) / Math.max(1, traces.length);
  const withConclusion = traces.filter((trace) => trace.conclusion).length;
  const byParadigm = REASONING_PARADIGMS.map((paradigm) => ({
    paradigm,
    count: traces.filter((trace) => trace.paradigm === paradigm).length,
  })).filter((group) => group.count > 0);

  const stats: CRIEStat[] = [
    { title: 'Traces', value: formatNumber(traces.length), icon: '🧭' },
    { title: 'With conclusion', value: formatNumber(withConclusion), icon: '🎯' },
    { title: 'Avg confidence', value: formatPercent(averageConfidence), icon: '📏' },
    { title: 'Paradigms', value: formatNumber(byParadigm.length), icon: '🧩' },
  ];

  return (
    <Stack>
      <CRIEStats stats={stats} />
      <Panel eyebrow="Reasoning engine" title="Traces by paradigm" icon="🧭">
        {byParadigm.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">No reasoning traces yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {byParadigm.map((group) => (
              <div key={group.paradigm} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-lg" aria-hidden="true">🧩</span>
                  <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatNumber(group.count)}</span>
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">{reasoningParadigmLabel(group.paradigm)}</p>
              </div>
            ))}
          </div>
        )}
      </Panel>
      <ReasoningParadigms />
    </Stack>
  );
}
