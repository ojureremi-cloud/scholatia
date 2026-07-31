# Scholatia Research Lifecycle Architecture

> Status: **Analysis document** — no code, routes, or features were changed.
> Companion docs: `docs/architecture.md`, `docs/identity-architecture.md`.

## 1. Purpose

This document maps the Scholatia repository to the canonical 17-stage research
lifecycle and defines how the platform's core modules relate. It records what
already exists, what is missing, the development tracker, the dependency map,
and the recommended implementation order. It does **not** prescribe UI changes.

## 2. Canonical research lifecycle (17 stages)

The end-state target model this repository should eventually support:

```
 1. Idea
 2. Concept Note
 3. Proposal
 4. Funding
 5. Research Project
 6. Dataset
 7. Analysis
 8. Manuscript
 9. Submission
10. Peer Review
11. Publication
12. Conference
13. Citation
14. Impact
15. Knowledge Transfer
```

The codebase already contains two narrower lifecycle vocabularies that must be
reconciled with the model above:

| Vocabulary | Source | Stages |
|---|---|---|
| **Research lifecycle (5)** | `lib/research.ts:30` (`getResearchLifecycleStages`), `types/research.ts:29` (`ResearchLifecycleStage`), `constants/placeholder-research.ts:479` (`RESEARCH_PIPELINE`) | Ideation → Funding → Execution → Analysis → Dissemination |
| **Publication workflow (12)** | `types/identity.ts:246` (`PublicationWorkflowStage`), `JournalProfile.workflow`, `components/journals/PublicationTimeline.tsx` | Submission → Editorial Screening → Reviewer Assignment → Peer Review → Decision → Revision → Acceptance → Copyediting → Typesetting → Proofreading → Publication → Archiving |

### 2.1 Mapping the 17 stages to existing code

| # | Lifecycle stage | Exists today? | Evidence |
|---|---|---|---|
| 1 | Idea | ✅ Partial | `ResearchLifecycleStage.ideation`; `RESEARCH_PIPELINE` Ideation items; draft/`planned` projects ("ideas … being scoped") |
| 2 | Concept Note | ❌ Missing | Implicit only inside draft projects; no concept-note entity |
| 3 | Proposal | ✅ Partial | Draft projects ("proposals being scoped and prepared", `/projects`); `RESEARCH_PIPELINE` Funding item ("proposal under review"); `GRANT_OPPORTUNITIES` |
| 4 | Funding | ✅ Strong | `/grants` (`GrantCard`, `PLACEHOLDER_GRANTS`); `FundingStatusList` + `FUNDING_STATUS`; `GRANT_OPPORTUNITIES`; `ResearchLifecycleStage.funding`; funding stats across pages |
| 5 | Research Project | ✅ Strong | `/projects` (stats, funding status, grids, timeline, team); `ResearchProject` type; `WorkspaceProjectCard`, `ProjectTimeline`, `ResearchTeamCard` |
| 6 | Dataset | ❌ Missing | Referenced only: `SAIDProfile.datasets: string[]` (`types/identity.ts`); `ConferenceSubmissionType`/`JournalSubmissionType` include `'Dataset'`; skill "Dataset Curation"; collaborator message re: datasets |
| 7 | Analysis | ✅ Partial | `ResearchLifecycleStage.analysis`; `RESEARCH_PIPELINE` Analysis; `CitationChart`; `/analytics` |
| 8 | Manuscript | ❌ Missing | Referenced only: preprints ("Manuscripts made available online before formal peer review", `/publications`); `ArticleSummary.status` (Draft / Under Review / Accepted) |
| 9 | Submission | ✅ Domain only | `PublicationWorkflowStage 'Submission'`; `useSubmission`; `JournalSubmissionType`; `ResearchDeadline` type `'Submission'`; "EMNLP 2026 Submission" pipeline item. Not surfaced in any page UI |
| 10 | Peer Review | ✅ Domain + components | `PublicationWorkflowStage 'Peer Review'`; `ReviewModel`; `PeerReviewCard`, `ReviewerCard` (journals); `usePeerReview`; skill "Peer Review"; "Outstanding Reviewer Recognition" award; verification checklist "peer review activity" |
| 11 | Publication | ✅ Strong | `/publications` (six publication-type sections + `PublicationTimeline`); `PublicationSummary`, `PublicationCard`, `PublicationTypeSection` |
| 12 | Conference | ✅ Components/hooks | `/conferences` page is a skeleton, but 12 conference components, `useConference*` hooks, `ConferenceProfile` factory, and `ConferenceSubmissionType` are fully built |
| 13 | Citation | ✅ Strong | `/analytics` (total citations, H-index, i10-index, citations/year, by-type share); `CitationChart`; `CITATION_METRICS` |
| 14 | Impact | ✅ Partial | `/analytics` "impact analytics"; home `Services` references "research impact"; `/identity` hub "research impact". No altmetrics / societal-impact model yet |
| 15 | Knowledge Transfer | ❌ Missing | Referenced only: Dissemination stage description ("knowledge sharing"); skill "Knowledge Transfer"; education certifications ("Open Science Practices") |

