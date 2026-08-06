# Scholatia Cognitive Research Intelligence Engine — Implementation Blueprint

**MISSION 004-C.** This blueprint translates the constitutional CRIE Architecture
(`docs/crie/CRIE_ARCHITECTURE.md`) and the authoritative engineering contract
(`docs/crie/CRIE_FUNCTIONAL_SPECIFICATION.md`) into the implementation plan that
the coding missions **004-D through 004-M** execute.

This document is **planning only**: it defines the sequence, dependencies,
boundaries, repository mapping, roadmaps, risks, checkpoints, mission breakdown,
size estimates, and conformance matrix. It generates **no code, no routes, no
components, no APIs, and no governance updates**, and it modifies no repository
file other than itself.

---

# Chapter 1 — Implementation Philosophy

## 1.1 Purpose

The blueprint exists so that every coding mission that follows can proceed
without architectural re-derivation. It fixes **what** is built (per the
functional specification), **where** it lives (per the repository mapping), **in
what order** (per the wave and mission sequence), and **within what boundaries**
(per the engine boundaries and integration invariants).

## 1.2 Constitutional and contractual authority

- **CRIE Architecture** (`docs/crie/CRIE_ARCHITECTURE.md`, 70 chapters +
  appendices) is the constitution: it fixes the Research Cognitive Model, the
  L0–L11 intelligence layers, the 14-stage lifecycle, the 6 reasoning
  paradigms, the 8 memory types, the RKG, the autonomy model, the ethics and
  security posture, and the CRIE Constitution (Articles I–XII).
- **CRIE Functional Specification** (`docs/crie/CRIE_FUNCTIONAL_SPECIFICATION.md`,
  18 chapters) is the engineering contract: it fixes the domain model (150
  entities), the database specification (120 tables in 12 groups), the
  TypeScript domain model, the service layer (28 core engines + advisory
  engines), 12 hooks, 48 UI components, 28 routes, the permission matrix, 18
  workflows, the AI interfaces, the Knowledge Graph specification, the Memory
  specification, the agent catalogue (AG-01…AG-36 + ARA-01…ARA-12), the cross
  module integration map, the 12-wave roadmap, the verification checklist, and
  the architecture conformance matrix.
- **CRIE Constitution** (Architecture Ch. 70, Articles I–XII) prevails over
  every provision of the Architecture and the Functional Specification; any
  future conflict SHALL be resolved in favour of the Constitution
  (fspec §18.1; CRIE §70.15).
- **Scholatia AI Development Protocol** (`docs/AI_DEVELOPMENT_PROTOCOL.md`, 18
  sections) governs every coding mission: Audit First, Reuse Before Create,
  Canonical Types, Placeholder Data, Lifecycle, Utilities, Hooks, Components,
  Database, Cross-Module Integration, Documentation, Verification, Recovery,
  Git Protocol, Phase Boundary Rule, Completion Report, Engineering Standards,
  and Platform Principle.

## 1.3 Guiding principles for implementation

The implementation SHALL embody the CRIE architectural principles (CRIE Ch. 2)
at every wave. The table below states how each principle is realised in the
repository.

| Principle | Implementation consequence |
|---|---|
| **P1 — Researcher-Centricity** | Every surface resolves the canonical current user (`ojuri`, Dr. Adebisi Ojurere); no surface invents its own principal. |
| **P2 — Cognitive Continuity** | Context packs, sessions, and the workspace persist across routes through the context/session/workspace engines; no page owns continuity state. |
| **P3 — Provenance by Construction** | Every derived output carries `sourceId`/`sourceEntity`-style provenance; evidence chains close from conclusion to source. |
| **P4 — Separation of Concerns** | Types (`types/crie/`), pure engines (`lib/crie/`), state hooks (`hooks/`), constants (`constants/`), components (`components/crie/`), routes (`app/crie/`) never leak across layers. |
| **P5 — Composition over Monolith** | Engines compose (e.g., `ReasoningEngine` over `KnowledgeGraphEngine`); no mega-service. |
| **P6 — Evidence-Grounded Reasoning** | Engines derive from canonical records; no engine asserts ungrounded claims (SADR-006 derived-first). |
| **P7 — Explainability and Transparency** | Every consequential output renders a trace; opaque outputs SHALL NOT exist. |
| **P8 — Ethical and Integrity Boundaries** | Integrity and ethics engines gate outputs; refusals are recorded (`crie_audit_record`). |
| **P9 — Data Minimalism and Privacy by Design** | Consent-scoped access everywhere; institutional isolation; no cross-institutional personal memory. |
| **P10 — Adaptive Personalisation** | Adaptation flows through the Adaptive Engine and consented learner state, never through hidden state. |
| **P11 — Confidence-Aware Behaviour** | Every derived output carries a calibrated confidence band (`very-low`…`very-high`). |
| **P12 — Governance and Auditability** | Consequential actions logged append-only (L11); `AuditExplorer` is the surface. |
| **P13 — Technology Neutrality** | AI connectors are provider-neutral (`IN-###` contracts); no vendor-bound code. |
| **P14 — Scalability and Resilience** | Derived analytics stay cheap; budgets respected; no N+1 patterns. |
| **P15 — Accessibility and Inclusion** | Semantic HTML, keyboard navigation, labelled controls, contrast. |
| **P16 — Least Privilege and Role Bounds** | Every call runs within the requesting principal's role and consent; no escalation. |
| **P17 — Open Standards and Interoperability** | JSON-LD adapter for graph data; portable memory export; standards-based citation. |
| **P18 — Continuous Improvement within Guardrails** | Waves are additive; regressions are caught by the checkpoint protocol before close. |

## 1.4 Non-negotiable engineering invariants

Every wave SHALL preserve, without exception:

1. **Derived-first** — CRIE owns no external records; it references canonical
   records by identity and derives aggregates (SADR-006; fspec Ch. 15).
2. **Human authority** — no consequential action without explicit human
   approval; overrides recorded (CRIE §62.7, §65.9; Article IV).
3. **Autonomy discipline** — L1–L5 envelopes; L5 disabled by default and never
   default-enabled (CRIE §62.6).
4. **Consent boundaries** — personalisation and memory access follow the
   consent model (CRIE Ch. 60).
5. **Confidence everywhere** — no consequential output without calibrated
   confidence (P11; CRIE §11.7).
6. **Explainability** — every consequential output SHALL be explainable and
   auditable (Article VII; CRIE Ch. 67).
7. **Reuse before create** — never duplicate an existing module's types,
   engine, hook, component, route, or table (AI Development Protocol §2).

## 1.5 Style and convention targets

The implementation SHALL mirror the established module conventions in this
repository, exemplified by the Learning Ecosystem (`types/learning.ts`,
`lib/learning.ts`, `lib/learning-*.ts`, `hooks/useLearning.ts`,
`constants/placeholder-learning.ts`, `components/learning/`, `app/learning/`):

- Pure, framework-free engines in `lib/crie/*` (as `lib/collaboration.ts`,
  `lib/communities.ts`, `lib/workflows.ts`), re-exported explicitly by name from
  `lib/index.ts`.
- Canonical types in `types/crie/*`, re-exported from `types/index.ts`.
- Placeholder graphs in `constants/placeholder-crie.ts`, seeding the hooks;
  hooks **never own data** and delegate derivation to the engines.
- Server Components for all routes under `app/crie/`, following the page
  conventions in `node_modules/next/dist/docs` (`params`/`searchParams` are
  promises; dynamic segments await `params`).
- Identity resolution to the canonical current user (`ojuri`).
- Documentation of each wave in `docs/crie/`.

---

# Chapter 2 — Implementation Sequence

## 2.1 The twelve-wave sequence

The functional specification (fspec Ch. 16) decomposes implementation into
**twelve additive waves**. This blueprint adopts that sequence verbatim. Each
wave is additive, preserves the constitutional invariants, and closes only when
its exit criteria pass (Chapter 12).

| Wave | Scope | Deliverables | Exit criteria |
|---|---|---|---|
| **1 — Core Types** | `types/crie/*.ts` | Entity model, base models, vocabularies, DTOs (fspec Ch. 4) | `tsc --noEmit` clean; no circular imports. |
| **2 — Core Engines** | `lib/crie/*` context, session, lifecycle, workspace engines | Context/Session/Lifecycle/Workspace engines; `lib/index.ts` re-exports (fspec Ch. 5) | Pure engines; no React; no side effects. |
| **3 — Knowledge Graph** | `KnowledgeGraphEngine`, KG types | Entities, relations, provenance, versioning, trust propagation (fspec Ch. 12) | Graph ops derive without side effects. |
| **4 — Reasoning** | `ReasoningEngine` | Multi-paradigm reasoning, traces, arguments (CRIE Ch. 64) | Every trace explainable; confidence attached. |
| **5 — Memory** | `MemoryEngine` | 8 memory types, operations, consolidation (fspec Ch. 13) | Consent-gated; audit complete. |
| **6 — Research Intelligence** | Document, citation, evidence, literature, gap, novelty, methodology, statistics, instrument engines | Advisory domain engines (CRIE Chs. 12–22) | Derived-only; provenance enforced. |
| **7 — Agents** | `AgentCoordinatorEngine`, agent catalogue | AG-01…AG-36 + ARA-01…ARA-12 charters and executor (fspec Ch. 14) | Autonomy envelopes enforced; approvals gate. |
| **8 — Decision Intelligence** | Recommendation, prediction, decision engines | Recommendation/Decision DTOs and lifecycle (CRIE Ch. 65) | Humans remain accountable. |
| **9 — Institution Intelligence** | Institution, enterprise, IKOS surfaces | Enterprise analytics, institutional assets (CRIE Chs. 59–60) | Cell suppression above cohort tier. |
| **10 — Admin** | Policy, audit, connector surfaces | `PolicyConsole`, `AuditExplorer`, `ConnectorRegistry` (CRIE Chs. 44, 67) | L11 enforced; all consequential actions audited. |
| **11 — Optimization** | Search, index, prompt engines | Search/index/prompt optimisation (E-17, E-26, E-27) | Performance and budget discipline met. |
| **12 — Final Verification** | Full verification pass | Fspec Ch. 17 checklist executed; conformance matrix audited | All checks green. |

## 2.2 Wave rationale

- **Types precede engines** (Wave 1 → 2): the domain model fixes the contracts
  every engine consumes; `tsc` enforces the graph.
- **Knowledge Graph precedes Reasoning** (Wave 3 → 4): the RKG is the substrate
  for the graph reasoning paradigm and for novelty/gap work.
- **Memory precedes Research Intelligence** (Wave 5 → 6): document, citation,
  and evidence outputs write to memory; research intelligence relies on recall.
- **Engines precede Agents** (Wave 6 → 7): agents delegate to engines; agents
  are thin orchestrators over proven derivation.
- **Agents precede Decision Intelligence** (Wave 7 → 8): decision framing
  consumes agent-produced recommendations and predictions.
- **Admin and Optimization are last** (Waves 10–11): policy, audit, and
  connector surfaces wrap a working system; optimization tunes it.
- **Final Verification closes the loop** (Wave 12): fspec Ch. 17 executed
  end-to-end.

## 2.3 Reconciliation with the mission prompt's illustrative sequence

The mission brief sketched a ten-wave example (Core Engine, Knowledge Graph,
Research Intelligence, Reasoning, Agents, Decision Intelligence, Institutional
Intelligence, Memory, Federation, Optimization). The authoritative sequence in
the functional specification is the twelve-wave table above; the illustrative
sequence is reconciled as follows:

