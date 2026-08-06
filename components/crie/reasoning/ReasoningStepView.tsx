import type { ReasoningStep } from '@/types/crie';
import { Chip } from '../primitives';

type ReasoningStepViewProps = {
  step: ReasoningStep;
  isLast?: boolean;
};

const STEP_ICONS: Record<ReasoningStep['stepType'], string> = {
  premise: '📌',
  inference: '🧩',
  'evidence-lookup': '🧾',
  validation: '✅',
};

const STEP_TONE: Record<ReasoningStep['stepType'], 'info' | 'success' | 'default' | 'warning'> = {
  premise: 'info',
  inference: 'warning',
  'evidence-lookup': 'default',
  validation: 'success',
};

export function ReasoningStepView({ step, isLast = false }: ReasoningStepViewProps) {
  return (
    <li className="relative">
      <div className="flex gap-3">
        <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm dark:bg-slate-800" aria-hidden="true">
          {STEP_ICONS[step.stepType]}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400">#{step.order}</span>
            <Chip tone={STEP_TONE[step.stepType]}>{step.stepType}</Chip>
          </div>
          <p className="mt-1.5 text-sm leading-6 text-slate-700 dark:text-slate-200">{step.detail}</p>
          {step.evidenceChainIds.length > 0 ? (
            <p className="mt-1 text-xs text-slate-400">
              Evidence chains: <code className="font-mono">{step.evidenceChainIds.join(', ')}</code>
            </p>
          ) : null}
        </div>
      </div>
      {!isLast ? <span className="absolute left-4 top-10 h-[calc(100%-1.5rem)] w-px bg-slate-200 dark:bg-slate-700" aria-hidden="true" /> : null}
    </li>
  );
}
