# SCHOLATIA ARCHITECTURAL DECISION RECORD REGISTER

**Version 1.0**

**Status:** Active

**Date:** 2026-08-02

**Owner:** Governance

> This is the **master register** of every Scholatia Architectural Decision
> Record (SADR). It is a **living governance document**: it indexes, cross
> references, and tracks the implementation and verification state of every
> architectural decision recorded in `docs/ARCHITECTURE_DECISIONS.md`.
>
> The canonical source of each decision body is `docs/ARCHITECTURE_DECISIONS.md`
> (append-only). This register is the structured index over that source.

---

# Purpose

Every significant architectural decision Scholatia has made is indexed here so
that future modules, developers, and AI contributors can:

- discover which decisions exist and their current status;
- see which modules, phases, and git tags a decision touches;
- know whether a decision is implemented and verified;
- trace supersession when a later decision replaces an earlier one.

The register is **read-only for history**: existing rows are never rewritten.
If a decision changes, a new SADR supersedes the previous one and the
`Superseded By` column is updated to reference it (consistent with the
append-only rule in `docs/ARCHITECTURE_DECISIONS.md`).

---

# Status Legend

| Value | Meaning |
| --- | --- |
| Accepted | The decision is approved and binding. |
| Proposed | The decision is under consideration. |
| Superseded | The decision has been replaced by a later decision. |
| Deprecated | The decision is no longer recommended. |
| Rejected | The decision was considered and declined. |

# Implementation Status Legend

| Value | Meaning |
| --- | --- |
| Implemented | The decision is realised in the codebase. |
| Partially Implemented | Some, but not all, of the decision is realised. |
| Planned | The decision is approved but not yet realised. |
| Unknown | The realisation state has not been confirmed. |

# Verification Status Legend

| Value | Meaning |
| --- | --- |
| Verified | The phase realising the decision passed the verification suite (`npx tsc --noEmit`, `npm run lint`, `npm run build`) per `docs/AI_DEVELOPMENT_PROTOCOL.md` §12. |
| Not Verified | Verification has not been run or recorded. |
| N/A | No implementation exists to verify. |

---

# Master Register

Columns:

- **SADR** — the Scholatia Architectural Decision Record number.
- **Title** — the decision title.
- **Status** — decision status (see legend).
- **Date Approved** — approval date; **Not recorded** where the source document does not record one.
- **Version** — per-record version; the decisions document is Version 1.0, individual records are not separately versioned.
- **Priority** — assigned priority; **Not recorded** until a governance review assigns one.
- **Related Modules** — modules governed by the decision.
- **Related Phases** — implementation phases realising the decision.
- **Dependencies** — SADRs this decision builds on.
- **Superseded By** — the SADR that replaces this one, or **—** if none.
- **Git Tags** — tags marking the implementing phase(s).
- **Implementation Status** — see legend.
- **Verification Status** — see legend.
- **Notes** — source location and remarks.

