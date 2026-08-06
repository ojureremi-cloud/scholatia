import type { CRIEAgentView } from '../data';
import type { OrchestrationTask } from '@/types/crie';
import { Panel, Stack, Chip, ListItem } from '../primitives';
import { autonomyLevelLabel } from '../format';
import { AgentTaskList } from './AgentTaskList';

type AgentDetailProps = {
  agent: CRIEAgentView;
  tasks: OrchestrationTask[];
};

export function AgentDetail({ agent, tasks }: AgentDetailProps) {
  return (
    <Stack>
      <Panel eyebrow="Agent" title={agent.label} icon="🤖">
        <div className="flex flex-wrap gap-2">
          <Chip tone="info">{agent.id}</Chip>
          <Chip>Autonomy: {autonomyLevelLabel('L3-execute-checkpoint')}</Chip>
          <Chip tone="success">authorised</Chip>
        </div>
        <dl className="mt-6 max-w-md space-y-2 text-sm">
          <ListItem label="Mission" value="Contribute to the active orchestration plan" />
          <ListItem label="Escalation" value="Escalate to researcher at checkpoints" />
          <ListItem label="Disabled by default" value="L5-autonomous" />
        </dl>
      </Panel>

      <Panel eyebrow="Agent" title="Assigned tasks" icon="📋">
        <AgentTaskList tasks={tasks} />
      </Panel>

      <Panel eyebrow="Agent" title="Autonomy envelope" icon="🛡️">
        <ul className="space-y-2 text-sm">
          {[
            'Boundaries: never access private memory without consent',
            'Requires approval for: methodology recommendation',
            'Checkpoint before any consequential action',
          ].map((boundary, index) => (
            <li key={index} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <span aria-hidden="true">•</span> {boundary}
            </li>
          ))}
        </ul>
      </Panel>
    </Stack>
  );
}
