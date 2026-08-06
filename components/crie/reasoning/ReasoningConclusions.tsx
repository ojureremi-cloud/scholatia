import type { ReasoningTrace } from '@/types/crie';
import { Panel, Chip, ConfidenceMeter } from '../primitives';
import { confidenceTone, formatRelative, reasoningParadigmLabel } from '../format';

type ReasoningConclusionsProps = {
  traces: ReasoningTrace[];
};

export function ReasoningConclusions({ traces }: ReasoningConclusionsProps) {
  const conclusions = traces.filter((trace) => trace.conclusion);

  return (
    <Panel eyebrow="Reasoning engine" title="Conclusions" icon="🎯">
      {conclusions.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">No conclusions drawn yet.</p>
      ) : (
        <ul className="space-y-3">
          {conclusions.map((trace) => (
            <li key={trace.id} className="rounded-2xl bg-slate-50 px-4 py-4 dark:bg-slate-800">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">{trace.conclusion?.statement}</p>
                <Chip tone={confidenceTone(trace.conclusion?.confidence ?? trace.confidence)}>
                  {reasoningParadigmLabel(trace.paradigm)}
                </Chip>
              </div>
              <div className="mt-3 max-w-md">
                <ConfidenceMeter confidence={trace.conclusion?.confidence ?? trace.confidence} showLabel={false} />
              </div>
              <p className="mt-2 text-xs text-slate-400">via {trace.id} · {formatRelative(trace.updatedAt)}</p>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
