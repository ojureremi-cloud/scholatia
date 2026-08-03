# SCHOLATIA AI KNOWLEDGE REGISTER

**Version 1.0**

**Status:** Active

**Date:** 2026-08-02

**Owner:** Governance

> This register documents every **approved** Scholatia AI capability. For each
> capability it records the purpose, capabilities, dependencies, implementation
> phase, related architectural decisions (SADRs), and current status.
>
> A capability is only entered here once approved. This register is the
> authoritative index over the AI surfaces currently distributed across the
> intelligence, messaging, collaboration, and SWTROP architecture documents,
> and it reserves the AI capabilities planned for later phases.

---

# Status Legend

| Value | Meaning |
| --- | --- |
| Implemented | The capability is realised in the codebase. |
| Partially Implemented | Derived/AI-ready surfaces exist; the full capability is not yet realised. |
| Planned | Approved direction; not yet realised. |
| Unknown | Realisation state has not been confirmed. |

# Summary

| AI Capability | Status | Implementation Phase | Related SADR(s) |
| --- | --- | --- | --- |
| CRIE | Planned | TBD (requires `CRIE_ARCHITECTURE.md`) | SADR-006, SADR-015 |
| Research Writing Intelligence | Partially Implemented | Phase 2.2E (surfaces); full: future | SADR-006 |
| Literature Intelligence | Partially Implemented | Phase 1.8 (signals); full: future | SADR-006 |
| Supervisor Intelligence | Planned | Future | SADR-006 |
| Reviewer Intelligence | Partially Implemented | Phase 2.2E (surfaces); full: future | SADR-006, SADR-007 |
| Editorial Intelligence | Partially Implemented | Phase 2.2E (surfaces); full: future | SADR-006 |
| Conference Intelligence | Partially Implemented | Phase 1.8 (signals); full: future | SADR-006 |
| Journal Intelligence | Partially Implemented | Phase 1.8 (signals); full: future | SADR-006 |
| Marketplace Intelligence | Partially Implemented | Phase 1.8 / 2.0 (derived); full: future | SADR-006, SADR-008 |
| Identity Intelligence | Partially Implemented | Phase 1.8 | SADR-006 |
| Trust Intelligence | Partially Implemented | Phase 1.9C | SADR-006, SADR-007 |
| Digital Twin Intelligence | Planned | Phase 5.x | SADR-018 |
| Recommendation Intelligence | Partially Implemented | Phase 1.8 (derived); full: future | SADR-006 |
| Research Integrity Intelligence | Partially Implemented | Phase 1.9C / 2.2E (surfaces); full: future | SADR-006, SADR-007 |
| Statistics Intelligence | Partially Implemented | Phase 1.8 / 2.2 (engine-derived) | SADR-006, SADR-013 |
| Future AI Modules | Planned | Phase 5 / 5.x | SADR-018 |

---

# CRIE

> **Note:** The acronym **CRIE** appears in planning context (it is referenced
> as a consumer of the SWTROP execution surface) but is **not formally defined
> anywhere in the repository**. Its governing definition must be established in
> a `CRIE_ARCHITECTURE.md` before any implementation is approved. Until then it
> is registered as **Planned** with this note.

- **Purpose:** Platform-wide orchestration intelligence layer; the consuming
  surface for SWTROP workflow, task, review, and approval orchestration. Exact
  scope pending a formal definition.
- **Capabilities:** TBD — to be defined by `CRIE_ARCHITECTURE.md`.
- **Dependencies:** `WORKFLOW_ARCHITECTURE.md` (SWTROP), `docs/AI_DEVELOPMENT_PROTOCOL.md`, `SCHOLATIA_CORE_PLATFORM_MANIFEST.md`.
- **Implementation Phase:** TBD.
- **Related SADRs:** SADR-006 (intelligence derived), SADR-015 (AI governance).
- **Status:** Planned.

---

# Research Writing Intelligence

- **Purpose:** Assist researchers in producing scholarly writing — drafting,
  structuring, and refining manuscripts, theses, and artefacts.
