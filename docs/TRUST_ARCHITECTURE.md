# Scholatia Trust, Verification & Reputation Engine Architecture

## Purpose

The Trust, Verification & Reputation Engine is the credibility layer of the
Scholatia ecosystem. It verifies identities, scores reputations, awards badges,
tracks peer review and research integrity, anchors academic identity on ORCID,
and recommends verified collaborators, venues, reviewers, grants, and citations.
The module does **not** introduce a new lifecycle stage and does **not** own its
own records; instead every verification record, trust score, reputation report,
badge award, peer review assignment, integrity event, ORCID link, affiliation,
milestone, and recommendation is derived from the existing placeholder modules
(Researchers, Institutions, Journals, Conferences, Publishers, Manuscripts,
Funding, and workspace Publications) and keeps a live reference back to the
original source identity (a SAID, a journal id, a conference id, a publisher id,
an ORCID iD, or a DOI) so no data is duplicated.

The module provides a route, a component library, placeholder data with derived
surfaces, shared utilities, and strong TypeScript types describing the full
credibility surface: the verification engine, the reputation engine (Scholatia
Trust Score, research impact, reviewer/editorial/institutional reputation,
journal and conference quality indices), 10 badges, the peer review
infrastructure, research integrity, academic identity, the recommendation
engine, analytics, statistics, and the aggregate `TrustPortfolio`.

The module is **additive**: it reuses the existing design system, existing page
patterns, existing placeholder modules, and existing shared UI primitives. It
introduces no new packages, no duplicate records, no APIs, no database, no
server actions, no authentication changes, and no external model dependency.

## Relationship to the Research Lifecycle

- Trust is a cross-module credibility layer, like Publishers, Institutions,
  Discovery, and Intelligence, and does **not** own a lifecycle stage. It
  observes records owned by other stages: researchers (identity), institutions
  (stage 1), journals and publishers (stage 4), manuscripts (submission stage 10
  and peer review), conferences (conference stage 12), funding (stage 5), and
  publications (publication stage 11).
- `TRUST_LIFECYCLE_STAGE_ID` is intentionally absent: the module certifies and
  scores rather than owning lifecycle state, so no stage constant is defined.
- Every verification record, reputation report, badge award, peer review
  assignment, integrity event, ORCID record, affiliation, milestone, and
  recommendation keeps the original source identity (a SAID, journal id,
  conference id, publisher id, ORCID iD, or DOI) and a canonical `url` back to
  the source record, so the credibility layer never duplicates data.

## Entity model

Types live in `types/trust.ts`.