| Illustrative prompt wave | Reconciliation |
|---|---|
| Wave 1 Core Engine | Covers Waves 1–2 (Core Types + Core Engines). |
| Wave 2 Knowledge Graph | Exactly Wave 3. |
| Wave 3 Research Intelligence | Covers Waves 5–6 (Memory + Research Intelligence); memory is its foundation. |
| Wave 4 Reasoning | Exactly Wave 4 (ordered before memory-consuming research intelligence). |
| Wave 5 Autonomous Agents | Exactly Wave 7. |
| Wave 6 Decision Intelligence | Exactly Wave 8. |
| Wave 7 Institutional Intelligence | Covers Waves 9–10 (Institution Intelligence + Admin). |
| Wave 8 Memory Architecture | Folds into Wave 5 (Memory) which precedes research intelligence. |
| Wave 9 Federation | The federation track (E-21, CRIE Ch. 66) is planned in Wave 9 territory and delivered with the Federation mission (004-J). |
| Wave 10 Optimization | Exactly Wave 11. |

The **twelve-wave table in §2.1 is authoritative**; the reconciliation above
exists only to show that no capability from the mission brief is lost.

---

# Chapter 3 — Dependencies

## 3.1 Reused Scholatia modules (already exist — never duplicate)

CRIE integrates by reference. Every module below already exists with canonical
types, a pure engine, a hook, components, routes, and (mostly) placeholder
constants. CRIE SHALL import from them; CRIE SHALL NOT copy their records.

| Module | Canonical types | Engine (lib/) | Hook | Routes (app/) | CRIE usage |
|---|---|---|---|---|---|
| **Identity** | `types/identity.ts`, `types/auth.ts`, `types/rbac.ts` | `lib/auth/*`, `lib/rbac.ts`, `lib/said.ts` | `useIdentity`, `useAuth`, `usePermissions`, `useRequireRole` | `/login`, `/register`, `/identity` | `IdentityEngine` (E-22) resolves `researcherOf` (username/SAID). |
| **Researcher profile** | `types/researcher.ts` | `lib/researchers.ts` | `useResearchProfile` | `/researchers` | Canonical researcher records; RKG People nodes. |
| **Research lifecycle / projects** | `types/research.ts` | `lib/research.ts`, `lib/lifecycle.ts` | — | `/research/**` | 14 lifecycle stages; canonical project records for the RCM. |
| **Institutions** | `types/institution.ts` | `lib/institutions.ts` | `useInstitution` | `/institutions`, `/institutional-network` | Organisation nodes; institutional scope. |
| **Journals / Conferences / Publishers** | `types/journals`… (in `types/journals.ts`, `types/conference.ts`, `types/publisher.ts`) | `lib/journals.ts`, `lib/conferences.ts` | `useJournal`, `useConference*` | `/journals`, `/conferences`, `/publishers` | Venue nodes; publication/journal intelligence (E-10, JournalEngine). |
| **Funding / Grants** | `types/funding.ts` | — | — | `/grants`, `/funding` | GrantEngine (E-09) funding discovery references canonical grants. |
| **Trust & Verification** | `types/trust.ts` | `lib/trust.ts` | `useTrust`, `useTrustScore`, `useVerification` | `/trust`, `/verification` | `TrustEngine` (E-23) and `VerificationEngine` (E-24) consume verification signals. |
| **Workflow (SWTROP)** | `types/workflows.ts` | `lib/workflows.ts`, `lib/tasks.ts`, `lib/reviews.ts` | `useWorkflow`, `useTasks`, `useReviews` | `/workflows/**`, `/tasks`, `/reviews` | `ResearchWorkflowEngine` (E-08) references SWTROP by `sourceId`/`sourceEntity` (CRIE Ch. 55). |
| **Collaboration** | `types/collaboration.ts` | `lib/collaboration.ts` | `useCollaboration` | `/collaboration` | Group research collaboration signals by reference. |
| **Groups / Communities** | `types/groups.ts`, `types/communities.ts` | `lib/groups.ts`, `lib/communities.ts` | `useGroups`, `useCommunities` | `/groups/**`, `/communities/**` | Community and group context (CRIE Chs. 51–52). |
| **Messaging** | `types/messages.ts` | `lib/messages.ts` | `useMessages` | `/messages` | Conversation coordination (CRIE Ch. 50). |
| **Notifications** | `types/notifications.ts` | `lib/notifications.ts` | `useNotifications` | `/notifications` | `NotificationEngine` (E-25) emits events (CRIE Ch. 56). |
| **Activity** | `types/activity.ts` | `lib/activity.ts` | `useActivity` | `/activity` | CRIE actions in the platform event stream (CRIE Ch. 57). |
| **Marketplace / Commerce** | `types/marketplace.ts`, `types/commerce.ts` | `lib/marketplace.ts`, `lib/commerce.ts` | `useMarketplace`, `useCommerce` | `/marketplace`, `/commerce` | Grant/proposal and service surface integration (CRIE Ch. 49). |
| **Services** | `types/services.ts` | `lib/services.ts` | `useServices` | `/services` | Service surface integration. |
| **Learning Ecosystem** | `types/learning.ts` | `lib/learning.ts` + `lib/learning-*.ts` | `useLearning` | `/learning/**` | `LearningEngine` (E-12) reads consented learning signals (CRIE Ch. 47). |
| **Scholarly Intelligence (INT_)** | `types/intelligence.ts` | `lib/intelligence.ts` | — | `/intelligence` | Derivation base for recommendations/trends; CRIE composes, does not duplicate (CRIE Ch. 45). |
| **Discovery / Datasets / Manuscripts / Annotations / Comments** | `types/discovery.ts`, `types/dataset.ts`, `types/manuscript.ts`, `types/annotations.ts`, `types/comments.ts` | `lib/annotations.ts`, `lib/comments.ts` | `useAnnotations`, `useComments` | `/discovery`, `/datasets`, `/manuscripts` | Document and semantic surface inputs. |
| **Security / RBAC** | `types/security.ts`, `types/rbac.ts` | `lib/rbac.ts` | `usePermissions`, `useRequireRole` | — | `PolicyEngine` (E-18) enforces CRIE permission group through `can({...})` (fspec Ch. 9; CRIE Ch. 61). |

## 3.2 Engine-to-engine dependency ordering

The 28 core engines and advisory engines are implemented in the dependency
order below. Each entry depends only on earlier entries plus the reused
platform modules in §3.1.

| Order | Engines | Depends on |
|---|---|---|
| 1 | `IdentityEngine` (E-22), `ContextEngine`, `SessionEngine`, `WorkspaceEngine`, `LifecycleEngine` | Reused Identity/Research; core types. |
| 2 | `KnowledgeGraphEngine` (E-03), `TrustEngine` (E-23) | IdentityEngine, context/session/workspace engines, RKG types. |
| 3 | `SemanticEngine` (E-16), `IndexEngine` (E-27), `SearchEngine` (E-26) | KnowledgeGraphEngine; reused Discovery/Dataset/Manuscript types. |
| 4 | `ReasoningEngine` (E-02), `PromptEngine` (E-17) | KnowledgeGraphEngine, SemanticEngine, SearchEngine. |
| 5 | `MemoryEngine` (E-15) | ContextEngine, SessionEngine, KnowledgeGraphEngine. |
| 6 | `EvidenceEngine` (E-05), `CitationIntelligenceEngine` (E-07), `DocumentEngine`, `LiteratureEngine` | SemanticEngine, ReasoningEngine, MemoryEngine. |
| 7 | `GapDetectionEngine`, `NoveltyEngine`, `MethodologyEngine`, `StatisticsEngine`, `InstrumentEngine` | KnowledgeGraphEngine, ReasoningEngine, EvidenceEngine, LiteratureEngine. |
| 8 | `EthicsEngine`, `IntegrityEngine`, `ValidationEngine` (E-19), `WritingEngine`, `SupervisorEngine`, `PeerReviewEngine` | ReasoningEngine, EvidenceEngine, MethodologyEngine, reused Trust/Verification. |
| 9 | `PublishingEngine` (E-10), `JournalEngine`, `ConferenceEngine`, `PatentEngine`, `InnovationEngine` | EvidenceEngine, IntegrityEngine, reused Journals/Conferences/Publishers. |
| 10 | `GrantEngine` (E-09), `CareerEngine` (E-13), `LearningEngine` (E-12), `MentorshipEngine` | ContextEngine, reused Funding/Learning/Researcher. |
| 11 | `RecommendationEngine` (E-06), `PredictionEngine`, `AdaptiveEngine`, `AnalyticsEngine` (E-20), `DecisionEngine` (E-14) | All earlier engines; reused Scholarly Intelligence (`lib/intelligence.ts`). |
| 12 | `AgentCoordinatorEngine` (E-04), `OrchestrationEngine`, `ConversationEngine`, `ConnectorEngine` | All engines; policy enforcement (E-18). |
| 13 | `InstitutionEngine` (E-11), `EnterpriseEngine`, `FederationEngine` (E-21) | DecisionEngine, AnalyticsEngine, AgentCoordinatorEngine. |
| 14 | `NotificationEngine` (E-25), `PolicyEngine` (E-18), `AuditEngine`, `DigitalTwinEngine` (E-28) | Everything above; L11 governance; reused Notifications. |

## 3.3 Reuse-before-create rules

1. **Never duplicate an existing engine.** Where a capability exists
   (`lib/collaboration.ts`, `lib/communities.ts`, `lib/workflows.ts`,
   `lib/learning.ts`, `lib/intelligence.ts`, `lib/notifications.ts`, …), CRIE
   composes or references it; CRIE SHALL NOT re-implement ranking, filtering,
   confidence, or lifecycle logic already in a platform engine.
2. **Never duplicate canonical records.** CRIE stores identities, references,
   and derived aggregates — never copies of researcher, publication, grant, or
   learning records (fspec §15.1 reference-over-copy).
3. **Never duplicate UI primitives.** `components/ui/*` (PageLayout,
   PageHeader, SectionTitle, Alert, Button, Container, StatisticCard, Badge,
   SearchBox, Select, Timeline, Skeleton, EmptyState, ErrorState, …) are the
   only building blocks for `components/crie/*`.
4. **Never duplicate navigation patterns.** Cross-module navigation follows the
   existing `Button href` hub pattern (Messages, Activity, Notifications,
   Collaboration, Learning).
5. **Never duplicate identity resolution.** All hooks resolve the canonical
   current user (`ojuri`, Dr. Adebisi Ojurere); no surface hardcodes a
   different principal.

## 3.4 Cross-cutting dependencies

- **Canonical types** (`types/crie/*`) are consumed by every engine, hook,
  constant, component, and route; they are Wave 1 for this reason.
- **Placeholder constants** (`constants/placeholder-crie.ts`) seed the hooks;
  hooks seed from constants and delegate derivation to `lib/crie/*`.
- **Database target schema** (`db/schema.sql`, currently 169 tables) SHALL
  receive the CRIE table groups (120 tables across 12 groups, fspec Ch. 3) as
  an appended target-schema section in the wave that introduces each group; no
  existing table SHALL be altered.
- **RBAC** (`docs/RBAC.md`) gains the CRIE permission group (fspec Ch. 9);
  enforcement runs through `lib/rbac.ts` (`can`).
- **Documentation** (`docs/crie/`) gains one verification report per wave and
  this blueprint's conformance matrix is re-audited at close.

---

# Chapter 4 — Repository Mapping

## 4.1 Mapping overview

