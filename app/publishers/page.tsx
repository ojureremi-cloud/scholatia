import { ModulePlaceholder } from '@/components/layout';

export default function PublishersPage() {
  return (
    <ModulePlaceholder
      title="Publishers"
      subtitle="Tools for publishers to manage editorial workflows, distribution, rights, and research dissemination."
      moduleName="Publisher Platform"
      description="A dedicated publisher workspace for editorial workflows, journal portfolios, rights management, and cross-publisher visibility across the scholarly ecosystem."
      plannedFeatures={[
        'Editorial workflow management',
        'Journal portfolio analytics',
        'Rights and licensing management',
        'Peer review coordination',
        'Cross-publisher visibility',
        'Research dissemination tools',
      ]}
    />
  );
}
