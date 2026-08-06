import { REASONING_PARADIGMS } from '@/types/crie';
import { Panel } from '../primitives';
import { reasoningParadigmLabel } from '../format';

const PARADIGM_DESCRIPTIONS: Record<string, string> = {
  symbolic: 'Rule-based derivation over structured premises with explicit inference rules.',
  probabilistic: 'Uncertainty handling with calibrated confidence over evidence.',
  causal: 'Cause–effect structure beyond correlation, supporting counterfactuals.',
  graph: 'Traversal and propagation over the Research Knowledge Graph.',
  educational: 'Explainable steps aligned to learner mastery and formative assessment.',
  research: 'Research-process reasoning binding premises to evidence chains (P3).',
};

export function ReasoningParadigms() {
  return (
    <Panel eyebrow="Reasoning engine" title="Paradigms" icon="🧩">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {REASONING_PARADIGMS.map((paradigm) => (
          <div key={paradigm} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{reasoningParadigmLabel(paradigm)}</p>
            <p className="mt-1.5 text-xs leading-5 text-slate-500 dark:text-slate-400">{PARADIGM_DESCRIPTIONS[paradigm]}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}