| Repository area | CRIE artifact | Convention reference |
|---|---|---|
| `types/crie/` | Canonical TypeScript domain model (150 entities, DTOs, vocabularies) | fspec Ch. 4; `types/learning.ts` style |
| `lib/crie/` | Pure engines (28 core + advisory), no React/no state | fspec Ch. 5; `lib/learning.ts`, `lib/collaboration.ts` style |
| `lib/index.ts` | Explicit by-name re-exports of every CRIE engine | `lib/index.ts` existing pattern |
| `hooks/` | 12 state hooks (registered in `hooks/index.ts`) | fspec Ch. 6; `hooks/useLearning.ts` style |
| `constants/placeholder-crie.ts` | Placeholder graphs seeding the hooks | `constants/placeholder-learning.ts` style |
| `components/crie/` | 48 feature components; `components/crie/index.ts` re-exports | fspec Ch. 7; `components/learning/` style |
| `app/crie/` | 28 Server Component routes | fspec Ch. 8; `app/learning/**` style |
| `db/schema.sql` | CRIE table groups appended (target schema) | fspec Ch. 3 |
| `docs/crie/` | Wave verification reports; conformance re-audits | This blueprint |
| `constants/config.ts` | Navigation entry for `/crie` | Existing hub navigation |

## 4.2 Canonical types — `types/crie/`

```
types/crie/
  base.ts          Reusable base models: CRIE-ID, ConfidenceValue, Provenance,
                   AccessClass, LifecycleState, Calibration (fspec §4.1)
  cognitive.ts     Research entity, lifecycle stage, RCM entities (fspec §4.2)
  context.ts       ContextPack, Session, Workspace (fspec §2.2)
  knowledge.ts     KnowledgeGraph, KGEntity, KGRelation, GraphVersion (fspec §4.3)
  semantic.ts      SemanticAnnotation, Embedding, Concept (fspec §4.3)
  reasoning.ts     ReasoningTrace, Argument, Paradigm, Conclusion (fspec §4.4)
  evidence.ts      Evidence, Claim, Contradiction, Assessment (fspec §4.4)
  document.ts      Document, Chunk, Figure, Reference (fspec §2.5)
  literature.ts    LiteratureItem, Screening, Synthesis, Gap, Novelty (fspec §2.6)
  methodology.ts   StudyDesign, SamplingPlan, InstrumentSpec (fspec §2.7)
  statistics.ts    StatisticalPlan, AnalysisResult, Power (fspec §2.7)
  ethics.ts        EthicsAssessment, RefusalRecord (fspec §2.8)
  integrity.ts     IntegrityScreen, ProvenanceRecord (fspec §2.8)
  writing.ts       Draft, Revision, Manuscript (fspec §2.9)
  supervision.ts   SupervisionPortfolio, Feedback (fspec §2.9)
  peer-review.ts   Review, Reviewer, Decision (fspec §2.9)
  publication.ts   PublicationPlan, JournalFit, SubmissionPackage (fspec §2.10)
  grant.ts         FundingOpportunity, Proposal, GrantReview (fspec §2.10)
  patent.ts        PatentabilitySignal, Disclosure (fspec §2.10)
  innovation.ts    InnovationOpportunity (fspec §2.10)
  career.ts        CareerSignal, CareerPlan (fspec §2.11)
  learning.ts      LearnerState, TeachingRecommendation (fspec §2.11)
  mentorship.ts    Mentorship, Scaffold (fspec §2.11)
  institution.ts   InstitutionIntelligence, IKAsset (fspec §2.15)
  analytics.ts     Indicator, Rollup, Kpi (fspec §2.12)
  decision.ts      Decision, Option, Tradeoff, Record (fspec §2.12)
  prediction.ts    Prediction, CalibratedUncertainty (fspec §2.12)
  memory.ts        MemoryItem, MemoryType, Consolidation (fspec §4.5)
  conversation.ts  Conversation, Message, SessionConsole (fspec §2.13)
  agents.ts        AgentCharter, AgentTask, AutonomyEnvelope (fspec §4.6)
  orchestration.ts OrchestrationTask, Checkpoint, Oversight (fspec §4.6)
  connectors.ts    Connector, Capability, RiskClass (fspec §2.14)
  federation.ts    FederationContract, GovernedExchange (fspec §2.15)
  governance.ts    PolicyRule, AuditRecord, Refusal (fspec §2.15)
  dto.ts           Prompt/Response/AgentReport/Recommendation DTOs (fspec §11)
  index.ts         Barrel re-export
```

`types/index.ts` SHALL add `export * from './crie';` (following the existing
single-line re-export pattern).

## 4.3 Pure engines — `lib/crie/`

One module per engine (or tight engine group), mirroring `lib/learning.ts`
conventions (pure functions, no React, no state, explicit by-name re-exports):

```
lib/crie/
  identity.ts        E-22 IdentityEngine
  context.ts         ContextEngine
  session.ts         SessionEngine
  workspace.ts       WorkspaceEngine
  lifecycle.ts       LifecycleEngine
  knowledge-graph.ts E-03 KnowledgeGraphEngine
  trust.ts           E-23 TrustEngine
  semantic.ts        E-16 SemanticEngine
  index.ts           E-27 IndexEngine
  search.ts          E-26 SearchEngine
  reasoning.ts       E-02 ReasoningEngine
  prompt.ts          E-17 PromptEngine
  memory.ts          E-15 MemoryEngine
  evidence.ts        E-05 EvidenceEngine
  citation.ts        E-07 CitationIntelligenceEngine
  document.ts        DocumentEngine
  literature.ts      LiteratureEngine
  gaps.ts            GapDetectionEngine
  novelty.ts         NoveltyEngine
  methodology.ts     MethodologyEngine
  statistics.ts      StatisticsEngine
  instrument.ts      InstrumentEngine
  ethics.ts          EthicsEngine
  integrity.ts       IntegrityEngine
  validation.ts      E-19 ValidationEngine
  writing.ts         WritingEngine
  supervisor.ts      SupervisorEngine
  peer-review.ts     PeerReviewEngine
  publishing.ts      E-10 PublishingEngine
  journal.ts         JournalEngine
  conference.ts      ConferenceEngine
  patent.ts          PatentEngine
  innovation.ts      InnovationEngine
  grant.ts           E-09 GrantEngine
  career.ts          E-13 CareerEngine
  learning.ts        E-12 LearningEngine
  mentorship.ts      MentorshipEngine
  institution.ts     E-11 InstitutionEngine
  analytics.ts       E-20 AnalyticsEngine
  prediction.ts      PredictionEngine
  recommendation.ts  E-06 RecommendationEngine
  adaptive.ts        AdaptiveEngine
  decision.ts        E-14 DecisionEngine
  conversation.ts    ConversationEngine
  agents.ts          AgentCoordinatorEngine (E-04) + executor
  orchestration.ts   OrchestrationEngine
  connectors.ts      ConnectorEngine
  notification.ts    E-25 NotificationEngine
  policy.ts          E-18 PolicyEngine
  audit.ts           AuditEngine
  enterprise.ts      EnterpriseEngine
  federation.ts      E-21 FederationEngine
  digital-twin.ts    E-28 DigitalTwinEngine
  index.ts           Barrel: explicit by-name re-exports
```

`lib/index.ts` SHALL append the CRIE barrel (`export * from './crie';`) so the
rest of the platform can import engines by name.

## 4.4 State hooks — `hooks/`

The twelve hooks (fspec Ch. 6), each registered in `hooks/index.ts`:

```
hooks/useCRIE.ts              hub: entity/session/context state and actions
hooks/useResearchAssistant.ts assistant chat, mode switcher
hooks/useKnowledgeGraph.ts    graph explorer, time travel, trust view
hooks/useMemory.ts            memory panel, consolidation, export
hooks/useReasoning.ts         traces, paradigm switching, explanations
hooks/useAgent.ts             agent registry, dispatch, approvals, oversight
hooks/useEvidence.ts          claims, evidence, contradictions, retractions
hooks/useGrantAssistant.ts    funding discovery, proposal builder
hooks/usePublishingAssistant.ts  publication plans, journal matching
hooks/useDecisionSupport.ts   decision framing, options, records
hooks/useCitationAssistant.ts reference extraction and style formatting
hooks/useResearchAnalytics.ts analytics, rollups, KPIs, risk alerts
```

Hook rules (fspec Ch. 6): hooks never own data; they seed from
`constants/placeholder-crie.ts` and delegate derivation to `lib/crie/*`; all
personalisation and memory access respects the consent model (P9; CRIE Ch. 60).

## 4.5 Placeholder constants — `constants/placeholder-crie.ts`

One file, following `constants/placeholder-learning.ts`: seed graphs for the
research entities, context packs, sessions, workspace, knowledge graph,
memory, agents, grants, publishing plans, decisions, citations, and analytics.
Seeds reference canonical researchers by `username` (`ojuri`, `smith`,
`adebayo`, `maria`, `tanaka`, `okonkwo`, `dube`, `schneider`) and canonical
institutions (`INST-UI-001`, …), and carry the canonical `ResearchLifecycleStageId`.

## 4.6 Feature components — `components/crie/`

48 feature components in a three-tier hierarchy (fspec Ch. 7), re-exported from
`components/crie/index.ts` (explicit, no barrel):

```
components/crie/
  shared/     ResearchAssistantHub, CriePageHeader, CrieStatsOverview,
              CrieCrossModuleNav
  research/   ResearchEntityBrowser, ResearchEntityCard, ResearchTimeline,
              ResearchWorkspace
  knowledge/  KnowledgeGraphExplorer, EntityDetail, RelationBadge,
              GraphVersionView
  memory/     MemoryPanel, MemoryItemCard, MemoryTimeline, MemorySettings
  reasoning/  ReasoningTraceView, ArgumentMap, EvidenceChainView,
              ConfidenceBadge
  decision/   DecisionSupportPanel, RecommendationCard, PredictionView,
              DecisionTimeline
  assistant/  AssistantChat, AssistantSuggestionBar, ContextPackView,
              SessionConsole
  publishing/ PublicationDashboard, JournalMatcher, SubmissionChecklist,
              CitationStylePicker
  grant/      GrantOpportunityCard, GrantProposalBuilder, GrantReviewAssistant,
              GrantBrowser
  analytics/  AnalyticsDashboard, AnalyticsChart, AnalyticsKpiCard,
              AnalyticsDrillDown
  agents/     AgentRegistry, AgentCharterCard, AgentOversightDashboard,
              AutonomyLevelBadge
  admin/      CrieAdminDashboard, ConnectorRegistry, PolicyConsole,
              AuditExplorer
  index.ts
```

Components never own data — the browser wires the hook; the hook seeds from
placeholder data (CRIE conventions).

## 4.7 Routes — `app/crie/`

28 Server Component routes (fspec Ch. 8):

```
app/crie/page.tsx                     /crie                          hub
app/crie/dashboard/page.tsx           /crie/dashboard
app/crie/research/page.tsx            /crie/research
app/crie/research/[id]/page.tsx       /crie/research/[id]
app/crie/assistant/page.tsx           /crie/assistant
app/crie/knowledge/page.tsx           /crie/knowledge
app/crie/knowledge/entity/[crieId]/page.tsx  /crie/knowledge/entity/[crieId]
app/crie/memory/page.tsx              /crie/memory
app/crie/reasoning/page.tsx           /crie/reasoning
app/crie/agents/page.tsx              /crie/agents
app/crie/agents/[id]/page.tsx         /crie/agents/[id]
app/crie/grants/page.tsx              /crie/grants
app/crie/grants/[id]/page.tsx         /crie/grants/[id]
app/crie/publishing/page.tsx          /crie/publishing
app/crie/search/page.tsx              /crie/search
app/crie/discovery/page.tsx           /crie/discovery
app/crie/evidence/page.tsx            /crie/evidence
app/crie/analytics/page.tsx           /crie/analytics
app/crie/institutions/page.tsx        /crie/institutions
app/crie/admin/page.tsx               /crie/admin
app/crie/citations/page.tsx           /crie/citations
app/crie/literature/page.tsx          /crie/literature
app/crie/gaps/page.tsx                /crie/gaps
app/crie/methodology/page.tsx         /crie/methodology
app/crie/statistics/page.tsx          /crie/statistics
app/crie/writing/page.tsx             /crie/writing
app/crie/reviews/page.tsx             /crie/reviews
app/crie/decision/page.tsx            /crie/decision
```

