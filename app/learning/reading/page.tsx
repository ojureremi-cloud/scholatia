import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import {
  LearningBreadcrumb,
  LearningNavigation,
} from '@/components/learning';
import { ReadingWorkspace, WorkspaceLoading } from '@/components/learning/workspace';
import { Suspense } from 'react';

export default function LearningReadingPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <LearningNavigation />
        <div className="mt-10">
          <LearningBreadcrumb crumbs={[{ label: 'Reading', href: '/learning/reading' }]} />
          <PageHeader
            title="Reading Workspace"
            subtitle="Track readings, curate lists, and work through sequenced playlists."
          />
          <Suspense fallback={<WorkspaceLoading />}>
            <ReadingWorkspace />
          </Suspense>
        </div>
      </Container>
    </PageLayout>
  );
}
