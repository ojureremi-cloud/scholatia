import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import { LearningBreadcrumb, LearningDashboard, LearningNavigation } from '@/components/learning';

export default function LearningPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <LearningNavigation />
        <div className="mt-10">
          <LearningBreadcrumb crumbs={[]} />
          <PageHeader
            title="Learning"
            subtitle="Your research learning dashboard — courses, programmes, credentials, and recommendations."
          />
          <LearningDashboard />
        </div>
      </Container>
    </PageLayout>
  );
}
