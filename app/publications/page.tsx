import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import StatisticCard from '@/components/ui/StatisticCard';
import { PublicationSummary, PublicationCard } from '@/components/identity';
import { PLACEHOLDER_PUBLICATIONS } from '@/constants/placeholder-profile';

const placeholderSummary = {
  totalArticles: 24,
  totalCitations: 1560,
  hIndex: 12,
};

export default function PublicationsPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Publications"
          subtitle="Track your publication history, citations, and research impact."
        />
        <div className="mt-8">
          <PublicationSummary summary={placeholderSummary} />
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          <StatisticCard title="Journal Articles" value="14" />
          <StatisticCard title="Conference Papers" value="6" />
          <StatisticCard title="Preprints" value="4" />
        </div>
        <div className="mt-12 space-y-6">
          {PLACEHOLDER_PUBLICATIONS.map((article) => (
            <PublicationCard key={article.doi} {...article} />
          ))}
        </div>
      </Container>
    </PageLayout>
  );
}