| Entity | Description |
|---|---|
| `TrustEntityType`, `TrustVerificationStatus` | The entity kinds the engine certifies (`researcher` / `institution` / `journal` / `conference` / `publisher` / `reviewer`) and the record lifecycle (`unverified` / `pending` / `verified` / `trusted` / `revoked`). |
| `VerificationEvidence`, `VerificationCheck` | A single piece of evidence, and a weighted step in the verification flow. |
| `VerificationRecord` | A verification record for a single entity: status, verification level, checks, provenance, and summary. |
| `VerificationEngineSummary` | Rollup of every verification record, including tallies by entity type. |
| `ReputationFactor`, `TrustScoreGrade`, `TrustScoreBreakdown` | A weighted contribution to a score, the agency-style letter band (`AAA`…`D`), and the full breakdown behind a Scholatia Trust Score. |
| `ResearchImpactScore` | Citations, h-index, i10-index, percentile, citation velocity, field-weighted impact, and composite score. |
| `ReviewerReputation`, `EditorialReputation`, `InstitutionalReputation` | Reputation surfaces for reviewers, editors, and institutions. |
| `ConferenceQualityIndex`, `JournalQualityIndex` | The derived CQI and JQI quality indices for conferences and journals. |
| `ReputationReport` | Aggregate reputation surface for a single scored entity, carrying its trust score plus the relevant sub-surfaces. |
| `BadgeId`, `BadgeTier`, `BadgeDefinition`, `BadgeAward` | The 10 badge definitions, the four seniority tiers, and badges actually awarded to entities. |
| `PeerReviewModel`, `ReviewRecommendation`, `ReviewAssignmentStatus` | Supported review models, review recommendations, and assignment lifecycle states. |
| `ReviewerAssignment`, `ReviewHistoryEntry`, `ReviewerAnalytics` | A reviewer assignment against a manuscript, a review-history entry, and reviewer-pool analytics. |
| `PeerReviewInfrastructureReport` | Aggregate root of the peer review infrastructure. |
| `IntegrityEventType`, `IntegrityStatus`, `IntegritySeverity`, `IntegrityEvent`, `IntegrityTimelineEntry` | The research integrity surface: event types, statuses, severities, events, and a timeline. |
| `ResearchIntegrityReport` | Aggregate root of the research integrity surface. |
| `OrcidIntegrationStatus`, `OrcidRecord`, `AffiliationRecord`, `AcademicMilestoneType`, `AcademicMilestone`, `AcademicTimelineEntry` | The academic identity surface: ORCID integration, affiliations, milestones, and timeline. |
| `AcademicIdentityReport` | Aggregate root of the academic identity surface. |
| `TrustRecommendationType`, `TrustConfidence`, `TrustRecommendation` | The recommendation engine base type with confidence calibration. |
| `RecommendedCollaborator`, `JournalFitRecommendation`, `ConferenceFitRecommendation`, `ReviewerRecommendation`, `SuggestedGrant`, `CitationSuggestion` | The six typed recommendation subtypes. |
| `RecommendationEngineReport` | Aggregate root of the recommendation engine. |
| `TrustStatistics`, `TrustAnalytics` | Statistic-card level aggregates and analytical tallies across every trust surface. |
| `TrustPortfolio` | Aggregate root of the module: verification, reputation, badges, peer review, integrity, academic identity, recommendations, statistics, and analytics. |

## Component map

All trust components live in `components/trust/` and are re-exported from
`components/trust/index.ts`. They consume existing UI primitives (`PageLayout`,
`PageHeader`, `SectionTitle`, `Alert`, `Button`, `Container`, `StatisticCard`,
`Badge`) and follow the same conventions as `components/intelligence/*` and the
other module component libraries.

