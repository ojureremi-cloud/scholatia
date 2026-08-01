import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import SectionTitle from '@/components/ui/SectionTitle';
import SectionCard from '@/components/ui/SectionCard';
import Alert from '@/components/ui/Alert';
import {
  AwardCard,
  BudgetBreakdown,
  BudgetChart,
  DeliverableCard,
  EligibilityCard,
  FundingAgencyCard,
  FundingAnalytics,
  FundingCalendar,
  FundingCard,
  FundingCategoryCard,
  FundingDeadlineCard,
  FundingLifecycleCard,
  FundingMap,
  FundingRelationshipCard,
  FundingSearchPanel,
  FundingStatistics,
  GrantStatusCard,
  GrantTimeline,
  MilestoneCard,
  ProposalChecklist,
} from '@/components/funding';
import {
  FEATURED_OPPORTUNITIES,
  FUNDING_AGENCIES,
  FUNDING_AWARDS,
  FUNDING_CALENDAR,
  FUNDING_DEADLINES,
  FUNDING_GRANTS,
  FUNDING_LIFECYCLE_COVERAGE,
  FUNDING_OPPORTUNITIES,
  FUNDING_PORTFOLIO_ANALYTICS,
  FUNDING_PORTFOLIO_STATISTICS,
  FUNDING_RELATIONSHIPS,
} from '@/constants/placeholder-funding';

export default function FundingPage() {
  const featuredGrant = FUNDING_GRANTS[0];

  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Funding & Grants"
          subtitle="Grants, fellowships, scholarships, and research funding at the Funding stage (stage 4) of the research lifecycle."
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="secondary" size="sm" href="/research">
                Research dashboard
              </Button>
              <Button variant="outline" size="sm" href="/projects">
                Projects
              </Button>
            </div>
          }
        />

        <section>
          <SectionTitle
            eyebrow="Overview"
            title="Funding portfolio statistics"
            description="Aggregate signals across opportunities, agencies, awards, and the application pipeline."
          />
          <div className="mt-8">
            <FundingStatistics statistics={FUNDING_PORTFOLIO_STATISTICS} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Calls for proposals"
            title="Browse and search opportunities"
            description="Search the full catalogue of calls, filter by category, status, and region, and inspect proposal requirements."
          />
          <div className="mt-8">
            <FundingSearchPanel opportunities={FUNDING_OPPORTUNITIES} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Featured"
            title="Featured opportunities"
            description="High-priority calls selected across agencies, disciplines, and career stages."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-2">
            {FEATURED_OPPORTUNITIES.map((opportunity) => (
              <FundingCard key={opportunity.id} opportunity={opportunity} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Categories"
            title="Grant categories"
            description="The funding ecosystem grouped by category, with opportunities and awarded value."
          />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {FUNDING_PORTFOLIO_ANALYTICS.awardsByCategory.map((stat) => (
              <FundingCategoryCard
                key={stat.category}
                category={stat.category}
                count={stat.count}
                value={stat.value}
                currency={FUNDING_PORTFOLIO_ANALYTICS.awardCurrency}
              />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Agencies"
            title="Funding agencies"
            description="Twenty-five funding agencies spanning government, intergovernmental, foundation, philanthropic, industry, and institutional funders."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {FUNDING_AGENCIES.map((agency) => (
              <FundingAgencyCard key={agency.id} agency={agency} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Deadlines"
            title="Upcoming deadlines"
            description="Priority-ranked application deadlines across all open and upcoming calls."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <FundingDeadlineCard deadlines={FUNDING_DEADLINES} />
            <FundingCalendar entries={FUNDING_CALENDAR} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Portfolio"
            title={`Inside: ${featuredGrant.title}`}
            description="Application status, budget, deliverables, milestones, eligibility, and reporting for a single awarded grant."
          />
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <div className="space-y-8">
              <SectionCard eyebrow="Status" title="Grant status">
                <GrantStatusCard grant={featuredGrant} />
              </SectionCard>
              <SectionCard eyebrow="Timeline" title="Grant journey">
                <GrantTimeline grant={featuredGrant} />
              </SectionCard>
              <SectionCard eyebrow="Proposal" title="Application requirements">
                <ProposalChecklist requirements={featuredGrant.proposalRequirements} />
              </SectionCard>
            </div>
            <div className="space-y-8">
              <SectionCard eyebrow="Budget" title="Budget summary">
                <BudgetBreakdown budget={featuredGrant.budget} />
              </SectionCard>
              <SectionCard eyebrow="Budget" title="Budget allocation">
                <BudgetChart budget={featuredGrant.budget} />
              </SectionCard>
              <SectionCard eyebrow="Eligibility" title="Eligibility">
                <EligibilityCard eligibility={featuredGrant.eligibility} />
              </SectionCard>
            </div>
          </div>
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <SectionCard eyebrow="Outputs" title="Deliverables">
              <DeliverableCard deliverables={featuredGrant.deliverables} />
            </SectionCard>
            <SectionCard eyebrow="Progress" title="Milestones">
              <MilestoneCard milestones={featuredGrant.milestones} />
            </SectionCard>
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Awards"
            title="Recent awards"
            description="Funded research awarded across the portfolio, with amounts, partners, and funded research."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {FUNDING_AWARDS.map((award) => (
              <AwardCard key={award.id} award={award} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Analytics"
            title="Funding analytics"
            description="Success rate, budget utilisation, awards by category, and applications by discipline."
          />
          <div className="mt-8">
            <FundingAnalytics analytics={FUNDING_PORTFOLIO_ANALYTICS} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Global"
            title="Global funding map"
            description="Funding presence and awarded value by continent across the agency portfolio."
          />
          <div className="mt-8">
            <FundingMap
              byContinent={FUNDING_PORTFOLIO_ANALYTICS.fundingByContinent}
              currency={FUNDING_PORTFOLIO_ANALYTICS.awardCurrency}
            />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Lifecycle"
            title="Research lifecycle integration"
            description="Funding is stage 4 of the canonical research lifecycle, sitting immediately before the Research Project stage."
          />
          <div className="mt-8">
            <FundingLifecycleCard coverage={FUNDING_LIFECYCLE_COVERAGE} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Relationships"
            title="Cross-module relationships"
            description="Researchers, institutions, projects, datasets, manuscripts, journals, conferences, publications, and agencies connected to the funding ecosystem."
          />
          <div className="mt-8">
            <FundingRelationshipCard relationships={FUNDING_RELATIONSHIPS} />
          </div>
        </section>

        <div className="mt-16">
          <Alert
            variant="warning"
            title="Funding data is illustrative"
            description="Agencies, opportunities, grants, awards, budgets, deadlines, and statistics shown here are placeholders. Live data will be connected to sponsor portals, your Scholatia records, and the research lifecycle engine."
          />
        </div>
      </Container>
    </PageLayout>
  );
}
