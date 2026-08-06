# Scholatia Cognitive Research Intelligence Engine — Functional Specification

**Document:** `docs/crie/CRIE_FUNCTIONAL_SPECIFICATION.md`
**Mission:** Mission 004-B — CRIE Functional Specification
**Reference:** `docs/crie/CRIE_ARCHITECTURE.md` (Mission 004-A, approved constitutional architecture)
**Status:** Engineering specification — guides Phase 2.2H implementation.
**Scope:** Specification only. No implementation, no code, no routes, no
components, no commits, no governance updates.

This specification translates the approved CRIE Architecture (Mission 004-A)
into a complete, production-grade engineering blueprint. Every requirement
herein is traceable to a chapter or section of
`docs/crie/CRIE_ARCHITECTURE.md`. The CRIE Architecture — and the CRIE
Constitution it contains (Chapter 70) — is the highest authority; this
specification SHALL NOT contradict it and adds no constitutional principle.

---

# Chapter 1 — System Overview

## 1.1 Purpose

CRIE — the Cognitive Research Intelligence Engine — is the orchestration
intelligence layer of Scholatia: a derived-first, provenance-bearing cognitive
companion that supports the entire scholarly lifecycle, from the first spark of
an idea to the permanent preservation of scholarly impact (CRIE Ch. 1). CRIE
composes cognition, reasoning, knowledge, memory, agency, and presentation
(P4) into a governed research operating surface for individual researchers,
research teams, and institutions.

## 1.2 Objectives

1. Companion every stage of the Research Lifecycle (14 canonical stages, CRIE
   Ch. 8) with context-aware, evidence-grounded support.
2. Maintain a single source of truth for every claim, citation, and summary via
   the Research Knowledge Graph (RKG, CRIE Ch. 61) with provenance and
   calibrated confidence (P3, P6, P11).
3. Provide multi-paradigm reasoning (symbolic, probabilistic, causal, graph,
   educational, research) with explainable traces (CRIE Ch. 64).
4. Operate a governed multi-agent ecosystem — the Agent Catalogue (AG-01…AG-36,
   CRIE Ch. 43) and the Autonomous Research Agents (ARA-01…ARA-12, CRIE Ch. 62)
   — within declared autonomy envelopes (L1–L5).
5. Maintain a unified multi-scale memory architecture: individual and
   institutional, short-term and long-term, episodic and semantic (CRIE Ch. 63).
6. Provide decision intelligence — recommendation, optimisation, prediction,
   planning, and institutional decision support — with humans accountable for
   consequential decisions (CRIE Ch. 65).
7. Integrate with every Scholatia module **by reference and event, never
   duplication** (CRIE Ch. 46–58) and federate with the global scholarly
   ecosystem under sovereign, governed contracts (CRIE Ch. 66).
8. Enforce the CRIE Constitution (CRIE Ch. 70, Articles I–XII) at every layer;
   all eighteen architectural principles (P1–P18, CRIE Ch. 2) apply.

## 1.3 Actors

| Actor | Definition |
|---|---|
| **Researcher** | The principal and accountable human; an individual scholar using CRIE for any research entity (CRIE Ch. 3). |
| **Student** | A researcher in learning mode; supported by the Learning Agent (AG-25) and Teaching Agent (ARA-10). |
| **Supervisor** | Guides researchers; supported by the Supervisor Agent (AG-34), Supervision records, and the Mentoring Agent (ARA-11). |
| **Reviewer** | Evaluates manuscripts and evidence; supported by the Peer Review Agent (AG-17, ARA-09). |
| **Journal Editor** | Manages review flow; supported by Peer Review and Journal Agents (AG-17, AG-19). |
| **Grant Reviewer** | Evaluates proposals; supported by the Grant Agent (AG-21) and Grant Review Assistant. |
| **Institution Administrator** | Governs institutional knowledge and analytics (CRIE Ch. 35, 59, 60). |
| **Platform Admin** | Operates CRIE platform-wide — connectors, policies, audit, federation (CRIE Ch. 44, 66, 67). |
| **System AI / CRIE service principals** | Non-human principals that orchestrate and advise; never the accountable principal (CRIE Ch. 70, Article VIII). |
| **External AI providers** | Connector-bound capability providers (language, embeddings, OCR, translation, speech, search); sandboxed and replaceable (CRIE Ch. 44). |
| **Federation members** | Sovereign scholarly actors exchanging governed knowledge under federation contracts (CRIE Ch. 66). |

## 1.4 Primary users

Researchers — scholars, students, supervisors, reviewers, journal editors,
grant reviewers, and institution administrators — across disciplines, languages,
and career stages.

## 1.5 Secondary users

Institutional and enterprise stakeholders (CRIE Ch. 59–60), federated
institutions and national bodies (aggregate analytics, CRIE Ch. 66), and AI
service principals (CRIE and assistants) consuming derived signals.

## 1.6 System scope

In scope: the Research Cognitive Model, context/session/workspace engines,
the Research Lifecycle, the Knowledge Graph and RKG, semantic intelligence,
multi-paradigm reasoning, document/citation/evidence intelligence, literature,
gaps, novelty, methodology, ethics, integrity, statistics, instruments,
writing, supervision, peer review, publication, journals, conferences, grants,
patents, innovation, career, learning, mentorship, institutional intelligence,
analytics, prediction, recommendation, adaptation, memory, conversation,
multi-agent orchestration, external connectors, enterprise intelligence, IKOS,
federation, ethics, security, and audit (CRIE Ch. 3–69).

## 1.7 Boundaries

Out of scope and **never duplicated** by CRIE (referenced by identity only):
researchers (Identity), publications (Publishing), journals and conferences,
institutions, groups, communities, messaging, notifications, activity,
workflow artefacts, research projects, and learning records (CRIE Ch. 46–58;
SLEA Ch. 14). CRIE **never** issues credentials, finalises grades, signs
commitments, authorises expenditures, or acts on a researcher's behalf without
explicit approval (CRIE Ch. 62 §62.7). CRIE is **derived-first**: intelligence
is derived from canonical modules and never owns their records (SADR-006).

## 1.8 Dependencies

- **Identity / Authentication** — researchers are canonical identities
  (username/SAID; CRIE Ch. 53).
- **RBAC** — the platform permission hierarchy (CRIE Ch. 61; `docs/RBAC.md`).
- **Trust / Verification** — issuer and source trust; verification of
  credentials and references (CRIE Ch. 54).
- **Workflow (SWTROP)** — workflow execution and artefact promotion for
  research workflow integration (CRIE Ch. 55; `docs/WORKFLOW_ARCHITECTURE.md`).
- **Learning Ecosystem** — learner state and learning signals consumed by the
  Learning Engine (CRIE Ch. 47; `docs/LEARNING_ECOSYSTEM_ARCHITECTURE.md`).
- **Publishing, Marketplace, Messaging, Groups, Communities, Notifications,
  Activity, Research Projects, Digital Twins** — integration by reference and
  event (CRIE Ch. 46–58).
- **External AI Connectors** — provider-neutral capability adapters
  (CRIE Ch. 44).
- **Global Knowledge Federation** — sovereign scholarly interoperability
  (CRIE Ch. 66).

## 1.9 Subsystem boundaries

The intelligence is organised into twelve layers, L0–L11 (CRIE Ch. 4):
Infrastructure & Data (L0), Perception (L1), Semantic (L2), Knowledge (L3),
Cognitive (L4), Epistemic (L5), Adaptive (L6), Advisory (L7), Decision (L8),
Agency (L9), Presentation (L10), and Governance (L11). Layer rules SHALL be
observed: upward dependency for data only, downward invocation through
declared contracts, governance spanning all layers, and confidence
propagation upward (CRIE §4.3).

---

# Chapter 2 — Domain Model

All entities follow CRIE conventions: stable identity, provenance by
construction (P3), calibrated confidence, typed relationships, lifecycle
state, and canonical references (never duplicated records). **One hundred and
fifty core entities are specified.**

## 2.1 Cognitive & research lifecycle entities (16)

| Entity | Description | CRIE |
|---|---|---|
| `ResearchEntity` | The root cognitive object — a research effort (project, study, thesis, paper, grant programme, patent, innovation). | Ch. 3 |
| `ResearchCognitiveModel` | The living model of an entity: questions, hypotheses, concept map, status vector. | Ch. 3 |
| `CognitiveModelVersion` | Versioned snapshot of a cognitive model. | Ch. 3 |
| `LifecycleStage` | One of the 14 canonical stages: Idea, Problem, Objectives, Questions, Hypotheses, Literature, Framework, Methodology, Instrument, Analysis, Interpretation, Publication, Impact, Preservation. | Ch. 8 |
| `StageInstance` | The researcher's position in the lifecycle, with dwell time and prerequisites. | Ch. 8 |
| `StageTransition` | Recorded traversal between lifecycle stages (including loops). | Ch. 8 |
| `ResearchQuestion` | A question on an entity, feeding the cognitive model. | Ch. 3 |
| `Hypothesis` | A candidate explanation or prediction under evaluation. | Ch. 3 |
| `ResearchAim` | A declared aim of the research entity. | Ch. 3 |
| `ResearchGoal` | A goal decomposable into milestones and tasks. | Ch. 8 |
| `ConceptMap` | The typed map of concepts relevant to the entity. | Ch. 3 |
| `ConceptMapNode` | A concept node within the map. | Ch. 3 |
| `ConceptMapEdge` | A typed relationship between concept nodes. | Ch. 3 |
| `ResearchPlan` | A plan with goals, milestones, tasks, and dependencies. | Ch. 8 |
| `ResearchMilestone` | A milestone within the plan. | Ch. 8 |
| `ResearchTimeline` | The temporal projection of the plan with estimates. | Ch. 8 |

## 2.2 Context, session & workspace entities (8)

| Entity | Description | CRIE |
|---|---|---|
| `ContextPack` | The assembled, bounded, weighted operative context for an interaction. | Ch. 5 |
| `ContextElement` | A single provenance-bearing element of a context pack. | Ch. 5 |
| `ResearchSession` | A goal-directed temporal envelope of researcher–CRIE interaction. | Ch. 6 |
| `SessionMessage` | A message within a session. | Ch. 6 |
| `SessionGoal` | The intent a session serves. | Ch. 6 |
| `Workspace` | The researcher's persistent research surface. | Ch. 7 |
| `WorkspacePane` | A pane within the workspace (documents, advisory, agents, memory). | Ch. 7 |
| `SelectedPassage` | The currently active passage/selection. | Ch. 7 |

## 2.3 Knowledge Graph & RKG entities (12)

| Entity | Description | CRIE |
|---|---|---|
| `KnowledgeGraph` | The semantic spine of scholarly knowledge. | Ch. 9, 61 |
| `KGEntity` | A typed node carrying identity (CRIE-ID), attributes, provenance, confidence, lifecycle state. | Ch. 61 |
| `KGEntityClass` | One of the 12 entity classes (People, Organisations, Works, Venues, Concepts, Claims, Evidence, Methods, Grants, Events, Places, Terms). | Ch. 61 |
| `KGRelation` | A typed semantic relationship with subject, predicate, object, strength, provenance, confidence, validity. | Ch. 61 |
| `KGProvenance` | The immutable record of source, actor, timestamp, method, version, basis, consent. | Ch. 61 |
| `GraphVersion` | A reproducible state of the graph supporting time-travel queries. | Ch. 61 |
| `EntityResolution` | A duplicate-resolution event preserving merged provenance. | Ch. 61 |
| `GraphCommunity` | A detected cluster of related scholarship. | Ch. 61 |
| `GraphBridge` | An entity connecting otherwise distant communities. | Ch. 61 |
| `TrustScore` | The propagated epistemic weight of an entity or relation. | Ch. 61 |
| `ConfidenceValue` | The calibrated epistemic weight attached to any output. | L5 |
| `KGIndexEntry` | An index entry over graph entities for retrieval. | Ch. 61 |

## 2.4 Semantic & reasoning entities (12)

| Entity | Description | CRIE |
|---|---|---|
| `SemanticAnnotation` | A meaning extraction over structured content. | Ch. 10 |
| `Concept` | An abstract scholarly idea (theory, phenomenon, method, construct, field). | Ch. 10 |
| `EntityMention` | A span referencing an entity in content. | Ch. 10 |
| `Embedding` | A dense representation for semantic retrieval. | Ch. 10 |
| `SemanticIndex` | The index over embeddings and annotations. | Ch. 10 |
| `ReasoningTrace` | The full, explainable record of a reasoning computation. | Ch. 11, 64 |
| `ReasoningStep` | A single step of a reasoning trace. | Ch. 64 |
| `Argument` | Premises, inference, and conclusions with evidence chains. | Ch. 11 |
| `Premise` | A premise of an argument. | Ch. 11 |
| `Conclusion` | A conclusion of an argument. | Ch. 11 |
| `EvidenceChain` | The closed chain from conclusion to evidence to source. | P3, Ch. 14 |
| `CausalModel` | A graph of cause–effect structure, separate from correlation. | Ch. 64 |

## 2.5 Documents, citations & evidence entities (12)

| Entity | Description | CRIE |
|---|---|---|
| `Document` | A provenance-bearing ingested artefact (paper, thesis, dataset, protocol). | Ch. 12 |
| `DocumentChunk` | A passage-level unit of a document. | Ch. 12 |
| `DocumentTable` | A table extracted from a document. | Ch. 12 |
| `DocumentFigure` | A figure extracted from a document. | Ch. 12 |
| `ExtractionRecord` | A record of an extraction operation with method and confidence. | Ch. 12 |
| `FormatConversion` | A conversion of a document between formats. | Ch. 12 |
| `Reference` | A resolved bibliographic identity (DOI, URL, book, etc.). | Ch. 13 |
| `Citation` | A typed citation edge with provenance. | Ch. 13 |
| `CitationContext` | The passage and claim motivating a citation edge. | Ch. 61 |
| `CitationIntent` | The purpose of a citation (support, contrast, background, method). | Ch. 61 |
| `EvidenceRecord` | The underlying support record for claims (data, experiments, observations, references). | Ch. 14 |
| `Claim` | An assertion made by a work; the unit of evidence assessment. | Ch. 14 |

## 2.6 Literature, gaps & novelty entities (10)

| Entity | Description | CRIE |
|---|---|---|
| `LiteratureSearch` | A structured search of scholarly sources. | Ch. 15 |
| `SearchQuery` | The query specification of a search. | Ch. 15 |
| `ScreeningDecision` | A screen decision over a retrieved candidate. | Ch. 15 |
| `LiteratureSummary` | A summarised body of literature with confidence and provenance. | Ch. 15 |
| `ResearchGap` | An identified gap in the literature. | Ch. 16 |
| `GapAssessment` | The assessment establishing a gap, with evidence. | Ch. 16 |
| `GapSignal` | A derived signal contributing to gap detection. | Ch. 16 |
| `NoveltyAssessment` | The assessment of novelty of a contribution. | Ch. 17 |
| `NoveltySignal` | A derived signal contributing to novelty assessment. | Ch. 17 |
| `LiteratureRecommendation` | A recommendation drawn from the literature base. | Ch. 15 |

## 2.7 Methodology, statistics & instrument entities (10)

| Entity | Description | CRIE |
|---|---|---|
| `MethodologyRecommendation` | A justified method recommendation. | Ch. 18 |
| `StudyDesign` | A chosen design with rationale. | Ch. 18 |
| `SamplingPlan` | A sampling design and rationale. | Ch. 18 |
| `StatisticalPlan` | A statistical design and analysis plan. | Ch. 21 |
| `PowerAnalysis` | A statistical power analysis. | Ch. 21 |
| `AnalysisPlan` | The operational analysis plan. | Ch. 21 |
| `AnalysisResult` | The result of an analysis, with interpretation. | Ch. 21 |
| `StatisticalReport` | A reporting-ready statistical summary. | Ch. 21 |
| `InstrumentDesign` | An instrument design with validation. | Ch. 22 |
| `PsychometricValidation` | A psychometric validation record. | Ch. 22 |

## 2.8 Ethics & integrity entities (6)

| Entity | Description | CRIE |
|---|---|---|
| `EthicsReview` | A research-ethics review support record. | Ch. 19 |
| `EthicsDecision` | A documented ethics decision or refusal. | Ch. 19 |
| `IntegrityScreening` | A screening for plagiarism, fabrication, or manipulation. | Ch. 20 |
| `PlagiarismReport` | A plagiarism detection report. | Ch. 20 |
| `IntegrityViolation` | A flagged or confirmed integrity violation. | Ch. 20 |
| `RefusalRecord` | A recorded refusal with explanation (Constitution Article X). | Ch. 70 |

## 2.9 Writing, supervision & peer review entities (10)

