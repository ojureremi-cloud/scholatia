import { PageLayout } from '@/components/layout';
import Container from '@/components/ui/Container';
import { LearningNavigation } from '@/components/learning';
import {
  AcademyDashboard,
  AdminBreadcrumb,
  AdminLayout,
  AdminLoading,
  AdminNavigation,
  AdminSidebar,
  DepartmentDashboard,
  FacultyDashboard,
  InstitutionDashboard,
} from '@/components/learning/admin';
import { Suspense } from 'react';

export default function InstitutionsPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <LearningNavigation />
        <div className="mt-10">
          <AdminNavigation />
          <div className="mt-10">
            <AdminLayout sidebar={<AdminSidebar />}>
              <AdminBreadcrumb crumbs={[{ label: 'Institutions', href: '/learning/institutions' }]} />
              <Suspense fallback={<AdminLoading />}>
                <InstitutionDashboard />
                <FacultyDashboard />
                <DepartmentDashboard />
                <AcademyDashboard />
              </Suspense>
            </AdminLayout>
          </div>
        </div>
      </Container>
    </PageLayout>
  );
}
