import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { CommunityProfile } from '@/components/communities';
import { COMMUNITIES } from '@/constants/placeholder-communities';

type CommunityDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CommunityDetailPage({ params }: CommunityDetailPageProps) {
  const { slug } = await params;
  const community = COMMUNITIES.find((entry) => entry.slug === slug);

  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title={community ? community.name : 'Community'}
          subtitle={
            community
              ? `${community.category} · ${community.country} · ${community.discipline}`
              : `Community ${slug}`
          }
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" size="sm" href="/communities">
                All communities
              </Button>
              <Button variant="outline" size="sm" href="/communities/create">
                Create community
              </Button>
            </div>
          }
        />

        {community ? (
          <div className="mt-10">
            <CommunityProfile communityId={community.id} />
          </div>
        ) : (
          <div className="mt-10">
            <Alert variant="danger" title="Community not found" description={`No community exists with the slug ${slug}.`} />
          </div>
        )}
      </Container>
    </PageLayout>
  );
}