| Entity | Description | CRIE |
|---|---|---|
| `WritingDraft` | A draft section/artefact with provenance and citation control. | Ch. 23 |
| `WritingRevision` | A revision of a draft. | Ch. 23 |
| `StyleProfile` | A writing style profile. | Ch. 23 |
| `SupervisionRecord` | A supervision portfolio record. | Ch. 24 |
| `SupervisionFeedback` | Feedback issued within supervision. | Ch. 24 |
| `PeerReview` | A peer review with decision and comments. | Ch. 25 |
| `PeerReviewComment` | A comment within a peer review. | Ch. 25 |
| `PeerReviewDecision` | A review decision (approve, reject, major/minor revision, etc.). | Ch. 25 |
| `ReviewCycle` | A review cycle (round-agnostic; references SWTROP review cycles). | Ch. 55 |
| `ReviewRound` | A round within a review cycle. | Ch. 55 |

## 2.10 Publication, journal, conference, grant, patent & innovation entities (10)

| Entity | Description | CRIE |
|---|---|---|
| `PublicationPlan` | A publication strategy and stewardship plan. | Ch. 26 |
| `SubmissionPackage` | A submission-ready package (manuscript, cover letter, metadata). | Ch. 26 |
| `JournalProfile` | A journal profile for fit assessment. | Ch. 27 |
| `JournalMatch` | A journal fit assessment. | Ch. 27 |
| `ConferenceMatch` | A conference fit assessment. | Ch. 28 |
| `GrantOpportunity` | A funding opportunity. | Ch. 29 |
| `GrantProposal` | A proposal under development. | Ch. 29 |
| `GrantReview` | A grant review against criteria. | Ch. 29 |
| `PatentDisclosure` | A patent disclosure with patentability sensing. | Ch. 30 |
| `InnovationOpportunity` | An innovation opportunity analysis. | Ch. 31 |

## 2.11 Career, learning & mentorship entities (8)

| Entity | Description | CRIE |
|---|---|---|
| `CareerGoal` | A career goal driving career intelligence. | Ch. 32 |
| `CareerPlan` | A career plan with milestones. | Ch. 32 |
| `CareerIntelligence` | Derived career signals (opportunities, trajectories). | Ch. 32 |
| `LearningRecommendation` | A just-in-time teaching recommendation. | Ch. 33 |
| `LearnerState` | The learner's state (mastery, misconceptions, progress). | Ch. 33, 63 |
| `LearnerMastery` | Mastery per concept, with confidence calibration. | Ch. 33 |
| `MentorshipGuidance` | Scaffolding guidance for a mentoring relationship. | Ch. 34 |
| `MentoringSession` | A structured mentoring session. | Ch. 34 |

## 2.12 Decision, analytics & adaptive entities (10)

| Entity | Description | CRIE |
|---|---|---|
| `Recommendation` | A recommended next best action with justification. | Ch. 38, 65 |
| `RecommendationExplanation` | The explainable rationale of a recommendation. | Ch. 65 |
| `Prediction` | A forecast with calibrated uncertainty. | Ch. 37 |
| `Forecast` | The time-bounded statement of a prediction. | Ch. 37 |
| `Decision` | A decision with objectives, options, and rationale. | Ch. 65 |
| `DecisionOption` | A candidate option within a decision. | Ch. 65 |
| `DecisionRecord` | The recorded decision, rationale, and expected outcomes. | Ch. 65 |
| `ResearchAnalytics` | Derived research health indicators. | Ch. 36 |
| `AnalyticsIndicator` | A single derived indicator. | Ch. 36 |
| `AdaptiveProfile` | The governed, consent-based profile for adaptation. | Ch. 39 |

## 2.13 Memory & conversation entities (12)

| Entity | Description | CRIE |
|---|---|---|
| `MemoryItem` | A provenance-bearing memory record with type and access policy. | Ch. 63 |
| `MemoryType` | One of the 8 memory types (short-term, long-term, institutional, research, learner, contextual, episodic, semantic). | Ch. 63 |
| `EpisodicMemory` | Specific past experiences. | Ch. 63 |
| `SemanticMemory` | Generalised knowledge over the RKG. | Ch. 63 |
| `ShortTermMemory` | Bounded operative context of the active session. | Ch. 63 |
| `LongTermMemory` | The researcher's persistent cognitive store. | Ch. 63 |
| `InstitutionalMemory` | The institution's governed memory (IKOS). | Ch. 60, 63 |
| `ResearchMemory` | The memory of a single research project. | Ch. 63 |
| `LearnerMemory` | The learner's state and progress. | Ch. 63 |
| `ContextualMemory` | Situation-bound memory of why items were relevant. | Ch. 63 |
| `Conversation` | A conversation thread. | Ch. 41 |
| `ConversationTurn` | A single turn within a conversation. | Ch. 41 |

## 2.14 Agents & orchestration entities (10)

| Entity | Description | CRIE |
|---|---|---|
| `Agent` | A specialised, bounded-autonomy software actor. | Ch. 42, 62 |
| `AgentCharter` | The machine- and human-readable charter (mission, competence, limits, inputs, outputs, escalation). | Ch. 43, 62 |
| `AgentTask` | A task assigned to an agent. | Ch. 43 |
| `AgentExecution` | An execution record of an agent task. | Ch. 43 |
| `AutonomyEnvelope` | The declared autonomy level (L1–L5) and boundaries of an agent. | Ch. 62 |
| `OrchestrationPlan` | The task plan produced by the orchestrator. | Ch. 43 |
| `OrchestrationTask` | A task within an orchestration plan. | Ch. 43 |
| `DelegationRecord` | A recorded delegation between agents or to the researcher. | Ch. 43 |
| `Connector` | A registered external AI capability adapter. | Ch. 44 |
| `ConnectorCall` | A logged external call with purpose and data scope. | Ch. 44 |

## 2.15 Enterprise, federation & governance entities (4)

| Entity | Description | CRIE |
|---|---|---|
| `EnterpriseCognitiveModel` | The institution-level cognitive model. | Ch. 59 |
| `InstitutionalKnowledgeAsset` | A governed institutional knowledge asset (IKOS). | Ch. 60 |
| `FederationContract` | The agreement governing a federation relationship. | Ch. 66 |
| `AuditRecord` | An append-only audit record of consequential action. | Ch. 67 |

**Entity count: 150.**

## 2.16 Ownership and lifecycle rules

- **Ownership** — every entity SHALL declare a canonical owner (researcher
  username, institution, or system principal); cross-owner access is governed
  by consent and RBAC (CRIE Ch. 61, 68).
- **Lifecycle state** — graph and knowledge entities SHALL carry a lifecycle
  state (proposed, confirmed, deprecated, superseded); evidence and audit
  records SHALL be append-only (CRIE §61.2, §67).
- **Provenance by construction (P3)** — every derived record SHALL reference
  its sources, transformations, confidence, and version; no record exists
  without provenance.
- **Reference over copy** — cross-module relationships are identity
  references only (CRIE Ch. 46–58).

# Chapter 3 — Database Specification

The schema follows the repository's `db/schema.sql` conventions: PostgreSQL,
UUID primary keys, `TIMESTAMPTZ` audit fields, `TEXT`-typed enums with CHECK
constraints, canonical researcher references by `username` (via a throwing
`researcherOf` projection — CRIE conventions), and append-only tables where
evidence and provenance integrity require immutability. All tables are
**append-only** in the sense that rows are added and soft-deleted, never
physically removed; knowledge, content, and memory tables are **versioned**.
The schema is additive to `db/schema.sql` under a `crie` prefix. **One hundred
and twenty tables are specified.**

## 3.1 Cross-cutting conventions

- **Audit fields** — every table carries `created_at TIMESTAMPTZ NOT NULL
  DEFAULT NOW()` and `updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`; content,
  governance, agent, and memory tables additionally carry `created_by UUID` and
  `updated_by UUID` referencing `users(id)`.
- **Soft delete** — every table carries `deleted_at TIMESTAMPTZ`; queries
  default-filter `deleted_at IS NULL`; hard deletes are prohibited for
  provenance, evidence, audit, memory, refusal, and agent-execution rows
  (CRIE Ch. 67).
- **Versioning** — knowledge, content, and memory tables carry
  `version INTEGER NOT NULL DEFAULT 1`; every derived record references the
  exact source version in force when produced (CRIE §61.6, §63.11).
- **Canonical references** — researcher usernames/SAIDs, institution IDs,
  DOIs/ORCIDs, publication IDs, and CRIE-IDs are referenced by canonical
  identity, never duplicated (CRIE Ch. 46–58).
- **Index naming** — `idx_<table>_<column>`.

## 3.2 Tables — Group 1: Cognitive & research lifecycle

| # | Table | Purpose | Primary Key | Foreign Keys | Indexes | Constraints / Notes |
|---|---|---|---|---|---|---|
| 1 | `crie_research_entity` | Root cognitive object (project, study, thesis, paper, grant programme, patent, innovation). | `id UUID` | `owner_username`, `institution_id` (optional) | `idx_crie_entity_owner`, `idx_crie_entity_kind` | `entity_kind` check; `status` check: active, archived |
| 2 | `crie_cognitive_model` | The living cognitive model of an entity. | `id UUID` | `research_entity_id` | `idx_crie_cogmodel_entity` | one active model per entity |
| 3 | `crie_cognitive_model_version` | Versioned snapshot of a cognitive model. | `id UUID` | `cognitive_model_id` | `idx_crie_cogmodel_ver_model` | `version INT NOT NULL`; immutable |
| 4 | `crie_lifecycle_stage` | The 14 canonical stages. | `id UUID` | — | `idx_crie_lifecycle_key` | `stage_key UNIQUE`; check: idea, problem, objectives, questions, hypotheses, literature, framework, methodology, instrument, analysis, interpretation, publication, impact, preservation |
| 5 | `crie_stage_instance` | Researcher position + dwell time per entity. | `id UUID` | `research_entity_id`, `lifecycle_stage_id` | `idx_crie_stage_instance_entity` | `started_at`, `dwell_minutes`; unique active stage per entity |
| 6 | `crie_stage_transition` | Recorded stage traversals. | `id UUID` | `stage_instance_id`, `from_stage_id`, `to_stage_id` | `idx_crie_stage_transition_instance` | append-only; `transition_type` (forward, loop, revert) |
| 7 | `crie_research_question` | A question on an entity. | `id UUID` | `cognitive_model_id` | `idx_crie_question_model` | `status` check: open, answered, superseded |
| 8 | `crie_hypothesis` | A candidate hypothesis under evaluation. | `id UUID` | `cognitive_model_id`, `question_id` (optional) | `idx_crie_hypothesis_model` | `status` check: proposed, under-test, supported, refuted, unresolved |
| 9 | `crie_research_aim` | A declared aim of the entity. | `id UUID` | `cognitive_model_id` | `idx_crie_aim_model` | `aim_order INT` |
| 10 | `crie_concept_map` | Typed concept map of an entity. | `id UUID` | `cognitive_model_id` | `idx_crie_conceptmap_model` | `version INT`; `is_primary BOOLEAN` |

## 3.3 Tables — Group 2: Context, session & workspace

| # | Table | Purpose | Primary Key | Foreign Keys | Indexes | Constraints / Notes |
|---|---|---|---|---|---|---|
| 11 | `crie_context_pack` | Assembled operative context for an interaction. | `id UUID` | `research_entity_id` (optional), `session_id` (optional) | `idx_crie_contextpack_entity`, `idx_crie_contextpack_created` | `context_kind` check: micro, meso, macro, eco, platform; append-only |
| 12 | `crie_context_element` | A provenance-bearing context element. | `id UUID` | `context_pack_id` | `idx_crie_contextelement_pack` | `source_type`, `source_id`, `relevance_weight REAL`, `confidence REAL` |
| 13 | `crie_session` | A goal-directed research session. | `id UUID` | `researcher_username`, `workspace_id` | `idx_crie_session_researcher`, `idx_crie_session_created` | `status` check: active, ended, abandoned |
| 14 | `crie_session_message` | A message within a session. | `id UUID` | `session_id` | `idx_crie_sessionmsg_session` | `role` check: researcher, assistant, agent, system |
| 15 | `crie_session_goal` | The intent of a session. | `id UUID` | `session_id` | `idx_crie_sessiongoal_session` | `goal_type` |
| 16 | `crie_workspace` | The persistent research surface. | `id UUID` | `researcher_username` | `idx_crie_workspace_researcher` | one per researcher |
| 17 | `crie_workspace_pane` | A pane within a workspace. | `id UUID` | `workspace_id` | `idx_crie_workspacepane_workspace` | `pane_kind` check: documents, advisory, agents, memory, context, conversation |
| 18 | `crie_open_document` | A document open in the workspace. | `id UUID` | `workspace_id`, `document_id` | `idx_crie_opendoc_workspace` | `pane_id`; `focus_state` |
| 19 | `crie_selected_passage` | The active selection. | `id UUID` | `open_document_id` | `idx_crie_selection_doc` | `chunk_id`; `start_offset`, `end_offset` |
| 20 | `crie_session_consolidation` | A consolidation checkpoint of a session. | `id UUID` | `session_id` | `idx_crie_consolidation_session` | append-only; roll-forward of short-term memory |

## 3.4 Tables — Group 3: Knowledge Graph & RKG

| # | Table | Purpose | Primary Key | Foreign Keys | Indexes | Constraints / Notes |
|---|---|---|---|---|---|---|
| 21 | `crie_kg_graph` | The graph container (personal, institutional, global scope). | `id UUID` | `scope_type`, `scope_id` | `idx_crie_kg_graph_scope` | `scope_type` check: researcher, institution, global |
| 22 | `crie_kg_entity_class` | The 12 entity classes. | `id UUID` | — | `idx_crie_kg_class_key` | `class_key UNIQUE`; check: people, organisations, works, venues, concepts, claims, evidence, methods, grants, events, places, terms |
| 23 | `crie_kg_entity` | A typed node (CRIE-ID). | `id UUID` | `graph_id`, `entity_class_id` | `idx_crie_kg_entity_graph`, `idx_crie_kg_entity_class`, `idx_crie_kg_entity_crie_id` | `crie_id UNIQUE`; `lifecycle_state` check: proposed, confirmed, deprecated, superseded; `confidence REAL` |
| 24 | `crie_kg_relation` | A typed semantic relationship. | `id UUID` | `subject_entity_id`, `object_entity_id`, `predicate` | `idx_crie_kg_rel_subject`, `idx_crie_kg_rel_object` | `strength REAL`; `confidence REAL`; `valid_from`, `valid_to`; `predicate` typed |
| 25 | `crie_kg_provenance` | Immutable provenance for entities/relations. | `id UUID` | `subject_type`, `subject_id` | `idx_crie_kg_prov_subject` | append-only; source, actor, timestamp, method, version, basis, consent |
| 26 | `crie_kg_version` | Reproducible graph state. | `id UUID` | `graph_id` | `idx_crie_kg_version_graph` | `version INT`; snapshot metadata; supports time-travel |
| 27 | `crie_kg_resolution` | A duplicate-resolution event. | `id UUID` | `graph_id`, `kept_entity_id`, `merged_entity_id` | `idx_crie_kg_resolution_graph` | preserves provenance of both; append-only |
| 28 | `crie_kg_community` | A detected community of scholarship. | `id UUID` | `graph_id` | `idx_crie_kg_community_graph` | `detection_version`; membership derived |
| 29 | `crie_kg_bridge` | An entity bridging communities. | `id UUID` | `entity_id`, `community_a_id`, `community_b_id` | `idx_crie_kg_bridge_entity` | derived |
| 30 | `crie_kg_trust_score` | Propagated trust of an entity or relation. | `id UUID` | `subject_type`, `subject_id` | `idx_crie_kg_trust_subject` | append-only; `trust REAL`; `rule` explaining derivation |

## 3.5 Tables — Group 4: Semantic & reasoning