| Component | Responsibility |
|---|---|
| `TrustBadge` | Named badges over the shared `Badge` primitive: `StatusBadge`, `GradeBadge`, `ConfidenceBadge`, `TierBadge`, `SeverityBadge`, `IntegrityStatusBadge`, `RecommendationBadge`, `ReviewModelBadge`, `ScorePill`. |
| `TrustScoreCard` | A Scholatia Trust Score breakdown with factor bars, grade, status, and summary. |
| `VerificationBadge` | Entity-type pill plus verification status for a record. |
| `VerificationChecklist` | Weighted verification checks with per-check status and evidence. |
| `VerificationRecordCard` | A full verification record: status, level, provenance, progress, and checks. |
| `VerificationEngineSummary` | `StatisticCard` grid over the verification engine rollup. |
| `ReputationCard` | A reputation report with entity type, score, grade, and per-type metric highlight. |
| `CitationImpactCard` | Research impact score: citations, h-index, percentile, velocity, FWCI, composite. |
| `ResearchQualityCard` | Journal Quality Index with acceptance, decision time, citations, and indexing. |
| `ConferenceQualityCard` | Conference Quality Index with acceptance, submissions, h-index, and satisfaction. |
| `InstitutionalRankingCard` | Institutional reputation with outputs, citations, and external rankings. |
| `ReviewerCard` | Reviewer reputation with reviews, turnaround, quality, and punctuality. |
| `ReviewerLeaderboard` | Ranked leaderboard of reviewers by reputation score. |
| `EditorialReputationCard` | Editorial reputation with manuscripts handled, decisions, and journals served. |
| `BadgeCard` | A badge definition with its icon, tier, audience, and criteria. |
| `BadgeAwardCard` | A badge actually awarded to an entity, with criteria met. |
| `TrustBadges` | Grid of badge definitions plus awarded badges. |
| `PeerReviewAssignmentCard` | A review assignment with model, status, reviewer, and recommendation. |
| `ReviewHistoryCard` | A review-history entry with role, model, and outcome. |
| `ReviewerAnalyticsPanel` | Reviewer-pool analytics with recommendation distribution bars. |
| `PeerReviewInfrastructure` | The peer review report root: summary, models, analytics, assignments, and history. |
| `IntegrityEventCard` | An integrity event with type, severity, status, parties, and resolution. |
| `IntegrityTimeline` | Chronological integrity timeline. |
| `ResearchIntegrityReportCard` | The integrity report root: tallies, summary, events, and timeline. |
| `OrcidCard` | ORCID integration record with works synced, permissions, and visibility. |
| `AffiliationCard` | A verified affiliation with role, current flag, and dates. |
| `AcademicMilestones` | Verified career milestone timeline. |
| `AcademicTimeline` | Academic timeline grouped by education / employment / publication / grant / award / milestone. |
| `AcademicIdentityCard` | The academic identity report root: ORCID, affiliations, milestones, and timeline. |
| `TrustRecommendationCard` | Generic recommendation card with type, confidence, reasons, and score. |
| `CollaboratorCard` | A recommended collaborator with shared interests and trust score. |
| `JournalRecommendationCard` | A journal fit with impact factor, quartile, and fit score. |
| `ConferenceRecommendationCard` | A conference fit with country, dates, and quality index. |
| `ReviewerRecommendationCard` | A recommended reviewer with expertise and turnaround. |
| `GrantSuggestionCard` | A suggested grant with funder, amount, career stage, and deadline. |
| `CitationSuggestionCard` | A suggested citation with venue, year, and DOI. |
| `RecommendationEnginePanel` | The recommendation engine report root with the full ranked feed. |
| `TrustStatistics` | `StatisticCard` grid over the module statistics. |
| `TrustAnalytics` | Analytics panels: verification by entity type, badges by tier, score distribution, integrity/recommendation by type, reviewer leaderboard, most-reviewed journals. |
| `format` | Shared formatting helpers (`formatTrustStatus`, `formatTrustGrade`, `formatScore`, `formatPercent`, `formatTierLabel`, `formatConfidence`, severity/status/recommendation variants, entity type and recommendation type labels/icons, milestone icons, date/number helpers). |

## Route map

| Route | Page | Section |
|---|---|---|
| `/trust` | `app/trust/page.tsx` | Featured verification, verification overview and records, featured reputation with trust score, reputation reports, quality surfaces (impact / JQI / CQI / institutional rankings), trust statistics, featured badge, badges, featured peer review assignment, reviewer leaderboard, peer review infrastructure, featured integrity event, research integrity report, academic identity, featured recommendation, collaborator / journal / conference / reviewer / grant / citation recommendations, full recommendation feed, trust analytics, placeholder alert. |

The route uses the existing `Button href` pattern so module pages can link to
it, mirroring how the other analytical layers are reached. Entity detail routes
remain the source modules' own routes; every derived surface references the
original `url`.

## Dependency graph

```
Trust module
  ├── lib/trust.ts               (pure trust utilities — new)
  ├── types/trust.ts             (trust entity model — new)
  ├── types/identity.ts          (VerificationLevel, JournalProfile)
  ├── constants/placeholder-trust.ts          (derived trust surfaces — new)
  ├── constants/placeholder-researchers.ts    (researchers — SAID index)
  ├── constants/placeholder-institutions.ts   (institutions)
  ├── constants/placeholder-journals.ts       (journals)
  ├── constants/placeholder-conferences.ts    (conferences)
  ├── constants/placeholder-publishers.ts     (publishers)
  ├── constants/placeholder-manuscripts.ts    (manuscripts)
  ├── constants/placeholder-funding.ts        (funding opportunities)
  ├── constants/placeholder-research.ts       (workspace publications)
  ├── hooks/useTrust.ts          (trust context hook — new)
  ├── components/trust/*         (component library — new)
  ├── components/layout/*        (PageLayout, PageHeader)
  ├── components/ui/*            (Container, Button, SectionTitle, Alert, StatisticCard, Badge)
  └── app/trust/page.tsx         (route — new)
```

