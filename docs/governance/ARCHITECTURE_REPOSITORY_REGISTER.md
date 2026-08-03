# SCHOLATIA ARCHITECTURE REPOSITORY REGISTER

**Version 1.0**

**Status:** Active

**Date:** 2026-08-02

**Owner:** Governance

> This is the **master index** of every Scholatia architecture document. It
> records, for each document, its filename, purpose, owner, status,
> dependencies, and implementation impact so that future modules and AI
> contributors can find the authoritative document for any concern without
> guessing.
>
> This register is a **living governance document** and is part of the
> governance register suite:

```
docs/governance/
├── SADR_REGISTER.md                  (index of architectural decisions)
├── ARCHITECTURE_REPOSITORY_REGISTER.md  (this document — index of docs)
├── REQUIREMENTS_TRACEABILITY_REGISTER.md (decision → spec → phase → code → verification → tag)
├── IMPLEMENTATION_REGISTER.md        (tracking of implementation phases)
└── AI_KNOWLEDGE_REGISTER.md          (index of approved AI capabilities)
```

---

# Status Legend

| Value | Meaning |
| --- | --- |
| Active | Current and governing. |
| Analysis | Informational / analytical; changes no code. |
| Historical | Snapshot of a completed effort; retained for reference. |
| Planned | Not yet written; reserved in this register. |

# Owner Legend

Owner is the domain or module responsible for the document. Where no owner is
recorded in the document itself, ownership is assigned to the governing module.

---

# Register by Category

## Manifest

| Filename | Purpose | Owner | Status | Dependencies | Implementation Impact |
| --- | --- | --- | --- | --- | --- |
| `SCHOLATIA_CORE_PLATFORM_MANIFEST.md` | The constitutional architecture of Scholatia — the single source of truth for every module, developer, and AI contributor. Version 1.0. | Governance | Active | None (constitutional layer) | Binding on all modules. Defines principles, module map, data ownership, dependency rules, lifecycle engine, ID standards, placeholder, component, utility, hook, documentation, database, coding, AI, monetisation, and roadmap sections. |

## AI Development Protocol

| Filename | Purpose | Owner | Status | Dependencies | Implementation Impact |
| --- | --- | --- | --- | --- | --- |
| `AI_DEVELOPMENT_PROTOCOL.md` | The mandatory engineering protocol every AI contributor must follow when modifying the codebase — audit first, reuse before create, verification, recovery, git, and phase-boundary rules. Version 1.0. | Governance | Active | `SCHOLATIA_CORE_PLATFORM_MANIFEST.md`, `PHASE_ROADMAP.md`, `ARCHITECTURE_DECISIONS.md` | Governs how all future development is performed, including the mandatory verification suite (`npx tsc --noEmit`, `npm run lint`, `npm run build`). |

## Architecture Decisions

| Filename | Purpose | Owner | Status | Dependencies | Implementation Impact |
| --- | --- | --- | --- | --- | --- |
| `ARCHITECTURE_DECISIONS.md` | The append-only record of every significant architectural decision (ADR-001 … ADR-018), each with context, decision, rationale, consequences, and status. Version 1.0. | Governance | Active | None (records decisions over the Manifest) | Indexed by `docs/governance/SADR_REGISTER.md`. New decisions are appended here before being indexed. |

## Roadmaps

| Filename | Purpose | Owner | Status | Dependencies | Implementation Impact |
| --- | --- | --- | --- | --- | --- |
| `PHASE_ROADMAP.md` | The official implementation order of every Scholatia module (Phase 0 Foundation → Phase 6 Platform Ecosystem), including dependency graph, release strategy, and long-term vision. Version 1.0. | Governance | Active | `SCHOLATIA_CORE_PLATFORM_MANIFEST.md` | Authoritative reference for all future development phases; tracked per-phase in `docs/governance/IMPLEMENTATION_REGISTER.md`. |

## Security

