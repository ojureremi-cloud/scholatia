import { CRIEBreadcrumb, CRIEHeader, CRIELayout, AgentsCrumb } from '@/components/crie';
import { AgentsOverview } from '@/components/crie/agents';
import { AutonomyLevels } from '@/components/crie/agents';

export default function CRIEAgentsPage() {
  return (
    <CRIELayout>
      <CRIEBreadcrumb crumbs={[AgentsCrumb()]} />
      <CRIEHeader
        title="Agents"
        subtitle="Bounded-autonomy agent catalogue and orchestration plan with human-in-the-loop approval gates."
      />
      <div className="space-y-10">
        <AgentsOverview />
        <AutonomyLevels />
      </div>
    </CRIELayout>
  );
}
