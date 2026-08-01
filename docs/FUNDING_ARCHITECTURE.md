# Scholatia Funding & Grants Architecture

## Purpose

The Funding & Grants module implements **stage 4 (Funding)** of the canonical
Scholatia research lifecycle. It is the financial backbone of the research
ecosystem: the stage immediately before Research Projects (stage 5), where
grants, fellowships, scholarships, research funds, seed funding, innovation
funds, industry funding, government funding, NGO funding, international
funding, institutional funding, and venture research funding are discovered,
applied for, awarded, budgeted, and reported.

The module provides a route, a component library, a placeholder data model, and
strong TypeScript types for describing the full funding ecosystem: funding
agencies, programmes, calls, opportunities, grants, awards, budgets, budget
items, deliverables, milestones, funding timelines, eligibility, evaluation
criteria, proposal requirements, principal and co-investigators, partner and
industry institutions, funding relationships, funding analytics, funding
statistics, funding portfolios, and lifecycle coverage.

The module is **additive**: it reuses the existing design system, existing page
patterns, existing placeholder modules, and the existing
`ResearchLifecycleEngine`. It introduces no duplicate lifecycle definitions, no
APIs, no database, no server actions, no authentication changes, and no
external packages.

## Relationship to the Research Lifecycle

- All funding records are attached to the canonical stage id `funding`
  (`ResearchLifecycleStageId = 'funding'`, order 4), via the exported constant
  `FUNDING_LIFECYCLE_STAGE_ID` in `types/funding.ts`. Funding sits immediately
  before the Research Project stage (stage 5).
- The stage definition is sourced at runtime from the
  `ResearchLifecycleEngine` (`lib/lifecycle.ts`), never hardcoded in the module:
  - `constants/placeholder-funding.ts` derives `FUNDING_LIFECYCLE_STAGE` from
    `ResearchLifecycleEngine.getStage('funding')`.
  - `FUNDING_LIFECYCLE_COVERAGE` is built by mapping over
    `ResearchLifecycleEngine.getAllStages()`, carrying `order`,
    `completionPercentage`, `previousStage`, and `nextStage` for every stage.
  - `FundingLifecycleCard` highlights the funding stage and renders the full
    lifecycle coverage, resolving the previous stage (`proposal`) and next
    stage (`project`) purely from the engine.
- Lifecycle position summary:

  ```
  Proposal (3) → Funding (4) → Research Project (5)
  ```

- Cross-module relationships are declared per opportunity, grant, and at the
  portfolio level against the SAID ecosystem: Research Projects, Researchers
  (SAID identifiers), Institutions, Datasets, Manuscripts, Journals,
  Conferences, Publications, and Funding Agencies.

## Entity model

Types live in `types/funding.ts`.

