import { ModulePlaceholder } from '@/components/layout';

export default function PublishingPage() {
  return (
    <ModulePlaceholder
      title="Scholarly Publishing Platform"
      subtitle="Streamline journal submission, peer review, and publication workflows for modern publishers."
      moduleName="Scholarly Publishing Platform"
      description="The scholarly publishing platform supports journal submission workflows, editorial and peer review management, publication scheduling, and cross-journal discovery."
      plannedFeatures={[
        'Journal submission workflows',
        'Peer review management',
        'Editorial decision tracking',
        'Publication scheduling',
        'Publisher and journal analytics',
        'Cross-journal discovery',
      ]}
    />
  );
}
