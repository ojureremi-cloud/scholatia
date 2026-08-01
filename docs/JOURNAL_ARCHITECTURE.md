# Scholatia Journal Publishing Platform Architecture

## Purpose

The Journal Publishing module implements **stages 8–11 (Manuscript → Submission
→ Peer Review → Publication)** of the canonical Scholatia research lifecycle as
an integrated publishing platform. It provides a route (`/journals`), a
component library (`components/journals/`), a placeholder data model
(`constants/placeholder-journals.ts`), and strong TypeScript types
(`types/identity.ts`) for describing a scholarly journal across its whole
publishing operation: profile and identity, editorial board, peer review modes,
publication workflow stages, submissions, reviewer assignments, calls for
papers, production queue, issue schedule, publishing policies, indexing,
impact metrics, analytics, and relationships to the wider SAID ecosystem.

The module is **additive**: it extends the existing journals domain
(`types/identity.ts`, `lib/journals.ts`) with new optional publishing
sub-models, expands the placeholder portfolio to 10 journals, and reuses every
existing journals component and hook. It introduces no duplicate lifecycle
definitions, no duplicate journal domain objects, no APIs, no database, no
server actions, and no external packages.

## Relationship to the Research Lifecycle

- The canonical **publication workflow** is expressed with the existing
  `PublicationWorkflowStage` type (`types/identity.ts`), which enumerates the
  twelve publishing stages in order: `Submission → Editorial Screening →
  Reviewer Assignment → Peer Review → Decision → Revision → Acceptance →
  Copyediting → Typesetting → Proofreading → Publication → Archiving`.
- The workflow array is defined **once**, typed against
  `PublicationWorkflowStage`, in `constants/placeholder-journals.ts`
  (`STANDARD_WORKFLOW`) and reused by `createJournalProfile`
  (`lib/journals.ts`) and every journal profile in the placeholder data. It is
  never hardcoded as a bare string array outside the journals domain.
- The module owns stages 8–11 as the **publishing side** of the lifecycle,
  mirroring how `lib/lifecycle.ts` models research stages 1–14:

  ```
  Manuscript (8) → Submission (9) → Peer Review (10) → Publication (11)
  ```

- Relationships are declared against the SAID ecosystem: manuscripts,
  datasets, projects, authors (SAID identifiers), institutions, grants, and
  publications — the same relationship pattern established by the Manuscript
  and Dataset modules, surfaced on `/journals` through `JournalRelationships`.

## Entity model

Publishing sub-models live in `types/identity.ts` alongside the existing
`JournalProfile`; every new field on `JournalProfile` is **optional**, so the
journal domain remains backward compatible.

| Entity | Description |
|---|---|
| `JournalProfile` | Existing aggregate root (identity, ISSNs, publisher, discipline, aims and scope, editorial policy, open access status, review model, indexing services, editorial structure, workflow, editors, review board, production team, publishing staff, articles, issues, volumes). Extended with optional publishing fields (see below). |
| `JournalImpactMetrics` | `impactFactor`, `fiveYearImpactFactor`, `citeScore`, `sjr`, `snip`, `hIndex`, `totalCitations`, `totalDownloads`, and a `JournalQuartile` (Q1–Q4). |
| `JournalQuartile` | `'Q1' \| 'Q2' \| 'Q3' \| 'Q4'`. |
| `JournalIndexingRecord` | Indexing coverage: `service`, `status` (`Indexed`, `In Review`, `Not Indexed`). |
| `CallForPapers` | Open/closed/upcoming call: id, title, theme, deadline, status, accepted submission types, optional target issue and guest editor. |
| `PublicationQueueEntry` | Article in production: id, title, authors, `PublicationWorkflowStage`, optional DOI, target issue, and scheduled publication date. |
| `IssueScheduleEntry` | Planned/in-production/published issue: issue number, volume, year, publication date, optional theme and article count. |
| `EditorialDecisionStatistics` | Pipeline volumes (`submitted`, `underReview`, `inRevision`, `accepted`, `rejected`, `inProduction`, `published`), acceptance/rejection rates, and median decision turnaround. |
| `JournalPolicy` | Publishing policy: APCs, submission fee, embargo, licensing, copyright, plagiarism/data/ethics/appeals/conflict-of-interest/preprints policies. |
| `JournalAnalytics` | Annual submissions/publications, acceptance and rejection rates, downloads, citations, Altmetric score, Google Scholar rank, and median decision turnaround. |
| `JournalRelationship` | A single connected entity: id, title, optional detail (used for manuscripts, datasets, projects, authors, institutions, grants, publications). |
| `JournalRelationships` | Grouped relationships: `manuscripts`, `datasets`, `projects`, `authors`, `institutions`, `grants`, `publications`. |
| `JournalIssueRef` / `JournalVolumeRef` / `JournalArticleRef` | Journal + issue/volume/article pairs, produced by the portfolio placeholder derivations. |
| `JournalReviewerRef` | Journal + reviewer (name string from `reviewBoard`) pairs. |
| `JournalCallForPapersRef` | Journal + `CallForPapers` pairs, filtered to non-closed calls. |
| `JournalPortfolioStatistics` | Portfolio aggregates: journal counts by open access model, article counts by status, open calls, total submissions, average trust score. |
| `JournalPortfolioAnalytics` | Portfolio aggregates: totals (journals, articles, published, submissions, accepted, rejected, downloads, citations), average acceptance/rejection rates and impact factor, highest-impact and most-cited journals. |

