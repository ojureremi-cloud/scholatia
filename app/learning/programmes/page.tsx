import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import { LearningBreadcrumb, LearningNavigation, ProgrammeBrowser, ProgrammesCrumb } from '@/components/learning';

export default function ProgrammesPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <LearningNavigation />
        <div className="mt-10">
          <LearningBreadcrumb crumbs={[ProgrammesCrumb()]} />
          <PageHeader
            title="Programmes"
            subtitle="Structured research programmes with sequenced curricula and credentials."
          />
          <ProgrammeBrowser />
        </div>
      </Container>
    </PageLayout>
  );
}
