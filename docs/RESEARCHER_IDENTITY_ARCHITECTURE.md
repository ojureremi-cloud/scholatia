# Scholatia Researcher Identity Architecture

## Purpose

The Researcher module is the **identity layer at the heart of the Scholatia
ecosystem**. Every researcher owns a permanent scholarly identity (SAID) and a
personal academic website — a verified scholarly homepage that every other
platform module connects back to. Today the personal site maps to the Next.js
route `/researchers/[username]`; it is future-ready to be served from a personal
academic subdomain (`<username>.scholatia.com`).

The module does **not** introduce a new lifecycle stage. Instead it embeds the
existing SAID architecture (`lib/said.ts`, `types/identity.ts`, the
`VerificationLevel` enum) and the existing `ResearchLifecycleEngine`
(`lib/lifecycle.ts`), then layers the full researcher ecosystem on top:
position, biography, education, employment, memberships, awards, honors,
certifications, skills, languages, social links, academic network, research
timeline, research portfolio, metrics, academic impact, visibility, teaching,
supervision, editorial appointments, conference participation, grants, patents,
innovations, startups, media coverage, public engagement, community service,
volunteer experience, availability, contact, verification, analytics, and
cross-module relationships.

The module is **additive**: it reuses the existing design system, existing page
patterns, and the existing `ResearchLifecycleEngine`. It introduces no duplicate
lifecycle definitions, no APIs, no database, no server actions, and no external
packages. DNS and live persistence are intentionally deferred.

## Relationship to the Research Lifecycle

- Researchers own work at every one of the 15 canonical Scholatia research
  lifecycle stages (`idea` → `knowledge-transfer`).
- Stage definitions are sourced at runtime from the `ResearchLifecycleEngine`
  (`lib/lifecycle.ts`), never hardcoded in the module:
  - `constants/placeholder-researchers.ts` derives
    `RESEARCHER_LIFECYCLE_COVERAGE` from
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

- Timeline entries (`ResearchTimelineEntry`) carry an optional `stageId`
  (`ResearchLifecycleStageId`) so individual researcher milestones can be pinned
  to canonical lifecycle stages.
- Cross-module relationships are declared per researcher against the SAID
  ecosystem: projects, datasets, manuscripts, publications, journals,
  conferences, grants, awards, collaborators, and institutions.

## Username and subdomain architecture

Utilities live in `lib/researchers.ts`.

| Utility | Responsibility |
|---|---|
| `generateResearcherSlug(input)` | Canonical slug: lowercases, strips accents, collapses separators, trims hyphens. |
| `validateResearcherSlug(slug)` | Validates against the platform grammar `^[a-z0-9](?:[a-z0-9-]{0,30}[a-z0-9])?$` (1–32 chars, lowercase, optional internal hyphens). |
| `buildResearcherUrl(username, { mode })` | Route mode → `/researchers/[username]`; subdomain mode → `https://<username>.scholatia.com`. |
| `RESEARCHER_SUBDOMAIN_ROOT` | `scholatia.com` — the root domain for future per-researcher subdomains. |
| `formatOrcid(index)` | Deterministic, unique-looking ORCID iD (`0000-0002-XXXX-XXXX`). |
| `createAcademicIdentity(...)` | Builds an `AcademicIdentity` embedding `createSaidIdentifier` and `VerificationLevel.PublicationVerified`. |
| `getResearcherByUsername` / `getResearcherBySaid` | Lookup helpers for the dynamic route. |
| `summarizeResearcherPortfolio(...)` | Computes `ResearcherStatistics` from a researcher collection. |
| `formatResearchMetric(value)` | Human metric formatting (1.2K / 3.4M). |

DNS is intentionally **not** implemented. These utilities only prepare stable,
validated slugs and URL builders so the routing layer can switch to subdomains
without touching placeholder data.

## Entity model

Types live in `types/researcher.ts`.