**Stage coverage summary:** 7 stages fully or partially exist (1, 3, 4, 5, 7, 13, 14);
3 stages exist at domain/component level but are not wired to a page (9, 10, 12);
4 stages are missing (2, 6, 8, 15); 1 stage (11) is a finished page.

## 3. Route mapping

| Route | Page | Lifecycle stages | Maturity |
|---|---|---|---|
| `/` | Home | All (marketing) | ✅ Built |
| `/identity` | SAID hub — index of 15 sections | All | ✅ Built |
| `/profile` | Public scholarly profile | 1–15 (outputs recorded) | ✅ Built |
| `/research` | Research Workspace dashboard | 1–15 (aggregate) | ✅ Built |
| `/projects` | Project workspace | 1, 3, 4, 5 | ✅ Built |
| `/publications` | Publication record + citations | 8–11, 13 | ✅ Built |
| `/grants` | Funding record | 3, 4 | ✅ Built |
| `/analytics` | Citation & impact | 13, 14 | ✅ Built |
| `/verification` | Identity/trust verification | Identity layer | ✅ Built |
| `/orcid` | ORCID linking | 9, 10, 11 (attribution) | ✅ Built |
| `/education` | Qualifications | Supporting profile | ✅ Built |
| `/experience` | Employment + supervision | 5 (supporting) | ✅ Built |
| `/skills` | Skill taxonomy | Supporting | ✅ Built |
| `/interests` | Research interests | Supporting | ✅ Built |
| `/awards` | Awards/recognition | 4, 10 (supporting) | ✅ Built |
| `/affiliations` | Institution memberships | Institutional layer | ✅ Built |
| `/collaborators` | Collaboration network | 5, 11 (supporting) | ✅ Built |
| `/settings` | Profile privacy/preferences | Supporting | ✅ Built |
| `/journals` | Journal directory + submission workflow | 9, 10, 11 | 🟡 Skeleton |
| `/conferences` | Conference hub | 12 | 🟡 Skeleton |
| `/institutions` | Institution profiles | Institutional layer | 🟡 Skeleton |
| `/marketplace` | Services, funding, tools | 4, 15 (exchange) | 🟡 Skeleton |
| `/dashboard` | Aggregate overview | 1–15 | 🟡 Skeleton |

## 4. Component mapping