- **Capabilities:** Currently derived: SWTROP Workbench `ai-note` items,
  artefact drafting (`createArtefactFromWorkbenchItem`), chapters + sections
  with derived word counts and per-chapter progress, workbench item promotion.
  Planned: model-based drafting, revision suggestions, writing guidance.
- **Dependencies:** `lib/workflows.ts`, `types/workflows.ts`
  (`Workbench`, `ScholarlyArtefact`), Research lifecycle, placeholder data.
- **Implementation Phase:** Phase 2.2E (derived surfaces); full capability in a
  future AI phase.
- **Related SADRs:** SADR-006.
- **Status:** Partially Implemented.

---

# Literature Intelligence

- **Purpose:** Derive signals over the scholarly literature — trends, emerging
  topics, citation predictions, research gaps.
- **Capabilities:** Currently derived: research trends, emerging topics,
  citation predictions, research gaps, scenario forecasts from the unified
  discovery index (`lib/intelligence.ts`, `constants/placeholder-intelligence.ts`).
  Planned: live literature connectors (Crossref/OpenAlex), semantic search.
- **Dependencies:** `INTELLIGENCE_ARCHITECTURE.md`, `DISCOVERY_ARCHITECTURE.md`, placeholder modules.
- **Implementation Phase:** Phase 1.8 (derived signals); live connectors in a
  future phase.
- **Related SADRs:** SADR-006.
- **Status:** Partially Implemented.

---

# Supervisor Intelligence

- **Purpose:** Intelligent support for supervisors of student and doctoral
  research — progress visibility, milestone guidance, and supervision insights.
- **Capabilities:** SWTROP provides the supervision workflows (undergraduate,
  masters-dissertation, phd-thesis templates; supervisory review cycles with
  voice review) and workflow insights. Dedicated supervisor *intelligence*
  surfaces are not yet built.
- **Dependencies:** `WORKFLOW_ARCHITECTURE.md`, Research lifecycle
  (`lib/lifecycle.ts`), SWTROP review engine.
- **Implementation Phase:** Future (following a `SUPERVISOR_INTELLIGENCE_ARCHITECTURE.md`).
- **Related SADRs:** SADR-006.
- **Status:** Planned.

---

# Reviewer Intelligence

- **Purpose:** Support reviewers — review assignment, round management,
  structured feedback, and reviewer analytics.
- **Capabilities:** Currently derived: round-agnostic review cycles, typed +
  voice comments, review statistics/analytics (`lib/reviews.ts`), reviewer
  recommendations via the Intelligence and Trust modules. Planned: model-based
  review assistance.
- **Dependencies:** `lib/reviews.ts`, `types/reviews.ts`,
  `INTELLIGENCE_ARCHITECTURE.md`, `TRUST_ARCHITECTURE.md`.
- **Implementation Phase:** Phase 2.2E (engine surfaces); Phase 1.8 / 1.9C
  (recommendations); full capability future.
- **Related SADRs:** SADR-006, SADR-007.
- **Status:** Partially Implemented.

---

# Editorial Intelligence

- **Purpose:** Support editorial decision-making — desk assessment, reviewer
  assignment, and journal production insights.
- **Capabilities:** Currently derived: journal-submission workflows in SWTROP,
  journal recommendations and impact signals in the Intelligence module, journal
  analytics. Planned: model-based editorial decisions and desk assessment.
- **Dependencies:** `WORKFLOW_ARCHITECTURE.md`, `JOURNAL_ARCHITECTURE.md`,
  `INTELLIGENCE_ARCHITECTURE.md`.
- **Implementation Phase:** Phase 2.2E (workflow surfaces); Phase 1.8 (signals);
  full capability future.
- **Related SADRs:** SADR-006.
- **Status:** Partially Implemented.

---

# Conference Intelligence

- **Purpose:** Conference discovery, relevance, and engagement intelligence.
- **Capabilities:** Currently derived: conference recommendations
  (dates, registration/submission status), conference-space workflows, trends by
  discipline. Planned: conference-specific predictive and engagement models.
