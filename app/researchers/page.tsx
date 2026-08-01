import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import SectionTitle from '@/components/ui/SectionTitle';
import SectionCard from '@/components/ui/SectionCard';
import StatisticCard from '@/components/ui/StatisticCard';
import Alert from '@/components/ui/Alert';
import {
  AcademicIdentityCard,
  AcademicImpactCard,
  AcademicSkills,
  AwardCard,
  CitationMetricsCard,
  CollaborationNetwork,
  ConferenceCard,
  ContactCard,
  DatasetCard,
  EditorialAppointments,
  EducationCard,
  EmploymentCard,
  GrantCard,
  IdentitySummaryCard,
  InnovationCard,
  JournalCard,
  LanguageCard,
  MembershipCard,
  PatentCard,
  ProfileCompletionCard,
  ProjectCard,
  PublicationCard,
  PublicationTrendChart,
  RecentActivityCard,
  ResearchAnalyticsCard,
  ResearchInterestCard,
  ResearchMetrics,
  ResearchPortfolio,
  ResearchRelationshipCard,
  ResearchTimeline,
  ResearchVisibilityCard,
  ResearcherBiography,
  ResearcherCard,
  ResearcherHeader,
  SocialProfileCard,
  StartupCard,
  SupervisionCard,
  TeachingCard,
  VerificationCard,
  AcademicStatistics,
} from '@/components/researchers';
import {
  COUNTRY_DISTRIBUTION,
  DISCIPLINE_DISTRIBUTION,
  FEATURED_RESEARCHER,
  INSTITUTION_DISTRIBUTION,
  MOST_COLLABORATIVE_RESEARCHERS,
  RECENT_RESEARCHERS,
  RESEARCHER_LIFECYCLE_COVERAGE,
  RESEARCHER_PORTFOLIO_STATISTICS,
  RESEARCHERS,
  RESEARCH_INTEREST_GROUPS,
  TOP_CITED_RESEARCHERS,
  TRENDING_RESEARCHERS,
} from '@/constants/placeholder-researchers';