| SADR | Title | Status | Date Approved | Version | Priority | Related Modules | Related Phases | Dependencies | Superseded By | Git Tags | Implementation Status | Verification Status | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SADR-001 | Single Platform Architecture | Accepted | Not recorded | 1.0 (document) | Not recorded | All modules | Phase 0 – 2.2 | — | — | v0.3-collaboration, phase-G0 | Implemented | Verified | Recorded as ADR-001 in `docs/ARCHITECTURE_DECISIONS.md`. Constitutional: one integrated scholarly operating system. |
| SADR-002 | Canonical Type System | Accepted | Not recorded | 1.0 (document) | Not recorded | All modules (`types/`) | Phase 0 | SADR-001 | — | v0.3-routing … v0.7-lifecycle-engine | Implemented | Verified | Recorded as ADR-002. One canonical definition per entity; never redefined. |
| SADR-003 | Canonical Placeholder Data | Accepted | Not recorded | 1.0 (document) | Not recorded | All modules (`constants/placeholder-*.ts`) | Phase 0 | SADR-001, SADR-002 | — | v0.3-routing … v0.7-lifecycle-engine | Implemented | Verified | Recorded as ADR-003. Placeholder datasets own identities; derived modules reference them. |
| SADR-004 | Single Lifecycle Engine | Accepted | Not recorded | 1.0 (document) | Not recorded | Research, Discovery, Intelligence, Trust, Collaboration, Messaging, Notifications, SWTROP | Phase 0 | SADR-001 | — | v0.7-lifecycle-engine | Implemented | Verified | Recorded as ADR-004. One engine (`lib/lifecycle.ts`); modules never redefine stages. |
| SADR-005 | Discovery Owns No Data | Accepted | Not recorded | 1.0 (document) | Not recorded | Discovery, Intelligence, all indexed modules | Phase 1 | SADR-002, SADR-003, SADR-004 | — | Phase 1 (no dedicated tag) | Implemented | Verified | Recorded as ADR-005. Discovery indexes records, never owns them. |
| SADR-006 | Intelligence Is Fully Derived | Accepted | Not recorded | 1.0 (document) | Not recorded | Intelligence, Trust, Discovery, Advertising | Phase 1.8 | SADR-005, SADR-003 | — | phase-1.8 | Implemented | Verified | Recorded as ADR-006. Recommendations, trends, forecasts, analytics, and knowledge graphs are derived from canonical modules. |
| SADR-007 | Trust Is Cross-Platform | Accepted | Not recorded | 1.0 (document) | Not recorded | Trust, Commerce, Marketplace, Services, Publishing, Institutions, Research | Phase 1.9C | SADR-001 | — | phase-1.9C | Implemented | Verified | Recorded as ADR-007. Trust signals are reusable across every transactional surface. |
| SADR-008 | Unified Commerce Engine | Accepted | Not recorded | 1.0 (document) | Not recorded | Commerce, Advertising, Marketplace, Services, Publishing, Institutions | Phase 2.0 | SADR-007 | — | phase-2.0 | Implemented | Verified | Recorded as ADR-008. All revenue streams flow through one commerce engine. |
| SADR-009 | Append-Only Database | Accepted | Not recorded | 1.0 (document) | Not recorded | All modules (`db/schema.sql`) | Phase 0 onward | SADR-001 | — | All phase tags | Implemented | Verified | Recorded as ADR-009. Schema changes are additive; tables are never dropped or silently renamed. |
| SADR-010 | Component Standardisation | Accepted | Not recorded | 1.0 (document) | Not recorded | All modules (`components/<module>/`) | Phase 0 – 2.2 | SADR-001 | — | v0.3-routing … phase-2.2F | Implemented | Verified | Recorded as ADR-010. Every module follows the same component architecture. |
| SADR-011 | Utility Layer | Accepted | Not recorded | 1.0 (document) | Not recorded | All modules (`lib/`) | Phase 0 | SADR-010 | — | v0.3-routing … v0.7-lifecycle-engine | Implemented | Verified | Recorded as ADR-011. Pages compose, components render, utilities compute. |
| SADR-012 | Hook Layer | Accepted | Not recorded | 1.0 (document) | Not recorded | All modules (`hooks/`) | Phase 0 | SADR-011 | — | v0.3-routing … v0.7-lifecycle-engine | Implemented | Verified | Recorded as ADR-012. Every domain owns one canonical hook; hooks are extended, never duplicated. |
| SADR-013 | Verification Suite | Accepted | Not recorded | 1.0 (document) | Not recorded | Engineering / all phases | Phase 0 onward | SADR-016 | — | All phase tags | Implemented | Verified | Recorded as ADR-013. Every completed phase passes `npx tsc --noEmit`, `npm run lint`, `npm run build`. |
| SADR-014 | Documentation Is Part of Done | Accepted | Not recorded | 1.0 (document) | Not recorded | All modules (`docs/`) | Phase 0 onward | SADR-001 | — | All phase tags | Implemented | Verified | Recorded as ADR-014. Every completed phase ships architecture doc, schema updates, barrel exports, hook/utility registration, and a completion report. |
| SADR-015 | AI Governance | Accepted | Not recorded | 1.0 (document) | Not recorded | AI contributors, Governance | Phase G0 | SADR-001, SADR-014 | — | phase-G0 | Implemented | Verified | Recorded as ADR-015. Every AI contributor follows the Manifest, AI Development Protocol, Roadmap, and Decisions before modifying the repository. |
| SADR-016 | Phase Boundary Rule | Accepted | Not recorded | 1.0 (document) | Not recorded | AI contributors, all phases | Phase G0 onward | SADR-015 | — | phase-G0 | Implemented | Verified | Recorded as ADR-016. Stop exactly at the approved phase: no feature creep, no unapproved optimisation, no unsolicited refactoring. |
| SADR-017 | Git Release Strategy | Accepted | Not recorded | 1.0 (document) | Not recorded | Engineering / release | Phase 0 onward | SADR-013, SADR-016 | — | phase-2.0 … phase-2.2F | Implemented | Verified | Recorded as ADR-017. Every completed phase commits, pushes, and tags `phase-X.X`. |
| SADR-018 | Platform Identity | Accepted | Not recorded | 1.0 (document) | Not recorded | All modules | Phase 1.4, Phase G0 | SADR-001 | — | v1.4-researcher-platform, phase-G0 | Implemented | Verified | Recorded as ADR-018. Scholatia is one scholarly identity, research, marketplace, publishing, intelligence, trust, and enterprise ecosystem; every decision must reinforce this identity. |

