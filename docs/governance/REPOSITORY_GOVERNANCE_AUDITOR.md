# SCHOLATIA REPOSITORY GOVERNANCE AUDITOR

**Version 1.0**

**Status:** Active

**Date:** 2026-08-02

**Owner:** Governance

> The Repository Governance Auditor is the enforcement authority of the
> Scholatia governance system. It ensures that architecture, implementation,
> governance registers, and Git history remain synchronized, and that no
> approved architectural decision is ever omitted during implementation.
>
> This is **governance automation**, not feature implementation. It changes no
> application code and no database schema.

---

# Purpose

The Auditor verifies that the five governance registers stay truthful against
the sources of truth they index:

- `docs/ARCHITECTURE_DECISIONS.md` (decisions)
- The repository (files, modules, routes, types, schema)
- Git history (commits, tags)
- The verification suite (tsc / lint / build)

Wherever a register contradicts reality, the Auditor flags the mismatch, and the
register is corrected — never the source of truth.

---

# Auditor Responsibilities

## 1. Architecture Audit

Verify that:

- every approved SADR in `docs/ARCHITECTURE_DECISIONS.md` exists in the SADR
  Register;
- no architecture document is orphaned (every document in `docs/` is indexed in
  the Architecture Repository Register, and every indexed document exists);
- no superseded architecture remains Active (superseded rows carry
  `Superseded` / `Deprecated` status and reference their replacement).

## 2. Implementation Audit

Verify that:

- implementation phases match the roadmap (`docs/PHASE_ROADMAP.md`);
- completed phases are recorded in the Implementation Register;
- phase status is accurate against the repository and Git;
- git tags are recorded for every completed phase.

## 3. Traceability Audit

Verify the full chain is traceable for every requirement:

```
Architecture Decision
        ↓
   Specification
        ↓
Implementation Phase
        ↓
    Source Code
        ↓
   Verification
        ↓
     Git Tag
```

Flag any missing link.

## 4. AI Capability Audit

Verify that every approved AI capability exists in the AI Knowledge Register
(`docs/governance/AI_KNOWLEDGE_REGISTER.md`), including:

- CRIE
- Research Writing Intelligence
- Literature Intelligence
- Supervisor Intelligence
- Reviewer Intelligence
- Editorial Intelligence
- Conference Intelligence
- Journal Intelligence
- Marketplace Intelligence
- Identity Intelligence
- Trust Intelligence
- Digital Twin Intelligence
- Recommendation Intelligence
- Research Integrity Intelligence
- Statistics Intelligence
- Future AI Modules

Each entry must carry Purpose, Capabilities, Dependencies, Implementation
Phase, Related SADRs, and Status.

## 5. Repository Audit

Verify that:

- no duplicate modules exist;
- no duplicate types exist;
- no duplicate schema exists;
- no duplicate utilities exist;
- no orphaned code exists (unreferenced files, unused exports).

## 6. Verification Audit

Verify the latest phase results:

- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

are recorded in the Implementation Register and the Requirements Traceability
Register.

## 7. Release Audit

Before any release, verify that:

- architecture is updated (SADR Register);
- registers are updated (all governance registers);
- the Implementation Register is updated;
- git tags are recorded;
- verification is completed.

---

# Governance Workflow Diagram

```
                ┌─────────────────────────────┐
                │   AUDIT FIRST               │
                │   (never assume)            │
                └──────────────┬──────────────┘
                               ↓
                 ┌───────────────────────────┐
                 │  UPDATE REGISTERS (pre)   │   ← I-1, S-*, R-4
                 └──────────────┬────────────┘
                                ↓
                 ┌───────────────────────────┐
                 │  IMPLEMENT CODE           │
                 └──────────────┬────────────┘
                                ↓
                 ┌───────────────────────────┐
                 │  VERIFY                   │   ← tsc · lint · build
                 └──────────────┬────────────┘
                                ↓
                 ┌───────────────────────────┐
                 │  COMMIT                   │
                 └──────────────┬────────────┘
                                ↓
                 ┌───────────────────────────┐
                 │  UPDATE REGISTERS (post)  │   ← reconcile with reality
                 └──────────────┬────────────┘
                                ↓
                 ┌───────────────────────────┐
                 │  CREATE TAG               │   ← phase-X.X
                 └──────────────┬────────────┘
                                ↓
                 ┌───────────────────────────┐
                 │  RECORD TAG               │   ← Implementation + SADR Register
                 └──────────────┬────────────┘
                                ↓
                 ┌───────────────────────────┐
                 │  AUDITOR VERIFICATION     │   ← audit checklist below
                 └───────────────────────────┘
```