- **Dependencies:** `INTELLIGENCE_ARCHITECTURE.md`, `CONFERENCE_ARCHITECTURE.md`,
  `WORKFLOW_ARCHITECTURE.md`.
- **Implementation Phase:** Phase 1.8 (recommendations); Phase 2.2D/E
  (conference spaces + submissions); full capability future.
- **Related SADRs:** SADR-006.
- **Status:** Partially Implemented.

---

# Journal Intelligence

- **Purpose:** Journal targeting, fit scoring, and publishing insights.
- **Capabilities:** Currently derived: journal recommendations with impact
  factor, quartile, and fit score; journal-submission workflows; journal
  analytics. Planned: personalised journal targeting keyed to the researcher.
- **Dependencies:** `INTELLIGENCE_ARCHITECTURE.md`, `JOURNAL_ARCHITECTURE.md`,
  `WORKFLOW_ARCHITECTURE.md`.
- **Implementation Phase:** Phase 1.8 (recommendations); Phase 2.2E
  (journal-submission workflows); full capability future.
- **Related SADRs:** SADR-006.
- **Status:** Partially Implemented.

---

# Marketplace Intelligence

- **Purpose:** Commercial intelligence over the marketplace — listings,
  vendors, orders, and promotion performance.
- **Capabilities:** Currently derived: marketplace/commerce analytics,
  recommendations, review and rating signals, advertising campaign analytics.
  Planned: model-based ranking and personalised commerce intelligence.
- **Dependencies:** `MARKETPLACE_ARCHITECTURE.md`, `COMMERCE_ARCHITECTURE.md`,
  `ADVERTISING_ARCHITECTURE.md`, `TRUST_ARCHITECTURE.md`.
- **Implementation Phase:** Phase 1.8 / Phase 2.0 (derived analytics); full
  capability future.
- **Related SADRs:** SADR-006, SADR-008.
- **Status:** Partially Implemented.

---

# Identity Intelligence

- **Purpose:** Intelligence over researcher identities — expertise, pairing,
  and ecosystem role.
- **Capabilities:** Currently derived: researcher summaries, expertise matches,
  collaboration suggestions (shared interests, complementary skills,
  overlap/potential scores). Planned: personalised intelligence keyed to the
  signed-in researcher's SAID.
- **Dependencies:** `INTELLIGENCE_ARCHITECTURE.md`,
  `RESEARCHER_IDENTITY_ARCHITECTURE.md`.
- **Implementation Phase:** Phase 1.8 (derived surfaces); personalisation in a
  future phase.
- **Related SADRs:** SADR-006.
- **Status:** Partially Implemented.

---

# Trust Intelligence

- **Purpose:** Credibility intelligence — verification, reputation, badges, and
  trusted-recommendation signals.
- **Capabilities:** Currently derived: verification records, trust scores,
  reputation reports, badges, peer-review and integrity events, trusted
  recommendations for venues, reviewers, grants, and citations
  (`lib/trust.ts`, `TRUST_ARCHITECTURE.md`). Planned: model-based trust
  calibration.
- **Dependencies:** `TRUST_ARCHITECTURE.md`, `INTELLIGENCE_ARCHITECTURE.md`,
  `RESEARCHER_IDENTITY_ARCHITECTURE.md`.
- **Implementation Phase:** Phase 1.9C (derived surfaces); full capability future.
- **Related SADRs:** SADR-006, SADR-007.
- **Status:** Partially Implemented.

---

# Digital Twin Intelligence

- **Purpose:** A persistent, personalised research digital twin — a living
  representation of a researcher's scholarly profile and behaviour.
- **Capabilities:** Planned: research digital twin, AI research assistant, AI
  agents (per `SCHOLATIA_CORE_PLATFORM_MANIFEST.md` §17 and
  `PHASE_ROADMAP.md` §8).
- **Dependencies:** `INTELLIGENCE_ARCHITECTURE.md`,
  `RESEARCHER_IDENTITY_ARCHITECTURE.md`, `DIGITAL_TWIN_ARCHITECTURE.md` (planned).
- **Implementation Phase:** Phase 5.x.
- **Related SADRs:** SADR-018.
- **Status:** Planned.