All routes are Server Components; `params`/`searchParams` are promises and
dynamic segments (`[id]`, `[crieId]`) await `params` as a promise per the Next
conventions in `node_modules/next/dist/docs`. Static surfaces prerender.

## 4.8 Database target schema — `db/schema.sql`

The fspec Ch. 3 defines **120 CRIE tables in 12 groups**. `db/schema.sql`
(currently 169 tables) SHALL receive the CRIE groups as appended target-schema
sections, one group per the wave that needs it, never altering existing tables:

| Group | CRIE tables |
|---|---|
| 1 | Cognitive & research lifecycle |
| 2 | Context, session & workspace |
| 3 | Knowledge Graph & RKG |
| 4 | Semantic & reasoning |
| 5 | Documents, citations & evidence |
| 6 | Evidence assessment, literature, gaps & novelty |
| 7 | Methodology, statistics & instruments |
| 8 | Ethics, integrity, writing, supervision & peer review |
| 9 | Publication, journal, conference, grant, patent & innovation |
| 10 | Career, learning, mentorship, decision & analytics |
| 11 | Recommendation, adaptive, memory, conversation, agents & orchestration |
| 12 | Orchestration tasks, connectors, enterprise, federation, governance & audit |

Table conventions follow `db/schema.sql`: snake_case names with the `crie_`
prefix (e.g., `crie_kg_graph`, `crie_memory_item`, `crie_audit_record`), UUID
primary keys, named indexes, check constraints, and append-only audit tables.

## 4.9 Documentation — `docs/crie/`

```
docs/crie/CRIE_ARCHITECTURE.md                    (complete — 004-A)
docs/crie/CRIE_FUNCTIONAL_SPECIFICATION.md        (complete — 004-B)
docs/crie/CRIE_IMPLEMENTATION_BLUEPRINT.md        (this document — 004-C)
docs/crie/WAVE_n_<name>_REPORT.md                 (one per wave, 004-D+)
```

---

# Chapter 5 — Engine Boundaries

This chapter fixes, for every engine, its **responsibility**, **inputs**,
**outputs**, **public API** (as specified by the functional specification), and
its **internal dependencies**. Engines are pure and framework-free
(`lib/crie/*`); they derive from canonical records and enforce invariants; none
writes or duplicates another module's records (fspec Ch. 5; CRIE Chs. 46–58).
Engines SHALL refuse requests that violate the Constitution (Article X) and
SHALL log every consequential action (Article VIII; CRIE Ch. 67).

## 5.1 Core engine boundaries (E-01…E-28)

| Engine | Responsibility | Inputs | Outputs | Public API | Depends on |
|---|---|---|---|---|---|
| E-01 `ResearchIntelligenceEngine` | Derives research intelligence signals — trends, gaps, expertise — and research analytics (CRIE Chs. 15, 16, 36) | Canonical research records, literature signals | Trend/gap/expertise signals, analytics | `intelligenceFor`, `trendSignals`, `expertiseMatches`, `analyticsFor` | Reused `lib/intelligence.ts`, Research, Literature |
| E-02 `ReasoningEngine` | Multi-paradigm reasoning with explainable traces (CRIE Chs. 11, 64) | Typed problems, context packs, knowledge | Traces, conclusions, arguments | `reason`, `traceOf`, `selectParadigm`, `combineParadigms`, `explainTrace` | E-03, E-16, E-26 |
| E-03 `KnowledgeGraphEngine` | RKG operations — entities, relations, provenance, trust, versioning (CRIE Chs. 9, 61) | Entity/relation records, graph queries | Versioned graph states, trust values | `upsertEntity`, `addRelation`, `resolveEntities`, `trustFor`, `graphAtVersion` | E-22, core types |
| E-04 `AgentCoordinatorEngine` | Routes, delegates, supervises agents per the competence map (CRIE Chs. 42, 43, 62) | Missions, charters, oversight policy | Agent tasks, checkpoints, reports | `dispatch`, `delegate`, `checkpoint`, `escalate`, `oversightView` | All engines; E-18 policy |
| E-05 `EvidenceEngine` | Evidence extraction, assessment, contradiction handling, retraction (CRIE Ch. 14) | Claims, documents, annotations | Evidence assessments, contradictions | `extractEvidence`, `assessClaim`, `contradictionsFor`, `propagateRetraction` | E-03, E-16, E-26 |
| E-06 `RecommendationEngine` | Generates and explains next-best actions (CRIE Chs. 38, 65) | Goals, context, candidate actions | Ranked recommendations with reasons | `candidates`, `scoreByGoals`, `rankWithTradeoffs`, `explain` | Reused `lib/intelligence.ts`, E-14 |
| E-07 `CitationIntelligenceEngine` | Reference extraction, resolution, styles, citation intent (CRIE Ch. 13) | Documents, reference strings | Resolved references, formatted citations | `extractReferences`, `resolveReference`, `citationContext`, `formatCitation` | E-26, Reused Journals/DOIs |
| E-08 `ResearchWorkflowEngine` | Lifecycle planning, timelines, milestone tracking; SWTROP integration (CRIE Chs. 8, 55) | Research plan, lifecycle stage | Plan, timeline, milestones | `planLifecycle`, `generateTimeline`, `trackMilestones`, `promoteArtefact` | Reused `lib/workflows.ts` (by `sourceId`/`sourceEntity`) |
| E-09 `GrantEngine` | Funding discovery and proposal support (CRIE Ch. 29) | Researcher profile, funding call records | Opportunities, matches, readiness | `fundingOpportunities`, `matchFunder`, `proposalReadiness`, `grantReview` | Reused Funding/Grants, E-19 |
| E-10 `PublishingEngine` | Submission readiness, cover letters, stewardship (CRIE Chs. 26, 27) | Manuscript, target venues | Submission package, journal fit, checklist | `submissionPackage`, `journalFit`, `readinessChecklist`, `steward` | Reused Journals/Manuscripts, E-19 |
| E-11 `InstitutionEngine` | Aggregate institutional intelligence and enterprise analytics (CRIE Chs. 35, 59, 60) | Consented aggregate signals | Institutional intelligence, IK assets | `institutionIntelligence`, `enterpriseAnalytics`, `ikAssets` | E-20, E-18 |
| E-12 `LearningEngine` | Just-in-time teaching, learning recommendations, learner state (CRIE Chs. 33, 47) | Consented learner state | Teaching recommendations, diagnosis | `teachingRecommendations`, `learnerState`, `misconceptionDiagnosis` | Reused `lib/learning*.ts` |
| E-13 `CareerEngine` | Career intelligence and planning (CRIE Ch. 32) | Researcher profile, career goals | Career signals, plan | `careerSignals`, `careerPlan`, `opportunitySensing` | E-01, Reused Researchers |
| E-14 `DecisionEngine` | Decision framing, options, record, track, learn (CRIE Ch. 65) | Decision context, options, constraints | Framed decisions, tracked outcomes | `frameDecision`, `generateOptions`, `evaluateOptions`, `recordDecision`, `trackOutcome` | E-06, E-20 |
| E-15 `MemoryEngine` | Memory write/read/consolidate/forget/version/export (CRIE Chs. 40, 63) | Memory items, queries, consent policy | Memory results, consolidations | `write`, `read`, `recall`, `consolidate`, `forget`, `exportMemory` | E-01/E-02 context; consent model |
| E-16 `SemanticEngine` | Annotations, concepts, embeddings, semantic index (CRIE Ch. 10) | Canonical content chunks | Annotations, embeddings, search hits | `annotate`, `resolveConcept`, `embed`, `semanticSearch` | E-03, E-27 |
| E-17 `PromptEngine` | Prompt assembly from context packs; refusal and safety framing (CRIE Chs. 43, 44) | Context packs, tasks, roles | Framed prompts, refusals | `buildPrompt`, `boundedContext`, `safetyGuard`, `refusalResponse` | E-15 recall, E-18 |
| E-18 `PolicyEngine` | Governance, security, privacy, ethics, and role enforcement (L11; CRIE Chs. 61, 67) | Request, principal, permission | Grant/refuse decisions, audit entries | `can`, `enforce`, `approvalGate`, `policyRefusal`, `auditDecision` | Reused `lib/rbac.ts`, `types/rbac.ts` |
| E-19 `ValidationEngine` | Provenance, confidence, and integrity validation of outputs (CRIE Chs. 20, 62) | Derived outputs, provenance | Validation verdicts, confidence bands | `validateProvenance`, `checkConfidence`, `integrityScreen`, `verify` | E-23, Reused Verification |
| E-20 `AnalyticsEngine` | Derived research analytics and indicators (CRIE Chs. 36, 59) | Derived signals, scopes | Indicators, rollups, KPIs | `analyticsFor`, `rollup`, `computeKpis`, `riskSignals` | E-01, E-14 |
| E-21 `FederationEngine` | Global knowledge federation operations (CRIE Ch. 66) | Federation contracts, exchanges | Governed exchange results | `federationContracts`, `governedExchange`, `memberSovereignty`, `adapters` | E-18, E-03 |
| E-22 `IdentityEngine` | Resolves canonical researcher identity (username/SAID) (CRIE Ch. 53) | Username, SAID | Canonical principal | `researcherOf`, `resolveIdentity`, `principalOf` | Reused `lib/auth/*`, `lib/said.ts` |
| E-23 `TrustEngine` | Source trust, edge propagation, corroboration, retraction cascade (CRIE Ch. 61) | Sources, graph edges | Trust values, corroboration | `sourceTrust`, `propagate`, `corroboration`, `contradictionPenalty` | E-03, Reused `lib/trust.ts` |
| E-24 `VerificationEngine` | Verification of claims, credentials, and references (CRIE Ch. 54) | Claims, references, credentials | Verification verdicts | `verifyClaim`, `verifyReference`, `verifyCredential` | Reused `lib/trust.ts`, Verification |
| E-25 `NotificationEngine` | Emits notification events on consequential activity (CRIE Ch. 56) | Consequential events | Notification events | `notify`, `approvalRequested`, `milestoneReached`, `alert` | Reused `lib/notifications.ts` |
| E-26 `SearchEngine` | Retrieval across documents, graph, memory, and literature (CRIE Chs. 12, 15) | Queries, indexes | Ranked results with provenance | `searchDocuments`, `searchGraph`, `searchMemory`, `searchLiterature` | E-03, E-15, E-16 |
| E-27 `IndexEngine` | Maintains semantic and graph indexes; never authoritative (CRIE Chs. 10, 12) | Annotations, embeddings, graph | Fresh indexes | `index`, `rebuild`, `refresh`, `optimize` | E-03, E-16 |
| E-28 `DigitalTwinEngine` | Consumes consented signals for the research Digital Twin (CRIE Ch. 46) | Consented CRIE signals | Twin projections | `twinState`, `ingestSignals`, `syncProjections` | Consent model; E-15 |

## 5.2 Advisory domain engine boundaries

The Advisory Layer (L7) engines follow the same contract. Their responsibilities
are fixed by their architecture chapters; representative APIs are given below.
Each SHALL derive, never own, and SHALL enforce human authority for
consequential outputs (CRIE §65.9, §70.10).

