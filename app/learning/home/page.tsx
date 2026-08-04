import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import {
  LearningBreadcrumb,
  LearningNavigation,
} from '@/components/learning';
import { StudentHome, WorkspaceLoading } from '@/components/learning/workspace';
import { Suspense } from 'react';

export default function LearningHomePage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <LearningNavigation />
        <div className="mt-10">
          <LearningBreadcrumb crumbs={[{ label: 'Home', href: '/learning/home' }]} />
          <PageHeader
            title="Student Home"
            subtitle="Courses, paths, goals, competencies, credentials, and announcements in one view."
          />
          <Suspense fallback={<WorkspaceLoading />}>
            <StudentHome />
          </Suspense>
        </div>
      </Container>
    </PageLayout>
  );
}