---

# Supersession Chain

No SADR is currently superseded. `docs/ARCHITECTURE_DECISIONS.md` is
append-only: when a decision changes, a **new** SADR is appended and the
`Superseded By` column of the replaced record is updated to reference it. The
`Supersession Chain` section is where those relationships will be recorded.

| Replaced SADR | Title | Replaced By | Date | Rationale |
| --- | --- | --- | --- | --- |
| — | — | — | — | No supersessions recorded to date. |

---

# Future SADRs

New decisions must be recorded **first** in `docs/ARCHITECTURE_DECISIONS.md`
(append-only, using the ADR-XXX template there), then indexed here using the
following row template.

```
| SADR-XXX | Title | Proposed | YYYY-MM-DD | 1.0 | Not recorded | <modules> | <phases> | <SADR deps> | — | <tag> | Planned | Not Verified | Recorded as ADR-XXX in docs/ARCHITECTURE_DECISIONS.md. |
```

---

# Cross References

- Decisions source document: `docs/ARCHITECTURE_DECISIONS.md`
- Constitutional document: `docs/SCHOLATIA_CORE_PLATFORM_MANIFEST.md`
- Development protocol: `docs/AI_DEVELOPMENT_PROTOCOL.md`
- Roadmap: `docs/PHASE_ROADMAP.md`
- Phase tracking: `docs/governance/IMPLEMENTATION_REGISTER.md`
- Requirement traceability: `docs/governance/REQUIREMENTS_TRACEABILITY_REGISTER.md`
- Document index: `docs/governance/ARCHITECTURE_REPOSITORY_REGISTER.md`
- AI capability tracking: `docs/governance/AI_KNOWLEDGE_REGISTER.md`

---

# Maintenance

- **Update trigger:** whenever a new SADR is appended, a decision is superseded,
  or a phase realising a decision changes status.
- **Owner:** Governance.
- **Approval for changes to historical rows:** none — history is append-only;
  only the `Superseded By` link and current-status columns may be updated.
- **Next review:** on the next governance phase (Phase G0+).

---

*Version 1.0 — Master register of Scholatia Architectural Decision Records.*