| Entity | Description |
|---|---|
| `Grant` | Aggregate root: identity, agency and programme context, category, grant type, status, application stage, career stage, research areas, duration, funding amounts, dates (opened, deadline, decision, awarded, start, end), principal investigator, co-investigators, partner and industry institutions, budget, deliverables, milestones, timeline, eligibility, evaluation criteria, proposal requirements, grant number, reporting obligations, cross-module relationships, tags. |
| `FundingAgency` | A funder: name, acronym, type, country, region, continent, logo, website, founding year, description, mission, focus areas, disciplines, annual budget, currency, average award size, open opportunities, verification status, trust score, contact, programmes. |
| `FundingProgramme` | A named programme owned by an agency: name, description, category, focus areas, optional duration and funding envelope, and the calls belonging to it. |
| `GrantCall` | A specific call under a programme: title, description, category, status (`open`/`closed`/`upcoming`), open date, deadline, decision date, duration, funding, eligibility, research areas, evaluation criteria, proposal requirements, contact, application guidance. |
| `FundingOpportunity` | The surface-level discoverable view of a call: title, summary, agency, programme, category, grant type, status, career stage, opened/deadline/decision dates, duration, funding, eligibility, research areas, countries, continents, evaluation criteria, proposal requirements, contact, application guidance, relationships, tags. |
| `GrantCategory` | `research-grant`, `fellowship`, `scholarship`, `seed-funding`, `innovation-fund`, `industry-funding`, `government-funding`, `ngo-funding`, `international-funding`, `institutional-funding`, `venture-research-funding`. |
| `GrantType` | `research-grant`, `fellowship`, `scholarship`, `seed`, `innovation`, `travel-grant`, `equipment-grant`, `doctoral-research`, `postdoctoral-research`, `collaborative`, `capacity-building`, `infrastructure`. |
| `FundingStatus` | `open`, `closed`, `upcoming`, `under-review`, `awarded`, `declined`, `withdrawn`, `completed`, `on-hold`. |
| `FundingRound` | A named round of a cycle: open/close/decision dates, status, applications received and awarded, total budget, currency. |
| `FundingCycle` | An annual funding cycle with optional programme association, year, status (`planned`/`open`/`closed`/`completed`), total budget, currency, and its rounds. |
| `ApplicationStage` | Fine-grained pipeline stage: `discovery`, `expression-of-interest`, `drafting`, `submitted`, `under-review`, `interviews`, `decision`, `awarded`, `declined`, `withdrawn`. |
| `Eligibility` | Career stages, disciplines, countries, continents, institution types, nationality restrictions, international openness, requirements, exclusions. |
| `Award` | An awarded grant: agency, title, amount, currency, award date, duration, status (`active`/`completed`/`terminated`/`pending`), grant number, principal investigator, institution, research areas, partner institutions, funded research. |
| `Budget` | Total requested, optional total awarded, currency, and line items. |
| `BudgetItem` | A budget line: label, category (Personnel/Equipment/Travel/Consumables/Software/Dissemination/Overheads/Other), amount, currency, description. |
| `Deliverable` | A promised output: title, description, type (Report/Dataset/Publication/Software/Prototype/Workshop/Policy Document/Other), status (`planned`/`in-progress`/`completed`/`delayed`), due date. |
| `Milestone` | A key event: title, description, date, status (`pending`/`in-progress`/`completed`). |
| `FundingTimeline` | Chronological entries (Discovery, Application, Review, Decision, Award, Milestone, Reporting, Completion). |
| `PrincipalInvestigator` | The grant lead: name, SAID, optional ORCID, institution, role (`GrantRole` from `types/researcher.ts`), email. |
| `CoInvestigator` | A collaborator with contribution note, using the same `GrantRole` vocabulary. |
| `PartnerInstitution` | A collaborating institution with optional SAID, country, and role. |
| `IndustryPartner` | An industry contributor with sector, country, contribution, and optional funding contribution and currency. |
| `FundingRelationship` | Modeled as `FundingRelationships` plus `FundingRelationshipRef`: projects, researchers, institutions, datasets, manuscripts, journals, conferences, publications, agencies. |
| `FundingAnalytics` | Portfolio aggregates: totals by status, total awarded/requested, success rate, average award size, awards by category, funding by continent, applications by discipline, budget utilisation. |
| `FundingStatistics` | Statistic-card level aggregates: totals, active grants, pending applications, countries, continents, disciplines, categories, scholarship/fellowship/grant counts, average duration, average award size, currency, career stages covered. |
| `FundingPortfolio` | Aggregate root of the module: statistics, analytics, agencies, opportunities, grants, awards, relationships, deadlines, categories. |
| `FundingLifecycleCoverage` | A per-stage coverage row derived from the `ResearchLifecycleEngine` (stage id, name, description, icon, order, completion percentage, previous/next stage). |

### Funding status flow

The application pipeline and grant execution share one aggregate status
vocabulary:

```
open/upcoming → under-review → awarded → (completed | on-hold)
                        ↘ declined / withdrawn
```

## Component map

