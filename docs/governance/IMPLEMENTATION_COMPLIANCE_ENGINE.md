# SCHOLATIA IMPLEMENTATION COMPLIANCE ENGINE

**Version 1.0**

**Status:** Active

**Date:** 2026-08-02

**Owner:** Governance

> The Implementation Compliance Engine governs **every future implementation
> phase** of Scholatia. It guarantees architecture compliance, recovery-first
> implementation, repository integrity, verification integrity, and governance
> synchronization.
>
> This is **governance automation**, not feature implementation. It changes no
> application code and no database schema.

---

# Purpose

The Compliance Engine is the executable contract that every implementation
phase — human or AI — must pass. It replaces ad-hoc development with a
repeatable, auditable pipeline: pre-implementation checklist, recovery mode,
implementation rules, quality gates, cross-module verification, architecture
compliance, git compliance, and a mandatory completion report.

---

# SECTION 1 — Pre-Implementation Checklist

Before writing any code, verify every item:

- [ ] Repository is clean (`git status`).
- [ ] Governance registers are updated (pre-implementation sync).
- [ ] Previous phase is verified (verification recorded in the Implementation Register).
- [ ] Correct implementation phase is identified (matches `docs/PHASE_ROADMAP.md`).
- [ ] Correct Git tag is identified (`phase-X.X`; must not already exist).
- [ ] Required SADRs are identified (applicable decisions from the SADR Register).

If any item fails, the phase must **not** start until the item is resolved.

---

# SECTION 2 — Recovery Mode

Before implementing, audit the repository to classify the phase state:

| State | Meaning | Action |
| --- | --- | --- |
| **NOT STARTED** | No work found for the phase. | Implement the full phase. |
| **PARTIALLY COMPLETED** | Some work found; files, exports, or documentation missing. | Recover only the missing work. Never regenerate completed work. |
| **FULLY COMPLETED** | All work found, verified, and tagged. | Do nothing. Move to the next phase. |

Recovery rules:

- **Never regenerate completed work.**
- **Never overwrite working modules.**
- **Recover only missing work.**
- Record recovery scope and outcome in the Implementation Register
  (triggers I-2, I-3).

---

# SECTION 3 — Implementation Rules

Every implementation shall follow, in order:

```
Repository Audit
        ↓
Recovery Audit
        ↓
Implementation
        ↓
TypeScript Verification
        ↓
Lint Verification
        ↓
Build Verification
        ↓
Cross-module Verification
        ↓
Governance Update
        ↓
Commit
        ↓
Git Tag
        ↓
Register Update
```

No step may be skipped. The order is mandatory.

---

# SECTION 4 — Quality Gates

No implementation is complete unless:

| Gate | Result |
| --- | --- |
| `npx tsc --noEmit` | **PASS** |
| `npm run lint` | **PASS** — allowed warning: `Avatar.tsx` `<img>` only |
| `npm run build` | **PASS** |
| Cross-module verification | **PASS** |
| Governance update | **PASS** |

If any gate fails, the phase is not complete. Fix the failure and re-run the
affected gates.

---

# SECTION 5 — Cross-module Verification

Every new implementation shall verify integration with:

- Identity
- Research
- Discovery
- Publishing
- Journals
- Conferences
- Marketplace
- Messaging
- Notifications
- Collaboration
- Activity
- Trust
- Verification
- Commerce
- Services
- SWTROP
- CRIE
- Digital Twins
- Research Writing Studio
- Repository

Rules:

- **No duplicate entities allowed.** Reuse canonical IDs, types, constants,
  placeholders, lifecycle, hooks, and utilities.
- Cross-module references use `sourceId` + `sourceEntity` or the owning
  module's canonical ID.
- Never duplicate logic owned by another module.
- Planned modules (CRIE, Digital Twins, Research Writing Studio) are verified
  for integration readiness — not for implementation that has not been
  approved.

---

# SECTION 6 — Architecture Compliance

Every implementation shall reference:

| Reference | Source |
| --- | --- |
| Applicable SADRs | `docs/governance/SADR_REGISTER.md` |
| Applicable Roadmap Phase | `docs/PHASE_ROADMAP.md` |
| Applicable Governance Register | `docs/governance/` suite |
| Applicable AI Modules | `docs/governance/AI_KNOWLEDGE_REGISTER.md` |

Rules:

- Architecture changes require a new SADR or a supersession (R-6).
- No approved architectural decision may be omitted during implementation
  unless explicitly superseded by a newer approved decision.

---

# SECTION 7 — Git Compliance

Every completed phase shall:

```bash
git add .
git commit -m "Phase X.X - Module"
git push origin main
git tag phase-X.X
git push origin phase-X.X
```

Rules:

- **Never create duplicate phase tags.**
- If the tag exists, verify it references the correct commit.
- Record the commit and tag in the Implementation Register (I-5, I-6) and the
  SADR Register (S-4).

---

# SECTION 8 — Completion Report Template

Every phase must finish with a completion report containing:

| Section | Content |
| --- | --- |
| Repository Audit | Audit summary of existing assets reused. |
| Files Created | New files with paths. |
| Files Modified | Modified files with paths. |
| Files Repaired | Files fixed during recovery (if any). |
| Verification Results | `npx tsc --noEmit`, `npm run lint`, `npm run build` outcomes. |
| Cross-module Verification | Integration checks performed and results. |
| Governance Update | Register updates performed (pre + post). |
| Architecture Compliance | SADRs, roadmap phase, AI modules referenced. |
| Git Status | Commit hash and git tag. |
| Next Phase | The following phase identified. |

---

# Mandatory Rule

> **No approved architectural decision may be omitted during implementation
> unless explicitly superseded by a newer approved architectural decision.**

This rule is enforced at every phase boundary by the Repository Governance
Auditor (see `docs/governance/REPOSITORY_GOVERNANCE_AUDITOR.md`).

---

# Cross References

- Rules: `docs/governance/REPOSITORY_GOVERNANCE_RULES.md`
- Maintenance protocol: `docs/governance/GOVERNANCE_MAINTENANCE_PROTOCOL.md`
- Auditor: `docs/governance/REPOSITORY_GOVERNANCE_AUDITOR.md`
- SADR Register: `docs/governance/SADR_REGISTER.md`
- Architecture Repository Register: `docs/governance/ARCHITECTURE_REPOSITORY_REGISTER.md`
- Requirements Traceability Register: `docs/governance/REQUIREMENTS_TRACEABILITY_REGISTER.md`
- Implementation Register: `docs/governance/IMPLEMENTATION_REGISTER.md`
- AI Knowledge Register: `docs/governance/AI_KNOWLEDGE_REGISTER.md`
- Protocol: `docs/AI_DEVELOPMENT_PROTOCOL.md`
- Roadmap: `docs/PHASE_ROADMAP.md`
- Manifest: `docs/SCHOLATIA_CORE_PLATFORM_MANIFEST.md`

---

# Maintenance

- **Update trigger:** any change to the checklists, quality gates, or the
  completion report template.
- **Owner:** Governance.
- **Next review:** on the next governance phase (Phase G0+).

---

*Version 1.0 — The permanent Implementation Compliance Engine of Scholatia.*
