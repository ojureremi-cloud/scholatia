import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { CommunityForm } from '@/components/communities';

export default function CreateCommunityPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Create a community"
          subtitle="Found a new scholarly community on the Scholarly Communities Platform — a research centre, consortium, scholarly collective, journal community, conference community, professional network, open science collective, or working group. The new community is owned by the signed-in researcher and seeded with the canonical visibility and verification defaults."
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" size="sm" href="/communities">
                All communities
              </Button>
            </div>
          }
        />

        <div className="mt-10">
          <CommunityForm />
        </div>
      </Container>
    </PageLayout>
  );
}
