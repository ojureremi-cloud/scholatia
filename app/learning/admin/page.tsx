import { PageLayout } from '@/components/layout';
import Container from '@/components/ui/Container';
import { LearningNavigation } from '@/components/learning';
import {
  AdminBreadcrumb,
  AdminLayout,
  AdminLoading,
  AdminNavigation,
  AdminSidebar,
  LearningAdministration,
} from '@/components/learning/admin';
import { Suspense } from 'react';

export default function AdminPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <LearningNavigation />
        <div className="mt-10">
          <AdminNavigation />
          <div className="mt-10">
            <AdminLayout sidebar={<AdminSidebar />}>
              <AdminBreadcrumb crumbs={[{ label: 'Administration', href: '/learning/admin' }]} />
              <Suspense fallback={<AdminLoading />}>
                <LearningAdministration />
              </Suspense>
            </AdminLayout>
          </div>
        </div>
      </Container>
    </PageLayout>
  );
}
