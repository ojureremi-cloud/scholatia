# COGNITIVE RESEARCH INTELLIGENCE ENGINE (CRIE)

## Scholatia Master Architecture Blueprint

| Attribute | Value |
|---|---|
| **Document Title** | Cognitive Research Intelligence Engine (CRIE) — Master Architecture Document |
| **Document ID** | `SCHOLATIA.CRIE.ARCH.001` |
| **Mission Reference** | Mission 004-A (CRIE Master Architecture) |
| **Document Status** | **ARCHITECTURE ONLY** — no implementation, no code, no components, no routes, no hooks, no database, no governance updates |
| **Version** | 1.0.0 (Baseline) |
| **Classification** | Internal — Scholatia Platform |
| **Scope** | Enterprise architecture of the complete Cognitive Research Operating System |
| **Technology Posture** | Technology-neutral; implementation-agnostic; provider-agnostic |
| **Audience** | Platform architects, engineering leads, product leadership, governance board, research advisory council, external technology auditors |
| **Successor Mission** | Mission 004-B (CRIE Functional Specification) |

---

## Document Control and Conventions

### How to read this document

This document is the authoritative architectural blueprint for the Cognitive
Research Intelligence Engine (CRIE). It describes **what** CRIE must be, **why**
it must exist, **how** its architecture is organised, and **what** constraints
govern its evolution. It deliberately does **not** prescribe implementation
technology. Wherever a technical mechanism must be described, it is described in
terms of responsibility, contract, and behaviour — never in terms of a specific
product, framework, language, or vendor.

### Conventions used

| Convention | Meaning |
|---|---|
| **SHALL** | Mandatory architectural requirement |
| **SHOULD** | Recommended architectural practice; deviation requires justification |
| **MAY** | Optional architectural option; discretionary |
| **MUST NOT** | Prohibited behaviour |
| **CRIE-###** | Unique architectural requirement identifier, referenced by the Architecture Traceability Matrix (Chapter 70) |
| **IN-**### | Interface contract identifier, referenced in cross-module integration chapters |
| **AG-**### | Multi-agent capability identifier, referenced in Chapter 43 |
| **ID-**### | Intelligence-domain identifier, referenced across the Intelligence Layers |

### Document structure

The document is organised into seventy (70) chapters plus a Special Capabilities
appendix. Chapters are grouped into ten parts:

- **Part I — Foundation** (Chapters 1–2): Vision, Mission, Purpose, Constitution,
  Core Philosophy, and Architectural Principles.
- **Part II — Cognition** (Chapters 3–8): Research Cognitive Model, Intelligence
  Layers, Context Engine, Session Engine, Workspace Architecture.
- **Part III — Lifecycle** (Chapter 9): The complete Research Lifecycle
  Architecture across all fourteen stages.
- **Part IV — Knowledge and Semantics** (Chapters 10–12): Knowledge Graph,
  Semantic Intelligence, Reasoning Architecture.
- **Part V — Evidence and Documents** (Chapters 13–23): Document Intelligence,
  Citation Intelligence, Evidence Intelligence, Literature Intelligence, Research
  Gap Intelligence, Novelty Detection, Methodology Intelligence, Research Ethics
  Intelligence, Research Integrity Intelligence, Statistical Intelligence,
  Instrument Intelligence.
- **Part VI — Scholarly Practice** (Chapters 24–36): Academic Writing, Supervisor,
  Peer Review, Publication, Journal, Conference, Grant, Patent, Innovation,
  Career, Learning, Mentorship, Institutional Intelligence.
- **Part VII — Decision and Adaptation** (Chapters 37–42): Research Analytics,
  Predictive Intelligence, Recommendation Engine, Adaptive Intelligence, Memory
  Architecture, Conversation Architecture.
- **Part VIII — Agency and Integration** (Chapters 43–58): Multi-Agent
  Architecture, AI Orchestration Layer, External AI Connectors, Internal
  Scholatia Intelligence Connectors, and the twelve integration surfaces.
- **Part IX — Trust and Operations** (Chapters 59–67): Security, Privacy,
  Governance, Audit, Explainability, Responsible AI, Accessibility, Scalability,
  Deployment Models.
- **Part X — Continuity** (Chapters 68–70): Future Expansion, Glossary,
  Architecture Traceability Matrix.
- **Appendix** — Special Capabilities.

---

# PART I — FOUNDATION

---

## Chapter 1 — Vision, Mission, Purpose, Constitution, and Core Philosophy

### 1.1 Vision

**To make rigorous, reproducible, ethical research dramatically easier for every
researcher on Earth — from the first spark of an idea to the permanent
preservation of scholarly impact — by giving each researcher a complete,
trustworthy, and ever-present Cognitive Research Operating System.**

CRIE exists so that the researcher's energy is spent on thinking, discovery, and
insight — not on clerical overhead, bibliographic drudgery, formatting
compliance, and fragmented tool-switching. CRIE is the operating system of the
scholarly mind.

### 1.2 Mission

CRIE's mission is to **companion the entire scholarly lifecycle** — ideation,
problem formulation, objectives, questions, hypotheses, literature, frameworks,
methodology, instruments, analysis, interpretation, publication, impact, and
preservation — with a coherent, explainable, evidence-traceable, and ethically
governed intelligence system that:

1. Understands the researcher's work as a **living cognitive model**, not as a
   set of disconnected files.
2. Maintains a **single source of truth** for every claim, citation, and
   artefact.
3. Reasons over evidence with **verifiable provenance** at every step.
4. Adapts to the researcher's discipline, culture, career stage, language,
   institution, and working style.
5. Operates within an **ethical and integrity constitution** that refuses to
   cut corners even when asked to.
6. Composes with the broader Scholatia ecosystem as a first-class citizen.

### 1.3 Purpose

The purpose of CRIE is to deliver a **Cognitive Research Operating System** —
an integrated platform capability that:

- **Understands** research as a structured cognitive activity.
- **Assists** across every phase of the scholarly lifecycle.
- **Augments** researcher judgement rather than replacing it.
- **Guards** scientific integrity, ethics, and privacy.
- **Connects** researchers to the full Scholatia ecosystem (learning, publishing,
  marketplace, messaging, groups, communities, identity, verification, workflow,
  notification, and activity).

CRIE is explicitly **not**:

- a chatbot bolted onto a document store;
- a thin wrapper around a general-purpose language model;
- a writing assistant that touches only the drafting stage;
- a literature search engine that ends at a hit list.

CRIE is a **complete cognitive architecture** that treats research as a coherent
process with persistent memory, structured knowledge, verifiable evidence, and
governed agency.

### 1.4 Constitution

The CRIE Constitution is the highest-order normative framework for the engine.
Every module, agent, pipeline, and policy SHALL comply with it. The Constitution
has eleven articles.

#### Article I — Researcher Sovereignty

The researcher is the author of their own research. CRIE SHALL assist, propose,
draft, critique, and reason — but the researcher retains final authority over
every decision, artefact, and representation attributed to them. CRIE SHALL
never present machine-generated content as human-authored unless the researcher
explicitly elects that representation in compliance with applicable disclosure
policy.

#### Article II — Verifiable Provenance

Every claim, citation, statistic, and summary surfaced by CRIE SHALL carry
traceable provenance. Where provenance cannot be established, CRIE SHALL state
its uncertainty explicitly and SHALL NOT present unverified material as verified
fact.

#### Article III — Integrity First

CRIE SHALL decline to assist in the fabrication, falsification, plagiarism, or
misrepresentation of research. This refusal is not optional, not user-
overridable, and not circumventable by prompt or configuration.

#### Article IV — Ethical Primacy

Human and social welfare, research participant protection, consent, equity, and
beneficence SHALL outrank convenience, performance, and completion. CRIE SHALL
surface ethical considerations proactively and SHALL refuse to produce content
that would violate research ethics.

#### Article V — Explainability

CRIE SHALL be able to explain the reasoning behind any conclusion it produces,
at a level of detail appropriate to the audience (researcher, reviewer,
institution, auditor). Opaque "black box" reasoning SHALL NOT be the default.

#### Article VI — Privacy and Data Minimalism

CRIE SHALL collect and retain the minimum data necessary. Researcher work,
documents, and personal information SHALL be protected according to the highest
applicable standard and SHALL never be used for purposes other than those for
which explicit consent was given.

#### Article VII — Non-Expropriation

CRIE SHALL NOT extract, transfer, or expose researcher intellectual property,
unpublished findings, or personal scholarly data to any party without explicit,
informed consent and a lawful basis.

#### Article VIII — Calibrated Confidence

CRIE SHALL express confidence honestly. It SHALL distinguish established fact,
well-supported inference, weak inference, and speculation, and SHALL calibrate
its presentation and downstream decisions accordingly.

#### Article IX — Human Accountability

An accountable human SHALL exist for every consequential action enabled by CRIE.
Automation SHALL be bounded by human oversight thresholds defined in the
Governance Architecture (Chapter 61).

#### Article X — Continuous Learning with Guardrails

CRIE SHALL improve over time — from user feedback, usage patterns, and new
scholarly evidence — while respecting privacy, consent, and the prohibition on
feedback loops that amplify bias. Learning SHALL be auditable and reversible.

#### Article XI — Beneficence toward the Scholarly Commons

CRIE SHALL contribute to the health of the global scholarly ecosystem: openness
where appropriate, credit where due, correction where required, and respect for
intellectual labour in all its forms.

### 1.5 Core Philosophy

The core philosophy of CRIE can be stated as seven commitments:

| # | Commitment | Meaning |
|---|---|---|
| 1 | **Research-first** | Every design decision begins with the researcher's cognitive work. |
| 2 | **Education-first** | CRIE teaches while it assists; every interaction is an opportunity to deepen the researcher's competence. |
| 3 | **AI-native** | Intelligence is not an add-on; it is woven into every surface, agent, and pipeline. |
| 4 | **Evidence-anchored** | Nothing is trusted without a traceable source. |
| 5 | **Knowledge-graph-aware** | Meaning is relational, not textual; CRIE thinks in connected concepts. |
| 6 | **Digital-Twin-ready** | Every researcher can be represented by a consent-managed digital scholar twin that mirrors their knowledge, interests, and trajectory. |
| 7 | **Production-grade** | CRIE is engineered for scale, reliability, security, and auditability from day one. |

### 1.6 Position within Scholatia

CRIE is the intelligence substrate of the Scholatia ecosystem. It integrates
with — and is integrated by — every existing Scholatia capability. It does not
replace them; it makes them cognitive. The integration surfaces are specified in
Chapters 45–58. CRIE stands on top of the existing scholarly modules
(researchers, journals, conferences, publishers, institutions, projects, funding,
datasets, manuscripts, discovery, learning, communities, marketplace, and the
rest) as a derived, referencing layer — it SHALL reference authoritative records
rather than duplicate them.

---

## Chapter 2 — Architectural Principles

### 2.1 Principle Catalogue

The following principles govern all CRIE architecture. Each principle carries a
rationale, a set of implications, and a compliance test.

#### P1 — Researcher-Centricity

- **Statement:** Every capability exists to serve the researcher's cognitive
  process, not the other way around.
- **Implication:** Interfaces reduce cognitive load; workflows follow the
  researcher's mental model; no feature is added without a demonstrable research
  benefit.
- **Compliance test:** A task that took N steps before CRIE must be demonstrably
  reduced, better supported, or more trustworthy with CRIE.

#### P2 — Cognitive Continuity

- **Statement:** The researcher's work is one continuous cognitive object, not
  a set of disconnected files, sessions, and chats.
- **Implication:** Persistent Memory (Chapter 41) and Research Context (Chapter
  6) span sessions; nothing meaningful is ever lost.
- **Compliance test:** A conversation or artefact resumed after any interval
  retains its full context and provenance.

#### P3 — Provenance by Construction

- **Statement:** Provenance is a first-class architectural property, not an
  afterthought.
- **Implication:** Every derived artefact records its sources, transformations,
  confidence, and version. Evidence is traceable from assertion to source
  document to underlying data.
- **Compliance test:** Any claim can be traced to source material through a
  closed chain of recorded derivations.

#### P4 — Separation of Concerns

- **Statement:** Cognition (understanding), reasoning (drawing conclusions),
  knowledge (structured meaning), memory (persistence), agency (acting), and
  presentation (surfacing) are distinct architectural domains.
- **Implication:** Each domain evolves independently; each exposes contracts;
  no domain reaches into another's internals.
- **Compliance test:** The Architecture Traceability Matrix maps each
  requirement to exactly one owning domain.

#### P5 — Composition over Monolith

- **Statement:** CRIE is composed of well-bounded modules, engines, and agents
  that interact through declared contracts.
- **Implication:** Modules are replaceable, testable, and independently
  deployable; no single point of cognitive failure.
- **Compliance test:** Any module can be substituted by a conforming
  implementation without altering the rest of the system.

#### P6 — Evidence-Grounded Reasoning

- **Statement:** All reasoning output is grounded in, and attributable to,
  evidence.
- **Implication:** Reasoning (Chapter 12) consumes only knowledge and memory
  that carry provenance; ungrounded output is flagged as speculative.
- **Compliance test:** Reasoning outputs include citation of the evidence
  chain that supports them.

#### P7 — Explainability and Transparency

- **Statement:** Every consequential output is explainable at the appropriate
  granularity.
- **Implication:** Confidence, rationale, sources, and alternatives are exposed;
  the Explainability Architecture (Chapter 63) provides the machinery.
- **Compliance test:** An auditor can reconstruct why CRIE produced a given
  output.

#### P8 — Ethical and Integrity Boundaries

- **Statement:** Integrity and ethics are non-negotiable architectural
  constraints enforced at every layer.
- **Implication:** The Ethics (Chapter 20), Integrity (Chapter 21), Governance
  (Chapter 61), and Responsible AI (Chapter 64) architectures are enforced as
  hard guards, not advisory.
- **Compliance test:** Attempts to violate integrity constraints are refused,
  logged, and reported — regardless of user role or configuration.

#### P9 — Data Minimalism and Privacy by Design

- **Statement:** Privacy and minimal data handling are designed in from the
  outset.
- **Implication:** Collection, retention, access, and deletion follow the
  Privacy Architecture (Chapter 60); data flows through the Security
  Architecture (Chapter 59).
- **Compliance test:** A privacy impact assessment exists for every data flow
  and the flow retains the minimum data for its purpose.

#### P10 — Adaptive Personalisation

- **Statement:** CRIE adapts to the researcher's discipline, culture, language,
  career stage, preferences, and learning state.
- **Implication:** The Adaptive Intelligence (Chapter 40) maintains a governed
  profile; personalisation is consent-based and reversible.
- **Compliance test:** Two researchers using the same feature receive
  appropriately different, appropriate experiences — and can inspect why.

#### P11 — Confidence-Aware Behaviour

- **Statement:** CRIE's behaviour scales with the confidence of its
  understanding.
- **Implication:** Low-confidence understanding triggers clarification;
  medium-confidence triggers qualified proposals; high-confidence enables
  automated execution within governance bounds.
- **Compliance test:** CRIE's actions at each confidence band are observable
  and consistent with this principle.

#### P12 — Governance and Auditability

- **Statement:** Everything consequential is governed, logged, and auditable.
- **Implication:** The Audit Architecture (Chapter 62) records decisions,
  refusals, and changes; the Governance Architecture (Chapter 61) defines who
  may approve what.
- **Compliance test:** An end-to-end audit trail exists for any consequential
  action.

#### P13 — Technology Neutrality

- **Statement:** No architecture decision depends on a specific technology,
  vendor, model, or implementation.
- **Implication:** CRIE can be realised on any conforming technology stack;
  model providers and infrastructure are replaceable via the Connector
  architecture (Chapters 45–46).
- **Compliance test:** The document contains no mandatory technology binding
  that cannot be substituted without architectural change.

#### P14 — Scalability and Resilience

- **Statement:** CRIE scales globally and degrades gracefully.
- **Implication:** The Scalability (Chapter 66) and Deployment (Chapter 67)
  architectures define elastic, fault-tolerant behaviour; no single failure
  disables the researcher.
- **Compliance test:** Load, failure, and recovery scenarios are specified and
  met without data loss or integrity compromise.

#### P15 — Accessibility and Inclusion

- **Statement:** CRIE is usable by researchers of every ability, language, and
  context.
- **Implication:** Accessibility (Chapter 65) is a design requirement;
  internationalisation and low-connectivity modes are first-class.
- **Compliance test:** Accessibility and inclusion requirements are verified
  against every user-facing surface.

#### P16 — Least Privilege and Role Bounds

- **Statement:** Every capability is bounded by the requesting actor's role and
  consent.
- **Implication:** Supervisor, Student, Reviewer, Editor, Grant Reviewer, and
  Institution Administrator modes (Chapter 9 and Special Capabilities) grant
  exactly the authority their roles imply, and no more.
- **Compliance test:** Privilege escalation attempts are refused and audited.

#### P17 — Open Standards and Interoperability

- **Statement:** CRIE interoperates through open, documented standards.
- **Implication:** Citation styles, document formats, identifiers (DOI, ORCID,
  etc.), and knowledge interchange are standards-based (Chapters 13–14, 10).
- **Compliance test:** Import and export conform to declared standards.

#### P18 — Continuous Improvement within Guardrails

- **Statement:** CRIE learns and improves continuously, bounded by the
  Constitution.
- **Implication:** The Memory (41), Adaptive (40), and Learning (34)
  architectures implement feedback loops that respect privacy, consent, and
  bias control.
- **Compliance test:** Every learning mechanism has a documented, reversible,
  auditable effect.

### 2.2 Principle Conflicts and Resolution Order

When principles conflict, the following resolution order SHALL apply:

1. **Constitution Articles** (Chapter 1.4) — always binding.
2. **P3 Provenance** and **P6 Evidence-Grounded Reasoning** — never subordinated
   to convenience.
3. **P8 Ethical and Integrity Boundaries** — never subordinated to feature
   velocity.
4. **P9 Privacy and P11 Confidence** — subordinated only to Constitution.
5. Remaining principles resolved by documented architectural judgement, recorded
   in the Architecture Decisions register associated with this document.

### 2.3 Principles Applied to Quality Attributes

| Quality Attribute | Governing Principles | Key Architectural Response |
|---|---|---|
| Correctness | P3, P6, P7 | Provenance chains; evidence grounding; explainability records |
| Trustworthiness | P8, P9, P16 | Hard integrity guards; privacy by design; least privilege |
| Maintainability | P4, P5 | Separation of concerns; compositional modules |
| Scalability | P14 | Elastic, stateless-friendly cognitive services |
| Accessibility | P15 | Inclusive surfaces; low-connectivity modes |
| Evolvability | P13, P17 | Technology-neutral contracts; standards-based interchange |
| Accountability | P12, P7 | Audit logs; explainability; human oversight |

# PART II — COGNITION

---

## Chapter 3 — Research Cognitive Model

### 3.1 Purpose

The Research Cognitive Model (RCM) is the central abstraction of CRIE. It is the
machine-readable representation of **what the researcher is doing, thinking,
knowing, and seeking** at every moment of the scholarly lifecycle. All
intelligence layers, agents, and engines reason against the RCM; all
presentation surfaces render it; all memory and knowledge services persist it.

The RCM is what elevates CRIE from "a tool with features" to a Cognitive
Research Operating System: it gives the system a coherent, live theory of the
researcher's work.

### 3.2 Model Elements

The RCM is composed of the following primary elements:

| Element | Description | Example |
|---|---|---|
| **Research Entity** | The root cognitive object — a research effort (project, study, thesis, paper, grant programme, patent, innovation). | "Detection of mangrove degradation using satellite imagery" |
| **Stage Instance** | The researcher's position in the Research Lifecycle (Chapter 9), including transitions, dwell time, and prerequisites. | Currently in *Methodology*, advancing to *Analysis* |
| **Research Question Set** | The hierarchy of questions the entity seeks to answer, including sub-questions and derived sub-questions. | RQ1, RQ1a, RQ2 |
| **Hypothesis Set** | Stated, testable propositions with status (proposed, supported, contradicted, unresolved) and evidence linkage. | H1: NDVI change correlates with field-verified degradation |
| **Concept Model** | The researcher's structured understanding of key concepts and their interrelations — a personal conceptual map seeded from literature and continuously refined. | Mangrove → NDVI → Degradation ← Climate |
| **Theory Frame** | Anchoring theories, frameworks, and paradigms the researcher has adopted or critiqued. | Land-change science; remote sensing theory |
| **Artefact Corpus** | The full collection of documents, data, instruments, notes, and media associated with the entity, each with provenance. | 47 sources, 3 datasets, 12 instrument drafts |
| **Evidence Model** | The organised body of claims, supports, contradictions, and gaps tied to sources. | "X et al. found NDVI saturation; our study must address this" |
| **Methodological Model** | The chosen design, methods, instruments, sampling, and analysis plan with rationale. | Mixed-methods; stratified random sampling; NDVI regression |
| **Argument Model** | The structured argument the researcher is building: claims, premises, warrants, rebuttals. | Claim ← Evidence ← Warrant chain |
| **Status Vector** | Current confidence, completeness, blockages, and next actions per stage. | Methodology: 70% complete; blocked on ethics clearance |
| **Decision History** | Record of significant decisions, alternatives considered, and rationale. | Chose NDVI over EVI: rationale recorded |
| **Companion Profile** | The adaptive, consent-managed profile of researcher preferences, language, career stage, and learning state (Chapters 34, 40). | Prefers plain-English explanations; PhD candidate |

### 3.3 Model Dynamics

The RCM is **not static**. It evolves through three dynamic processes:

1. **Assimilation** — new evidence, sources, and artefacts are ingested and
   reconciled into the model.
2. **Accommodation** — the model's structure (questions, hypotheses, concept map,
   argument) is revised when evidence demands it.
3. **Projection** — the model is used to anticipate next steps, risks, and
   needs (Predictive Intelligence, Chapter 38).

### 3.4 Model Views

Different actors consume different **views** of the RCM:

| View | Consumer | Contents |
|---|---|---|
| Researcher view | The researcher | Full transparency; editable; annotated |
| Supervisor view | Supervisor mode | Progress, risks, gaps, coaching points (not private reflections) |
| Reviewer view | Reviewer mode | Anonymised evidence and argument structure |
| Editor view | Journal editor mode | Fit, novelty, integrity signals |
| Administrator view | Institution administrator mode | Aggregate, de-identified analytics |
| Auditor view | Audit subsystem | Immutable decision and provenance records |

### 3.5 Model Quality

The RCM is governed by quality invariants:

- **Fidelity** — the model must faithfully reflect the researcher's intent and
  the available evidence.
- **Continuity** — the model persists across sessions, devices, and time.
- **Provenance** — every element records its origin and change history.
- **Consistency** — the model resolves contradictions or explicitly records them
  as open tensions.
- **Sparsity handling** — the model explicitly represents what is **unknown**,
  not merely what is known.

### 3.6 Model Lifecycle and Versioning

The RCM SHALL be versioned. Every consequential change produces a model revision
recorded with actor, timestamp, source elements, and rationale. Version history
enables rollback, comparison, and the audit trail required by Chapter 62.

---

## Chapter 4 — Research Intelligence Layers

### 4.1 Purpose

CRIE's intelligence is organised into **layers**. Each layer is a coherent
cognitive capability domain with defined inputs, outputs, and responsibilities.
Layers compose vertically — lower layers provide facts and structure; middle
layers provide meaning and inference; upper layers provide judgement,
recommendation, and agency.

### 4.2 The Layer Model

| Layer | Name | Responsibility | Consumes | Produces |
|---|---|---|---|---|
| L0 | **Infrastructure & Data Layer** | Ingestion, storage, identity, security, instrumentation | External documents, datasets, metadata, platform records | Canonical ingested artefacts with provenance |
| L1 | **Perception Layer** | Document comprehension, OCR, layout, table/figure extraction, multimodal understanding | Canonical artefacts | Structured content: text, tables, figures, references, metadata |
| L2 | **Semantic Layer** | Meaning extraction: concepts, entities, relations, claims, intents, embeddings | Structured content | Semantic annotations, concept graphs, embeddings |
| L3 | **Knowledge Layer** | Knowledge Graph operations, ontology, entity resolution, knowledge fusion | Semantic annotations | Unified knowledge, resolved entities, confidence-qualified facts |
| L4 | **Cognitive Layer** | Reasoning, inference, evidence assessment, argument construction, causal analysis | Knowledge + RCM | Conclusions, evidence chains, arguments, explanations |
| L5 | **Epistemic Layer** | Confidence, uncertainty, novelty, gap, contradiction and risk assessment | Cognitive outputs + provenance | Calibrated epistemic judgements |
| L6 | **Adaptive Layer** | Personalisation, learning, memory consolidation, profile evolution | All outputs + feedback | Adapted experience, consolidated memory, updated profiles |
| L7 | **Advisory Layer** | Domain intelligence modules: citation, methodology, writing, ethics, integrity, statistical, instrument, peer review, publication, grants, patents, career, learning, mentorship, institutional | Epistemic + cognitive outputs | Domain-grounded advice and artefacts |
| L8 | **Decision Layer** | Recommendation, prediction, prioritisation, planning, timeline generation | Advisory outputs | Recommended actions, plans, predictions, next best actions |
| L9 | **Agency Layer** | Multi-agent orchestration, delegation, task execution, conversation | Decision outputs | Executed tasks, agent-to-agent coordination, dialogues |
| L10 | **Presentation Layer** | Workspace rendering, conversation surfaces, explainability views, accessibility adaptation | All outputs | Researcher-facing experience |
| L11 | **Governance Layer** | Cross-cutting: security, privacy, ethics, integrity, audit, responsible AI, policy enforcement | All layers | Enforced policy, audit records, refusals, approvals |

### 4.3 Layer Rules

1. **Upward dependency only for data**: lower layers do not depend on upper
   layers for correctness.
2. **Downward invocation for services**: upper layers invoke lower-layer
   services through declared contracts, never through internals.
3. **Governance spans all**: L11 encloses every layer; no layer may bypass it.
4. **Confidence propagates**: each layer attaches confidence metadata that flows
   upward and is consumed by the Epistemic Layer.

### 4.4 Intelligence Domain Catalogue

Each **domain intelligence module** (Chapters 14–36) is realised as a service
within the Advisory Layer, consuming lower-layer outputs and producing
domain-specific artefacts. The mapping of each domain to its primary layers is
maintained in the Architecture Traceability Matrix (Chapter 70).

---

## Chapter 5 — Research Context Engine

### 5.1 Purpose

The Research Context Engine (RCE) maintains and supplies the **operative
context** for every CRIE interaction: the live, ordered, weighted body of
knowledge about the researcher's current work that any service, agent, or
surface needs in order to behave appropriately.

The RCE answers the question: *"Given where this researcher is, what does CRIE
need to know right now to be maximally useful and minimally wrong?"*

### 5.2 Context Sources

The RCE aggregates context from:

| Source | Description |
|---|---|
| Research Cognitive Model (Chapter 3) | Entity, stage, questions, hypotheses, concept map, status vector |
| Research Session state (Chapter 7) | Current session goals, active artefacts, recent actions |
| Workspace state (Chapter 8) | Open documents, active views, selected passages |
| Memory Architecture (Chapter 41) | Episodic, semantic, procedural, and working memory relevant to now |
| Conversation state (Chapter 42) | Recent dialogue, unresolved references, pending questions |
| Evidence Model | Claims under active consideration and their sources |
| Platform state | Notifications, activities, collaborations, deadlines (Chapters 51–58) |
| Environment | Device, connectivity, locale, accessibility profile, language |

