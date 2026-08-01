# Scholatia Manuscript & Submission Workspace Architecture

## Purpose

The Manuscript & Submission module implements **stages 8–10 (Manuscript →
Submission → Peer Review)** of the canonical Scholatia research lifecycle. It is
the dissemination gateway of the lifecycle, sitting between Analysis (stage 7)
and Publication (stage 11). It provides a route (`/manuscripts`), a component
library (`components/manuscripts/`), a placeholder data model
(`constants/placeholder-manuscripts.ts`), and strong TypeScript types
(`types/manuscript.ts`) for describing a manuscript across its whole journey:
drafting, journal targeting, submission, reviewer assignment, review rounds,
editorial decisions, revision history, author contributions, submission
checklists, metadata, relationships to the SAID ecosystem, and publication
readiness.

The module is **additive**: it reuses the existing design system, existing page
patterns, the existing `ResearchLifecycleEngine`, and — critically — the
existing **journal infrastructure** (`types/identity.ts`,
`lib/journals.ts`, `components/journals/*`). It introduces no duplicate
lifecycle definitions, no duplicate journal domain objects, no APIs, no
database, no server actions, and no external packages.

## Relationship to the Research Lifecycle

- Every manuscript carries a canonical stage id, `Manuscript.stageId`, typed as
  `ManuscriptLifecycleStageId = 'manuscript' | 'submission' | 'peer-review'`
  (a subset of `ResearchLifecycleStageId`, orders 8–10).
- Stage definitions are sourced at runtime from the `ResearchLifecycleEngine`
  (`lib/lifecycle.ts`), never hardcoded in the module:
  - `constants/placeholder-manuscripts.ts` derives
    `MANUSCRIPT_LIFECYCLE_STAGE`, `SUBMISSION_LIFECYCLE_STAGE`, and
    `PEER_REVIEW_LIFECYCLE_STAGE` via `ResearchLifecycleEngine.getStage(...)`.
  - `ManuscriptCard` resolves each manuscript's stage via
    `ResearchLifecycleEngine.getStage(manuscript.stageId)`.
  - `ManuscriptTimeline` resolves the previous stage (`analysis`) and next
    stage (`publication`) through `ResearchLifecycleEngine.getPreviousStage` /
    `getNextStage`, rendering `Analysis → Manuscript → Submission → Peer Review
    → Publication`.
  - `buildManuscriptStatistics` uses
    `ResearchLifecycleEngine.getCompletionPercentage('peer-review')` for the
    portfolio-level lifecycle progress metric.
- Lifecycle position summary:

  ```
  Analysis (7) → Manuscript (8) → Submission (9) → Peer Review (10) → Publication (11)
  ```

- Relationships are declared per manuscript against the SAID ecosystem:
  Research Project, Dataset, Grant, Publication, and Researcher (SAID
  identifiers) — the same pattern established by the Dataset module.

## Entity model

Types live in `types/manuscript.ts`.

| Entity | Description |
|---|---|
| `Manuscript` | Aggregate root: identity, title, description, `stageId`, status, corresponding author, institution, dates, DOI/preprint DOI, authors, versions, submissions, target journals, revisions, contributions, checklist, metadata, relationships, readiness, tags. |
| `ManuscriptStatus` | `draft`, `submitted`, `under-review`, `major-revision`, `minor-revision`, `accepted`, `rejected`, `withdrawn`. Complements `stageId`: status reflects process position, stage reflects the canonical owner. |
| `ManuscriptAuthor` | A credited person with role (`first`, `corresponding`, `senior`, `co-author`), SAID identifier, institution, and optional ORCID. |
| `ManuscriptVersion` | A draft/revision file: version string, creation date, status (`draft`, `submitted`, `revised`, `accepted`, `superseded`), filename, word/page counts, optional DOI and change notes. |
| `ManuscriptSubmission` | A concrete journal submission: references a journal by id/title, uses `JournalSubmissionType` and `ReviewModel` from the journals domain, plus submission status, manuscript id, review rounds, and an optional final editorial decision. |
| `ReviewRound` | A round of peer review: status (`invited`, `in-progress`, `completed`), invited/completed reviewers, and reviewer comments. |
| `ReviewerComment` | A review: display name or anonymous label, recommendation, date, summary, and details. |
| `EditorialDecision` | A decision (`accept`, `minor-revision`, `major-revision`, `reject`, `withdraw`) with round, date, and summary. |
| `TargetJournal` | Reuses the full `JournalProfile` domain object from `types/identity.ts`, plus manuscript-side fit (`high`/`medium`/`low`), status, and target submission type. |
| `ManuscriptRevision` | A revision round applied in response to feedback: version, date, reason, summary, status. |
| `AuthorContribution` | A CRediT-style role mapped to author ids. |
| `SubmissionChecklistItem` | A required/optional pre-submission item with completion state and optional note. |
| `ManuscriptMetadata` | Abstract, keywords, subjects, language, word/page counts, figures, tables, references. |
| `ManuscriptRelationships` | Optional project reference, datasets, grants, publications, and researcher SAIDs. |
| `PublicationReadiness` | A readiness score plus per-check completion and status (`ready`, `in-progress`, `not-ready`). |
| `PeerReviewSummary` | Portfolio-level review aggregates: rounds, completed rounds, invited/completed reviewers, average recommendation, summary. |
| `ManuscriptStatistics` | Portfolio aggregates: totals per status, average review days, lifecycle completion percentage. |
| `ManuscriptTimelineEntry` | A timeline event (Draft, Submission, Review, Decision, Revision, Acceptance, Withdrawal). |

