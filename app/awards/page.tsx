import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import { AwardCard } from '@/components/identity';
import { PLACEHOLDER_AWARDS } from '@/constants/placeholder-profile';

export default function AwardsPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Awards"
          subtitle="Honours, prizes, and recognitions received."
        />
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {PLACEHOLDER_AWARDS.map((award) => (
            <AwardCard key={`${award.title}-${award.year}`} {...award} />
          ))}
        </div>
      </Container>
    </PageLayout>
  );
}