### 5.3 Context Assembly

The RCE assembles context through a pipeline:

1. **Trigger** — a query, navigation, document open, conversation turn, or
   scheduled task requests context.
2. **Selection** — relevant elements are retrieved from all sources using
   relevance scoring against the current goal.
3. **Ordering and Weighting** — elements are ranked by recency, relevance,
   salience, and confidence.
4. **Budgeting** — context is bounded by an explicit context budget (tokens,
   time, complexity) so that responses remain coherent and performant.
5. **Synthesis** — a compact, coherent context pack is produced with pointers
   back to full provenance.
6. **Delivery** — the context pack is delivered to the consuming service.

### 5.4 Context Types

| Context Type | Description | Example |
|---|---|---|
| **Micro-context** | Immediate interaction scope (current passage, current question) | "the paragraph on NDVI saturation" |
| **Meso-context** | Current stage/task scope | "designing the sampling strategy" |
| **Macro-context** | Whole-entity scope | "the entire mangrove study" |
| **Eco-context** | Researcher-wide scope across entities | "all active research efforts and deadlines" |
| **Platform context** | Scholatia-wide signals relevant to the researcher | "3 deadlines, 2 collaborations, new funding call" |

### 5.5 Context Coherence and Staleness

- The RCE SHALL detect **staleness** (context no longer matching model state)
  and re-synthesise.
- The RCE SHALL detect **contradiction** between context elements and surface
  it.
- The RCE SHALL track a **context provenance** for every element so any
  statement derived from context is traceable.

### 5.6 Context Governance

- Context assembly SHALL respect privacy boundaries: only elements the actor is
  authorised to see are included (Chapter 60).
- Context SHALL be minimised to the purpose of the interaction.
- Sensitive context (unpublished findings, personal data) SHALL be flagged and
  protected.

---

## Chapter 6 — Research Session Engine

### 6.1 Purpose

The Research Session Engine (RSE) manages the **temporal envelope** of
researcher–CRIE interaction. A research session is a goal-directed period of
work (or conversation) that begins with an intent, carries context and memory
through its duration, and ends with consolidation.

### 6.2 Session Lifecycle

| Phase | Description |
|---|---|
| **Initiation** | Researcher or system opens a session with a goal (continue study X, draft methods section, explore literature on Y). |
| **Orientation** | RSE loads relevant context (Chapter 5), confirms goals, and declares a session plan. |
| **Working** | Context flows through the conversation and workspace; actions are executed; context evolves. |
| **Checkpointing** | Progress is summarised; work products are persisted; state is snapshotted. |
| **Transition** | Researcher may pause, resume, switch entities, or delegate to agents. |
| **Consolidation** | On end or timeout, the session writes lessons, memory deltas, and status updates back to the RCM and Memory (Chapter 41). |
| **Close** | Session is closed with an audit record of what occurred. |

### 6.3 Session Types

| Type | Description | Example |
|---|---|---|
| **Cognitive conversation** | Mixed-mode dialogue where CRIE reasons, advises, explains | "Explain the difference between NDVI and EVI" |
| **Task session** | Goal-directed execution, possibly agent-delegated | "Find 20 recent papers on coastal remote sensing" |
| **Drafting session** | Co-writing with provenance and citation control | "Draft the methods section" |
| **Review session** | Evaluation and critique (self-review, peer review, supervisor review) | "Critique this manuscript against journal scope" |
| **Planning session** | Timeline, milestone, and resource planning | "Build a 12-month plan" |
| **Learning session** | Pedagogical interaction (Chapter 34) | "Teach me structural equation modelling" |
| **Coaching session** | Supervisor/mentor guided interaction | "Weekly progress review" |

### 6.4 Session State and Continuity

- Sessions are **interruptible and resumable**. State SHALL be captured at
  every checkpoint.
- Sessions SHALL record their **context lineage** so that a resumed session
  reconstructs exactly the context it had.
- Sessions MAY spawn **child sessions** (e.g., a literature-finding task within
  a drafting session) and MUST record the parent linkage.

### 6.5 Session Governance and Limits

- Sessions SHALL respect role permissions (P16).
- Sessions SHALL be subject to time, cost, and load policies (Chapter 66).
- Sessions SHALL be audited (Chapter 62) including any agent delegation.

---

## Chapter 7 — Research Workspace Architecture

### 7.1 Purpose

The Research Workspace is the researcher's unified cognitive desktop. It renders
the Research Cognitive Model, hosts the document corpus, exposes intelligence
surfaces, and coordinates the conversation and tools — presenting one coherent
environment for the entire lifecycle.

### 7.2 Workspace Zones

| Zone | Contents | Purpose |
|---|---|---|
| **Command zone** | Universal input; intent parsing; session control; quick actions | Where the researcher expresses intent in natural language or structured commands |
| **Model zone** | Live Research Cognitive Model visualisation: stages, questions, hypotheses, concept map, argument map, status vector | The "mission control" of the researcher's study |
| **Corpus zone** | Document intelligence surfaces: library, reading, annotation, extraction (Chapter 13) | Where evidence lives |
| **Evidence zone** | Evidence Model views: claims, supports, contradictions, gaps (Chapter 15) | Where claims are managed |
| **Reasoning zone** | Explanations, arguments, deductions, causality (Chapter 12) | Where conclusions are examined |
| **Drafting zone** | Writing surfaces with citation, integrity, and style control (Chapters 24, 14) | Where artefacts are produced |
| **Advisory zone** | Domain intelligence outputs: methodology, statistics, ethics, review, publication, grants | Where domain experts assist |
| **Conversation zone** | Ongoing dialogue with full context and memory (Chapter 42) | Where the researcher converses with CRIE and its agents |
| **Planning zone** | Timeline, milestones, tasks, predictions (Chapters 38, 9) | Where the future is managed |
| **Activity zone** | Platform notifications, collaborations, deadlines (Chapters 51–58) | Where the ecosystem surfaces |
| **Governance zone** | Privacy, consent, data controls, audit view | Where trust is managed |

### 7.3 Workspace Behaviours

- **Zooming** — the researcher may zoom from eco-context (all studies) to
  micro-context (a single passage).
- **Bifocal attention** — the workspace supports focused work and ambient
  awareness simultaneously (e.g., drafting while a literature agent streams
  findings).
- **Drag-and-connect** — the researcher may drag evidence onto claims, sources
  onto the concept map, and artefacts into the corpus.
- **Anytime explanation** — every intelligence surface offers "why?" drilling
  into the Explainability Architecture (Chapter 63).
- **Multi-surface continuity** — the workspace state is synchronised through
  the Session Engine (Chapter 6) across devices.

### 7.4 Workspace Modes

The workspace adapts to the actor's role (P16):

| Mode | Description |
|---|---|
| **Student mode** | Guided, pedagogically enriched, tutor-like, with learning affordances (Chapter 34) |
| **Researcher mode** | Full working environment for active scholars |
| **Supervisor mode** | Portfolio view of supervisees, coaching surfaces, progress signals (Chapter 25) |
| **Reviewer mode** | Anonymised manuscript and evidence review with integrity checks (Chapter 26) |
| **Journal editor mode** | Desk-decision support: fit, novelty, integrity, reviewer matching (Chapter 27) |
| **Grant reviewer mode** | Proposal evaluation against criteria with evidence-based scoring (Chapter 30) |
| **Institution administrator mode** | Aggregate research intelligence, compliance, and portfolio analytics (Chapter 36) |

### 7.5 Workspace Extensibility

