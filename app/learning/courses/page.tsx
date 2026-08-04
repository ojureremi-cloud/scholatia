import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import { CourseBrowser, CoursesCrumb, LearningBreadcrumb, LearningNavigation } from '@/components/learning';

export default function CoursesPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <LearningNavigation />
        <div className="mt-10">
          <LearningBreadcrumb crumbs={[CoursesCrumb()]} />
          <PageHeader title="Courses" subtitle="Browse published research courses and track your progress." />
          <CourseBrowser />
        </div>
      </Container>
    </PageLayout>
  );
}