### Publication workflow flow

A submitted article moves through the twelve `PublicationWorkflowStage`
stages; revision loops route back through `Revision → Reviewer Assignment →
Peer Review`:

```
Submission → Editorial Screening → Reviewer Assignment → Peer Review
  → Decision → Revision → … → Acceptance → Copyediting → Typesetting
  → Proofreading → Publication → Archiving
```

## Journal integration

The module **extends and reuses the existing journals domain rather than
re-modeling it**:

- `createJournalProfile` (`lib/journals.ts`) now fills the new optional fields
  with sensible defaults (DOI prefix `10.1234`, Q1 impact metrics, DOAJ and
  Crossref indexing, empty queues/schedules, and complete policy/analytics
  defaults), so existing and new journal profiles remain valid.
- `constants/placeholder-journals.ts` builds 10 journal profiles on top of
  `createJournalProfile`, overriding per-journal publishing data, and derives
  portfolio exports (`JOURNAL_PORTFOLIO_STATISTICS`,
  `JOURNAL_PORTFOLIO_EDITORIAL_STATS`, `JOURNAL_PORTFOLIO_ANALYTICS`,
  `JOURNAL_RELATIONSHIPS`, `CALLS_FOR_PAPERS`, `ACCEPTED_ARTICLES`,
  `PUBLISHED_ARTICLES`, and more).
- The `useSubmission` and `usePeerReview` hooks (`hooks/useSubmission.ts`,
  `hooks/usePeerReview.ts`) feed per-journal submission types and workflow
  stages into the new `JournalWorkflowPanel` client component — the same
  hook-driven pattern established by the manuscript module's
  `JournalTargetCard`.
- The editorial board reuses `EditorialBoardCard` against
  `JournalProfile.editorialStructure`; reviewer assignments reuse
  `ReviewerCard` against `reviewBoard`.

## Component map

All journal components live in `components/journals/` and are re-exported from
`components/journals/index.ts`. They consume existing UI primitives
(`PageLayout`, `PageHeader`, `SectionCard`, `SectionTitle`, `StatisticCard`,
`Alert`, `Badge`, `Button`).

### Reused (existing)

| Component | Responsibility |
|---|---|
| `JournalCard` | Compact portfolio card: publication type, title, publisher, country. |
| `JournalHeader` | Featured-journal hero: ISSN, title, aims and scope, editorial board / submit actions. |
| `JournalStatistics` | Articles, issues, and trust score counts. |
| `JournalBadge` | Review-model pill. |
| `EditorialBoardCard` | A single editorial structure member (role, name, affiliation). |
| `SubmissionStatusCard` | Accepted submission-type badges. |
| `PeerReviewCard` | Peer review model badges. |
| `ReviewerCard` | A single reviewer name. |
| `PublicationTimeline` | The full `PublicationWorkflowStage` workflow as stacked stage cards. |
| `ArticleCard` | Article title, authors, and status. |
| `IssueCard` | Issue number, year, and status. |
| `VolumeCard` | Volume number, year, and status. |

### Added (new)

| Component | Responsibility |
|---|---|
| `CallForPapersCard` | Open/upcoming calls with theme, deadline, target issue, guest editor, and submission-type tags. |
| `EditorialDecisionStatistics` | Pipeline volume tiles plus acceptance/rejection rate bars and decision turnaround. |
| `JournalImpactCard` | Impact metric tiles (IF, 5-year IF, CiteScore, SJR, SNIP, h-index) and quartile badge. |
| `PublicationQueue` | Articles in production with workflow stage, DOI, issue, and scheduled date. |
| `IssueSchedule` | Planned/in-production/published issues with volume, year, theme, and publication date. |
| `JournalPolicyCard` | Publishing policy items as label/value tiles. |
| `OpenAccessCard` | Open access status badge, frequency, APCs, licensing, and embargo. |
| `IndexingCard` | Indexing coverage with Indexed/In Review/Not Indexed badges. |
| `JournalAnalytics` | Annual activity, downloads, citations, decision turnaround, and rank tiles. |
| `JournalRelationships` | Grouped relationship cards for manuscripts, datasets, projects, authors, institutions, grants, and publications. |
| `JournalWorkflowPanel` | Client component using `useSubmission` + `usePeerReview` to render the numbered workflow stepper, submission types, and peer review modes for a journal. |