| Engine | Responsibility | Architecture | Representative functions |
|---|---|---|---|
| `DocumentEngine` | Ingestion, reading, extraction, format conversion | Ch. 12 | `ingest`, `extract`, `convertFormat` |
| `LiteratureEngine` | Search, screening, reading, synthesis | Ch. 15 | `search`, `screen`, `synthesize` |
| `GapDetectionEngine` | Structural-hole gap identification | Ch. 16 | `gapSignals`, `opportunityScore` |
| `NoveltyEngine` | Concept-and-claim novelty assessment | Ch. 17 | `noveltyAssessment`, `neighbourhoodCheck` |
| `MethodologyEngine` | Design selection, method suitability, sampling | Ch. 18 | `recommendDesign`, `assessFit`, `samplingPlan` |
| `EthicsEngine` | Ethics review support, ethics refusals | Ch. 19 | `review`, `riskAssessment`, `refuse` |
| `IntegrityEngine` | Plagiarism, fabrication, manipulation screening | Ch. 20 | `screen`, `provenanceCheck` |
| `StatisticsEngine` | Statistical design, power, analysis, interpretation | Ch. 21 | `analysisPlan`, `powerAnalysis`, `interpret` |
| `InstrumentEngine` | Instrument design, validation, psychometrics | Ch. 22 | `design`, `validate`, `reliability` |
| `WritingEngine` | Drafting, revision, editing, style | Ch. 23 | `draft`, `revise`, `edit` |
| `SupervisorEngine` | Supervision portfolio support | Ch. 24 | `portfolio`, `feedback`, `progress` |
| `PeerReviewEngine` | Reviewer and editorial support | Ch. 25 | `review`, `decisionSupport` |
| `JournalEngine` | Journal matching and fit | Ch. 27 | `match`, `fitAssessment` |
| `ConferenceEngine` | Conference matching and participation | Ch. 28 | `match`, `participationPlan` |
| `PatentEngine` | Patentability sensing and disclosure | Ch. 30 | `sensitivity`, `disclosureRisk` |
| `InnovationEngine` | Innovation opportunity analysis | Ch. 31 | `opportunities`, `marketSignal` |
| `MentorshipEngine` | Mentorship scaffolding | Ch. 34 | `scaffold`, `reflection` |
| `SessionEngine` | Research session lifecycle | Ch. 6 | `open`, `close`, `consolidate` |
| `ContextEngine` | Context pack assembly and maintenance | Ch. 5 | `assembleContext`, `refreshContext` |
| `WorkspaceEngine` | Persistent workspace state | Ch. 7 | `openEntity`, `workspaceState` |
| `LifecycleEngine` | Lifecycle stage transitions | Ch. 8 | `stageOf`, `transition`, `history` |
| `ConversationEngine` | Conversational surface state | Ch. 41 | `start`, `turn`, `end` |
| `ConnectorEngine` | External AI provider neutrality | Ch. 44 | `capabilities`, `call`, `logCall` |
| `OrchestrationEngine` | Pipeline observe→diagnose→plan→execute→verify→explain→record | Ch. 43 | `pipeline`, `checkpoint`, `record` |
| `PredictionEngine` | Predictive modelling with uncertainty | Ch. 37 | `predict`, `calibrate`, `monitor` |
| `AdaptiveEngine` | Profile adaptation | Ch. 39 | `adaptProfile`, `recommendAdjustments` |
| `EnterpriseEngine` | Enterprise intelligence layer | Ch. 59 | `enterpriseIntelligence`, `enterpriseRecommendation` |
| `AuditEngine` | Append-only audit and refusal logs | Ch. 67 | `log`, `query`, `exportAudit` |

## 5.3 Boundary rules

1. **Public vs internal API.** Public functions are the named `Representative
   functions` above and are re-exported by name from `lib/index.ts`. Internal
   helpers stay private to the engine module.
2. **No cross-engine hidden calls.** Engines compose only through their public
   APIs; no engine reaches into another engine's module internals (P4, L11).
3. **No ownership.** No engine owns another module's records; all CRIE state is
   reference or derived.
4. **No React.** Engines never import hooks or components; the hooks layer
   imports engines.
5. **Consequential gating.** Every engine SHALL expose whether its output is
   consequential and, if so, SHALL require the approval-gate path (E-18) before
   the output is actionable (CRIE §62.7, §65.9).

---

# Chapter 6 — Knowledge Graph Implementation Order

The Research Knowledge Graph (RKG, CRIE Ch. 61) is the semantic spine. This
roadmap fixes the **order** in which its capabilities are built (no code).

## 6.1 Build order

| Step | Capability | Specification | Prerequisites |
|---|---|---|---|
| 1 | **Entity classes & identity** — the 12 classes (People, Organisations, Works, Venues, Concepts, Claims, Evidence, Methods, Grants, Events, Places, Terms); every node carries a stable CRIE-ID, class, attributes, provenance, confidence, lifecycle state (proposed, confirmed, deprecated, superseded) | fspec §12.1 | Wave 1 types |
| 2 | **Typed edges** — subject, object, predicate, direction, strength, provenance, confidence, validity; the 10 relationship families (Authorship, Containment, Citation, Epistemic, Conceptual, Procedural, Affiliation, Temporal, Influence, Institutional) | fspec §12.2 | Step 1 |
| 3 | **Versioning** — every state reproducible; time-travel queries; governed operations (insertion, resolution, revision, deprecation, confidence update, temporal decay) | fspec §12.5, §12.6 | Steps 1–2 |
| 4 | **Provenance** — immutable provenance on every entity and relation (source, actor, timestamp, method, version, basis, consent/access class); exportable for audit, verification, federation | fspec §12.7 | Steps 1–3 |
| 5 | **Trust propagation** — source trust seeds entity trust; edge propagation; corroboration raises trust; contradiction penalty; retraction cascade; monotonic with new evidence; explainable | fspec §12.8; CRIE §61.9 | Steps 1–4; TrustEngine (E-23) |
| 6 | **Traversal** — entity expansion, path finding, subgraph extraction, neighbourhood ranking, semantic proximity, community detection, bridge detection; governance/privacy filters; explainable paths | fspec §12.3; CRIE §61.4 | Steps 1–5; SearchEngine (E-26) |
| 7 | **Reasoning over the graph** — concept similarity, evidence triangulation, contradiction surfacing, novelty assessment, gap identification, influence tracing, impact projection | fspec §12.4; CRIE §61.5 | Steps 1–6; ReasoningEngine (E-02) |
| 8 | **Inference rules** — triangulation, contradiction, novelty, gap, influence, retraction | fspec §12.9 | Steps 1–7 |
| 9 | **Semantic integration** — typed learning graph joined to the RKG via JSON-LD adapter; semantic integration only | fspec §15 | Steps 1–8; LearningEngine |
| 10 | **Federation-ready export** — governed exchange of subgraphs under federation contracts | CRIE Ch. 66 | Steps 1–9; FederationEngine (E-21) |

## 6.2 Persistence order

The KG tables (fspec Ch. 3, Group 3: `crie_kg_graph`, `crie_kg_entity`,
`crie_kg_relation`, `crie_kg_version`, `crie_kg_provenance`,
`crie_kg_trust_score`, plus index tables) are appended to `db/schema.sql` at
the point each capability needs persistence — never earlier, never ahead of the
wave that uses them.

## 6.3 Verification gates (KG)

Every KG step closes only when: every entity/relation has provenance +
confidence; versioning and time-travel verified; trust propagation monotonic and
explainable; no side effects from graph operations (fspec Ch. 17).

---

# Chapter 7 — Memory Implementation Roadmap

The unified, multi-scale memory architecture (CRIE Ch. 63) is implemented by the
Memory Engine (E-15). This roadmap fixes the **order** in which the 8 memory
types and their operations are built (no code).

## 7.1 The eight memory types

| Type | Scope | Lifetime | Content |
|---|---|---|---|
| **short-term** | Active session | Bounded, attention-weighted; not longer than the session unless promoted | Current working items |
| **episodic** | Personal | Continuous until consolidated | Event-based records |
| **semantic** | Personal | Long-lived | Consolidated knowledge |
| **long-term** | Personal | Long-lived | Promoted, stable knowledge |
| **research** | Personal research scope | Research lifecycle | Research-specific state |
| **learner** | Learner scope | Learning lifecycle | Learner state and progress |
| **contextual** | Situation-bound | Situation-bound | Items bound to the context in which they were created/used |
| **institutional** | Institution scope | Institution lifecycle | Aggregated/pseudonymised institutional knowledge |

## 7.2 Operations build order

| Step | Operation | Specification | Notes |
|---|---|---|---|
| 1 | **Write** — commit with provenance, type, and access policy | fspec §13.2 | `crie_memory_item`; consent-gated (CRIE Ch. 60) |
| 2 | **Read** — retrieve per access control and relevance | fspec §13.2 | Never cross-institutional |
| 3 | **Recall** — semantically/episodically relevant items into context | fspec §13.3 | Feeds ContextEngine |
| 4 | **Consolidate** — episodic → semantic; short-term → long-term roll-forward | fspec §13.4 | Explainable rule per event; adaptive pruning (CRIE Ch. 39) |
| 5 | **Forget** — deprecate/expire per policy | fspec §13.5 | Right-to-be-forgotten; audited |
| 6 | **Version** — every change tracked | fspec §13.2 | `crie_memory_version` |
| 7 | **Export** — portable, interoperable representation | fspec §13.2 | Honours consent; standards-based (P17) |

## 7.3 Governance build order

Consent model (CRIE Ch. 60) precedes write/read (Step 1–2). Institutional
isolation (CRIE Ch. 68) precedes institutional memory (type column in
Step 1–2). Retention and expiry (`expires_at` on `crie_memory_item`) precede
forget (Step 5). Full audit of writes, reads, and deletions (CRIE §63.5) is
added with the AuditEngine in Wave 10 and enforced from Step 1 via the policy
layer.

## 7.4 Persistence order

Memory tables (fspec Ch. 3, Group 11: `crie_memory_type`, `crie_memory_item`,
`crie_memory_version`, `crie_memory_consolidation`, `crie_memory_export`) are
appended to `db/schema.sql` in the Memory wave.

## 7.5 Verification gates (memory)

Every memory step closes only when: consent-gated access; institutional
isolation; consolidation explainable; retention/expiry honoured; audit complete
(fspec Ch. 17).

---

# Chapter 8 — Reasoning Implementation Roadmap

The Reasoning Architecture (CRIE Ch. 64) is implemented by the Reasoning Engine
(E-02) composing the six paradigms. This roadmap fixes the **order** in which
the paradigms and their discipline are built (no code).

## 8.1 The six reasoning paradigms

| Paradigm | Contract | Primary use |
|---|---|---|
| **symbolic** | Rule-based deduction; explicit inference rules (fspec §12.9) | Deduction, formal validation |
| **probabilistic** | Probability over hypotheses; confidence calibration | Hypothesis weighing |
| **causal** | Cause–effect structure separate from correlation (CRIE §64, `crie_causal_model`) | Causal claims; experimental design |
| **graph** | RKG substrate reasoning; triangulation, contradiction, novelty, gaps, influence | KG reasoning (fspec §12.4) |
| **educational** | Learning-oriented reasoning; misconception diagnosis | Learner-facing reasoning |
| **research** | Research-lifecycle reasoning; design and method selection | Research planning |

## 8.2 Build order

| Step | Capability | Specification | Prerequisites |
|---|---|---|---|
| 1 | **Problem typing** — classify the reasoning task (causal question, formal proof, hypothesis test, …) | CRIE §64.9 | Wave 1 types |
| 2 | **Paradigm contracts** — six paradigm modules with typed inputs/outputs | CRIE §64.2 | Step 1 |
| 3 | **Symbolic reasoning** — deduction over explicit rules | fspec §12.9; CRIE §64 | Step 2 |
| 4 | **Graph reasoning** — over the RKG | fspec §12.4; CRIE §64 | KG roadmap; Step 2 |
| 5 | **Probabilistic reasoning** — hypothesis weighing with calibrated confidence | CRIE §64 | Steps 2–4; EvidenceEngine |
| 6 | **Causal reasoning** — cause–effect graphs; experimental design support | CRIE §64 | Steps 2–5; MethodologyEngine |
| 7 | **Educational reasoning** — misconception diagnosis, just-in-time teaching | CRIE §64; LearningEngine | Steps 2–6 |
| 8 | **Research reasoning** — design/method selection reasoning | CRIE §64 | Steps 2–7 |
| 9 | **Combination & selection** — chain paradigms (e.g., causal hypothesis → probabilistic test → symbolic validation); surface paradigm disagreement rather than hide it | CRIE §64.9–64.10 | Steps 2–8 |
| 10 | **Explainable traces** — full trace: paradigm, steps, evidence chains, confidence, alternatives; every trace auditable | fspec §11.8; CRIE §64.10 | Step 9 |