---

# Recommendation Intelligence

- **Purpose:** Cross-module recommendations — funding, journal, conference,
  dataset, institution, collaboration, and commerce.
- **Capabilities:** Currently derived: funding/journal/conference/dataset/
  institution recommendations, collaboration pairings, commerce and marketplace
  recommendations — all computed by pure engines with confidence calibration.
  Planned: personalised ranking keyed to the researcher and real engagement data.
- **Dependencies:** `INTELLIGENCE_ARCHITECTURE.md`, `lib/intelligence.ts`,
  `types/intelligence.ts`, placeholder modules, `TRUST_ARCHITECTURE.md`.
- **Implementation Phase:** Phase 1.8 (derived); ranking models in a future phase.
- **Related SADRs:** SADR-006.
- **Status:** Partially Implemented.

---

# Research Integrity Intelligence

- **Purpose:** Detect, record, and surface integrity signals across the
  scholarly workflow.
- **Capabilities:** Currently derived: integrity events in the Trust module,
  ethics-review workflows in SWTROP, review and approval audit trails
  (append-only). Planned: model-based integrity and ethics intelligence.
- **Dependencies:** `TRUST_ARCHITECTURE.md`, `WORKFLOW_ARCHITECTURE.md`.
- **Implementation Phase:** Phase 1.9C (integrity records); Phase 2.2E
  (ethics review workflows); full capability future.
- **Related SADRs:** SADR-006, SADR-007.
- **Status:** Partially Implemented.

---

# Statistics Intelligence

- **Purpose:** Statistical insight over scholarly activity — analytics,
  distributions, and derived statistics.
- **Capabilities:** Currently derived: engine-computed statistics and analytics
  across every module (statistic cards, analytics panels, portfolio aggregates),
  computed by pure engines and never hand-maintained. Statistical analysis is
  also offered as a marketplace/service capability. Planned: model-based
  statistical intelligence and forecasting.
- **Dependencies:** Engine-derived aggregates across `lib/`; `SERVICES_ARCHITECTURE.md`,
  `INTELLIGENCE_ARCHITECTURE.md`.
- **Implementation Phase:** Phase 1.8 / Phase 2.2 (engine-derived); full
  capability future.
- **Related SADRs:** SADR-006, SADR-013.
- **Status:** Partially Implemented.

---

# Future AI Modules

Reserved for capabilities approved in later phases. Each will be promoted to a
dedicated section above once approved and documented.

| Capability | Phase | Notes |
| --- | --- | --- |
| AI Research Assistant | Phase 5 | Knowledge-ecosystem module per `PHASE_ROADMAP.md` §8. |
| Research Digital Twin | Phase 5 | See **Digital Twin Intelligence** above. |
| AI Agents | Phase 5.x | Per `SCHOLATIA_CORE_PLATFORM_MANIFEST.md` §17. |
| Semantic Search | Phase 5 | Knowledge Graph / Citation Graph / Semantic Search per `PHASE_ROADMAP.md` §8. |
| Research Impact Engine | Phase 5 | Impact measurement module per `PHASE_ROADMAP.md` §8. |
| Personalised Intelligence (SAID-keyed) | Future | Replaces the fixed focus researcher with the signed-in researcher's SAID. |

- **Status:** Planned.

---

# Cross References

- Decisions: `docs/governance/SADR_REGISTER.md`
- Phases: `docs/governance/IMPLEMENTATION_REGISTER.md`
- Documents: `docs/governance/ARCHITECTURE_REPOSITORY_REGISTER.md`
- Traceability: `docs/governance/REQUIREMENTS_TRACEABILITY_REGISTER.md`
- Intelligence platform: `docs/INTELLIGENCE_ARCHITECTURE.md`

---

# Maintenance

- **Update trigger:** when an AI capability is approved, promoted to
  implemented, superseded, or deprecated; or when its phase changes.
- **Owner:** Governance.
- **Next review:** on the next governance phase (Phase G0+).

---

*Version 1.0 — Register of every approved Scholatia AI capability.*
