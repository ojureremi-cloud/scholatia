import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import SectionTitle from '@/components/ui/SectionTitle';
import Alert from '@/components/ui/Alert';
import {
  AIInsightCard,
  CitationPredictionCard,
  CollaborationSuggestionCard,
  ConferenceRecommendationCard,
  DatasetRecommendationCard,
  EmergingTopicCard,
  ExpertiseMatchCard,
  FundingRecommendationCard,
  InstitutionRecommendationCard,
  IntelligenceAnalytics,
  IntelligenceStatistics,
  JournalRecommendationCard,
  KnowledgeGraph,
  RecommendationCard,
  ResearchForecastCard,
  ResearchGapCard,
  ResearchTrendCard,
  TrendingResearchMap,
} from '@/components/intelligence';
import {
  FEATURED_COLLABORATION,
  FEATURED_EMERGING_TOPIC,
  FEATURED_INSIGHT,
  FEATURED_RECOMMENDATION,
  FEATURED_TREND,
  INTELLIGENCE_ANALYTICS,
  INTELLIGENCE_CITATION_PREDICTIONS,
  INTELLIGENCE_COLLABORATION_SUGGESTIONS,
  INTELLIGENCE_CONFERENCE_RECOMMENDATIONS,
  INTELLIGENCE_DATASET_RECOMMENDATIONS,
  INTELLIGENCE_EMERGING_TOPICS,
  INTELLIGENCE_EXPERTISE_MATCHES,
  INTELLIGENCE_FUNDING_RECOMMENDATIONS,
  INTELLIGENCE_INSIGHTS,
  INTELLIGENCE_INSTITUTION_RECOMMENDATIONS,
  INTELLIGENCE_JOURNAL_RECOMMENDATIONS,
  INTELLIGENCE_KNOWLEDGE_GRAPH_EDGES,
  INTELLIGENCE_KNOWLEDGE_GRAPH_NODES,
  INTELLIGENCE_RECOMMENDATIONS,
  INTELLIGENCE_RESEARCH_FORECAST,
  INTELLIGENCE_RESEARCH_GAPS,
  INTELLIGENCE_STATISTICS,
  INTELLIGENCE_TRENDS,
} from '@/constants/placeholder-intelligence';

