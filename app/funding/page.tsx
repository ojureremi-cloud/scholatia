import { ModulePlaceholder } from '@/components/layout';

export default function FundingPage() {
  return (
    <ModulePlaceholder
      title="Funding Organisations"
      subtitle="Grant discovery, sponsor relationships, award tracking, and research investment intelligence."
      moduleName="Funding Organisations"
      description="A workspace for funding organisations and researchers to discover opportunities, manage sponsor relationships, track awards, and monitor funded research."
      plannedFeatures={[
        'Funding and grant discovery',
        'Sponsor relationship management',
        'Award tracking and administration',
        'Application and reporting workflows',
        'Funded project monitoring',
        'Research investment intelligence',
      ]}
    />
  );
}