## 8.3 Verification gates (reasoning)

Every reasoning step closes only when: every trace explainable; confidence
attached; no output exceeds its evidentiary basis; paradigm disagreement is
surfaced, not hidden (CRIE §64.10; fspec Ch. 17).

---

# Chapter 9 — Agent Roadmap

The agency layer (L9) is the Agent Catalogue (AG-01…AG-36, CRIE Ch. 43) plus
the Autonomous Research Agents (ARA-01…ARA-12, CRIE Ch. 62), governed by the
AI Orchestration Layer and the Agent Coordinator Engine (E-04). **Forty-eight
agents are specified** (fspec Ch. 14). Enterprise agents AG-37–AG-40
(Enterprise Analytics, Enterprise Planning, Enterprise Compliance, Federation)
extend the catalogue in the enterprise stratum (CRIE Chs. 59, 66).

Every agent SHALL declare a charter (`AgentCharter`): mission, competence,
limits, inputs, outputs, escalation path, and policies (CRIE §43.4, §62.3).
Agents SHALL NOT claim competence they lack — they escalate instead. Inputs are
typed records and context packs; outputs are provenance-bearing artefacts
(`AgentReportDto`). Agents act only within granted scope and never beyond
policy (P16); agents coordinate through the shared RKG and memory, never
exchanging private state (CRIE §62.5.4). Institutional isolation SHALL be
honoured by all agents (CRIE Ch. 68).

**Human approval requirements** are defined by consequence class (CRIE §62.7):
submission, commitment, expenditure, and public representation SHALL always
require explicit human approval regardless of autonomy level; L5 is disabled by
default. In the tables below, "approval gate" marks agents whose typical output
is consequential.

## 9.1 Build order

| Order | Agents | Rationale |
|---|---|---|
| 1 | AG-01 Orchestrator, AG-02 Context | Orchestration and context are the foundations of the layer. |
| 2 | AG-03 Document, AG-04 Semantic, AG-05 Knowledge, AG-08 Citation | Ingestion and knowledge infrastructure. |
| 3 | AG-06 Literature, AG-07 Evidence, AG-09 Reasoning | Derivation core (Wave 4/6 engines). |
| 4 | AG-10 Methodology, AG-11 Statistics, AG-12 Instrument | Methodology cluster. |
| 5 | AG-13 Writing, AG-14 Integrity, AG-15 Ethics, AG-16 Gap & Novelty | Advisory writing/integrity cluster. |
| 6 | AG-17 Peer Review, AG-18 Publication, AG-19 Journal, AG-20 Conference | Review/publication cluster. |
| 7 | AG-21 Grant, AG-22 Patent, AG-23 Innovation | Opportunity cluster. |
| 8 | AG-24 Career, AG-25 Learning, AG-26 Mentorship | People cluster. |
| 9 | AG-27 Analytics, AG-28 Prediction, AG-29 Recommendation, AG-30 Adaptive | Decision-support cluster. |
| 10 | AG-31 Memory, AG-32 Scheduling, AG-33 Compliance, AG-34 Supervisor, AG-35 Institution, AG-36 Integrations | Cross-cutting cluster. |
| 11 | ARA-01…ARA-12 | Autonomous agents compose the catalogue agents; built last, with autonomy envelopes enforced. |

## 9.2 Agent catalogue (AG-01…AG-36)

| Agent | ID | Purpose | Inputs | Outputs | Depends on | Human approval |
|---|---|---|---|---|---|---|
| Orchestrator Agent | AG-01 | Routes tasks, manages delegation, enforces policy (CRIE Ch. 44) | Missions, goals, charters | Task decompositions, delegations, reports | E-04, E-18 | Gate on consequential delegation |
| Context Agent | AG-02 | Assembles and maintains context packs (CRIE Ch. 5) | Entity state, memory recall | Context packs | ContextEngine, E-15 | None (derived) |
| Document Agent | AG-03 | Ingestion, reading, extraction, format conversion (CRIE Ch. 12) | Documents, formats | Extracted content, chunks | DocumentEngine | None |
| Semantic Agent | AG-04 | Annotation, entity/concept resolution (CRIE Ch. 10) | Content chunks | Annotations, resolved concepts | SemanticEngine | None |
| Knowledge Agent | AG-05 | Knowledge Graph operations and fusion (CRIE Ch. 9) | Entity/relation records | Versioned graph updates | KnowledgeGraphEngine | None |
| Literature Agent | AG-06 | Search, screening, reading, synthesis (CRIE Ch. 15) | Queries, corpora | Screened literature, syntheses | LiteratureEngine, E-26 | None |
| Evidence Agent | AG-07 | Evidence extraction, assessment, contradiction handling (CRIE Ch. 14) | Claims, documents | Evidence assessments, contradictions | EvidenceEngine | None |
| Citation Agent | AG-08 | Reference extraction, resolution, style formatting (CRIE Ch. 13) | References, styles | Resolved/formatted citations | CitationIntelligenceEngine | None |
| Reasoning Agent | AG-09 | Deduction, argumentation, causal analysis, explanation (CRIE Ch. 11) | Problems, knowledge | Traces, arguments | ReasoningEngine | None |
| Methodology Agent | AG-10 | Design selection, method suitability, sampling (CRIE Ch. 18) | Question, context | Design recommendations | MethodologyEngine | Gate on consequential design choices |
| Statistics Agent | AG-11 | Statistical design, analysis, interpretation, reporting (CRIE Ch. 21) | Data, design | Analysis plans, interpretations | StatisticsEngine | None |
| Instrument Agent | AG-12 | Instrument design, validation, psychometrics (CRIE Ch. 22) | Construct, target population | Instrument specs, validation | InstrumentEngine | None |
| Writing Agent | AG-13 | Drafting, revision, editing, style (CRIE Ch. 23) | Draft, guidelines | Drafts, revisions | WritingEngine | None |
| Integrity Agent | AG-14 | Plagiarism, fabrication, manipulation screening (CRIE Ch. 20) | Drafts, sources | Integrity screens | IntegrityEngine | None |
| Ethics Agent | AG-15 | Ethics review support, ethics refusals (CRIE Ch. 19) | Plans, applications | Ethics assessments, refusals | EthicsEngine | None |
| Gap & Novelty Agent | AG-16 | Gap detection and novelty assessment (CRIE Chs. 16, 17) | Literature, claims | Gap and novelty signals | GapDetectionEngine, NoveltyEngine | None |
| Peer Review Agent | AG-17 | Reviewer and editorial support (CRIE Ch. 25) | Manuscript, rubric | Reviews, decision support | PeerReviewEngine | Gate on review decision |
| Publication Agent | AG-18 | Submission readiness, cover letters, stewardship (CRIE Ch. 26) | Manuscript, venues | Submission package, checklist | PublishingEngine | **Gate — submission requires explicit approval** |
| Journal Agent | AG-19 | Journal matching and fit (CRIE Ch. 27) | Manuscript, journal data | Journal fits | JournalEngine | None |
| Conference Agent | AG-20 | Conference matching and participation (CRIE Ch. 28) | Work, conference data | Conference matches | ConferenceEngine | None |
| Grant Agent | AG-21 | Funding discovery and proposal support (CRIE Ch. 29) | Profile, calls | Opportunities, proposals, readiness | GrantEngine | **Gate — submission requires explicit approval** |
| Patent Agent | AG-22 | Patentability sensing and disclosure (CRIE Ch. 30) | Innovation, prior art | Patentability signals, disclosure risk | PatentEngine | None |
| Innovation Agent | AG-23 | Innovation opportunity analysis (CRIE Ch. 31) | Research outputs | Innovation opportunities | InnovationEngine | None |
| Career Agent | AG-24 | Career intelligence and planning (CRIE Ch. 32) | Profile, goals | Career signals, plans | CareerEngine | None |
| Learning Agent | AG-25 | Just-in-time teaching and practice (CRIE Ch. 33) | Learner state (consented) | Lessons, assessments | LearningEngine | None |
| Mentorship Agent | AG-26 | Mentorship scaffolding (CRIE Ch. 34) | Mentee goals | Scaffolding, reflections | MentorshipEngine | None |
| Analytics Agent | AG-27 | Research analytics derivation (CRIE Ch. 36) | Derived signals | Indicators, rollups | AnalyticsEngine | None |
| Prediction Agent | AG-28 | Predictive modelling with uncertainty (CRIE Ch. 37) | Histories, features | Predictions with uncertainty | PredictionEngine | None |
| Recommendation Agent | AG-29 | Recommendation generation and explanation (CRIE Ch. 38) | Goals, candidates | Ranked recommendations | RecommendationEngine | None |
| Adaptive Agent | AG-30 | Profile adaptation (CRIE Ch. 39) | Interactions, feedback | Adapted profiles | AdaptiveEngine | None |
| Memory Agent | AG-31 | Memory write/read/consolidate/forget (CRIE Ch. 40) | Memory events, policy | Memory updates | MemoryEngine | None |
| Scheduling Agent | AG-32 | Timeline, milestone, and planning (CRIE Chs. 8, 37) | Plan, deadlines | Timelines, milestones | ResearchWorkflowEngine | None |
| Compliance Agent | AG-33 | Policy, governance, and role enforcement (CRIE Ch. 61) | Requests, policy | Grant/refuse decisions | PolicyEngine | None |
| Supervisor Agent | AG-34 | Supervision portfolio support (CRIE Ch. 24) | Mentee work | Portfolio views, feedback | SupervisorEngine | Gate on consequential supervision decisions |
| Institution Agent | AG-35 | Aggregate institutional intelligence (CRIE Ch. 35) | Consented aggregate signals | Institutional intelligence | InstitutionEngine | None |
| Integrations Agent | AG-36 | Platform integration operations (CRIE Chs. 46–58) | Integration events | Integrated operations | ConnectorEngine, platform surfaces | None |

## 9.3 Autonomous research agents (ARA-01…ARA-12)

| Agent | ID | Purpose | Inputs | Outputs | Depends on | Human approval |
|---|---|---|---|---|---|---|
| Literature Discovery Agent | ARA-01 | Continuous literature monitoring, screening, and discovery (CRIE Chs. 15, 16) | Monitoring profile, corpora | Matches, alerts | AG-06, E-26 | None (monitoring); alerts are advisory |
| Hypothesis Generation Agent | ARA-02 | Hypotheses, research questions, and candidate explanations (CRIE Chs. 3, 16) | Research question, context | Candidate hypotheses | AG-09, ReasoningEngine | None (proposals only) |
| Methodology Agent | ARA-03 | Method selection, study design, sampling, and feasibility (CRIE Ch. 18) | Question, constraints | Design plans | AG-10 | Gate on consequential design choices |
| Statistical Reasoning Agent | ARA-04 | Statistical design, power, analysis, and interpretation (CRIE Ch. 21) | Data, design | Statistical plans, interpretations | AG-11 | None |
| Writing Agent | ARA-05 | Drafting, structuring, revising, and formatting (CRIE Ch. 23) | Outline, drafts | Drafts, revisions | AG-13 | None |
| Reviewing Agent | ARA-06 | Critical review, argument evaluation, and critique (CRIE Chs. 11, 25) | Drafts, arguments | Critiques, evaluations | AG-09, AG-17 | None |
| Grant Preparation Agent | ARA-07 | Funding discovery, proposal drafting, and submission readiness (CRIE Ch. 29) | Profile, calls | Proposals, readiness | AG-21 | **Gate — submission requires explicit approval** |
| Publishing Agent | ARA-08 | Publication strategy, journal matching, and stewardship (CRIE Chs. 26, 27) | Manuscript, goals | Strategy, matches | AG-18, AG-19 | **Gate — submission requires explicit approval** |
| Peer Review Agent | ARA-09 | Peer-review support, reviews, and editorial assistance (CRIE Ch. 25) | Manuscript, rubric | Reviews | AG-17 | Gate on review decision |
| Teaching Agent | ARA-10 | Teaching support, lesson design, and assessment (CRIE Ch. 33) | Learner state (consented) | Lessons, assessments | AG-25 | None |
| Mentoring Agent | ARA-11 | Mentorship scaffolding and guidance (CRIE Ch. 34) | Mentee goals | Scaffolding, reflections | AG-26 | None |
| Career Intelligence Agent | ARA-12 | Career tracking, planning, and opportunity sensing (CRIE Ch. 32) | Profile, goals | Career plans, signals | AG-24 | None |

