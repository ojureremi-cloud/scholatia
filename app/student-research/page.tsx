import { ModulePlaceholder } from '@/components/layout';

export default function StudentResearchPage() {
  return (
    <ModulePlaceholder
      title="Student Research"
      subtitle="A dedicated workspace for students to build academic portfolios, discover research opportunities, and connect with mentors."
      moduleName="Student Research"
      description="End-to-end support for students entering the scholarly ecosystem, from academic portfolios and research interests to scholarships, mentorship, and career pathways."
      plannedFeatures={[
        'Student profiles and academic portfolios',
        'Research interest development',
        'Scholarship and funding discovery',
        'Mentorship and community connections',
        'Conference participation and certificates',
        'Graduate and career opportunities',
      ]}
    />
  );
}