## Route map

| Route | Page | Section |
|---|---|---|
| `/journals` | `app/journals/page.tsx` | Portfolio statistics, portfolio editorial statistics, featured journal (header, statistics, publication timeline, open access, review model), all journals, editorial board, submission and peer review pipeline (submission types, peer review modes, editorial workflow via hooks), reviewer assignments, current issues, volumes, accepted and published articles, calls for papers, publication queue and issue schedule, journal policy and metrics (impact, indexing, analytics), connected research relationships, recently published issues, placeholder alert. |

The route is not added to primary navigation (per module constraints) and is
reachable from existing module pages via the existing `Button href` pattern
used by `/research` → `/projects` → `/datasets` → `/manuscripts`.

## Dependency graph

```
Journal module
  ├── lib/journals.ts             (createJournalProfile — expanded defaults)
  ├── hooks/useSubmission.ts      (per-journal submission types)
  ├── hooks/usePeerReview.ts      (per-journal peer review workflow stages)
  ├── types/identity.ts           (JournalProfile + new optional publishing types)
  ├── constants/placeholder-manuscripts.ts  (manuscript + relationship sources)
  ├── constants/placeholder-datasets.ts     (dataset relationship source)
  ├── constants/placeholder-research.ts     (project relationship source)
  ├── constants/placeholder-journals.ts     (placeholder portfolio + derived exports — new)
  ├── components/journals/*       (12 reused components + 11 new)
  ├── components/layout/*         (PageLayout, PageHeader)
  ├── components/ui/*             (Container, Button, SectionTitle, SectionCard, StatisticCard, Alert, Badge)
  └── app/journals/page.tsx       (route — expanded)
```

The module depends only on existing infrastructure plus its own new files. It
has no dependents, so it can be removed or refactored without affecting other
modules.

## Placeholder data

`constants/placeholder-journals.ts` provides:

- **10 journal profiles** (`SCHOLATIA_OPEN_RESEARCH` through
  `SCHOLATIA_RESEARCH_INTEGRITY`) built from `createJournalProfile`, spanning
  open access models (Diamond, Gold, Hybrid, Subscription) and disciplines
  (open research, computational linguistics, biomedical data science, climate
  and environment, higher education, African studies, social data science,
  language documentation, engineering systems, research integrity).
- Full `JournalProfile` data per journal: ISSNs, DOI prefixes, publishers,
  countries, review models, editorial structures, workflow stages
  (`STANDARD_WORKFLOW`), editors, review boards, production teams, publishing
  staff, articles across the full status range, issues, and volumes.
- New publishing sub-models per journal: impact metrics and quartiles,
  indexing records, calls for papers, publication queues, issue schedules,
  editorial decision statistics, policies, and analytics.
- Derived exports for the page and future reuse: `JOURNALS`,
  `FEATURED_JOURNAL`, `RECENT_JOURNALS`, `JOURNAL_ISSUES`, `CURRENT_ISSUES`,
  `RECENT_ISSUES`, `JOURNAL_VOLUMES`, `ACCEPTED_ARTICLES`,
  `PUBLISHED_ARTICLES`, `JOURNAL_REVIEWERS`, `CALLS_FOR_PAPERS`,
  `JOURNAL_PORTFOLIO_STATISTICS`, `JOURNAL_PORTFOLIO_EDITORIAL_STATS`,
  `JOURNAL_PORTFOLIO_ANALYTICS`, and `JOURNAL_RELATIONSHIPS`.
- `JOURNAL_RELATIONSHIPS` cross-references the existing placeholder modules:
  manuscripts targeting portfolio journals, datasets, workspace projects,
  manuscript authors (with SAID identifiers), institutions, grants, and
  publications.

## Future extensions

- Live integration with journal submission systems, editorial manager
  workflows, and manuscript tracking.
- DOI minting via the journal `doiPrefix` and indexer (Crossref) registration.
- Reviewer invitation workflow (automated invitations, reminders, conflict of
  interest checks) extending the reviewer assignment data.
- Per-journal detail route (`/journals/[id]`) sharing the existing component
  library.
- Article-level publication routes (`/journals/[id]/articles/[...slug]`) for
  the accepted/published article cards.
- Alerting on call-for-paper deadlines and issue schedule milestones.
- Altmetrics and citation signals flowing from stages 13–14 into journal
  analytics.
- Persistence layer (database tables) when the platform-wide persistence phase
  lands — see the "Future database tables" section in `docs/architecture.md`;
  the types in `types/identity.ts` are the schema seed, and the new optional
  `JournalProfile` fields remain owned by the journals domain rather than being
  duplicated elsewhere.
- Pagination and filtering (by discipline, open access model, quartile,
  indexing coverage) on `/journals`.