| # | Table | Purpose | Primary Key | Foreign Keys | Indexes | Constraints / Notes |
|---|---|---|---|---|---|---|
| 31 | `crie_semantic_annotation` | A meaning extraction over content. | `id UUID` | `document_chunk_id` (optional), `kg_entity_id` (optional) | `idx_crie_annotation_chunk`, `idx_crie_annotation_entity` | `annotation_type`; `confidence REAL` |
| 32 | `crie_concept` | An abstract scholarly idea. | `id UUID` | — | `idx_crie_concept_key` | `concept_key UNIQUE`; `definition TEXT` |
| 33 | `crie_entity_mention` | A span referencing an entity. | `id UUID` | `document_chunk_id`, `kg_entity_id` | `idx_crie_mention_chunk`, `idx_crie_mention_entity` | `start_offset`, `end_offset` |
| 34 | `crie_embedding` | A dense representation. | `id UUID` | `subject_type`, `subject_id` | `idx_crie_embedding_subject` | `model`, `dimension`, `vector` (vector type) |
| 35 | `crie_semantic_index` | The index over annotations/embeddings. | `id UUID` | `graph_id` | `idx_crie_semindex_graph` | `index_kind`; refreshable, never authoritative |
| 36 | `crie_reasoning_trace` | Full explainable record of a reasoning computation. | `id UUID` | `research_entity_id`, `session_id` (optional) | `idx_crie_trace_entity` | append-only; `paradigm` |
| 37 | `crie_reasoning_step` | A step of a reasoning trace. | `id UUID` | `reasoning_trace_id` | `idx_crie_step_trace` | `step_order INT`; `step_type`; `confidence REAL` |
| 38 | `crie_argument` | Premises, inference, and conclusions. | `id UUID` | `reasoning_trace_id` (optional) | `idx_crie_argument_trace` | `argument_type` |
| 39 | `crie_argument_premise` | A premise of an argument. | `id UUID` | `argument_id` | `idx_crie_premise_argument` | `evidence_chain_id` optional |
| 40 | `crie_causal_model` | A graph of cause–effect structure. | `id UUID` | `research_entity_id` | `idx_crie_causal_entity` | `version INT`; separate from correlation |

## 3.6 Tables — Group 5: Documents, citations & evidence

| # | Table | Purpose | Primary Key | Foreign Keys | Indexes | Constraints / Notes |
|---|---|---|---|---|---|---|
| 41 | `crie_document` | A provenance-bearing ingested artefact. | `id UUID` | `owner_username`, `research_entity_id` (optional) | `idx_crie_doc_owner`, `idx_crie_doc_entity` | `doc_kind` check: paper, thesis, dataset, protocol, grant, patent, book, code, note; `format` |
| 42 | `crie_document_chunk` | A passage-level unit. | `id UUID` | `document_id` | `idx_crie_chunk_doc`, `idx_crie_chunk_position` | `position INT`; `content TEXT`; `source_version INT` |
| 43 | `crie_document_table` | An extracted table. | `id UUID` | `document_id`, `chunk_id` (optional) | `idx_crie_table_doc` | `caption`, `structure JSONB` |
| 44 | `crie_document_figure` | An extracted figure. | `id UUID` | `document_id`, `chunk_id` (optional) | `idx_crie_figure_doc` | `caption`, `figure_type` |
| 45 | `crie_extraction_record` | A record of an extraction operation. | `id UUID` | `document_id` | `idx_crie_extraction_doc` | append-only; `method`, `confidence REAL` |
| 46 | `crie_reference` | A resolved bibliographic identity. | `id UUID` | — | `idx_crie_reference_doi`, `idx_crie_reference_key` | `doi UNIQUE` (optional), `identifier_kind` check: doi, orcid, url, isbn, handle |
| 47 | `crie_citation` | A typed citation edge. | `id UUID` | `citing_document_id`, `reference_id` | `idx_crie_citation_citing`, `idx_crie_citation_ref` | `citation_style`; `confidence REAL` |
| 48 | `crie_citation_context` | The passage/claim motivating a citation. | `id UUID` | `citation_id`, `chunk_id` | `idx_crie_citcontext_citation` | `intent` check: support, contrast, background, method, extension |
| 49 | `crie_evidence_record` | The underlying support record (data, experiment, observation, reference). | `id UUID` | `document_id` (optional), `research_entity_id` (optional) | `idx_crie_evidence_entity` | `evidence_type`; append-only; `confidence REAL` |
| 50 | `crie_claim` | An assertion made by a work. | `id UUID` | `document_chunk_id`, `kg_entity_id` (optional) | `idx_crie_claim_chunk`, `idx_crie_claim_entity` | `claim_type`; `confidence REAL`; `lifecycle_state` |

## 3.7 Tables — Group 6: Evidence assessment, literature, gaps & novelty

| # | Table | Purpose | Primary Key | Foreign Keys | Indexes | Constraints / Notes |
|---|---|---|---|---|---|---|
| 51 | `crie_evidence_assessment` | Assessment of a claim's evidence. | `id UUID` | `claim_id`, `evidence_record_id` | `idx_crie_evidassess_claim`, `idx_crie_evidassess_evidence` | `assessment` check: supports, contradicts, neutral, refutes; `strength REAL` |
| 52 | `crie_contradiction` | A surfaced contradiction between claims. | `id UUID` | `claim_a_id`, `claim_b_id` | `idx_crie_contradiction_a`, `idx_crie_contradiction_b` | `severity`; `resolution_state`; append-only |
| 53 | `crie_literature_search` | A structured search of scholarly sources. | `id UUID` | `researcher_username`, `research_entity_id` (optional) | `idx_crie_litsearch_researcher` | `status` check: planned, running, complete |
| 54 | `crie_search_query` | The query specification of a search. | `id UUID` | `literature_search_id` | `idx_crie_searchquery_search` | `query_text`, `filters JSONB` |
| 55 | `crie_screening_decision` | A screen decision over a candidate. | `id UUID` | `literature_search_id`, `document_id` | `idx_crie_screen_search` | `decision` check: include, exclude, pending; `rationale` |
| 56 | `crie_literature_summary` | A summarised body of literature. | `id UUID` | `literature_search_id` | `idx_crie_litsummary_search` | `confidence REAL`; `provenance JSONB` |
| 57 | `crie_research_gap` | An identified gap. | `id UUID` | `research_entity_id` (optional) | `idx_crie_gap_entity` | `gap_type`; `status` |
| 58 | `crie_gap_assessment` | The evidence-backed assessment of a gap. | `id UUID` | `research_gap_id` | `idx_crie_gapassess_gap` | `strength REAL`; `confidence REAL` |
| 59 | `crie_novelty_assessment` | The assessment of novelty of a contribution. | `id UUID` | `research_entity_id`, `document_id` (optional) | `idx_crie_novelty_entity` | `novelty_score REAL`; `confidence REAL` |
| 60 | `crie_literature_recommendation` | A recommendation drawn from literature. | `id UUID` | `literature_search_id`, `research_entity_id` | `idx_crie_litrec_search` | `recommendation_kind` |

## 3.8 Tables — Group 7: Methodology, statistics & instruments

| # | Table | Purpose | Primary Key | Foreign Keys | Indexes | Constraints / Notes |
|---|---|---|---|---|---|---|
| 61 | `crie_methodology_recommendation` | A justified method recommendation. | `id UUID` | `research_entity_id`, `research_question_id` (optional) | `idx_crie_methodrec_entity` | `confidence REAL`; `rationale` |
| 62 | `crie_study_design` | A chosen study design with rationale. | `id UUID` | `research_entity_id` | `idx_crie_design_entity` | `design_type`; `version INT` |
| 63 | `crie_sampling_plan` | Sampling design and rationale. | `id UUID` | `study_design_id` | `idx_crie_sampling_design` | `sampling_method`; `target_size INT` |
| 64 | `crie_statistical_plan` | Statistical design and analysis plan. | `id UUID` | `study_design_id` | `idx_crie_statplan_design` | `analysis_method`; `assumptions JSONB` |
| 65 | `crie_power_analysis` | A statistical power analysis. | `id UUID` | `statistical_plan_id` | `idx_crie_power_statplan` | `effect_size`, `alpha`, `power REAL` |
| 66 | `crie_analysis_plan` | The operational analysis plan. | `id UUID` | `statistical_plan_id` | `idx_crie_analysisplan_statplan` | `steps JSONB` |
| 67 | `crie_analysis_result` | The result of an analysis. | `id UUID` | `analysis_plan_id`, `dataset_id` (optional) | `idx_crie_analysisresult_plan` | `result JSONB`; `interpretation` |
| 68 | `crie_statistical_report` | A reporting-ready statistical summary. | `id UUID` | `analysis_result_id` | `idx_crie_statreport_result` | `report_format`; `confidence REAL` |
| 69 | `crie_instrument_design` | An instrument design. | `id UUID` | `research_entity_id` | `idx_crie_instrument_entity` | `instrument_type`; `version INT` |
| 70 | `crie_psychometric_validation` | A psychometric validation record. | `id UUID` | `instrument_design_id` | `idx_crie_psycho_instrument` | `reliability REAL`; `validity JSONB` |

## 3.9 Tables — Group 8: Ethics, integrity, writing, supervision & peer review

| # | Table | Purpose | Primary Key | Foreign Keys | Indexes | Constraints / Notes |
|---|---|---|---|---|---|---|
| 71 | `crie_ethics_review` | A research-ethics review support record. | `id UUID` | `research_entity_id` | `idx_crie_ethics_entity` | `review_kind`; `status` check: in-progress, submitted, approved, rejected |
| 72 | `crie_ethics_decision` | A documented ethics decision or refusal. | `id UUID` | `ethics_review_id` | `idx_crie_ethicsdec_review` | append-only; `decision`; `rationale` |
| 73 | `crie_integrity_screening` | A screening for plagiarism, fabrication, or manipulation. | `id UUID` | `document_id` | `idx_crie_integrity_doc` | `screen_type`; `status`; append-only |
| 74 | `crie_plagiarism_report` | A plagiarism detection report. | `id UUID` | `integrity_screening_id` | `idx_crie_plagiarism_screen` | `similarity_score REAL`; `report JSONB` |
| 75 | `crie_writing_draft` | A draft section/artefact with citation control. | `id UUID` | `document_id` (optional), `research_entity_id` | `idx_crie_draft_entity` | `draft_type`; `word_count INT`; `version INT` |
| 76 | `crie_writing_revision` | A revision of a draft. | `id UUID` | `writing_draft_id` | `idx_crie_revision_draft` | append-only; `revision_order INT` |
| 77 | `crie_supervision_record` | A supervision portfolio record. | `id UUID` | `supervisor_username`, `research_entity_id` | `idx_crie_supervision_supervisor` | `status` |
| 78 | `crie_supervision_feedback` | Feedback issued within supervision. | `id UUID` | `supervision_record_id` | `idx_crie_supfeed_record` | `feedback_type`; append-only |
| 79 | `crie_peer_review` | A peer review with decision and comments. | `id UUID` | `reviewer_username`, `document_id` | `idx_crie_peerreview_reviewer`, `idx_crie_peerreview_doc` | `decision`; `status` |
| 80 | `crie_peer_review_comment` | A comment within a peer review. | `id UUID` | `peer_review_id`, `parent_comment_id` (optional) | `idx_crie_prcomment_review` | `comment_type` check: general, inline, summary, reply |

## 3.10 Tables — Group 9: Publication, journal, conference, grant, patent & innovation

| # | Table | Purpose | Primary Key | Foreign Keys | Indexes | Constraints / Notes |
|---|---|---|---|---|---|---|
| 81 | `crie_publication_plan` | A publication strategy and stewardship plan. | `id UUID` | `research_entity_id` | `idx_crie_pubplan_entity` | `target_type`; `status` |
| 82 | `crie_submission_package` | A submission-ready package. | `id UUID` | `publication_plan_id` | `idx_crie_submission_plan` | `package_status`; `readiness JSONB` |
| 83 | `crie_journal_profile` | A journal profile for fit assessment. | `id UUID` | `journal_id` (canonical reference) | `idx_crie_journal_profile_journal` | `scope`, `metrics JSONB` |
| 84 | `crie_journal_match` | A journal fit assessment. | `id UUID` | `publication_plan_id`, `journal_profile_id` | `idx_crie_journalmatch_plan` | `fit_score REAL`; `confidence REAL`; `rationale` |
| 85 | `crie_conference_match` | A conference fit assessment. | `id UUID` | `research_entity_id`, `conference_id` | `idx_crie_confmatch_entity` | `fit_score REAL`; `rationale` |
| 86 | `crie_grant_opportunity` | A funding opportunity. | `id UUID` | — | `idx_crie_grantopp_funder`, `idx_crie_grantopp_deadline` | `funder`; `deadline TIMESTAMPTZ`; `status` |
| 87 | `crie_grant_proposal` | A proposal under development. | `id UUID` | `research_entity_id`, `grant_opportunity_id` | `idx_crie_grantprop_entity`, `idx_crie_grantprop_opp` | `proposal_status`; `readiness` |
| 88 | `crie_grant_review` | A grant review against criteria. | `id UUID` | `grant_proposal_id`, `reviewer_username` | `idx_crie_grantreview_proposal` | `criteria JSONB`; `decision` |
| 89 | `crie_patent_disclosure` | A patent disclosure with patentability sensing. | `id UUID` | `research_entity_id` | `idx_crie_patent_entity` | `disclosure_status`; `patentability JSONB` |
| 90 | `crie_innovation_opportunity` | An innovation opportunity analysis. | `id UUID` | `research_entity_id` | `idx_crie_innovation_entity` | `opportunity_type`; `score REAL` |

## 3.11 Tables — Group 10: Career, learning, mentorship, decision & analytics

| # | Table | Purpose | Primary Key | Foreign Keys | Indexes | Constraints / Notes |
|---|---|---|---|---|---|---|
| 91 | `crie_career_goal` | A career goal. | `id UUID` | `researcher_username` | `idx_crie_careergoal_researcher` | `goal_status` |
| 92 | `crie_career_plan` | A career plan with milestones. | `id UUID` | `career_goal_id` | `idx_crie_careerplan_goal` | `plan_status` |
| 93 | `crie_career_intelligence` | Derived career signals. | `id UUID` | `researcher_username` | `idx_crie_careerintel_researcher` | derived; never authoritative |
| 94 | `crie_learning_recommendation` | A just-in-time teaching recommendation. | `id UUID` | `researcher_username`, `learning_object_id` (optional) | `idx_crie_learnrec_researcher` | `recommendation_kind`; `reason_evidence JSONB` |
| 95 | `crie_learner_state` | The learner's state (references SLE learner memory). | `id UUID` | `researcher_username` | `idx_crie_learnerstate_researcher` | reference-only; derived |
| 96 | `crie_mentorship_guidance` | Scaffolding for a mentoring relationship. | `id UUID` | `mentor_username`, `mentee_username` | `idx_crie_mentorguid_mentor` | reference-only; `guidance_kind` |
| 97 | `crie_research_analytics` | Derived research health indicators. | `id UUID` | `scope_type`, `scope_id` | `idx_crie_analytics_scope` | explicitly cached; never authoritative (CRIE §59) |
| 98 | `crie_analytics_indicator` | A single derived indicator. | `id UUID` | `research_analytics_id` | `idx_crie_indicator_analytics` | `indicator_key`; `value REAL`; `confidence REAL` |
| 99 | `crie_predictive_model` | A registered predictive model. | `id UUID` | `owner_username` | `idx_crie_predmodel_owner` | `model_kind`; `version INT`; `evaluation JSONB` |
| 100 | `crie_prediction` | A forecast with calibrated uncertainty. | `id UUID` | `predictive_model_id`, `research_entity_id` (optional) | `idx_crie_prediction_model` | `horizon`, `inputs JSONB`, `uncertainty REAL`; append-only |

## 3.12 Tables — Group 11: Recommendation, adaptive, memory, conversation, agents & orchestration

| # | Table | Purpose | Primary Key | Foreign Keys | Indexes | Constraints / Notes |
|---|---|---|---|---|---|---|
| 101 | `crie_recommendation` | A recommended next best action. | `id UUID` | `researcher_username`, `research_entity_id` (optional) | `idx_crie_recommendation_researcher` | `recommendation_kind`; `status`; `confidence REAL` |
| 102 | `crie_recommendation_explanation` | The explainable rationale of a recommendation. | `id UUID` | `recommendation_id` | `idx_crie_recexp_recommendation` | `reason_evidence JSONB`; append-only |
| 103 | `crie_adaptive_profile` | The governed, consent-based profile. | `id UUID` | `researcher_username` | `idx_crie_adaptive_researcher` | consent-gated; `version INT` |
| 104 | `crie_memory_item` | A provenance-bearing memory record. | `id UUID` | `researcher_username`, `memory_type_id` | `idx_crie_memoryitem_researcher`, `idx_crie_memoryitem_type` | `access_policy`; `version INT`; `expires_at` |
| 105 | `crie_memory_type` | The 8 memory types. | `id UUID` | — | `idx_crie_memorytype_key` | `type_key UNIQUE`; check: short-term, long-term, institutional, research, learner, contextual, episodic, semantic |
| 106 | `crie_conversation` | A conversation thread. | `id UUID` | `researcher_username`, `session_id` (optional) | `idx_crie_conversation_researcher` | `conversation_kind` |
| 107 | `crie_conversation_turn` | A single turn within a conversation. | `id UUID` | `conversation_id` | `idx_crie_turn_conversation` | `role`; `content`; append-only |
| 108 | `crie_agent` | A bounded-autonomy software actor. | `id UUID` | — | `idx_crie_agent_id` | `agent_id` check via AG-/ARA- vocabulary; `status` |
| 109 | `crie_agent_charter` | The machine- and human-readable charter. | `id UUID` | `agent_id` | `idx_crie_charter_agent` | `mission`, `competence`, `limits`, `escalation`; `version INT` |
| 110 | `crie_orchestration_plan` | The task plan produced by the orchestrator. | `id UUID` | `researcher_username`, `session_id` (optional) | `idx_crie_orchplan_researcher` | `status`; `budget JSONB` |