## 9.4 Autonomy and approval discipline

1. **Autonomy levels.** Agents operate at L1–L4 by default; L5 is disabled
   unless a specific, reviewed, revocable configuration enables it (CRIE §62.6).
   The `AutonomyLevelBadge` and `AgentCharterCard` surfaces expose the envelope.
2. **Approval gates.** Submission, commitment, expenditure, and public
   representation SHALL always require explicit human approval — for both
   catalogue agents and ARAs (CRIE §62.7). Consequential tasks are gated
   regardless of priority.
3. **Priority.** Task priority (`low | medium | high | urgent`) is assigned by
   the orchestrator from researcher goals, deadlines, budgets, and consequence;
   no task exceeds its declared budget (time, cost, compute, context).
4. **Collaboration.** AG-01 decomposes missions; agents hand off artefacts with
   contracts and provenance; independent tasks run in parallel; coordination is
   through the shared RKG and memory; disagreeing agents reconcile and escalate
   to the researcher where consequential (fspec §14.5).
5. **Verification gate.** Every agent step closes only when: autonomy envelopes
   enforced; approval gates pause consequential steps; L5 disabled by default;
   audit complete (fspec Ch. 17).

---

# Chapter 10 — Integration Map

Integration is **by reference and event, never duplication** (fspec Ch. 15;
CRIE Chs. 46–58; SLEA §14.1). **Fifteen modules are specified.** CRIE
references each module's canonical records by identity and communicates through
the platform's Activity/Notifications/Workflow surfaces. This chapter maps each
module to its repository integration points.

| Module | Integration points | Data flow | Repository surface |
|---|---|---|---|
| **Identity** | Researchers are canonical identities (username/SAID) | `IdentityEngine.researcherOf` resolves canonical principals; never copies | `types/identity.ts`, `lib/auth/*`, `lib/said.ts`, `hooks/useIdentity.ts`, `app/identity` |
| **Trust** | Source trust and issuer authority | `TrustEngine` consumes verification signals; trust values are derived | `types/trust.ts`, `lib/trust.ts`, `hooks/useTrust.ts`, `app/trust` |
| **Verification** | Verification of claims, references, and credentials | `VerificationEngine` validates references/credentials; results feed trust | `hooks/useVerification.ts`, `app/verification` |
| **Publishing** | Publication plans reference canonical publications/journals | CRIE references publications and DOIs; never duplicates records | `types/publisher.ts`, `types/manuscript.ts`, `app/publishing`, `app/manuscripts` |
| **Marketplace** | Grant/proposal and service surface integration | CRIE references marketplace listings and orders (`listing-*`, `ord-*`) | `types/marketplace.ts`, `lib/marketplace.ts`, `app/marketplace` |
| **Groups** | Group research collaboration signals | CRIE references group entities by identity | `types/groups.ts`, `lib/groups.ts`, `hooks/useGroups.ts`, `app/groups/**` |
| **Communities** | Community research and mentorship context | CRIE references community entities by identity | `types/communities.ts`, `lib/communities.ts`, `hooks/useCommunities.ts`, `app/communities/**` |
| **Learning** | Learner state and learning signals (SLEA Ch. 13) | `LearningEngine` reads consented learning signals; never owns learning records, never issues credentials | `types/learning.ts`, `lib/learning*.ts`, `hooks/useLearning.ts`, `app/learning/**` |
| **Messaging** | Conversation coordination with humans and mentors | CRIE references conversations; coordination via Messaging surface | `types/messages.ts`, `lib/messages.ts`, `hooks/useMessages.ts`, `app/messages` |
| **Workflow (SWTROP)** | Research workflow integration — tasks, artefacts, reviews | `ResearchWorkflowEngine` promotes artefacts and references SWTROP workflows by `sourceId`/`sourceEntity` | `types/workflows.ts`, `lib/workflows.ts`, `lib/tasks.ts`, `lib/reviews.ts`, `app/workflows/**` |
| **Notifications** | Milestones, approvals, and alerts | `NotificationEngine` emits events on consequential activity | `types/notifications.ts`, `lib/notifications.ts`, `hooks/useNotifications.ts`, `app/notifications` |
| **Activity** | CRIE actions in the platform event stream | CRIE emits activity events; never stores others' activity | `types/activity.ts`, `lib/activity.ts`, `hooks/useActivity.ts`, `app/activity` |
| **Research Projects** | Live research context for the RCM | Research entities reference canonical project records | `types/research.ts`, `lib/research.ts`, `lib/lifecycle.ts`, `app/research/**` |
| **Digital Twins** | Persistent personalised research state | `DigitalTwinEngine` consumes consented CRIE signals (Phase 5; CRIE Ch. 46) | Planned capability (Phase 5); no repository surface yet |
| **Knowledge Graph** | Typed learning graph joined to the RKG | Graph-ready data serialised via JSON-LD adapter; semantic integration only | `types/learning.ts` graph structures; RKG tables (fspec Ch. 3) |

## 10.1 Integration invariants

1. **Reference over copy** — every cross-module relationship is an identity
   reference; no module's canonical record is duplicated (CRIE Chs. 46–58).
2. **Event-based coupling** — modules communicate through the platform's
   Activity/Notifications/Workflow surfaces; no hidden direct coupling.
3. **Derived analytics** — any aggregate spanning modules is computed, never
   hand-maintained (SADR-006).
4. **Consent boundaries** — personalisation across modules follows the privacy
   and consent model (CRIE Ch. 60).

## 10.2 Route-level integration

- `/crie/*` routes reference the existing module routes for cross-module
  navigation (hub `Button href` pattern).
- `/crie/institutions` connects to `/institutional-network`; `/crie/grants` to
  `/grants` and `/funding`; `/crie/publishing` to `/publishing` and
  `/manuscripts`; `/crie/reviews` to `/reviews`; `/crie/learning` surfaces to
  `/learning/**`.
- The CRIE hub (`/crie`) is added to `constants/config.ts` navigation and the
  platform layout navigation surface at the appropriate wave.

---

# Chapter 11 — Risk Analysis

| Risk | Category | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| **Contract drift** — engines diverge from the functional specification during implementation | Engineering | Medium | High | Checkpoint protocol after every wave; fspec Ch. 18 conformance matrix re-audited; `lib/index.ts` by-name exports verified. |
| **Circular imports** — types/engines form cycles (P4 violation) | Engineering | Medium | High | Wave 1 exit criterion (`tsc` clean, no circular imports); dependency ordering (§3.2) enforced; audit section in checkpoints. |
| **Duplication of existing engines** — CRIE re-implements ranking/confidence/lifecycle logic already in `lib/*` | Engineering | High | Medium | Reuse-before-create rules (§3.3); AI Development Protocol §2; review gate audits imports. |
| **Complexity of 150-entity domain** — types balloon and drift | Complexity | High | Medium | Single canonical `types/crie/` with base models; DTO layer; no per-page ad-hoc types. |
| **Large wave size** — a wave exceeds safe, reviewable commit size | Complexity | Medium | Medium | Waves decomposed across commits; phase boundary rule; checkpoint after each wave, not after each file. |
| **Reasoning explainability debt** — traces become opaque as paradigms compose | Complexity | High | High | Reasoning step 10 (explainable traces) is a hard gate; no opaque consequential output (Article VII). |
| **Agent autonomy escalation** — an agent exceeds its envelope | Security | Medium | High | Autonomy envelopes enforced by `PolicyEngine`; L5 disabled by default; approval gates; `AgentOversightDashboard`. |
| **Privilege escalation** — a principal requests beyond role bounds | Security | Medium | High | Least privilege (P16); every CRIE action through `can({ roles, verificationLevel, permission })`; refusal + audit. |
| **Prompt injection / unsafe model output** | Security | Medium | High | Provider-neutral `ConnectorEngine` with safety guards; refusal framing; sandboxing (CRIE §44.2); no untrusted code execution. |
| **Cross-institutional data leak via memory** | Security | Low | High | Institutional isolation (CRIE Ch. 68); memory reads never cross-institutional; consent-gated access. |
| **Cell suppression violation in institutional analytics** | Security | Medium | Medium | Suppression above cohort tier in `InstitutionEngine`; validation gate. |
| **Performance — expensive derived analytics on server components** | Performance | Medium | Medium | Derived analytics cheap; no client bundles for static surfaces; budgets respected; no N+1 patterns (fspec Ch. 17). |
| **KG index staleness** — `IndexEngine` treated as authoritative | Performance | Medium | Medium | Indexes are never authoritative; refresh/rebuild governed; provenance on all entities. |
| **Scalability of graph versioning** — time-travel over unbounded history | Scalability | Medium | Medium | Governed insertion/revision/deprecation; version pruning policy; federation export bounded by contracts. |
| **Federation sovereignty violations** | Scalability | Low | High | `FederationEngine` enforces `memberSovereignty`; governed exchange only; institutional isolation. |
| **Regression of existing modules** — CRIE touches shared files | Engineering | High | Medium | Regression audit per wave; `git status` clean at close; route matrix updated. |
| **Documentation drift** — docs and code diverge | Engineering | Medium | Medium | One verification report per wave; conformance re-audit; no code without documentation update (AI Development Protocol §11). |

## 11.1 Risk posture statement

CRIE is delivered **incrementally with a hard checkpoint at every wave**. No
wave SHALL close with an open high-severity risk. Where a risk cannot be fully
mitigated in a wave, it SHALL be recorded in the wave report with an explicit
owner and a binding follow-up in the next wave.

---

# Chapter 12 — Implementation Checkpoints

Every wave SHALL close with the checkpoint below. The gate is mandatory: a wave
is **not complete** until every item passes (fspec Ch. 17; AI Development
Protocol §§12–16).

| Area | Check |
|---|---|
| **TypeScript** | `npx tsc --noEmit` — 0 errors; no `any` leaks; strict mode; no circular imports. |
| **Lint** | `npm run lint` — 0 errors; only pre-approved warnings (if any). |
| **Build** | `npm run build` — all routes build; 0 failed pages; static prerender verified. |
| **Routes** | All `/crie` routes reachable; dynamic `[id]`/`[crieId]` resolve; cross-module links valid. |
| **Architecture validation** | Every engine/hook/component referenced conforms to the functional specification; no contract drift. |
| **Dependency validation** | No circular module imports; no cross-layer internal access (P4, L11); reuse rules (§3.3) upheld. |
| **Performance** | No client bundles for static surfaces; derived analytics cheap; budgets respected; no N+1 patterns. |
| **Security** | RBAC-gated actions; verification gate applied; zero-trust default (CRIE Ch. 68); no secrets; no unsafe input sinks. |
| **KG integrity** | Every entity/relation has provenance + confidence; versioning and time-travel verified; trust propagation monotonic and explainable. |
| **Memory integrity** | Consent-gated access; institutional isolation; consolidation explainable; retention/expiry honoured. |
| **Agent integrity** | Autonomy envelopes enforced; approval gates pause consequential steps; L5 disabled by default; audit complete. |
| **Accessibility** | Semantic HTML; keyboard navigable; labelled controls; contrast (P15). |
| **Integration** | No duplicate records; canonical references resolve; events/notifications flow; consent enforced. |
| **Regression** | Existing modules unaffected; route matrix updated; `git status` clean at close. |
| **Documentation** | Wave verification report written to `docs/crie/WAVE_n_<name>_REPORT.md`; conformance matrix re-audited. |

