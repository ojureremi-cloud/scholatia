import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { CommunityGlobalFeed } from '@/components/communities';

export default function CommunityFeedPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Community feed"
          subtitle="Every announcement, scholar spotlight, and achievement published across all visible communities — announcements, spotlights, and achievements are aggregated and sorted by recency, computed by the pure engine from the typed community aggregate."
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" size="sm" href="/communities">
                All communities
              </Button>
              <Button variant="outline" size="sm" href="/community-directory">
                Directory
              </Button>
            </div>
          }
        />

        <div className="mt-10">
          <CommunityGlobalFeed />
        </div>

        <div className="mt-16">
          <Alert
            variant="warning"
            title="Feed is illustrative"
            description="Announcements, spotlights, and achievements are derived from the typed placeholder aggregate; the feed recomputes live as the engine ingests module events."
          />
        </div>
      </Container>
    </PageLayout>
  );
}