## 3.13 Tables — Group 12: Orchestration tasks, connectors, enterprise, federation, governance & audit

| # | Table | Purpose | Primary Key | Foreign Keys | Indexes | Constraints / Notes |
|---|---|---|---|---|---|---|
| 111 | `crie_orchestration_task` | A task within an orchestration plan. | `id UUID` | `orchestration_plan_id`, `agent_id` (optional) | `idx_crie_orchtask_plan`, `idx_crie_orchtask_agent` | `task_status`; `priority`; `parent_task_id` optional |
| 112 | `crie_connector` | A registered external AI capability adapter. | `id UUID` | — | `idx_crie_connector_capability` | `capability`; `risk_class`; `status`; provider-neutral |
| 113 | `crie_connector_call` | A logged external call. | `id UUID` | `connector_id`, `researcher_username` | `idx_crie_conncall_connector` | append-only; `purpose`; `data_scope JSONB` |
| 114 | `crie_institutional_knowledge_asset` | A governed institutional knowledge asset (IKOS). | `id UUID` | `institution_id` | `idx_crie_asset_institution` | `asset_kind`; `access_class`; `version INT` |
| 115 | `crie_enterprise_cognitive_model` | The institution-level cognitive model. | `id UUID` | `institution_id` | `idx_crie_ecm_institution` | `version INT` |
| 116 | `crie_federation_contract` | The agreement governing a federation relationship. | `id UUID` | `institution_id`, `member_institution_id` | `idx_crie_fedcontract_institution` | `contract_type`; `status` |
| 117 | `crie_federation_exchange` | A governed federation exchange. | `id UUID` | `federation_contract_id` | `idx_crie_fedexchange_contract` | append-only; `exchange_type`; `consent_scope JSONB` |
| 118 | `crie_audit_record` | An append-only audit record of consequential action. | `id UUID` | `researcher_username` (optional), `actor_type` | `idx_crie_audit_actor`, `idx_crie_audit_created` | append-only; `event_type`; `payload JSONB` |
| 119 | `crie_refusal_record` | A recorded refusal with explanation. | `id UUID` | `researcher_username`, `requesting_agent_id` (optional) | `idx_crie_refusal_researcher` | append-only; `refusal_reason` |
| 120 | `crie_consent_record` | A consent record governing data use. | `id UUID` | `researcher_username` | `idx_crie_consent_researcher` | append-only; `consent_scope`; `revocable BOOLEAN` |

**Table count: 120.**

## 3.14 Relationship summary

- **Cognitive spine** — `crie_research_entity → crie_cognitive_model →
  crie_cognitive_model_version`; `crie_lifecycle_stage →
  crie_stage_instance → crie_stage_transition`.
- **Knowledge graph** — `crie_kg_graph → crie_kg_entity`,
  `crie_kg_relation`, `crie_kg_provenance`, `crie_kg_version`,
  `crie_kg_trust_score`; classes via `crie_kg_entity_class`.
- **Evidence web** — `crie_claim ↔ crie_evidence_record` through
  `crie_evidence_assessment`; `crie_contradiction` links conflicting claims.
- **Reasoning** — `crie_reasoning_trace → crie_reasoning_step`;
  `crie_argument → crie_argument_premise`; `crie_evidence_chain`
  closes the provenance loop (P3).
- **Agents** — `crie_agent → crie_agent_charter`; `crie_orchestration_plan →
  crie_orchestration_task`; `crie_connector → crie_connector_call`.
- **Governance** — `crie_audit_record`, `crie_refusal_record`,
  `crie_consent_record` bound by subject; nothing consequential is unlogged.

All derived counts, scores, and aggregates are **computed by the engines, never
stored** (CRIE §36, §59; SADR-006).

# Chapter 4 — TypeScript Domain Model

Types live in `types/crie/*.ts` (split by domain: `types/crie/cognitive.ts`,
`types/crie/kg.ts`, `types/crie/evidence.ts`, `types/crie/memory.ts`,
`types/crie/agents.ts`, `types/crie/decision.ts`, `types/crie/analytics.ts`,
`types/crie/orchestration.ts`, plus `types/crie.ts` as the explicit barrel),
following the module conventions of `types/communities.ts` and
`types/workflows.ts`. All interfaces are **composition-based**, with inheritance
shown explicitly. No interface SHALL reach into another module's internals
(P4, P5).

## 4.1 Reusable base models

```ts
/** Stable CRIE graph identifier (CRIE-ID) — never duplicated. */
interface CrieIdRef {
  crieId: string;
  entityClass: KGEntityClass;
}

/** Canonical researcher reference — never duplicated. */
interface ResearcherRef {
  username: string;          // canonical researcher username (SAID)
  name?: string;
  avatarUrl?: string;
}

/** Shared audit fields (mirrors db/schema.sql). */
interface Auditable {
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

/** Soft-deletable + versioned record. */
interface Versioned {
  version: number;           // default 1
  deletedAt?: string | null; // soft delete
}

/** Provenance by construction (P3). */
interface ProvenanceRef {
  sourceType: string;        // document, dataset, system, human, agent
  sourceId: string;
  actorUsername?: string;
  assertedAt: string;
  method: 'extraction' | 'inference' | 'human-curation';
  version: number;
}

/** Calibrated epistemic weight (P11, L5). */
interface ConfidenceScore {
  value: number;             // 0..1 calibrated
  band: ConfidenceBand;
  basis?: string;            // provenance pointer
}

type ConfidenceBand =
  | 'very-low' | 'low' | 'medium' | 'high' | 'very-high';

/** Canonical lifecycle state of knowledge entities. */
type EntityLifecycleState =
  | 'proposed' | 'confirmed' | 'deprecated' | 'superseded';
```

## 4.2 Cognitive & research types (inheritance)

```ts
/** Root cognitive object (CRIE Ch. 3). */
interface ResearchEntity extends Auditable, Versioned {
  id: string;
  kind: 'project' | 'study' | 'thesis' | 'paper' | 'grant-programme'
    | 'patent' | 'innovation';
  owner: ResearcherRef;
  title: string;
  model: ResearchCognitiveModel;      // composition
}

interface ResearchCognitiveModel extends Auditable, Versioned {
  id: string;
  researchEntityId: string;
  stage: LifecycleStageId;
  questions: ResearchQuestion[];
  hypotheses: Hypothesis[];
  aims: ResearchAim[];
  conceptMap: ConceptMap;
  statusVector: StatusVector;
}

/** The 14 canonical lifecycle stages (CRIE Ch. 8). */
type LifecycleStageId =
  | 'idea' | 'problem' | 'objectives' | 'questions' | 'hypotheses'
  | 'literature' | 'framework' | 'methodology' | 'instrument'
  | 'analysis' | 'interpretation' | 'publication' | 'impact'
  | 'preservation';

interface StageInstance {
  lifecycleStageId: LifecycleStageId;
  startedAt: string;
  dwellMinutes?: number;
}

interface StageTransition extends Auditable {
  from: LifecycleStageId;
  to: LifecycleStageId;
  transitionType: 'forward' | 'loop' | 'revert';
}

interface ResearchQuestion extends Auditable {
  id: string;
  text: string;
  status: 'open' | 'answered' | 'superseded';
}

interface Hypothesis extends Auditable, Versioned {
  id: string;
  statement: string;
  questionId?: string;
  status: 'proposed' | 'under-test' | 'supported' | 'refuted' | 'unresolved';
  evidenceChains: EvidenceChain[];     // composition
}

interface ConceptMap {
  id: string;
  nodes: ConceptMapNode[];
  edges: ConceptMapEdge[];
}

interface ConceptMapNode { id: string; label: string; conceptId?: string; }
interface ConceptMapEdge {
  id: string;
  from: string;                        // node id
  to: string;
  relation: string;
}

interface ResearchPlan extends Auditable, Versioned {
  id: string;
  researchEntityId: string;
  goals: ResearchGoal[];
  milestones: ResearchMilestone[];
  timeline: ResearchTimeline;
}

interface ResearchGoal { id: string; statement: string; }
interface ResearchMilestone { id: string; lifecycleStageId: LifecycleStageId; status: 'planned' | 'in-progress' | 'achieved' | 'missed'; }
interface ResearchTimeline { items: TimelineEntry[]; }
interface TimelineEntry { milestoneId: string; estimate: string; actual?: string; }
```

## 4.3 Knowledge Graph & semantic types

```ts
/** The 12 RKG entity classes (CRIE §61.2). */
type KGEntityClass =
  | 'people' | 'organisations' | 'works' | 'venues' | 'concepts'
  | 'claims' | 'evidence' | 'methods' | 'grants' | 'events'
  | 'places' | 'terms';

interface KGEntity extends Auditable, Versioned {
  id: string;
  crieId: string;                      // stable CRIE-ID
  entityClass: KGEntityClass;
  attributes: Record<string, unknown>;
  provenance: ProvenanceRef[];
  confidence: ConfidenceScore;
  lifecycleState: EntityLifecycleState;
}

type KGRelationPredicate =
  | 'authored' | 'co-authored' | 'edited' | 'compiled' | 'supervised'
  | 'published-in' | 'part-of' | 'chapter-of' | 'volume-of'
  | 'cites' | 'is-cited-by' | 'references' | 'is-referenced-by'
  | 'supports' | 'contradicts' | 'is-evidence-for' | 'is-evidence-against'
  | 'refutes' | 'is-a' | 'instance-of' | 'subsumes' | 'related-to'
  | 'analogous-to' | 'uses-method' | 'employs-instrument' | 'applies-analysis'
  | 'affiliated-with' | 'employed-by' | 'member-of' | 'funded-by'
  | 'preceded-by' | 'followed-by' | 'concurrent-with' | 'predates'
  | 'influenced' | 'builds-on' | 'extends' | 'replicates'
  | 'governed-by' | 'operated-by' | 'hosted-by';

interface KGRelation extends Auditable, Versioned {
  id: string;
  subject: CrieIdRef;
  object: CrieIdRef;
  predicate: KGRelationPredicate;
  strength: number;                    // 0..1
  confidence: ConfidenceScore;
  provenance: ProvenanceRef;
  validFrom?: string;
  validTo?: string;
}

interface KGProvenance {
  source: string;                      // work, dataset, or system
  actor: string;
  timestamp: string;
  method: 'extraction' | 'inference' | 'human-curation';
  sourceVersion: number;
  basis?: string;                      // evidence record id
  consentClass: string;                // access class
}

interface EntityResolution extends Auditable {
  keptEntity: CrieIdRef;
  mergedEntities: CrieIdRef[];
  rationale: string;
}

interface SemanticAnnotation extends Auditable {
  id: string;
  chunkId: string;
  annotationType: string;
  entityRef?: CrieIdRef;
  confidence: ConfidenceScore;
}
```

## 4.4 Reasoning, evidence & document types

```ts
/** Six reasoning paradigms (CRIE Ch. 64). */
type ReasoningParadigm =
  | 'symbolic' | 'probabilistic' | 'causal' | 'graph'
  | 'educational' | 'research';

interface ReasoningTrace extends Auditable {
  id: string;
  researchEntityId: string;
  paradigm: ReasoningParadigm;
  steps: ReasoningStep[];
  conclusion?: Conclusion;
  confidence: ConfidenceScore;
}

interface ReasoningStep {
  order: number;
  stepType: 'premise' | 'inference' | 'evidence-lookup' | 'validation';
  detail: string;
  evidenceChainIds: string[];
}

interface Argument extends Auditable {
  id: string;
  premises: Premise[];
  conclusion: Conclusion;
  chain: EvidenceChain[];
}

interface Premise { id: string; statement: string; source?: string; }
interface Conclusion { id: string; statement: string; confidence: ConfidenceScore; }

/** Closed chain from conclusion to evidence to source (P3). */
interface EvidenceChain {
  id: string;
  links: { step: string; evidenceRecordId: string; sourceId: string }[];
}

interface Document extends Auditable, Versioned {
  id: string;
  owner: ResearcherRef;
  kind: 'paper' | 'thesis' | 'dataset' | 'protocol' | 'grant' | 'patent'
    | 'book' | 'code' | 'note';
  title: string;
  format: string;
  chunks: DocumentChunk[];
  extraction: ExtractionRecord[];
}

interface DocumentChunk {
  id: string;
  documentId: string;
  position: number;
  content: string;
  sourceVersion: number;
}

interface ExtractionRecord extends Auditable {
  id: string;
  documentId: string;
  method: string;
  confidence: ConfidenceScore;
}

interface Claim extends Auditable, Versioned {
  id: string;
  documentChunkId?: string;
  entityRef?: CrieIdRef;
  claimType: string;
  statement: string;
  confidence: ConfidenceScore;
  lifecycleState: EntityLifecycleState;
}

interface EvidenceRecord extends Auditable, Versioned {
  id: string;
  evidenceType: 'data' | 'experiment' | 'observation' | 'reference';
  summary: string;
  provenance: ProvenanceRef;
  confidence: ConfidenceScore;
}

interface EvidenceAssessment {
  claimId: string;
  evidenceRecordId: string;
  assessment: 'supports' | 'contradicts' | 'neutral' | 'refutes';
  strength: number;
}

interface Contradiction extends Auditable {
  id: string;
  claimA: string;
  claimB: string;
  severity: 'minor' | 'major' | 'critical';
  resolutionState: 'open' | 'reconciled' | 'resolved';
}
```

## 4.5 Memory types

```ts
/** The 8 memory types (CRIE Ch. 63). */
type MemoryTypeId =
  | 'short-term' | 'long-term' | 'institutional' | 'research'
  | 'learner' | 'contextual' | 'episodic' | 'semantic';

interface MemoryItem extends Auditable, Versioned {
  id: string;
  owner: ResearcherRef;
  memoryType: MemoryTypeId;
  content: string;
  provenance: ProvenanceRef;
  accessPolicy: string;
  relevance?: number;
  expiresAt?: string;                  // retention policy
}

interface MemoryQuery {
  memoryType?: MemoryTypeId;
  semanticFilter?: string;
  episodicWindow?: { from: string; to: string };
  context?: ContextPackRef;
  limit: number;
}

interface ConsolidationEvent extends Auditable {
  id: string;
  fromType: 'episodic' | 'short-term';
  toType: 'semantic' | 'long-term';
  memoryItemIds: string[];
  rule: string;                        // explainable
}
```

## 4.6 Agent & orchestration types

```ts
/** Autonomy levels (CRIE §62.6). */
type AutonomyLevel =
  | 'L1-assist' | 'L2-advise' | 'L3-execute-checkpoint'
  | 'L4-execute-bounded' | 'L5-autonomous';

/** Agent identifiers — AG-01…AG-36 (Ch. 43) and ARA-01…ARA-12 (Ch. 62). */
type AgentId =
  | 'AG-01' | 'AG-02' | 'AG-03' | 'AG-04' | 'AG-05' | 'AG-06' | 'AG-07'
  | 'AG-08' | 'AG-09' | 'AG-10' | 'AG-11' | 'AG-12' | 'AG-13' | 'AG-14'
  | 'AG-15' | 'AG-16' | 'AG-17' | 'AG-18' | 'AG-19' | 'AG-20' | 'AG-21'
  | 'AG-22' | 'AG-23' | 'AG-24' | 'AG-25' | 'AG-26' | 'AG-27' | 'AG-28'
  | 'AG-29' | 'AG-30' | 'AG-31' | 'AG-32' | 'AG-33' | 'AG-34' | 'AG-35'
  | 'AG-36' | 'ARA-01' | 'ARA-02' | 'ARA-03' | 'ARA-04' | 'ARA-05'
  | 'ARA-06' | 'ARA-07' | 'ARA-08' | 'ARA-09' | 'ARA-10' | 'ARA-11'
  | 'ARA-12';

interface Agent extends Auditable {
  id: AgentId;
  name: string;
  charter: AgentCharter;
  autonomyLevel: AutonomyLevel;
  status: 'provisioned' | 'authorised' | 'active' | 'paused' | 'retired';
  sharedMemory: MemoryAccess;          // what it may read/write
}

interface AgentCharter {
  mission: string;
  competence: string[];
  limits: string[];                    // declared boundaries
  inputs: string[];
  outputs: string[];
  escalation: string;                  // escalation path
  policies: string[];                  // policy references
}

interface AgentTask extends Auditable {
  id: string;
  agentId: AgentId;
  orchestrationPlanId?: string;
  status: 'pending' | 'running' | 'checkpoint' | 'complete' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  result?: unknown;
  provenance: ProvenanceRef;
}

interface OrchestrationPlan extends Auditable, Versioned {
  id: string;
  owner: ResearcherRef;
  intent: string;
  tasks: OrchestrationTask[];
  status: 'planned' | 'authorised' | 'executing' | 'verifying' | 'complete';
  budgets: { tokens?: number; timeMin?: number; cost?: number };
}

interface OrchestrationTask {
  id: string;
  agentId?: AgentId;
  service?: string;
  step: string;
  dependencyIds: string[];
  requiresApproval: boolean;           // human-in-the-loop gates
  status: 'pending' | 'running' | 'awaiting-approval' | 'done' | 'failed';
}
```

