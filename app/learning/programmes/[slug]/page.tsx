import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import Alert from '@/components/ui/Alert';
import { LearningBreadcrumb, LearningNavigation, ProgrammeDetail, ProgrammesCrumb } from '@/components/learning';
import { LEARNING_PROGRAMMES } from '@/constants/placeholder-learning';

type ProgrammeDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProgrammeDetailPage({ params }: ProgrammeDetailPageProps) {
  const { slug } = await params;
  const programme = LEARNING_PROGRAMMES.find((entry) => entry.slug === slug);

  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <LearningNavigation />
        <div className="mt-10">
          <LearningBreadcrumb crumbs={[ProgrammesCrumb(), { label: programme ? programme.title : 'Programme' }]} />
          <PageHeader
            title={programme ? programme.title : 'Programme'}
            subtitle={programme ? programme.description : `Programme ${slug}`}
          />
          {programme ? (
            <ProgrammeDetail programmeId={programme.id} />
          ) : (
            <Alert
              variant="danger"
              title="Programme not found"
              description={`No programme exists with the slug ${slug}.`}
            />
          )}
        </div>
      </Container>
    </PageLayout>
  );
}
