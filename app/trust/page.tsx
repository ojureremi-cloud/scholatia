import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import SectionTitle from '@/components/ui/SectionTitle';
import Alert from '@/components/ui/Alert';
import {
  AcademicIdentityCard,
  BadgeAwardCard,
  CitationImpactCard,
  CitationSuggestionCard,
  CollaboratorCard,
  ConferenceQualityCard,
  ConferenceRecommendationCard,
  EditorialReputationCard,
  GrantSuggestionCard,
  InstitutionalRankingCard,
  IntegrityEventCard,
  JournalRecommendationCard,
  PeerReviewAssignmentCard,
  PeerReviewInfrastructure,
  RecommendationEnginePanel,
  ReputationCard,
  ResearchIntegrityReportCard,
  ResearchQualityCard,
  ReviewerRecommendationCard,
  ReviewerLeaderboard,
  TrustAnalytics,
  TrustBadges,
  TrustScoreCard,
  TrustStatistics,
  VerificationEngineSummary,
  VerificationRecordCard,
} from '@/components/trust';
import {
  FEATURED_ASSIGNMENT,
  FEATURED_BADGE_AWARD,
  FEATURED_INTEGRITY_EVENT,
  FEATURED_RECOMMENDATION,
  FEATURED_VERIFICATION,
  FOCUS_TRUST_REPORT,
  TRUST_ACADEMIC_IDENTITY_REPORT,
  TRUST_ANALYTICS,
  TRUST_BADGE_AWARDS,
  TRUST_BADGE_DEFINITIONS,
  TRUST_CITATION_SUGGESTIONS,
  TRUST_INTEGRITY_REPORT,
  TRUST_PEER_REVIEW_REPORT,
  TRUST_RECOMMENDATION_ENGINE,
  TRUST_RECOMMENDED_COLLABORATORS,
  TRUST_RECOMMENDED_CONFERENCES,
  TRUST_RECOMMENDED_JOURNALS,
  TRUST_RECOMMENDED_REVIEWERS,
  TRUST_REPUTATION_REPORTS,
  TRUST_STATISTICS,
  TRUST_SUGGESTED_GRANTS,
  TRUST_VERIFICATION_RECORDS,
  TRUST_VERIFICATION_SUMMARY,
} from '@/constants/placeholder-trust';