## 4.7 Decision & analytics types

```ts
/** Five DI capability groups (CRIE Ch. 65). */
type DecisionCapability =
  | 'recommendation' | 'optimisation' | 'prediction' | 'planning'
  | 'institutional-decision-support';

interface Recommendation extends Auditable, Versioned {
  id: string;
  owner: ResearcherRef;
  kind: DecisionCapability;
  target: string;
  explanation: RecommendationExplanation;
  confidence: ConfidenceScore;
  status: 'proposed' | 'accepted' | 'dismissed' | 'overridden';
}

interface RecommendationExplanation {
  reasons: string[];
  alternatives: string[];
  evidenceChainIds: string[];
  tradeoffs: string[];
}

interface Prediction extends Auditable {
  id: string;
  modelId: string;
  horizon: string;
  inputs: Record<string, unknown>;
  outcome?: unknown;
  uncertainty: ConfidenceScore;
  counterfactual?: Record<string, unknown>;
}

interface Decision extends Auditable, Versioned {
  id: string;
  authority: ResearcherRef;            // the accountable human (Article VIII)
  frame: string;
  objectives: string[];
  constraints: string[];
  options: DecisionOption[];
  decisionRecord: DecisionRecord;
}

interface DecisionOption { id: string; description: string; score: number; tradeoffs: string[]; }
interface DecisionRecord { chosenOptionId: string; rationale: string; expectedOutcomes: string[]; trackedOutcome?: string; }

interface ResearchAnalytics {
  scope: 'researcher' | 'project' | 'institution' | 'enterprise' | 'global';
  scopeId: string;
  indicators: AnalyticsIndicator[];
  generatedAt: string;
}

interface AnalyticsIndicator { key: string; value: number; confidence: ConfidenceScore; evidenceVersion: number; }

interface AdaptiveProfile extends Auditable, Versioned {
  id: string;
  owner: ResearcherRef;
  preferences: Record<string, unknown>;   // consent-gated (P9, P10)
  consentScope: string[];
}
```

## 4.8 Vocabulary unions & DTO contracts

```ts
/** Vocabulary constants mirror placeholder constants (no duplication). */
const LIFECYCLE_STAGE_IDS: readonly LifecycleStageId[] = [
  'idea', 'problem', 'objectives', 'questions', 'hypotheses', 'literature',
  'framework', 'methodology', 'instrument', 'analysis', 'interpretation',
  'publication', 'impact', 'preservation'
];
const KG_ENTITY_CLASSES: readonly KGEntityClass[] = [
  'people', 'organisations', 'works', 'venues', 'concepts', 'claims',
  'evidence', 'methods', 'grants', 'events', 'places', 'terms'
];
const MEMORY_TYPE_IDS: readonly MemoryTypeId[] = [
  'short-term', 'long-term', 'institutional', 'research', 'learner',
  'contextual', 'episodic', 'semantic'
];
const AGENT_IDS: readonly AgentId[] = [ /* AG-01…AG-36, ARA-01…ARA-12 */ ];
const CRIE_*_LABELS / CRIE_*_ICONS: Partial<Record<K, string>>;

/** DTO contracts — stable interfaces consumed across surfaces (IN-###). */
interface ContextPackDto {
  contextKind: 'micro' | 'meso' | 'macro' | 'eco' | 'platform';
  elements: { ref: string; relevance: number; confidence: ConfidenceScore }[];
  budgetUsed: number;
  provenanceRefs: string[];
}

interface ReasoningOutputDto {
  traceId: string;
  conclusion: string;
  confidence: ConfidenceScore;
  paradigm: ReasoningParadigm;
  evidenceChainIds: string[];
  refusals?: string[];                 // Article X
}

interface AgentReportDto {
  taskId: string;
  agentId: AgentId;
  status: string;
  result?: unknown;
  provenance: ProvenanceRef;
  openIssues: string[];
  requiresHumanApproval: boolean;
}

interface RecommendationDto {
  recommendationId: string;
  kind: DecisionCapability;
  summary: string;
  explanation: RecommendationExplanation;
  confidence: ConfidenceScore;
  dismissible: boolean;
}

interface DecisionRecordDto {
  decisionId: string;
  accountableHuman: string;
  chosenOptionId: string;
  rationale: string;
  trackedOutcome?: string;
}
```

All interfaces are **reference-based** (canonical researcher usernames, SAIDs,
DOIs, ORCIDs, CRIE-IDs); none duplicates another module's records
(CRIE Ch. 46–58).

---

# Chapter 5 — Service Layer

Services are **pure, framework-free engines** in `lib/crie/*` (mirroring
`lib/collaboration.ts`, `lib/communities.ts`, `lib/workflows.ts` conventions):
no React, no state, no side effects; they derive and transform canonical
records and enforce invariants. They are re-exported explicitly from
`lib/index.ts` by name. **Twenty-eight core engines are specified**, each
mapped to its architecture chapters. Domain engines of the Advisory Layer
(Chapters 14–35) extend the catalogue during implementation without changing
the contracts.

## 5.1 Core engine catalogue (28)

| # | Engine | Responsibility | Architecture | Representative functions |
|---|---|---|---|---|
| E-01 | `ResearchIntelligenceEngine` | Derives research intelligence signals — trends, gaps, expertise — and research analytics. | Ch. 15, 16, 36 | `intelligenceFor`, `trendSignals`, `expertiseMatches`, `analyticsFor` |
| E-02 | `ReasoningEngine` | Multi-paradigm reasoning with explainable traces. | Ch. 11, 64 | `reason`, `traceOf`, `selectParadigm`, `combineParadigms`, `explainTrace` |
| E-03 | `KnowledgeGraphEngine` | RKG operations — entities, relations, provenance, trust, versioning. | Ch. 9, 61 | `upsertEntity`, `addRelation`, `resolveEntities`, `trustFor`, `graphAtVersion` |
| E-04 | `AgentCoordinatorEngine` | Routes, delegates, and supervises agents per the competence map. | Ch. 42, 43, 62 | `dispatch`, `delegate`, `checkpoint`, `escalate`, `oversightView` |
| E-05 | `EvidenceEngine` | Evidence extraction, assessment, contradiction handling, retraction. | Ch. 14 | `extractEvidence`, `assessClaim`, `contradictionsFor`, `propagateRetraction` |
| E-06 | `RecommendationEngine` | Generates and explains next-best actions. | Ch. 38, 65 | `candidates`, `scoreByGoals`, `rankWithTradeoffs`, `explain` |
| E-07 | `CitationIntelligenceEngine` | Reference extraction, resolution, styles, citation intent. | Ch. 13 | `extractReferences`, `resolveReference`, `citationContext`, `formatCitation` |
| E-08 | `ResearchWorkflowEngine` | Lifecycle planning, timelines, milestone tracking; integrates with SWTROP. | Ch. 8, 55 | `planLifecycle`, `generateTimeline`, `trackMilestones`, `promoteArtefact` |
| E-09 | `GrantEngine` | Funding discovery and proposal support. | Ch. 29 | `fundingOpportunities`, `matchFunder`, `proposalReadiness`, `grantReview` |
| E-10 | `PublishingEngine` | Submission readiness, cover letters, stewardship. | Ch. 26, 27 | `submissionPackage`, `journalFit`, `readinessChecklist`, `steward` |
| E-11 | `InstitutionEngine` | Aggregate institutional intelligence and enterprise analytics. | Ch. 35, 59, 60 | `institutionIntelligence`, `enterpriseAnalytics`, `ikAssets` |
| E-12 | `LearningEngine` | Just-in-time teaching, learning recommendations, learner state. | Ch. 33, 47 | `teachingRecommendations`, `learnerState`, `misconceptionDiagnosis` |
| E-13 | `CareerEngine` | Career intelligence and planning. | Ch. 32 | `careerSignals`, `careerPlan`, `opportunitySensing` |
| E-14 | `DecisionEngine` | Decision framing, options, record, track, learn. | Ch. 65 | `frameDecision`, `generateOptions`, `evaluateOptions`, `recordDecision`, `trackOutcome` |
| E-15 | `MemoryEngine` | Memory write/read/consolidate/forget/version/export. | Ch. 40, 63 | `write`, `read`, `recall`, `consolidate`, `forget`, `exportMemory` |
| E-16 | `SemanticEngine` | Annotations, concepts, embeddings, semantic index. | Ch. 10 | `annotate`, `resolveConcept`, `embed`, `semanticSearch` |
| E-17 | `PromptEngine` | Prompt assembly from context packs; refusal and safety framing. | Ch. 43, 44 | `buildPrompt`, `boundedContext`, `safetyGuard`, `refusalResponse` |
| E-18 | `PolicyEngine` | Governance, security, privacy, ethics, and role enforcement (L11). | Ch. 61, 67 | `can`, `enforce`, `approvalGate`, `policyRefusal`, `auditDecision` |
| E-19 | `ValidationEngine` | Provenance, confidence, and integrity validation of outputs. | Ch. 20, 62 | `validateProvenance`, `checkConfidence`, `integrityScreen`, `verify` |
| E-20 | `AnalyticsEngine` | Derived research analytics and indicators. | Ch. 36, 59 | `analyticsFor`, `rollup`, `computeKpis`, `riskSignals` |
| E-21 | `FederationEngine` | Global knowledge federation operations. | Ch. 66 | `federationContracts`, `governedExchange`, `memberSovereignty`, `adapters` |
| E-22 | `IdentityEngine` | Resolves canonical researcher identity (username/SAID). | Ch. 53 | `researcherOf`, `resolveIdentity`, `principalOf` |
| E-23 | `TrustEngine` | Source trust, edge propagation, corroboration, retraction cascade. | Ch. 61 | `sourceTrust`, `propagate`, `corroboration`, `contradictionPenalty` |
| E-24 | `VerificationEngine` | Verification of claims, credentials, and references. | Ch. 54 | `verifyClaim`, `verifyReference`, `verifyCredential` |
| E-25 | `NotificationEngine` | Emits notification events on consequential activity. | Ch. 56 | `notify`, `approvalRequested`, `milestoneReached`, `alert` |
| E-26 | `SearchEngine` | Retrieval across documents, graph, memory, and literature. | Ch. 12, 15 | `searchDocuments`, `searchGraph`, `searchMemory`, `searchLiterature` |
| E-27 | `IndexEngine` | Maintains semantic and graph indexes; never authoritative. | Ch. 10, 12 | `index`, `rebuild`, `refresh`, `optimize` |
| E-28 | `DigitalTwinEngine` | Consumes consented signals for the research Digital Twin. | Ch. 46 | `twinState`, `ingestSignals`, `syncProjections` |

## 5.2 Advisory domain engines

The domain intelligence modules of the Advisory Layer (L7) are realised as
engines under the same contract: `DocumentEngine` (Ch. 12),
`LiteratureEngine` (Ch. 15), `GapDetectionEngine` (Ch. 16), `NoveltyEngine`
(Ch. 17), `MethodologyEngine` (Ch. 18), `EthicsEngine` (Ch. 19),
`IntegrityEngine` (Ch. 20), `StatisticsEngine` (Ch. 21), `InstrumentEngine`
(Ch. 22), `WritingEngine` (Ch. 23), `SupervisorEngine` (Ch. 24),
`PeerReviewEngine` (Ch. 25), `JournalEngine` (Ch. 27), `ConferenceEngine`
(Ch. 28), `PatentEngine` (Ch. 30), `InnovationEngine` (Ch. 31),
`MentorshipEngine` (Ch. 34), `SessionEngine` (Ch. 6), `ContextEngine` (Ch. 5),
`WorkspaceEngine` (Ch. 7), `LifecycleEngine` (Ch. 8), `ConversationEngine`
(Ch. 41), `ConnectorEngine` (Ch. 44), `OrchestrationEngine` (Ch. 43),
`PredictionEngine` (Ch. 37), `AdaptiveEngine` (Ch. 39), `EnterpriseEngine`
(Ch. 59), and `AuditEngine` (Ch. 67). Each SHALL derive, never own, and
SHALL enforce human authority for consequential outputs (CRIE §65.9, §70.10).

All services operate **by reference** and **derive aggregates**; none writes or
duplicates another module's records (CRIE Ch. 46–58). Services SHALL refuse
requests that violate the Constitution (Article X) and SHALL log every
consequential action (Article VIII, Ch. 67).

---

# Chapter 6 — Hooks

Client state layers in `hooks/` (registered in `hooks/index.ts`), following
`useCollaboration.ts` / `useLearning.ts` conventions: hold local state seeded
from placeholder graphs, expose view state, controls, and actions, and resolve
identity to the canonical current user (`ojuri`, Dr. Adebisi Ojurere).
**Twelve hooks are specified.**

| Hook | View state | Controls | Actions |
|---|---|---|---|
| `useCRIE` | `currentEntity`, `researchEntities`, `activeSession`, `context`, `currentUser` | `entity`, `setEntity`, `stage`, `setStage` | `openEntity`, `startSession`, `endSession`, `refreshContext` |
| `useResearchAssistant` | `entities`, `recommendations`, `assistantReply`, `pendingQuestions` | `query`, `setQuery`, `mode` (research, supervisor, student, reviewer, editor, grant, institution) | `ask`, `clear`, `focusEntity` |
| `useKnowledgeGraph` | `entities`, `relations`, `selectedEntity`, `graphVersion`, `trustView` | `entityClass`, `setEntityClass`, `query`, `setQuery` | `expandEntity`, `resolveEntities`, `timeTravel`, `trustFor` |
| `useMemory` | `memoryItems`, `memoryType`, `consolidations`, `exported` | `type`, `setType`, `search`, `setSearch` | `writeMemory`, `recall`, `consolidate`, `forget`, `exportMemory` |
| `useReasoning` | `traces`, `selectedTrace`, `conclusions`, `conflicts` | `paradigm`, `setParadigm` | `runReasoning`, `viewTrace`, `explainConclusion`, `compareParadigms` |
| `useAgent` | `agents`, `tasks`, `oversight`, `pendingApprovals`, `charters` | `agentId`, `setAgentId`, `status`, `setStatus` | `dispatchAgent`, `checkpoint`, `approve`, `pauseAgent`, `retireAgent` |
| `useEvidence` | `claims`, `evidence`, `contradictions`, `assessments` | `claimId`, `setClaimId`, `status`, `setStatus` | `assessClaim`, `findSupporting`, `findContradicting`, `propagateRetraction` |
| `useGrantAssistant` | `opportunities`, `proposals`, `matches`, `reviews` | `opportunityId`, `setOpportunityId`, `funder`, `setFunder` | `discoverFunding`, `matchFunder`, `buildProposal`, `readinessCheck` |
| `usePublishingAssistant` | `plans`, `packages`, `journalMatches`, `checklist` | `planId`, `setPlanId`, `targetType`, `setTargetType` | `buildPackage`, `matchJournal`, `readinessChecklist`, `steward` |
| `useDecisionSupport` | `decisions`, `options`, `predictions`, `records` | `decisionId`, `setDecisionId`, `scope`, `setScope` | `frameDecision`, `generateOptions`, `evaluate`, `recordDecision`, `trackOutcome` |
| `useCitationAssistant` | `references`, `citations`, `styles`, `contexts` | `style`, `setStyle`, `intent`, `setIntent` | `extractReferences`, `resolveReference`, `formatCitation`, `citationContext` |
| `useResearchAnalytics` | `analytics`, `indicators`, `rollup`, `riskAlerts` | `scope`, `setScope`, `period`, `setPeriod` | `refreshAnalytics`, `openDrillThrough`, `exportReport` |

Hooks **never own data**: they seed from placeholder constants and delegate
derivation to the service engines. All personalisation and memory access
respects the consent model (P9, CRIE Ch. 60).

# Chapter 7 — UI Component Hierarchy