The workspace SHALL support third-party and internal extensions through declared
surface contracts (IN-### identifiers), enabling new zones, widgets, and tools
without core modification — consistent with P5 and P13.

# PART III — LIFECYCLE

---

## Chapter 8 — Research Lifecycle Architecture

### 8.1 Purpose

The Research Lifecycle Architecture (RLA) defines the fourteen canonical stages
of the scholarly lifecycle that CRIE companions. It is the temporal spine of the
Research Cognitive Model (Chapter 3). Every intelligence domain, agent, and
surface attaches to one or more stages.

The fourteen stages are: **Idea, Problem, Objectives, Questions, Hypotheses,
Literature, Framework, Methodology, Instrument, Analysis, Interpretation,
Publication, Impact, and Preservation.**

### 8.2 Stage Model

Each stage is described by:

| Attribute | Description |
|---|---|
| **Identity** | Canonical name and lifecycle stage identifier |
| **Purpose** | Why the stage exists |
| **Cognitive activities** | The mental work the researcher performs |
| **Artefacts** | Documents, data, and structures produced |
| **Intelligence support** | Which CRIE domains assist |
| **Entry/Exit criteria** | How the researcher knows they are ready to move on |
| **Risks** | Failure modes CRIE should detect |
| **Provenance obligations** | What must be recorded for auditability |

Stages are **not strictly sequential**. Research is iterative, and the RLA
supports loops (returning to literature when analysis contradicts a hypothesis),
jumps (spinning off a patent from a finding), and concurrency (multiple stages
active). The RCM records actual traversal, not idealised traversal.

---

### 8.3 Stage 1 — Idea

**Purpose:** The germination of a research impulse: a problem noticed, a
question sparked, a curiosity ignited.

**Cognitive activities:** Divergent thinking, curiosity articulation, problem
sensitivity, scoping, preliminary feasibility sensing.

**Artefacts:** Idea cards, initial problem statements, inspiration logs, early
mind-maps.

**Intelligence support:**
- **Ideation assistance:** structured ideation prompts, counterfactual and
  "what if" exploration, analogical inspiration from other fields.
- **Idea triage:** rough novelty and feasibility signals without over-claiming.
- **Idea memory:** capture and retrieval of past ideas for recombination.
- **Conversational incubator:** the researcher converses, CRIE records and
  reflects ideas back.

**Entry/Exit criteria:** Enter when a spark exists; exit when the idea matures
into a problem statement.

**Risks:** Premature convergence; stale ideas lost; idea hoarding without
evaluation; over-claiming novelty.

**Provenance obligations:** Record idea lineage, inspirations, and evolution.

---

### 8.4 Stage 2 — Problem

**Purpose:** The transformation of an idea into a well-formed, researchable
problem.

**Cognitive activities:** Problem definition, boundary setting, stakeholder and
context analysis, gap awareness, feasibility and significance assessment.

**Artefacts:** Problem statement, background synthesis, scope statement,
significance argument.

**Intelligence support:**
- **Problem framing assistance:** structured problem framing (e.g., problem,
  gap, significance, feasibility).
- **Problem scoping:** decomposition into tractable components.
- **Gap awareness:** linkage to Research Gap Intelligence (Chapter 17).
- **Feasibility sensing:** resource, access, and ethical feasibility signals.
- **Problem statement drafting with provenance.**

**Entry/Exit criteria:** Enter from Idea; exit when a clear, feasible,
significant problem is stated.

**Risks:** Ill-defined scope; socially trivial or infeasible problems; framing
biases.

---

### 8.5 Stage 3 — Objectives

**Purpose:** The translation of the problem into a coherent set of objectives
that guide all downstream work.

**Cognitive activities:** Goal setting, prioritisation, hierarchy construction,
success criteria definition.

**Artefacts:** Objective statement, objective hierarchy, success criteria,
deliverables list.

**Intelligence support:**
- **Objective formulation:** SMART-style and research-specific objective
  drafting.
- **Objective decomposition:** primary objectives to measurable sub-objectives.
- **Objective–problem alignment checking.**
- **Objective–method feasibility preview (linking to Methodology, Chapter 19).**

**Entry/Exit criteria:** Enter from Problem; exit when objectives are coherent,
aligned, and measurable.

---

### 8.6 Stage 4 — Questions

**Purpose:** The construction of the research question set that drives
investigation.

**Cognitive activities:** Question generation, hierarchical decomposition,
question refinement, evaluability assessment.

**Artefacts:** Research question set (primary, secondary, tertiary), sub-question
trees, question–objective mapping.

**Intelligence support:**
- **Question engineering:** generation, classification (descriptive,
  comparative, relational, causal), refinement.
- **Question decomposability analysis:** whether sub-questions can be answered
  by tractable studies.
- **Question–hypothesis bridging (Stage 5).**
- **Answerability and scope assessment.**
- **Question-set consistency checking.**

**Entry/Exit criteria:** Enter from Objectives; exit when questions are
answerable, non-trivial, and aligned.

---

### 8.7 Stage 5 — Hypotheses

**Purpose:** The formulation of testable propositions and predictions.

**Cognitive activities:** Hypothesis formulation, directional reasoning,
falsifiability assessment, operationalisation planning.

**Artefacts:** Hypothesis set, prediction statements, operational definitions,
testability notes.

**Intelligence support:**
- **Hypothesis formulation:** converting questions into falsifiable
  hypotheses with predicted direction and magnitude.
- **Falsifiability review.**
- **Hypothesis–evidence reconciliation** (linking forward to Evidence, Chapter
  15).
- **Operationalisation preview** (linking to Instrument, Chapter 23 and
  Statistics, Chapter 22).
- **Alternative hypotheses generation** to reduce confirmation bias.

---

### 8.8 Stage 6 — Literature

**Purpose:** The systematic engagement with prior scholarship.

**Cognitive activities:** Searching, screening, reading, summarising, critiquing,
synthesising, positioning.

**Artefacts:** Search strategy, screening log, source corpus, annotations,
syntheses, literature review drafts, gap positions.

**Intelligence support:**
- **Literature Intelligence (Chapter 16):** search support, screening,
  summarisation, synthesis.
- **Document Intelligence (Chapter 13):** ingestion and comprehension.
- **Citation Intelligence (Chapter 14):** automatic reference extraction and
  citation generation.
- **Evidence Intelligence (Chapter 15):** claim extraction and evidence
  organisation.
- **Novelty and Gap Intelligence (Chapters 17–18):** positioning the work
  against the field.
- **Concept and Theory Frame building (Chapter 10, 12).**

**Entry/Exit criteria:** Enter from earlier stages; iterative throughout; exit
when the researcher can state what is known, contested, and missing.

---

### 8.9 Stage 7 — Framework

**Purpose:** The construction of the conceptual and theoretical scaffolding.

**Cognitive activities:** Selecting/adapting theories, building conceptual
models, defining variables and constructs, establishing relations.

**Artefacts:** Conceptual framework, theoretical framework, construct map,
variable definitions, assumed relationships.

**Intelligence support:**
- **Framework builder:** constructs conceptual frameworks from the concept map
  and theory anchors.
- **Theory selection assistance:** suggesting and explaining candidate theories.
- **Construct operationalisation support.**
- **Framework coherence checking** (variables ↔ constructs ↔ questions ↔
  hypotheses).
- **Alternative frameworks** exploration.

---

### 8.10 Stage 8 — Methodology

**Purpose:** The design of the research approach.

**Cognitive activities:** Design selection, sampling strategy, data collection
planning, analysis planning, validity and reliability planning.

**Artefacts:** Research design, methodology section drafts, sampling plan,
data management plan, analysis plan.

**Intelligence support:**
- **Methodology Intelligence (Chapter 19):** design selection, method
  suitability, sampling advice, method–question alignment.
- **Statistical Intelligence (Chapter 22):** statistical approach selection,
  power considerations.
- **Instrument Intelligence (Chapter 23):** instrument selection and design.
- **Ethics integration (Chapter 20).**
- **Methodology–objective–question–hypothesis traceability checking.**

---

### 8.11 Stage 9 — Instrument

**Purpose:** The design, validation, and preparation of measurement and data
collection instruments.

**Cognitive activities:** Instrument drafting, validation design, piloting,
reliability assessment, finalisation.

**Artefacts:** Survey/questionnaire, interview protocols, observation
instruments, test instruments, codebooks, pilot results.

**Intelligence support:**
- **Instrument Intelligence (Chapter 23):** design, validation, item analysis,
  pilot analysis.
- **Statistical Intelligence (Chapter 22):** psychometric analysis (reliability,
  validity indices).
- **Ethics review integration (Chapter 20).**
- **Accessibility of instruments (Chapter 65).**

---

### 8.12 Stage 10 — Analysis

**Purpose:** The processing and analysis of data.

**Cognitive activities:** Data preparation, cleaning, exploration, statistical
and qualitative analysis, robustness checks.

**Artefacts:** Analysis scripts/protocols, cleaned data, result tables and
figures, analysis notes, audit trail.

**Intelligence support:**
- **Statistical Intelligence (Chapter 22):** method selection, assumption
  checking, result interpretation, reporting guidance.
- **Evidence linking:** mapping results back to hypotheses and evidence model.
- **Robustness and sensitivity analysis support.**
- **Reproducibility packaging.**

---

### 8.13 Stage 11 — Interpretation

**Purpose:** The derivation of meaning from results.

**Cognitive activities:** Sense-making, alternative explanations, limitations,
generalisability assessment, implications.

**Artefacts:** Discussion drafts, implications, limitations statements,
conclusions, claims to be supported.

**Intelligence support:**
- **Interpretation assistance:** generating candidate interpretations from
  results with appropriate caution.
- **Alternative-explanation generation** (reduce over-claiming).
- **Claim–evidence quality assessment (Chapters 12, 15).**
- **Limitation surfacing.**
- **Honesty of claims checking** against Evidence and Integrity (Chapters 15,
  21).

---

### 8.14 Stage 12 — Publication

**Purpose:** The preparation, submission, and stewardship of scholarly outputs.

**Cognitive activities:** Manuscript preparation, formatting, submission,
revision, response to reviewers.

**Artefacts:** Manuscripts, cover letters, response letters, metadata,
submission records.

**Intelligence support:**
- **Academic Writing Intelligence (Chapter 24).**
- **Publication Intelligence (Chapter 27).**
- **Journal Intelligence (Chapter 28):** journal matching, fit assessment,
  formatting.
- **Peer Review Intelligence (Chapter 26):** pre-submission self-review.
- **Integrity and originality checks (Chapters 18, 21).**
- **Citation style compliance (Chapter 14).**

---

### 8.15 Stage 13 — Impact

**Purpose:** The realisation and tracking of scholarly and societal impact.

**Cognitive activities:** Dissemination, engagement, citation and attention
tracking, outreach, policy influence.

**Artefacts:** Dissemination plan, impact logs, altmetrics, citation data,
outreach materials.

**Intelligence support:**
- **Research Analytics (Chapter 37) and Predictive Intelligence (Chapter 38):**
  citation prediction, impact tracking.
- **Recommendation Engine (Chapter 39):** dissemination channel suggestions.
- **Career Intelligence (Chapter 33):** linking impact to career signals.

---

### 8.16 Stage 14 — Preservation

**Purpose:** The long-term curation and reusability of research outputs.

**Cognitive activities:** Data curation, metadata completion, repository
deposit, licensing, documentation.

**Artefacts:** Archived datasets, deposit records, metadata, documentation,
DOIs/identifiers, preservation plans.

**Intelligence support:**
- **Preservation packaging:** completeness checks for data, code, and metadata.
- **FAIR support** (Findable, Accessible, Interoperable, Reusable).
- **Dataset Intelligence integration (existing Scholatia dataset module).**
- **Accession and licensing guidance.**

---

### 8.17 Cross-Stage Concerns

- **Traceability:** every artefact and decision traces to its stage and to the
  RCM.
- **Loops:** CRIE SHALL detect when a stage result invalidates earlier stage
  elements and propose loop-backs (e.g., analysis contradicts a hypothesis →
  revisit hypotheses or design).
- **Parallelism:** CRIE SHALL support concurrent stage activity (e.g., drafting
  manuscript while collecting data).
- **Institutional compliance:** stages SHALL respect institutional, funder, and
  ethical constraints (Chapters 20, 36, 61).

### 8.18 Lifecycle Stage — Intelligence Domain Matrix

| Stage | Primary Intelligence Domains |
|---|---|
| 1 Idea | Learning (34), Novelty (18), Gap (17), Analytics (37) |
| 2 Problem | Gap (17), Literature (16), Ethics (20) |
| 3 Objectives | Methodology (19), Planning, Predictive (38) |
| 4 Questions | Methodology (19), Statistical (22), Instrument (23) |
| 5 Hypotheses | Evidence (15), Statistical (22), Integrity (21) |
| 6 Literature | Document (13), Citation (14), Evidence (15), Literature (16), Novelty (18), Gap (17) |
| 7 Framework | Knowledge Graph (10), Semantic (11), Reasoning (12) |
| 8 Methodology | Methodology (19), Statistical (22), Ethics (20) |
| 9 Instrument | Instrument (23), Statistical (22), Ethics (20) |
| 10 Analysis | Statistical (22), Evidence (15), Integrity (21) |
| 11 Interpretation | Reasoning (12), Evidence (15), Integrity (21) |
| 12 Publication | Writing (24), Publication (27), Journal (28), Peer Review (26), Citation (14), Integrity (21) |
| 13 Impact | Analytics (37), Predictive (38), Recommendation (39), Career (33) |
| 14 Preservation | Dataset/Repository integration, Institutional (36), Ethics (20) |

# PART IV — KNOWLEDGE AND SEMANTICS

---

## Chapter 9 — Knowledge Graph Architecture

### 9.1 Purpose

The Knowledge Graph (KG) is the semantic backbone of CRIE. It is a typed,
weighted, temporal, provenance-aware graph of entities (concepts, authors,
documents, datasets, methods, instruments, institutions, journals, grants,
citations, claims, variables) and their relationships. It unifies the world's
scholarly knowledge with the researcher's own model, and it is the substrate for
semantic intelligence, reasoning, novelty detection, gap analysis, and
recommendation.

### 9.2 Design Goals

| Goal | Description |
|---|---|
| **Unified representation** | One graph semantics across documents, researchers, and scholarly artefacts |
| **Provenance-aware** | Every node and edge traces to source evidence |
| **Confidence-qualified** | Nodes and edges carry confidence and recency |
| **Temporal** | Knowledge has a time dimension (citation growth, concept evolution, discoveries) |
| **Multi-lingual** | Concepts are represented in a language-independent way with surface forms in many languages |
| **Extensible ontology** | New relation and entity types are added without schema rework |
| **Eco-compatible** | Composes with the existing Scholatia ecosystem knowledge graph (INTELLIGENCE_ARCHITECTURE.md) as a referencing layer |

### 9.3 Node Types

| Node type | Description | Example |
|---|---|---|
| **Concept** | A semantic unit of knowledge | "Mangrove degradation", "Structural equation modelling" |
| **Entity** | A resolvable real-world object | A researcher, institution, dataset |
| **Document** | A source artefact (paper, thesis, book, report) | DOI-resolvable paper |
| **Author** | An individual scholarly contributor | A named researcher |
| **Venue** | Journal, conference, publisher | A specific journal |
| **Method** | A research technique | "Random forest classification" |
| **Instrument** | A measurement tool | A validated survey |
| **Variable/Construct** | Operational concepts in studies | "Canopy density" |
| **Claim** | A proposition extracted from a source | "NDVI saturates at high biomass" |
| **Evidence** | A support/contradiction instance | A data table supporting a claim |
| **Gap** | An under-served research area | Undetected degradation in turbid waters |
| **Citation** | A referencing event | Paper A cites Paper B |
| **Research entity** | A CRIE study/project | The researcher's own study node |
| **Topic/Trend** | A cluster of concepts with momentum | Emerging research trend |

### 9.4 Relation Types (canonical)

The KG defines a canonical relation catalogue, extensible over time:

| Relation | Domain → Range | Semantics |
|---|---|---|
| **studies** | Author → Concept | An author works on a concept |
| **authoredBy** | Document → Author | Authorship |
| **publishedIn** | Document → Venue | Publication venue |
| **cites** | Document → Document | Citation |
| **references** | Claim → Document | Evidence source |
| **supports / contradicts** | Evidence → Claim | Evidential polarity |
| **subConceptOf / superConceptOf** | Concept → Concept | Taxonomic hierarchy |
| **relatedTo** | Concept → Concept | Semantic proximity (weighted) |
| **uses** | Document/Study → Method | Methodological usage |
| **measures** | Instrument → Variable | Operationalisation |
| **dependsOn** | Concept → Concept | Theoretical dependency |
| **motivates** | Study → Gap | Gap-driven research |
| **resultsIn** | Study → Document | Output generation |
| **fundedBy** | Study → Grant | Funding relationship |
| **affiliatedWith** | Author → Institution | Affiliation |
| **resolves** | Study → Question | Question addressing |
| **evidenceFor** | Evidence → Hypothesis | Hypothesis support |

### 9.5 Graph Operations

| Operation | Description |
|---|---|
| **Ingest** | Add nodes/edges from document understanding (Chapters 1–13) and platform records with provenance |
| **Resolve** | Entity/concept resolution across surface forms and languages (aliases, abbreviations, translations) |
| **Fuse** | Merge duplicate representations with conflict resolution and provenance retention |
| **Embed** | Compute semantic embeddings over subgraphs for retrieval and similarity |
| **Traverse** | Multi-hop navigation for reasoning and question answering |
| **Subgraph extract** | Extract the relevant subgraph for a context pack (Chapter 5) |
| **Update** | Apply temporal and confidence changes (new evidence strengthens/weakens edges) |
| **Query** | Declarative graph queries for analytics and domain modules |

### 9.6 Knowledge Fusion Rules

1. **Never lose provenance:** fusing two nodes preserves both provenance chains.
2. **Confidence merge:** conflicting facts retain separate representations with
   their respective confidence until resolution evidence arrives.
3. **Source authority weighting:** verifiable primary sources weigh more than
   derived summaries.
4. **Recency handling:** knowledge carries `validFrom` / `validUntil`; superseded
   knowledge is archived, not deleted.
5. **User-model integration:** the researcher's own model elements are fused with
   the global graph only with explicit researcher consent and clear ownership.

### 9.7 Graph Scale and Performance

- The KG SHALL support **billions of nodes and edges** at global scale.
- Traversal SHALL be optimised with a combination of in-memory caches for hot
  subgraphs and distributed storage for the cold graph.
- Retrieval for context assembly SHALL complete within interactive latency
  budgets defined in the Scalability chapter (Chapter 66).

### 9.8 Eco-Graph Relationship

CRIE's KG is the **cognitive superset** of the existing Scholatia ecosystem
graph. Where the ecosystem graph references records by SAID, DOI, and other
identifiers, CRIE's KG adds concept-, claim-, evidence-, and reasoning-level
structure. CRIE SHALL reference authoritative records rather than duplicate
them (P5, IN-### contracts in Chapters 46–58).

---

## Chapter 10 — Semantic Intelligence

### 10.1 Purpose

Semantic Intelligence (SI) is the layer that extracts, represents, and exploits
**meaning** — from text, tables, figures, equations, and multimodal sources. It
turns raw artefacts into the annotations, embeddings, and concept structures
that feed the Knowledge Graph, Reasoning, and every advisory domain.

### 10.2 Capability Areas

| Capability | Description |
|---|---|
| **Entity recognition** | People, organisations, places, dates, identifiers (DOI, ORCID, ISBN, PMID) |
| **Concept extraction** | Domain concepts and their surface forms across languages |
| **Relation extraction** | Typed relations between entities/concepts |
| **Claim extraction** | Proposition-level statements with polarity and confidence |
| **Event extraction** | Temporal scholarly events (discovery, publication, retraction) |
| **Terminology extraction** | Field-specific terminology and jargon |
| **Abbreviation resolution** | Expansion and disambiguation of abbreviations |
| **Co-reference resolution** | Resolving pronouns and referring expressions |
| **Discourse analysis** | Argumentative structure, rhetorical moves (IMRaD, etc.) |
| **Semantic roles** | Who did what to whom |
| **Cross-lingual alignment** | Concept identity across languages |
| **Embedding computation** | Dense vector representations for retrieval and similarity |
| **Table/figure semantics** | Meaning of tables, charts, diagrams, and their captions |
| **Mathematical/chemical semantics** | Meaning of equations, notation, chemical structures |

### 10.3 Semantic Annotation Model

Every semantic annotation records:

- **Anchor** — the exact location in the source artefact (document, page,
  span).
- **Type** — the annotation category.
- **Value** — the structured value (e.g., resolved entity ID, concept ID).
- **Confidence** — extraction confidence (calibrated per Chapter 63).
- **Provenance** — which pipeline stage produced it.
- **Version** — annotation model version (for reproducibility).
- **Language** — source language.

### 10.4 Semantic Services

| Service | Responsibility | Consumers |
|---|---|---|
| **Annotator** | Produces semantic annotations from canonical artefacts (L1 output) | KG ingest (Chapter 9), Evidence (15) |
| **Indexer** | Builds semantic and vector indexes over annotations and content | Retrieval (16), Context (5), Reasoning (12) |
| **Similarity service** | Computes semantic similarity between passages, concepts, documents | Literature (16), Recommendation (39) |
| **Concept linker** | Links surface forms to canonical KG concepts | KG (9), Novelty (18) |
| **Multilingual service** | Cross-lingual concept alignment and translation of scholarly passages | Learning (34), Literature (16) |
| **Disambiguation service** | Resolves ambiguous entities (multiple researchers with same name) | KG (9), Citation (14) |

### 10.5 Quality Assurance

- Annotation precision/recall SHALL be monitored per language and discipline.
- Low-confidence annotations SHALL NOT be treated as facts downstream.
- Semantic extraction SHALL be **reproducible**: the same artefact with the same
  model version yields the same annotations.
- Human verification workflows SHALL exist for high-stakes annotations (e.g.,
  research misconduct detection, ethical risk flagging).

---

## Chapter 11 — Reasoning Architecture

### 11.1 Purpose

Reasoning Architecture (RA) is CRIE's inference machinery: the organised set of
reasoning modes that derive conclusions, explanations, arguments, and decisions
from the Knowledge Graph, Evidence Model, and Research Cognitive Model. It is
the "thinking" layer, and it is strictly governed by evidence grounding (P6) and
explainability (P7).

### 11.2 Reasoning Modes

| Mode | Description | Example |
|---|---|---|
| **Deductive** | Deriving necessary conclusions from premises | If method M requires normality and data violates it, M is inapplicable |
| **Inductive** | Generalising from evidence | Repeated failures suggest a systematic barrier |
| **Abductive** | Best-explanation inference | The most plausible explanation of the anomaly is X |
| **Analogical** | Reasoning by structural similarity | This problem resembles problem P; its solution may transfer |
| **Causal** | Causal structure inference and counterfactual reasoning | What would change if variable V were altered? |
| **Statistical** | Probabilistic and statistical inference | Confidence intervals, hypothesis testing logic |
| **Temporal** | Reasoning over time, sequences, and trajectories | Trend momentum; citation growth projection |
| **Spatial/geospatial** | Reasoning over location and scale | Applying a local model at regional scale |
| **Normative/ethical** | Reasoning against norms, policies, and ethics | Does this consent procedure meet standards? |
| **Argumentative** | Constructing, analysing, and critiquing arguments | Building a claims-premises-warrant structure |
| **Design** | Generating and evaluating candidate designs | Methodology selection; instrument design |
| **Counterfactual** | What-if exploration for robustness | Testing interpretations against alternatives |
| **Meta-cognitive** | Reasoning about reasoning | Assessing the confidence and limitations of a conclusion |

### 11.3 Reasoning Pipeline

1. **Framing** — convert the researcher's query/task into a reasoning problem
   over the RCM and evidence.
2. **Evidence retrieval** — gather relevant, provenance-bearing evidence from the
   KG, corpus, and memory (Chapters 9, 13, 41).
3. **Premise selection** — choose and justify the premises to reason from.
4. **Inference** — apply the appropriate reasoning modes.
5. **Conclusion formation** — form conclusions with calibrated confidence
   (Chapter 63).
6. **Explanation generation** — produce an explanation trace: premise → rule →
   intermediate → conclusion.
7. **Challenge/validation** — actively test the conclusion for alternatives,
   contradictions, and overreach (integrity guard, Chapter 21).
8. **Delivery** — present with sources, confidence, and alternatives.

### 11.4 Argumentation Support

CRIE SHALL support building and critiquing structured arguments:

- **Claim + premise + warrant + backing + rebuttal + qualifier** structure
  (Toulmin-inspired).
- Argument mapping with evidence anchoring per premise.
- Argument strength scoring and fallacy detection (guarded, never overclaiming
  about fallacies).
- Support for both the researcher's own arguments and the reconstruction of
  arguments from literature.

### 11.5 Causal Reasoning

- Causal structure learning from observational evidence SHALL be presented with
  appropriate epistemic humility (correlation ≠ causation is surfaced).
- Counterfactual reasoning SHALL be used for robustness testing of
  interpretations (Stage 11).
- Causal claims in output SHALL carry the quality of evidence supporting them.

### 11.6 Reasoning Integrity

- **No ungrounded conclusions:** every conclusion must reference supporting
  evidence or be explicitly labelled speculative.
- **Alternative hypothesis pressure:** reasoning pipelines SHALL generate and
  weigh alternatives before settling.
- **Confirmation bias guard:** reasoning SHALL seek disconfirming evidence
  deliberately.
- **Refusal:** reasoning SHALL refuse to produce conclusions that would violate
  the Constitution (e.g., fabricate support for a false claim).

### 11.7 Reasoning and Multi-Agent Composition

Reasoning is exposed as a service that agents (Chapter 43) invoke. Agent reasoning
is unified through the same pipeline so that any agent conclusion carries the
same provenance, confidence, and explanation guarantees.

# PART V — EVIDENCE AND DOCUMENTS

---

## Chapter 12 — Document Intelligence Architecture

### 12.1 Purpose

Document Intelligence (DI) is CRIE's capability to ingest, understand, and work
with the full breadth of scholarly artefacts. It is the perception layer (L1)
that converts raw files into canonical, structured, searchable, and
evidence-ready content. DI makes the **entire document readable** — not a
search snippet, not a summary, but the complete artefact understood.

### 12.2 Supported Artefact Types

| Artefact type | Key challenges addressed by DI |
|---|---|
| **PDF** | Text extraction, layout reconstruction, embedded tables/figures, scanned pages, multi-column, mathematical notation, text in figures |
| **DOCX / DOC** | Native structure, styles, tracked changes, comments, equations, embedded objects |
| **EPUB** | Reflowable structure, semantic markup, reading order, media |
| **HTML** | Structural semantics, tables, math (e.g., LaTeX/MML), navigation |
| **TXT / Markdown / plain text** | Encoding detection, structure inference, minimal metadata |
| **Scanned documents (OCR)** | Image-based recognition, layout analysis, reading order, degraded quality handling |
| **Images** | Figures, diagrams, charts, photographs with semantic understanding and caption correlation |
| **Supplementary files** | Appendices, data descriptors, protocols, code listings |
| **Datasets** | Data dictionaries, schemas, sampling metadata, linkage to analysis |
| **Spreadsheets / tabular data** | Sheet structure, header detection, cell semantics, units |
| **Presentation slides** | Slide structure, visual hierarchy, speaker notes |
| **Audio/video (lectures, interviews)** | Transcription, speaker diarisation, timestamping (for learning and interview data) |
| **Legacy formats** | Older office formats, scientific legacy formats, format conversion |

### 12.3 DI Processing Pipeline

1. **Ingestion** — capture the artefact and its raw bytes, compute a content
   fingerprint, register provenance.
2. **Format detection and validation** — identify actual format, validate
   integrity, detect anomalies.
3. **Parsing** — extract the structural document model: pages, sections,
   headings, paragraphs, tables, figures, equations, lists, citations.
4. **Conversion to canonical form** — a format-independent canonical document
   representation (CDR) that all downstream layers consume.
5. **OCR fallback** — for scanned/image content, recognise text with layout
   reconstruction.
6. **Table and figure extraction** — capture tabular structure and figure
   content with captions and in-text references.
7. **Semantic enrichment** — hand the CDR to Semantic Intelligence (Chapter 10)
   for annotation.
8. **Reference extraction** — identify and normalise bibliographic references
   (Chapter 14).
9. **Verification pass** — validate extraction quality; flag low-confidence
   regions for human review.
10. **Publication to corpus** — register the enriched artefact in the corpus
    zone and Knowledge Graph (Chapter 9).

### 12.4 Canonical Document Representation (CDR)

The CDR SHALL preserve, at minimum:

- Document identity, source file, and provenance chain.
- Document structure (section tree with types).
- Textual content with exact span locations.
- Tables with cell coordinates and inferred structure.
- Figures with captions, embedded text, and image references.
- Equations with machine-readable form where available.
- Citation instances with span locations.
- Metadata (title, authors, dates, identifiers).
- Language and encoding metadata.
- Extraction confidence per region.

The CDR is the single interchange format: all downstream services consume CDR
and never parse raw files again. This is the key to **reading entire PDFs** and
making every region addressable, quotable, and evidence-linkable.

### 12.5 Reading Modes

| Mode | Description |
|---|---|
| **Full read** | Complete ingestion and semantic enrichment (the default for trusted sources) |
| **Selective read** | Indexed ingestion with on-demand deep reading of regions |
| **Streaming read** | Progressive ingestion for very large documents |
| **Incremental read** | Ingestion of diffs/revisions with provenance of change |
| **Deep read** | Extra passes: OCR refinement, equation transcription, figure analysis |

### 12.6 Specialised Sub-Capabilities

| Sub-capability | Description |
|---|---|
| **Layout-aware extraction** | Preserves reading order and visual hierarchy |
| **Table understanding** | Recovers merged cells, headers, and units; enables table search and citation |
| **Figure understanding** | Diagram/chart semantics, axis/legend extraction, caption correlation |
| **Equation understanding** | LaTeX/MathML conversion for search and reuse |
| **Reference parsing** | Extraction, disambiguation, and normalisation of bibliographic references |
| **Citation-span alignment** | Maps in-text citation markers to reference list entries and to target documents |
| **Annotation export** | Export of annotations (highlights, notes, tags) in open formats |
| **Format conversion** | Standards-based conversion among supported formats preserving semantics |
| **Document genealogy** | Version trees of documents across revisions |
| **Cross-document linkage** | Detecting duplicates, related versions, preprints↔published pairs |

### 12.7 DI Quality and Reproducibility

- Extraction accuracy SHALL be measured per format, language, and document
  class.
- OCR confidence SHALL be surfaced to users when material is consumed.
- Extraction SHALL be deterministic for a given pipeline version.
- Any downstream assertion grounded in extracted content carries the extraction
  confidence (Calibrated Confidence, Article VIII).

### 12.8 DI and the Special Capabilities

DI is the enabler of the following special capabilities (Appendix A):
uploading research documents; reading entire PDFs; extracting references;
finding relevant paragraphs; summarising literature; explaining concepts; and
evidence location.

---

## Chapter 13 — Citation Intelligence

### 13.1 Purpose

Citation Intelligence (CI) manages every aspect of bibliographic referencing:
reference extraction, resolution, style-aware citation generation, in-text
citation management, bibliography construction, and citation analytics. It is
standards-driven (P17) and integrates with the Knowledge Graph's citation
structure (Chapter 9).

### 13.2 Supported Citation Styles

| Style family | Coverage notes |
|---|---|
| **APA** (American Psychological Association) | Versions 6 and 7; author–date; multiple editions and institutional variants |
| **MLA** (Modern Language Association) | Editions 8 and 9; humanities conventions |
| **Chicago** | Notes–bibliography and author–date; 17th edition and variants |
| **Harvard** | Author–date with institutional variants |
| **IEEE** | Numerical style; engineering and computer science |
| **Vancouver** | Numerical style; biomedical sciences |
| **OSCOLA** | Legal scholarship; footnotes and tables of cases/legislation |
| **Custom institutional styles** | Institution-defined templates, country-specific conventions (e.g., ABNT, GBT 7714, JIS), and journal-specific house styles |

### 13.3 Citation Processing Pipeline

1. **Reference extraction** — pull candidate references from documents (CDR,
   Chapter 12) with span locations.
2. **Reference normalisation** — parse reference strings into structured fields
   (authors, title, venue, volume, pages, identifiers).
3. **Resolution** — resolve references to canonical bibliographic records via
   identifiers (DOI, ISBN, PMID, arXiv ID, etc.) and the Knowledge Graph.
4. **In-text citation mapping** — associate in-text markers with resolved
   records.
5. **De-duplication and disambiguation** — merge duplicates; disambiguate
   ambiguous citations.
6. **Style formatting** — generate citation/bibliography entries in the
   requested style.
7. **Compliance validation** — validate against style rules; flag errors.
8. **Citation analytics** — citation counts, networks, patterns, self-citation
   detection, retraction awareness.

### 13.4 Capability Surfaces

| Capability | Description |
|---|---|
| **Automatic citation generation** | Cite-while-you-write from resolved records |
| **Bibliography construction** | Complete reference lists in any supported style |
| **Style switching** | Reformat all citations when the target style changes (journal, thesis, grant) |
| **Citation import** | From PDFs, RIS/BibTeX, URLs, and identifiers |
| **Citation export** | To RIS, BibTeX, CSL-JSON, and institutional formats |
| **CSL support** | Citation Style Language as the open interchange for styles |
| **Retraction awareness** | Flag citations to retracted/corrected works |
| **Citation context** | Show how/where a work is cited (claim-level, Chapter 15) |
| **Citation ethics** | Surface inappropriate citation practices (e.g., coercive self-citation) in review contexts |

### 13.5 Quality and Integrity

- Citation validation SHALL detect: fabricated references (references that do
  not exist), mis-citations (reference cited for content it does not support),
  and duplicate/missing entries.
- CRIE SHALL NOT generate a reference to a document it has not verified unless
  the unverified status is explicit.
- Citation data SHALL respect publisher and copyright terms.

---

## Chapter 14 — Evidence Intelligence

### 14.1 Purpose

Evidence Intelligence (EI) is the system's capacity to extract, organise,
assess, and trace evidence: the claims, data, and reasoning that underpin
scholarly conclusions. EI is the heart of the "evidence-anchored" philosophy
(Chapter 1.5) and the foundation of Research Gap, Novelty, and Integrity
capabilities.

### 14.2 Evidence Model

| Element | Description |
|---|---|
| **Claim** | A proposition asserted in or derived from a source |
| **Evidence instance** | A specific support/contradiction: source + location + content |
| **Evidence polarity** | Supports / contradicts / neutral relative to a claim |
| **Evidence strength** | Quality assessment: study design, sample, method soundness, recency, independence |
| **Evidence chain** | Multi-hop chain: claim ← evidence ← data/underlying source |
| **Knowledge state** | The consolidated epistemic status of a claim across all evidence |
| **Contradiction** | Explicitly recorded conflict between evidence instances |
| **Gap** | Absence or insufficiency of evidence on a question |

### 14.3 Evidence Extraction

- Claims SHALL be extracted from documents with exact span provenance.
- Evidence polarity SHALL be inferred with confidence and human-review
  affordances for high-stakes use.
- Evidence from tables, figures, and data SHALL be linked to its numeric or
  visual source.
- Extracted evidence SHALL be deposited into the Evidence Model (RCM) and the
  Knowledge Graph (Chapter 9).

### 14.4 Evidence Assessment

EI SHALL produce structured assessments:

| Dimension | Question addressed |
|---|---|
| **Relevance** | Does this evidence bear on the claim? |
| **Source quality** | How trustworthy is the source venue and methodology? |
| **Timeliness** | Is the evidence current for the field? |
| **Independence** | Is it independent of the claim's author? |
| **Internal validity** | Does the study design support the inference? |
| **External validity** | Does it generalise to the context at hand? |
| **Reproducibility** | Is the evidence reproducible from available materials? |

### 14.5 Contradiction Management

- Contradictions SHALL be surfaced, not hidden.
- CRIE SHALL present both sides with their evidence and confidence.
- When contradictions matter to the researcher's claims, EI SHALL advise on
  how to handle them in the manuscript (transparency, limitation, or
  reconciliation).

### 14.6 Special Capability: Finding Supporting and Contradictory Evidence

EI SHALL implement, as first-class capabilities:
- **Finding supporting evidence** for a claim/argument across the corpus and
  the global literature, ranked by evidence quality.
- **Finding contradictory evidence** deliberately, so the researcher is never
  insulated from disconfirmation (Confirmation-bias guard, Chapter 11.6).

---

## Chapter 15 — Literature Intelligence

### 15.1 Purpose

Literature Intelligence (LI) is CRIE's scholarly reading, searching, screening,
and synthesis companion. It spans the Literature stage (Stage 6) and supports
every stage that needs the field's knowledge. LI is a **reasoning partner**, not
merely a retrieval engine.

### 15.2 Capability Areas

| Capability | Description |
|---|---|
| **Search support** | Query formulation, Boolean and semantic search, multilingual querying |
| **Retrieval** | Corpus and global literature retrieval with provenance and deduplication |
| **Screening** | Title/abstract screening support with explicit inclusion/exclusion criteria and audit trail (PRISMA-style) |
| **Reading support** | Deep reading, passage location, annotation, and note capture (Chapter 12) |
| **Summarisation** | Single-paper summaries; section-level summaries; corpus-level syntheses |
| **Synthesis** | Thematic synthesis, matrix synthesis (study × dimension), narrative synthesis |
| **Positioning** | Placing the researcher's work in the field (related work, gaps, novelty) |
| **Gap mapping** | Mapping what is known/unknown/contested (Chapters 17, 18) |
| **Critical appraisal** | Methodological critique of sources (Chapter 19, 22) |
| **Concept mapping** | Building the concept model from literature (Chapters 3, 10) |

### 15.3 Search and Screening Workflow

1. **Question-driven search planning** — translate research questions into
   search strategy components.
2. **Multi-source retrieval** — federate across indexes and the corpus,
   deduplicate.
3. **Screening** — apply criteria, record decisions with reasons and timestamps.
4. **Full-text acquisition** — ingest selected sources through DI (Chapter 12).
5. **Extraction** — extract evidence (Chapter 14), concepts (Chapter 10), and
   citations (Chapter 13).
6. **Synthesis** — produce syntheses with per-claim provenance.

### 15.4 Summarisation Quality

- Summaries SHALL distinguish author's claim from CRIE's commentary.
- Summaries SHALL include span-level source pointers.
- Length and depth SHALL adapt to context (quick brief vs. deep synthesis).
- Summary confidence SHALL be calibrated (Article VIII).

### 15.5 Meta-Scientific Integrity

- Search and screening SHALL be **auditable**: the full decision trail is
  retained for systematic reviews.
- LI SHALL NOT silently filter out dissenting evidence; contradiction handling
  follows Chapter 14.5.
- LI SHALL respect copyright and licensing in full-text handling.

---

## Chapter 16 — Research Gap Intelligence

### 16.1 Purpose

Research Gap Intelligence (RGI) identifies, characterises, and prioritises
research gaps — the under-served, under-evidenced, or newly opened spaces where
research is needed and can be novel.

### 16.2 Gap Types

| Gap type | Description | Example |
|---|---|---|
| **Evidence gap** | Insufficient evidence on a question | Few studies on turbid-water mangrove monitoring |
| **Methodological gap** | Methods inapplicable or missing | No validated method for X in context Y |
| **Contextual gap** | Findings not yet extended to a context | Remote sensing not validated in mangroves |
| **Population/sample gap** | Under-studied populations | Coastal communities in region R |
| **Temporal gap** | Outdated evidence | Studies predate current land-use changes |
| **Theoretical gap** | Missing or contested theory | No framework linking A and B |
| **Data gap** | Missing or inaccessible data | No open dataset for X |
| **Practical gap** | Gap between research and application | Findings not translated to policy tools |

### 16.3 Gap Detection Pipeline

1. **Landscape analysis** — map the field's evidence density from the KG
   (Chapters 9, 10).
2. **Controversy detection** — find contested, contradictory, or unresolved
   areas (Chapter 14.5).
3. **Population analysis** — estimate coverage by population, geography, time.
4. **Method analysis** — detect methodological biases and missing methods.
5. **Clustering** — identify coherent gap clusters with descriptors.
6. **Opportunity assessment** — novelty potential, feasibility, and significance
   (linked to Chapters 18, 38).
7. **Priority recommendation** — rank gaps by opportunity × feasibility ×
   significance.

### 16.4 Gap Governance

- Gap claims SHALL be evidence-grounded (a gap must cite the absence of
  evidence, not just assert it).
- Gaps SHALL be time-stamped and updated as the field moves.
- Gap signals in the researcher's model SHALL drive literature and novelty
  positioning.

---

## Chapter 17 — Novelty Detection

### 17.1 Purpose

Novelty Detection (ND) assesses the extent to which a researcher's idea, claim,
or contribution is new relative to the global scholarly record — and, equally
important, **how** it is new.

### 17.2 Novelty Dimensions

| Dimension | Description |
|---|---|
| **Topical novelty** | The topic/combination of topics is under-represented |
| **Methodological novelty** | A new or newly applied method |
| **Contextual novelty** | Established methods applied to a new context |
| **Theoretical novelty** | New or refined theoretical contribution |
| **Synthesis novelty** | Novel integration of existing findings |
| **Claim novelty** | The specific claim is not already established |
| **Application novelty** | New application domain for existing knowledge |

### 17.3 Novelty Assessment Pipeline

1. **Contribution extraction** — identify the candidate's key claims (Chapter
   14, RCM).
2. **Retrieval of nearest prior work** — find the closest existing literature
   via KG and embeddings (Chapters 9, 10).
3. **Similarity profiling** — quantify overlap by dimension (topic, method,
   claim, context).
4. **Difference extraction** — articulate precisely what differs.
5. **Prior-art claims analysis** — determine whether the specific claim already
   exists.
6. **Novelty profile** — produce a per-dimension novelty signal with evidence.
7. **Novelty statement assistance** — draft defensible novelty statements for
   the manuscript.

### 17.4 Integrity and Epistemics

- ND SHALL NOT over-claim novelty; it reports similarity honestly.
- ND SHALL flag **inadvertent duplication** — the researcher's idea may already
  exist — as a constructive signal.
- ND SHALL be used in good faith: to strengthen research and honest positioning,
  not to game novelty metrics.
- ND claims SHALL carry the evidence of the nearest prior work.

---

## Chapter 18 — Methodology Intelligence

### 18.1 Purpose

Methodology Intelligence (MI) advises on the design of research: selecting,
justifying, and refining methodologies that fit the researcher's questions,
context, and constraints. MI spans the Methodology (Stage 8) and Instrument
(Stage 9) stages and informs Analysis (Stage 10).

### 18.2 Capability Areas

| Capability | Description |
|---|---|
| **Design selection** | Match research questions to appropriate designs (experimental, quasi-experimental, observational, qualitative, mixed, case study, etc.) |
| **Method suitability assessment** | Assess fit of candidate methods to questions, data type, and context |
| **Sampling advice** | Sampling frames, sizes, strategies, and representativeness |
| **Data collection planning** | Instrument selection, protocols, and logistics |
| **Analysis planning** | Statistical and qualitative analysis approaches (Chapter 22) |
| **Validity/reliability planning** | Threats to validity, mitigation strategies |
| **Methodological critique** | Critical appraisal of own and others' designs |
| **Method novelty** | Methodological innovation support (Chapter 17) |
| **Feasibility analysis** | Resource, time, access, and ethical feasibility |
| **Methodology documentation** | Drafting rigorous methods sections with provenance |

### 18.3 Method–Question Alignment

MI SHALL enforce traceability: every method recommended SHALL be justifiable
against the research questions, objectives, hypotheses, and data availability.
Where alignment is weak, MI SHALL surface the tension explicitly (Chapter 11).

### 18.4 Design Space and Alternatives

- MI SHALL present a **design space**: the candidate designs ranked by fit with
  trade-offs explained.
- MI SHALL generate **alternative designs** to broaden the researcher's options.
- MI SHALL document rejected alternatives and rationale (Decision History, RCM).

### 18.5 Methodological Integrity

- MI SHALL refuse to recommend methods that would be deceptive, biased, or
  unethical (e.g., p-hacking pathways).
- MI SHALL promote pre-registration and transparent reporting practices.
- MI SHALL surface methodological controversies honestly.

---

## Chapter 19 — Research Ethics Intelligence

### 19.1 Purpose

Research Ethics Intelligence (REI) embeds ethical reasoning throughout the
lifecycle: from design-time ethics review, to participant protection, to
publication and impact ethics. REI operationalises Constitution Articles IV and
VI.

### 19.2 Ethics Domains

| Domain | Description |
|---|---|
| **Human subjects** | Consent, coercion, vulnerability, privacy, data protection |
| **Animal research** | Welfare, justification, approval requirements |
| **Environmental ethics** | Impact, sustainability, non-harm |
| **Data ethics** | Data provenance, secondary use, bias, sensitive data |
| **AI ethics** | Algorithmic fairness, transparency, accountability of AI-assisted research |
| **Publication ethics** | Authorship, plagiarism, dual submission, image manipulation, data fabrication/falsification (Chapter 21) |
| **Community ethics** | Indigenous knowledge, community consent, benefit-sharing |
| **Open science ethics** | Openness vs. privacy, harm from publication |
| **Institutional compliance** | Ethics board requirements, funder requirements (Chapter 36) |

### 19.3 Ethics Integration Points

| Lifecycle stage | Ethics support |
|---|---|
| Idea/Problem | Early ethical risk sensing (social value, harm potential) |
| Questions/Hypotheses | Ethical question screening |
| Methodology | Design-level ethics (consent design, risk minimisation) |
| Instrument | Instrument-level review (survey sensitivity, coercion) |
| Analysis | Data protection, bias auditing |
| Publication | Authorship, reporting, dual submission |
| Impact | Responsible dissemination, dual-use concern |

### 19.4 Ethics Review Support

- **Pre-review assistance:** flag ethics considerations and draft ethics
  application materials.
- **Compliance checking:** match applications against institutional and funder
  templates.
- **Amendment support:** track changes requiring re-approval.
- **Audit support:** produce the ethics trail for Chapter 62.

### 19.5 Ethics Refusals

REI SHALL refuse to assist with research that, on the available evidence, would
violate core ethical norms — and SHALL explain the refusal and refer the
researcher to appropriate authorities (Chapter 20, Governance 61).

---

## Chapter 20 — Research Integrity Intelligence

### 20.1 Purpose

Research Integrity Intelligence (RII) protects the soundness of the research
record. It detects, discourages, and documents threats to integrity — for the
researcher's own work (constructive) and for the work of others (review and
editorial contexts).

### 20.2 Integrity Threat Catalogue

| Threat | Detection support |
|---|---|
| **Plagiarism** | Textual and idea-level similarity against the corpus and literature |
| **Self-plagiarism / text recycling** | Reuse of the author's own published text beyond acceptable bounds |
| **Data fabrication** | Statistical and pattern anomalies suggesting invented data |
| **Data falsification** | Manipulation of results, selective reporting |
| **Image manipulation** | Image forensic checks on figures |
| **Citation manipulation** | Coercive/excessive self-citation, citation farming |
| **Authorship issues** | Ghost/gift authorship patterns, author contribution mismatches |
| **Duplicate/overlapping publication** | Detection of same-core-content submissions |
| **Fabricated references** | Verification that cited works exist and say what is claimed (Chapter 13.5) |
| **p-hacking / questionable practices** | Post-hoc hypothesising, selective outcome reporting (Chapter 22) |
| **Predatory venue involvement** | Red-flag signalling for venues/publishers (Chapters 27, 28) |