export default function TrustPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Trust, Verification & Reputation Engine"
          subtitle="The credibility layer of the Scholatia ecosystem. Trust observes the Researchers, Institutions, Journals, Conferences, Publishers, and Reviewers owned by the other modules — it verifies identities, scores reputations, awards badges, tracks peer review and research integrity, anchors academic identity on ORCID, and recommends verified collaborators, venues, reviewers, grants, and citations. Every record references the original source identity, so nothing is duplicated."
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="secondary" size="sm" href="/researchers">
                Researchers
              </Button>
              <Button variant="secondary" size="sm" href="/journals">
                Journals
              </Button>
              <Button variant="outline" size="sm" href="/institutions">
                Institutions
              </Button>
            </div>
          }
        />

        <section>
          <SectionTitle
            eyebrow="Featured verification"
            title={FEATURED_VERIFICATION.entityName}
            description="The strongest verification record in the engine: a researcher identity certified through institutional affiliation, identity documents, ORCID linkage, and cross-checked publication records."
          />
          <div className="mt-8">
            <VerificationRecordCard record={FEATURED_VERIFICATION} featured />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Verification engine"
            title="Verification overview"
            description="Every researcher, institution, journal, conference, and publisher certified by the verification engine, with the checks and evidence behind each record."
          />
          <div className="mt-8">
            <VerificationEngineSummary summary={TRUST_VERIFICATION_SUMMARY} />
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TRUST_VERIFICATION_RECORDS.map((record) => (
              <VerificationRecordCard key={record.id} record={record} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Featured reputation"
            title={FOCUS_TRUST_REPORT.entityName}
            description="The focus researcher's Scholatia Trust Score with its full factor breakdown, impact, editorial, and reviewer reputation surfaces."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <TrustScoreCard breakdown={FOCUS_TRUST_REPORT.trustScore} featured />
            <div className="grid gap-6">
              {FOCUS_TRUST_REPORT.researchImpact ? (
                <CitationImpactCard impact={FOCUS_TRUST_REPORT.researchImpact} />
              ) : null}
              {FOCUS_TRUST_REPORT.editorialReputation ? (
                <EditorialReputationCard editorial={FOCUS_TRUST_REPORT.editorialReputation} />
              ) : null}
            </div>
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Reputation engine"
            title="Reputation reports"
            description="Trust scores with weighted factor breakdowns for researchers, journals, conferences, institutions, and publishers across the ecosystem."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TRUST_REPUTATION_REPORTS.map((report) => (
              <ReputationCard key={report.id} report={report} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Quality surfaces"
            title="Impact, quality & rankings"
            description="The derived research impact, journal and conference quality indices, institutional rankings, reviewer reputations, and editorial service that feed the trust scores."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TRUST_REPUTATION_REPORTS.filter((report) => report.researchImpact).slice(0, 4).map((report) => (
              <CitationImpactCard key={report.id} impact={report.researchImpact!} />
            ))}
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TRUST_REPUTATION_REPORTS.filter((report) => report.journalQuality).slice(0, 4).map((report) => (
              <ResearchQualityCard key={report.id} quality={report.journalQuality!} />
            ))}
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TRUST_REPUTATION_REPORTS.filter((report) => report.conferenceQuality).slice(0, 4).map((report) => (
              <ConferenceQualityCard key={report.id} quality={report.conferenceQuality!} />
            ))}
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TRUST_REPUTATION_REPORTS.filter((report) => report.institutionalReputation).slice(0, 3).map((report) => (
              <InstitutionalRankingCard key={report.id} reputation={report.institutionalReputation!} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Overview"
            title="Trust statistics"
            description="Aggregate signals across the credibility layer: verified records, awarded badges, peer review throughput, integrity events, ORCID adoption, and average quality indices."
          />
          <div className="mt-8">
            <TrustStatistics statistics={TRUST_STATISTICS} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Badges"
            title={FEATURED_BADGE_AWARD.title}
            description="Badges the engine can award, the criteria behind each, and the entities that currently hold them."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <BadgeAwardCard award={FEATURED_BADGE_AWARD} featured />
          </div>
          <div className="mt-8">
            <TrustBadges definitions={TRUST_BADGE_DEFINITIONS} awards={TRUST_BADGE_AWARDS} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Peer review"
            title={FEATURED_ASSIGNMENT.manuscriptTitle}
            description="The peer review infrastructure: assignment tracking across blind, open, transparent, and post-publication models, with reviewer pool analytics and review history."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <PeerReviewAssignmentCard assignment={FEATURED_ASSIGNMENT} featured />
            <ReviewerLeaderboard reviewers={TRUST_ANALYTICS.reviewerLeaderboard} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Peer review infrastructure"
            title="Reviewer pool & assignment surface"
            description="Analytics for the reviewer pool and the full assignment and review-history surface."
          />
          <div className="mt-8">
            <PeerReviewInfrastructure report={TRUST_PEER_REVIEW_REPORT} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Research integrity"
            title={FEATURED_INTEGRITY_EVENT.title}
            description="Integrity events tracked as a first-class surface: retractions, corrections, expressions of concern, conflicts of interest, ethics approvals, and plagiarism status against the affected record."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <IntegrityEventCard event={FEATURED_INTEGRITY_EVENT} featured />
          </div>
          <div className="mt-8">
            <ResearchIntegrityReportCard report={TRUST_INTEGRITY_REPORT} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Academic identity"
            title="ORCID-anchored identity"
            description="The academic identity surface: ORCID integration, verified affiliation history, career milestones, and the academic timeline for the focus researcher."
          />
          <div className="mt-8">
            <AcademicIdentityCard report={TRUST_ACADEMIC_IDENTITY_REPORT} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Recommendations"
            title={FEATURED_RECOMMENDATION.title}
            description="The strongest trust-backed match for the focus researcher, ranked across collaborators, journals, conferences, reviewers, grants, and citations."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <CollaboratorCard recommendation={TRUST_RECOMMENDED_COLLABORATORS[0]} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Collaborator recommendations"
            title="Trusted collaborators"
            description="Verified researchers matched on shared interests, trust scores, and citation impact."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TRUST_RECOMMENDED_COLLABORATORS.map((recommendation) => (
              <CollaboratorCard key={recommendation.id} recommendation={recommendation} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Journal recommendations"
            title="Verified journal fits"
            description="Journals ranked by trust, quality index, and fit with the focus researcher's discipline."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TRUST_RECOMMENDED_JOURNALS.map((recommendation) => (
              <JournalRecommendationCard key={recommendation.id} recommendation={recommendation} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Conference recommendations"
            title="Quality conference fits"
            description="Conferences matched to the focus researcher's research areas, ranked by quality index."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TRUST_RECOMMENDED_CONFERENCES.map((recommendation) => (
              <ConferenceRecommendationCard key={recommendation.id} recommendation={recommendation} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Reviewer recommendations"
            title="Recommended reviewers"
            description="High-reputation reviewers ranked by reputation score and reliable turnaround."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TRUST_RECOMMENDED_REVIEWERS.map((recommendation) => (
              <ReviewerRecommendationCard key={recommendation.id} recommendation={recommendation} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Grant recommendations"
            title="Suggested funding"
            description="Open funding opportunities aligned with the focus researcher's discipline and career stage."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TRUST_SUGGESTED_GRANTS.map((recommendation) => (
              <GrantSuggestionCard key={recommendation.id} recommendation={recommendation} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Citation recommendations"
            title="Suggested citations"
            description="Increasingly cited, highly relevant sources worth citing in upcoming work."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TRUST_CITATION_SUGGESTIONS.map((recommendation) => (
              <CitationSuggestionCard key={recommendation.id} recommendation={recommendation} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Recommendation feed"
            title="Full recommendation feed"
            description="Every trust-backed recommendation across collaborators, journals, conferences, reviewers, grants, and citations, ranked together."
          />
          <div className="mt-8">
            <RecommendationEnginePanel report={TRUST_RECOMMENDATION_ENGINE} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Analytics"
            title="Trust analytics"
            description="Verification by entity type, badges by tier, trust score distribution, integrity by type, recommendations by type, the reviewer leaderboard, and most-reviewed journals."
          />
          <div className="mt-8">
            <TrustAnalytics analytics={TRUST_ANALYTICS} />
          </div>
        </section>

        <div className="mt-16">
          <Alert
            variant="warning"
            title="Trust data is illustrative"
            description="All verification records, trust scores, reputation reports, badge awards, peer review assignments, integrity events, ORCID links, and recommendations are derived from placeholder module data. Live verification will connect to ORCID, institutional registries, ISSN and indexing databases, retraction registries, and citation sources."
          />
        </div>
      </Container>
    </PageLayout>
  );
}
