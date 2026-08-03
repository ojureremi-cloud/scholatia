# SCHOLATIA REQUIREMENTS TRACEABILITY REGISTER

**Version 1.0**

**Status:** Active

**Date:** 2026-08-02

**Owner:** Governance

> This register maps each approved requirement along the full chain from
> architectural decision to shipped, verified code:
>
> ```
> Architecture Decision
>           ↓
>      Specification
>           ↓
>   Implementation Phase
>           ↓
>       Source Code
>           ↓
>      Verification
>           ↓
>       Git Tag
> ```
>
> **This document currently contains the structure only.** Rows are to be
> populated as requirements are traced during and after each implementation
> phase. No requirement row has been filled in yet.

---

# Purpose

Requirements traceability makes every Scholatia capability auditable:

- **why** a feature exists (the architectural decision);
- **what** it was specified to do;
- **when** it was implemented (phase and git tag);
- **where** it lives in source code;
- **how** it was verified.

This is the single place to prove that every decision in
`docs/governance/SADR_REGISTER.md` was carried through to code and verified.

---

# Trace Chain

| Step | Source | Description |
| --- | --- | --- |
| Architecture Decision | `docs/governance/SADR_REGISTER.md` → `docs/ARCHITECTURE_DECISIONS.md` | The binding decision (SADR) that creates the requirement. |
| Specification | `docs/` architecture documents | The written specification derived from the decision. |
| Implementation Phase | `docs/governance/IMPLEMENTATION_REGISTER.md` | The phase that realises the requirement. |
| Source Code | `types/`, `lib/`, `constants/`, `hooks/`, `components/`, `app/`, `db/schema.sql` | The code that implements it. |
| Verification | Phase verification suite | `npx tsc --noEmit`, `npm run lint`, `npm run build` (per `docs/AI_DEVELOPMENT_PROTOCOL.md` §12). |
| Git Tag | Git history | The `phase-X.X` tag that marks the verified implementation. |

# Traceability Matrix (structure)

> Structure only. Populate one row per traced requirement. Each row is unique
> by `TRACE-` ID. Leave fields empty (`—`) until confirmed; never guess.

| Trace ID | Requirement | Architecture Decision (SADR) | Specification | Implementation Phase | Source Code | Verification | Git Tag | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TRACE-001 | — | — | — | — | — | — | — | To be traced |
| TRACE-002 | — | — | — | — | — | — | — | To be traced |
| TRACE-003 | — | — | — | — | — | — | — | To be traced |
| TRACE-004 | — | — | — | — | — | — | — | To be traced |
| TRACE-005 | — | — | — | — | — | — | — | To be traced |

# Status Legend

| Value | Meaning |
| --- | --- |
| To be traced | Row reserved; chain not yet populated. |
| Traced | Full chain populated and confirmed. |
| Partial | Some links populated; others outstanding. |
| Blocked | A link in the chain cannot be completed (e.g., decision not implemented). |

---

# Cross References

- Decisions: `docs/governance/SADR_REGISTER.md`
- Phases: `docs/governance/IMPLEMENTATION_REGISTER.md`
- Documents: `docs/governance/ARCHITECTURE_REPOSITORY_REGISTER.md`
- AI capabilities: `docs/governance/AI_KNOWLEDGE_REGISTER.md`

---

# Maintenance

- **Update trigger:** after every completed implementation phase and every
  governance review.
- **Owner:** Governance.
- **Next review:** on the next governance phase (Phase G0+).

---

*Version 1.0 — Requirement traceability structure. Content rows are pending.*
