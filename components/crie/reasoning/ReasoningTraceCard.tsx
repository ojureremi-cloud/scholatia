import Link from 'next/link';
import type { ReasoningTrace } from '@/types/crie';
import { Chip, ConfidenceMeter } from '../primitives';
import { confidenceTone, formatNumber, reasoningParadigmLabel } from '../format';

type ReasoningTraceCardProps = {
  trace: ReasoningTrace;
};

export function ReasoningTraceCard({ trace }: ReasoningTraceCardProps) {
  return (
    <li>
      <Link
        href={`/crie/reasoning/${trace.id}`}
        className="block rounded-2xl bg-slate-50 px-4 py-4 transition hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
              {trace.conclusion ? trace.conclusion.statement : trace.id}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">
              {reasoningParadigmLabel(trace.paradigm)} · {formatNumber(trace.steps.length)} steps · {trace.id}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Chip tone={confidenceTone(trace.confidence)}>{Math.round(trace.confidence.value * 100)}%</Chip>
            {trace.refusals && trace.refusals.length > 0 ? <Chip tone="warning">refusals</Chip> : null}
          </div>
        </div>
        <div className="mt-3 max-w-md">
          <ConfidenceMeter confidence={trace.confidence} showLabel={false} />
        </div>
      </Link>
    </li>
  );
}
