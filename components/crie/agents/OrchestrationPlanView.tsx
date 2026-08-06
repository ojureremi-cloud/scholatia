import type { OrchestrationPlan } from '@/types/crie';
import { Panel, Stack, Chip, ProgressBar } from '../primitives';
import { formatNumber, statusTone } from '../format';
import { AgentTaskList } from './AgentTaskList';

type OrchestrationPlanViewProps = {
  plan: OrchestrationPlan;
};

export function OrchestrationPlanView({ plan }: OrchestrationPlanViewProps) {
  const activePlan = plan;
  const doneCount = activePlan.tasks.filter((task) => task.status === 'done').length;
  const progress = (doneCount / Math.max(1, activePlan.tasks.length)) * 100;

  return (
    <Stack>
      <Panel eyebrow="Orchestrator" title={activePlan.intent} icon="🎼">
        <div className="flex flex-wrap items-center gap-2">
          <Chip tone="info">{activePlan.id}</Chip>
          <Chip tone={statusTone(activePlan.status)}>{activePlan.status}</Chip>
          <Chip>{formatNumber(activePlan.tasks.length)} tasks</Chip>
          {activePlan.budgets.tokens ? <Chip>{formatNumber(activePlan.budgets.tokens)} tokens budget</Chip> : null}
          {activePlan.budgets.timeMin ? <Chip>{formatNumber(activePlan.budgets.timeMin)} min</Chip> : null}
        </div>
        <div className="mt-5">
          <div className="mb-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Plan progress</span>
            <span className="font-semibold">{formatNumber(Math.round(progress))}%</span>
          </div>
          <ProgressBar percent={progress} label="Orchestration plan progress" />
        </div>
        <div className="mt-5">
          <AgentTaskList tasks={activePlan.tasks} />
        </div>
      </Panel>
    </Stack>
  );
}
