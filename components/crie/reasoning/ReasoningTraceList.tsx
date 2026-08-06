import type { ReasoningParadigm, ReasoningTrace } from '@/types/crie';
import { REASONING_PARADIGMS } from '@/types/crie';
import { Panel, Chip } from '../primitives';
import { confidenceTone, formatDate, reasoningParadigmLabel } from '../format';
import { ReasoningTraceCard } from './ReasoningTraceCard';

type ReasoningTraceListProps = {
  traces: ReasoningTrace[];
};

export function ReasoningTraceList({ traces }: ReasoningTraceListProps) {
  const byParadigm = (paradigm: ReasoningParadigm) => traces.filter((trace) => trace.paradigm === paradigm).length;

  return (
    <Panel eyebrow="Reasoning engine" title="Traces" icon="🧭">
      <div className="mb-5 flex flex-wrap gap-2">
        {REASONING_PARADIGMS.map((paradigm) => (
          <Chip key={paradigm} tone={byParadigm(paradigm) > 0 ? 'info' : 'default'}>
            {reasoningParadigmLabel(paradigm)} · {byParadigm(paradigm)}
          </Chip>
        ))}
      </div>
      {traces.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">No traces recorded.</p>
      ) : (
        <ul className="space-y-4">
          {traces.map((trace) => (
            <ReasoningTraceCard key={trace.id} trace={trace} />
          ))}
        </ul>
      )}
      <p className="mt-4 text-xs text-slate-400">
        Latest trace {traces[0] ? formatDate(traces[0].createdAt) : '—'} · confidence tone {traces[0] ? confidenceTone(traces[0].confidence) : '—'}
      </p>
    </Panel>
  );
}
