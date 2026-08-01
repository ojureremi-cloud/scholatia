import { ModulePlaceholder } from '@/components/layout';

export default function EventsPage() {
  return (
    <ModulePlaceholder
      title="Scholarly Events"
      subtitle="Manage global conferences and academic gatherings with trusted scheduling, registration, and insight tools."
      moduleName="Scholarly Events Platform"
      description="The events platform supports conference planning, call for papers, registration, speaker and committee management, and event verification across the scholarly community."
      plannedFeatures={[
        'Conference and event scheduling',
        'Call for papers and submissions',
        'Registration management',
        'Speaker and committee management',
        'Venue and sponsorship tools',
        'Event analytics and verification',
      ]}
    />
  );
}