All funding components live in `components/funding/` and are re-exported from
`components/funding/index.ts`. They consume existing UI primitives
(`PageLayout`, `PageHeader`, `SectionCard`, `SectionTitle`, `Alert`,
`StatisticCard`, `Timeline`, `Badge`, `Button`) and existing patterns from
`components/research/*`.

| Component | Responsibility |
|---|---|
| `FundingBadge` | Status-to-`Badge` variant mapping shared across cards. |
| `FundingCard` | Compact opportunity card: agency, status, summary, research areas, deadline, funding range. |
| `FundingOpportunityCard` | Detailed opportunity card: funding, deadline, category, career stage, duration, decision date, countries, continents, application guidance, tags. |
| `FundingAgencyCard` | Compact agency card: logo, name, verification badge, description, focus areas, trust score, type, average award. |
| `FundingHeader` | Full agency header: trust score, founded year, annual budget, average award, open opportunities, focus areas, contact. |
| `FundingSourceCard` | Source/funder details: acronym, type, location, founded, annual budget, contact, website, portal, programmes. |
| `FundingStatistics` | `StatisticCard` grid: opportunities, open, agencies, total awarded, active grants, countries, disciplines, average award. |
| `FundingAnalytics` | Three-panel analytics: outcomes (success rate, budget utilisation, average award, total awarded), awards by category, applications by discipline. |
| `FundingCategoryCard` | Category tile with icon, opportunity count, and awarded value. |
| `FundingDeadlineCard` | Priority-ranked deadline list with date blocks and agency/type context. |
| `FundingCalendar` | Deadlines grouped by month with priority badges. |
| `FundingMap` | Continent funding distribution with agency counts and awarded value. |
| `FundingRelationshipCard` | Grid of cross-module relationship groups (projects, datasets, manuscripts, journals, conferences, publications, researchers, institutions, agencies). |
| `GrantStatusCard` | Full grant status: stage, grant number, requested/awarded, start/end, deadline/decision, PI, reporting obligations. |
| `GrantTimeline` | The grant journey rendered through the shared `Timeline` primitive. |
| `BudgetBreakdown` | Itemised budget with per-line amounts and total awarded. |
| `BudgetChart` | Percentage allocation bars across budget items. |
| `DeliverableCard` | Expected outputs with type icons, status badges, and due dates. |
| `MilestoneCard` | Key milestones with status badges and dates. |
| `EligibilityCard` | Who-can-apply panel: career stages, disciplines, countries, continents, institution types, requirements, exclusions, international openness. |
| `ProposalChecklist` | Application requirements with required/optional marks and formats. |
| `AwardCard` | Award summary: amount, dates, duration, PI, grant number, institution, partners, funded research. |
| `FundingImpactCard` | Impact-flavoured grant summary: awarded, duration, start, deliverables, research areas, tags. |
| `FundingPortfolio` | Composite view: statistics, featured calls, agencies, deadlines, and portfolio summary. |
| `FundingSearchPanel` | Interactive search/filter over opportunities by query, category, status, and region. |
| `FundingLifecycleCard` | Lifecycle integration banner (current stage + progress) plus full coverage grid. |
| `format` | Shared formatting helpers (`formatAmount`, `formatAmountRange`, `formatDate`, `formatMonth`). |

## Route map

| Route | Page | Section |
|---|---|---|
| `/funding` | `app/funding/page.tsx` | Portfolio statistics, calls for proposals (searchable), featured opportunities, categories, agencies, deadlines, grant calendar, grant spotlight (status, timeline, proposal requirements, budget, eligibility, deliverables, milestones), recent awards, analytics, global funding map, lifecycle integration, cross-module relationships, placeholder alert. |

The route is not added to primary navigation (per module constraints) and is
reachable from existing module pages via the existing `Button href` pattern used
by `/research` → `/projects` → `/publications`. The detail route
(`/funding/[id]`) is intentionally left for a future phase; the component
library and placeholder data are already shaped for it.

