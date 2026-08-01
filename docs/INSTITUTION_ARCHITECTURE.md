# Scholatia Institutions Architecture

## Purpose

The Institutions module is the **organisational backbone** of the Scholatia
scholarly ecosystem. It is the platform-wide layer under which every other
lifecycle stage operates: institutions verify SAIDs, host research projects,
employ researchers, accredit journals and conferences, and fund research.

The module does **not** introduce a new lifecycle stage. Instead it supports
every existing stage by embedding the existing `InstitutionProfile` (the
identity, verification, and trust record built in the Institution Management &
Verification Platform) inside a new enriched aggregate and layering the full
institutional ecosystem on top: campuses, faculties, departments, research
centres, laboratories, administrative units, statistics, rankings,
accreditations, research outputs, cross-module relationships, funding,
memberships, contacts, and a timeline.

The module is **additive**: it reuses the existing design system, existing page
patterns, and the existing `ResearchLifecycleEngine`. It introduces no duplicate
lifecycle definitions, no APIs, no database, no server actions, and no external
packages.

## Relationship to the Research Lifecycle

- Institutions support all 15 stages of the canonical Scholatia research
  lifecycle (`idea` → `knowledge-transfer`).
- Stage definitions are sourced at runtime from the `ResearchLifecycleEngine`
  (`lib/lifecycle.ts`), never hardcoded in the module:
  - `constants/placeholder-institutions.ts` derives
    `INSTITUTION_LIFECYCLE_COVERAGE` from
    `ResearchLifecycleEngine.getAllStages()`, `getCompletionPercentage`,
    `getPreviousStage`, and `getNextStage`.
  - The page renders coverage with the engine-derived completion percentages and
    previous/next stage names.
- Lifecycle position summary:

  ```
  Idea → Concept Note → Proposal → Funding → Project → Dataset → Analysis →
  Manuscript → Submission → Peer Review → Publication → Conference → Citation →
  Impact → Knowledge Transfer
  ```

- Cross-module relationships are declared per institution against the SAID
  ecosystem: projects, publications, manuscripts, datasets, journals,
  conferences, researchers (SAID), grants, and partners.

## Entity model

Types live in `types/institution.ts`.

| Entity | Description |
|---|---|
| `Institution` | Aggregate root: embeds the existing `InstitutionProfile` plus campuses, faculties, schools, departments, research centres, laboratories, administrative units, statistics, rankings, accreditations, research outputs, cross-module relationships, funding, memberships, partnerships, contacts, timeline, analytics, and verification status. |
| `Campus` | A physical campus: city, country, address, established year, area, faculties, facilities, student/academic staff counts, coordinates. |
| `Faculty` | An academic faculty: dean, established year, departments, programmes, student/staff counts, research focus. |
| `School` | A professional school: director, focus areas, programme/student counts. |
| `Department` | An academic department: head, faculty reference, research areas, programmes, staff/student counts, laboratories. |
| `ResearchCentre` | A research centre or institute: director, research themes, staff, active projects, publications, funding awarded. |
| `Laboratory` | A research laboratory: department reference, director, focus areas, equipment, capacity, access level (`Open` / `Restricted` / `Controlled` / `Private`). |
| `AdministrativeUnit` | Registry, research office, planning unit: responsibilities, staff, reporting line. |
| `InstitutionStatistics` | Students, faculty, staff, international students, alumni, programmes, faculties, departments, research centres, laboratories, campuses, postgraduates, undergraduates, acceptance/graduation rates. |
| `InstitutionRelationship` / `InstitutionRelationshipRef` | A cross-module reference (`id`, `title`, `detail`) connected to the institution. |
| `InstitutionRelationships` | Grouped relationships: projects, publications, manuscripts, datasets, journals, conferences, researchers, grants, partners. |
| `InstitutionAnalytics` | Research outputs, publications, citations, h-index, journals connected, conference papers, datasets published, active/completed projects, active grants, total funding, researchers, international partners, collaborations, publication trend. |
| `InstitutionRanking` | Ranking source, year, category, rank, total ranked, percentile, region, note. |
| `InstitutionAccreditation` | Accreditation body, country, status (`Accredited` / `Provisionally Accredited` / `Pending` / `Under Review` / `Revoked`), awarded/expiry years, scope, certification. |
| `InstitutionFunding` | Funding source, type (Grant / Endowment / Government Allocation / Industry / Philanthropy / Tuition / Research Contract), amount, currency, year, description. |
| `InstitutionMembership` | Member organisation, role, since year, status (`Active` / `Inactive` / `Pending`), description. |
| `InstitutionContact` | Contact entry: label, value, type (Email / Phone / Address / Website / Social / Other), primary flag. |
| `InstitutionTimelineEntry` | Timeline event: date, title, detail, type (Founded / Campus / Accreditation / Ranking / Partnership / Research / Leadership / Award). |
| `InstitutionResearchOutput` | Publication-style output: type, year, authors, venue, citations, DOI, funding source. |
| `InstitutionPortfolioStatistics` | Portfolio-level aggregates: total institutions, countries, universities, research institutes, students, faculty, campuses, faculties, departments, research centres, laboratories, publications, researchers, grants, partnerships, verified/accredited counts, average trust score. |
| `InstitutionLifecycleCoverage` | A lifecycle coverage row derived from the `ResearchLifecycleEngine`: stage id, name, description, icon, order, completion percentage, previous/next stage. |