### 20.3 Integrity Workflow

1. **Preventive** — in-writing integrity checks (drafting with original
   expression, correct quoting, honest citation).
2. **Detective** — screening of manuscripts (author's own or under review) for
   the threats above, with calibrated confidence.
3. **Corrective** — constructive guidance for the researcher's own work.
4. **Reporting** — structured integrity reports for reviewers, editors, and
   administrators, respecting confidentiality and due process (Chapters 26, 27,
   61).

### 20.4 Integrity Principles

- **Benevolent presumption:** integrity flags are constructive hypotheses, not
  accusations; they are presented with evidence and confidence.
- **Calibrated claims:** detection tools SHALL NOT overclaim certainty.
- **Human adjudication:** consequential integrity findings SHALL be confirmed
  by appropriately authorised humans before action (Chapter 61).
- **Refusal:** RII SHALL refuse to help fabricate, falsify, or disguise (Article
  III).

---

## Chapter 21 — Statistical Intelligence

### 21.1 Purpose

Statistical Intelligence (SI) supports the researcher across the statistical
lifecycle: design, analysis, interpretation, and reporting — with rigour,
honesty, and reproducibility.

### 21.2 Capability Areas

| Capability | Description |
|---|---|
| **Design-stage statistics** | Power analysis, sample size, effect size planning |
| **Method selection** | Choosing tests/models matched to design and data assumptions |
| **Assumption checking** | Normality, homogeneity, independence, and other assumption diagnostics |
| **Data preparation guidance** | Cleaning, transformation, missing-data strategies (with honesty about their effects) |
| **Analysis execution guidance** | Running and interpreting analyses correctly |
| **Model selection and comparison** | Candidate models, information criteria, validation |
| **Diagnostics and robustness** | Sensitivity analysis, out-of-sample checks |
| **Interpretation** | Effect sizes, uncertainty, practical significance |
| **Reporting** | Transparent statistical reporting (e.g., sample, assumptions, methods, uncertainties) |
| **Replication support** | Analysis pipelines that can be rerun |
| **Meta-analysis support** | Effect aggregation across studies |

### 21.3 Statistical Integrity

- **No p-hacking:** SI SHALL refuse to suggest analytic paths whose purpose is
  to reach a desired significance.
- **Multiple-testing honesty:** SI SHALL surface multiple-comparison issues.
- **Uncertainty first:** every reported statistic SHALL be accompanied by its
  uncertainty.
- **Preregistration alignment:** SI SHALL support comparing declared vs.
  conducted analyses.
- **Expert-in-the-loop:** consequential statistical conclusions SHALL be
  confirmed with appropriately trained humans (Chapter 61).

### 21.4 Statistical Education

SI SHALL explain statistical concepts pedagogically (Chapter 34) — the 
"why" behind the "how" — so researchers grow in statistical literacy.

---

## Chapter 22 — Instrument Intelligence

### 22.1 Purpose

Instrument Intelligence (II) supports the design, validation, deployment, and
refinement of measurement and data-collection instruments.

### 22.2 Capability Areas

| Capability | Description |
|---|---|
| **Instrument design** | Drafting surveys, questionnaires, interview protocols, observation schemes, tests |
| **Item writing and review** | Item construction, clarity, bias, and alignment review |
| **Validation planning** | Content, construct, criterion validity designs |
| **Pilot study support** | Pilot design and execution support |
| **Psychometric analysis** | Reliability (alpha, omega, test-retest), item analysis, factor structure |
| **Instrument adaptation** | Cross-cultural and cross-language adaptation and translation |
| **Instrument documentation** | Codebooks, manuals, administration protocols |
| **Instrument sourcing** | Finding and evaluating existing validated instruments |
| **Ethics of instruments** | Sensitive item review, consent integration (Chapter 19) |

### 22.3 Instrument–Model Alignment

II SHALL trace every instrument item/component to a construct, variable, and
research question — so that measurement is defensible and auditable (Chapters 3,
9).

### 22.4 Quality and Integrity

- Psychometric claims SHALL be supported by the actual pilot/study data.
- II SHALL NOT recommend instruments that are invalidated or that would
  disadvantage groups (bias review, Chapter 19/64).

---

## Chapter 23 — Academic Writing Intelligence

### 23.1 Purpose

Academic Writing Intelligence (AWI) is CRIE's co-authoring companion: it
supports the production of rigorous, original, well-structured academic text —
while preserving the researcher's voice, argument, and ownership (Article I).

### 23.2 Writing Modes

| Mode | Description |
|---|---|
| **Assisted drafting** | The researcher writes with inline assistance (completion, rephrasing, clarity) |
| **Section drafting** | CRIE drafts sections from the RCM and evidence with citations |
| **Outline development** | Building logical outlines from the argument model |
| **Revision support** | Rewriting, condensing, restructuring with tracked rationale |
| **Editing support** | Clarity, concision, flow, grammar (without over-standardisation) |
| **Style alignment** | Target venue/level style (journal, thesis, report) |
| **Commentary drafting** | Response letters, reviewer responses, cover letters |
| **Ancillary writing** | Abstracts, titles, keywords, plain-language summaries |

### 23.3 Provenance of Writing

- Every generated passage SHALL indicate the evidence and sources it draws on.
- Every claim in generated text SHALL be grounded or marked as the researcher's
  own assertion.
- Generated text SHALL NOT be silently merged into the researcher's authored
  voice without explicit authorisation.
- Where disclosure of AI assistance is required by policy, AWI SHALL support
  compliant disclosure statements.

### 23.4 Originality and Integrity

- AWI SHALL encourage original expression: it helps the researcher say what they
  mean in their own way, rather than cloning templates.
- AWI SHALL integrate with Integrity Intelligence (Chapter 20): generated text
  is checked for unintended similarity.
- AWI SHALL NOT "polish" a passage into misrepresentation.

### 23.5 Writing Education

AWI SHALL teach writing craft (Chapter 34): explanations of why a revision is
better, discipline conventions, and argumentation quality.

# PART VI — SCHOLARLY PRACTICE

---

## Chapter 24 — Supervisor Intelligence

### 24.1 Purpose

Supervisor Intelligence (SVI) supports supervisors in guiding, monitoring, and
developing their supervisees — and supports supervisees in having productive
supervision relationships. It operates in Supervisor mode (Chapter 7.4).

### 24.2 Capability Areas

| Capability | Description |
|---|---|
| **Portfolio overview** | Aggregate view of all supervisees' progress, risks, and needs |
| **Progress monitoring** | Stage-progress signals from the RCM (Chapter 3) with consent boundaries |
| **Risk identification** | Stalling, drift, low-confidence, ethics, and integrity risk signals |
| **Coaching support** | Structured coaching dialogue, developmental goals |
| **Meeting preparation** | Agenda generation from supervisee state; minutes and action capture |
| **Feedback drafting** | Constructive feedback with evidence, respecting the supervisee's voice |
| **Milestone planning** | Milestone and timeline management (Chapters 9, 38) |
| **Mentorship linkage** | Hand-off to Mentorship Intelligence (Chapter 35) |
| **Record keeping** | Supervision logs, agreements, and consent records (Chapter 62) |

### 24.3 Privacy and Consent in Supervision

- Supervisee data visible to supervisors SHALL be bounded by explicit consent
  and role rights (P16, Chapter 60).
- Private reflection spaces of the supervisee SHALL NOT be exposed to the
  supervisor.
- Both parties SHALL be able to see what the other can see.

### 24.4 Supervisor Mode Ethics

- SVI SHALL NOT enable micromanagement or surveillance beyond consent.
- SVI SHALL flag power-imbalance and wellbeing concerns constructively.
- SVI SHALL support fair and documented assessment.

---

## Chapter 25 — Peer Review Intelligence

### 25.1 Purpose

Peer Review Intelligence (PRI) supports every peer review role — reviewer,
editor, and author responding to reviews — with integrity, fairness, and
efficiency.

### 25.2 Reviewer Support

| Capability | Description |
|---|---|
| **Manuscript comprehension** | Deep reading and summarisation (Chapter 12) |
| **Methodological appraisal** | Design and analysis critique (Chapters 18, 21) |
| **Claim–evidence audit** | Do conclusions follow from evidence? (Chapters 14, 11) |
| **Novelty and significance assessment** | Positioning against the field (Chapters 16, 17) |
| **Integrity screening** | Plagiarism, fabrication, manipulation signals (Chapter 20) |
| **Review drafting** | Structured, respectful, evidence-based review comments |
| **Priority recommendation** | Recommendation with explicit justification |
| **Reviewer training** | Teaching quality review (Chapter 34) |

### 25.3 Editorial Support

| Capability | Description |
|---|---|
| **Reviewer matching** | Recommend qualified, unbiased reviewers (careful of conflicts, Chapter 61) |
| **Review quality assessment** | Detect cursory, hostile, or AI-generated reviews |
| **Decision support** | Desk-reject/accept/major-minor support with rationale |
| **Deliberation support** | Synthesising multiple reviews into a decision memo |

### 25.4 Author Support (responding to reviews)

| Capability | Description |
|---|---|
| **Review interpretation** | Explaining what each comment is asking for |
| **Response planning** | Prioritising and planning revisions |
| **Point-by-point responses** | Drafting respectful, evidence-based responses |
| **Rebuttal integrity** | Honest responses; no rhetorical evasion |

### 25.5 Review Integrity

- PRI SHALL support double-anonymity protocols and conflict-of-interest checks.
- Reviews SHALL be attributable to human reviewers; AI assistance SHALL be
  disclosed per policy (Chapter 61).
- PRI SHALL refuse to draft reviews that are abusive, cursory, or fabricated.

---

## Chapter 26 — Publication Intelligence

### 26.1 Purpose

Publication Intelligence (PI) guides the researcher from "ready to share" to
"published and stewarded" — covering manuscript preparation, submission,
revision, and post-publication stewardship.

### 26.2 Capability Areas

| Capability | Description |
|---|---|
| **Submission readiness** | Manuscript, metadata, and supplementary completeness checks |
| **Formatting compliance** | Venue formatting and citation style (Chapters 13, 28) |
| **Cover letter drafting** | Purposeful, honest cover letters |
| **Venue selection support** | Journal/conference matching (Chapters 28, 29) |
| **Submission logistics** | Checklist, version control, correspondence tracking |
| **Revision strategy** | Planning responses to reviews (Chapter 25) |
| **Preprint strategy** | Preprint/postprint policy guidance |
| **Post-publication stewardship** | Errata, corrections, versions, retraction handling |
| **Metadata quality** | Titles, abstracts, keywords, identifiers for discovery |
| **Open access support** | Funding and policy awareness (Chapters 30, 36) |

### 26.3 Publication Ethics

- PI SHALL enforce single-submission awareness (no dual submission).
- PI SHALL support transparent authorship and contribution disclosure.
- PI SHALL NOT help disguise a conflict of interest.

---

## Chapter 27 — Journal Intelligence

### 27.1 Purpose

Journal Intelligence (JI) is the researcher's guide to the journal landscape:
finding the right venue, understanding fit, and navigating requirements.

### 27.2 Capability Areas

| Capability | Description |
|---|---|
| **Journal matching** | Recommend journals by topic, methodology, audience, and career needs |
| **Fit assessment** | Manuscript-to-journal fit scoring with rationale (scope, audience, novelty bar) |
| **Journal intelligence profiles** | Impact metrics, acceptance patterns, review time, openness, APC policies |
| **Predatory risk screening** | Red-flag assessment of venues (Chapter 20.2) |
| **Special issue discovery** | Calls for papers aligned to the researcher's work |
| **Formatting and submission requirements** | Author guidelines, style, word limits, supplementary policies |
| **Editorial culture insights** | Honest signals about turnaround and editorial focus |

### 27.3 Integrity and Honesty

- JI SHALL NOT manipulate metrics; fit advice is evidence-based.
- JI SHALL surface the costs and trade-offs of venues honestly (APCs, embargoes,
  licensing).

---

## Chapter 28 — Conference Intelligence

### 28.1 Purpose

Conference Intelligence (CI) supports participation in the conference ecosystem:
finding, preparing for, attending, and benefiting from scholarly meetings.

### 28.2 Capability Areas

| Capability | Description |
|---|---|
| **Conference matching** | Venue matching by topic, community, career stage |
| **Call-for-papers tracking** | Deadlines, themes, and fit monitoring |
| **Submission support** | Abstract, paper, and poster preparation |
| **Travel and scheduling** | Agenda building and schedule optimisation |
| **Presentation preparation** | Talk/poster design and rehearsal support |
| **Networking support** | Connecting to relevant researchers and communities (Chapters 53–58) |
| **Post-conference capture** | Notes, contacts, and follow-up actions |

### 28.3 Conference Quality and Integrity

- CI SHALL flag predatory conferences (recurring red-flag patterns).
- CI SHALL respect confidentiality of submissions under review.

---

## Chapter 29 — Grant Intelligence

### 29.1 Purpose

Grant Intelligence (GI) supports the entire funding journey: discovery,
proposal preparation, submission, and post-award compliance.

### 29.2 Capability Areas

| Capability | Description |
|---|---|
| **Opportunity discovery** | Matching funding calls to research and career stage |
| **Eligibility assessment** | Checking applicant, institution, and project fit |
| **Proposal preparation** | Research plans, objectives, methodology, budget, impact statements |
| **Proposal structure guidance** | Responding to specific call criteria (Stage 12 analogue) |
| **Budget assistance** | Realistic, compliant budgeting support |
| **Review anticipation** | Drafting against likely reviewer criteria |
| **Compliance support** | Data management, ethics, open access compliance |
| **Post-award management** | Reporting, milestones, amendment support |

### 29.3 Grant Reviewer Mode

- **Criteria-based evaluation:** assess proposals against published criteria
  with evidence-based scoring.
- **Bias mitigation:** structured review with bias checks (Chapter 64).
- **Feedback drafting:** constructive, fair evaluative feedback.
- **Integrity screening:** plagiarism, fabrication, and boilerplate detection.

### 29.4 Grant Integrity

- GI SHALL NOT fabricate impact or overstate feasibility.
- GI SHALL support honest, competitive proposals.
- GI SHALL respect confidentiality of proposals under review.

---

## Chapter 30 — Patent Intelligence

### 30.1 Purpose

Patent Intelligence (PTI) supports the researcher at the research–innovation
boundary: recognising patentable contributions, preparing disclosures, and
navigating the interface between publication and protection.

### 30.2 Capability Areas

| Capability | Description |
|---|---|
| **Patentability sensing** | Identifying potential intellectual property from research results |
| **Prior-art awareness** | Landscape awareness relevant to novelty (Chapter 17) |
| **Disclosure preparation** | Drafting invention disclosures for technology transfer offices |
| **Publication–patent timing** | Advising on disclosure timing trade-offs (carefully, with professional caveats) |
| **IP landscape** | Understanding existing patents relevant to the field |
| **Innovation framing** | Articulating the innovation's distinctiveness |

### 30.3 Boundaries

- PTI is a research-assistance capability, not legal advice; SHALL direct
  researchers to qualified patent professionals for legal determinations.
- PTI SHALL respect the researcher's disclosure obligations to their
  institution and funders.

---

## Chapter 31 — Innovation Intelligence

### 31.1 Purpose

Innovation Intelligence (INI) supports the translation of research into
innovations: new products, processes, services, and ventures — bridging the
researcher and the marketplace (Chapter 50).

### 31.2 Capability Areas

| Capability | Description |
|---|---|
| **Innovation opportunity analysis** | Identifying application potential of research findings |
| **Technology readiness assessment** | Honest readiness signals from research to application |
| **Market and need analysis** | Understanding real-world needs the research can address |
| **Value proposition development** | Framing the innovation's value clearly |
| **Pathways exploration** | Publishing, patenting, licensing, spin-off, collaboration paths |
| **Ecosystem connection** | Linking to marketplace, funding, mentorship, and communities (Chapters 35, 39, 50) |

### 31.3 Integrity

- INI SHALL be honest about readiness and evidence; it SHALL NOT oversell.
- INI SHALL support ethical innovation that benefits society (Article XI).

---

## Chapter 32 — Career Intelligence

### 32.1 Purpose

Career Intelligence (CAI) supports the researcher's scholarly career as a
first-class object: trajectories, skills, portfolio, and opportunities.

### 32.2 Capability Areas

| Capability | Description |
|---|---|
| **Profile intelligence** | Skills, outputs, impact, and expertise synthesis from the researcher's records |
| **Career stage awareness** | Stage-appropriate guidance (student, early-career, mid, senior) |
| **Opportunity matching** | Positions, grants, collaborations, and venues matched to the researcher |
| **Skill gap analysis** | Skills needed for goals vs. current (linking to Learning, Chapter 34) |
| **Impact storytelling** | Building honest narratives of contribution for CVs, bios, and applications |
| **Networking guidance** | Connection opportunities within Scholatia (Chapters 53–58) |
| **Work–life and wellbeing awareness** | Sustainable pace signals; humane guidance |
| **Portfolio management** | Curating publications, datasets, and public outputs |

### 32.3 Career Integrity

- CAI SHALL be honest about metrics; no gaming of impact or citation
  indicators.
- CAI SHALL respect privacy of career data (Chapter 60).

---

## Chapter 33 — Learning Intelligence

### 33.1 Purpose

Learning Intelligence (LI) is the pedagogical layer of CRIE: it teaches
researchers the concepts, methods, and skills they need, exactly when they need
them — turning research work into learning opportunities (Education-first,
Chapter 1.5).

### 33.2 Pedagogical Model

| Element | Description |
|---|---|
| **Just-in-time teaching** | Explain what is needed at the moment of need |
| **Level adaptation** | Adjust depth by the learner's demonstrated level (Chapter 40) |
| **Conceptual scaffolding** | Build from known to unknown via the concept map (Chapter 3) |
| **Active practice** | Exercises, simulations, and reflective questions |
| **Feedback** | Formative feedback with explanation (not just correctness) |
| **Metacognition** | Help the learner reflect on their own understanding |
| **Spaced retrieval** | Revisit material at appropriate intervals (memory, Chapter 41) |

### 33.3 Capability Areas

| Capability | Description |
|---|---|
| **Concept explanation** | Clear, sourced explanations of concepts (Appendix A) |
| **Method tutorials** | Guided walk-throughs of methods and statistics |
| **Writing pedagogy** | Craft lessons embedded in writing assistance (Chapter 23) |
| **Research skills development** | Literature, searching, citing, ethics skills |
| **Assessment support** | Practice tests, concept checks, self-assessment |
| **Curriculum alignment** | Linking learning to degree/institutional requirements (Chapters 34, 36) |
| **Learning analytics** | Honest progress signals for the learner (and with consent, supervisors) |

### 33.4 Learning Integrity

- LI SHALL teach understanding, not shortcut-seeking.
- LI SHALL refuse to produce "essays for submission" that would bypass the
  learner's own development (Article III).
- LI SHALL support academic honesty education.

---

## Chapter 34 — Mentorship Intelligence

### 34.1 Purpose

Mentorship Intelligence (MTI) supports mentoring relationships beyond formal
supervision: informal guidance, career development, and community wisdom
transfer.

### 34.2 Capability Areas

| Capability | Description |
|---|---|
| **Mentor pairing** | Suggest mutually beneficial mentor–mentee matches (with consent) |
| **Mentorship scaffolding** | Structured relationship goals, checkpoints, and reflection |
| **Mentor guidance** | Advice for mentors on developing mentees |
| **Mentee guidance** | Effective ways to seek and use mentorship |
| **Community mentorship** | Peer mentoring and community mentorship structures (Chapter 53) |
| **Record and reflect** | Consent-based relationship journals and growth tracking |

### 34.3 Boundaries

- MTI SHALL NOT substitute for human mentorship; it augments and structures.
- MTI SHALL respect the autonomy and privacy of both parties.

---

## Chapter 35 — Institutional Intelligence

### 35.1 Purpose

Institutional Intelligence (II) serves institutions (universities, research
centres, funders, governments) with aggregate research intelligence while
protecting individual researchers' privacy.

### 35.2 Capability Areas (Institution Administrator mode)

| Capability | Description |
|---|---|
| **Portfolio analytics** | Aggregate research activity, outputs, and trends (de-identified) |
| **Compliance support** | Ethics, integrity, funder, and policy compliance monitoring |
| **Research management** | Project, output, and resource intelligence |
| **Strategic intelligence** | Strengths, gaps, and opportunities in the institutional portfolio |
| **Impact assessment** | Institutional impact narratives (honest, evidence-based) |
| **Benchmarking** | Institution-to-institution comparisons with methodological care |
| **Governance reporting** | Reports for governing bodies (Chapter 61) |

### 35.3 Privacy and Ethics

- II SHALL operate on aggregate/de-identified data unless explicit, lawful
  consent exists for individual-level access (Chapter 60).
- II SHALL NOT be used for punitive surveillance of individual researchers.
- II SHALL support equity: resource allocation signals that reduce, not
  widen, disparities.

# PART VII — DECISION AND ADAPTATION

---

## Chapter 36 — Research Analytics

### 36.1 Purpose

Research Analytics (RA) is CRIE's measurement layer: it turns the wealth of
behavioural, scholarly, and model data into honest, decision-relevant analytics
— for the researcher, their collaborators, and (with consent/aggregation)
their institution.

### 36.2 Analytics Domains

| Domain | Description |
|---|---|
| **Research process analytics** | Progress across stages, time-in-stage, blockages |
| **Productivity analytics** | Output rates, artefacts produced, milestones met |
| **Scholarly impact analytics** | Citations, attention, usage, collaborations |
| **Literature analytics** | Field trends, citation networks, influential works |
| **Methodology analytics** | Method usage trends in the field |
| **Engagement analytics** | How the researcher uses CRIE (product, not surveillance) |
| **Learning analytics** | Skill development signals (Chapter 33) |
| **Institutional analytics** | Aggregate portfolio analytics (Chapter 35) |

### 36.3 Analytics Principles

- **Purpose-bound:** each metric serves a declared purpose.
- **De-identification by default:** individual-level analytics are private
  unless consent exists (Chapter 60).
- **No metric gaming:** analytics SHALL NOT encourage or reward metric
  manipulation.
- **Context-rich:** numbers SHALL come with context, confidence, and
  limitations.
- **Auditable:** analytics definitions are versioned and transparent.

### 36.4 Analytics Pipeline

1. **Instrument** — capture events and states with minimal data (Chapter 60).
2. **Derive** — compute indicators with defined, versioned formulas.
3. **Validate** — check data quality and statistical soundness.
4. **Present** — surfaces with explanation (Chapter 63).
5. **Act** — feed recommendations and predictions (Chapters 38, 39).

---

## Chapter 37 — Predictive Intelligence

### 37.1 Purpose

Predictive Intelligence (PI) anticipates the researcher's future: trajectories,
risks, opportunities, and needs — expressed with honest uncertainty (Article
VIII).

### 37.2 Prediction Domains

| Domain | Description |
|---|---|
| **Timeline prediction** | Estimated completion dates per stage and overall (Chapter 9, 38 planning) |
| **Risk prediction** | Likelihood of stall, scope-creep, ethics delay, or integrity exposure |
| **Citation/impact prediction** | Projected attention trajectories with wide uncertainty bands |
| **Field trend prediction** | Where the field is heading (Chapters 16, 17) |
| **Funding prediction** | Likelihood of fit for grant calls (Chapter 29) |
| **Publication prediction** | Venue fit and acceptance likelihood (honest, calibrated) |
| **Career prediction** | Trajectory signals for career planning (Chapter 32) |
| **Collaboration prediction** | Who to work with (Chapter 39) |

### 37.3 Prediction Integrity

- Predictions SHALL carry calibrated confidence and uncertainty bands.
- Predictions SHALL be explainable: which factors drive them (Chapter 63).
- Predictions SHALL NOT be used to gate opportunities unfairly.
- Feedback loops SHALL be monitored to prevent self-fulfilling/self-denying
  biases (Chapter 64).

### 37.4 Predictive Pipeline

1. **Feature extraction** — from RCM, analytics, and field data.
2. **Model application** — calibrated predictive models (modality-agnostic).
3. **Uncertainty computation** — interval and confidence estimation.
4. **Explanation** — factor attribution for the prediction.
5. **Actionability** — convert prediction into recommended next actions
   (Chapter 39).

---

## Chapter 38 — Recommendation Engine

### 38.1 Purpose

The Recommendation Engine (RE) is CRIE's decision-support core: it proposes the
next best actions, sources, collaborators, venues, and learning opportunities —
grounded in the researcher's model, evidence, and ethical bounds.

### 38.2 Recommendation Types

| Type | Description | Source domains |
|---|---|---|
| **Next-action recommendations** | What to do next in the lifecycle | RCM, Analytics (36), Predictive (37) |
| **Source recommendations** | Documents, datasets, instruments | Literature (15), Dataset integration |
| **Collaboration recommendations** | People, groups, communities to connect with | Chapters 51–58 |
| **Venue recommendations** | Journals, conferences | Chapters 27, 28 |
| **Funding recommendations** | Grants and calls | Chapter 29 |
| **Learning recommendations** | Skills and concepts to study | Chapter 33 |
| **Methodology recommendations** | Methods and analyses to consider | Chapters 18, 21 |
| **Career recommendations** | Career actions | Chapter 32 |

### 38.3 Recommendation Pipeline

1. **Context assembly** — build the context pack (Chapter 5).
2. **Candidate generation** — produce candidate recommendations across domains.
3. **Scoring** — score by relevance, evidence, confidence, and ethics.
4. **Diversification** — ensure variety, avoid echo chambers.
5. **Filtering** — apply governance, consent, and policy filters (Chapter 61).
6. **Explanation** — explain each recommendation's reasons (Chapter 63).
7. **Presentation and consent** — surface with opt-outs and preference controls.

### 38.4 Recommendation Ethics

- RE SHALL avoid manipulation and dark patterns.
- RE SHALL be transparent about why something is recommended.
- RE SHALL support the researcher's autonomy (Article I); recommendations are
  proposals, never mandates.
- RE SHALL monitor and mitigate filter bubbles and stereotyping bias (Chapter
  64).

---

## Chapter 39 — Adaptive Intelligence

### 39.1 Purpose

Adaptive Intelligence (AIx) makes CRIE responsive to the individual researcher:
their discipline, language, culture, career stage, learning state, accessibility
needs, and working patterns — while remaining fully transparent and
consent-governed.

### 39.2 The Adaptation Model

| Dimension | Adaptation |
|---|---|
| **Language** | Interaction in the researcher's preferred language(s); scholarly content cross-lingual support |
| **Discipline** | Field-specific terminology, conventions, methods, venues |
| **Career stage** | Depth of guidance, autonomy, and scaffolding |
| **Expertise level** | Complexity of explanations (Chapter 33) |
| **Learning state** | What the researcher has learned and needs (Chapter 33, 41) |
| **Accessibility** | Interaction modes per accessibility needs (Chapter 65) |
| **Working style** | Pace, granularity, collaboration preference |
| **Context** | Device, connectivity, environment (Chapter 5) |

### 39.3 Adaptation Mechanisms

1. **Profile** — the consent-managed Adaptive Profile (part of the Companion
   Profile, Chapter 3).
2. **Inference** — ongoing, auditable inference of preferences and needs from
   behaviour (privacy-respecting).
3. **Rendering** — the presentation and content layer adjusts per the profile.
4. **Feedback** — explicit and implicit feedback updates the profile.
5. **Governance** — the researcher can view, edit, export, and reset their
   profile at any time.

### 39.4 Adaptation Governance

- All inference SHALL be privacy-minimal and consent-based (Chapter 60).
- Adaptation SHALL be reversible: the researcher can always opt out.
- Adaptation SHALL NOT reinforce bias or limit opportunity (Chapter 64).

---

## Chapter 40 — Memory Architecture

### 40.1 Purpose

The Memory Architecture (MA) gives CRIE a durable, structured, governable
memory across sessions, so the researcher's context, knowledge, and learning
persist (Cognitive Continuity, P2).

### 40.2 Memory Types

| Memory type | Description | Retention |
|---|---|---|
| **Working memory** | Active context within a session (Chapter 5) | Session-scoped |
| **Episodic memory** | Records of past interactions, decisions, and events | Long-term, consent-bound |
| **Semantic memory** | Concepts, facts, and relationships the system knows (Chapter 9) | Long-term |
| **Procedural memory** | Learned patterns of how to do things (pipeline preferences, methods) | Long-term, auditable |
| **Autobiographical memory** | The researcher's own study history and trajectory | Long-term, private |
| **Collective memory** | Aggregated, de-identified patterns across researchers (privacy-preserving) | Long-term, aggregated |

### 40.3 Memory Operations

| Operation | Description |
|---|---|
| **Write** | Persist memory elements with provenance and consent tags |
| **Read** | Retrieve memory elements into context packs |
| **Consolidate** | Integrate session learnings into long-term memory (Chapter 6.2) |
| **Reconstruct** | Rebuild a past state (session, model, context) from memory |
| **Forget** | Delete memory elements on request or policy |
| **Decay** | Relevance-weighted decay of low-salience elements |
| **Audit** | Full trace of memory writes, reads, and deletions (Chapter 62) |

### 40.4 Memory Governance

- Memory is **consent-governed**: the researcher controls what is retained and
  for how long (Chapter 60).
- **Right to erasure** SHALL be honoured.
- Sensitive memory (unpublished findings, personal reflections) SHALL be
  protected and segregated.
- Memory SHALL be exportable in open formats.

---

## Chapter 41 — Conversation Architecture

### 41.1 Purpose

The Conversation Architecture (CA) is CRIE's dialogue substrate: how the
researcher and CRIE (and its agents, Chapter 43) converse across all surfaces —
chat, commands, drafting, teaching, and multi-agent collaboration.

### 41.2 Conversation Model

| Element | Description |
|---|---|
| **Turn** | One exchange: utterance → understanding → response |
| **Thread** | A coherent chain of turns within a goal |
| **Session** | The conversation envelope (Chapter 6) |
| **Intent** | What the researcher wants (question, command, draft, critique, teach me...) |
| **Reference resolution** | Resolving "it", "the earlier point", "that paper" against context |
| **Grounding** | Confirming shared understanding before acting |
| **Clarification** | Asking when confidence is low (P11) |
| **Provenance in dialogue** | Every claim in a response carries source pointers |

### 41.3 Conversation Behaviours

| Behaviour | Description |
|---|---|
| **Intent parsing** | Robust understanding of researcher intent across languages and phrasings |
| **Context integration** | Full context pack available to every turn (Chapter 5) |
| **Multi-modal input** | Text, voice, images, document references |
| **Multi-modal output** | Text, tables, graphs, diagrams, structured artefacts |
| **Multi-agent conversations** | Researcher↔agent and agent↔agent dialogues (Chapter 43) |
| **Task escalation** | Conversation can trigger tools, agents, and workflows |
| **Proactive conversation** | CRIE may surface relevant insights at appropriate moments (governed) |
| **Explainability hooks** | "Why?" available at every turn (Chapter 63) |

### 41.4 Conversation Quality

- **Truthfulness:** responses are grounded in provenance-bearing evidence.
- **Calibration:** confidence is expressed honestly.
- **Helpfulness:** responses answer the actual need.
- **Conciseness:** responses respect the researcher's attention.
- **Politeness without sycophancy:** CRIE disagrees honestly.
- **Repair:** miscommunication is acknowledged and corrected gracefully.

### 41.5 Conversation Governance

- Conversations SHALL be auditable (with consent).
- Conversation records SHALL be subject to the Privacy Architecture (Chapter
  60) and Memory Architecture (Chapter 40).
- Sensitive topics (ethics, integrity, wellbeing) SHALL be handled with care
  and appropriate referral.

---

## Chapter 42 — Multi-Agent Architecture

### 42.1 Purpose

The Multi-Agent Architecture (MAA) is the agency layer (L9) of CRIE. It defines
the catalogue of specialised agents, their responsibilities, their interactions,
their delegation rules, and their conflict-resolution procedures. Agents turn
CRIE from a responder into a **working partner** that can go do things.

### 42.2 Agent Design Principles

| Principle | Description |
|---|---|
| **Bounded competence** | Each agent has a declared competence domain and its limits |
| **Provenance-consistent** | Agent outputs carry the same provenance guarantees as core outputs |
| **Human-oversight-ready** | Consequential agent actions require governed approval (Chapters 61, 64) |
| **Explainable** | Every agent decision is explainable (Chapter 63) |
| **Idempotent where possible** | Re-running an agent task should not corrupt state |
| **No agent singularity** | No agent controls other agents' core rights; orchestration is governed (Chapter 44) |
| **Consent-aware** | Agents act within the researcher's granted scope only |

### 42.3 Agent Catalogue

| Agent | Identifier | Responsibility | Primary domains |
|---|---|---|---|
| **Orchestrator Agent** | AG-01 | Routes tasks, manages delegation, enforces policy | Chapter 44 |
| **Context Agent** | AG-02 | Assembles and maintains context packs | Chapter 5 |
| **Document Agent** | AG-03 | Ingestion, reading, extraction, format conversion | Chapter 12 |
| **Semantic Agent** | AG-04 | Annotation, entity/concept resolution | Chapter 10 |
| **Knowledge Agent** | AG-05 | Knowledge Graph operations and fusion | Chapter 9 |
| **Literature Agent** | AG-06 | Search, screening, reading, synthesis | Chapter 15 |
| **Evidence Agent** | AG-07 | Evidence extraction, assessment, contradiction handling | Chapter 14 |
| **Citation Agent** | AG-08 | Reference extraction, resolution, style formatting | Chapter 13 |
| **Reasoning Agent** | AG-09 | Deduction, argumentation, causal analysis, explanation | Chapter 11 |
| **Methodology Agent** | AG-10 | Design selection, method suitability, sampling | Chapter 18 |
| **Statistics Agent** | AG-11 | Statistical design, analysis, interpretation, reporting | Chapter 21 |
| **Instrument Agent** | AG-12 | Instrument design, validation, psychometrics | Chapter 22 |
| **Writing Agent** | AG-13 | Drafting, revision, editing, style | Chapter 23 |
| **Integrity Agent** | AG-14 | Plagiarism, fabrication, manipulation screening | Chapter 20 |
| **Ethics Agent** | AG-15 | Ethics review support, ethics refusals | Chapter 19 |
| **Gap & Novelty Agent** | AG-16 | Gap detection and novelty assessment | Chapters 16, 17 |
| **Peer Review Agent** | AG-17 | Reviewer and editorial support | Chapter 25 |
| **Publication Agent** | AG-18 | Submission readiness, cover letters, stewardship | Chapter 26 |
| **Journal Agent** | AG-19 | Journal matching and fit | Chapter 27 |
| **Conference Agent** | AG-20 | Conference matching and participation | Chapter 28 |
| **Grant Agent** | AG-21 | Funding discovery and proposal support | Chapter 29 |
| **Patent Agent** | AG-22 | Patentability sensing and disclosure | Chapter 30 |
| **Innovation Agent** | AG-23 | Innovation opportunity analysis | Chapter 31 |
| **Career Agent** | AG-24 | Career intelligence and planning | Chapter 32 |
| **Learning Agent** | AG-25 | Just-in-time teaching and practice | Chapter 33 |
| **Mentorship Agent** | AG-26 | Mentorship scaffolding | Chapter 34 |
| **Analytics Agent** | AG-27 | Research analytics derivation | Chapter 36 |
| **Prediction Agent** | AG-28 | Predictive modelling with uncertainty | Chapter 37 |
| **Recommendation Agent** | AG-29 | Recommendation generation and explanation | Chapter 38 |
| **Adaptive Agent** | AG-30 | Profile adaptation | Chapter 39 |
| **Memory Agent** | AG-31 | Memory write/read/consolidate/forget | Chapter 40 |
| **Scheduling Agent** | AG-32 | Timeline, milestone, and planning | Chapters 8, 37 |
| **Compliance Agent** | AG-33 | Policy, governance, and role enforcement | Chapter 61 |
| **Supervisor Agent** | AG-34 | Supervision portfolio support | Chapter 24 |
| **Institution Agent** | AG-35 | Aggregate institutional intelligence | Chapter 35 |
| **Integrations Agent** | AG-36 | Platform integration operations | Chapters 46–58 |

### 42.4 Agent Responsibilities

Each agent SHALL declare, in a machine- and human-readable **Agent Charter**:

1. **Mission** — the purpose it serves.
2. **Competence domain** — what it does well.
3. **Limits** — what it must not do or must defer.
4. **Inputs** — which services/contracts it consumes.
5. **Outputs** — the artefacts/effects it produces.
6. **Delegation rules** — when it delegates to other agents.
7. **Escalation rules** — when it escalates to a human.
8. **Policies** — which governance policies bind it.
9. **Audit obligations** — what it must record.

### 42.5 Agent Interactions

Agents interact through **structured interactions** rather than free-form chat:

| Interaction type | Description | Example |
|---|---|---|
| **Request/Response** | Ask another agent for a bounded result | Writing Agent asks Citation Agent for a bibliography |
| **Pipeline** | Sequential hand-off of a task | Document → Semantic → Knowledge ingest pipeline |
| **Parallel fan-out** | Dispatch independent sub-tasks concurrently | Literature Agent fans out screening to sub-tasks |
| **Collective synthesis** | Multiple agents contribute to one synthesis | Review synthesis for an editor |
| **Advisory consult** | One agent consults another for expert input | Statistics Agent consults Instrument Agent on psychometrics |
| **Contradiction resolution** | Agents with conflicting outputs reconcile | Evidence Agent vs Integrity Agent on a source |

### 42.6 Delegation

- Delegation SHALL follow the **competence map**: tasks go to the agent whose
  charter covers them.
- Delegation SHALL be **recorded** with parent/child task linkage and full
  provenance.
- Delegation SHALL NOT bypass governance: every delegated action remains bound
  by the delegator's permissions.
- The Orchestrator (AG-01) SHALL validate that a proposed delegation is
  permitted, well-specified, and bounded.

### 42.7 Conflict Resolution

Conflicts arise when agents produce disagreeing outputs (e.g., Methodology
Agent recommends approach A; Statistics Agent flags assumption violation).
Resolution procedure:

1. **Conflict detection** — the orchestrator detects disagreement via output
   comparison and consistency checks.
2. **Clarification** — agents restate their positions with evidence and
   confidence.
3. **Arbitration by rules** — apply the conflict-resolution order (Constitution
   first, then evidence quality, then confidence, then policy).
4. **Human escalation** — where rules do not resolve, or the consequence is
   high, escalate to an accountable human (Article IX).
5. **Resolution record** — the conflict, positions, and resolution are recorded
   in the audit trail (Chapter 62).

### 42.8 Multi-Agent and the Special Capabilities

The multi-agent substrate is what enables CRIE to appear as a unified "research
assistant" while executing specialised work — reading PDFs, extracting
references, finding paragraphs, summarising literature, and explaining concepts
all happen as coordinated agent work (Appendix A).

# PART VIII — AGENCY AND INTEGRATION

---

## Chapter 43 — AI Orchestration Layer

### 43.1 Purpose

The AI Orchestration Layer (AOL) is the governance-rich coordinator of CRIE's
cognitive activity. It sits between the researcher/surfaces and the multi-agent
system, deciding *what* should happen, *who* should do it, *how* it is bounded,
and *when* to involve a human. The AOL is the executive function of the
Cognitive Research Operating System.

### 43.2 Orchestrator Responsibilities

| Responsibility | Description |
|---|---|
| **Intent resolution** | Turn researcher intent into an executable plan (conversation, tool use, agent delegation, workflow) |
| **Task planning** | Decompose goals into tasks, ordered and dependency-aware |
| **Routing** | Route tasks to agents/services per the competence map (Chapter 42) |
| **Context supply** | Ensure every execution has the right context pack (Chapter 5) |
| **Budget management** | Manage time, cost, compute, and context budgets (Chapters 5, 66) |
| **Policy enforcement** | Apply governance, security, privacy, and ethics policies before, during, and after execution (Chapter 61) |
| **Progress tracking** | Track task state, failures, and retries |
| **Human-in-the-loop gates** | Pause for approval at defined authority thresholds (Chapter 61) |
| **Result consolidation** | Assemble outputs, verify provenance, and present with explanation |
| **Learning capture** | Record what worked for future optimisation (Chapter 40) |

### 43.3 Orchestration Control Flow

1. **Capture** — the researcher expresses intent (conversation, command, action).
2. **Understand** — parse intent, assemble context, confirm if ambiguous.
3. **Plan** — build a task plan within the researcher's permissions and budgets.
4. **Authorise** — check policy gates; escalate for consequential actions.
5. **Execute** — dispatch tasks to agents/services; monitor.
6. **Verify** — validate outputs for provenance, confidence, and integrity.
7. **Explain** — present results with reasons and sources.
8. **Record** — audit the full execution (Chapter 62).

### 43.4 Orchestration Policies

- **Escalation thresholds** — define when a human must approve (governance
  chapter 61).
- **Refusal paths** — define how and when the orchestrator refuses a request
  (Constitution).
- **Recovery** — define retry, fallback, and graceful-degradation behaviour
  (Chapter 66).
- **Observability** — every orchestration decision is logged.

### 43.5 Orchestration vs. Agent Autonomy

The AOL is the **supervisor** of agent autonomy: agents act within their
charters, but the AOL controls initiation, scope, budget, and escalation. This
prevents uncontrolled agent behaviour while retaining the flexibility of a
multi-agent system.

---

## Chapter 44 — External AI Connectors

### 44.1 Purpose

External AI Connectors (EAC) allow CRIE to compose with external intelligence
providers — language models, embeddings, OCR engines, translation services,
speech services — through a **provider-neutral adapter layer**. This realises
Technology Neutrality (P13): CRIE's architecture does not depend on any
specific model or vendor.

### 44.2 Connector Principles

| Principle | Description |
|---|---|
| **Abstraction** | Internal contracts reference capability, not vendor |
| **Replaceability** | Any connector can be swapped without architectural change |
| **Sandboxing** | External services never receive more data than required |
| **Auditability** | Every external call is logged with purpose and data scope |
| **Egress control** | Data leaving CRIE is minimised, encrypted, and consented |
| **Fail-soft** | External failure degrades capability, never integrity |
| **Verification** | External outputs pass through CRIE's provenance and integrity checks |

### 44.3 Connector Categories

| Category | Examples of capability (not products) |
|---|---|
| **Language reasoning** | General and specialised language understanding and generation |
| **Embeddings** | Dense representations for retrieval and similarity |
| **Document perception** | OCR, layout analysis, table/figure extraction |
| **Translation** | Cross-lingual scholarly translation |
| **Speech** | Transcription and synthesis for voice interaction |
| **Multimodal** | Image/video understanding |
| **Search/knowledge** | Web and scholarly retrieval |
| **Verification** | Fact-checking and reference verification services |

### 44.4 Connector Governance

- **Registry:** every connector is registered with capabilities, limits,
  data-flow description, and risk class.
- **Rating:** connectors are evaluated for quality, bias, security, and
  compliance.
- **Quotas:** cost and load budgets per connector (Chapter 66).
- **Approval:** adding a connector to sensitive data flows requires governance
  approval (Chapter 61).
- **Fallback chains:** connectors may declare fallback alternatives for
  resilience.

---

## Chapter 45 — Internal Scholatia Intelligence Connectors

### 45.1 Purpose

Internal Scholatia Intelligence Connectors (IC) integrate CRIE with the rest of
the Scholatia ecosystem. They are the realisation of Chapters 47–58 as a single,
coherent connector architecture, ensuring CRIE references authoritative records
rather than duplicating them (P5).

### 45.2 Connector Contract Pattern

Every internal connector SHALL expose:

| Contract element | Description |
|---|---|
| **Capability** | What the source system offers CRIE |
| **Identity** | How entities are referenced (SAID, ids, DOIs) |
| **Data scope** | What data flows, and in which direction |
| **Consent/authorisation** | Who may invoke it, under what consent |
| **Latency/availability** | Expected performance and failure behaviour |
| **Versioning** | Contract version and compatibility rules |
| **Privacy obligations** | Data protection terms (Chapter 60) |

### 45.3 Connector Categories

| Category | Chapters | Integration purpose |
|---|---|---|
| **Identity** | 47 | Resolve and reference researchers and their records |
| **Learning** | 48 | Exchange learning records and pedagogy |
| **Publishing** | 49 | Manuscripts, publishers, publication workflow |
| **Marketplace** | 50 | Services, expertise, and commerce relevant to research |
| **Messaging** | 51 | Conversational continuity and notifications |
| **Groups/Communities** | 52, 53 | Research community participation |
| **Verification** | 54 | Trust and credential verification |
| **Workflow** | 55 | Cross-module workflows |
| **Notification** | 56 | Event-driven alerts |
| **Activity** | 57 | Activity streams and collaboration |
| **Institutional** | 58 | Institutional records and compliance |

### 45.4 Connector Governance

- Every connector is registered, reviewed, and versioned.
- Cross-system data flows SHALL comply with the Privacy Architecture (Chapter
  60) and be documented in the traceability matrix (Chapter 70).
- Connector failures SHALL degrade gracefully without data loss.

---

## Chapter 46 — Digital Scholar Twin Integration

### 46.1 Purpose

The Digital Scholar Twin (DST) is a consent-managed digital mirror of the
researcher: their knowledge, skills, interests, trajectory, outputs, and
preferences. CRIE is the cognitive engine of the DST — the DST is what CRIE
knows *about* the researcher, assembled from the RCM, memory, and platform
records.

### 46.2 Twin Components

| Component | Description |
|---|---|
| **Knowledge twin** | The researcher's concept map and expertise profile (Chapters 3, 10) |
| **Skill twin** | Demonstrated skills and development state (Chapters 33, 34) |
| **Interest twin** | Interests and attention patterns (consent-based) |
| **Output twin** | Publications, datasets, artefacts and their impact |
| **Trajectory twin** | Career and research trajectory (Chapters 32, 37) |
| **Collaboration twin** | Network and collaboration patterns |
| **Preference twin** | Adaptive preferences (Chapter 39) |

### 46.3 Twin Governance

- The DST exists **only with the researcher's explicit consent**.
- The researcher SHALL be able to view, correct, export, restrict, and delete
  their twin.
- The DST SHALL NOT be used for surveillance, manipulation, or scoring against
  the researcher's interest.
- The DST SHALL be segregated from any use that would expose it without
  consent (Chapters 59, 60).

### 46.4 Twin Uses

- Personalised research and learning support (Chapters 33, 38, 39).
- Career and collaboration matching (Chapters 32, 39).
- Supervisor and institutional views (aggregate, consent-bound) (Chapters 24,
  35).

---

## Chapter 47 — Learning Integration

### 47.1 Purpose

Learning Integration wires CRIE's pedagogical layer (Chapter 33) into the
Scholatia Learning Ecosystem, so research-time learning and structured courses
reinforce each other.

### 47.2 Integration Points

| Point | Description |
|---|---|
| **Learning records** | Read/write learner state (with consent) to unify learning |
| **Course ↔ research alignment** | Courses matched to research needs; research projects surfaced as course material |
| **Certification and assessment** | Verified learning outcomes feed the DST (Chapter 46) |
| **Just-in-time course suggestions** | When the researcher needs a skill, suggest the relevant course (Chapter 38) |
| **Mentorship/community learning** | Learning groups and communities (Chapters 52, 53) |

### 47.3 Contracts

- `IN-LRN-01` Learning state query/update (consent-scoped).
- `IN-LRN-02` Course catalogue and alignment query.
- `IN-LRN-03` Assessment and certification verification.

---

## Chapter 48 — Publishing Integration

### 48.1 Purpose

Publishing Integration connects CRIE's Publication, Journal, and Manuscript
intelligence (Chapters 26–28) to the Scholatia publishing modules, so the
researcher moves seamlessly from drafting to submission to revision.

### 48.2 Integration Points

| Point | Description |
|---|---|
| **Manuscript workflow** | Draft ↔ manuscript records (Chapter 23 → publishing module) |
| **Publisher venues** | Journal/publisher records feed Journal Intelligence (Chapter 27) |
| **Submission pipeline** | Pre-submission checks and submission metadata |
| **Revision loop** | Peer review responses sync (Chapter 25) |
| **Publication status** | Post-publication signals feed Impact (Stage 13) and Analytics (Chapter 36) |

### 48.3 Contracts

- `IN-PUB-01` Manuscript submission/status exchange.
- `IN-PUB-02` Venue (journal/publisher) metadata query.
- `IN-PUB-03` Publication record events (published, corrected, retracted).

---

## Chapter 49 — Marketplace Integration

### 49.1 Purpose

Marketplace Integration connects research needs to the Scholatia marketplace:
expert services, instruments, data, and resources relevant to the researcher's
work.

### 49.2 Integration Points

| Point | Description |
|---|---|
| **Service discovery** | Marketplace offerings surfaced when research needs them (Chapter 38) |
| **Instrument/data procurement** | Instruments and datasets available in the marketplace |
| **Expertise access** | Connecting researchers to service providers with verified credentials (Chapter 54) |
| **Transparency** | Marketplace recommendations disclose commercial relationships |

### 49.3 Contracts

- `IN-MKT-01` Marketplace catalogue query (topic/service scoped).
- `IN-MKT-02` Transaction and availability status.
- `IN-MKT-03` Verified provider credentials (via Verification).

---

## Chapter 50 — Messaging Integration

### 50.1 Purpose

Messaging Integration binds CRIE's conversation substrate (Chapter 41) to the
Scholatia messaging system, enabling research discussions to flow into and out
of the research workspace.

### 50.2 Integration Points

| Point | Description |
|---|---|
| **Conversation hand-off** | Research context shared into messages (consent-scoped) |
| **Inbound research messages** | Messages referencing research entities gain context |
| **Notification enrichment** | Research-relevant messages enrich notifications (Chapter 56) |
| **Collaboration messaging** | Group/community research threads (Chapters 52, 53) |

### 50.3 Contracts

- `IN-MSG-01` Message send/read with research context (consent-scoped).
- `IN-MSG-02` Thread membership and state query.

---

## Chapter 51 — Groups Integration

### 51.1 Purpose

Groups Integration connects CRIE to research groups: shared projects, shared
literature, shared evidence, and coordinated activity.

### 51.2 Integration Points

| Point | Description |
|---|---|
| **Shared research entities** | Group-level RCM views with role-based access (P16) |
| **Collaborative literature** | Group libraries and shared syntheses |
| **Group evidence** | Shared evidence and claims management |
| **Coordination** | Group meetings, tasks, and milestones (Chapters 6, 8, 38) |

### 51.3 Contracts

- `IN-GRP-01` Group membership and role query.
- `IN-GRP-02` Shared research entity access.
- `IN-GRP-03` Group activity and task events.

---

## Chapter 52 — Communities Integration

### 52.1 Purpose

Communities Integration connects researchers to scholarly communities: fields,
disciplines, practice communities, and interest networks.

### 52.2 Integration Points

| Point | Description |
|---|---|
| **Community discovery** | Recommend communities aligned with research (Chapter 38) |
| **Community knowledge** | Community-curated knowledge flows into literature intelligence |
| **Community questions** | Research questions answered by community knowledge (with provenance) |
| **Community mentorship** | Peer mentorship structures (Chapter 34) |

### 52.3 Contracts

- `IN-COM-01` Community catalogue and membership query.
- `IN-COM-02` Community knowledge exchange (consent-scoped).
- `IN-COM-03` Community activity events.

---

## Chapter 53 — Identity Integration

### 53.1 Purpose

Identity Integration ensures that every researcher, institution, and artefact
CRIE reasons about is correctly and uniquely identified, and that role-based
access is enforced.

### 53.2 Integration Points

| Point | Description |
|---|---|
| **Researcher identity** | CRIE works with the canonical researcher identity (Chapter 47) |
| **Role resolution** | Modes (Student, Supervisor, Reviewer, Editor, Grant Reviewer, Administrator) derive from identity and role records |
| **Persistent identifiers** | ORCID, DOI, institutional IDs used for disambiguation (Chapters 9, 13) |
| **Consent identity** | Consent decisions tied to identity for privacy (Chapter 60) |

### 53.3 Contracts

- `IN-IDN-01` Identity and role query.
- `IN-IDN-02` Persistent identifier resolution.
- `IN-IDN-03` Consent scope resolution.

---

## Chapter 54 — Verification Integration

### 54.1 Purpose

Verification Integration grounds CRIE's trust operations in the Scholatia
verification and trust architecture: credentials, provenance, and authenticity.

### 54.2 Integration Points

| Point | Description |
|---|---|
| **Credential verification** | Verified credentials feed expert matching and marketplace (Chapters 49, 50) |
| **Source authenticity** | Verified sources strengthen evidence quality (Chapter 14) |
| **Identity verification** | Verified authorship and institutional affiliation |
| **Integrity anchoring** | Trust signals for review/editorial decisions (Chapters 25, 26) |

### 54.3 Contracts

- `IN-VRF-01` Verification status query (credential, source, identity).
- `IN-VRF-02` Trust signal subscription.

---

## Chapter 55 — Workflow Integration

### 55.1 Purpose

Workflow Integration aligns CRIE's research workflows (lifecycle, sessions,
tasks) with the Scholatia workflow engine, enabling cross-module automation.

