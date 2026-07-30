import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';

export default function InstitutionsPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Institutions"
          subtitle="Manage institutional profiles, departments, faculties, and research affiliations."
        />
      </Container>
    </PageLayout>
  );
}
