import { ModulePlaceholder } from '@/components/layout';

export default function CreateResearchProjectPage() {
  return (
    <ModulePlaceholder
      title="Create Research Project"
      subtitle="Start a new research project workspace and bring your team, funding, and milestones together."
      moduleName="Research project creation"
      description="The create-project workflow will let you define a new research project, attach team members, link funding and grants, and plan milestones across the research lifecycle."
      plannedFeatures={[
        'Project metadata and description',
        'Research team setup and roles',
        'Funding and grant linking',
        'Timeline and milestone planning',
        'Publication and dataset linking',
        'Collaboration invitations',
      ]}
    />
  );
}