| Filename | Purpose | Owner | Status | Dependencies | Implementation Impact |
| --- | --- | --- | --- | --- | --- |
| `AUTHENTICATION_ARCHITECTURE.md` | The authentication and user account platform — registration, email verification, sign-in, sessions, recovery, logout, profile management, layered on SAID with a 10-role RBAC engine. | Authentication & Security | Active | `identity-architecture.md`, `USER_MODEL.md`, `RBAC.md` | Defines `lib/auth.ts`, `lib/said.ts`, `types/identity.ts`, `types/security.ts`, auth routes, hooks, and the verification surface. |
| `RBAC.md` | The 10-role authorization projection over the SAID identity model (`lib/rbac.ts`), reusing the `RoleType` and `PermissionKey` vocabularies. | Authentication & Security | Active | `identity-architecture.md`, `USER_MODEL.md` | Defines role hierarchy, role derivations, and permissions used across every module's authorization. |
| `USER_MODEL.md` | The user / profile / SAID account schema — entities, relationships, and SQL-ready persistence shape. | Authentication & Security | Active | `identity-architecture.md` | Foundation of the account domain; seed for future persistence. |

## Privacy

| Filename | Purpose | Owner | Status | Dependencies | Implementation Impact |
| --- | --- | --- | --- | --- | --- |
| *(none yet)* | No dedicated privacy architecture document exists. The `/privacy` route (implemented) renders the privacy policy surface only. | Privacy | Planned | `SCHOLATIA_CORE_PLATFORM_MANIFEST.md` §2 (Principle 18) | Reserved. A `PRIVACY_ARCHITECTURE.md` must be created before any data-processing persistence phase. |

## AI

| Filename | Purpose | Owner | Status | Dependencies | Implementation Impact |
| --- | --- | --- | --- | --- | --- |
| `INTELLIGENCE_ARCHITECTURE.md` | The Scholarly Intelligence Platform — derived insights, recommendations, trends, predictions, gaps, forecasts, expertise matches, collaboration pairings, and the ecosystem knowledge graph, with zero data duplication. | Intelligence | Active | `DISCOVERY_ARCHITECTURE.md`, placeholder modules, `lib/lifecycle.ts` | Defines `lib/intelligence.ts`, `types/intelligence.ts`, `constants/placeholder-intelligence.ts`, `components/intelligence/*`, and the `/intelligence` route. |
| `AI_KNOWLEDGE_REGISTER.md` *(governance)* | The register of every approved AI capability and its status (see `docs/governance/AI_KNOWLEDGE_REGISTER.md`). | Governance | Active | `INTELLIGENCE_ARCHITECTURE.md`, SWTROP and collaboration docs | Cross-references every AI capability to its implementation phase and related SADRs. |
| *(none yet)* | No unified AI architecture document exists; AI surfaces are distributed across `INTELLIGENCE_ARCHITECTURE.md`, `MESSAGING_ARCHITECTURE.md`, `COLLABORATION_ARCHITECTURE.md`, and `WORKFLOW_ARCHITECTURE.md` (AI-ready derived insights). | AI | Planned | `AI_KNOWLEDGE_REGISTER.md` | Reserved. An `AI_ARCHITECTURE.md` should consolidate the AI layer ahead of Phase 5. |

## Marketplace

| Filename | Purpose | Owner | Status | Dependencies | Implementation Impact |
| --- | --- | --- | --- | --- | --- |
| `MARKETPLACE_ARCHITECTURE.md` | The academic marketplace — vendors, storefronts, listings, reviews, orders, promotions across twelve category families and seventeen vendor types. | Marketplace | Active | `COMMERCE_ARCHITECTURE.md`, `ADVERTISING_ARCHITECTURE.md`, `TRUST_ARCHITECTURE.md` | Defines marketplace engine, types, placeholders, components, and routes. |
| `ADVERTISING_ARCHITECTURE.md` | Academic advertising and sponsored content — every academic object promotable through campaigns, ad sets, and creatives. | Advertising | Active | `COMMERCE_ARCHITECTURE.md`, `TRUST_ARCHITECTURE.md` | Defines campaign machinery, advertiser surfaces, types, and placeholders. |
| `COMMERCE_ARCHITECTURE.md` | The commerce and financial operating system — products, carts, orders, payments, subscriptions, escrow, settlement, commissions. | Commerce | Active | `TRUST_ARCHITECTURE.md`, `AUTHENTICATION_ARCHITECTURE.md` | Defines `lib/commerce.ts`, types, placeholders, and the commerce routes. |
| `SERVICES_ARCHITECTURE.md` | The research services marketplace — providers, packages, service orders, milestones, disputes. | Services | Active | `RESEARCHER_IDENTITY_ARCHITECTURE.md`, `COMMERCE_ARCHITECTURE.md` | Defines `lib/services.ts`, types, placeholders, and services routes. |

## CRIE