| Layer | Components | Lifecycle stages |
|---|---|---|
| `components/research/*` (16) | `ResearchLifecycleCard`, `ResearchPipeline`, `WorkspaceProjectCard`, `ProjectTimeline`, `ResearchProjectTimeline`, `FundingStatusList`, `GrantOpportunityCard`, `DeadlineList`, `CollaborationRequestCard`, `PublicationTimeline`, `PublicationTypeSection`, `ResearchTeamCard`, `ResearchProjectStatistics`, `ResearchProjectHeader`, `ResearchProjectCard`, `ResearchDashboard` | 1, 3, 4, 5, 7, 8–11, 13 |
| `components/journals/*` (12) | `JournalCard`, `JournalHeader`, `JournalStatistics`, `JournalBadge`, `EditorialBoardCard`, `SubmissionStatusCard`, `PeerReviewCard`, `ReviewerCard`, `PublicationTimeline`, `ArticleCard`, `IssueCard`, `VolumeCard` | 8, 9, 10, 11 |
| `components/conferences/*` (12) | `ConferenceCard`, `ConferenceHeader`, `ConferenceStatistics`, `ConferenceBadge`, `ConferenceTimeline`, `CommitteeCard`, `RegistrationCard`, `SubmissionCard`, `SpeakerCard`, `SponsorCard`, `VenueCard`, `ScheduleCard` | 9, 12 |
| `components/institutions/*` (11) | `InstitutionCard`, `InstitutionHeader`, `InstitutionBadge`, `InstitutionDirectoryCard`, `InstitutionStatistics`, `InstitutionVerificationCard`, `InstitutionTrustBadge`, `FacultyCard`, `DepartmentCard`, `CampusCard`, `AffiliationTimeline` | 3, 4, 5 (org layer) |
| `components/identity/*` (23) | `ProfileHeader`, `IdentityCard`, `PublicationSummary`, `PublicationCard`, `ProjectCard`, `AwardCard`, `GrantCard`, `CollaboratorCard`, `VerificationChecklist`, `CitationChart`, `OrcidStatusCard`, `ProfilePreferences`, `EducationTimeline`, `EmploymentTimeline`, etc. | 1, 4, 5, 10, 11, 13 |
| `components/ui/*` (45) | `ResearchLifecycleBadge` (phase pill), `Timeline` (generic), `TrustBadge`, `VerificationBadge`, `RoleBadge`, `StatisticCard`, `ProjectStatusBadge`, etc. | Cross-cutting primitives |
| `features/*` (7) | `auth`, `ai`, `verification`, `researchers` (config); `journals`, `conferences`, `institutions` (config + component barrels) | Domain entry points |
| `hooks/*` (26) | `useResearchProfile`, `useSubmission`, `usePeerReview`, `useConferenceSubmissions`, `useEditorialBoard`, `useInstitutionVerification`, `useTrustScore`, `useVerification`, `useIdentity`, `useSession`, `usePermissions`, search hooks, etc. | Domain bindings |
| `lib/*` | `said.ts`, `research.ts`, `auth.ts`, `journals.ts`, `conferences.ts`, `institutions.ts` | Factories/helpers |

## 5. Missing stages and what is needed

| Stage | Gap | Natural home |
|---|---|---|
| 2. Concept Note | No entity/type/page; only implicit in drafts | `/research` workspace (pre-proposal) |
| 6. Dataset | Only `datasets: string[]` on `SAIDProfile` + submission-type references | New Dataset module between Research Project and Analysis |
| 8. Manuscript | Only preprint wording and `ArticleSummary` status | Journal submission workflow (draft → under review) |
| 15. Knowledge Transfer | Only Dissemination wording + skills/certs | New module (open science, training, outreach, marketplace services) |

Foundational gap: `getResearchLifecycleStages()` models 5 coarse stages only, and
`lib/research.ts` is **not** re-exported from `lib/index.ts` (the only lib module
missing from the barrel). The lifecycle engine must be expanded to model all 17
stages before stage-specific modules can coordinate.

## 6. Module relationship model

```
                          Academic Identity (SAID)
                  identity + verification + trust + RBAC core
             ┌───────────────┬───────────────┬───────────────┐
             ▼               ▼               ▼               ▼
   Research Workspace   Publications    Conferences    Institutions
   (researcher control  (outputs 8-11)  (venue 12)      (org layer:
    room, stages 1-7)                                  verify, host, accredit)
             │               │               │               │
             └───────────────┴───────┬───────┴───────────────┘
                                     ▼
                       Research Lifecycle (17 stages)
                        the orchestration spine
                                     │
                                     ▼
                          Marketplace (exchange layer)
                   funding opportunities · services · tools
                   (serves Funding 4 and Knowledge Transfer 15)
```