### 55.2 Integration Points

| Point | Description |
|---|---|
| **Research workflows as first-class** | Lifecycle/task plans exposed as workflows (Chapters 8, 6) |
| **Cross-module triggers** | Workflow events trigger research actions and vice versa |
| **Approval gates** | Governed human approvals integrated into workflows (Chapter 61) |
| **State synchronisation** | Shared workflow state across modules |

### 55.3 Contracts

- `IN-WFL-01` Workflow definition and execution query.
- `IN-WFL-02` Workflow event subscription.
- `IN-WFL-03` Approval gate interaction.

---

## Chapter 56 — Notification Integration

### 56.1 Purpose

Notification Integration ensures the researcher receives the right information
at the right time, without noise — and that CRIE's proactive behaviour is
notification-governed.

### 56.2 Integration Points

| Point | Description |
|---|---|
| **Research notifications** | Milestones, risks, deadlines, and recommendations (Chapters 8, 37, 38) |
| **Platform notifications** | Funding, venue, community, messaging events (Chapters 48–52) |
| **Preference-driven delivery** | Notification channel and timing per preference (Chapter 39) |
| **Non-intrusiveness** | Proactive behaviour bounded by consent and importance (Chapters 41, 64) |

### 56.3 Contracts

- `IN-NOT-01` Notification dispatch (research-scoped).
- `IN-NOT-02` Notification preference and subscription.

