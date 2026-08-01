import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import SectionTitle from '@/components/ui/SectionTitle';
import Alert from '@/components/ui/Alert';
import {
  AdvancedSearchPanel,
  DiscoveryAnalytics,
  DiscoveryCollectionCard,
  DiscoveryExplorer,
  DiscoveryRankingCard,
  DiscoveryRelationshipCard,
  DiscoveryStatistics,
  DiscoveryTimeline,
  FeaturedCollection,
  PopularSearches,
  RecentSearches,
  TrendingTopics,
} from '@/components/discovery';
import {
  DISCOVERY_ANALYTICS,
  DISCOVERY_COLLECTIONS,
  DISCOVERY_FACETS,
  DISCOVERY_CATEGORIES,
  DISCOVERY_ITEMS,
  DISCOVERY_RANKINGS,
  DISCOVERY_RELATIONSHIPS,
  DISCOVERY_STATISTICS,
  DISCOVERY_SUGGESTIONS,
  DISCOVERY_TIMELINE,
  FEATURED_COLLECTION,
} from '@/constants/placeholder-discovery';

export default function DiscoveryPage() {
  const trending = DISCOVERY_SUGGESTIONS.filter((suggestion) => suggestion.type === 'trending');
  const popular = DISCOVERY_SUGGESTIONS.filter((suggestion) => suggestion.type === 'popular');
  const recent = DISCOVERY_SUGGESTIONS.filter((suggestion) => suggestion.type === 'recent');

  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Scholarly Discovery"
          subtitle="The unified search surface of the Scholatia ecosystem. Discovery is a cross-module layer over researchers, journals, conferences, institutions, publishers, projects, publications, datasets, manuscripts, and funding — it keeps a live reference to every original record instead of duplicating data."
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="secondary" size="sm" href="/researchers">
                Researchers
              </Button>
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
            eyebrow="Search"
            title="Search the full ecosystem"
            description="One query across every module. Ranked results keep a canonical link back to the original record — a researcher profile, journal, conference, institution, publisher, project, publication, dataset, manuscript, or funding opportunity."
          />
          <div className="mt-8">
            <DiscoveryExplorer
              items={DISCOVERY_ITEMS}
              categories={DISCOVERY_CATEGORIES}
              facets={DISCOVERY_FACETS}
            />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Overview"
            title="Discovery index statistics"
            description="Aggregate signals across the unified index: searchable items by module, country, continent, discipline, and keyword coverage."
          />
          <div className="mt-8">
            <DiscoveryStatistics statistics={DISCOVERY_STATISTICS} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Trending"
            title="Trending topics"
            description="The fastest-rising queries across conferences, journals, datasets, researchers, and funding this week."
          />
          <div className="mt-8">
            <TrendingTopics topics={trending} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Popular"
            title="Popular searches"
            description="The most-returned queries across the platform, from multilingual NLP to digital humanities."
          />
          <div className="mt-8">
            <PopularSearches searches={popular} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Recent"
            title="Recent searches"
            description="Fresh activity across the index as new datasets, proceedings, and language resources arrive."
          />
          <div className="mt-8">
            <RecentSearches searches={recent} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Featured collection"
            title={FEATURED_COLLECTION.title}
            description="A curated cross-module collection surfacing the best-matching records from every part of the ecosystem."
          />
          <div className="mt-8">
            <FeaturedCollection collection={FEATURED_COLLECTION} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Collections"
            title="Curated collections"
            description="Keyword-matched collections that bundle journals, datasets, conferences, researchers, and funding around a theme."
          />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {DISCOVERY_COLLECTIONS.map((collection) => (
              <DiscoveryCollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Rankings"
            title="Top-ranked across the index"
            description="Leaderboards derived from the unified index: top-cited researchers, impact-factor journals, most-downloaded datasets, open funding, manuscript readiness, and project progress."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {DISCOVERY_RANKINGS.map((ranking) => (
              <DiscoveryRankingCard key={ranking.id} ranking={ranking} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Advanced"
            title="Advanced search"
            description="Refine by discipline, publication window, country, and status to narrow the unified index."
          />
          <div className="mt-8">
            <AdvancedSearchPanel />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Analytics"
            title="Discovery analytics"
            description="Search activity, items by category and discipline, and top keywords across the platform."
          />
          <div className="mt-8">
            <DiscoveryAnalytics analytics={DISCOVERY_ANALYTICS} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Relationships"
            title="Cross-module relationships"
            description="Edges derived from the existing modules: journals to publishers, researchers to institutions, manuscripts to target journals, conferences to proceedings publishers, datasets to institutions, publications to journals, projects to researchers, and funding to agencies."
          />
          <div className="mt-8">
            <DiscoveryRelationshipCard relationships={DISCOVERY_RELATIONSHIPS.slice(0, 12)} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Activity"
            title="Recent platform activity"
            description="The latest additions and updates across every module, surfaced on the unified index timeline."
          />
          <div className="mt-8">
            <DiscoveryTimeline entries={DISCOVERY_TIMELINE.slice(0, 12)} />
          </div>
        </section>

        <div className="mt-16">
          <Alert
            variant="warning"
            title="Discovery data is illustrative"
            description="The unified index, rankings, collections, relationships, and analytics are derived from placeholder module data. Live data will be connected to a hosted search index, Crossref and ISSN registries, grant registries, and the research lifecycle engine."
          />
        </div>
      </Container>
    </PageLayout>
  );
}
