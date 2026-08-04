import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import {
  LearningBreadcrumb,
  LearningNavigation,
} from '@/components/learning';
import {
  LearningWorkspace,
  WorkspaceLoading,
} from '@/components/learning/workspace';
import { Suspense } from 'react';

export default function LearningWorkspacePage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <LearningNavigation />
        <div className="mt-10">
          <LearningBreadcrumb crumbs={[{ label: 'Workspace', href: '/learning/workspace' }]} />
          <PageHeader
            title="Learning Workspace"
            subtitle="Your personal learning workspace — reading, notes, journal, portfolio, and competency growth."
          />
          <Suspense fallback={<WorkspaceLoading />}>
            <LearningWorkspace />
          </Suspense>
        </div>
      </Container>
    </PageLayout>
  );
}