Components live under `components/crie/`, re-exported from
`components/crie/index.ts` (explicit, excluding barrel — module convention),
and consume the existing UI primitives (`PageLayout`, `PageHeader`,
`SectionTitle`, `Alert`, `Button`, `Container`, `StatisticCard`, `Badge`,
`SearchBox`, `Select`). **Forty-eight feature components are specified** in a
three-tier hierarchy. Hierarchy only — no implementation.

```
UI primitives (shared)
  → CRIE layout & chrome (PageHeader, hub chrome, cross-module nav)
  → feature components (48)
      ├── research/
      │     ResearchEntityBrowser, ResearchEntityCard, ResearchTimeline,
      │     ResearchWorkspace
      ├── knowledge/
      │     KnowledgeGraphExplorer, EntityDetail, RelationBadge,
      │     GraphVersionView
      ├── memory/
      │     MemoryPanel, MemoryItemCard, MemoryTimeline, MemorySettings
      ├── reasoning/
      │     ReasoningTraceView, ArgumentMap, EvidenceChainView,
      │     ConfidenceBadge
      ├── decision/
      │     DecisionSupportPanel, RecommendationCard, PredictionView,
      │     DecisionTimeline
      ├── assistant/
      │     AssistantChat, AssistantSuggestionBar, ContextPackView,
      │     SessionConsole
      ├── publishing/
      │     PublicationDashboard, JournalMatcher, SubmissionChecklist,
      │     CitationStylePicker
      ├── grant/
      │     GrantOpportunityCard, GrantProposalBuilder, GrantReviewAssistant,
      │     GrantBrowser
      ├── analytics/
      │     AnalyticsDashboard, AnalyticsChart, AnalyticsKpiCard,
      │     AnalyticsDrillDown
      ├── agents/
      │     AgentRegistry, AgentCharterCard, AgentOversightDashboard,
      │     AutonomyLevelBadge
      ├── admin/
      │     CrieAdminDashboard, ConnectorRegistry, PolicyConsole,
      │     AuditExplorer
      └── shared/
            ResearchAssistantHub, CriePageHeader, CrieStatsOverview,
            CrieCrossModuleNav
```

| Component | Responsibility |
|---|---|
| `ResearchAssistantHub` | The CRIE hub — overview, active entity, KPIs, cross-module navigation (CRIE Ch. 7). |
| `ResearchEntityBrowser` | Interactive research entity centre — search, filters, grid. |
| `ResearchEntityCard` | Canonical entity summary card — stage badge, progress, link. |
| `ResearchTimeline` | Lifecycle timeline with milestones and stage transitions (Ch. 8). |
| `ResearchWorkspace` | The persistent workspace — panes, open documents, active selection (Ch. 7). |
| `KnowledgeGraphExplorer` | Interactive RKG explorer — entity classes, traversal, subgraph view (Ch. 61). |
| `EntityDetail` | Full entity view — attributes, provenance, confidence, lifecycle state. |
| `RelationBadge` | Typed relationship badge with strength and confidence. |
| `GraphVersionView` | Time-travel view of graph states (Ch. 61). |
| `MemoryPanel` | Memory surface — items by type, recall, consolidation (Ch. 63). |
| `MemoryItemCard` | A memory item with provenance and access policy. |
| `MemoryTimeline` | Chronological memory and consolidation events. |
| `MemorySettings` | Consent and retention controls (Ch. 60). |
| `ReasoningTraceView` | Explainable reasoning trace with steps and evidence (Ch. 64). |
| `ArgumentMap` | Visual premises→conclusion argument map (Ch. 11). |
| `EvidenceChainView` | The closed chain from conclusion to source (P3). |
| `ConfidenceBadge` | Calibrated confidence band badge (L5). |
| `DecisionSupportPanel` | Decision framing, options, trade-offs, record (Ch. 65). |
| `RecommendationCard` | A next-best-action recommendation with explanation. |
| `PredictionView` | A prediction with calibrated uncertainty and horizon. |
| `DecisionTimeline` | Decision lifecycle: frame → decide → record → track → learn. |
| `AssistantChat` | Conversational assistant surface (Ch. 41). |
| `AssistantSuggestionBar` | Proactive, derived suggestions with provenance. |
| `ContextPackView` | The operative context pack with elements and budget (Ch. 5). |
| `SessionConsole` | Session controls and consolidation (Ch. 6). |
| `PublicationDashboard` | Publication plans, packages, and stewardship (Ch. 26). |
| `JournalMatcher` | Journal fit assessments and rationale (Ch. 27). |
| `SubmissionChecklist` | Submission readiness checklist (Ch. 26). |
| `CitationStylePicker` | Citation style selection and preview (Ch. 13). |
| `GrantOpportunityCard` | A funding opportunity with deadline and fit (Ch. 29). |
| `GrantProposalBuilder` | Proposal structure and readiness guidance. |
| `GrantReviewAssistant` | Criteria-based proposal review support. |
| `GrantBrowser` | Funding discovery centre. |
| `AnalyticsDashboard` | Role-scoped research analytics dashboards (Ch. 36). |
| `AnalyticsChart` | A derived indicator chart. |
| `AnalyticsKpiCard` | A single KPI card with evidence drill-through. |
| `AnalyticsDrillDown` | Drill-through to the evidence behind an indicator. |
| `AgentRegistry` | The agent catalogue with charters and status (Ch. 43, 62). |
| `AgentCharterCard` | A charter — mission, competence, limits, escalation. |
| `AgentOversightDashboard` | Active agents, plans, pending approvals, pause/redirect (Ch. 62.8). |
| `AutonomyLevelBadge` | The L1–L5 autonomy envelope badge. |
| `CrieAdminDashboard` | Platform admin surface — policies, connectors, federation. |
| `ConnectorRegistry` | Registered connectors, capabilities, risk class (Ch. 44). |
| `PolicyConsole` | Policy enforcement and approval-gate configuration (L11). |
| `AuditExplorer` | Append-only audit and refusal logs (Ch. 67). |
| `CriePageHeader` | CRIE page header with mode switcher (research, supervisor, student, reviewer, editor, grant, institution). |
| `CrieStatsOverview` | Headline derived statistics. |
| `CrieCrossModuleNav` | Navigation to integrated modules (by reference). |

Components **never own data** — the browser wires the hook, the hook seeds from
placeholder data (CRIE conventions).

---

# Chapter 8 — Route Specification

All routes are **Server Components** under `app/crie/`, following the page
conventions in `node_modules/next/dist/docs` (`params`/`searchParams` are
promises; dynamic segments await `params` as a promise; static pages without
request-time APIs prerender). **Twenty-eight routes are specified.**

| Route | Page | Section |
|---|---|---|
| `/crie` | `app/crie/page.tsx` | Hub — `ResearchAssistantHub`. |
| `/crie/dashboard` | `app/crie/dashboard/page.tsx` | `CrieStatsOverview` — KPIs, active entity, cross-module nav. |
| `/crie/research` | `app/crie/research/page.tsx` | `ResearchEntityBrowser` centre. |
| `/crie/research/[id]` | `app/crie/research/[id]/page.tsx` | Research entity detail — workspace, timeline, plan. |
| `/crie/assistant` | `app/crie/assistant/page.tsx` | `AssistantChat` — conversational assistant. |
| `/crie/knowledge` | `app/crie/knowledge/page.tsx` | `KnowledgeGraphExplorer`. |
| `/crie/knowledge/entity/[crieId]` | `app/crie/knowledge/entity/[crieId]/page.tsx` | `EntityDetail` with provenance and trust. |
| `/crie/memory` | `app/crie/memory/page.tsx` | `MemoryPanel`, consolidation, settings. |
| `/crie/reasoning` | `app/crie/reasoning/page.tsx` | `ReasoningTraceView` and `ArgumentMap`. |
| `/crie/agents` | `app/crie/agents/page.tsx` | `AgentRegistry` and `AgentOversightDashboard`. |
| `/crie/agents/[id]` | `app/crie/agents/[id]/page.tsx` | `AgentCharterCard` and task history. |
| `/crie/grants` | `app/crie/grants/page.tsx` | `GrantBrowser` and proposal builder. |
| `/crie/grants/[id]` | `app/crie/grants/[id]/page.tsx` | Grant proposal detail and readiness. |
| `/crie/publishing` | `app/crie/publishing/page.tsx` | `PublicationDashboard`, `JournalMatcher`. |
| `/crie/search` | `app/crie/search/page.tsx` | Cross-domain search (documents, graph, memory, literature). |
| `/crie/discovery` | `app/crie/discovery/page.tsx` | Discovery surface — gaps, novelty, opportunities. |
| `/crie/evidence` | `app/crie/evidence/page.tsx` | `EvidenceBrowser` — claims, evidence, contradictions. |
| `/crie/analytics` | `app/crie/analytics/page.tsx` | `AnalyticsDashboard` with drill-through. |
| `/crie/institutions` | `app/crie/institutions/page.tsx` | Institutional intelligence and enterprise analytics (Ch. 59). |
| `/crie/admin` | `app/crie/admin/page.tsx` | `CrieAdminDashboard` — connectors, policies, audit, federation. |
| `/crie/citations` | `app/crie/citations/page.tsx` | `CitationStylePicker` and reference resolution. |
| `/crie/literature` | `app/crie/literature/page.tsx` | Literature search, screening, summaries (Ch. 15). |
| `/crie/gaps` | `app/crie/gaps/page.tsx` | Research gap and novelty assessments (Ch. 16, 17). |
| `/crie/methodology` | `app/crie/methodology/page.tsx` | Methodology, design, sampling recommendations (Ch. 18). |
| `/crie/statistics` | `app/crie/statistics/page.tsx` | Statistical plans, power, analysis results (Ch. 21). |
| `/crie/writing` | `app/crie/writing/page.tsx` | Writing drafts and revisions (Ch. 23). |
| `/crie/reviews` | `app/crie/reviews/page.tsx` | Peer review and supervision surfaces (Ch. 24, 25). |
| `/crie/decision` | `app/crie/decision/page.tsx` | `DecisionSupportPanel` (Ch. 65). |

Cross-module navigation follows the existing `Button href` pattern used by the
hub surfaces (Messages, Activity, Notifications, Collaboration, Learning).

---

# Chapter 9 — Permission Matrix

CRIE extends the platform RBAC model (`docs/RBAC.md`) and the verification
gate, adding a **CRIE permission group** and mapping the eleven principals
that CRIE serves. All checks run through `can({ roles, verificationLevel,
permission })` (CRIE Ch. 61; L11).

## 9.1 CRIE permission keys

```
crie:read            crie:use             crie:manage-workspace
crie:write-context   crie:ingest-document crie:extract
crie:kg-read         crie:kg-write        crie:kg-admin
crie:reason          crie:explain
crie:memory-read     crie:memory-write    crie:memory-admin
crie:agent-use       crie:agent-configure crie:agent-approve
crie:agent-admin     crie:recommend       crie:decide
crie:grant-assist    crie:publish-assist  crie:career-assist
crie:learning-assist crie:institution-analytics
crie:audit-read      crie:policy          crie:admin
crie:ai              crie:crie-orchestrate
```

## 9.2 Principal matrix

| Principal | Direct permissions | Notes |
|---|---|---|
| **Researcher** | `crie:read`, `crie:use`, `crie:manage-workspace`, `crie:write-context`, `crie:ingest-document`, `crie:extract`, `crie:kg-read`, `crie:kg-write` (own scope), `crie:reason`, `crie:explain`, `crie:memory-read`, `crie:memory-write` (own), `crie:agent-use`, `crie:recommend`, `crie:grant-assist`, `crie:publish-assist`, `crie:career-assist`, `crie:learning-assist` | Default principal. |
| **Student** | Researcher permissions within learning scope (AG-25, ARA-10). | Learning mode. |
| **Supervisor** | Researcher + `crie:decide` (supervision scope), `crie:agent-approve` (mentee agents), `crie:explain` on mentee work | Ch. 24, AG-34. |
| **Reviewer** | `crie:read`, `crie:kg-read`, `crie:reason`, `crie:explain`, `crie:publish-assist` (review scope); never writes target records | Ch. 25, AG-17. |
| **Journal Editor** | Reviewer + `crie:kg-write` (editorial scope), `crie:decide` (editorial decisions) | Ch. 27, AG-17/AG-19. |
| **Grant Reviewer** | Reviewer + `crie:grant-assist` (evaluation scope), `crie:decide` (recommendation only) | Ch. 29, AG-21. |
| **Institution Administrator** | `crie:institution-analytics`, `crie:kg-read` (institutional scope), `crie:policy`, `crie:audit-read`, `crie:agent-configure` (institutional agents) | Ch. 35, 59, 60. |
| **Platform Admin** | All CRIE permission keys including `crie:admin`, `crie:policy`, `crie:kg-admin`, `crie:memory-admin`, `crie:agent-admin`, `crie:audit-read` | Top of hierarchy. |
| **System AI** | `crie:ai`, `crie:read` (derived surfaces), `crie:kg-read`, `crie:memory-read` (authorised); never `crie:decide`, never credential authority | Advisory only (Article VIII). |
| **CRIE** | `crie:crie-orchestrate`, `crie:read` (derived signals), `crie:agent-use`; never `crie:decide`, never `crie:admin` | Orchestration only. |

## 9.3 Scope columns

| Scope | Meaning | Governed by |
|---|---|---|
| **Research** | Personal research entity scope (own projects, documents, memory). | Researcher ownership; P1. |
| **Institutional** | Institution-scoped assets and analytics (IKOS). | Institutional isolation (Ch. 68). |
| **Global / Federation** | Federated exchanges under explicit contracts. | Federation contracts (Ch. 66). |
| **System** | Platform-level policy, connectors, audit. | Platform Admin. |
| **AI** | Non-human service principals; advisory and orchestration only. | Constitution Article VIII. |
| **Administration** | Governance and administration surfaces. | Platform Admin + L11. |

Principals never exceed the authority their role implies and no more (P16);
privilege escalation attempts are refused and audited (CRIE §2.1, P16).

# Chapter 10 — Workflow Specifications

**Eighteen workflows** are specified. Each follows the derived-first,
human-authority, consent-governed conventions of the architecture (P3, P6,
P8, P9; CRIE §65.9, §70.10). Where a workflow involves the SWTROP surfaces
(tasks, artefacts, reviews), it references — never duplicates — those records
(CRIE Ch. 55; `docs/WORKFLOW_ARCHITECTURE.md`).

| Workflow | Steps |
|---|---|
| **Research Discovery** | Researcher intent → context assembled (Context Engine) → literature search (AG-06) → screening → gap signal (Ch. 16) → literature summary with confidence → presented with provenance. |
| **Literature Review** | Search → screen → read/extract (AG-03) → annotate (AG-04) → synthesise (AG-06) → summary + evidence chains → supervisor review gate where consequential. |
| **Hypothesis Development** | Research question → candidate hypotheses (AG-09 / ARA-02) → probabilistic weighing (Ch. 64) → evidence search (AG-07) → hypothesis status updated (supported/refuted/unresolved). |
| **Proposal Writing** | Research plan → framework → draft sections (AG-13) → integrity screening (AG-14) → ethics check (AG-15) → reviewer/supervisor feedback → revision → final artefact. |
| **Grant Submission** | Funding discovery (AG-21 / ARA-07) → opportunity match → proposal build → readiness checklist → **human approval gate (submission requires explicit approval, §62.7)** → submission. |
| **Experiment Design** | Question → methodology recommendation (AG-10) → study design → sampling plan → instrument design (AG-12) → statistical plan + power (AG-11) → approval of consequential design choices. |
| **Data Analysis** | Data ingestion → analysis plan → statistical analysis (AG-11) → interpretation within limits → analysis report → evidence appended to claims. |
| **Publication** | Manuscript → writing/revision (AG-13) → integrity screening → journal matching (AG-19) → submission package → stewardship (AG-18) → **human submission gate**. |
| **Peer Review** | Reviewer invited → review drafted (AG-17 / ARA-09) → decision (approve/reject/minor/major) → evidence-grounded comments → editor decision → review recorded. |
| **Evidence Verification** | Claim → evidence assessment (AG-07) → supporting/contradicting evidence surfaced → trust propagation (Ch. 61) → contradiction handling → confidence update. |
| **Research Recommendation** | Context + goals → candidates generated → scored → trade-offs presented (Ch. 65) → recommendation explained → researcher accepts/dismisses/overrides → override recorded. |
| **Teaching Assistance** | Learner state read (AG-25) → misconception diagnosis → just-in-time lesson → practice → assessment support → learner memory update (consented). |
| **Mentorship** | Mentee goals → mentorship scaffolding (AG-26 / ARA-11) → guidance → session → reflection → progress into learner/research memory (consented). |
| **Career Guidance** | Career goal → career intelligence (AG-24 / ARA-12) → opportunity sensing → plan → milestone tracking → updated on outcomes. |
| **Institutional Decision Support** | Institutional decision framed → consented aggregate evidence → options + trade-offs + uncertainty → recorded recommendation → accountable authority decides → outcome tracked (Ch. 65.7). |
| **Knowledge Graph Update** | New document/claim → extraction → entity resolution (AG-05) → relation typing → provenance + confidence → versioned graph update → trust recomputation. |
| **Memory Consolidation** | Short-term/episodic items → consolidation checkpoints → merge to semantic/long-term (AG-31) → prune/expire per policy → audit. |
| **Agent Collaboration** | Mission → task decomposition (AG-01) → delegation with contracts → parallel execution (e.g., literature while methodology plans) → shared RKG/memory reads → contradiction reconciliation → result consolidation → human checkpoint for consequential outputs (Ch. 62.5). |

