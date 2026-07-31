import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import StatisticCard from '@/components/ui/StatisticCard';
import { GrantCard } from '@/components/identity';
import { PLACEHOLDER_GRANTS } from '@/constants/placeholder-profile';

export default function GrantsPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Grants"
          subtitle="Research grants, fellowships, and funded projects."
        />
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          <StatisticCard title="Total Funding" value="£725k" />
          <StatisticCard title="Active Grants" value="2" />
          <StatisticCard title="Grants Completed" value="1" />
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {PLACEHOLDER_GRANTS.map((grant) => (
            <GrantCard key={`${grant.title}-${grant.period}`} {...grant} />
          ))}
        </div>
      </Container>
    </PageLayout>
  );
}