| Filename | Purpose | Owner | Status | Dependencies | Implementation Impact |
| --- | --- | --- | --- | --- | --- |
| *(none yet)* | The acronym **CRIE** appears in planning context but is not formally defined or documented anywhere in the repository. It is reserved here until a governing document defines it. | CRIE | Planned | `WORKFLOW_ARCHITECTURE.md` (SWTROP is its execution surface) | Reserved. A `CRIE_ARCHITECTURE.md` must be created and registered here before any CRIE implementation phase. |

## Digital Twins

| Filename | Purpose | Owner | Status | Dependencies | Implementation Impact |
| --- | --- | --- | --- | --- | --- |
| *(none yet)* | Research Digital Twin is a Phase 5 capability (`PHASE_ROADMAP.md` §8; `SCHOLATIA_CORE_PLATFORM_MANIFEST.md` §17) with no architecture document yet. | Digital Twin | Planned | `INTELLIGENCE_ARCHITECTURE.md`, `RESEARCHER_IDENTITY_ARCHITECTURE.md` | Reserved. A `DIGITAL_TWIN_ARCHITECTURE.md` must be created before Phase 5. |

## Identity

| Filename | Purpose | Owner | Status | Dependencies | Implementation Impact |
| --- | --- | --- | --- | --- | --- |
| `identity-architecture.md` | The early SAID identity and trust architecture — SAID format, account categories, roles, trust foundations. | Identity | Active | None | Foundation of `lib/said.ts`, `types/identity.ts`, and role model. Superseded in part by `SCHOLATIA_CORE_PLATFORM_MANIFEST.md` and `RESEARCHER_IDENTITY_ARCHITECTURE.md`. |
| `RESEARCHER_IDENTITY_ARCHITECTURE.md` | The researcher identity layer at the heart of the ecosystem — SAID, personal academic site, embedded identity and lifecycle engines, and the researcher ecosystem. | Identity | Active | `identity-architecture.md`, `USER_MODEL.md`, `lib/lifecycle.ts` | Defines `lib/researchers.ts`, types, placeholders, `/researchers/[username]`, and research hub. |
| `USER_MODEL.md` | The user / profile / SAID account schema. | Authentication & Security | Active | `identity-architecture.md` | See **Security** above; cross-registered here for identity completeness. |

## Trust

| Filename | Purpose | Owner | Status | Dependencies | Implementation Impact |
| --- | --- | --- | --- | --- | --- |
| `TRUST_ARCHITECTURE.md` | Trust, verification & reputation engine — verification records, trust scores, reputation reports, badges, peer-review assignment, integrity events, ORCID anchoring, and recommendations, all derived. | Trust | Active | `RESEARCHER_IDENTITY_ARCHITECTURE.md`, `INTELLIGENCE_ARCHITECTURE.md` | Defines `lib/trust.ts`, types, placeholders, and the `/trust` surface. |

## Research

| Filename | Purpose | Owner | Status | Dependencies | Implementation Impact |
| --- | --- | --- | --- | --- | --- |
| `RESEARCH_LIFECYCLE.md` | Analysis document mapping the repository to the canonical research lifecycle and defining module relationships, gaps, and implementation order. | Research | Analysis | `architecture.md`, `identity-architecture.md` | Informational; no code changes. Superseded in part by `lib/lifecycle.ts` and `SCHOLATIA_CORE_PLATFORM_MANIFEST.md` §6. |
| `DATASET_ARCHITECTURE.md` | Dataset module (lifecycle stage 6) — versions, licenses, contributors, citations, DOIs, access level, verification. | Research | Active | `RESEARCH_LIFECYCLE.md`, `lib/lifecycle.ts` | Defines dataset types, placeholders, components, `/datasets`. |
| `MANUSCRIPT_ARCHITECTURE.md` | Manuscript & submission workspace (stages 8–10) — drafting, journal targeting, submission, review rounds, editorial decisions, revision history. | Research | Active | `RESEARCH_LIFECYCLE.md`, `lib/lifecycle.ts` | Defines manuscript types, placeholders, components, `/manuscripts`. |
| `FUNDING_ARCHITECTURE.md` | Funding & grants (stage 4) — agencies, programmes, calls, grants, awards, budgets. | Research | Active | `RESEARCH_LIFECYCLE.md`, `lib/lifecycle.ts` | Defines funding types, placeholders, components, `/funding`. |
| `INSTITUTION_ARCHITECTURE.md` | Institutions — campuses, faculties, departments, research centres, verification, rankings. | Institutions | Active | `RESEARCHER_IDENTITY_ARCHITECTURE.md`, `TRUST_ARCHITECTURE.md` | Defines institution types, placeholders, components, `/institutions`. |
| `DISCOVERY_ARCHITECTURE.md` | Discovery platform — unified searchable index, facets, filters, ranked results, suggestions, all derived with live references. | Discovery | Active | `RESEARCH_LIFECYCLE.md`, placeholder modules | Defines `lib/discovery.ts`, types, placeholders, `/discovery`. |

