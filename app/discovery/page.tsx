import { ModulePlaceholder } from '@/components/layout';

export default function DiscoveryPage() {
  return (
    <ModulePlaceholder
      title="Scholarly Discovery Marketplace"
      subtitle="Find relevant conferences, journals, funding, and collaboration opportunities in one place."
      moduleName="Scholarly Discovery Marketplace"
      description="A unified discovery experience across the scholarly ecosystem, matching researchers with conferences, journals, funding, datasets, and collaboration partners."
      plannedFeatures={[
        'Unified discovery across the ecosystem',
        'Conference and event search',
        'Journal and publication search',
        'Funding opportunity matching',
        'Collaboration partner matching',
        'Personalised recommendations',
      ]}
    />
  );
}