export default function ResearchersPage() {
  const featured = FEATURED_RESEARCHER;

  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Researchers"
          subtitle="The identity layer of the Scholatia ecosystem. Every researcher owns a permanent SAID identity and a personal academic website — a verified scholarly homepage that every other platform module connects back to."
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="secondary" size="sm" href="/identity">
                My identity
              </Button>
              <Button variant="outline" size="sm" href="/profile">
                My profile
              </Button>
            </div>
          }
        />

        <section>
          <SectionTitle
            eyebrow="Overview"
            title="Researcher portfolio statistics"
            description="An aggregate snapshot of the researcher portfolio across the Scholatia network."
          />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatisticCard
              title="Researchers"
              value={RESEARCHER_PORTFOLIO_STATISTICS.totalResearchers.toString()}
              icon="🧑‍🔬"
            />
            <StatisticCard
              title="Countries"
              value={RESEARCHER_PORTFOLIO_STATISTICS.totalCountries.toString()}
              trend="Global researcher coverage"
              trendPositive
              icon="🌍"
            />
            <StatisticCard
              title="Publications"
              value={RESEARCHER_PORTFOLIO_STATISTICS.totalPublications.toLocaleString('en-US')}
              icon="📄"
            />
            <StatisticCard
              title="Average trust score"
              value={`${RESEARCHER_PORTFOLIO_STATISTICS.avgTrustScore}/100`}
              icon="⭐"
            />
          </div>
          <div className="mt-8">
            <SectionCard eyebrow="Portfolio" title="Portfolio statistics breakdown">
              <AcademicStatistics statistics={RESEARCHER_PORTFOLIO_STATISTICS} />
            </SectionCard>
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Spotlight"
            title={featured.displayName}
            description="Flagship researcher profile — a permanent SAID identity with biography, position, metrics, teaching, supervision, analytics, verification, and the full cross-module ecosystem."
          />
          <div className="mt-8">
            <ResearcherHeader researcher={featured} />
            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <ResearcherBiography researcher={featured} />
                <SectionCard eyebrow="Identity" title="Academic identity">
                  <AcademicIdentityCard researcher={featured} />
                </SectionCard>
                <SectionTitle eyebrow="Metrics" title="Research metrics" className="mt-8" />
                <ResearchMetrics researcher={featured} />
                <SectionCard eyebrow="Portfolio" title="Research portfolio">
                  <ResearchPortfolio researcher={featured} />
                </SectionCard>
                <div className="grid gap-6 lg:grid-cols-2">
                  <CitationMetricsCard researcher={featured} />
                  <AcademicImpactCard researcher={featured} />
                </div>
                <SectionCard eyebrow="Interests" title="Research interests and areas">
                  <ResearchInterestCard researcher={featured} />
                </SectionCard>
                <div className="grid gap-6 lg:grid-cols-2">
                  <AcademicSkills researcher={featured} />
                  <LanguageCard researcher={featured} />
                </div>
                <SectionCard eyebrow="Memberships" title="Memberships and certifications">
                  <MembershipCard researcher={featured} />
                </SectionCard>
                <div className="grid gap-6 lg:grid-cols-2">
                  <EducationCard researcher={featured} />
                  <EmploymentCard researcher={featured} />
                </div>
                <div className="grid gap-6 lg:grid-cols-2">
                  <ProjectCard researcher={featured} />
                  <DatasetCard researcher={featured} />
                </div>
                <div className="grid gap-6 lg:grid-cols-2">
                  <PublicationCard researcher={featured} />
                  <JournalCard researcher={featured} />
                </div>
                <div className="grid gap-6 lg:grid-cols-2">
                  <ConferenceCard researcher={featured} />
                  <GrantCard researcher={featured} />
                </div>
                <div className="grid gap-6 lg:grid-cols-2">
                  <AwardCard researcher={featured} />
                  <PatentCard researcher={featured} />
                </div>
                <div className="grid gap-6 lg:grid-cols-2">
                  <InnovationCard researcher={featured} />
                  <StartupCard researcher={featured} />
                </div>
                <div className="grid gap-6 lg:grid-cols-2">
                  <TeachingCard researcher={featured} />
                  <SupervisionCard researcher={featured} />
                </div>
                <SectionCard eyebrow="Editorial" title="Editorial appointments">
                  <EditorialAppointments researcher={featured} />
                </SectionCard>
                <SectionCard eyebrow="Network" title="Collaboration network">
                  <CollaborationNetwork researcher={featured} />
                </SectionCard>
                <ResearchTimeline researcher={featured} />
                <SectionCard eyebrow="Relationships" title="Connected research">
                  <ResearchRelationshipCard researcher={featured} />
                </SectionCard>
              </div>
              <div className="space-y-6">
                <IdentitySummaryCard researcher={featured} />
                <PublicationTrendChart researcher={featured} />
                <SectionCard eyebrow="Visibility" title="Research visibility">
                  <ResearchVisibilityCard researcher={featured} />
                </SectionCard>
                <SectionCard eyebrow="Analytics" title="Researcher analytics">
                  <ResearchAnalyticsCard researcher={featured} />
                </SectionCard>
                <SectionCard eyebrow="Verification" title="Identity verification">
                  <VerificationCard researcher={featured} />
                </SectionCard>
                <SectionCard eyebrow="Completion" title="Profile completion">
                  <ProfileCompletionCard researcher={featured} />
                </SectionCard>
                <SectionCard eyebrow="Activity" title="Recent activity">
                  <RecentActivityCard researcher={featured} />
                </SectionCard>
                <SectionCard eyebrow="Contact" title="Contact and social profiles">
                  <ContactCard researcher={featured} />
                  <div className="mt-6">
                    <SocialProfileCard researcher={featured} />
                  </div>
                </SectionCard>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Directory"
            title="Researcher directory"
            description="Every researcher in the Scholatia identity portfolio with verified SAID identity, position, and personal academic website."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {RESEARCHERS.map((researcher) => (
              <ResearcherCard key={researcher.username} researcher={researcher} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Recently joined"
            title="New researchers"
            description="The most recent verified researcher identities on the network."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {RECENT_RESEARCHERS.map((researcher) => (
              <ResearcherCard key={researcher.username} researcher={researcher} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Impact"
            title="Top cited researchers"
            description="Researchers with the highest citation counts across the portfolio."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
            {TOP_CITED_RESEARCHERS.map((researcher) => (
              <ResearcherCard key={researcher.username} researcher={researcher} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Discovery"
            title="Trending researchers"
            description="Researchers with the highest current visibility scores."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {TRENDING_RESEARCHERS.map((researcher) => (
              <ResearcherCard key={researcher.username} researcher={researcher} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Network"
            title="Most collaborative researchers"
            description="Researchers with the largest collaboration networks on the platform."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {MOST_COLLABORATIVE_RESEARCHERS.map((researcher) => (
              <ResearcherCard key={researcher.username} researcher={researcher} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Interests"
            title="Research interest groups"
            description="The most common research interests across the researcher portfolio."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {RESEARCH_INTEREST_GROUPS.map((group) => (
              <div key={group.interest} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
                <p className="text-sm font-semibold text-slate-900">{group.interest}</p>
                <p className="mt-1 text-sm text-slate-500">{group.count} researcher{group.count === 1 ? '' : 's'}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          <section>
            <SectionTitle eyebrow="Distribution" title="By institution" />
            <div className="mt-6 space-y-2">
              {INSTITUTION_DISTRIBUTION.map((entry) => (
                <div key={entry.institution} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm shadow-card">
                  <span className="text-slate-700">{entry.institution}</span>
                  <span className="font-semibold text-slate-900">{entry.count}</span>
                </div>
              ))}
            </div>
          </section>
          <section>
            <SectionTitle eyebrow="Distribution" title="By country" />
            <div className="mt-6 space-y-2">
              {COUNTRY_DISTRIBUTION.map((entry) => (
                <div key={entry.country} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm shadow-card">
                  <span className="text-slate-700">{entry.country}</span>
                  <span className="font-semibold text-slate-900">{entry.count}</span>
                </div>
              ))}
            </div>
          </section>
          <section>
            <SectionTitle eyebrow="Distribution" title="By discipline" />
            <div className="mt-6 space-y-2">
              {DISCIPLINE_DISTRIBUTION.map((entry) => (
                <div key={entry.discipline} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm shadow-card">
                  <span className="text-slate-700">{entry.discipline}</span>
                  <span className="font-semibold text-slate-900">{entry.count}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Lifecycle"
            title="Research lifecycle coverage"
            description="Researchers own work at every stage of the canonical Scholatia research lifecycle, derived entirely from the ResearchLifecycleEngine."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {RESEARCHER_LIFECYCLE_COVERAGE.map((coverage) => (
              <div key={coverage.stageId} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xl">{coverage.icon}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                    Stage {coverage.order} of {RESEARCHER_LIFECYCLE_COVERAGE.length}
                  </span>
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-900">{coverage.name}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{coverage.description}</p>
                <div className="mt-3">
                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-sky-600"
                      style={{ width: `${coverage.completionPercentage}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{coverage.completionPercentage}% complete</p>
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                  {coverage.previousStage ? <span>Prev: {coverage.previousStage}</span> : <span>First stage</span>}
                  {coverage.nextStage ? <span>Next: {coverage.nextStage}</span> : <span>Final stage</span>}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-16">
          <Alert
            variant="warning"
            title="Researcher data is illustrative"
            description="Researchers, identities, publications, metrics, analytics, and statistics shown here are placeholders. Live data will be connected to ORCID, institutional registries, Crossref, and the Scholatia identity verification system."
          />
        </div>
      </Container>
    </PageLayout>
  );
}