### Manuscript status flow

A manuscript moves through stages 8 → 9 → 10 and back (revision loops):

```
manuscript (draft) → submission (submitted) → peer-review (under-review)
      → (major/minor-revision) → submission … → accepted | rejected | withdrawn
```

## Journal integration

The module **reuses the journals domain rather than re-modeling it**:

- `TargetJournal.journal` is a full `JournalProfile` (`types/identity.ts`),
  built in placeholder data via `createJournalProfile` (`lib/journals.ts`).
- `ManuscriptSubmission` uses `JournalSubmissionType` and `ReviewModel` directly
  from `types/identity.ts`.
- `components/journals/SubmissionStatusCard`, `PeerReviewCard`, and
  `ReviewerCard` are imported and composed inside the manuscript components:
  - `SubmissionStatusCard` (manuscripts) renders the latest submission panel
    and delegates the journal's submission-type badges to the journals
    `SubmissionStatusCard`.
  - `JournalTargetCard` renders each target journal with the journals
    `SubmissionStatusCard` and `PeerReviewCard` embedded.
  - `ReviewerAssignmentCard` renders each assigned reviewer using the journals
    `ReviewerCard`.
- The `useSubmission` and `usePeerReview` hooks (`hooks/useSubmission.ts`,
  `hooks/usePeerReview.ts`) feed per-journal submission types and peer review
  models into `JournalTargetCard`.

Because the journals `SubmissionStatusCard` is a default export and the
manuscripts `SubmissionStatusCard` is a named export, the manuscript component
imports the journal one under an alias (`JournalSubmissionStatusCard`); the
manuscripts barrel `components/manuscripts/index.ts` exports only the
manuscript version, avoiding symbol collisions when both barrels are imported.

## Component map

All manuscript components live in `components/manuscripts/` and are re-exported
from `components/manuscripts/index.ts`. They consume existing UI primitives
(`PageLayout`, `PageHeader`, `SectionCard`, `SectionTitle`, `Alert`,
`StatisticCard`, `Timeline`, `Badge`, `Button`), the journal components listed
above, and lifecycle data from `lib/lifecycle.ts`.

| Component | Responsibility |
|---|---|
| `ManuscriptCard` | Compact card: status + lifecycle-stage badges, title, description, tags, author/version/journal/updated metrics, DOI/preprint id. |
| `ManuscriptStatistics` | `StatisticCard` grid: totals, drafts, submitted, under review, in revision, accepted, rejected, withdrawn, average review time, lifecycle progress. |
| `ManuscriptTimeline` | Lifecycle banner (`Analysis → Manuscript → Submission → Peer Review → Publication`) plus chronological manuscript events. |
| `SubmissionStatusCard` | Latest submission panel (status, journal, submission type, review model) plus the journal submission-type card. |
| `JournalTargetCard` | Target journals with fit/status badges and embedded journal submission-type + peer-review cards. |
| `ReviewerAssignmentCard` | Assigned reviewers per round (via journals `ReviewerCard`) and reviewer summaries with recommendations. |
| `RevisionHistoryCard` | Revision rounds with version badges, dates, reasons, and summaries. |
| `DecisionHistoryCard` | Editorial decisions across all submissions and rounds. |
| `PeerReviewSummaryCard` | Aggregate review-round and reviewer statistics plus average recommendation. |
| `SubmissionChecklist` | Pre-submission checklist with progress bar, required badges, and notes. |
| `ManuscriptMetadataCard` | Abstract, keywords, subjects, language, word count, pages, figures, tables, references, DOI/preprint. |
| `AuthorContributionCard` | Author rows (SAID + ORCID) and CRediT-style contribution mapping. |
| `ManuscriptRelationshipCard` | Research project, datasets, grants, publications, and researcher SAIDs. |
| `PublicationReadinessCard` | Readiness score, progress bar, per-check completion, and status. |
| `format` | Shared formatting helpers (`formatDate`, `formatShortDate`, `formatCompactNumber`). |