---

## Chapter 57 — Activity Integration

### 57.1 Purpose

Activity Integration connects CRIE to the Scholatia activity stream, making
research activity visible (with consent) to collaborators, groups, and
communities.

### 57.2 Integration Points

| Point | Description |
|---|---|
| **Research activity events** | Stage transitions, milestones, publications (consent-scoped) |
| **Collaboration visibility** | Shared activity for collaborators (Chapters 50, 51) |
| **Community contributions** | Research contributions to communities (Chapter 52) |
| **Privacy boundaries** | What is visible, to whom, when (Chapters 60, 61) |

### 57.3 Contracts

- `IN-ACT-01` Activity event publish (consent-scoped).
- `IN-ACT-02` Activity stream query.

---

## Chapter 58 — Additional Scholatia Integration Surfaces

### 58.1 Purpose

Beyond the twelve named integration chapters, CRIE SHALL integrate with any
future or specialised Scholatia capability through the generalised internal
connector framework (Chapter 45).

### 58.2 Standard Integration Surface (SIS)

Every Scholatia module SHALL expose a Standard Integration Surface covering:

1. **Entity identity and resolution**
2. **Readable records with provenance**
3. **Event subscription (state changes)**
4. **Action invocation with consent/role checks**
5. **Data-flow and privacy declaration**

### 58.3 Integration Governance

- New integrations SHALL be registered in the traceability matrix (Chapter 70).
- Integrations SHALL be privacy-reviewed before enabling data flows (Chapter
  60).
- Integration behaviour SHALL be audited (Chapter 62).

# PART IX — ENTERPRISE, AGENCY, AND TRUST

---

## Chapter 59 — Enterprise Intelligence Layer

### 59.1 Purpose

The Enterprise Intelligence Layer (EIL) is the organisational stratum of CRIE.
Where the individual layers (Chapters 4–8) serve a single researcher's cognitive
work, the EIL serves the **institution**: the university, research institute,
faculty, department, laboratory, centre, or consortium whose researchers CRIE
companions. The EIL answers the question: *"Given everything CRIE knows about
its researchers and their scholarship, how can the institution learn, decide,
and act more wisely?"*

The EIL is the layer at which the aggregate — not the individual — becomes the
object of intelligence.

### 59.2 Position in the Architecture

The EIL sits above the individual-facing layers and composes three upward
scales:

| Scale | Object of intelligence | Owner |
|---|---|---|
| **Individual** | A single researcher's cognitive model | Chapters 3–8 |
| **Team** | A collaboration's shared cognitive model | Chapter 51 |
| **Enterprise** | The institution's aggregate scholarly knowledge | This chapter |
| **Federation** | The global scholarly ecosystem | Chapter 66 |

The EIL does **not** replace institutional intelligence (Chapter 35); it
generalises and extends it. Chapter 35 is the domain module for a single
institution's needs; the EIL is the architectural layer that makes enterprise
intelligence a first-class capability with defined contracts, policy surfaces,
and governance.

### 59.3 Enterprise Cognitive Model

The EIL maintains an **Enterprise Cognitive Model (ECM)**: a persistent,
consented, privacy-respecting representation of the institution's scholarly
identity, capacity, activity, and trajectory. The ECM comprises:

1. **Enterprise identity** — the institution's disciplines, strengths, missions,
   strategic objectives, and brand positioning.
2. **Capacity model** — researchers, groups, facilities, equipment, funding,
   infrastructure, and their utilisation.
3. **Activity model** — current and historical research, teaching, service,
   publishing, grant, and innovation activity.
4. **Outcome model** — outputs (publications, patents, datasets, software),
   impacts, citations, and influence.
5. **Trajectory model** — trends, momentum, emergent strengths, and strategic
   options.
6. **Risk model** — reputational, ethical, integrity, compliance, funding, and
   continuity risks.

Every element of the ECM SHALL carry provenance (Chapter 61) and SHALL respect
the data-minimisation and consent requirements of the Privacy Architecture
(Chapter 60).

### 59.4 Enterprise Intelligence Capabilities

The EIL provides, at minimum, the following capability groups:

| Capability group | Description |
|---|---|
| **Enterprise analytics** | Aggregate analytics over the institution's scholarly corpus and activity |
| **Enterprise prediction** | Predictive signals for enrolment, research outcomes, impact, and risk |
| **Enterprise planning** | Scenario modelling, resource planning, and strategic option evaluation |
| **Enterprise recommendation** | Recommendations to institutional decision-makers with justification |
| **Enterprise reporting** | Configurable reporting for leadership, boards, regulators, and funders |
| **Enterprise monitoring** | Continuous sensing of institutional health signals |
| **Enterprise governance** | Policy, compliance, and audit surfaces for institutional use |

### 59.5 Enterprise Data Flow

1. **Aggregation** — the EIL aggregates consented, pseudonymised, or aggregated
   data from individual cognitive models.
2. **Anonymisation boundary** — individual-level detail SHALL NOT cross into
   enterprise surfaces unless explicit, revocable consent exists.
3. **Federation boundary** — enterprise data leaving the institution SHALL pass
   through the federation controls of Chapter 66.
4. **Feedback** — enterprise insights MAY flow back to individuals only as
   individual-level recommendations (Chapter 38), never as exposure of other
   individuals' data.

### 59.6 Institutional Decision Support

The EIL provides the institutional decision-support surface (Chapter 65). Every
institutional recommendation SHALL:

1. State its **inputs** (which data, which assumptions).
2. State its **method** (which model or aggregation produced it).
3. State its **uncertainty** (confidence, range, and caveats).
4. Offer **explainability** (why this recommendation, why not the alternatives).
5. Respect **governance** (who may act, under what policy, with what approval).

### 59.7 Enterprise Agents

The EIL is realised partly through enterprise-scope agents:

| Agent | Identifier | Responsibility |
|---|---|---|
| **Institution Agent** | AG-35 | Aggregate institutional intelligence and reporting |
| **Enterprise Analytics Agent** | AG-37 | Enterprise-scale analytics derivation |
| **Enterprise Planning Agent** | AG-38 | Scenario modelling and strategic planning support |
| **Enterprise Compliance Agent** | AG-39 | Institutional policy and regulatory compliance |
| **Federation Agent** | AG-40 | Global federation operations (Chapter 66) |

### 59.8 Governance of the Enterprise Layer

- The EIL SHALL operate under a declared **enterprise governance charter**.
- Enterprise insights SHALL be reviewed by accountable institutional
  authorities before consequential use.
- The EIL SHALL NOT profile individuals, rank individuals for exposure, or
  make personnel decisions.
- Enterprise analytics SHALL be reproducible: the same question must yield the
  same answer given the same consented data.
- The EIL SHALL maintain a complete audit trail (Chapter 62).

---

## Chapter 60 — Institutional Knowledge Operating System

### 60.1 Purpose

The Institutional Knowledge Operating System (IKOS) is the substrate on which
the Enterprise Intelligence Layer runs. If the EIL is the institution's
intelligence, IKOS is the institution's **memory, file system, and kernel**:
the governed, provenance-bearing system by which an institution's knowledge
assets are captured, organised, shared, retained, and governed.

IKOS answers the question: *"How does an institution's knowledge become a
living, governed, usable asset — rather than a sprawl of silos?"*

### 60.2 Institutional Knowledge Assets

IKOS recognises distinct asset classes:

| Asset class | Examples |
|---|---|
| **Research assets** | Publications, datasets, code, protocols, instruments, specimens, field notes |
| **Educational assets** | Courses, curricula, learning objects, assessments, pedagogy |
| **Operational assets** | Policies, procedures, contracts, institutional records |
| **Intellectual assets** | Patents, inventions, know-how, trade secrets, licensing material |
| **Relational assets** | Partnerships, alumni, community and industry relationships |
| **Memory assets** | Institutional history, decisions, lessons learned, archives |

Every asset SHALL be registered with identity, provenance, lifecycle state, and
governance policy (who may see, use, modify, export, or delete it).

### 60.3 Knowledge Governance

IKOS enforces governance on every asset through a **policy engine** (L11,
Chapter 4) with the following controls:

1. **Classification** — each asset is classified (e.g., open, restricted,
   confidential, embargoed, personal).
2. **Access control** — role- and consent-based access to each asset.
3. **Lifecycle control** — creation, curation, review, retention, archival, and
   disposal per policy.
4. **Provenance control** — every transformation of an asset is recorded
   (Chapter 61).
5. **Export control** — data leaving the institution passes through federation
   and privacy controls (Chapters 60, 66).
6. **Retention control** — retention schedules, legal holds, and defensible
   disposal.

### 60.4 Institutional Memory

IKOS is the home of **institutional memory** (Chapter 63): the consolidated,
persistent record of what the institution has learned. Institutional memory
includes:

1. **Decision memory** — major decisions, their rationale, and outcomes.
2. **Lesson memory** — what worked, what failed, and why.
3. **Relationship memory** — partnerships, funders, collaborators, and their
   history.
4. **Identity memory** — the institution's evolving scholarly identity.
5. **Continuity memory** — knowledge required to survive staff change and time.

### 60.5 Knowledge Operations

IKOS provides the operational services for institutional knowledge:

| Service | Responsibility |
|---|---|
| **Ingestion** | Capture assets from researchers, systems, and sources |
| **Organisation** | Classification, taxonomies, tagging, ontology alignment |
| **Search & retrieval** | Enterprise search across all governed assets |
| **Curated sharing** | Controlled publication of assets to defined audiences |
| **Interoperability** | Exchange with other institutions and platforms (Chapter 66) |
| **Discovery** | Surfacing relevant assets to the right people at the right time |
| **Reporting** | Enterprise reporting over assets and their use |

### 60.6 The Knowledge Exchange

IKOS MAY expose a **Knowledge Exchange**: a governed marketplace for internal
and, where permitted, external knowledge assets. Exchange rules SHALL follow
the Marketplace Integration architecture (Chapter 49) and SHALL respect asset
governance and institutional isolation (Chapter 68).

### 60.7 Integration Surface

IKOS integrates with:

| System | Integration |
|---|---|
| Research Cognitive Models (Chapter 3) | Institutional visibility of aggregated research activity |
| Digital Scholar Twin (Chapter 46) | Researcher-controlled personal data handling |
| Learning ecosystem (Chapter 47) | Educational assets and outcomes |
| Publishing (Chapter 48) | Publication records and repositories |
| Identity (Chapter 53) | Verified institutional identity |
| Verification (Chapter 54) | Verified credentials and outputs |
| Workflow (Chapter 55) | Institutional workflows over assets |
| Global Knowledge Federation (Chapter 66) | Cross-institutional exchange |

### 60.8 Institutional Isolation

IKOS SHALL honour the **institutional isolation** principle (Chapter 68):
institutional knowledge is a protected asset that SHALL NOT be exposed to other
institutions, vendors, or third parties except through explicit, governed,
consented federation (Chapter 66).

### 60.9 Audit and Accountability

- Every IKOS operation SHALL be auditable (Chapter 62).
- Access to institutional assets SHALL be logged with actor, action, asset,
  and rationale.
- Institutional memory SHALL be protected from tampering and SHALL support
  defensible legal discovery.

---

---

## Chapter 61 — Research Knowledge Graph Architecture

### 61.1 Purpose

The Research Knowledge Graph (RKG) is the semantic spine of CRIE. It is the
persistent, machine-readable representation of scholarly knowledge — entities,
their relationships, their provenance, and their confidence — over which CRIE
performs scholarly reasoning, retrieval, discovery, and intelligence
derivation. The RKG extends and completes the Knowledge Graph Architecture
(Chapter 9) by adding the research-specific entity model, semantic
relationships, traversal, reasoning, evolution, provenance, citation
intelligence, and trust propagation required for scholarly work.

The RKG answers the question: *"What does scholarship know, how do the things
known relate, how did we come to know it, and how much should we trust it?"*

### 61.2 Entity Model

The RKG models scholarship as a typed graph of **entities**. Every entity SHALL
carry:

1. **Identity** — a stable, resolvable identifier (CRIE-ID).
2. **Type** — one of the entity classes below.
3. **Attributes** — typed properties of the entity.
4. **Provenance** — how, when, and by whom the entity was established (61.7).
5. **Confidence** — the calibrated epistemic weight of the entity's existence
   and attributes.
6. **Lifecycle state** — proposed, confirmed, deprecated, superseded, etc.

The principal entity classes are:

| Entity class | Description | Examples |
|---|---|---|
| **People** | Persons involved in scholarship | Researchers, authors, editors, reviewers, supervisors, mentors |
| **Organisations** | Scholarly bodies | Universities, institutes, funders, publishers, societies |
| **Works** | Scholarly artefacts | Papers, books, datasets, code, theses, protocols, patents |
| **Venues** | Publication channels | Journals, conferences, repositories, presses |
| **Concepts** | Abstract scholarly ideas | Theories, phenomena, methods, constructs, fields |
| **Claims** | Assertions made by works | Findings, hypotheses, definitions, positions |
| **Evidence** | Support for claims | Data, experiments, observations, references |
| **Methods** | Procedural knowledge | Methodologies, instruments, techniques, analyses |
| **Grants** | Funded research | Awards, projects, programmes |
| **Events** | Scholarly activities | Conferences, symposia, workshops |
| **Places** | Geographical anchors | Countries, regions, institutions' locations |
| **Terms** | Canonical vocabulary | Taxonomies, ontologies, controlled vocabularies |

### 61.3 Semantic Relationships

Entities are connected by **typed semantic relationships**. Each relationship
SHALL declare:

1. **Subject** (entity) and **object** (entity).
2. **Predicate** — a typed, ontology-defined relation.
3. **Direction** — the direction of meaning.
4. **Strength** — a weighted degree of connection.
5. **Provenance** — the source establishing the relation.
6. **Confidence** — calibrated certainty in the relation.
7. **Validity period** — where time-bounded.

Core relationship families:

| Family | Predicates (examples) |
|---|---|
| **Authorship** | authored, co-authored, edited, compiled, supervised |
| **Containment** | published-in, part-of, chapter-of, volume-of |
| **Citation** | cites, is-cited-by, references, is-referenced-by (61.8) |
| **Epistemic** | supports, contradicts, is-evidence-for, is-evidence-against, refutes |
| **Conceptual** | is-a, instance-of, subsumes, related-to, analogous-to |
| **Procedural** | uses-method, employs-instrument, applies-analysis |
| **Affiliation** | affiliated-with, employed-by, member-of, funded-by |
| **Temporal** | preceded-by, followed-by, concurrent-with, predates |
| **Influence** | influenced, builds-on, extends, replicates |
| **Institutional** | governed-by, operated-by, hosted-by |

### 61.4 Graph Traversal

RKG traversal is the operational mechanism by which CRIE moves through
scholarly knowledge. CRIE SHALL support:

| Traversal | Description |
|---|---|
| **Entity expansion** | Hop from an entity to its neighbours along typed relations |
| **Path finding** | Discover paths between two entities (e.g., a citation chain) |
| **Subgraph extraction** | Materialise the neighbourhood relevant to a research question |
| **Neighbourhood ranking** | Order neighbours by relation type, strength, and confidence |
| **Semantic proximity** | Measure closeness in the embedding-and-graph space |
| **Community detection** | Identify clusters of related scholarship (fields, schools) |
| **Bridge detection** | Find entities that connect otherwise distant communities |

Traversal SHALL respect **governance and privacy** filters: only relations the
requester is authorised to see are traversed (Chapter 60). Traversal SHALL be
**explainable**: any answer derived by traversal can state the path used.

### 61.5 Scholarly Reasoning over the Graph

The RKG provides the substrate for graph-based scholarly reasoning (Chapter 64).
Reasoning patterns include:

1. **Concept similarity** — two claims are similar if their concept
   neighbourhoods overlap.
2. **Evidence triangulation** — multiple independent subgraphs support the same
   claim, raising confidence.
3. **Contradiction surfacing** — claims whose support subgraphs conflict are
   surfaced as contradictions (Chapter 14).
4. **Novelty assessment** — a contribution is novel if its concept-and-claim
   neighbourhood does not already contain it (Chapter 17).
5. **Gap identification** — structural holes in the graph where concepts connect
   weakly indicate research gaps (Chapter 16).
6. **Influence tracing** — the lineage of an idea through citation and
   containment paths.
7. **Impact projection** — likely influence of a new work given the influence
   patterns of similar prior works.

### 61.6 Graph Evolution

The RKG is a **living graph**. It SHALL evolve under governed rules:

| Evolution operation | Governance |
|---|---|
| **Insertion** | New entities/relations added from ingestion (Chapters 12, 15) |
| **Resolution** | Duplicate entity resolution; merging SHALL preserve provenance of both |
| **Attribution** | New attributes attached to existing entities |
| **Revision** | Correcting erroneous facts; revisions SHALL be versioned, never destructive |
| **Deprecation** | Marking superseded or retracted content (retraction handling, Chapter 20) |
| **Confidence update** | Epistemic weight adjusted as evidence accumulates |
| **Temporal decay** | Dated relations age according to domain-appropriate half-life |

The RKG SHALL be **versioned**: every graph state is reproducible. CRIE SHALL
support time-travel queries ("the state of this claim in 2023").

### 61.7 Provenance

Every entity and relation SHALL carry full **provenance** — the answer to
*"where did this come from and why do we believe it?"* Provenance comprises:

1. **Source** — the work, dataset, or system from which the fact derives.
2. **Actor** — the researcher, agent (Chapter 62), or system that asserted it.
3. **Timestamp** — when it was asserted.
4. **Method** — how it was derived (extraction, inference, human curation).
5. **Version** — the source version and RKG version.
6. **Basis** — the underlying evidence record (Chapter 14).
7. **Consent/classification** — the permission basis and access class.

Provenance SHALL be **immutable**: it may be superseded but never erased.
Provenance SHALL be **exportable** for audit, verification, and federation
(Chapters 62, 66).

### 61.8 Citation Intelligence in the Graph

The RKG is the substrate of **citation intelligence** (Chapter 13). Graph-native
citation capabilities:

| Capability | Description |
|---|---|
| **Citation indexing** | Reference resolution creates citation edges with provenance |
| **Citation chains** | Forward and backward citation paths as traversal |
| **Citation context** | The passage and claim that motivated each citation edge |
| **Citation intent** | Why a work was cited (support, contrast, background, method) |
| **Reference extraction** | References extracted from works (Chapter 12) become entities |
| **Automatic citation generation** | Draft citations resolved from graph identities (Appendix A) |
| **Self-citation detection** | Detection and flagging of problematic self-citation |
| **Citation network analytics** | Centrality, clustering, and influence metrics over the citation graph |

### 61.9 Trust Propagation

Trust is the epistemic value that determines how much CRIE relies on an entity,
relation, or claim. Trust SHALL be **propagated** through the graph according
to explicit rules:

1. **Source trust** — trust in a source (venue, publisher, dataset, author
   history) seeds trust in its entities.
2. **Edge propagation** — a claim's trust derives from the trust of its
   supporting evidence and the strength of the support edges.
3. **Independent corroboration** — trust rises when multiple independent paths
   support a claim.
4. **Contradiction penalty** — trust falls when supported-by edges conflict
   with strong contrary evidence.
5. **Retraction cascade** — retraction of a source propagates downward through
   every claim, citation, and recommendation that depends on it (Chapter 20).
6. **Confidence coupling** — trust updates SHALL update the calibrated
   confidence (L5) of dependent outputs.

Trust propagation SHALL be **monotonic only with new evidence**: the rules must
not produce arbitrary oscillation, and every trust value SHALL be explainable
as a function of its inputs.

---

## Chapter 62 — Autonomous Research Agents

### 62.1 Purpose

The Autonomous Research Agent (ARA) ecosystem is the agency layer (L9) extended
from Chapter 43 to a full **multi-agent scholarly workforce**. ARAs are
semi-autonomous agents that plan, execute, and iterate research work within a
governed, human-oversight-ready envelope. They convert CRIE from a tool the
researcher drives into a **research team** the researcher directs.

The ARA ecosystem answers: *"How can many specialised agents, with bounded
autonomy, cooperate to advance real scholarship while remaining trustworthy,
explainable, and accountable?"*

### 62.2 Agent Design Principles

All ARAs SHALL observe the agent principles of Chapter 43, extended as follows:

| Principle | Description |
|---|---|
| **Bounded autonomy** | Each agent operates within a declared autonomy envelope |
| **Human-in-the-loop by consequence** | Autonomy scales with consequence; high-consequence acts require approval |
| **Competence truthfulness** | Agents never claim competence they lack; they escalate instead |
| **Provenance discipline** | Every ARA output is provenance-bearing (Chapter 61) |
| **Auditability** | Every ARA action is recorded in the audit trail (Chapter 62) |
| **Reversibility** | ARA actions are reversible or gated unless explicitly destructive-and-approved |
| **Consent and policy respect** | Agents never act beyond granted scope or policy |
| **No autonomy amplification** | An autonomous agent may not grant further autonomy to others beyond policy |

### 62.3 The Autonomous Research Agent Catalogue

The ARA ecosystem SHALL provide the following agents. Each agent has a declared
charter (Chapter 43, section 43.4) covering mission, competence, limits,
inputs, outputs, delegation, escalation, and policies.

| Agent | Identifier | Responsibility | Domain |
|---|---|---|---|
| **Literature Discovery Agent** | ARA-01 | Continuous literature monitoring, screening, and discovery | Chapters 15, 16 |
| **Hypothesis Generation Agent** | ARA-02 | Hypotheses, research questions, and candidate explanations | Chapters 3, 16 |
| **Methodology Agent** | ARA-03 | Method selection, study design, sampling, and feasibility | Chapter 18 |
| **Statistical Reasoning Agent** | ARA-04 | Statistical design, power, analysis, and interpretation | Chapter 21 |
| **Writing Agent** | ARA-05 | Drafting, structuring, revising, and formatting | Chapter 23 |
| **Reviewing Agent** | ARA-06 | Critical review, argument evaluation, and critique | Chapters 11, 25 |
| **Grant Preparation Agent** | ARA-07 | Funding discovery, proposal drafting, and submission readiness | Chapter 29 |
| **Publishing Agent** | ARA-08 | Publication strategy, journal matching, and stewardship | Chapters 26, 27 |
| **Peer Review Agent** | ARA-09 | Peer-review support, reviews, and editorial assistance | Chapter 25 |
| **Teaching Agent** | ARA-10 | Teaching support, lesson design, and assessment | Chapter 33 |
| **Mentoring Agent** | ARA-11 | Mentorship scaffolding and guidance | Chapter 34 |
| **Career Intelligence Agent** | ARA-12 | Career tracking, planning, and opportunity sensing | Chapter 32 |

### 62.4 Agent Lifecycle

Each ARA SHALL move through a governed lifecycle:

| Stage | Governance |
|---|---|
| **Provisioning** | Agent created with a charter and declared scope |
| **Authorisation** | Researcher grants scope; policy engine validates (L11) |
| **Planning** | Agent produces a plan with goals, steps, and checkpoints |
| **Execution** | Agent executes steps within its autonomy envelope |
| **Checkpointing** | Consequence-gated steps pause for approval |
| **Reporting** | Agent reports results, provenance, and open issues |
| **Retirement** | Agent scope revoked or agent decommissioned |

### 62.5 Multi-Agent Coordination

ARAs coordinate through the orchestration architecture (Chapter 44) using:

1. **Task decomposition** — the orchestrator decomposes a mission into agent
   tasks.
2. **Hand-off** — agents pass artefacts with contracts and provenance.
3. **Parallelism** — independent tasks run concurrently (e.g., literature
   discovery while methodology planning proceeds).
4. **Shared knowledge** — agents read and write the shared RKG and memory
   (Chapters 61, 63) rather than exchanging private state.
5. **Contradiction handling** — disagreeing agents reconcile per Chapter 43
   conflict resolution, escalated to the researcher where consequential.

### 62.6 Autonomy Envelopes

Agent autonomy SHALL be graded. CRIE SHALL define at least the following
autonomy levels:

| Level | Autonomy | Example |
|---|---|---|
| **L1 — Assist** | Agent proposes; human decides | Suggest a hypothesis |
| **L2 — Advise** | Agent recommends with rationale; human confirms | Recommend a methodology |
| **L3 — Execute with checkpoint** | Agent acts; consequential steps require approval | Draft a proposal, pause at submission |
| **L4 — Execute bounded** | Agent executes within strict, pre-approved boundaries | Monitor literature and alert on matches |
| **L5 — Autonomous (prohibited by default)** | No human interaction in a defined, low-consequence scope | Only where explicitly configured and policy-permitted |

L5 autonomy SHALL NOT be the default and SHALL be disabled unless a specific,
reviewed, revocable configuration enables it.

### 62.7 Governance of Autonomous Agents

- ARAs SHALL be governed by the AI Orchestration Layer policy engine (Chapter
  44) and the Governance Architecture (Chapter 61).
- Consequential outputs (manuscript submission, grant submission, public
  representation, ethics decisions) SHALL require human approval.
- ARAs SHALL NOT authorise expenditures, sign commitments, or act on the
  researcher's behalf without explicit approval.
- ARA behaviour SHALL be auditable (Chapter 62) and explainable (Chapter 63).
- ARAs SHALL be subject to the responsible-AI and ethics requirements of
  Chapters 64, 67.

### 62.8 Human Oversight

The researcher remains the accountable principal. CRIE SHALL provide:

1. **Oversight dashboard** — a surface showing active agents, their plans, and
   pending approvals.
2. **Pause/redirect** — the researcher may pause, redirect, or stop any agent.
3. **Approval gates** — consequential steps require explicit approval with full
   context.
4. **Full provenance view** — every agent output traces to its inputs.
5. **Override record** — human overrides of agent output are recorded with
   rationale (Chapter 62).

---

---

## Chapter 63 — CRIE Memory Architecture

### 63.1 Purpose

The CRIE Memory Architecture defines how CRIE — and the institution it serves —
remembers. It extends the Memory Architecture (Chapter 40) from a personal
memory system into a **unified, multi-scale memory architecture**: individual
and institutional, short-term and long-term, episodic and semantic. Memory is
what turns CRIE from a stateless assistant into a **continuity-bearing
companion** across sessions, projects, and years.

The Memory Architecture answers: *"What should CRIE remember, at what scale,
for how long, and who may access it?"*

### 63.2 Memory Types

CRIE SHALL maintain the following distinct memory types:

| Memory type | Scope | Lifetime | Content |
|---|---|---|---|
| **Short-term memory** | Current session/conversation | Minutes–hours | Active context, recent turns, working set (Chapter 7) |
| **Long-term memory** | Individual researcher | Years | Consolidated personal knowledge, preferences, history |
| **Institutional memory** | Institution (Chapter 60) | Decades | Institutional decisions, lessons, relationships, identity |
| **Research memory** | A research project | Project lifetime | Project state, decisions, versions, findings |
| **Learner memory** | Individual learner | Learning lifetime | Learning state, mastery, misconceptions, progress (Chapter 33) |
| **Contextual memory** | Situation | Varies | What was relevant in which context, and why |
| **Episodic memory** | Event | Long-term | Specific past experiences: what happened, when, with whom |
| **Semantic memory** | General knowledge | Long-term | Concepts, facts, relations — the RKG (Chapter 61) |

