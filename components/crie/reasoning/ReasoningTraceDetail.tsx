import type { ReasoningTrace } from '@/types/crie';
import { Panel, Stack, Chip, ConfidenceMeter } from '../primitives';
import { confidenceTone, formatDate, formatRelative, reasoningParadigmLabel } from '../format';
import { ReasoningStepView } from './ReasoningStepView';

type ReasoningTraceDetailProps = {
  trace: ReasoningTrace;
};

export function ReasoningTraceDetail({ trace }: ReasoningTraceDetailProps) {
  return (
    <Stack>
      <Panel eyebrow="Reasoning trace" title={reasoningParadigmLabel(trace.paradigm)} icon="🧭">
        <div className="flex flex-wrap gap-2">
          <Chip tone="info">{trace.paradigm}</Chip>
          <Chip tone={confidenceTone(trace.confidence)}>{Math.round(trace.confidence.value * 100)}% confidence</Chip>
          <Chip>{formatDate(trace.createdAt)}</Chip>
        </div>
        {trace.conclusion ? (
          <div className="mt-5 rounded-2xl bg-sky-50 px-5 py-4 dark:bg-sky-950">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">Conclusion</p>
            <p className="mt-1 text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">{trace.conclusion.statement}</p>
            <div className="mt-3 max-w-md">
              <ConfidenceMeter confidence={trace.conclusion.confidence} />
            </div>
          </div>
        ) : null}
        {trace.refusals && trace.refusals.length > 0 ? (
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">Refusals</p>
            <ul className="mt-2 space-y-1">
              {trace.refusals.map((refusal, index) => (
                <li key={index} className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950 dark:text-amber-200">
                  {refusal}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Panel>

      <Panel eyebrow="Reasoning trace" title="Steps" icon="🧩">
        {trace.steps.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">No steps recorded.</p>
        ) : (
          <ol className="space-y-4">
            {trace.steps.map((step, index) => (
              <ReasoningStepView key={step.order} step={step} isLast={index === trace.steps.length - 1} />
            ))}
          </ol>
        )}
        <p className="mt-6 text-xs text-slate-400">
          Trace {trace.id} · entity {trace.researchEntityId} · updated {formatRelative(trace.updatedAt)}
        </p>
      </Panel>
    </Stack>
  );
}