## Publishing

| Filename | Purpose | Owner | Status | Dependencies | Implementation Impact |
| --- | --- | --- | --- | --- | --- |
| `JOURNAL_ARCHITECTURE.md` | Journal publishing platform (stages 8–11) — editorial board, peer review modes, submissions, production queue, policies, impact metrics. | Journals | Active | `RESEARCH_LIFECYCLE.md`, `MANUSCRIPT_ARCHITECTURE.md`, `lib/lifecycle.ts` | Defines journal types, placeholders, components, `/journals`. |
| `PUBLISHER_ARCHITECTURE.md` | Publisher platform — publishers, divisions, imprints, book series, editorial offices, spanning publication (11) and conference (12) stages. | Publishers | Active | `JOURNAL_ARCHITECTURE.md`, `CONFERENCE_ARCHITECTURE.md` | Defines publisher types, placeholders, components, `/publishers`. |
| `MANUSCRIPT_ARCHITECTURE.md` | Shared with **Research**; also governs the manuscript-to-publication publishing flow. | Research / Publishing | Active | — | See **Research** above. |

## Conferences

| Filename | Purpose | Owner | Status | Dependencies | Implementation Impact |
| --- | --- | --- | --- | --- | --- |
| `CONFERENCE_ARCHITECTURE.md` | Conference ecosystem (stage 12) — committees, tracks, papers, schedule, keynotes, registration, sponsors, proceedings, awards, travel grants. | Conferences | Active | `RESEARCH_LIFECYCLE.md`, `lib/lifecycle.ts` | Defines conference types, placeholders, components, `/conferences`. |

## Collaboration

| Filename | Purpose | Owner | Status | Dependencies | Implementation Impact |
| --- | --- | --- | --- | --- | --- |
| `COLLABORATION_ARCHITECTURE.md` | Collaboration workspace platform (Phase 2.2D) — research groups, labs, project workspaces, institution/conference/journal spaces, communities; role-governed shared surface. | Collaboration | Active | `MESSAGING_ARCHITECTURE.md`, `NOTIFICATIONS_ARCHITECTURE.md`, `ACTIVITY_ARCHITECTURE.md` | Defines `lib/collaboration.ts`, `types/collaboration.ts`, placeholders, `/collaboration`. |
| `ACTIVITY_ARCHITECTURE.md` | Unified scholarly activity feed (Phase 2.2C) — platform-wide canonical event stream with derived feeds, trending, moderation, insights, analytics. | Activity | Active | `NOTIFICATIONS_ARCHITECTURE.md`, `MESSAGING_ARCHITECTURE.md` | Defines `lib/activity.ts`, types, placeholders, `/activity`. |

## Messaging

| Filename | Purpose | Owner | Status | Dependencies | Implementation Impact |
| --- | --- | --- | --- | --- | --- |
| `MESSAGING_ARCHITECTURE.md` | Messaging platform (Phase 2.2B) — direct, group, institution, publisher, conference, journal, project, grant, marketplace, service, support conversations; supersedes the legacy marketplace message model. | Messaging | Active | `NOTIFICATIONS_ARCHITECTURE.md`, `ACTIVITY_ARCHITECTURE.md`, `COMMERCE_ARCHITECTURE.md` | Defines `lib/messages.ts`, `types/messages.ts`, placeholders, AI-ready insights, `/messages`. |

## Notifications

| Filename | Purpose | Owner | Status | Dependencies | Implementation Impact |
| --- | --- | --- | --- | --- | --- |
| `NOTIFICATIONS_ARCHITECTURE.md` | Unified notification engine (Phase 2.2A) — canonical event-driven delivery backbone: channels, templates, deliveries, digests, subscriptions, alerts. | Notifications | Active | All module event sources | Defines `lib/notifications.ts`, types, placeholders, `/notifications`. |

## SWTROP