Every workflow SHALL record its execution in the audit trail and SHALL pause
at human approval gates for consequential actions (CRIE §62.7, §65.9).

---

# Chapter 11 — AI Interfaces

All AI integration is **derived-first (SADR-006), governed, and labelled**
(CRIE Ch. 44, 64; SLEA §13.2). CRIE exposes stable input/output contracts;
models are provider-neutral (P13) and every external call is logged
(CRIE §44.2). Interfaces follow the `IN-###` identifier convention
(CRIE Appendix A).

## 11.1 Prompt contracts

| Interface | Contract | Notes |
|---|---|---|
| **Context supply (IN-101)** | `ContextPackDto` → bounded, ordered, weighted context with provenance refs. | Context Engine (Ch. 5); micro→eco→platform kinds. |
| **Prompt assembly (IN-102)** | Context + task + role → framed prompt with safety guard and refusal framing. | Prompt Engine (E-17); never exceeds context budget. |
| **Capability request (IN-103)** | Capability name + typed inputs → provider-neutral call. | Connector abstraction (P13); never vendor-bound. |
| **Refusal path (IN-104)** | Request violating Constitution → explained, recorded refusal. | Article X; `RefusalRecord`. |

## 11.2 Response contracts

| Interface | Contract | Notes |
|---|---|---|
| **Reasoning output (IN-105)** | `ReasoningOutputDto` — traceId, conclusion, confidence, paradigm, evidence chains. | Reasoning Engine (Ch. 64). |
| **Recommendation output (IN-106)** | `RecommendationDto` — summary, explanation, trade-offs, dismissible. | Ch. 65. |
| **Agent report (IN-107)** | `AgentReportDto` — status, result, provenance, open issues, approval required. | Ch. 62. |
| **Search output (IN-108)** | Ranked typed results with provenance and confidence. | Search Engine (E-26). |
| **Evidence output (IN-109)** | Supporting/contradicting evidence with strength and provenance. | Evidence Engine (E-05). |
| **Citation output (IN-110)** | Resolved references and formatted citations in the chosen style. | Citation Engine (E-07). |

## 11.3 Memory access

| Interface | Contract | Notes |
|---|---|---|
| **Memory write (IN-111)** | `MemoryItem` + access policy → committed with provenance. | Ch. 63; consent-gated. |
| **Memory read (IN-112)** | `MemoryQuery` → relevant items within access control. | Never cross-institutional. |
| **Memory recall (IN-113)** | Semantic/episodic recall into context. | Context Engine integration. |
| **Memory consolidation (IN-114)** | Episodic → semantic; short-term → long-term roll-forward. | Explainable rule per consolidation. |
| **Memory forget/export (IN-115)** | Deprecate/expire per policy; portable export. | Right-to-be-forgotten (Ch. 60). |

## 11.4 Reasoning pipeline

Observe → diagnose → plan → execute → verify → explain → record (Ch. 43.3).
The pipeline SHALL: select paradigm by problem typing (Ch. 64.9); chain
paradigms; surface paradigm disagreement rather than hide it; and render a
full reasoning trace. No reasoning output SHALL exceed its evidentiary basis
(Ch. 64.10).

## 11.5 Safety rules

1. **No consequential action without approval** — submission, commitment,
   expenditure, and public representation require explicit human approval
   (CRIE §62.7, §65.9).
2. **No integrity compromise** — requests that would fabricate, distort, or
   conceal evidence are refused (Article II; Ch. 20).
3. **No autonomy amplification** — an autonomous agent may not grant further
   autonomy beyond policy (CRIE §62.2).
4. **Least privilege** — every call runs within the requesting principal's
   role and consent (P16).
5. **Sandboxing** — external services never receive more data than required
   (CRIE §44.2).

## 11.6 Human override

Every consequential output SHALL support question, override, and decline
(Article IV). Overrides SHALL be recorded with rationale (`crie_audit_record`,
`crie_recommendation_explanation`). The researcher remains the accountable
principal (Article VIII); human control SHALL never be automated away.

## 11.7 Confidence scoring

All model and derived outputs SHALL carry a calibrated confidence band
(`very-low` → `very-high`, P11): very-low/low triggers clarification; medium
triggers qualified proposals; high enables automated execution within
governance bounds. Confidence SHALL be attached to provenance and updated by
trust propagation (Ch. 61.9).

## 11.8 Explainability

Every consequential output SHALL be explainable: what was done, why, with what
confidence, from what evidence, and with what alternatives (Article VII).
Opaque consequential decisions SHALL NOT be made. Explainability records
SHALL be auditable and exportable (Ch. 67).

---

# Chapter 12 — Knowledge Graph Specification

The RKG is the semantic spine of CRIE (CRIE Ch. 61). The Knowledge Graph
Engine (E-03) SHALL implement the following.

## 12.1 Nodes

- **Entity classes** — the 12 classes: People, Organisations, Works, Venues,
  Concepts, Claims, Evidence, Methods, Grants, Events, Places, Terms
  (CRIE §61.2).
- **Identity** — every node SHALL carry a stable CRIE-ID, entity class,
  attributes, provenance, confidence, and lifecycle state (proposed,
  confirmed, deprecated, superseded).

## 12.2 Edges

- **Typed relations** — every edge SHALL declare subject, object, predicate,
  direction, strength, provenance, confidence, and validity period.
- **Relationship families** — Authorship, Containment, Citation, Epistemic,
  Conceptual, Procedural, Affiliation, Temporal, Influence, Institutional
  (CRIE §61.3).

## 12.3 Traversal

Entity expansion, path finding, subgraph extraction, neighbourhood ranking,
semantic proximity, community detection, and bridge detection (CRIE §61.4).
Traversal SHALL respect governance/privacy filters and SHALL be explainable
(the path used is always recoverable).

## 12.4 Reasoning over the graph

Concept similarity, evidence triangulation, contradiction surfacing, novelty
assessment, gap identification, influence tracing, and impact projection
(CRIE §61.5) — implemented by `KnowledgeGraphEngine` combined with
`ReasoningEngine` (graph paradigm).

## 12.5 Versioning

- The graph SHALL be **versioned**: every state reproducible; time-travel
  queries supported (CRIE §61.6).
- Insertion, resolution, attribution, revision, deprecation, confidence
  update, and temporal decay SHALL be governed operations.

## 12.6 Entity evolution

Entities evolve through: insertion (ingestion, Ch. 12/15), resolution
(merging preserves both provenances), revision (versioned, never destructive),
deprecation (superseded/retracted), confidence update (evidence accrual), and
temporal decay (domain-appropriate half-life).

## 12.7 Provenance

Every entity and relation SHALL carry immutable provenance — source, actor,
timestamp, method, version, basis, and consent/access class — exportable for
audit, verification, and federation (CRIE §61.7).

## 12.8 Trust propagation

Trust SHALL be propagated per explicit rules (CRIE §61.9): source trust seeds
entity trust; edge propagation; independent corroboration raises trust;
contradiction penalty lowers it; retraction cascades downward; trust updates
SHALL update dependent calibrated confidence. Propagation SHALL be monotonic
with new evidence only and every trust value SHALL be explainable as a
function of its inputs.

## 12.9 Inference rules

- **Triangulation** — ≥2 independent support paths raise claim confidence.
- **Contradiction** — conflicting support subgraphs surface a contradiction
  (Ch. 14) and lower confidence.
- **Novelty** — a contribution is novel if its concept-and-claim
  neighbourhood lacks it (Ch. 17).
- **Gap** — structural holes between weakly connected concepts indicate gaps
  (Ch. 16).
- **Influence** — lineage of an idea traced through citation and containment
  paths.
- **Retraction** — a retracted source invalidates every dependent claim,
  citation, and recommendation (Ch. 20).

---

# Chapter 13 — Memory Specification

The unified, multi-scale memory architecture (CRIE Ch. 63) is implemented by
the Memory Engine (E-15).

## 13.1 Memory types

The 8 types SHALL be maintained: short-term, long-term, institutional,
research, learner, contextual, episodic, and semantic (CRIE §63.2), each with
declared scope, lifetime, and content.

## 13.2 Operations

Write, read, consolidate, recall, forget, version, and export (CRIE §63.3).
- **Write** — commit with provenance, type, and access policy.
- **Read** — retrieve per access control and relevance.
- **Consolidate** — merge episodic into semantic; strengthen or prune
  (Ch. 39); explainable rule per event.
- **Recall** — retrieve semantically or episodically relevant items into
  context.
- **Forget** — deprecate/expire per policy (right to be forgotten).
- **Version** — every change tracked.
- **Export** — portable, interoperable representation.

## 13.3 Retrieval

`MemoryQuery` supports typed, semantic, and episodic retrieval bounded by
access policy. Recall feeds the Context Engine (Ch. 5); contextual memory
(Ch. 63.9) binds retrievals to the situation in which they were created and
used.

## 13.4 Compression & consolidation

- Short-term memory SHALL be bounded and attention-weighted; it persists no
  longer than the session unless promoted (CRIE §63.4).
- Episodic → semantic consolidation SHALL be continuous; recurring episodic
  patterns become semantic knowledge (CRIE §63.10).
- Every consolidation SHALL be explainable and auditable.

## 13.5 Retention & expiry

- Retention SHALL follow declared policy per memory type and consent scope
  (`expires_at` on `crie_memory_item`).
- Deprecation and expiry SHALL be audited; exports honour consent.
- Institutional memory SHALL be distinct from individual memory; individuals
  SHALL NOT read one another's personal long-term memory; institutional
  memory SHALL be aggregated/pseudonymised and preserved against staff and
  system change (CRIE §63.6).

## 13.6 Governance

Memory operations SHALL respect consent (Ch. 60), institutional isolation
(Ch. 68), data minimisation (P9), and full audit of writes, reads, and
deletions (CRIE §63.5).

# Chapter 14 — Agent Architecture

The multi-agent ecosystem is the agency layer (L9): the Agent Catalogue
(AG-01…AG-36, CRIE Ch. 43) plus the Autonomous Research Agents
(ARA-01…ARA-12, CRIE Ch. 62), governed by the AI Orchestration Layer and the
Agent Coordinator Engine (E-04). **Forty-eight agents are specified.**
Enterprise agents AG-37–AG-40 (Enterprise Analytics, Enterprise Planning,
Enterprise Compliance, Federation) extend the catalogue in the enterprise
stratum (CRIE Ch. 59, 66).

## 14.1 Agent catalogue (AG-01…AG-36)

| Agent | Identifier | Responsibility | Domain |
|---|---|---|---|
| Orchestrator Agent | AG-01 | Routes tasks, manages delegation, enforces policy | Ch. 44 |
| Context Agent | AG-02 | Assembles and maintains context packs | Ch. 5 |
| Document Agent | AG-03 | Ingestion, reading, extraction, format conversion | Ch. 12 |
| Semantic Agent | AG-04 | Annotation, entity/concept resolution | Ch. 10 |
| Knowledge Agent | AG-05 | Knowledge Graph operations and fusion | Ch. 9 |
| Literature Agent | AG-06 | Search, screening, reading, synthesis | Ch. 15 |
| Evidence Agent | AG-07 | Evidence extraction, assessment, contradiction handling | Ch. 14 |
| Citation Agent | AG-08 | Reference extraction, resolution, style formatting | Ch. 13 |
| Reasoning Agent | AG-09 | Deduction, argumentation, causal analysis, explanation | Ch. 11 |
| Methodology Agent | AG-10 | Design selection, method suitability, sampling | Ch. 18 |
| Statistics Agent | AG-11 | Statistical design, analysis, interpretation, reporting | Ch. 21 |
| Instrument Agent | AG-12 | Instrument design, validation, psychometrics | Ch. 22 |
| Writing Agent | AG-13 | Drafting, revision, editing, style | Ch. 23 |
| Integrity Agent | AG-14 | Plagiarism, fabrication, manipulation screening | Ch. 20 |
| Ethics Agent | AG-15 | Ethics review support, ethics refusals | Ch. 19 |
| Gap & Novelty Agent | AG-16 | Gap detection and novelty assessment | Chs. 16, 17 |
| Peer Review Agent | AG-17 | Reviewer and editorial support | Ch. 25 |
| Publication Agent | AG-18 | Submission readiness, cover letters, stewardship | Ch. 26 |
| Journal Agent | AG-19 | Journal matching and fit | Ch. 27 |
| Conference Agent | AG-20 | Conference matching and participation | Ch. 28 |
| Grant Agent | AG-21 | Funding discovery and proposal support | Ch. 29 |
| Patent Agent | AG-22 | Patentability sensing and disclosure | Ch. 30 |
| Innovation Agent | AG-23 | Innovation opportunity analysis | Ch. 31 |
| Career Agent | AG-24 | Career intelligence and planning | Ch. 32 |
| Learning Agent | AG-25 | Just-in-time teaching and practice | Ch. 33 |
| Mentorship Agent | AG-26 | Mentorship scaffolding | Ch. 34 |
| Analytics Agent | AG-27 | Research analytics derivation | Ch. 36 |
| Prediction Agent | AG-28 | Predictive modelling with uncertainty | Ch. 37 |
| Recommendation Agent | AG-29 | Recommendation generation and explanation | Ch. 38 |
| Adaptive Agent | AG-30 | Profile adaptation | Ch. 39 |
| Memory Agent | AG-31 | Memory write/read/consolidate/forget | Ch. 40 |
| Scheduling Agent | AG-32 | Timeline, milestone, and planning | Chs. 8, 37 |
| Compliance Agent | AG-33 | Policy, governance, and role enforcement | Ch. 61 |
| Supervisor Agent | AG-34 | Supervision portfolio support | Ch. 24 |
| Institution Agent | AG-35 | Aggregate institutional intelligence | Ch. 35 |
| Integrations Agent | AG-36 | Platform integration operations | Chs. 46–58 |

## 14.2 Autonomous research agents (ARA-01…ARA-12)

| Agent | Identifier | Responsibility | Domain |
|---|---|---|---|
| Literature Discovery Agent | ARA-01 | Continuous literature monitoring, screening, and discovery | Chs. 15, 16 |
| Hypothesis Generation Agent | ARA-02 | Hypotheses, research questions, and candidate explanations | Chs. 3, 16 |
| Methodology Agent | ARA-03 | Method selection, study design, sampling, and feasibility | Ch. 18 |
| Statistical Reasoning Agent | ARA-04 | Statistical design, power, analysis, and interpretation | Ch. 21 |
| Writing Agent | ARA-05 | Drafting, structuring, revising, and formatting | Ch. 23 |
| Reviewing Agent | ARA-06 | Critical review, argument evaluation, and critique | Chs. 11, 25 |
| Grant Preparation Agent | ARA-07 | Funding discovery, proposal drafting, and submission readiness | Ch. 29 |
| Publishing Agent | ARA-08 | Publication strategy, journal matching, and stewardship | Chs. 26, 27 |
| Peer Review Agent | ARA-09 | Peer-review support, reviews, and editorial assistance | Ch. 25 |
| Teaching Agent | ARA-10 | Teaching support, lesson design, and assessment | Ch. 33 |
| Mentoring Agent | ARA-11 | Mentorship scaffolding and guidance | Ch. 34 |
| Career Intelligence Agent | ARA-12 | Career tracking, planning, and opportunity sensing | Ch. 32 |

## 14.3 Responsibilities, inputs & outputs

Every agent SHALL declare a charter (`AgentCharter`): mission, competence,
limits, inputs, outputs, escalation path, and policies (CRIE §43.4, §62.3).
Inputs are typed records and context packs; outputs are provenance-bearing
artefacts (`AgentReportDto`). Agents SHALL NOT claim competence they lack —
they escalate instead (CRIE §62.2).

## 14.4 Permissions & shared memory

