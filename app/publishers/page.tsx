import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import SectionTitle from '@/components/ui/SectionTitle';
import SectionCard from '@/components/ui/SectionCard';
import Alert from '@/components/ui/Alert';
import {
  BookCard,
  BookSeriesCard,
  ConferencePortfolio,
  EditorialOfficeCard,
  ImprintCard,
  JournalPortfolio,
  ProceedingsCard,
  PublisherAnalytics,
  PublisherDirectory,
  PublisherHeader,
  PublisherMap,
  PublisherMetrics,
  PublisherRelationshipCard,
  PublisherStatistics,
  PublisherTimeline,
  PublishingDivisionCard,
  PublishingPolicyCard,
} from '@/components/publishers';
import {
  FEATURED_PUBLISHER,
  PUBLISHER_PORTFOLIO_ANALYTICS,
  PUBLISHER_PORTFOLIO_STATISTICS,
  PUBLISHER_RELATIONSHIPS,
  PUBLISHERS,
} from '@/constants/placeholder-publishers';

export default function PublishersPage() {
  const featured = FEATURED_PUBLISHER;
  const allJournals = PUBLISHERS.flatMap((publisher) => publisher.journals);
  const allConferences = PUBLISHERS.flatMap((publisher) => publisher.conferences);
  const allProceedings = PUBLISHERS.flatMap((publisher) => publisher.proceedings);
  const allEditorialOffices = PUBLISHERS.flatMap((publisher) => publisher.editorialOffices);
  const allPolicies = PUBLISHERS.flatMap((publisher) => publisher.policies);
  const allBooks = PUBLISHERS.flatMap((publisher) => publisher.books);

  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Publishers"
          subtitle="The scholarly publishing layer of the Scholatia ecosystem. Publishers sit across the publication stage (stage 11) and conference stage (stage 12) of the research lifecycle, managing journal portfolios, conference proceedings, books, editorial offices, and publishing policies."
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="secondary" size="sm" href="/journals">
                Journals
              </Button>
              <Button variant="outline" size="sm" href="/conferences">
                Conferences
              </Button>
            </div>
          }
        />

        <section>
          <SectionTitle
            eyebrow="Overview"
            title="Publisher portfolio statistics"
            description="Aggregate signals across publishers, journals, conferences, proceedings, books, editorial offices, and global coverage."
          />
          <div className="mt-8">
            <PublisherStatistics statistics={PUBLISHER_PORTFOLIO_STATISTICS} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Spotlight"
            title={featured.name}
            description="The Scholatia Press flagship publisher profile with divisions, imprints, book series, journal and conference portfolios, proceedings, books, editorial offices, publishing policies, metrics, and the full cross-module ecosystem."
          />
          <div className="mt-8">
            <PublisherHeader publisher={featured} />
            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <SectionCard eyebrow="Metrics" title="Publishing metrics">
                  <PublisherMetrics metrics={featured.metrics} />
                </SectionCard>
                <SectionCard eyebrow="Structure" title="Publishing divisions">
                  <PublishingDivisionCard divisions={featured.divisions} />
                </SectionCard>
                <SectionCard eyebrow="Structure" title="Imprints">
                  <ImprintCard imprints={featured.imprints} />
                </SectionCard>
                <SectionCard eyebrow="Structure" title="Book series">
                  <BookSeriesCard series={featured.bookSeries} />
                </SectionCard>
                <SectionCard eyebrow="Journal portfolio" title="Journals">
                  <JournalPortfolio journals={featured.journals} />
                </SectionCard>
                <SectionCard eyebrow="Conference portfolio" title="Conferences">
                  <ConferencePortfolio conferences={featured.conferences} />
                </SectionCard>
                <SectionCard eyebrow="Proceedings" title="Conference proceedings">
                  <ProceedingsCard proceedings={featured.proceedings} />
                </SectionCard>
                <SectionCard eyebrow="Books" title="Published books">
                  <BookCard books={featured.books} />
                </SectionCard>
              </div>
              <div className="space-y-6">
                <PublisherMap publishers={[featured]} />
                <SectionCard eyebrow="Editorial offices" title="Global editorial presence">
                  <EditorialOfficeCard offices={featured.editorialOffices} />
                </SectionCard>
                <SectionCard eyebrow="Policies" title="Publishing policies">
                  <PublishingPolicyCard policies={featured.policies} />
                </SectionCard>
                <PublisherTimeline entries={featured.timeline} />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Directory"
            title="Publisher directory"
            description="Every publisher in the portfolio with type, headquarters, journal and conference counts, trust score, and verification status."
          />
          <div className="mt-8">
            <PublisherDirectory publishers={PUBLISHERS} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Journal portfolios"
            title="Journals across the portfolio"
            description="Representative journal portfolios across every publisher, with quartile, impact factor, and open access status."
          />
          <div className="mt-8">
            <JournalPortfolio journals={allJournals} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Conference portfolios"
            title="Conferences across the portfolio"
            description="Conferences and symposia published or sponsored across the publisher portfolio."
          />
          <div className="mt-8">
            <ConferencePortfolio conferences={allConferences} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Proceedings"
            title="Conference proceedings"
            description="Peer-reviewed proceedings produced by publishers, including those derived from the existing conference portfolio."
          />
          <div className="mt-8">
            <ProceedingsCard proceedings={allProceedings} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Editorial offices"
            title="Editorial offices across the portfolio"
            description="Editorial, production, and regional offices that run the publishing operations."
          />
          <div className="mt-8">
            <EditorialOfficeCard offices={allEditorialOffices.slice(0, 12)} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Policies"
            title="Publishing policies across the portfolio"
            description="Open access, peer review, research integrity, ethics, data sharing, copyright, and diversity policies across publishers."
          />
          <div className="mt-8">
            <PublishingPolicyCard policies={allPolicies.slice(0, 12)} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Books"
            title="Books across the portfolio"
            description="Monographs, textbooks, handbooks, and reference works published across the portfolio."
          />
          <div className="mt-8">
            <BookCard books={allBooks.slice(0, 12)} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Analytics"
            title="Publisher analytics"
            description="Trust, open access share, publishers by type and continent, and output by division across the portfolio."
          />
          <div className="mt-8">
            <PublisherAnalytics analytics={PUBLISHER_PORTFOLIO_ANALYTICS} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Global"
            title="Global publishing map"
            description="Publisher headquarters and editorial presence by continent across the portfolio."
          />
          <div className="mt-8">
            <PublisherMap publishers={PUBLISHERS} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Relationships"
            title="Cross-module relationships"
            description="Journals, conferences, proceedings, manuscripts, datasets, projects, publications, researchers, institutions, and grants connected to the publishing ecosystem."
          />
          <div className="mt-8">
            <PublisherRelationshipCard relationships={PUBLISHER_RELATIONSHIPS} />
          </div>
        </section>

        <div className="mt-16">
          <Alert
            variant="warning"
            title="Publisher data is illustrative"
            description="Publishers, divisions, imprints, book series, editorial offices, policies, metrics, analytics, and statistics shown here are placeholders. Live data will be connected to publisher portals, Crossref and ISSN registries, and the research lifecycle engine."
          />
        </div>
      </Container>
    </PageLayout>
  );
}