### Aggregate structure

```
Institution
├── profile: InstitutionProfile        (identity, verification, trust)
├── campuses / faculties / schools
├── departments / researchCentres / laboratories / administrativeUnits
├── statistics / analytics / relationships
├── rankings / accreditations / funding / grants / memberships / partnerships
├── researchOutputs / publications / journals / conferences / datasets
├── researchers / contacts / timeline
└── verificationStatus
```

## Placeholder strategy

`constants/placeholder-institutions.ts` holds **20 globally distributed
universities** spanning Africa, Europe, North America, and Asia-Pacific.

Cross-module references are sourced from the existing placeholder modules so no
data is duplicated and every reference stays live:

| Relationship pool | Source |
|---|---|
| Publications | `WORKSPACE_PUBLICATIONS` (`placeholder-research.ts`) |
| Projects | `WORKSPACE_PROJECTS` (`placeholder-research.ts`) |
| Researchers | `RESEARCH_TEAM` + manuscript authors + dataset contributors (deduplicated by id) |
| Journals | `JOURNALS` (`placeholder-journals.ts`) |
| Conferences | `CONFERENCES` (`placeholder-conferences.ts`) |
| Datasets | `DATASETS` (`placeholder-datasets.ts`) |
| Manuscripts | `MANUSCRIPTS` (`placeholder-manuscripts.ts`) |
| Partners | Curated partner pool |

Helpers (`profileFor`, `sliceRotate`, `buildContacts`, `buildAnalytics`,
`buildRelationships`, `buildPortfolioStatistics`, `makeInstitution`) assemble
each institution deterministically from an index-based rotation of the pools.

Derived exports:

- `INSTITUTIONS` — the 20-institution portfolio.
- `FEATURED_INSTITUTION` — `INSTITUTIONS[0]` (University of Ibadan).
- `ALL_INSTITUTION_RANKINGS`, `ALL_INSTITUTION_ACCREDITATIONS`,
  `ALL_INSTITUTION_FUNDING` (funding + grants),
  `ALL_INSTITUTION_TIMELINE_ENTRIES`, `ALL_INSTITUTION_MEMBERSHIPS`.
- `INSTITUTION_PORTFOLIO_STATISTICS` — computed from the portfolio.
- `INSTITUTION_LIFECYCLE_COVERAGE` — derived from `ResearchLifecycleEngine`.

## Component map

All institution components live in `components/institutions/` and are
re-exported from `components/institutions/index.ts`. They consume existing UI
primitives (`PageLayout`, `PageHeader`, `SectionCard`, `SectionTitle`, `Alert`,
`StatisticCard`, `Timeline`, `Badge`, `Button`) and follow the card patterns
established by `components/conferences/*`.