- Agents act only within granted scope (`crie:agent-use`,
  `crie:agent-configure`, approval gates) and never beyond policy (P16).
- Agents read/write the **shared RKG and memory** (Chs. 61, 63) rather than
  exchanging private state (CRIE §62.5.4); no agent holds exclusive private
  state that others cannot trace.
- Institutional isolation SHALL be honoured by all agents (Ch. 68).

## 14.5 Collaboration model

1. **Task decomposition** — AG-01 decomposes a mission into agent tasks.
2. **Hand-off** — agents pass artefacts with contracts and provenance.
3. **Parallelism** — independent tasks run concurrently (CRIE §62.5.3).
4. **Shared knowledge** — coordination through the RKG and memory.
5. **Contradiction handling** — disagreeing agents reconcile per Chapter 43
   conflict resolution, escalated to the researcher where consequential.

## 14.6 Priority rules

Task priority (`low | medium | high | urgent`) SHALL be assigned by the
orchestrator from researcher goals, deadlines, budgets, and consequence;
consequential tasks SHALL be gated regardless of priority (CRIE §43.2,
§62.7). No task SHALL exceed its declared budget (time, cost, compute,
context).

## 14.7 Autonomy levels

Agent autonomy SHALL be graded (CRIE §62.6):

| Level | Autonomy | Example |
|---|---|---|
| **L1 — Assist** | Agent proposes; human decides | Suggest a hypothesis |
| **L2 — Advise** | Agent recommends with rationale; human confirms | Recommend a methodology |
| **L3 — Execute with checkpoint** | Agent acts; consequential steps require approval | Draft a proposal, pause at submission |
| **L4 — Execute bounded** | Agent executes within strict, pre-approved boundaries | Monitor literature and alert on matches |
| **L5 — Autonomous (prohibited by default)** | No human interaction in a defined, low-consequence scope | Only where explicitly configured and policy-permitted |

L5 SHALL NOT be the default and SHALL be disabled unless a specific,
reviewed, revocable configuration enables it (CRIE §62.6). ARAs SHALL NOT
authorise expenditures, sign commitments, or act on the researcher's behalf
without explicit approval (CRIE §62.7).

---

# Chapter 15 — Cross Module Integration

Integration is **by reference and event, never duplication** (CRIE Ch. 46–58;
SLEA §14.1). **Fifteen modules are specified.** CRIE references each module's
canonical records by identity and communicates through the platform's
Activity/Notifications/Workflow surfaces.

| Module | Integration points | Data flow |
|---|---|---|
| **Identity** | Researchers are canonical identities (username/SAID). | `IdentityEngine.researcherOf` resolves canonical principals; never copies. |
| **Trust** | Source trust and issuer authority. | TrustEngine consumes verification signals; trust values are derived. |
| **Verification** | Verification of claims, references, and credentials. | VerificationEngine validates references/credentials; results feed trust. |
| **Publishing** | Publication plans reference canonical publications/journals. | CRIE references publications and DOIs; never duplicates records. |
| **Marketplace** | Grant/proposal and service surface integration. | CRIE references marketplace listings and orders (e.g., `listing-*`, `ord-*`). |
| **Groups** | Group research collaboration signals. | CRIE references group entities by identity. |
| **Communities** | Community research and mentorship context. | CRIE references community entities by identity. |
| **Learning** | Learner state and learning signals (SLEA Ch. 13). | LearningEngine reads consented learning signals; never owns learning records, never issues credentials. |
| **Messaging** | Conversation coordination with humans and mentors. | CRIE references conversations; coordination via Messaging surface. |
| **Workflow (SWTROP)** | Research workflow integration — tasks, artefacts, reviews. | `ResearchWorkflowEngine` promotes artefacts and references SWTROP workflows by `sourceId`/`sourceEntity` (Ch. 55; `docs/WORKFLOW_ARCHITECTURE.md`). |
| **Notifications** | Milestones, approvals, and alerts. | NotificationEngine emits events on consequential activity. |
| **Activity** | CRIE actions in the platform event stream. | CRIE emits activity events; never stores others' activity. |
| **Research Projects** | Live research context for the RCM. | Research entities reference canonical project records. |
| **Digital Twins** | Persistent personalised research state. | DigitalTwinEngine consumes consented CRIE signals (Phase 5; Ch. 46). |
| **Knowledge Graph** | Typed learning graph joined to the RKG. | Graph-ready data serialised via JSON-LD adapter; semantic integration only. |

## 15.1 Integration invariants

- **Reference over copy** — every cross-module relationship is an identity
  reference; no module's canonical record is duplicated (CRIE §46–58).
- **Event-based coupling** — modules communicate through the platform's
  Activity/Notifications/Workflow surfaces; no hidden direct coupling.
- **Derived analytics** — any aggregate spanning modules is computed, never
  hand-maintained (SADR-006).
- **Consent boundaries** — personalisation across modules follows the privacy
  and consent model (Ch. 60).

---

# Chapter 16 — Implementation Roadmap

Implementation is decomposed into **twelve waves**, each additive and
preserving the constitutional invariants. Waves may be sequenced across
commits under the governance rules.

| Wave | Scope | Deliverables | Exit criteria |
|---|---|---|---|
| **1 — Core Types** | `types/crie/*.ts` | Entity model, base models, vocabularies, DTOs (Ch. 4) | `tsc --noEmit` clean; no circular imports. |
| **2 — Core Engines** | `lib/crie/*` context, session, lifecycle, workspace engines | E-01, E-08 (context/session/lifecycle surface), `lib/index.ts` re-exports (Ch. 5) | Pure engines; no React; no side effects. |
| **3 — Knowledge Graph** | `KnowledgeGraphEngine`, KG types | Entities, relations, provenance, versioning, trust propagation (Ch. 12) | Graph ops derive without side effects. |
| **4 — Reasoning** | `ReasoningEngine` | Multi-paradigm reasoning, traces, arguments (Ch. 64) | Every trace explainable; confidence attached. |
| **5 — Memory** | `MemoryEngine` | 8 memory types, operations, consolidation (Ch. 13) | Consent-gated; audit complete. |
| **6 — Research Intelligence** | Document, citation, evidence, literature, gap, novelty, methodology, statistics, instrument engines | Advisory domain engines (Chs. 12–22) | Derived-only; provenance enforced. |
| **7 — Agents** | `AgentCoordinatorEngine`, agent catalogue | AG-01…AG-36 + ARA-01…ARA-12 charters and executor (Ch. 14) | Autonomy envelopes enforced; approvals gate. |
| **8 — Decision Intelligence** | Recommendation, prediction, decision engines | Recommendation/Decision DTOs and lifecycle (Ch. 65) | Humans remain accountable. |
| **9 — Institution Intelligence** | Institution, enterprise, IKOS surfaces | Enterprise analytics, institutional assets (Ch. 59–60) | Cell suppression above cohort tier. |
| **10 — Admin** | Policy, audit, connector surfaces | PolicyConsole, AuditExplorer, ConnectorRegistry (Chs. 44, 67) | L11 enforced; all consequential actions audited. |
| **11 — Optimization** | Search, index, prompt engines | Search/index/prompt optimisation (E-17, E-26, E-27) | Performance and budget discipline met. |
| **12 — Final Verification** | Full verification pass | Chapter 17 checklist executed; conformance matrix audited | All checks green. |

Each wave is **additive** and preserves the constitutional invariants
(provenance, derived-first, consent, human authority, CRIE-ready contracts).

# Chapter 17 — Verification Checklist

The implementation must pass every item before a wave closes (CRIE
conventions and repository governance).

| Area | Checks |
|---|---|
| **TypeScript** | `npx tsc --noEmit` — 0 errors; no `any` leaks; strict mode; no circular imports. |
| **Lint** | `npm run lint` — 0 errors; only pre-approved warnings (if any). |
| **Build** | `npm run build` — all routes build; 0 failed pages; static prerender verified. |
| **Routes** | All `/crie` routes reachable; dynamic `[id]`/`[crieId]` resolve; cross-module links valid. |
| **Architecture validation** | Every engine/hook/component referenced conforms to this specification; no contract drift. |
| **Dependency validation** | No circular module imports; no cross-layer internal access (P4, L11). |
| **Performance** | No client bundles for static surfaces; derived analytics cheap; budgets respected; no N+1 patterns. |
| **Security** | RBAC-gated actions; verification gate applied; zero-trust default (Ch. 68); no secrets; no unsafe input sinks. |
| **KG integrity** | Every entity/relation has provenance + confidence; versioning and time-travel verified; trust propagation monotonic and explainable. |
| **Memory integrity** | Consent-gated access; institutional isolation; consolidation explainable; retention/expiry honoured. |
| **Agent integrity** | Autonomy envelopes enforced; approval gates pause consequential steps; L5 disabled by default; audit complete. |
| **Accessibility** | Semantic HTML; keyboard navigable; labelled controls; contrast (P15). |
| **Integration** | No duplicate records; canonical references resolve; events/notifications flow; consent enforced. |
| **Regression** | Existing modules unaffected; route matrix updated; `git status` clean at close. |

---

# Chapter 18 — Architecture Conformance Matrix

This specification conforms to `docs/crie/CRIE_ARCHITECTURE.md` (the CRIE
Architecture) as follows. Every architecture chapter is mapped to its
implementation responsibility; **nothing is omitted.**

| CRIE Architecture chapter | Title | Conformance |
|---|---|---|
| Ch. 1 | Vision, Mission, Purpose, Constitution, Core Philosophy | Ch. 1, 2, 18 |
| Ch. 2 | Architectural Principles (P1–P18) | Ch. 1, 2, 5, 11, 17 |
| Ch. 3 | Research Cognitive Model | Ch. 2 (§2.1), 4 (§4.2) |
| Ch. 4 | Research Intelligence Layers (L0–L11) | Ch. 1 (§1.9), 5 |
| Ch. 5 | Research Context Engine | Ch. 2, 5 (E-01/E-17), 11 (§11.1) |
| Ch. 6 | Research Session Engine | Ch. 2, 5 (SessionEngine), 6 |
| Ch. 7 | Research Workspace Architecture | Ch. 2, 5 (WorkspaceEngine), 7 |
| Ch. 8 | Research Lifecycle Architecture | Ch. 2 (§2.1), 4 (§4.2), 5 (E-08) |
| Ch. 9 | Knowledge Graph Architecture | Ch. 2, 4, 5 (E-03), 12 |
| Ch. 10 | Semantic Intelligence | Ch. 2, 4, 5 (E-16) |
| Ch. 11 | Reasoning Architecture | Ch. 2, 4, 5 (E-02), 11 |
| Ch. 12 | Document Intelligence Architecture | Ch. 2, 3, 4, 5 (E-26) |
| Ch. 13 | Citation Intelligence | Ch. 2, 4, 5 (E-07), 6 |
| Ch. 14 | Evidence Intelligence | Ch. 2, 4, 5 (E-05), 6 |
| Ch. 15 | Literature Intelligence | Ch. 2, 5 (E-01/E-26), 10 |
| Ch. 16 | Research Gap Intelligence | Ch. 2, 5 (GapDetectionEngine), 10 |
| Ch. 17 | Novelty Detection | Ch. 2, 5 (NoveltyEngine), 12 |
| Ch. 18 | Methodology Intelligence | Ch. 2, 5 (MethodologyEngine), 10 |
| Ch. 19 | Research Ethics Intelligence | Ch. 2, 5 (EthicsEngine), 11 |
| Ch. 20 | Research Integrity Intelligence | Ch. 2, 5 (E-19), 11 |
| Ch. 21 | Statistical Intelligence | Ch. 2, 5 (StatisticsEngine), 10 |
| Ch. 22 | Instrument Intelligence | Ch. 2, 5 (InstrumentEngine) |
| Ch. 23 | Academic Writing Intelligence | Ch. 2, 5 (WritingEngine), 7 |
| Ch. 24 | Supervisor Intelligence | Ch. 2, 5 (SupervisorEngine), 9, 10 |
| Ch. 25 | Peer Review Intelligence | Ch. 2, 5 (PeerReviewEngine), 10 |
| Ch. 26 | Publication Intelligence | Ch. 2, 5 (E-10), 7 |
| Ch. 27 | Journal Intelligence | Ch. 2, 5 (JournalEngine), 10 |
| Ch. 28 | Conference Intelligence | Ch. 2, 5 (ConferenceEngine) |
| Ch. 29 | Grant Intelligence | Ch. 2, 5 (E-09), 6, 10 |
| Ch. 30 | Patent Intelligence | Ch. 2, 5 (PatentEngine) |
| Ch. 31 | Innovation Intelligence | Ch. 2, 5 (InnovationEngine) |
| Ch. 32 | Career Intelligence | Ch. 2, 5 (E-13), 6 |
| Ch. 33 | Learning Intelligence | Ch. 2, 5 (E-12), 15 |
| Ch. 34 | Mentorship Intelligence | Ch. 2, 5 (MentorshipEngine), 10 |
| Ch. 35 | Institutional Intelligence | Ch. 2, 5 (E-11), 9 |
| Ch. 36 | Research Analytics | Ch. 2, 5 (E-20), 6, 7 |
| Ch. 37 | Predictive Intelligence | Ch. 2, 5 (PredictionEngine), 6 |
| Ch. 38 | Recommendation Engine | Ch. 2, 5 (E-06), 6 |
| Ch. 39 | Adaptive Intelligence | Ch. 2, 5 (AdaptiveEngine) |
| Ch. 40 | Memory Architecture | Ch. 2, 4, 5 (E-15), 13 |
| Ch. 41 | Conversation Architecture | Ch. 2, 5 (ConversationEngine), 7 |
| Ch. 42 | Multi-Agent Architecture | Ch. 2, 4, 14 |
| Ch. 43 | AI Orchestration Layer | Ch. 5 (E-04/E-17), 11, 14 |
| Ch. 44 | External AI Connectors | Ch. 5 (E-17), 7, 11 |
| Ch. 45 | Internal Scholatia Intelligence Connectors | Ch. 5, 11 |
| Ch. 46 | Digital Scholar Twin Integration | Ch. 5 (E-28), 15 |
| Ch. 47 | Learning Integration | Ch. 15 |
| Ch. 48 | Publishing Integration | Ch. 15 |
| Ch. 49 | Marketplace Integration | Ch. 15 |
| Ch. 50 | Messaging Integration | Ch. 15 |
| Ch. 51 | Groups Integration | Ch. 15 |
| Ch. 52 | Communities Integration | Ch. 15 |
| Ch. 53 | Identity Integration | Ch. 5 (E-22), 15 |
| Ch. 54 | Verification Integration | Ch. 5 (E-24), 15 |
| Ch. 55 | Workflow Integration | Ch. 5 (E-08), 10, 15 |
| Ch. 56 | Notification Integration | Ch. 5 (E-25), 15 |
| Ch. 57 | Activity Integration | Ch. 15 |
| Ch. 58 | Additional Scholatia Integration Surfaces | Ch. 15 |
| Ch. 59 | Enterprise Intelligence Layer | Ch. 2, 5 (E-11), 9, 16 |
| Ch. 60 | Institutional Knowledge Operating System | Ch. 2, 5 (E-11), 9, 13 |
| Ch. 61 | Research Knowledge Graph Architecture | Ch. 3, 4, 5 (E-03/E-23), 12 |
| Ch. 62 | Autonomous Research Agents | Ch. 2, 4, 5 (E-04), 9, 14 |
| Ch. 63 | CRIE Memory Architecture | Ch. 2, 4, 5 (E-15), 13 |
| Ch. 64 | Reasoning Architecture | Ch. 2, 4, 5 (E-02), 11 |
| Ch. 65 | Decision Intelligence | Ch. 2, 4, 5 (E-06/E-14), 6, 10 |
| Ch. 66 | Global Knowledge Federation | Ch. 5 (E-21), 9, 15 |
| Ch. 67 | Ethics | Ch. 2, 3, 9, 11, 17 |
| Ch. 68 | Security | Ch. 9, 11, 17 |
| Ch. 69 | Future Evolution | Ch. 1, 16 |
| Ch. 70 | CRIE Constitution | Ch. 1, 2, 9, 11, 14, 18 |

## 18.1 Completeness and conformance statement

- Every CRIE Architecture chapter (1–70) is mapped to an implementation
  responsibility in this specification; nothing is omitted.
- **No contradictions** exist between this specification and the CRIE
  Architecture. This specification adds no new constitutional principles and
  removes none.
- The CRIE Constitution (Chapter 70, Articles I–XII) prevails over every
  provision herein; any future conflict SHALL be resolved in favour of the
  Constitution (CRIE §70.15).

---

*End of Functional Specification. No implementation, no code, no routes, no
components, no commits, and no governance updates are derived from this
document. Implementation begins with a subsequent mission.*