| Filename | Purpose | Owner | Status | Dependencies | Implementation Impact |
| --- | --- | --- | --- | --- | --- |
| `WORKFLOW_ARCHITECTURE.md` | SWTROP — Scholarly Workflow, Task & Review Orchestration Platform (Phase 2.2E) — generic template-driven orchestration: workflow, task, review & approval engines, workbench, artefacts. | SWTROP | Active | `COLLABORATION_ARCHITECTURE.md`, `lib/lifecycle.ts`, RBAC, Authentication | Defines `lib/workflows.ts`, `lib/tasks.ts`, `lib/reviews.ts`, `types/workflows.ts`, `types/tasks.ts`, `types/reviews.ts`, placeholders, `/workflows`, `/tasks`, `/reviews`, `/workbench`. |

## Governance

| Filename | Purpose | Owner | Status | Dependencies | Implementation Impact |
| --- | --- | --- | --- | --- | --- |
| `governance/SADR_REGISTER.md` | Master register of every Scholatia Architectural Decision Record. | Governance | Active | `ARCHITECTURE_DECISIONS.md` | No code impact; governs decision tracking and supersession. |
| `governance/ARCHITECTURE_REPOSITORY_REGISTER.md` | Master index of every architecture document (this document). | Governance | Active | All indexed documents | No code impact; governs document discoverability. |
| `governance/REQUIREMENTS_TRACEABILITY_REGISTER.md` | Maps Architecture Decision → Specification → Implementation Phase → Source Code → Verification → Git Tag. | Governance | Active | `SADR_REGISTER.md`, `IMPLEMENTATION_REGISTER.md` | No code impact; governs requirement traceability. |
| `governance/IMPLEMENTATION_REGISTER.md` | Tracks every implementation phase: status, commit, git tag, verification, recovery. | Governance | Active | `PHASE_ROADMAP.md` | No code impact; governs phase tracking and recovery audits. |
| `governance/AI_KNOWLEDGE_REGISTER.md` | Registers every approved AI capability and its status. | Governance | Active | `INTELLIGENCE_ARCHITECTURE.md`, SWTROP / collaboration docs | No code impact; governs AI capability approval and tracking. |

## Engineering

| Filename | Purpose | Owner | Status | Dependencies | Implementation Impact |
| --- | --- | --- | --- | --- | --- |
| `architecture.md` | Early platform architecture overview — positioning, SAID, role system, module sketch. | Engineering | Active | None | Historical overview; largely superseded by `SCHOLATIA_CORE_PLATFORM_MANIFEST.md`. |
| `ROUTE_MATRIX.md` | Tracks every route's status (Implemented / Placeholder / Missing), verified against the App Router. | Engineering | Active | `PLATFORM_STABILIZATION.md` | Authoritative route-status ledger. |
| `NAVIGATION_AUDIT.md` | Audit of every navigation surface from the Phase 0.95 stabilization effort. | Engineering | Historical | `PLATFORM_STABILIZATION.md` | Records the 0.95 navigation completion effort. |
| `PLATFORM_STABILIZATION.md` | Phase 0.95 completion report — navigation repairs, 404 elimination, route inventory, readiness assessment. | Engineering | Historical | `NAVIGATION_AUDIT.md`, `ROUTE_MATRIX.md` | Records the stabilization phase; no longer modified. |

## Future Documents

Planned architecture documents reserved by this register. Each must be created
and moved into its category table above once written.