| Entity | Description |
|---|---|
| `ResearcherProfile` | Aggregate root: the personal academic homepage record. Embeds identity, position, biography, interests, research areas, education, employment, memberships, awards, honors, certifications, skills, languages, social links, network, timeline, portfolio, metrics, impact, visibility, teaching, supervision, editorial appointments, conference participation, grants, patents, innovations, startups, media coverage, public engagement, community service, volunteer experience, availability, contact, verification, analytics, relationships, recent activity, and profile completion. |
| `AcademicIdentity` | Persistent identity record: SAID, display/first/last name, ORCID, Google Scholar, Scopus Author ID, Web of Science ResearcherID, Crossref, Loop, `VerificationLevel`, verified flag, member-since date. |
| `AcademicPosition` | Current position: title, institution, faculty, department, country, city, employment type, dates, research focus. |
| `AcademicBiography` | Professional/academic/short/full biographies plus areas of expertise. |
| `EducationHistory` | Degree, institution, field, dates, country, honors. |
| `EmploymentHistory` | Organisation, role, department, dates, current flag. |
| `ProfessionalMembership` | Organisation, role, type, since year, status. |
| `Award` / `Honor` / `Certification` | Recognition and credential records. |
| `ResearchInterest` / `ResearchArea` | Interests with keywords/categories; areas with publication/citation counts. |
| `Skill` / `Language` | Skills with level and endorsements; languages with proficiency. |
| `SocialLinks` | LinkedIn, website, Twitter, GitHub, ResearchGate, Academia, blog, YouTube, ORCID, and free-form `ProfileLink`s. |
| `AcademicCollaborator` / `AcademicNetwork` | Collaboration network: collaborators, institutional partners, network/follower/co-author counts. |
| `ResearchTimelineEntry` | Timeline event: date, title, detail, type, optional lifecycle `stageId`. |
| `ResearchPortfolio` | Output counts: projects, datasets, manuscripts, publications by type, patents, software, teaching, supervision. |
| `ResearchMetrics` | Headline counters: publications, citations, downloads, reads, followers, collaborators, projects, grants, awards, patents, datasets. |
| `CitationMetrics` | Total citations, h-index, i10-index, citations by year, most cited work. |
| `AltmetricMetrics` | Altmetric score and channel breakdown (news, blogs, twitter, facebook, policy, wikipedia, patents, mendeley, dimensions). |
| `CollaborationMetrics` | Collaboration impact: co-authors, institutional/international collaborations, countries. |
| `AcademicImpact` | Impact aggregate: citation/altmetric/collaboration metrics, h/i10 index, downloads, reads. |
| `ResearchVisibility` | Visibility score, profile views, monthly visitors/downloads, search appearances, countries reached, top referrers. |
| `TeachingPortfolio` / `TeachingCourse` | Courses, counts, students, teaching experience, awards. |
| `SupervisionPortfolio` / `SupervisedStudent` | Current/completed PhD/Masters counts and per-student records. |
| `EditorialAppointment` | Editorial roles: role, journal, publisher, dates, status, scope. |
| `ConferenceParticipation` | Conference role (`Keynote Speaker` … `Attendee`), year, paper title, location. |
| `GrantParticipation` | Grant title, funder, amount, role, status, period. |
| `Patent` / `Innovation` / `Startup` | Commercialisation records. |
| `MediaCoverage` / `PublicEngagement` / `CommunityService` / `VolunteerExperience` | Outreach and service records. |
| `Availability` / `ContactInformation` | Availability toggles and contact details. |
| `IdentityVerification` | Verified flag, `VerificationLevel`, identity/trust/visibility scores, badges, verification steps (`verified` / `pending` / `not-started`), academic achievements. |
| `ResearcherAnalytics` | Profile views, downloads, reads, citations, followers, collaborators, publication trend, citation trend, popular publications, top countries, analytics period. |
| `ResearcherRelationships` | Grouped cross-module references: projects, datasets, manuscripts, publications, journals, conferences, grants, awards, collaborators, institutions. |
| `RecentActivityEntry` / `ProfileCompletion` | Activity feed and completion tracking. |
| `ResearcherStatistics` | Portfolio aggregates: researchers, countries, institutions, disciplines, publications, citations, projects, datasets, verified researchers, average trust score, followers, collaborators. |
| `ResearcherLifecycleCoverage` | A lifecycle coverage row derived from the `ResearchLifecycleEngine`: stage id, name, description, icon, order, completion percentage, previous/next stage. |

### Aggregate structure

```
ResearcherProfile
├── identity: AcademicIdentity        (SAID + ORCID + scholarly identifiers)
├── position / biography / interests / researchAreas
├── education / employment / memberships / awards / honors / certifications
├── skills / languages / socialLinks / network
├── timeline / portfolio / metrics / impact / visibility
├── teaching / supervision / editorialAppointments / conferenceParticipation
├── grantParticipation / patents / innovations / startups
├── mediaCoverage / publicEngagement / communityService / volunteerExperience
├── availability / contact / verification / analytics
├── relationships: ResearcherRelationships
├── recentActivity / profileCompletion
```

## Placeholder strategy