The module depends only on existing infrastructure plus its own new files. Every
derived surface is computed from existing placeholder identity (SAIDs, journal
ids, conference ids, publisher ids, ORCID iDs, DOIs), so no data is duplicated.

## Placeholder data

`constants/placeholder-trust.ts` provides:

- **Verification records** for every researcher, journal, conference,
  institution, and publisher, each with weighted checks and provenance, plus the
  `TRUST_VERIFICATION_SUMMARY` rollup and the featured record.
- **Reputation reports** for every researcher (with research impact, editorial,
  and reviewer reputation), journal (with JQI), conference (with CQI), and
  institution (with institutional reputation and rankings), plus the focus
  researcher's `FOCUS_TRUST_REPORT`.
- **10 badge definitions** (verified researcher / institution / journal /
  publisher / conference, top reviewer, outstanding editor, highly cited, open
  science champion, trusted vendor) and the awards currently held, tiered by
  score.
- **Reviewer assignments** projected from manuscript submission rounds, the
  reviewer reputation list, review history, reviewer-pool analytics, and the
  `TRUST_PEER_REVIEW_REPORT`.
- **Integrity events** across retractions, corrections, expressions of concern,
  conflicts of interest, ethics approvals, and plagiarism status, with the
  timeline and `TRUST_INTEGRITY_REPORT`.
- **Academic identity** anchored on the focus researcher's SAID and ORCID:
  `TRUST_ORCID_RECORD`, verified affiliations, milestones, timeline, and the
  `TRUST_ACADEMIC_IDENTITY_REPORT`.
- **Recommendations** for collaborators, journals, conferences, reviewers,
  grants, and citations matched to the focus researcher's discipline and trust
  signals, plus the `TRUST_RECOMMENDATION_ENGINE` report.
- Derived aggregates: `TRUST_STATISTICS`, `TRUST_ANALYTICS`, and the aggregate
  `TRUST_PORTFOLIO`, plus per-surface featured picks (`FEATURED_VERIFICATION`,
  `FEATURED_REPUTATION`, `FEATURED_BADGE_AWARD`, `FEATURED_ASSIGNMENT`,
  `FEATURED_INTEGRITY_EVENT`, `FEATURED_RECOMMENDATION`).

## Utilities

`lib/trust.ts` provides pure, strongly typed helpers that operate on the trust
surfaces so scoring, ranking, banding, and filtering logic is never
re-implemented in data or pages:

- `resolveTrustConfidence`, `resolveTrustStatus`, `resolveTrustGrade`,
  `resolveBadgeTier`, and `TRUST_STATUS_LABELS`
- `averageScores`, `computeWeightedScore`, and `buildTrustScoreBreakdown`
- `sortTrustByScore`, `filterRecommendationsByType`,
  `filterVerificationByEntityType`
- `verificationProgress`, `completedReviewCount`
- `resolvePeerReviewModelLabel`, `resolveReviewRecommendationLabel`
- `resolveIntegrityTypeLabel`, `resolveIntegrityStatusLabel`,
  `integrityResolvedRatio`, `tallyIntegrityByType`
- `averageReputationScore`, `findBestReputationForType`

## Hooks

`hooks/useTrust.ts` is a client hook that derives a typed trust context from the
placeholder portfolio: the full `TrustPortfolio`, verification records,
statistics and analytics, the focus researcher's trust score, featured picks,
top reputation reports, active review assignments, and bound helpers
(`verificationProgressOf`, `recordsForEntityType`, `recommendationsByType`,
`sortedByScore`, `trustConfidenceFor`, `bestReputationForType`,
`verificationStatusOf`).

## Future extensions

- Live connectors (ORCID, institutional registries, ISSN and indexing databases,
  retraction registries, Crossref/OpenAlex citations) replacing the derived
  placeholder signals.
- Personalised trust surfaces keyed to the signed-in researcher's SAID instead
  of the fixed focus researcher.
- Dynamic trust-score recalculations fed by real verification and review
  events, with decay and re-verification cadence.
- Badge issuance workflows and appeal handling.
- Persistence layer (database tables) when the platform-wide persistence phase
  lands; the types in `types/trust.ts` are the schema seed.
