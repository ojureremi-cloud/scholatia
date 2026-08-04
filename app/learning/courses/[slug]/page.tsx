import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import Alert from '@/components/ui/Alert';
import { CourseDetail, CoursesCrumb, LearningBreadcrumb, LearningNavigation } from '@/components/learning';
import { LEARNING_COURSES } from '@/constants/placeholder-learning';

type CourseDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { slug } = await params;
  const course = LEARNING_COURSES.find((entry) => entry.slug === slug);

  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <LearningNavigation />
        <div className="mt-10">
          <LearningBreadcrumb crumbs={[CoursesCrumb(), { label: course ? course.title : 'Course' }]} />
          <PageHeader
            title={course ? course.title : 'Course'}
            subtitle={course ? course.description : `Course ${slug}`}
          />
          {course ? (
            <CourseDetail courseId={course.id} />
          ) : (
            <Alert variant="danger" title="Course not found" description={`No course exists with the slug ${slug}.`} />
          )}
        </div>
      </Container>
    </PageLayout>
  );
}
