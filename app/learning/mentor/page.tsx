import { PageLayout } from '@/components/layout';
import Container from '@/components/ui/Container';
import { LearningNavigation } from '@/components/learning';
import {
  AdminBreadcrumb,
  AdminLayout,
  AdminLoading,
  AdminNavigation,
  AdminSidebar,
  MentorWorkspace,
} from '@/components/learning/admin';
import { Suspense } from 'react';

export default function MentorPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <LearningNavigation />
        <div className="mt-10">
          <AdminNavigation />
          <div className="mt-10">
            <AdminLayout sidebar={<AdminSidebar />}>
              <AdminBreadcrumb crumbs={[{ label: 'Mentor', href: '/learning/mentor' }]} />
              <Suspense fallback={<AdminLoading />}>
                <MentorWorkspace />
              </Suspense>
            </AdminLayout>
          </div>
        </div>
      </Container>
    </PageLayout>
  );
}
