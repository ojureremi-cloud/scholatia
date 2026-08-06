import { notFound } from 'next/navigation';
import { crieOrchestrationPlan } from '@/lib/crie/access';
import { CRIEBreadcrumb, CRIEHeader, CRIELayout, AgentsCrumb } from '@/components/crie';
import { AgentDetail, AgentTaskList } from '@/components/crie/agents';
import { crieAgentModel } from '@/components/crie/data';
import { agentLabel } from '@/components/crie/format';

export default async function CRIEAgentDetailPage(props: { params: Promise<{ agent: string }> }) {
  const { agent: agentId } = await props.params;
  const plan = crieOrchestrationPlan();
  if (!plan) notFound();

  const model = crieAgentModel(plan, agentId);
  const knownAgents = plan.tasks.map((task) => task.agentId);
  if (model.tasks.length === 0 && !knownAgents.includes(agentId as Parameters<typeof agentLabel>[0])) notFound();

  return (
    <CRIELayout>
      <CRIEBreadcrumb crumbs={[AgentsCrumb(), { label: agentLabel(agentId as Parameters<typeof agentLabel>[0]) }]} />
      <CRIEHeader title={agentLabel(agentId as Parameters<typeof agentLabel>[0])} subtitle={`Agent · ${agentId}`} />
      <div className="space-y-10">
        <AgentDetail agent={model.agent} tasks={model.tasks} />
        <AgentTaskList tasks={model.tasks} />
      </div>
    </CRIELayout>
  );
}
