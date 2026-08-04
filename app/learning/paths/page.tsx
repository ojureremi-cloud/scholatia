import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import { LearningBreadcrumb, LearningNavigation, LearningPathBrowser, PathsCrumb } from '@/components/learning';

export default function LearningPathsPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <LearningNavigation />
        <div className="mt-10">
          <LearningBreadcrumb crumbs={[PathsCrumb()]} />
          <PageHeader title="Learning Paths" subtitle="Personalised sequences of courses curated for your goals." />
          <LearningPathBrowser />
        </div>
      </Container>
    </PageLayout>
  );
}