## Dependency graph

```
Funding module
  ├── lib/lifecycle.ts            (ResearchLifecycleEngine — stage 4, stage 3, stage 5)
  ├── types/research.ts           (ResearchLifecycleStageId)
  ├── types/researcher.ts         (GrantRole)
  ├── types/funding.ts            (funding entity model — new)
  ├── constants/placeholder-funding.ts  (placeholder data + derived analytics — new)
  ├── constants/placeholder-research.ts (projects, publications, research team)
  ├── constants/placeholder-datasets.ts (datasets)
  ├── constants/placeholder-manuscripts.ts (manuscripts)
  ├── constants/placeholder-journals.ts (journals)
  ├── constants/placeholder-conferences.ts (conferences)
  ├── constants/placeholder-institutions.ts (institutions)
  ├── components/funding/*        (component library — new)
  ├── components/layout/*         (PageLayout, PageHeader)
  ├── components/ui/*             (Container, Button, SectionTitle, SectionCard, Alert, StatisticCard, Timeline, Badge)
  └── app/funding/page.tsx        (route — new)
```

The module depends only on existing infrastructure plus its own new files. Every
cross-module reference reuses existing placeholder identity (project ids, SAID
identifiers, dataset DOIs, journal ids, conference ids) so no data is
duplicated.

## Placeholder data

`constants/placeholder-funding.ts` provides:

- **25 funding agencies**, including the 20 named partners (NSF, NIH, Horizon
  Europe, Wellcome Trust, Bill & Melinda Gates Foundation, TETFund, National
  Research Foundation South Africa, African Development Bank, World Bank,
  UNESCO, UNDP, British Council, DAAD, Commonwealth Scholarship Commission,
  Mastercard Foundation, Google Research, Microsoft Research, Meta Research,
  OpenAI Research Grants, Scholatia Research Foundation) plus the funders
  already referenced by existing placeholder research projects.
- **55+ funding opportunities** spanning countries, continents, disciplines,
  and career stages, each with funding values, currencies, budgets, deadlines,
  eligibility, contacts, proposal requirements, evaluation criteria, duration,
  research areas, and linked projects, researchers, institutions, datasets,
  manuscripts, journals, conferences, and publications.
- Grants (awarded, completed, active, and in the application pipeline) with
  full budgets, deliverables, milestones, timelines, eligibility, evaluation
  criteria, proposal requirements, reporting obligations, and relationships.
- Awards with amounts, currencies, partners, and funded-research descriptions.
- Deadlines and a derived grant calendar.
- Derived aggregates: `FUNDING_PORTFOLIO_STATISTICS`, `FUNDING_PORTFOLIO_ANALYTICS`,
  `FUNDING_LIFECYCLE_STAGE`, `FUNDING_LIFECYCLE_COVERAGE`, `FUNDING_PORTFOLIO`,
  `FEATURED_OPPORTUNITIES`, `UPCOMING_OPPORTUNITIES`, `FUNDING_CATEGORIES`,
  `FUNDING_DEADLINES`, `FUNDING_CALENDAR`, `FUNDING_RELATIONSHIPS`.

## Future extensions

- Funding detail route (`/funding/[id]`) and agency/programme/call detail routes
  sharing the existing component library.
- Application workflow (drafting, submission, review, decision) tied to the
  `ApplicationStage` vocabulary.
- Notification and calendar sync for application deadlines and reporting
  obligations.
- Proposal budgeting tooling that feeds the manuscript, project, and dataset
  stages (stages 5–8).
- Award monitoring and impact tracking feeding stage 14 and the research
  lifecycle coverage model.
- Live sponsor feeds (agency portals, funding aggregators) replacing the
  placeholder opportunity catalogue.
- Persistence layer (database tables) when the platform-wide persistence phase
  lands; the types in `types/funding.ts` are the schema seed.