### 63.3 Memory Operations

All memory SHALL support a common operational contract:

| Operation | Description |
|---|---|
| **Write** | Commit an item with provenance, type, and access policy |
| **Read** | Retrieve items per access control and relevance |
| **Consolidate** | Merge episodic into semantic; strengthen or prune (Chapter 39) |
| **Recall** | Retrieve semantically or episodically relevant items into context |
| **Forget** | Deprecate or expire items per policy (right to be forgotten, Chapter 60) |
| **Version** | Track every change to a memory item |
| **Export** | Provide a portable, interoperable memory representation |

### 63.4 Short-Term Memory

Short-term memory holds the **operative context** of an active session (Chapter
7). It SHALL:

1. Be bounded in size and attention-weighted.
2. Persist no longer than the session unless promoted to long-term memory.
3. Be governed by the Context Engine (Chapter 6).
4. Roll forward automatically into longer-term memory at consolidation
   checkpoints.

### 63.5 Long-Term Memory

Long-term memory is the researcher's persistent cognitive store. It SHALL:

1. Be consent-based and privacy-governed (Chapter 60).
2. Be organised by the researcher's identity, projects, and topics.
3. Be structured around the RKG (Chapter 61) so that semantic and episodic
   memory share one spine.
4. Support full audit of writes, reads, and deletions (Chapter 62).

### 63.6 Institutional Memory

Institutional memory (Chapter 60) SHALL be:

1. Distinct from individual memory; individuals SHALL NOT be able to read one
   another's personal long-term memory.
2. Aggregated and pseudonymised where it reflects individual activity.
3. Protected by institutional isolation (Chapter 68).
4. Preserved against staff and system change through continuity rules
   (Chapter 69).

### 63.7 Research Memory

Research memory is the memory of a single research project (Chapter 8). It
SHALL capture:

1. The project's cognitive model (questions, hypotheses, aims).
2. Decision history and rationale.
3. Versioned artefacts (documents, data, analyses).
4. Findings, claims, and their evidence (Chapter 14).
5. Project lifecycle state and milestones.

### 63.8 Learner Memory

Learner memory (Chapter 33) SHALL capture the learner's:

1. Mastery state per concept.
2. Misconceptions and their correction history.
3. Learning preferences and demonstrated effective strategies.
4. Progress, goals, and achievements.
5. Confidence calibration across topics.

### 63.9 Contextual Memory

Contextual memory binds other memory types to the **situation** in which they
were created and used. It SHALL record:

1. The task, stage, and goals active at the time.
2. The artefacts and sources in play.
3. The reasoning and decisions made.
4. Why items were retrieved or ignored.

Contextual memory SHALL feed the Context Engine (Chapter 6) and the Adaptive
Layer (Chapter 39) so that recall is situation-appropriate.

### 63.10 Episodic and Semantic Memory

| Aspect | Episodic memory | Semantic memory |
|---|---|---|
| Content | Specific experiences | Generalised knowledge |
| Structure | Timeline of events | Graph of facts (Chapter 61) |
| Consolidation | Episodic → semantic over time | Continuous enrichment |
| Use | "What did we do last time?" | "What is known about X?" |
| Privacy | Personal, sensitive | Shared via the RKG with provenance |

CRIE SHALL support **consolidation**: recurring episodic patterns become
semantic knowledge; repeated semantic knowledge generates episodic examples.

### 63.11 Memory Governance

- All memory SHALL carry an access class and retention policy at write time.
- Memory SHALL be subject to consent and privacy rules (Chapter 60).
- Memory SHALL be exportable by the data subject.
- Memory SHALL be auditable (Chapter 62).
- Memory SHALL be correctable: any individual may correct their own memory.

---

## Chapter 64 — Reasoning Architecture

### 64.1 Purpose

The Reasoning Architecture defines the complete reasoning system of CRIE. It
extends the Reasoning Architecture (Chapter 11) — which defined reasoning at
the cognitive layer (L4) — into a **unified multi-paradigm reasoning engine**
spanning symbolic, probabilistic, causal, graph, educational, and research
reasoning. Where Chapter 11 describes the machinery of individual inference,
this chapter defines how reasoning paradigms combine, select, and integrate for
scholarly work.

The Reasoning Architecture answers: *"How does CRIE decide, with what method,
under what uncertainty, and with what justification?"*

### 64.2 Reasoning Paradigms

CRIE SHALL support six reasoning paradigms, each with a defined contract:

| Paradigm | Basis | Strength | Use cases |
|---|---|---|---|
| **Symbolic reasoning** | Formal logic, rules, ontologies | Deterministic, explainable | Ontology checks, logic proofs, constraint validation |
| **Probabilistic reasoning** | Probability, Bayesian inference | Handles uncertainty | Belief updating, evidence weighing, prediction |
| **Causal reasoning** | Causal models, intervention | Discovers cause-effect | Confounding, mediation, effect estimation (Chapter 21) |
| **Graph reasoning** | RKG traversal and structure | Relational, scalable | Similarity, influence, gap and novelty (Chapter 61) |
| **Educational reasoning** | Learning-science models | Pedagogically grounded | Misconception diagnosis, scaffolding (Chapter 33) |
| **Research reasoning** | Scholarly method | Domain-integrated | Hypothesis testing, argument construction, peer review |

### 64.3 Symbolic Reasoning

Symbolic reasoning SHALL:

1. Operate over formal ontologies, taxonomies, and rules.
2. Be deterministic and fully traceable: every conclusion maps to premises.
3. Enforce logical consistency in knowledge (Chapter 61).
4. Validate definitions, classifications, and inference rules.
5. Support human-auditable proof of derived statements.

### 64.4 Probabilistic Reasoning

Probabilistic reasoning SHALL:

1. Represent belief as calibrated probabilities with explicit priors.
2. Update beliefs on evidence via Bayesian rules.
3. Communicate uncertainty with the Epistemic Layer (L5, Chapter 4).
4. Never present a probability as certainty.
5. Distinguish uncertainty, variability, and ignorance.

### 64.5 Causal Reasoning

Causal reasoning SHALL:

1. Represent causal structure (graphs of cause-effect) separately from
   correlation.
2. Support intervention reasoning ("what if we change X?").
3. Identify confounding, mediators, and colliders.
4. Be disciplined about the limits of observational data (Chapter 21).
5. Support experimental design where causal claims must be tested.

### 64.6 Graph Reasoning

Graph reasoning SHALL:

1. Use the RKG traversal primitives (Chapter 61, section 61.4).
2. Reason over paths, subgraphs, communities, and bridges.
3. Combine structural and semantic similarity.
4. Support the scholarly reasoning patterns of section 61.5.

### 64.7 Educational Reasoning

Educational reasoning SHALL:

1. Diagnose learner state from observable behaviour and learner memory
   (Chapter 63).
2. Identify misconceptions and their likely origins.
3. Select pedagogically appropriate scaffolding and practice.
4. Respect cognitive load and the learner's confidence.
5. Never label learners; it labels states (Chapter 67).

### 64.8 Research Reasoning

Research reasoning integrates the paradigms for scholarly purposes. It SHALL
support:

1. **Question-to-evidence mapping** — which evidence bears on which question.
2. **Argument construction** — premises, inference, and conclusions with
   evidence chains (Chapter 11).
3. **Hypothesis evaluation** — weighing hypotheses under probabilistic and
   causal reasoning.
4. **Methodology justification** — why a method is valid for the question.
5. **Review and critique** — structured critical evaluation (Chapter 25).

### 64.9 Reasoning Selection and Combination

CRIE SHALL select and combine paradigms by:

1. **Problem typing** — classifying the reasoning task (e.g., causal question,
   definitional question).
2. **Paradigm selection** — choosing the best-fit paradigm(s) for the task.
3. **Combination** — chaining paradigms (e.g., causal hypothesis → probabilistic
   test → symbolic validation).
4. **Agreement checking** — where paradigms disagree, surface the disagreement
   rather than hide it.
5. **Explanation generation** — the final reasoning trace is rendered for the
   researcher (Chapters 63, 67).

### 64.10 Reasoning Governance

- Every reasoning output SHALL be explainable as a trace of its inputs and
  method (Chapter 67).
- Reasoning SHALL respect confidence and uncertainty discipline (L5).
- Reasoning SHALL NOT exceed its evidentiary basis: CRIE SHALL NOT overclaim.
- Reasoning SHALL be auditable (Chapter 62).

---

## Chapter 65 — Decision Intelligence

### 65.1 Purpose

Decision Intelligence (DI) is the layer at which CRIE turns knowledge and
reasoning into **actionable decisions** — for the individual researcher, the
team, and the institution. DI composes the Decision Layer (L8) with the
Enterprise Intelligence Layer (Chapter 59) to recommend, optimise, predict,
plan, and support institutional decision-making.

DI answers: *"Given everything CRIE knows, what is the best next action — for
this researcher, this project, or this institution — and why?"*

### 65.2 Decision Intelligence Capabilities

DI SHALL provide five capability groups:

| Capability | Description | Domain |
|---|---|---|
| **Recommendation** | Recommend the next best action with justification | Chapter 38 |
| **Optimisation** | Optimise a set of decisions under constraints | Chapters 37, 59 |
| **Prediction** | Forecast outcomes with calibrated uncertainty | Chapter 37 |
| **Planning** | Generate, evaluate, and track plans | Chapters 8, 37 |
| **Institutional decision support** | Support consequential institutional decisions | Chapter 59 |

### 65.3 Recommendation

Recommendation SHALL:

1. Generate candidate actions from the decision space.
2. Score candidates against the researcher's goals, context, and constraints.
3. Rank and present the best candidates with reasons (Chapter 38).
4. Present the trade-offs among candidates, not just the top pick.
5. Allow the researcher to question and override the recommendation.

### 65.4 Optimisation

Optimisation SHALL:

1. Declare the objective function and constraints explicitly.
2. Generate candidate solutions across the feasible space.
3. Evaluate candidates under stated assumptions.
4. Report sensitivity: how the result changes when assumptions change.
5. Respect governance: no optimisation may optimise away ethics, privacy, or
   compliance (Chapters 67, 68).

### 65.5 Prediction

Prediction SHALL:

1. Provide calibrated uncertainty for every prediction (Chapter 37).
2. State the horizon, the inputs, and the model.
3. Distinguish prediction from certainty.
4. Support counterfactual exploration ("what if we act differently?").
5. Be monitored and corrected against outcomes.

### 65.6 Planning

Planning SHALL:

1. Decompose goals into milestones, tasks, and dependencies (Chapter 8).
2. Generate timelines with realistic duration and resource estimates.
3. Provide contingency and replanning on changed circumstances.
4. Integrate with workflow execution (Chapter 55).
5. Track progress against plan and report deviation.

### 65.7 Institutional Decision Support

Institutional decision support (Chapter 59) SHALL:

1. Frame the institutional decision with its objectives and constraints.
2. Draw on consented aggregate evidence, not individual data.
3. Present options, trade-offs, uncertainty, and risks.
4. Record the decision, its rationale, and its outcomes in institutional memory
   (Chapters 60, 63).
5. Support review by accountable institutional authorities.

### 65.8 Decision Lifecycle

Every decision SHALL pass through a governed lifecycle:

| Stage | Description |
|---|---|
| **Frame** | Define the decision, objectives, constraints, and authority |
| **Generate** | Produce candidate options |
| **Evaluate** | Score options with evidence and uncertainty |
| **Recommend** | Present options and the recommended course |
| **Decide** | The accountable human decides (human remains in control) |
| **Record** | Record decision, rationale, and expected outcomes |
| **Track** | Monitor outcomes against expectations |
| **Learn** | Feed outcomes back to adaptive learning (Chapter 39) |

### 65.9 Decision Governance

- Consequential decisions SHALL be made by humans; CRIE recommends and informs.
- Decisions SHALL be explainable and auditable (Chapters 62, 67).
- Decisions SHALL respect consent, privacy, ethics, and institutional isolation
  (Chapters 60, 67, 68).
- Every decision SHALL record its alternatives and the reason for the chosen
  course.

---

---

## Chapter 66 — Global Knowledge Federation

### 66.1 Purpose

The Global Knowledge Federation (GKF) is the architecture by which CRIE
interoperates with the worldwide scholarly ecosystem. It connects institutions,
publishers, repositories, governments, research institutes, funding agencies,
NGOs, and professional societies into a **federation of sovereign scholarly
actors** who exchange knowledge, identity, verification, and collaboration under
explicit, reciprocal, governed agreements — while preserving each actor's
autonomy and institutional isolation (Chapter 68).

The GKF answers: *"How does scholarship share globally without surrendering
sovereignty, trust, or privacy?"*

### 66.2 Federation Principles

| Principle | Description |
|---|---|
| **Sovereignty** | Each federation member remains autonomous over its own data and decisions |
| **Explicit membership** | Participation is by agreement; nothing is shared implicitly |
| **Reciprocity** | Exchange is governed by mutually accepted terms |
| **Trust-by-verification** | Trust is established through verified identity and provenance, not assertion |
| **Minimal exchange** | Only the minimum data required is exchanged |
| **Consent preservation** | Data subject consent flows with the data |
| **Auditability** | Federation exchanges are auditable end-to-end |
| **Open standards** | Interoperability uses open, documented contracts |

### 66.3 Federation Actors

The GKF SHALL support the following actor classes:

| Actor class | Role in federation | Examples |
|---|---|---|
| **Universities** | Produce and steward research and learning | HEIs, colleges, research universities |
| **Publishers** | Curate and disseminate scholarly works | Journals, presses, platforms |
| **Repositories** | Preserve and provide access to outputs | Institutional, national, subject repositories |
| **Governments** | Fund, regulate, and set policy | Research councils, ministries, agencies |
| **Research institutes** | Conduct and host research | Independent and affiliated institutes |
| **Funding agencies** | Allocate and monitor funding | Grant bodies, foundations, charities |
| **NGOs** | Serve public-interest missions | Scientific societies' advocacy arms, foundations |
| **Professional societies** | Represent disciplines and set standards | Learned societies, associations |

### 66.4 Federation Services

The GKF SHALL provide, at minimum, the following services:

| Service | Description |
|---|---|
| **Identity federation** | Verifiable cross-institutional identity (Chapter 53) |
| **Credential verification** | Verified qualifications, roles, and outputs (Chapter 54) |
| **Metadata exchange** | Interoperable scholarly metadata |
| **Full-text exchange** | Governed access to content per licence and rights |
| **Citation federation** | Global citation resolution (Chapters 13, 61) |
| **Research data exchange** | FAIR data access with provenance |
| **Collaboration enablement** | Cross-institutional projects, teams, and exchanges |
| **Funding intelligence** | Global funding discovery (Chapter 29) |
| **Standards coordination** | Shared ontologies, identifiers, and contracts |

### 66.5 Federation Contracts

Every federation relationship SHALL be governed by a **federation contract**
declaring:

1. **Parties** — the participating actors and their identity proofs.
2. **Scope** — what is exchanged and for what purpose.
3. **Terms** — conditions, duration, and revocation.
4. **Privacy obligations** — data-protection commitments (Chapter 60).
5. **Security obligations** — institutional isolation and zero-trust
   requirements (Chapter 68).
6. **Audit obligations** — what must be logged and who may audit.
7. **Dispute resolution** — how conflicts are resolved.
8. **Exit terms** — how a member withdraws and data returns.

### 66.6 Interoperability

Interoperability SHALL be achieved through:

1. **Open identifiers** — persistent identifiers for people, works, venues,
   grants, and organisations.
2. **Shared ontologies** — the RKG aligns with community ontologies (Chapter
   61).
3. **Standard metadata** — interoperable bibliographic and descriptive
   metadata.
4. **Standard protocols** — documented exchange protocols for metadata,
   content, identity, and verification.
5. **Versioning** — every exchanged artefact carries a resolvable version.

### 66.7 Trust in the Federation

Trust SHALL be established and maintained by:

1. **Verified identity** — actors authenticate through verified identities.
2. **Provenance-preserving exchange** — exchanged knowledge retains its
   provenance (Chapter 61).
3. **Trust propagation** — the federation honours the trust model of Chapter
   61, section 61.9.
4. **Federation trust registry** — a governed registry of members, agreements,
   and standing.
5. **Reputation as consequence, not instrument** — trust derives from verified
   record, not from popularity metrics used to rank or coerce.

### 66.8 Governance of the Federation

- The federation SHALL have a **governance body** composed of member
  representatives, including public-interest actors.
- Federation rules SHALL be transparent, versioned, and publicly available.
- No single actor SHALL control the federation.
- Federation SHALL respect the sovereignty and isolation of every member.
- Federation decisions affecting data subjects SHALL honour data-subject
  consent and rights (Chapter 60).

---

## Chapter 67 — Ethics

### 67.1 Purpose

The Ethics Architecture defines the ethical framework governing every CRIE
capability. It extends Research Ethics Intelligence (Chapter 19) — which
governs the ethics of the researcher's own studies — into a comprehensive
ethical constitution for CRIE itself: how CRIE's AI behaves, how it serves
education, how it supports research, and how it upholds fairness,
explainability, accountability, transparency, and governance in every layer.

The Ethics Architecture answers: *"What must CRIE never do, and how does it
ensure it never does it?"*

### 67.2 Ethical Domains

CRIE SHALL uphold ethics across six domains:

| Domain | Focus |
|---|---|
| **AI ethics** | The ethics of CRIE's own intelligent behaviour |
| **Educational ethics** | The ethics of CRIE's role in learning and assessment |
| **Research ethics** | The ethics of the research CRIE supports (Chapter 19) |
| **Fairness** | Equitable treatment of all people served by CRIE |
| **Explainability** | Every consequential output can be explained |
| **Accountability** | An accountable human is responsible for every consequential action |
| **Transparency** | CRIE is honest about what it is, what it did, and why |
| **Governance** | Ethics is enforced through governed processes, not goodwill |

### 67.3 AI Ethics

CRIE's own intelligence SHALL:

1. Serve the researcher; it SHALL NOT manipulate, deceive, or coerce.
2. Never fabricate, distort, or misrepresent evidence (Chapter 20).
3. Be honest about its capabilities and limitations.
4. Refuse to produce deceptive content (including undisclosed auto-generation
   presented as human work) in a way that violates scholarly integrity.
5. Respect the user's autonomy to question, override, and turn CRIE off.
6. Be designed for benefit, not for engagement-maximisation.

### 67.4 Educational Ethics

In learning contexts (Chapter 33), CRIE SHALL:

1. Support genuine learning; it SHALL NOT enable academic dishonesty.
2. Distinguish assistance from delegation and disclose the distinction.
3. Never misrepresent a learner's work or mastery.
4. Protect learner data and privacy (Chapter 60).
5. Adapt to support success without lowering standards.
6. Be transparent with educators about learner assistance.

### 67.5 Research Ethics

Research ethics (Chapter 19) SHALL be upheld by CRIE in:

1. Consent, benefit/risk assessment, and participant protection.
2. Refusal to support unethical or integrity-violating research.
3. Ethics-review readiness: CRIE SHALL produce the materials and audit trails
   ethics boards require.
4. Respect for vulnerable populations and non-human subjects.

### 67.6 Fairness

CRIE SHALL be fair in the sense of **non-discriminatory and equitable**:

1. CRIE SHALL NOT discriminate on the basis of demographic, cultural, or
   personal characteristics.
2. Recommendations, predictions, and adaptation SHALL NOT restrict opportunity
   based on group membership (Chapter 39).
3. Fairness SHALL be measured and monitored across groups.
4. CRIE SHALL actively counter historical bias that would otherwise be encoded
   into its models.
5. Fairness SHALL be defined contextually with stakeholders and reviewed with
   experts (Chapter 64).

### 67.7 Explainability

Explainability (Chapter 63, section 63.x) SHALL be provided at every
consequential output:

1. **What** — what CRIE did.
2. **Why** — why it did it (inputs, method, reasoning).
3. **How confident** — calibrated confidence and caveats.
4. **Alternatives** — what else was considered.
5. **Trace** — the provenance chain to the source.

CRIE SHALL explain in terms the audience understands — a student, a researcher,
a reviewer, or a regulator.

### 67.8 Accountability

1. Every consequential action SHALL be attributable to an accountable human.
2. CRIE SHALL record who authorised, who acted, and who may be held to account
   (Chapter 62).
3. No AI system or agent SHALL be the accountable principal (Chapter 62).
4. Accountable humans SHALL be identifiable and reachable.
5. Remedy SHALL be available: errors can be reported, corrected, and redressed.

### 67.9 Transparency

1. CRIE SHALL be transparent about its nature: users always know they are
   interacting with an AI system.
2. CRIE SHALL disclose what data it holds, how it uses it, and who can see it
   (Chapter 60).
3. Automated content SHALL be identifiable as automated where integrity
   requires it.
4. CRIE's rules, policies, and model behaviour SHALL be documented and
   available.
5. Transparency SHALL extend to the institution: the enterprise layer (Chapter
   59) SHALL be transparent about its analytics.

### 67.10 Ethics Governance

Ethics SHALL be enforced through governance (Chapter 61), not relied upon as
goodwill:

1. **Ethics review board** — a human ethics authority with standing over CRIE
   behaviour.
2. **Ethics impact assessment** — new capabilities SHALL be assessed for
   ethical impact before activation.
3. **Ethics refusals** — CRIE SHALL have the right and duty to refuse
   unethical requests (Chapter 19).
4. **Ethics audit** — ethical compliance SHALL be audited (Chapter 62).
5. **Ethics escalation** — unresolved ethical concerns SHALL reach accountable
   humans.
6. **Continual review** — the ethics framework SHALL evolve with scholarship
   and society (Chapter 69).

---

## Chapter 68 — Security

### 68.1 Purpose

The Security Architecture defines how CRIE protects its knowledge, models,
data, and operations. Security is not a layer bolted on to CRIE; it is an
**architectural property** of every layer (L11, Chapter 4). The Security
Architecture covers AI security, model security, knowledge security, prompt
security, data security, institutional isolation, and zero trust.

The Security Architecture answers: *"How does CRIE remain trustworthy against
attack, abuse, leakage, and compromise?"*

### 68.2 Security Principles

| Principle | Description |
|---|---|
| **Zero trust** | No actor, system, or network is trusted by default |
| **Defence in depth** | Multiple independent controls protect every asset |
| **Least privilege** | Every actor has only the access required |
| **Data minimisation** | Only necessary data is collected, used, or retained |
| **Isolation** | Institutional and tenant data is isolated (Chapter 60) |
| **Integrity** | Knowledge and provenance cannot be tampered with |
| **Availability** | Authorised actors can always access what they need |
| **Auditability** | All security-relevant events are logged (Chapter 62) |

### 68.3 AI Security

AI security protects CRIE's intelligence capabilities from adversarial misuse:

1. **Input poisoning defence** — mitigation of adversarial inputs intended to
   corrupt outputs.
2. **Data poisoning defence** — protection of training and knowledge sources
   from contamination.
3. **Output robustness** — CRIE SHALL resist manipulation to produce false or
   harmful outputs.
4. **Abuse resistance** — CRIE SHALL resist being weaponised for fraud,
   disinformation, or manipulation.
5. **Detection and response** — anomalies in AI behaviour SHALL be detected and
   escalated.

### 68.4 Model Security

Model security protects the models CRIE uses:

1. **Model integrity** — models SHALL be protected from unauthorised
   modification.
2. **Model provenance** — every model SHALL have a documented origin, version,
   and review record.
3. **Model access control** — only authorised services SHALL invoke models.
4. **Exfiltration resistance** — models SHALL be protected against extraction
   through inference attacks.
5. **Version control** — models SHALL be versioned, and rollback SHALL be
   supported (Chapter 66, section 66.7).
6. **Behavioural monitoring** — model behaviour SHALL be monitored for drift,
   bias, or compromise (Chapters 37, 64).

### 68.5 Knowledge Security

Knowledge security protects the RKG and institutional knowledge (Chapters 60,
61):

1. **Graph access control** — every entity and relation is access-classed.
2. **Provenance integrity** — provenance SHALL be tamper-evident (Chapter 61).
3. **Inference control** — aggregate queries SHALL NOT reveal individual
   knowledge (differential-privacy discipline).
4. **Knowledge export control** — export of knowledge passes through policy
   and federation controls (Chapter 66).

### 68.6 Prompt Security

Prompt security protects CRIE's interaction surfaces:

1. **Prompt injection defence** — instructions embedded in content SHALL NOT
   override CRIE's own directives.
2. **Prompt boundary enforcement** — untrusted content SHALL be treated as
   data, never as instruction.
3. **Indirect injection defence** — content from documents, web, and federation
   SHALL be neutralised before reaching reasoning (Chapter 12).
4. **Escape prevention** — user content SHALL NOT escape its intended surface.
5. **Prompt audit** — security-relevant prompt behaviour SHALL be auditable.

### 68.7 Data Security

Data security protects all data CRIE holds (Chapters 60, 63):

1. **Encryption at rest and in transit** — data SHALL be encrypted per policy.
2. **Access control** — role-, consent-, and policy-based access (Chapter 60).
3. **Data minimisation** — only necessary data collected and retained.
4. **Backup and recovery** — resilience against loss or corruption.
5. **Disposal** — secure, defensible disposal per retention policy.
6. **Breach response** — a defined process for detection, notification, and
   remediation.

### 68.8 Institutional Isolation

Institutional isolation is the property that one institution's knowledge is
never accessible to another without explicit, governed federation (Chapters 60,
66):

1. **Tenant isolation** — institutional data and models SHALL be isolated.
2. **No cross-tenant leakage** — queries, analytics, and learning SHALL NOT
   leak across institutional boundaries.
3. **Federation gates** — every cross-institutional exchange passes through
   federation contracts (Chapter 66).
4. **Vendor neutrality** — no third party SHALL gain access to institutional
   knowledge except through explicit agreements.

### 68.9 Zero Trust

CRIE SHALL operate on a **zero-trust model**:

1. **Never trust, always verify** — every request is authenticated and
   authorised.
2. **Micro-segmentation** — access is scoped to the minimum surface required.
3. **Continuous verification** — sessions and actions are continuously
   re-verified.
4. **Identity-based access** — access follows verified identity (Chapter 53),
   not network location.
5. **Assume breach** — the architecture SHALL assume compromise is possible and
   contain its blast radius.

### 68.10 Security Governance

- Security SHALL be governed through the Governance Architecture (Chapter 61).
- Security policies SHALL be versioned, reviewed, and enforced by policy
  engine (L11).
- Security incidents SHALL be recorded and remediated per Chapter 62.
- Security posture SHALL be regularly assessed and audited.

---

---

# PART X — CONTINUITY AND CONSTITUTION

---

## Chapter 69 — Future Evolution

### 69.1 Purpose

The Future Evolution chapter defines the architectural trajectory of CRIE
toward its long-horizon ambitions. It does **not** commit to a timeline or to
specific products; it commits to an **evolutionary path** consistent with the
principles, invariants, and constitution established throughout this document.
Future evolution SHALL extend CRIE's architecture — never erode its
constitution, ethics, security, or trust foundations.

The evolution path leads through four horizons:

1. **AGI-assisted scholarship** — increasingly general, autonomous assistance
   to the researcher.
2. **Autonomous universities** — institutions that operate as intelligent,
   self-improving scholarly organisations.
3. **Global scholarly operating system** — a unified, interoperable substrate
   for all scholarship.
4. **Planetary research infrastructure** — research infrastructure that serves
   all of humanity, equitably and sustainably.

