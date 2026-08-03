# SCHOLATIA GOVERNANCE MAINTENANCE PROTOCOL

**Version 1.0**

**Status:** Active

**Date:** 2026-08-02

**Owner:** Governance

> This protocol defines **how every governance register is updated**. It is the
> permanent, binding maintenance contract that keeps the governance register
> suite synchronized with the repository — Git, files, architecture,
> implementation, and verification — throughout the lifetime of Scholatia.
>
> This is **governance automation**, not feature implementation. It changes no
> application code and no database schema.

---

# Purpose

The governance registers are living documents. They remain valuable only while
they stay synchronized with the repository. This protocol fixes the update
rules for every register and makes those updates **mandatory events** that fire
automatically from specific triggers.

It complements:

- `docs/SCHOLATIA_CORE_PLATFORM_MANIFEST.md`
- `docs/AI_DEVELOPMENT_PROTOCOL.md`
- `docs/PHASE_ROADMAP.md`
- `docs/ARCHITECTURE_DECISIONS.md`
- `docs/governance/REPOSITORY_GOVERNANCE_RULES.md`
- `docs/governance/REPOSITORY_GOVERNANCE_AUDITOR.md`
- `docs/governance/IMPLEMENTATION_COMPLIANCE_ENGINE.md`

---

# SECTION 1 — The Governance Register Suite

| Register | File | Synchronizes |
| --- | --- | --- |
| SADR Register | `docs/governance/SADR_REGISTER.md` | Architectural decisions ↔ repository. |
| Architecture Repository Register | `docs/governance/ARCHITECTURE_REPOSITORY_REGISTER.md` | Architecture documents ↔ repository. |
| Requirements Traceability Register | `docs/governance/REQUIREMENTS_TRACEABILITY_REGISTER.md` | Decision → Specification → Phase → Source → Verification → Git Tag. |
| Implementation Register | `docs/governance/IMPLEMENTATION_REGISTER.md` | Implementation phases ↔ Git. |
| AI Knowledge Register | `docs/governance/AI_KNOWLEDGE_REGISTER.md` | Approved AI capabilities ↔ implementation. |

---

# SECTION 2 — Mandatory Update Rules

Each subsection defines the triggers that **automatically require** a register
update and the mandatory action that must follow. "Automatically" means: the
moment the trigger occurs, the update is **required** — it is never optional,
never deferred to a later phase, and never skipped.

---

## 2.1 — SADR Register

Updates fire automatically whenever:

| # | Trigger | Mandatory update action |
| --- | --- | --- |
| S-1 | New SADR approved | Append the new SADR row to the master table with every column populated; record it as approved in `docs/ARCHITECTURE_DECISIONS.md` first. |
| S-2 | SADR superseded | Mark the superseded SADR row `Status = Superseded`, set `Superseded By`, and add the supersession chain row. |
| S-3 | Implementation completed | Update `Implementation Status` for every related SADR row to `Implemented` / `Partially Implemented` as applicable. |
| S-4 | Git tag created | Record the new tag in the `Git Tags` column of every related SADR row. |
| S-5 | Architecture changed | Re-assess related SADR rows; if the change is a new decision, trigger S-1; if it supersedes, trigger S-2. |

The register is **read-only for history** — existing rows are never rewritten;
only status, supersession, and current-state columns move forward.

---

## 2.2 — Architecture Repository Register

Updates fire automatically whenever:

| # | Trigger | Mandatory update action |
| --- | --- | --- |
| A-1 | Architecture document created | Add a row in the correct category table with filename, purpose, owner, status, dependencies, implementation impact. |
| A-2 | Document renamed | Update the `filename` entry and every cross-reference to it across the governance suite. |
| A-3 | Document deprecated | Set `Status = Deprecated` and record the reason in Notes. |
| A-4 | Document superseded | Set `Status = Superseded` (or Historical where the new doc replaces it) and reference the replacement in Notes. |

---

## 2.3 — Requirements Traceability Register

Updates fire automatically whenever:

| # | Trigger | Mandatory update action |
| --- | --- | --- |
| R-1 | Implementation phase completed | Populate the traceability rows for the phase: Decision (SADR) → Specification → Phase → Source Code → Verification → Git Tag; set Status = Traced. |
| R-2 | Source files added | Record the source-code references (`types/`, `lib/`, `constants/`, `hooks/`, `components/`, `app/`, `db/schema.sql`) in the trace rows. |
| R-3 | Verification completed | Record the verification result (`npx tsc --noEmit`, `npm run lint`, `npm run build`) in the trace rows. |
| R-4 | Implementation prompt executed | Before implementation, pre-register the planned trace rows; after implementation, complete them. |

---

## 2.4 — Implementation Register

Updates fire automatically whenever:

| # | Trigger | Mandatory update action |
| --- | --- | --- |
| I-1 | New phase starts | Add the phase row with Status = In Progress. |
| I-2 | Recovery begins | Update the phase row Status = Blocked and record recovery scope in Recovery. |
| I-3 | Recovery ends | Record the recovery outcome and restore the phase status. |
| I-4 | Verification completes | Record the verification result in the phase row. |
| I-5 | Commit created | Record the commit hash in the phase row. |
| I-6 | Git tag created | Record the git tag in the phase row. |

---

## 2.5 — AI Knowledge Register

Updates fire automatically whenever:

| # | Trigger | Mandatory update action |
| --- | --- | --- |
| AI-1 | New AI capability approved | Add the capability section (Purpose, Capabilities, Dependencies, Implementation Phase, Related SADRs, Status) and the summary row. |
| AI-2 | AI module implemented | Update Status = Implemented / Partially Implemented for the capability. |
| AI-3 | AI architecture modified | Refresh Capabilities, Dependencies, and Related SADRs for the affected capability. |
| AI-4 | AI subsystem integrated | Record the integration surface in Dependencies and Related SADRs. |

---

# SECTION 3 — Mandatory Governance Rules

Every implementation phase **shall** follow the canonical 8-step loop. No step
may be skipped:

```
1. Audit repository
        ↓
2. Update registers        ← pre-implementation register sync
        ↓
3. Implement code
        ↓
4. Verify                 ← npx tsc --noEmit · npm run lint · npm run build
        ↓
5. Commit
        ↓
6. Update registers again ← post-implementation register sync (reconciliation)
        ↓
7. Create tag             ← git tag phase-X.X
        ↓
8. Record tag             ← record the tag in the registers
```

| Step | Rule |
| --- | --- |
| 1 | Audit the repository before touching it. Never assume a file, type, constant, hook, utility, component, route, or schema entry is missing. |
| 2 | Update registers **before** implementation: register the phase (I-1), identify applicable SADRs, and pre-register trace rows (R-4). |
| 3 | Implement exactly the approved phase. No feature creep, no unapproved optimisation, no unsolicited refactoring. |
| 4 | Run the full verification suite. Only the existing Avatar `<img>` warning is acceptable. |
| 5 | Commit the completed phase. |
| 6 | Update registers **again** to reconcile them with what actually shipped (commits, files, verification, tags). |
| 7 | Create the `phase-X.X` git tag. Never create duplicate tags. |
| 8 | Record the tag in the Implementation Register (I-6) and SADR Register (S-4). |

The two register update steps (2 and 6) are the **pre-implementation sync** and
the **post-implementation reconciliation**. Both are mandatory.

---

# SECTION 4 — Quality Gates

The registers shall **never contradict** the following sources of truth:

| Source of truth | Register constraint |
| --- | --- |
| Git | Tags, commits, and branches recorded in the registers must match Git exactly. |
| Repository | Files, modules, routes, types, and schema documented in the registers must exist in the repository. |
| Architecture | SADRs and architecture documents indexed must match the canonical sources. |
| Implementation | Phase statuses and completion states must reflect shipped code. |
| Verification | Verification results must reflect the last run of the verification suite. |

If a contradiction is discovered, the registers are **wrong** — never the
repository, Git, or the verification suite. Correct the register and record the
correction (see `docs/governance/REPOSITORY_GOVERNANCE_AUDITOR.md`).

---

# SECTION 5 — Update Ownership

| Role | Update responsibility |
| --- | --- |
| AI contributor | Executes the mandatory 8-step loop and performs its register updates. |
| Governance auditor | Verifies register synchronization (see `docs/governance/REPOSITORY_GOVERNANCE_AUDITOR.md`). |
| Governance maintainer | Amends this protocol when a new register trigger is discovered. |

---

# Cross References

- Rules: `docs/governance/REPOSITORY_GOVERNANCE_RULES.md`
- Auditor: `docs/governance/REPOSITORY_GOVERNANCE_AUDITOR.md`
- Compliance engine: `docs/governance/IMPLEMENTATION_COMPLIANCE_ENGINE.md`
- SADR Register: `docs/governance/SADR_REGISTER.md`
- Architecture Repository Register: `docs/governance/ARCHITECTURE_REPOSITORY_REGISTER.md`
- Requirements Traceability Register: `docs/governance/REQUIREMENTS_TRACEABILITY_REGISTER.md`
- Implementation Register: `docs/governance/IMPLEMENTATION_REGISTER.md`
- AI Knowledge Register: `docs/governance/AI_KNOWLEDGE_REGISTER.md`
- Protocol: `docs/AI_DEVELOPMENT_PROTOCOL.md`
- Roadmap: `docs/PHASE_ROADMAP.md`

---

# Maintenance

- **Update trigger:** any new register trigger discovered in practice; any
  change to the register suite structure.
- **Owner:** Governance.
- **Next review:** on the next governance phase (Phase G0+).

---

*Version 1.0 — The mandatory protocol for maintaining every Scholatia governance register.*
