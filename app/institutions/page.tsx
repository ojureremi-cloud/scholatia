import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import SectionTitle from '@/components/ui/SectionTitle';
import SectionCard from '@/components/ui/SectionCard';
import StatisticCard from '@/components/ui/StatisticCard';
import Alert from '@/components/ui/Alert';
import {
  CampusCard,
  DepartmentCard,
  FacultyCard,
  InstitutionAccreditationCard,
  InstitutionAnalytics,
  InstitutionBadge,
  InstitutionCard,
  InstitutionContactCard,
  InstitutionDirectoryCard,
  InstitutionFundingCard,
  InstitutionHeader,
  InstitutionMapCard,
  InstitutionMembershipCard,
  InstitutionPortfolioStatistics,
  InstitutionRankingCard,
  InstitutionRelationshipCard,
  InstitutionResearchOverview,
  InstitutionStatistics,
  InstitutionTimeline,
  InstitutionTrustBadge,
  InstitutionVerificationCard,
  LaboratoryCard,
  ResearchCentreCard,
} from '@/components/institutions';
import {
  ALL_INSTITUTION_ACCREDITATIONS,
  ALL_INSTITUTION_FUNDING,
  ALL_INSTITUTION_MEMBERSHIPS,
  ALL_INSTITUTION_RANKINGS,
  FEATURED_INSTITUTION,
  INSTITUTIONS,
  INSTITUTION_LIFECYCLE_COVERAGE,
  INSTITUTION_PORTFOLIO_STATISTICS,
} from '@/constants/placeholder-institutions';