`constants/placeholder-researchers.ts` holds **22 researchers** spanning Africa,
Europe, North America, and Asia-Pacific (Nigeria, United Kingdom, Mexico, Japan,
South Africa, United States, South Korea, Switzerland, Ghana, India, China,
Kenya, Hungary, Portugal, Pakistan, Argentina). Every researcher owns a SAID
identity, a personal academic username (e.g. `ojuri`, `smith`, `adebayo`), and
the full personal academic website ecosystem.

Cross-module references are sourced from the existing placeholder modules so no
data is duplicated and every reference stays live:

| Relationship pool | Source |
|---|---|
| Projects | `WORKSPACE_PROJECTS` (`placeholder-research.ts`) |
| Publications | `WORKSPACE_PUBLICATIONS` (`placeholder-research.ts`) |
| Collaborators | `RESEARCH_TEAM` (`placeholder-research.ts`) |
| Datasets | `DATASETS` (`placeholder-datasets.ts`) |
| Manuscripts | `MANUSCRIPTS` (`placeholder-manuscripts.ts`) |
| Journals | `JOURNALS` (`placeholder-journals.ts`) |
| Conferences | `CONFERENCES` (`placeholder-conferences.ts`) |
| Institutions | `INSTITUTIONS` (`placeholder-institutions.ts`) |
| Grants | `WORKSPACE_PROJECTS` funding metadata |

Helpers (`sliceRotate`, `citationTrendFor`, `buildRelationships`,
`buildMetrics`, `buildTimeline`, `buildAnalytics`, `buildProfileCompletion`,
`buildRecentActivity`, `buildBaseResearcher`, `makeResearcher`) assemble each
researcher deterministically from an index-based rotation of the pools and the
existing `createAcademicIdentity` / `createSaidIdentifier` helpers.

Derived exports:

- `RESEARCHERS` — the 22-researcher identity portfolio.
- `FEATURED_RESEARCHER` — `RESEARCHERS[0]` (Dr. Adebisi Ojurere).
- `RECENT_RESEARCHERS`, `TOP_CITED_RESEARCHERS`, `TRENDING_RESEARCHERS`,
  `MOST_COLLABORATIVE_RESEARCHERS` — sorted portfolio slices.
- `RESEARCHER_PORTFOLIO_STATISTICS` — computed via
  `summarizeResearcherPortfolio`.
- `RESEARCH_INTEREST_GROUPS`, `INSTITUTION_DISTRIBUTION`,
  `COUNTRY_DISTRIBUTION`, `DISCIPLINE_DISTRIBUTION` — derived distributions.
- `RESEARCHER_LIFECYCLE_COVERAGE` — derived from `ResearchLifecycleEngine`.

## Component map

All researcher components live in `components/researchers/` and are re-exported
from `components/researchers/index.ts`. They consume existing UI primitives
(`PageLayout`, `PageHeader`, `SectionCard`, `SectionTitle`, `Alert`,
`StatisticCard`, `Timeline`, `Badge`, `Button`, `Container`) and follow the card
patterns established by `components/institutions/*`.