| Filename (planned) | Purpose | Owner | Status | Dependencies | Implementation Impact |
| --- | --- | --- | --- | --- | --- |
| `PRIVACY_ARCHITECTURE.md` | Privacy architecture for the platform. | Privacy | Planned | `SCHOLATIA_CORE_PLATFORM_MANIFEST.md`, `USER_MODEL.md` | Required before data-processing persistence. |
| `SECURITY_ARCHITECTURE.md` | Consolidated platform security architecture (currently distributed across authentication, RBAC, and user-model docs). | Security | Planned | `AUTHENTICATION_ARCHITECTURE.md`, `RBAC.md`, `USER_MODEL.md` | Consolidation only; no new implementation without approval. |
| `AI_ARCHITECTURE.md` | Consolidated AI layer architecture. | AI | Planned | `AI_KNOWLEDGE_REGISTER.md` | Awaits Phase 5. |
| `CRIE_ARCHITECTURE.md` | Definition and architecture of CRIE. | CRIE | Planned | `WORKFLOW_ARCHITECTURE.md` | Prerequisite for any CRIE implementation. |
| `DIGITAL_TWIN_ARCHITECTURE.md` | Research digital twin architecture. | Digital Twin | Planned | `INTELLIGENCE_ARCHITECTURE.md`, `RESEARCHER_IDENTITY_ARCHITECTURE.md` | Awaits Phase 5. |
| `RESEARCH_WRITING_INTELLIGENCE_ARCHITECTURE.md` | Writing intelligence capability architecture. | AI / Research | Planned | SWTROP workbench + artefacts | Awaits AI capability approval. |
| `LITERATURE_INTELLIGENCE_ARCHITECTURE.md` | Literature intelligence capability architecture. | AI / Research | Planned | `INTELLIGENCE_ARCHITECTURE.md` | Awaits live connectors. |
| `SUPERVISOR_INTELLIGENCE_ARCHITECTURE.md` | Supervisor intelligence capability architecture. | AI / SWTROP | Planned | `WORKFLOW_ARCHITECTURE.md` | Awaits AI capability approval. |
| `REVIEWER_INTELLIGENCE_ARCHITECTURE.md` | Reviewer intelligence capability architecture. | AI / Trust | Planned | `WORKFLOW_ARCHITECTURE.md`, `TRUST_ARCHITECTURE.md` | Awaits AI capability approval. |
| `EDITORIAL_INTELLIGENCE_ARCHITECTURE.md` | Editorial intelligence capability architecture. | AI / Journals | Planned | `JOURNAL_ARCHITECTURE.md`, `WORKFLOW_ARCHITECTURE.md` | Awaits AI capability approval. |
| `CONFERENCE_INTELLIGENCE_ARCHITECTURE.md` | Conference intelligence capability architecture. | AI / Conferences | Planned | `CONFERENCE_ARCHITECTURE.md` | Awaits AI capability approval. |
| `JOURNAL_INTELLIGENCE_ARCHITECTURE.md` | Journal intelligence capability architecture. | AI / Journals | Planned | `JOURNAL_ARCHITECTURE.md` | Awaits AI capability approval. |
| `MARKETPLACE_INTELLIGENCE_ARCHITECTURE.md` | Marketplace intelligence capability architecture. | AI / Marketplace | Planned | `MARKETPLACE_ARCHITECTURE.md` | Awaits AI capability approval. |
| `IDENTITY_INTELLIGENCE_ARCHITECTURE.md` | Identity intelligence capability architecture. | AI / Identity | Planned | `RESEARCHER_IDENTITY_ARCHITECTURE.md` | Awaits AI capability approval. |
| `TRUST_INTELLIGENCE_ARCHITECTURE.md` | Trust intelligence capability architecture. | AI / Trust | Planned | `TRUST_ARCHITECTURE.md` | Awaits AI capability approval. |
| `DIGITAL_TWIN_INTELLIGENCE_ARCHITECTURE.md` | Digital twin intelligence capability architecture. | AI / Digital Twin | Planned | `INTELLIGENCE_ARCHITECTURE.md` | Awaits Phase 5. |
| `RECOMMENDATION_INTELLIGENCE_ARCHITECTURE.md` | Recommendation intelligence capability architecture. | AI / Intelligence | Planned | `INTELLIGENCE_ARCHITECTURE.md` | Awaits personalised ranking models. |
| `RESEARCH_INTEGRITY_INTELLIGENCE_ARCHITECTURE.md` | Research integrity intelligence capability architecture. | AI / Trust | Planned | `TRUST_ARCHITECTURE.md` | Awaits AI capability approval. |
| `STATISTICS_INTELLIGENCE_ARCHITECTURE.md` | Statistics intelligence capability architecture. | AI / Statistics | Planned | `INTELLIGENCE_ARCHITECTURE.md`, `SERVICES_ARCHITECTURE.md` | Awaits AI capability approval. |

---

# Cross References

- Decisions: `docs/governance/SADR_REGISTER.md`
- Phases: `docs/governance/IMPLEMENTATION_REGISTER.md`
- Traceability: `docs/governance/REQUIREMENTS_TRACEABILITY_REGISTER.md`
- AI capabilities: `docs/governance/AI_KNOWLEDGE_REGISTER.md`

---

# Maintenance

- **Update trigger:** whenever a document is created, superseded, deprecated,
  or changes owner/status.
- **Owner:** Governance.
- **Next review:** on the next governance phase (Phase G0+).

---

*Version 1.0 — Master index of every Scholatia architecture document.*
