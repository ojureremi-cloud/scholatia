import Link from 'next/link';
import type { CRIEAgentView } from '../data';
import { Chip } from '../primitives';
import { agentUrl, autonomyLevelShort, statusTone } from '../format';

type AgentCardProps = {
  agent: CRIEAgentView;
};

const AGENT_ICONS: Record<string, string> = {
  'AG-01': '🧠',
  'AG-02': '💬',
  'AG-03': '🪟',
  'AG-04': '🧭',
  'AG-05': '🕸️',
  'AG-08': '🔍',
  'AG-09': '🧩',
  'AG-11': '🧠',
  'AG-12': '🧾',
  'AG-13': '🔗',
  'AG-14': '📄',
  'AG-15': '📚',
  'AG-16': '🕳️',
  'AG-18': '🧪',
  'AG-20': '📊',
  'AG-33': '📈',
};

export function AgentCard({ agent }: AgentCardProps) {
  const task = agent.task;
  return (
    <Link
      href={agentUrl(agent)}
      className="flex h-full flex-col rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-xl dark:bg-slate-800" aria-hidden="true">
          {AGENT_ICONS[agent.id] ?? '🤖'}
        </span>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-mono text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          {agent.id}
        </span>
      </div>
      <h3 className="mt-4 font-bold text-slate-900 dark:text-slate-100">{agent.label}</h3>
      {task ? (
        <div className="mt-3 flex-1">
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{task.step}</p>
          <div className="mt-3 flex items-center gap-2">
            <Chip tone={statusTone(task.status)}>{task.status}</Chip>
            <Chip>{task.priority} priority</Chip>
          </div>
        </div>
      ) : (
        <p className="mt-3 flex-1 text-sm text-slate-400">No task assigned in the current plan.</p>
      )}
      <div className="mt-4 border-t border-slate-100 pt-3 text-xs font-semibold text-slate-400 dark:border-slate-800">
        Autonomy {autonomyLevelShort('L3-execute-checkpoint')} envelope
      </div>
    </Link>
  );
}
