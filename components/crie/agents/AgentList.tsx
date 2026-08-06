import type { CRIEAgentView } from '../data';
import EmptyState from '@/components/ui/EmptyState';
import { AgentCard } from './AgentCard';

type AgentListProps = {
  agents: CRIEAgentView[];
};

export function AgentList({ agents }: AgentListProps) {
  if (agents.length === 0) {
    return <EmptyState title="No agents" description="No agents have been provisioned for this plan yet." />;
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {agents.map((agent) => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  );
}