| Component | Responsibility |
|---|---|
| `ResearcherHeader` | Hero header: avatar, SAID, name, headline, position, subdomain URL, verification badges, actions. |
| `ResearcherCard` | Directory card: avatar, title, name, institution, country, headline, verification, profile link. |
| `IdentitySummaryCard` | Compact identity summary: SAID, position, profile URL, verification status, scores. |
| `ResearcherBiography` | Professional, academic, and full biography plus expertise tags. |
| `AcademicIdentityCard` | SAID, ORCID, Google Scholar, Scopus, Web of Science, Crossref, member-since. |
| `ResearchMetrics` | Headline metrics grid (publications, citations, downloads, reads, followers, collaborators, projects, grants, awards, patents, datasets). |
| `ResearchPortfolio` | Portfolio breakdown (projects, outputs by type, patents, software, teaching, supervision). |
| `CitationMetricsCard` | Total citations, h-index, i10-index, citations-per-year bar chart, most cited work. |
| `AcademicImpactCard` | Downloads, reads, altmetric score, altmetric channel breakdown, collaboration impact. |
| `PublicationTrendChart` | Publications-per-period bar chart from the analytics record. |
| `ResearchInterestCard` | Research interests with categories/keywords and research areas with counts. |
| `AcademicSkills` | Skills with color-coded proficiency levels. |
| `LanguageCard` | Languages with proficiency. |
| `MembershipCard` | Professional memberships and certifications. |
| `EducationCard` | Education history. |
| `EmploymentCard` | Employment history with current flags. |
| `ProjectCard` / `DatasetCard` / `PublicationCard` / `JournalCard` | Cross-module relationship lists (projects, datasets, publications, journals). |
| `ConferenceCard` | Conference participation plus linked conferences. |
| `GrantCard` | Grant participation with status badges and amounts. |
| `AwardCard` | Awards and honours. |
| `PatentCard` / `InnovationCard` / `StartupCard` | Commercialisation records. |
| `TeachingCard` | Teaching courses, students, experience, awards. |
| `SupervisionCard` | Supervision counts and per-student records. |
| `EditorialAppointments` | Editorial roles with status badges. |
| `CollaborationNetwork` | Collaboration stats, collaborators, institutional partners. |
| `ResearchTimeline` | Timeline rendered with the `Timeline` primitive. |
| `ResearchRelationshipCard` | Grouped cross-module relationship grid. |
| `ResearchVisibilityCard` | Visibility score, views, referrers. |
| `ResearchAnalyticsCard` | Analytics metric grid and top countries. |
| `VerificationCard` | Identity/trust/visibility scores, verification steps, achievements. |
| `ContactCard` | Contact details and availability badges. |
| `SocialProfileCard` | Social and academic profile links. |
| `ProfileCompletionCard` | Completion score, progress bar, remaining fields. |
| `RecentActivityCard` | Recent activity feed. |
| `AcademicStatistics` | Portfolio-level statistics grid (takes `ResearcherStatistics`). |

## Routes

### `app/researchers/page.tsx`

Server component composing the directory page from placeholder data and the
component library, following the exact composition pattern of
`app/institutions/page.tsx`.

Page sections:

1. Header with cross-module navigation actions.
2. Portfolio statistics (`StatisticCard` grid + `AcademicStatistics`).
3. Featured researcher spotlight (`ResearcherHeader` plus the full profile
   ecosystem across a main column and sidebar).
4. Researcher directory (`ResearcherCard` grid).
5. Recently joined, top cited, trending, most collaborative researchers.
6. Research interest groups and institution/country/discipline distributions.
7. Research lifecycle coverage (derived from `ResearchLifecycleEngine`).
8. Placeholder-data disclaimer alert.

### `app/researchers/[username]/page.tsx`

Dynamic profile route. `params` is an async `Promise<{ username: string }>`
(Next.js 16 convention, matching `app/research/[id]/page.tsx`). The page:

1. Resolves the researcher via `getResearcherByUsername(RESEARCHERS, username)`.
2. Renders a not-found state when the username does not match.
3. Renders the full personal academic website using the component library.
4. Shows related researchers sharing a country or areas of expertise.
5. Shows the placeholder-data disclaimer alert.

## Lifecycle integration

- No lifecycle logic is duplicated. All stage names, icons, order, completion
  percentages, and previous/next links come from `ResearchLifecycleEngine`.
- `RESEARCHER_LIFECYCLE_COVERAGE` is derived at module load from the engine and
  rendered on the page.
- `ResearchTimelineEntry.stageId` pins researcher milestones to canonical
  lifecycle stages.
- Researchers are lifecycle-neutral hosts: they own work at every stage rather
  than occupying a stage of their own.

## Future persistence model

When the platform moves from placeholder data to live persistence, the
following layers will replace the constants:

- `researchers` table keyed by `said` and `username`, holding the aggregate
  root and a reference to the existing identity/verification record.
- Child tables for `positions`, `biographies`, `education`, `employment`,
  `memberships`, `awards`, `honors`, `certifications`, `skills`, `languages`,
  `social_links`, `network`, `timeline_entries`, `teaching_courses`,
  `supervised_students`, `editorial_appointments`, `conference_participation`,
  `grant_participation`, `patents`, `innovations`, `startups`, `media_coverage`,
  `public_engagement`, `community_service`, `volunteer_experience`, `contacts`,
  and `verification_steps`.
- Join tables mapping researchers to projects, datasets, manuscripts,
  publications, journals, conferences, grants, awards, collaborators, and
  institutions.
- `ResearcherStatistics` and `ResearcherLifecycleCoverage` become query-backed
  aggregates while still sourcing stage definitions from
  `ResearchLifecycleEngine`.
- DNS: per-researcher subdomains (`<username>.scholatia.com`) are prepared by
  `buildResearcherUrl(..., { mode: 'subdomain' })` and require a wildcard DNS
  entry and a subdomain-aware routing layer before they go live.