| Component | Responsibility |
|---|---|
| `InstitutionHeader` | Featured-institution hero: logo, institution id/name, location, description, actions. |
| `InstitutionCard` | Portfolio card: logo, type, name, location, description, actions. |
| `InstitutionStatistics` | Headline stats grid (students, faculty, departments, research centres, laboratories, campuses). |
| `InstitutionBadge` | Verification status pill. |
| `InstitutionTrustBadge` | Trust score pill. |
| `InstitutionVerificationCard` | Verification status, last review, and verification history. |
| `InstitutionDirectoryCard` | Directory snapshot: type, country, founded, trust score, campus count. |
| `CampusCard` | Campus profile: location, area, established year, faculties, facilities. |
| `FacultyCard` | Faculty profile: dean, staff/student counts, research focus. |
| `DepartmentCard` | Department profile: head, research areas, laboratories, staff/student counts. |
| `ResearchCentreCard` | Centre profile: director, themes, staff, projects, publications, funding awarded. |
| `LaboratoryCard` | Laboratory profile: director, focus areas, equipment, capacity, access level. |
| `InstitutionAnalytics` | Analytics panel: metric grid plus publication-trend bar chart and total funding. |
| `InstitutionRelationshipCard` | Grouped cross-module relationship grid (projects, publications, manuscripts, datasets, journals, conferences, researchers, grants, partners). |
| `InstitutionTimeline` | Institutional history rendered with the `Timeline` primitive. |
| `InstitutionFundingCard` | Funding and grant cards with currency formatting. |
| `InstitutionRankingCard` | Ranking cards with rank/total, percentile, region. |
| `InstitutionAccreditationCard` | Accreditation cards with color-coded status badges. |
| `InstitutionMembershipCard` | Membership cards with status badges and roles. |
| `InstitutionContactCard` | Contact list with type and primary flags. |
| `InstitutionPortfolioStatistics` | Portfolio-level stat grid including the average trust score. |
| `InstitutionMapCard` | Campus locations with coordinates, facilities, and area. |
| `InstitutionResearchOverview` | Research output cards with type, venue, citations, and DOI. |
| `AffiliationTimeline` | Person-level affiliation history (identity module, unchanged). |

## Route

`app/institutions/page.tsx` composes the page from the placeholder data and the
component library. It is a server component that consumes the client components
above, following the exact composition pattern of `app/conferences/page.tsx`.

Page sections:

1. Header with cross-module navigation actions.
2. Portfolio statistics (`StatisticCard` grid + `InstitutionPortfolioStatistics`).
3. Featured institution spotlight (`InstitutionHeader`, structure, research,
   identity, contact, timeline).
4. Institutional analytics and connected research relationships.
5. Portfolio-wide funding, rankings, accreditations, memberships.
6. Global institution network (`InstitutionCard` grid).
7. Portfolio-wide faculties, departments, research centres, laboratories.
8. Research lifecycle coverage (derived from `ResearchLifecycleEngine`).
9. Placeholder-data disclaimer alert.

## Lifecycle integration

- No lifecycle logic is duplicated. All stage names, icons, order, completion
  percentages, and previous/next links come from `ResearchLifecycleEngine`.
- `INSTITUTION_LIFECYCLE_COVERAGE` is derived at module load from the engine and
  rendered on the page.
- Institutions are lifecycle-neutral: they host and fund every stage rather than
  occupying a stage of their own.

## Future persistence model

When the platform moves from placeholder data to live persistence, the
following layers will replace the constants:

- `institutions` table keyed by `said`, holding the aggregate root and an
  `institutionProfileId` reference to the existing identity/verification record.
- Child tables for `campuses`, `faculties`, `schools`, `departments`,
  `research_centres`, `laboratories`, and `administrative_units`.
- Reference tables for `rankings`, `accreditations`, `funding`, `memberships`,
  `contacts`, `research_outputs`, and `timeline_entries`.
- Join tables mapping institutions to projects, publications, manuscripts,
  datasets, journals, conferences, researchers, grants, and partners.
- `InstitutionLifecycleCoverage` and `InstitutionPortfolioStatistics` become
  query-backed aggregates while still sourcing stage definitions from
  `ResearchLifecycleEngine`.