**Definitions and relations:**

- **Academic Identity (SAID)** — the identity and trust core (`types/identity.ts`,
  `lib/said.ts`, `lib/auth.ts`). Every actor in every other module is a SAID. It is
  the prerequisite for all modules: verification level, trust score, RBAC, audit.
  Implemented: ✅.
- **Research Workspace** — the researcher-facing control room (`/research`,
  `/projects`). The concrete view of the Research Lifecycle for an individual
  researcher: what is at each stage, what is due, what funding is available.
  Implemented: 🟡 (dashboard built on 5-stage model + placeholder data).
- **Research Lifecycle** — the process spine (`types/research.ts`,
  `lib/research.ts`, `RESEARCH_PIPELINE`). Owns the 17 stages and moves a research
  output through them. Every other module implements one or more stages.
  Implemented: 🟡 (5-stage model only).
- **Publications** — the output layer (`/publications`). Captures the downstream
  stages 8–13. Feeds Citation/Impact. Owned by an author's SAID; indexed by
  Journals; surfaced by Conferences. Implemented: ✅.
- **Journals** — a dissemination venue with its own 12-stage publication workflow
  (`types/identity.ts`, `components/journals/*`, `useJournal*` hooks). Implements
  stages 8–11 on behalf of Publications. Implemented: 🟡 (domain complete, page
  skeleton).
- **Conferences** — a parallel dissemination venue (`components/conferences/*`,
  `useConference*` hooks). Implements stage 12; overlaps stages 8–11 via its own
  submission type model. Implemented: 🟡 (domain complete, page skeleton).
- **Institutions** — the organisational layer (`components/institutions/*`,
  `useInstitution*` hooks). Verify SAIDs (Level 3+), host research projects,
  employ researchers, accredit journals/conferences, fund research. Implemented:
  🟡 (domain complete, page skeleton).
- **Marketplace** — the exchange layer (`/marketplace`). Connects funders to
  researchers (stage 4), services/tools to every stage, and enables knowledge
  transfer offerings (stage 15). Implemented: ❌ (skeleton page).

## 7. Development tracker

### ✅ Completed
- SAID identity core: `/identity`, `/profile`, `/verification`, `/orcid`
- Identity sub-pages: `/education`, `/experience`, `/skills`, `/interests`,
  `/awards`, `/affiliations`, `/collaborators`, `/settings`
- Publications & impact: `/publications`, `/analytics`
- Funding records: `/grants`
- Research workspace: `/research`, `/projects`
- Domain model: `types/identity.ts`, `types/research.ts`, `types/security.ts`;
  `lib/said.ts`, `lib/research.ts`, `lib/auth.ts`, `lib/journals.ts`,
  `lib/conferences.ts`, `lib/institutions.ts`
- RBAC / zero-trust: `lib/auth.ts`, `types/security.ts`
- 26 hooks; 45 UI primitives; identity/research/journals/conferences/institutions
  component libraries; 7 feature barrels

### 🟡 In Progress
- Research Workspace as a full lifecycle hub (5-stage model, placeholder data)
- Journals module (domain built; `/journals` page skeleton)
- Conferences module (domain built; `/conferences` page skeleton)
- Institutions module (domain built; `/institutions` page skeleton)
- `lib/research.ts` integration into `lib/index.ts` barrel

### 📋 Planned
- Research Lifecycle engine: expand 5-stage model to the 17-stage model
- Dataset module (stage 6)
- Manuscript + Submission workflow in UI (stages 8–9)
- Peer Review workflow in UI (stage 10)