export default function InstitutionsPage() {
  const featured = FEATURED_INSTITUTION;
  const allFaculties = INSTITUTIONS.flatMap((institution) => institution.faculties);
  const allDepartments = INSTITUTIONS.flatMap((institution) => institution.departments);
  const allResearchCentres = INSTITUTIONS.flatMap((institution) => institution.researchCentres);
  const allLaboratories = INSTITUTIONS.flatMap((institution) => institution.laboratories);

  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Institutions"
          subtitle="The institutional backbone of the Scholatia scholarly ecosystem. Institutions verify SAIDs, host research projects, employ researchers, accredit journals and conferences, and fund research across every stage of the research lifecycle."
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="secondary" size="sm" href="/manuscripts">
                Manuscripts
              </Button>
              <Button variant="outline" size="sm" href="/datasets">
                Datasets
              </Button>
            </div>
          }
        />

        <section>
          <SectionTitle
            eyebrow="Overview"
            title="Institution portfolio statistics"
            description="An aggregate snapshot of the institution portfolio, spanning universities and research institutes across the Scholatia network."
          />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatisticCard
              title="Institutions"
              value={INSTITUTION_PORTFOLIO_STATISTICS.totalInstitutions.toString()}
              icon="🏛️"
            />
            <StatisticCard
              title="Countries"
              value={INSTITUTION_PORTFOLIO_STATISTICS.totalCountries.toString()}
              trend="Global institutional coverage"
              trendPositive
              icon="🌍"
            />
            <StatisticCard
              title="Students"
              value={INSTITUTION_PORTFOLIO_STATISTICS.totalStudents.toLocaleString('en-US')}
              icon="🧑‍🎓"
            />
            <StatisticCard
              title="Average trust score"
              value={`${INSTITUTION_PORTFOLIO_STATISTICS.avgTrustScore}/100`}
              icon="⭐"
            />
          </div>
          <div className="mt-8">
            <SectionCard eyebrow="Portfolio" title="Portfolio statistics breakdown">
              <InstitutionPortfolioStatistics statistics={INSTITUTION_PORTFOLIO_STATISTICS} />
            </SectionCard>
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Spotlight"
            title={featured.profile.institutionName}
            description="Flagship institution profile with campuses, faculties, departments, research centres, laboratories, rankings, funding, analytics, and the full cross-module ecosystem."
          />
          <div className="mt-8">
            <InstitutionHeader institution={featured} />
            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <InstitutionStatistics institution={featured} />
                <SectionCard eyebrow="Structure" title="Campuses">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {featured.campuses.map((campus) => (
                      <CampusCard key={campus.id} campus={campus} />
                    ))}
                  </div>
                </SectionCard>
                <SectionCard eyebrow="Structure" title="Faculties">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {featured.faculties.map((faculty) => (
                      <FacultyCard key={faculty.id} faculty={faculty} />
                    ))}
                  </div>
                </SectionCard>
                <SectionCard eyebrow="Structure" title="Departments">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {featured.departments.map((department) => (
                      <DepartmentCard key={department.id} department={department} />
                    ))}
                  </div>
                </SectionCard>
                <SectionCard eyebrow="Research" title="Research centres">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {featured.researchCentres.map((centre) => (
                      <ResearchCentreCard key={centre.id} centre={centre} />
                    ))}
                  </div>
                </SectionCard>
                <SectionCard eyebrow="Research" title="Laboratories">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {featured.laboratories.map((laboratory) => (
                      <LaboratoryCard key={laboratory.id} laboratory={laboratory} />
                    ))}
                  </div>
                </SectionCard>
                <SectionCard eyebrow="Outputs" title="Research outputs">
                  <InstitutionResearchOverview outputs={featured.researchOutputs} />
                </SectionCard>
              </div>
              <div className="space-y-6">
                <InstitutionMapCard institution={featured} />
                <SectionCard eyebrow="Identity" title="Verification and trust">
                  <div className="flex flex-wrap gap-2">
                    <InstitutionBadge institution={featured} />
                    <InstitutionTrustBadge institution={featured} />
                  </div>
                  <div className="mt-4">
                    <InstitutionVerificationCard institution={featured} />
                  </div>
                </SectionCard>
                <SectionCard eyebrow="Directory" title="Directory snapshot">
                  <InstitutionDirectoryCard institution={featured} />
                </SectionCard>
                <SectionCard eyebrow="Contact" title="Contact details">
                  <InstitutionContactCard contacts={featured.contacts} />
                </SectionCard>
                <InstitutionTimeline entries={featured.timeline} />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Analytics"
            title="Institutional analytics"
            description="Research outputs, citations, grants, collaborations, and the publication trend for the featured institution."
          />
          <div className="mt-8">
            <SectionCard eyebrow="Analytics" title="Institution analytics">
              <InstitutionAnalytics analytics={featured.analytics} />
            </SectionCard>
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Relationships"
            title="Connected research"
            description="Projects, publications, manuscripts, datasets, journals, conferences, researchers, grants, and partners connected to the featured institution."
          />
          <div className="mt-8">
            <InstitutionRelationshipCard relationships={featured.relationships} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Funding"
            title="Institutional funding"
            description="Grants, endowments, government allocations, and industry funding across the institution portfolio."
          />
          <div className="mt-8">
            <SectionCard eyebrow="Funding" title="Funding and grants">
              <InstitutionFundingCard entries={ALL_INSTITUTION_FUNDING.slice(0, 12)} />
            </SectionCard>
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Rankings"
            title="Institution rankings"
            description="Global, regional, and national rankings across the institution portfolio."
          />
          <div className="mt-8">
            <InstitutionRankingCard rankings={ALL_INSTITUTION_RANKINGS.slice(0, 12)} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Accreditation"
            title="Institution accreditations"
            description="Quality bodies, professional councils, and regulatory accreditations across the institution portfolio."
          />
          <div className="mt-8">
            <InstitutionAccreditationCard accreditations={ALL_INSTITUTION_ACCREDITATIONS.slice(0, 12)} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Memberships"
            title="Institution memberships"
            description="University associations, research alliances, and academic networks across the institution portfolio."
          />
          <div className="mt-8">
            <InstitutionMembershipCard memberships={ALL_INSTITUTION_MEMBERSHIPS.slice(0, 12)} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Portfolio"
            title="Global institution network"
            description="Every institution in the Scholatia portfolio with type, location, and description."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {INSTITUTIONS.map((institution) => (
              <InstitutionCard key={institution.said} institution={institution} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Faculties"
            title="Faculties across the portfolio"
            description="Deans, departments, programmes, and research focus across every institution."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {allFaculties.slice(0, 12).map((faculty) => (
              <FacultyCard key={faculty.id} faculty={faculty} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Departments"
            title="Departments across the portfolio"
            description="Heads, programmes, research areas, and laboratories across every institution."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {allDepartments.slice(0, 12).map((department) => (
              <DepartmentCard key={department.id} department={department} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Research centres"
            title="Research centres across the portfolio"
            description="Directors, research themes, active projects, and funding awarded across the portfolio."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {allResearchCentres.map((centre) => (
              <ResearchCentreCard key={centre.id} centre={centre} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Laboratories"
            title="Laboratories across the portfolio"
            description="Directors, focus areas, equipment, and access levels across the portfolio."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {allLaboratories.map((laboratory) => (
              <LaboratoryCard key={laboratory.id} laboratory={laboratory} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Lifecycle"
            title="Research lifecycle coverage"
            description="Institutions support every stage of the canonical Scholatia research lifecycle, derived entirely from the ResearchLifecycleEngine."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {INSTITUTION_LIFECYCLE_COVERAGE.map((coverage) => (
              <div key={coverage.stageId} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xl">{coverage.icon}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                    Stage {coverage.order} of {INSTITUTION_LIFECYCLE_COVERAGE.length}
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
            title="Institution data is illustrative"
            description="Institutions, campuses, faculties, departments, research centres, laboratories, rankings, accreditations, funding, memberships, analytics, and statistics shown here are placeholders. Live data will be connected to institutional registries, accreditation bodies, funding agencies, and university data systems."
          />
        </div>
      </Container>
    </PageLayout>
  );
}