export default function IntelligencePage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Scholarly Intelligence Platform"
          subtitle="The AI layer of the Scholatia ecosystem. Intelligence observes the existing Researchers, Journals, Conferences, Publishers, Institutions, Projects, Funding, Datasets, Manuscripts, and Discovery modules — it derives insights, trends, predictions, recommendations, gaps, and a knowledge graph without owning a single record. Every signal references the original source identity, so nothing is duplicated."
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="secondary" size="sm" href="/researchers">
                Researchers
              </Button>
              <Button variant="secondary" size="sm" href="/journals">
                Journals
              </Button>
              <Button variant="outline" size="sm" href="/funding">
                Funding
              </Button>
            </div>
          }
        />

        <section>
          <SectionTitle
            eyebrow="Featured insight"
            title={FEATURED_INSIGHT.title}
            description="The strongest derived signal across the ecosystem right now, with the full insight feed below."
          />
          <div className="mt-8">
            <AIInsightCard insight={FEATURED_INSIGHT} featured />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Insights"
            title="Derived insights"
            description="Narrative signals generated from the unified index: trend alerts, opportunities, warnings, gaps, predictions, and recommendations across every module."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {INTELLIGENCE_INSIGHTS.map((insight) => (
              <AIInsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Overview"
            title="Intelligence statistics"
            description="Aggregate signals across the analytical layer: derived insights, recommendations, trends, predictions, collaboration pairs, knowledge graph coverage, and monitored geographies."
          />
          <div className="mt-8">
            <IntelligenceStatistics statistics={INTELLIGENCE_STATISTICS} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Trends"
            title={FEATURED_TREND.topic}
            description="The fastest-rising research topic in the unified index, ranked by momentum from the existing researchers, journals, conferences, datasets, and funding records."
          />
          <div className="mt-8">
            <ResearchTrendCard trend={FEATURED_TREND} featured />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Trend map"
            title="Research trend map"
            description="All tracked trends grouped by discipline, with momentum direction and magnitude."
          />
          <div className="mt-8">
            <TrendingResearchMap trends={INTELLIGENCE_TRENDS} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Emerging"
            title={FEATURED_EMERGING_TOPIC.topic}
            description="Early-adoption topics tracked by novelty, momentum, and potential, with the evidence sources that contributed."
          />
          <div className="mt-8">
            <EmergingTopicCard topic={FEATURED_EMERGING_TOPIC} featured />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Emerging topics"
            title="Emerging topic pipeline"
            description="Topics early in their adoption curve — ranked by potential and seeded from the strongest evidence in the ecosystem."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {INTELLIGENCE_EMERGING_TOPICS.map((topic) => (
              <EmergingTopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Recommendations"
            title={FEATURED_RECOMMENDATION.title}
            description="The strongest match across funding, journals, conferences, datasets, and institutions for the platform's focus researcher."
          />
          <div className="mt-8">
            <RecommendationCard recommendation={FEATURED_RECOMMENDATION} featured />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Funding intelligence"
            title="Funding recommendations"
            description="Open opportunities ranked against the focus researcher's discipline, career stage, and regional eligibility."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {INTELLIGENCE_FUNDING_RECOMMENDATIONS.map((recommendation) => (
              <FundingRecommendationCard key={recommendation.id} recommendation={recommendation} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Journal intelligence"
            title="Journal recommendations"
            description="Venues matched to researcher discipline fit, combined with live manuscript targeting demand."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {INTELLIGENCE_JOURNAL_RECOMMENDATIONS.map((recommendation) => (
              <JournalRecommendationCard key={recommendation.id} recommendation={recommendation} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Conference intelligence"
            title="Conference recommendations"
            description="Events aligned with researcher research areas, venue interests, and submission windows."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {INTELLIGENCE_CONFERENCE_RECOMMENDATIONS.map((recommendation) => (
              <ConferenceRecommendationCard key={recommendation.id} recommendation={recommendation} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Dataset intelligence"
            title="Dataset recommendations"
            description="Directly reusable data matched to researcher interests, with download and citation signals."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {INTELLIGENCE_DATASET_RECOMMENDATIONS.map((recommendation) => (
              <DatasetRecommendationCard key={recommendation.id} recommendation={recommendation} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Institutional intelligence"
            title="Institution recommendations"
            description="Partner institutions matched to researcher discipline profiles, with trust scores and research areas."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {INTELLIGENCE_INSTITUTION_RECOMMENDATIONS.map((recommendation) => (
              <InstitutionRecommendationCard key={recommendation.id} recommendation={recommendation} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Recommendation feed"
            title="Full recommendation feed"
            description="Every derived recommendation across funding, journals, conferences, datasets, and institutions, ranked together."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {INTELLIGENCE_RECOMMENDATIONS.map((recommendation) => (
              <RecommendationCard key={recommendation.id} recommendation={recommendation} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Citation intelligence"
            title="Citation predictions"
            description="Projected citation trajectories for researchers and publications, with current and forecast counts."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {INTELLIGENCE_CITATION_PREDICTIONS.map((prediction) => (
              <CitationPredictionCard key={prediction.id} prediction={prediction} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Collaboration intelligence"
            title="Collaboration suggestions"
            description="Research pairings surfaced from shared interests and complementary skills, including international pairs."
          />
          <div className="mt-8">
            <CollaborationSuggestionCard suggestion={FEATURED_COLLABORATION} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Collaboration pairs"
            title="Recommended collaboration pairs"
            description="Ranked pairings across the researcher network by collaboration potential."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {INTELLIGENCE_COLLABORATION_SUGGESTIONS.map((suggestion) => (
              <CollaborationSuggestionCard key={suggestion.id} suggestion={suggestion} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Researcher intelligence"
            title="Expertise matches"
            description="The best-matched researcher for each tracked topic, with the evidence that supports the match."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {INTELLIGENCE_EXPERTISE_MATCHES.map((match) => (
              <ExpertiseMatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Gaps"
            title="Research gaps"
            description="Under-served topics where the ecosystem lacks dedicated funding calls, datasets, journals, or conferences."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {INTELLIGENCE_RESEARCH_GAPS.map((gap) => (
              <ResearchGapCard key={gap.id} gap={gap} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Forecast"
            title="Research forecasts"
            description="Scenario-based projections for the leading trends, with accelerated, reference, and contained growth paths."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {INTELLIGENCE_RESEARCH_FORECAST.map((forecast) => (
              <ResearchForecastCard key={forecast.id} forecast={forecast} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Knowledge graph"
            title="Ecosystem knowledge graph"
            description="Representative records from every module connected by derived cross-module relationships. Node color indicates the source module; links reference the original records."
          />
          <div className="mt-8">
            <KnowledgeGraph
              nodes={INTELLIGENCE_KNOWLEDGE_GRAPH_NODES}
              edges={INTELLIGENCE_KNOWLEDGE_GRAPH_EDGES}
            />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Analytics"
            title="Intelligence analytics"
            description="Recommendations by type, insights by severity, trends by discipline, gaps by severity, top emerging topics, and model metrics."
          />
          <div className="mt-8">
            <IntelligenceAnalytics analytics={INTELLIGENCE_ANALYTICS} />
          </div>
        </section>

        <div className="mt-16">
          <Alert
            variant="warning"
            title="Intelligence data is illustrative"
            description="All insights, recommendations, trends, predictions, gaps, forecasts, and graph relationships are derived from placeholder module data. Live analytics will connect the unified index to citation databases, grant registries, journal and conference metadata, and the research lifecycle engine."
          />
        </div>
      </Container>
    </PageLayout>
  );
}