### 🔮 Future
- Marketplace (stages 4 & 15 exchange)
- Knowledge Transfer module (stage 15)
- Aggregate `/dashboard`
- Navigation overhaul to surface the real App Router routes
- Persistence layer (database tables listed in `docs/architecture.md`)
- ORCID live sync; altmetrics / societal-impact model (stage 14)

## 8. Dependency map

Stage-level dependencies (stage `N → N+1`):

```
Idea(1) → Concept Note(2) → Proposal(3) → Funding(4) → Research Project(5)
   → Dataset(6) → Analysis(7) → Manuscript(8) → Submission(9) → Peer Review(10)
   → Publication(11) ─┬→ Citation(13) → Impact(14) → Knowledge Transfer(15)
                      └→ Conference(12) ──┘
```

Module-level implementation dependencies:

| Module | Depends on | Provides |
|---|---|---|
| SAID / Identity | — | identity, verification, trust, RBAC for all modules |
| Research Workspace | SAID, Lifecycle engine | stages 1–7 control room |
| Research Lifecycle engine | SAID (types live on profile) | the 17-stage spine |
| Publications | SAID, Lifecycle, Journals | stages 8–13 outputs |
| Journals | SAID, Lifecycle | stages 8–11 venue workflow |
| Conferences | SAID, Lifecycle | stage 12 venue |
| Institutions | SAID | verification/accréditation/hosting |
| Marketplace | SAID, Funding, Publications, Institutions | stages 4 & 15 exchange |

Build order consequence: **SAID first** (done), then the **lifecycle engine**
(before stage-specific modules can coordinate), then the **mid-lifecycle output
modules** (Dataset, Manuscript/Submission/Peer Review), then the **venues**
(Journals, Conferences), then the **ecosystem layers** (Institutions,
Marketplace, Knowledge Transfer).

## 9. Recommended implementation order

| Phase | Focus | Rationale |
|---|---|---|
| **Phase 0** | SAID / identity / trust / RBAC | Foundation; already complete |
| **Phase 1** | Research Lifecycle engine | Expand `ResearchLifecycleStage` to the 17-stage model; add `lib/research.ts` to the barrel; model `currentPhase` against real stage ids. Everything downstream depends on this. |
| **Phase 2** | **Dataset module (stage 6)** | The only missing stage bridging two existing stages (Research Project → Analysis). Types already referenced (`SAIDProfile.datasets`, `'Dataset'` submission types). Self-contained; small surface. **→ recommended next module** |
| **Phase 3** | Manuscript → Submission → Peer Review flow | Wire the already-built journals domain (`SubmissionStatusCard`, `PeerReviewCard`, `ReviewerCard`, `useSubmission`, `usePeerReview`) into the `/journals` page to complete stages 8–10. |
| **Phase 4** | Publications ↔ Citations/Impact integration | Tighten `/publications` → `/analytics` pipeline (stage 13–14); add altmetrics later. |
| **Phase 5** | Conferences page wiring | Complete stage 12 with the existing conference components/hooks. |
| **Phase 6** | Institutions page wiring | Complete the organisational layer (verification, faculty, affiliations). |
| **Phase 7** | Concept Note (stage 2) | Extend the pre-proposal area of the workspace. |
| **Phase 8** | Knowledge Transfer (stage 15) + Marketplace | Final ecosystem layers: open science, training, outreach, services exchange, funding marketplace. |

**Recommended next module: Dataset (Phase 2).** It is the first missing stage in
lifecycle order (stage 6), sits between two fully existing modules, already has
data-model references, requires no venue to be built first, and delivers a
coherent mid-lifecycle once Phase 1 (lifecycle engine) lands. The precondition is
Phase 1, which is a small, non-UI type/lib change.

## 10. Non-goals and constraints

This document makes no changes. It does not:
- redesign any UI
- add, remove, or modify routes or pages
- implement features
- add dependencies or break the build

Any future implementation must preserve all existing pages and functionality and
keep `npm run lint` and `npm run build` green.
