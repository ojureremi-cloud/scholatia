import { PageLayout } from '@/components/layout';
import Container from '@/components/ui/Container';
import { LearningNavigation } from '@/components/learning';
import {
  AdminBreadcrumb,
  AdminLayout,
  AdminLoading,
  AdminNavigation,
  AdminSidebar,
  LearningAnalyticsCentre,
} from '@/components/learning/admin';
import { Suspense } from 'react';

export default function AnalyticsPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <LearningNavigation />
        <div className="mt-10">
          <AdminNavigation />
          <div className="mt-10">
            <AdminLayout sidebar={<AdminSidebar />}>
              <AdminBreadcrumb crumbs={[{ label: 'Analytics Centre', href: '/learning/analytics' }]} />
              <Suspense fallback={<AdminLoading />}>
                <LearningAnalyticsCentre />
              </Suspense>
            </AdminLayout>
          </div>
        </div>
      </Container>
    </PageLayout>
  );
}
