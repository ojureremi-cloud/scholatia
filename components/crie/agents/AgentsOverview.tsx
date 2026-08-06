import { crieAgentsModel } from '../data';
import { CRIEStats } from '../core';
import type { CRIEStat } from '../core';
import { Panel, Stack, Chip } from '../primitives';
import { formatNumber } from '../format';
import { AgentList } from './AgentList';
import { OrchestrationPlanView } from './OrchestrationPlanView';

export function AgentsOverview() {
  const model = crieAgentsModel();

  const stats: CRIEStat[] = [
    { title: 'Agents', value: formatNumber(model.agents.length), icon: '🤖' },
    { title: 'Tasks', value: formatNumber(model.statistics.totalTasks), icon: '📋' },
    { title: 'Awaiting approval', value: formatNumber(model.statistics.awaitingApprovalTasks), icon: '✋' },
    { title: 'Running', value: formatNumber(model.running.length), icon: '⚙️' },
  ];

  return (
    <Stack>
      <CRIEStats stats={stats} />
      <div className="flex flex-wrap gap-2">
        {model.awaitingApproval.map((task) => (
          <Chip key={task.id} tone="warning">
            ✋ {task.step}
          </Chip>
        ))}
        {model.failed.map((task) => (
          <Chip key={task.id} tone="danger">
            ⚠️ {task.step}
          </Chip>
        ))}
      </div>

      <Panel eyebrow="Agent catalogue" title="Active agents" icon="🤖">
        <AgentList agents={model.agents} />
      </Panel>

      <OrchestrationPlanView />
    </Stack>
  );
}