## 12.1 Checkpoint sequencing

1. Developer closes a wave's implementation (types → engines → constants →
   hooks → components → routes → schema section, in dependency order).
2. TypeScript, lint, and production build run green.
3. Architecture validation and dependency validation are reviewed against the
   functional specification and this blueprint.
4. Wave-specific integrity checks (KG/memory/agent) run.
5. Regression audit confirms existing modules are unaffected.
6. Wave report is written; `git status` is clean at close.
7. Only then does the next wave begin.

---

# Chapter 13 — Mission Breakdown

The twelve waves are delivered by the missions **004-D through 004-M**. Each
mission SHALL close with a completion report (AI Development Protocol §16) that
states: waves/chapters delivered, checkpoints passed, estimated size, next
mission, and confirmation of no unintended repository modification.

| Mission | Title | Waves | Primary scope |
|---|---|---|---|
| **004-D** | CRIE Core Engine | Waves 1–2 | `types/crie/` domain model; context/session/lifecycle/workspace engines; `constants/placeholder-crie.ts`; hooks `useCRIE`; `app/crie` hub + research routes; schema Groups 1–2. |
| **004-E** | CRIE Knowledge Graph | Wave 3 | `KnowledgeGraphEngine` + `TrustEngine`; RKG types; schema Group 3; `useKnowledgeGraph`; knowledge routes. |
| **004-F** | CRIE Reasoning | Wave 4 | `ReasoningEngine` + `PromptEngine`; reasoning traces; `useReasoning`; reasoning routes; schema Group 4. |
| **004-G** | CRIE Research Intelligence & Memory | Waves 5–6 | `MemoryEngine`; document, citation, evidence, literature, gap, novelty, methodology, statistics, instrument engines; `useMemory`, `useEvidence`, `useCitationAssistant`; schema Groups 5–7. |
| **004-H** | CRIE Autonomous Agents | Wave 7 | `AgentCoordinatorEngine` + executor; AG-01…AG-36 + ARA-01…ARA-12 charters; `useAgent`; agents routes; schema Group 11 (agents/orchestration). |
| **004-I** | CRIE Decision Intelligence | Wave 8 | Recommendation, prediction, decision engines; `useDecisionSupport`; decision routes; schema Group 10 (decision & analytics). |
| **004-J** | CRIE Institution Intelligence & Federation | Waves 9–10 | Institution, enterprise, IKOS surfaces; admin surfaces (PolicyConsole, AuditExplorer, ConnectorRegistry); federation engine; `useResearchAnalytics`; schema Groups 9, 12. |
| **004-K** | CRIE Optimization | Wave 11 | Search, index, prompt engines; performance and budget discipline; index refresh/rebuild. |
| **004-L** | CRIE Integration | — | Cross-module integration conformance (fspec Ch. 15): notifications, activity, workflow, learning, messaging, groups, communities, marketplace, publishing, digital-twin hooks; route/navigation integration; regression audit. |
| **004-M** | CRIE Final Verification | Wave 12 | fspec Ch. 17 checklist executed end-to-end; Ch. 18 conformance matrix audited; repository governance checks; final report. |

## 13.1 Mission rules

1. Missions run strictly in order; no mission SHALL begin before the previous
   mission's checkpoint passes (phase boundary rule).
2. Each mission SHALL produce exactly the scoped files; shared-file edits (e.g.,
   `lib/index.ts`, `types/index.ts`, `hooks/index.ts`, `constants/config.ts`,
   `db/schema.sql`) are additive and audited in the regression step.
3. No mission SHALL commit or tag unless explicitly instructed; each mission
   SHALL end with `git status` inspected and reported.
4. The functional specification is the contract for every mission; this
   blueprint governs order, location, and boundaries.

---

# Chapter 14 — Estimated Implementation Size

Estimates are derived from the functional specification counts and the
repository mapping in Chapter 4. They are **planning estimates**, refined in
each mission's completion report.

## 14.1 New files by repository area

| Area | New files | Basis |
|---|---|---|
| `types/crie/*.ts` | ~37 (36 modules + barrel) | §4.2 |
| `lib/crie/*.ts` | ~49 (48 engine modules + barrel) | §4.3 |
| `lib/index.ts` edits | 1 (additive re-export) | §4.3 |
| `types/index.ts` edits | 1 (additive re-export) | §4.2 |
| `hooks/*.ts` | 12 new hooks + `hooks/index.ts` edits | §4.4 |
| `constants/placeholder-crie.ts` | 1 | §4.5 |
| `components/crie/**` | ~49 (48 components + index) | §4.6 |
| `app/crie/**` | ~31 (28 pages + hub layout + dynamic segment files) | §4.7 |
| `constants/config.ts` edits | 1 (navigation entry) | §4.7 |
| `db/schema.sql` additions | 120 CRIE tables appended | §4.8 |
| `docs/crie/` | 12 wave reports + this blueprint | §4.9 |
| **Total new/edited tracked files** | **~190 new + ~5 additive edits** | — |

## 14.2 Component and engine counts

| Artifact | Count |
|---|---|
| Core engines (E-01…E-28) | 28 |
| Advisory domain engines | 28 |
| Hooks | 12 |
| UI feature components | 48 |
| Routes | 28 |
| Database tables (CRIE groups) | 120 |
| Domain entities | 150 |
| Workflows | 18 |
| Agent catalogue (AG) + autonomous agents (ARA) | 36 + 12 = 48 |
| AI interfaces (`IN-###`) | ~15 contract families |
| Knowledge Graph entity classes | 12 |
| Memory types | 8 |
| Reasoning paradigms | 6 |

## 14.3 Commits and tags

- **Commits:** estimated **3–6 per wave** (types → engines → constants/hooks →
  components/routes → schema/docs), i.e. roughly **40–60 commits** across the
  ten missions (004-D…004-M).
- **Tags:** estimated **12 wave tags** (one per wave, e.g., `crie-wave-1-core-types`)
  and **10 mission tags** (one per mission, e.g., `crie-004-D-complete`),
  following the existing `phase-*.N-complete` naming style. Tags are created
  only when explicitly instructed.

## 14.4 Size drivers and sensitivities

- The largest mission by file count is **004-H (Agents)** (48 charters +
  executor) and **004-G (Research Intelligence & Memory)** (9 advisory engines).
- The largest single file is expected to be `constants/placeholder-crie.ts`
  (seed graphs for 150 entities, mirroring `placeholder-learning.ts` at scale).
- `db/schema.sql` grows from 169 to **289 tables** once all CRIE groups are
  appended.

---

# Chapter 15 — Architecture Conformance Matrix

Every implementation wave SHALL conform to the CRIE Architecture, the CRIE
Functional Specification, and the Scholatia platform architecture. The matrix
below maps each wave to the architecture chapters it implements and the
specification chapters it realises. **Nothing is omitted.**

| Wave | CRIE Architecture (Chs.) | CRIE Functional Specification (Chs.) | Scholatia platform (docs/) |
|---|---|---|---|
| **1 — Core Types** | 1–4 (vision, principles, RCM, layers) | 1–4 (overview, domain model, TS model) | `ARCHITECTURE_DECISIONS.md`, `AI_DEVELOPMENT_PROTOCOL.md` §§2–3 |
| **2 — Core Engines** | 5–8 (context, session, workspace, lifecycle) | 5 (service layer), 6 (hooks), 8 (routes) | `RESEARCH_LIFECYCLE.md`, `lifecycle.ts` conventions |
| **3 — Knowledge Graph** | 9, 61 (KG, RKG) | 12 (KG spec), 3 (Group 3) | `ROUTE_MATRIX.md`, `db/schema.sql` conventions |
| **4 — Reasoning** | 11, 64 (reasoning, paradigms) | 11 (AI interfaces), 12.4 (graph reasoning) | `AI_DEVELOPMENT_PROTOCOL.md` §6 |
| **5 — Memory** | 40, 63 (memory architecture) | 13 (memory spec), 3 (Group 11) | `LEARNING_ECOSYSTEM_ARCHITECTURE.md` §13 |
| **6 — Research Intelligence** | 10, 12–22, 36 (semantic, document, citation, evidence, literature, gap, novelty, methodology, ethics, integrity, statistics, instrument, analytics) | 5 (advisory engines), 7 (components) | `WORKFLOW_ARCHITECTURE.md`, `MANUSCRIPT_ARCHITECTURE.md` |
| **7 — Agents** | 42, 43, 62 (multi-agent, orchestration, ARAs) | 14 (agent architecture) | `AI_DEVELOPMENT_PROTOCOL.md` §§1, 5 |
| **8 — Decision Intelligence** | 37, 38, 65 (prediction, recommendation, decision) | 6 (hooks), 10 (workflows) | `INTELLIGENCE_ARCHITECTURE.md` |
| **9 — Institution Intelligence** | 35, 59, 60 (institution, enterprise, IKOS) | 5 (E-11), 9 (permissions) | `INSTITUTION_ARCHITECTURE.md` |
| **10 — Admin** | 44, 67 (connectors, ethics/audit) | 9 (permission matrix), 11 (AI interfaces) | `RBAC.md`, `TRUST_ARCHITECTURE.md` |
| **11 — Optimization** | 10, 12, 44 (index, search, connectors) | 11 (AI interfaces), 17 (verification) | `AI_DEVELOPMENT_PROTOCOL.md` §12 |
| **12 — Final Verification** | 67, 68, 70 (ethics, security, constitution) | 17 (verification checklist), 18 (conformance) | `IMPLEMENTATION_COMPLIANCE_ENGINE.md`, `REPOSITORY_GOVERNANCE_AUDITOR.md` |

## 15.1 Completeness and conformance statement

- Every CRIE Architecture chapter (1–70) is implemented across the twelve waves;
  the per-wave mapping above covers the full chapter set, mirroring the fspec
  §18.1 matrix.
- **No contradictions** exist between this blueprint, the CRIE Architecture, and
  the CRIE Functional Specification. This blueprint adds no new constitutional
  principles and removes none.
- The CRIE Constitution (Architecture Ch. 70, Articles I–XII) prevails over
  every provision herein; any future conflict SHALL be resolved in favour of
  the Constitution (CRIE §70.15).
- The CRIE Functional Specification is the authoritative engineering contract;
  where this blueprint and the specification disagree, the specification wins
  and the discrepancy SHALL be recorded and reconciled in the affected wave
  report.
- The Scholatia platform architecture (`docs/architecture.md`,
  `PHASE_ROADMAP.md`, module architectures, and governance registers) continues
  to govern repository structure, naming, verification, and delivery.

## 15.2 Definition of done

This blueprint is complete when: all fifteen chapters are present and accurate
against the source documents; the repository contains only this new
documentation file; and the required six-point report has been delivered
without generating code, modifying existing code, updating governance, or
creating commits or tags.

---

*End of Implementation Blueprint. No implementation, no code, no routes, no
components, no commits, and no governance updates are derived from this
document. Implementation begins with Mission 004-D.*