## Route map

| Route | Page | Section |
|---|---|---|
| `/manuscripts` | `app/manuscripts/page.tsx` | Statistics, overview (all manuscripts), spotlight (submission status, target journals, revision history, publication readiness, peer review summary, reviewer assignments, editorial decisions, submission checklist), metadata, authors & contributions, relationships, timeline, recently updated, placeholder alert. |

The route is not added to primary navigation (per module constraints) and is
reachable from existing module pages via the existing `Button href` pattern used
by `/research` → `/projects` → `/datasets`.

## Dependency graph

```
Manuscript module
  ├── lib/lifecycle.ts            (ResearchLifecycleEngine — stages 8, 9, 10, 7, 11)
  ├── lib/journals.ts             (createJournalProfile — journal profiles)
  ├── hooks/useSubmission.ts      (per-journal submission types)
  ├── hooks/usePeerReview.ts      (per-journal peer review models)
  ├── types/research.ts           (ResearchLifecycleStageId)
  ├── types/identity.ts           (JournalProfile, JournalSubmissionType, ReviewModel)
  ├── types/manuscript.ts         (manuscript entity model — new)
  ├── constants/placeholder-manuscripts.ts  (placeholder data + derived exports — new)
  ├── components/journals/*       (SubmissionStatusCard, PeerReviewCard, ReviewerCard)
  ├── components/manuscripts/*    (component library — new)
  ├── components/layout/*         (PageLayout, PageHeader)
  ├── components/ui/*             (Container, Button, SectionTitle, SectionCard, Alert, StatisticCard, Timeline, Badge)
  └── app/manuscripts/page.tsx    (route — new)
```

The module depends only on existing infrastructure plus its own new files. It
has no dependents, so it can be removed or refactored without affecting other
modules.

## Placeholder data

`constants/placeholder-manuscripts.ts` provides:

- **8 manuscripts** spanning every status (`draft`, `submitted`,
  `under-review`, `major-revision`, `minor-revision`, `accepted`, `rejected`,
  `withdrawn`) across all three stages (manuscript, submission, peer-review).
- **8 journal profiles** built from `createJournalProfile`
  (`lib/journals.ts`), each a full `JournalProfile` with journal id, submission
  types, peer review models, editorial structure, workflow, and editors.
- Authors with SAID identifiers (`SAID-0000-0000-0001` …) and ORCID
  identifiers, including corresponding, first, senior, and co-author roles.
- Multiple versions per manuscript with statuses, filenames, word/page counts,
  and change notes.
- Submissions referencing journals by id with submission type, review model,
  journal manuscript ids (`LRE-D-26-00112`), statuses, review rounds, reviewer
  assignments, anonymous reviewer comments, and editorial decisions.
- Revision history, CRediT-style author contributions, submission checklists,
  and per-manuscript metadata (abstracts, keywords, subjects, counts).
- DOIs (`10.1000/placeholder.2023.0045`) and preprint DOIs.
- Relationships cross-referencing the existing placeholder modules: research
  projects, datasets, grants, publications, and researcher SAIDs.
- Publication readiness scores and checks per manuscript.
- Derived exports: `MANUSCRIPT_TIMELINE_ENTRIES`, `RECENT_MANUSCRIPTS`,
  `FEATURED_MANUSCRIPT`, `FEATURED_PEER_REVIEW_SUMMARY`, and
  `MANUSCRIPT_STATISTICS`.

## Future extensions

- Live integration with journal submission systems and manuscript tracking.
- DOI minting at acceptance and preprint DOI registration.
- Reviewer invitation workflow (automated invitations, reminders, conflict
  of interest checks).
- Author contribution statements exported in the journal's CRediT format.
- Per-manuscript detail route (`/manuscripts/[id]`) sharing the existing
  component library.
- Data availability statements linking manuscript submissions back to the
  Dataset module (stage 6) and its licenses.
- Altmetrics and citation signals flowing from stages 13–14 into manuscript
  records.
- Persistence layer (database tables) when the platform-wide persistence phase
  lands — see the "Future database tables" section in `docs/architecture.md`;
  the types in `types/manuscript.ts` are the schema seed, and `JournalProfile`
  remains owned by the journals module rather than being duplicated.
- Pagination and filtering (by status, stage, journal, tag) on `/manuscripts`.