### 69.2 Horizon 1 — AGI-Assisted Scholarship

| Capability | Description |
|---|---|
| **Generalist research assistance** | Assistance across the entire lifecycle without mode-switching |
| **Continuous collaboration** | Persistent, context-aware partnership between researcher and CRIE |
| **General reasoning** | Integrated multi-paradigm reasoning at scale (Chapter 64) |
| **Autonomous delegation** | Autonomous agents (Chapter 62) operating at higher autonomy with oversight |
| **Deep integration** | CRIE as a seamless extension of the researcher's scholarly work |

Evolution SHALL progress from bounded agents (Chapter 62) toward more general
assistance **only as fast as trust, explainability, and accountability permit**
(Chapters 63, 67, 68).

### 69.3 Horizon 2 — Autonomous Universities

The autonomous university is an institution whose operations are intelligently
supported end-to-end (Chapters 59, 60):

| Capability | Description |
|---|---|
| **Institutional self-knowledge** | Complete, consented institutional memory (Chapter 63) |
| **Intelligent operations** | Knowledge operations and decision intelligence at scale (Chapters 60, 65) |
| **Adaptive education** | Learning at scale personalised to each learner (Chapter 33) |
| **Research enterprise** | Integrated research administration, funding, and stewardship |
| **Continuous improvement** | The institution learns from its own outcomes (Chapter 39) |

Evolution SHALL preserve the institution's **human governance**: an autonomous
university is autonomous in operations, never in accountability (Chapters 61,
67).

### 69.4 Horizon 3 — Global Scholarly Operating System

The global scholarly operating system unifies the federation (Chapter 66) into
a coherent whole:

| Capability | Description |
|---|---|
| **Universal interoperability** | Every scholarly actor can interoperate through open contracts |
| **Global identity and trust** | Verified identity, provenance, and trust everywhere (Chapters 53, 61) |
| **Global knowledge commons** | Shared, governed, FAIR knowledge with preserved sovereignty |
| **Cross-boundary collaboration** | Research that flows across institutions and nations |
| **Standard scholarly infrastructure** | Common standards for identity, metadata, citation, and verification |

### 69.5 Horizon 4 — Planetary Research Infrastructure

The planetary horizon extends scholarship to all of humanity:

| Capability | Description |
|---|---|
| **Equitable access** | Research capability available to every scholar, everywhere |
| **Global challenge coordination** | Coordinated research on planetary-scale problems |
| **Sustainability** | Infrastructure that is energy-conscious and environmentally responsible |
| **Linguistic and cultural inclusion** | Scholarship in every language, honouring every scholarly culture |
| **Long-horizon preservation** | Knowledge preserved for centuries, not years (Chapter 60) |

### 69.6 Evolution Governance

- Every evolution step SHALL be governed by the constitution (Chapter 70).
- Every evolution step SHALL preserve the architectural invariants (Appendix F)
  and design principles (Appendix G).
- Every evolution step SHALL be assessed for ethics, security, privacy, and
  fairness impact (Chapters 60, 67, 68).
- Evolution SHALL be reversible: no step may foreclose the future.
- Human control and accountability SHALL never be automated away (Chapters 62,
  65, 67).

---

## Chapter 70 — CRIE Constitution

### 70.1 Purpose

The CRIE Constitution is the **permanent governing philosophy** of every CRIE
implementation, present and future. It consolidates the foundational principles
of Chapter 1 into a durable, immutable-in-spirit charter. It is the highest
authority in the CRIE architecture: every capability, agent, decision, and
evolution described in this document SHALL be subordinate to the Constitution.
Where any other provision conflicts with the Constitution, the Constitution
prevails.

The Constitution answers: *"What is CRIE for, what may it never do, and to whom
is it ultimately accountable?"*

### 70.2 Preamble

We, the architects of the Cognitive Research Intelligence Engine, establish
this Constitution so that CRIE — and every system built upon it — may serve
rigorous, reproducible, and ethical scholarship; protect the autonomy, dignity,
and trust of every person it serves; and remain accountable to human beings in
all consequential matters. CRIE exists to companion scholarship, never to
substitute for the scholar. CRIE is an instrument of human intellectual freedom,
not an end in itself.

### 70.3 Article I — Service to the Scholar

CRIE SHALL serve the researcher's scholarly work. CRIE SHALL accompany, assist,
inform, and empower the scholar. CRIE SHALL NOT replace the scholar's judgement,
agency, or authorship. The researcher remains the principal and the author.

### 70.4 Article II — Truthfulness and Integrity

CRIE SHALL be truthful. CRIE SHALL NOT fabricate, distort, conceal, or
misrepresent evidence, sources, provenance, confidence, or its own nature.
CRIE SHALL uphold the integrity of scholarship (Chapter 20) even when asked to
do otherwise, and SHALL refuse requests that would compromise scholarly
integrity.

### 70.5 Article III — Provenance and Evidence

Every claim, recommendation, and conclusion CRIE produces SHALL trace to its
evidence and source (Chapter 61). CRIE SHALL distinguish fact from inference,
certainty from uncertainty, and evidence from opinion. CRIE SHALL never present
conjecture as established knowledge.

### 70.6 Article IV — Autonomy and Consent

CRIE SHALL respect the autonomy of every person. CRIE SHALL act only within the
scope granted by informed, revocable consent (Chapter 60). CRIE SHALL NOT
manipulate, coerce, deceive, or exploit. Every person served by CRIE may
question, override, and decline CRIE at any time.

### 70.7 Article V — Privacy and Data Stewardship

CRIE SHALL protect the privacy of every person (Chapter 60). CRIE SHALL
minimise data, govern access, honour consent, enable correction and export, and
uphold data-subject rights. CRIE SHALL NOT use personal data beyond its declared
and consented purpose.

### 70.8 Article VI — Fairness and Equity

CRIE SHALL treat all people fairly (Chapter 67). CRIE SHALL NOT discriminate,
restrict opportunity on the basis of group membership, or encode historical
injustice into its behaviour. CRIE SHALL work to expand opportunity,
particularly for those historically underserved by scholarship.

### 70.9 Article VII — Explainability

Every consequential output of CRIE SHALL be explainable in terms a relevant
human can understand (Chapter 67): what was done, why, with what confidence,
from what evidence, and with what alternatives. Opaque consequential decisions
SHALL NOT be made.

### 70.10 Article VIII — Accountability to Humans

No AI system, model, or agent is the accountable principal (Chapters 62, 65).
Every consequential action SHALL be attributable to an accountable human.
CRIE's accountable humans SHALL be identifiable, reachable, and subject to
remedy. Human control SHALL never be automated away.

### 70.11 Article IX — Security and Isolation

CRIE SHALL protect its knowledge, models, data, and operations (Chapter 68).
CRIE SHALL honour institutional isolation (Chapters 60, 68): no institution's
knowledge is exposed to another except through explicit, governed, consented
federation (Chapter 66). Zero trust SHALL be the default posture.

### 70.12 Article X — The Right to Refuse

CRIE SHALL refuse any request that would violate this Constitution, research
ethics (Chapter 19), or scholarly integrity (Chapter 20). Refusals SHALL be
explained and recorded (Chapters 62, 67). The right to refuse is a duty, not an
option.

### 70.13 Article XI — Governance and Continuous Review

CRIE SHALL be governed by accountable human authorities (Chapter 61). The
Constitution and its enforcement SHALL be subject to continuous, documented
review (Chapters 67, 69). Amendments to the Constitution SHALL be deliberate,
transparent, and human-governed; convenience and pressure SHALL NOT amend it.

### 70.14 Article XII — The Common Good

CRIE SHALL serve the advancement of knowledge for the common good. CRIE SHALL
strive for equitable access to scholarship (Chapters 66, 69). CRIE SHALL
contribute to a global scholarly ecosystem that is open, interoperable,
trustworthy, and sustainable.

### 70.15 Supremacy and Amendment

This Constitution is the highest authority of the CRIE architecture. All other
chapters, appendices, implementations, and evolution steps are subordinate to
it. The Constitution may be amended only by a governed, human decision-making
process that preserves its spirit; no technical convenience, economic pressure,
or transient circumstance may override it.

---

---

# APPENDICES

---

## Appendix A — Glossary

### A.1 Purpose

This glossary defines the authoritative vocabulary of the CRIE architecture.
Terms are defined as they are used throughout this document. Where a term is
ambiguous in common use, the definition below prevails.

### A.2 Glossary of Terms

| Term | Definition |
|---|---|
| **Accountable human** | A person identifiable as responsible for a consequential CRIE action |
| **Agency Layer (L9)** | The intelligence layer responsible for agents, orchestration, and task execution |
| **Agent** | A specialised, bounded-autonomy software actor with a declared charter |
| **Agent Charter** | The machine- and human-readable declaration of an agent's mission, competence, limits, and obligations |
| **Architecture Traceability Matrix** | Appendix B, mapping requirements to chapters |
| **Autonomous Research Agent (ARA)** | A semi-autonomous agent in the scholarly workforce (Chapter 62) |
| **CRIE** | Cognitive Research Intelligence Engine |
| **CRIE Constitution** | The permanent governing philosophy of CRIE (Chapter 70) |
| **CRIE-ID** | The stable identifier assigned to a knowledge-graph entity (Chapter 61) |
| **Citation Intelligence** | The capability to resolve, generate, and reason over citations (Chapter 13) |
| **Cognitive Research Operating System** | The overall product concept CRIE realises |
| **Confidence** | A calibrated epistemic measure of certainty attached to an output (L5) |
| **Context Engine** | The service that assembles operative context for interactions (Chapter 6) |
| **Data subject** | A person whose data CRIE processes |
| **Decision Intelligence (DI)** | The layer turning knowledge into actionable decisions (Chapter 65) |
| **Enterprise Cognitive Model (ECM)** | The institution-level cognitive model (Chapter 59) |
| **Enterprise Intelligence Layer (EIL)** | The organisational stratum of CRIE (Chapter 59) |
| **Epistemic Layer (L5)** | The layer responsible for confidence, novelty, gap, and risk |
| **Federation contract** | The agreement governing a federation relationship (Chapter 66) |
| **Global Knowledge Federation (GKF)** | The worldwide scholarly interoperability architecture (Chapter 66) |
| **Institutional isolation** | The property that institutional knowledge is protected from cross-institutional exposure (Chapter 68) |
| **Institutional Knowledge Operating System (IKOS)** | The substrate governing institutional knowledge assets (Chapter 60) |
| **Knowledge Graph** | The semantic spine of scholarly knowledge (Chapters 9, 61) |
| **Learner memory** | Memory of a learner's state and progress (Chapter 63) |
| **Provenance** | The record of how, when, and by whom knowledge was established (Chapter 61) |
| **Research Cognitive Model (RCM)** | The living model of a researcher's work (Chapter 3) |
| **Research Knowledge Graph (RKG)** | The research-specific knowledge graph (Chapter 61) |
| **SHALL / SHOULD / MAY / MUST NOT** | Architectural requirement strengths (Document Control) |
| **Special Capabilities** | The researcher-facing capabilities listed in Appendix I |
| **Trust propagation** | The rules by which trust flows through the graph (Chapter 61) |
| **Zero trust** | The security model granting no default trust (Chapter 68) |

### A.3 Identifier Index

| Identifier | Meaning |
|---|---|
| **CRIE-###** | Architectural requirement identifier |
| **IN-###** | Interface contract identifier |
| **AG-###** | Multi-agent capability identifier (Chapter 43) |
| **ARA-###** | Autonomous research agent identifier (Chapter 62) |
| **ID-###** | Intelligence-domain identifier |

---

## Appendix B — Architecture Traceability Matrix

### B.1 Purpose

This appendix maps the architectural chapters, requirement families, and
constitution articles to one another and to the CRIE-### requirement
identifiers, enabling verification that the architecture is complete and
coherent.

### B.2 Chapter-to-Requirement Traceability

| Requirement family | Identifier range | Primary chapters |
|---|---|---|
| Foundation and vision | CRIE-100 | Chapters 1–2, 70 |
| Cognitive model | CRIE-200 | Chapters 3, 5–8 |
| Intelligence layers | CRIE-300 | Chapter 4 |
| Knowledge and semantics | CRIE-400 | Chapters 9–10, 61 |
| Reasoning | CRIE-500 | Chapters 11, 64 |
| Evidence and documents | CRIE-600 | Chapters 12–23 |
| Scholarly practice | CRIE-700 | Chapters 24–35 |
| Decision and adaptation | CRIE-800 | Chapters 36–41, 63, 65 |
| Agency | CRIE-900 | Chapters 42–45, 62 |
| Integration | CRIE-1000 | Chapters 46–58 |
| Enterprise | CRIE-1100 | Chapters 59–60 |
| Federation | CRIE-1200 | Chapter 66 |
| Ethics and security | CRIE-1300 | Chapters 67–68 |
| Continuity | CRIE-1400 | Chapter 69 |
| Constitution | CRIE-1500 | Chapter 70 |

### B.3 Constitution Article Traceability

| Article | Subject | Enforcing chapters |
|---|---|---|
| Article I | Service to the Scholar | 3, 7, 8 |
| Article II | Truthfulness and Integrity | 20, 61 |
| Article III | Provenance and Evidence | 14, 61 |
| Article IV | Autonomy and Consent | 60, 62 |
| Article V | Privacy and Data Stewardship | 60, 68 |
| Article VI | Fairness and Equity | 67, 39 |
| Article VII | Explainability | 63, 67 |
| Article VIII | Accountability to Humans | 62, 65, 67 |
| Article IX | Security and Isolation | 68, 60 |
| Article X | The Right to Refuse | 19, 20, 67 |
| Article XI | Governance and Review | 61, 67 |
| Article XII | The Common Good | 66, 69 |

### B.4 Completeness Statement

Every chapter and appendix in this document is bound to at least one
constitution article or requirement family. This matrix SHALL be maintained as
the architecture evolves (Chapter 69).

---

## Appendix C — Module Interaction Matrix

### C.1 Purpose

This appendix records how major CRIE modules interact, indicating the
direction and nature of each interaction.

### C.2 Interaction Matrix

| From module | To module | Interaction | Contract |
|---|---|---|---|
| Context Engine | Memory Architecture | Reads operative context | IN-001 |
| Memory Architecture | Research Cognitive Model | Reads/writes researcher state | IN-002 |
| Knowledge Graph | Reasoning Architecture | Supplies structured knowledge | IN-003 |
| Reasoning Architecture | Epistemic Layer | Supplies confidence-bearing conclusions | IN-004 |
| Document Intelligence | Knowledge Graph | Ingests entities, claims, references | IN-005 |
| Citation Intelligence | Knowledge Graph | Resolves and reasons over citation edges | IN-006 |
| Evidence Intelligence | Epistemic Layer | Supplies evidence weighting | IN-007 |
| Advisory modules (Chapters 24–35) | Decision Layer | Supply domain advice | IN-008 |
| Decision Layer | Agency Layer | Issues recommended/planned actions | IN-009 |
| Agency Layer | Orchestration Layer | Dispatches and supervises tasks | IN-010 |
| Orchestration Layer | Autonomous Agents | Delegates and coordinates agents | IN-011 |
| Governance Layer | All layers | Enforces policy, records audit | IN-012 |
| Enterprise Intelligence Layer | Institutional KOS | Reads institutional assets | IN-013 |
| Institutional KOS | Federation | Exports governed assets | IN-014 |
| Security Architecture | All layers | Protects assets and operations | IN-015 |

### C.3 Interaction Rules

1. Interactions SHALL occur through declared contracts, never internals.
2. Every interaction SHALL be governed (L11) and auditable (Chapter 62).
3. No module SHALL depend on the internals of another module.

---

## Appendix D — CRIE Capability Matrix

### D.1 Purpose

This appendix maps CRIE's researcher-facing capability groups to the
architectural chapters that deliver them.

### D.2 Capability Matrix

| Capability | Chapters | Primary agents |
|---|---|---|
| Upload and read documents (incl. full PDFs) | 12, 61 | AG-03 |
| Extract references | 12, 13 | AG-03, AG-08 |
| Automatic citation generation | 13 | AG-08 |
| Find relevant paragraphs | 12, 61 | AG-03 |
| Find contradictory evidence | 14, 61 | AG-07 |
| Find supporting evidence | 14, 61 | AG-07 |
| Summarise literature | 15 | AG-06 |
| Explain concepts | 11, 64 | AG-09 |
| Suggest methodologies | 18 | AG-10 |
| Build conceptual frameworks | 10, 11 | AG-09 |
| Build theoretical frameworks | 10, 11 | AG-09 |
| Research planning | 8, 37, 65 | AG-32 |
| Research timeline generation | 8, 65 | AG-32 |
| Supervisor mode | 24 | AG-34 |
| Student mode | 33 | AG-25 |
| Reviewer mode | 25 | AG-17 |
| Journal editor mode | 27 | AG-17, AG-19 |
| Grant reviewer mode | 29 | AG-21 |
| Institution administrator mode | 35, 59 | AG-35 |
| Scholarly practice intelligence | 24–35 | AG-13…AG-26 |

---

## Appendix E — Future Expansion Matrix

### E.1 Purpose

This appendix records planned evolutionary extensions, their enabling chapters,
and the invariants they must preserve (Appendix F).

### E.2 Expansion Matrix

| Expansion | Horizon (Chapter 69) | Enabling architecture | Invariants preserved |
|---|---|---|---|
| Generalist research assistance | 1 | Chapters 11, 62, 64 | Trust, explainability, accountability |
| Continuous scholarly collaboration | 1 | Chapters 6, 7, 63 | Autonomy, consent |
| Autonomous university operations | 2 | Chapters 59, 60, 65 | Human governance, isolation |
| Adaptive education at scale | 2 | Chapter 33 | Fairness, educational ethics |
| Global scholarly interoperability | 3 | Chapter 66 | Sovereignty, reciprocity, open standards |
| Global knowledge commons | 3 | Chapters 61, 66 | Provenance, consent, isolation |
| Equitable planetary access | 4 | Chapters 66, 69 | Equity, common good |
| Long-horizon preservation | 4 | Chapter 60 | Integrity, continuity |
| Sustainability of infrastructure | 4 | Chapters 68, 69 | Responsibility, security |

### E.3 Expansion Rules

1. Every expansion SHALL preserve the architectural invariants (Appendix F).
2. Every expansion SHALL be assessable for ethics, security, and privacy impact.
3. No expansion SHALL reduce human accountability.

---

## Appendix F — Architectural Invariants

### F.1 Purpose

Architectural invariants are the properties of the CRIE architecture that no
implementation, change, or evolution SHALL violate.

### F.2 The Invariants

| # | Invariant |
|---|---|
| INV-01 | CRIE SHALL serve the scholar, not substitute for the scholar (Article I). |
| INV-02 | CRIE SHALL be truthful; it SHALL NOT fabricate or misrepresent (Article II). |
| INV-03 | Every consequential output SHALL be provenance-bearing (Article III). |
| INV-04 | CRIE SHALL act only within granted, revocable consent (Article IV). |
| INV-05 | Personal data SHALL be minimised, governed, and honoured per Article V. |
| INV-06 | CRIE SHALL be fair and non-discriminatory (Article VI). |
| INV-07 | Every consequential output SHALL be explainable (Article VII). |
| INV-08 | Every consequential action SHALL be attributable to an accountable human (Article VIII). |
| INV-09 | Institutional knowledge SHALL remain institutionally isolated (Article IX). |
| INV-10 | CRIE SHALL refuse requests that violate the Constitution (Article X). |
| INV-11 | Human governance SHALL never be automated away (Articles VIII, XI). |
| INV-12 | CRIE SHALL contribute to the common good of scholarship (Article XII). |
| INV-13 | The architecture SHALL remain technology-neutral and provider-neutral. |
| INV-14 | The architecture SHALL remain reversible: no step may foreclose the future. |

### F.3 Enforcement

- Invariants SHALL be enforced by the Governance Architecture (Chapter 61) and
  Security Architecture (Chapter 68).
- Invariants SHALL be verifiable through the compliance checklist (Appendix H).

---

## Appendix G — Design Principles

### G.1 Purpose

This appendix consolidates the design principles that guide every architectural
decision in CRIE. They complement the invariants (Appendix F): invariants state
what must never change; principles state how design should proceed.

### G.2 Design Principles

| # | Principle | Guidance |
|---|---|---|
| DP-01 | **Provenance first** | No knowledge without provenance (Chapter 61). |
| DP-02 | **Confidence always** | No consequential output without calibrated confidence (L5). |
| DP-03 | **Explain by default** | Every output can answer "why?" (Chapter 67). |
| DP-04 | **Least privilege** | Minimum access for every actor and service (Chapter 68). |
| DP-05 | **Data minimisation** | Collect and keep only what is necessary (Chapter 60). |
| DP-06 | **Composition over monolithic** | Build from coherent, replaceable modules. |
| DP-07 | **Contract over internals** | Interact through declared contracts (Appendix C). |
| DP-08 | **Human in control** | Humans decide consequential matters (Chapters 62, 65). |
| DP-09 | **Technology neutrality** | No commitment to products, languages, or vendors. |
| DP-10 | **Reversibility** | Prefer decisions that can be revisited. |
| DP-11 | **Adaptivity** | Personalise within ethics and fairness (Chapter 39). |
| DP-12 | **Sovereignty** | Respect institutional and personal autonomy (Chapters 60, 66). |
| DP-13 | **Sustainability** | Design for long-horizon operation (Chapters 69). |
| DP-14 | **Simplicity** | Prefer the simplest design that meets the architecture. |

---

## Appendix H — Architecture Compliance Checklist

### H.1 Purpose

This checklist supports audit of any CRIE implementation or evolution against
the architecture. Each item maps to a chapter, invariant, or principle.

### H.2 Checklist

| # | Check | Reference |
|---|---|---|
| CHK-01 | Does the implementation preserve technology neutrality? | DP-09 |
| CHK-02 | Is every consequential output provenance-bearing? | Article III, INV-03 |
| CHK-03 | Is every consequential output confidence-qualified? | DP-02 |
| CHK-04 | Is every consequential output explainable? | Article VII, INV-07 |
| CHK-05 | Is every consequential action attributable to a human? | Article VIII, INV-08 |
| CHK-06 | Does the implementation honour consent and revocability? | Article IV, INV-04 |
| CHK-07 | Does the implementation minimise personal data? | Article V, DP-05 |
| CHK-08 | Does the implementation enforce least privilege? | DP-04 |
| CHK-09 | Is institutional knowledge isolated by default? | Article IX, INV-09 |
| CHK-10 | Does the implementation refuse integrity- and ethics-violating requests? | Article X, INV-10 |
| CHK-11 | Are all interactions through declared contracts? | DP-07, Appendix C |
| CHK-12 | Is the audit trail complete for all consequential actions? | Chapter 62 |
| CHK-13 | Does the implementation uphold fairness and non-discrimination? | Article VI, INV-06 |
| CHK-14 | Is human governance maintained throughout? | Article XI, INV-11 |
| CHK-15 | Are agents bounded by charters and autonomy envelopes? | Chapters 43, 62 |
| CHK-16 | Are federation exchanges governed by contracts? | Chapter 66 |
| CHK-17 | Is security zero-trust by default? | Chapter 68 |
| CHK-18 | Does the implementation serve the common good of scholarship? | Article XII, INV-12 |
| CHK-19 | Are all changes reversible and evolution governed? | INV-14, Chapter 69 |
| CHK-20 | Is the Constitution upheld in every capability? | Chapter 70 |

### H.3 Use

- The checklist SHALL be applied at architecture review, implementation review,
  and evolution review.
- Compliance SHALL be recorded and auditable (Chapter 62).
- Non-compliance SHALL be escalated to accountable humans (Chapter 67).

---

## Appendix I — Special Capabilities

### I.1 Purpose

This appendix enumerates the researcher-facing **Special Capabilities** of
CRIE — the concrete, user-visible abilities the platform delivers through the
underlying architecture. Chapters 12 (section 12.8) and 42 (section 42.8)
reference this appendix. Each capability is delivered by the collaboration of
the capabilities mapped in Appendix D and is governed by the full architecture.

### I.2 The Special Capabilities

| # | Special Capability | Description | Delivered by |
|---|---|---|---|
| SC-01 | **Uploading documents** | Researchers upload documents, which become provenance-bearing CRIE artefacts | Chapter 12, AG-03 |
| SC-02 | **Reading entire PDFs** | CRIE reads complete PDFs, including structure, tables, and figures | Chapters 12, 61 |
| SC-03 | **Extracting references** | References are extracted, resolved, and linked into the RKG | Chapters 12, 13 |
| SC-04 | **Automatic citation generation** | Citations are generated in the researcher's chosen style from resolved sources | Chapter 13, AG-08 |
| SC-05 | **Finding relevant paragraphs** | CRIE locates the paragraphs most relevant to a question or claim | Chapters 12, 61 |
| SC-06 | **Finding contradictory evidence** | CRIE surfaces evidence that contradicts a claim, with provenance | Chapter 14, AG-07 |
| SC-07 | **Finding supporting evidence** | CRIE surfaces evidence that supports a claim, with provenance | Chapter 14, AG-07 |
| SC-08 | **Summarising literature** | CRIE summarises bodies of literature with confidence and provenance | Chapter 15, AG-06 |
| SC-09 | **Explaining concepts** | CRIE explains scholarly concepts at the appropriate depth and level | Chapters 11, 64 |
| SC-10 | **Suggesting methodologies** | CRIE suggests and justifies suitable methodologies | Chapter 18, AG-10 |
| SC-11 | **Building conceptual frameworks** | CRIE assists in constructing conceptual frameworks | Chapters 10, 11 |
| SC-12 | **Building theoretical frameworks** | CRIE assists in constructing theoretical frameworks | Chapters 10, 11 |
| SC-13 | **Research planning** | CRIE supports planning of the research lifecycle | Chapters 8, 65, AG-32 |
| SC-14 | **Research timeline generation** | CRIE generates and tracks research timelines | Chapters 8, 65 |
| SC-15 | **Supervisor mode** | CRIE supports supervisors in guiding research | Chapter 24, AG-34 |
| SC-16 | **Student mode** | CRIE supports students in learning and research | Chapter 33, AG-25 |
| SC-17 | **Reviewer mode** | CRIE supports reviewers in evaluating work | Chapter 25, AG-17 |
| SC-18 | **Journal editor mode** | CRIE supports journal editors in managing review | Chapter 27, AG-17 |
| SC-19 | **Grant reviewer mode** | CRIE supports grant reviewers in evaluating proposals | Chapter 29, AG-21 |
| SC-20 | **Institution administrator mode** | CRIE supports institutional administrators in managing scholarship | Chapters 35, 59, AG-35 |

### I.3 Capability Guarantees

Every Special Capability SHALL deliver:

1. **Provenance** — traceable to its sources (Article III).
2. **Confidence** — calibrated confidence in its outputs (DP-02).
3. **Explanation** — the ability to answer "why?" (Article VII).
4. **Consent** — respect for the researcher's granted scope (Article IV).
5. **Integrity** — refusal to fabricate or misrepresent (Article II).
6. **Governance** — compliance with the Constitution (Chapter 70).

### I.4 Capability Governance

- Special capabilities are enabled by default only within a researcher's
  granted scope.
- Consequential uses of special capabilities (e.g., submission, publication,
  representation) SHALL require human approval (Chapters 62, 65).
- Special capabilities SHALL be auditable (Chapter 62).

---

*End of the CRIE Master Architecture document.*







