import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import Alert from '@/components/ui/Alert';
import {
  LearningBreadcrumb,
  LearningNavigation,
  LearningPathDetail,
  PathsCrumb,
} from '@/components/learning';
import { LEARNING_PATHS } from '@/constants/placeholder-learning';

type LearningPathDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function LearningPathDetailPage({ params }: LearningPathDetailPageProps) {
  const { slug } = await params;
  const path = LEARNING_PATHS.find((entry) => entry.slug === slug);

  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <LearningNavigation />
        <div className="mt-10">
          <LearningBreadcrumb crumbs={[PathsCrumb(), { label: path ? path.title : 'Path' }]} />
          <PageHeader
            title={path ? path.title : 'Learning Path'}
            subtitle={path ? path.purpose : `Path ${slug}`}
          />
          {path ? (
            <LearningPathDetail pathId={path.id} />
          ) : (
            <Alert variant="danger" title="Path not found" description={`No learning path exists with the slug ${slug}.`} />
          )}
        </div>
      </Container>
    </PageLayout>
  );
}
