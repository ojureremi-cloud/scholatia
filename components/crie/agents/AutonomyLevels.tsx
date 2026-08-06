import { AUTONOMY_LEVELS, CRIE_AUTONOMY_LEVEL_LABELS } from '@/types/crie';
import { Panel, Chip } from '../primitives';

const AUTONOMY_DESCRIPTIONS: Record<string, string> = {
  'L1-assist': 'The agent assists the researcher with suggestions; the researcher acts.',
  'L2-advise': 'The agent analyses and advises; decisions remain with the researcher.',
  'L3-execute-checkpoint': 'The agent executes routine steps and pauses at checkpoints for approval.',
  'L4-execute-bounded': 'The agent executes within declared boundaries with audited escalation.',
  'L5-autonomous': 'The agent acts fully autonomously — disabled by default (CRIE §62.6).',
};

export function AutonomyLevels() {
  return (
    <Panel eyebrow="Agent governance" title="Autonomy levels" icon="🛡️">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {AUTONOMY_LEVELS.map((level) => (
          <div key={level} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{CRIE_AUTONOMY_LEVEL_LABELS[level]}</p>
              <Chip tone={level === 'L5-autonomous' ? 'danger' : 'info'}>{level}</Chip>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{AUTONOMY_DESCRIPTIONS[level]}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}