---

# Mandatory Rule

> **No approved architectural decision may be omitted during implementation
> unless explicitly superseded by a newer approved architectural decision.**

The Auditor enforces this rule at every phase boundary and every release.

---

# Audit Checklist Templates

## Architecture Audit Checklist

- [ ] Every SADR in `docs/ARCHITECTURE_DECISIONS.md` is in the SADR Register.
- [ ] Every architecture document is indexed in the Architecture Repository Register.
- [ ] Every indexed document exists on disk.
- [ ] No superseded SADR is marked Active.
- [ ] Superseded SADRs reference their replacement.
- [ ] No new architecture change is unrecorded (R-6).

## Implementation Audit Checklist

- [ ] Phases match the roadmap.
- [ ] Completed phases are recorded in the Implementation Register.
- [ ] Phase status is accurate.
- [ ] Commit hashes are recorded for completed phases.
- [ ] Git tags are recorded for completed phases.
- [ ] No duplicate phase tags exist.

## Traceability Audit Checklist

- [ ] Each requirement has a trace row.
- [ ] Architecture Decision link present.
- [ ] Specification link present.
- [ ] Implementation Phase link present.
- [ ] Source Code links present.
- [ ] Verification result present.
- [ ] Git Tag link present.
- [ ] No missing links un-flagged.

## AI Capability Audit Checklist

- [ ] Every approved AI capability exists in the AI Knowledge Register.
- [ ] Each entry has Purpose, Capabilities, Dependencies, Implementation Phase, Related SADRs, Status.
- [ ] No implemented AI module is missing from the register (AI-2).
- [ ] No approved capability is omitted unless superseded.

## Repository Audit Checklist

- [ ] No duplicate modules.
- [ ] No duplicate types.
- [ ] No duplicate schema.
- [ ] No duplicate utilities.
- [ ] No orphaned code.

## Verification Audit Checklist

- [ ] `npx tsc --noEmit` passes.
- [ ] `npm run lint` passes (Avatar `<img>` warning only).
- [ ] `npm run build` passes.
- [ ] Results recorded in the Implementation Register.
- [ ] Results recorded in the Requirements Traceability Register.

## Release Audit Checklist

- [ ] Architecture updated.
- [ ] Registers updated.
- [ ] Implementation Register updated.
- [ ] Git tags recorded.
- [ ] Verification completed.
- [ ] No approved decision omitted.

---

# Auditor Enforcement

| Event | Audit run |
| --- | --- |
| Phase start | Pre-implementation checklist (architecture, implementation, traceability). |
| Phase completion | Full checklist before commit + tag. |
| Tag creation | Verify tag exists, references the correct commit, and is recorded. |
| Release | Release checklist. |
| Governance review | Full audit across all registers. |

---

# Cross References

- Rules: `docs/governance/REPOSITORY_GOVERNANCE_RULES.md`
- Maintenance protocol: `docs/governance/GOVERNANCE_MAINTENANCE_PROTOCOL.md`
- Compliance engine: `docs/governance/IMPLEMENTATION_COMPLIANCE_ENGINE.md`
- SADR Register: `docs/governance/SADR_REGISTER.md`
- Architecture Repository Register: `docs/governance/ARCHITECTURE_REPOSITORY_REGISTER.md`
- Requirements Traceability Register: `docs/governance/REQUIREMENTS_TRACEABILITY_REGISTER.md`
- Implementation Register: `docs/governance/IMPLEMENTATION_REGISTER.md`
- AI Knowledge Register: `docs/governance/AI_KNOWLEDGE_REGISTER.md`
- Protocol: `docs/AI_DEVELOPMENT_PROTOCOL.md`
- Decisions: `docs/ARCHITECTURE_DECISIONS.md`

---

# Maintenance

- **Update trigger:** any change to the audit scope, checklists, or enforcement
  events.
- **Owner:** Governance.
- **Next review:** on the next governance phase (Phase G0+).

---

*Version 1.0 — The permanent Repository Governance Auditor of Scholatia.*
