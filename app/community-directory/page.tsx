import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { CommunityBrowser } from '@/components/communities';

export default function CommunityDirectoryPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Community directory"
          subtitle="Browse the full Scholarly Communities Platform directory — search every community, filter by category, visibility, country, language, and discipline, sort by activity, recency, membership, followers, or output, and explore the exchange surface of each scholarly ecosystem."
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" size="sm" href="/communities/create">
                Create community
              </Button>
              <Button variant="outline" size="sm" href="/communities">
                Platform home
              </Button>
              <Button variant="outline" size="sm" href="/community-feed">
                Feed
              </Button>
            </div>
          }
        />

        <div className="mt-10">
          <CommunityBrowser />
        </div>
      </Container>
    </PageLayout>
  );
}
