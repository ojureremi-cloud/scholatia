# SCHOLATIA REPOSITORY GOVERNANCE RULES

**Version 1.0**

**Status:** Active

**Date:** 2026-08-02

**Owner:** Governance

> These are the **permanent, binding repository governance rules** of
> Scholatia. They apply to every contributor — human and AI — for every change
> to the repository. No rule may be waived without a superseding architectural
> decision.
>
> This is **governance automation**, not feature implementation. It changes no
> application code and no database schema.

---

# Purpose

These rules guarantee that the repository, the governance registers, Git, and
the verification suite never drift apart. Each rule below is a **hard
constraint**: violating any one of them makes the change non-compliant and
subject to the auditor's enforcement.

---

# Mandatory Rules

| # | Rule | Meaning |
| --- | --- | --- |
| R-1 | **No implementation without audit** | Before writing any code, audit the repository: existing types, constants, placeholders, hooks, utilities, components, routes, schema, and documentation. Never assume something is missing. |
| R-2 | **No implementation without verification** | No code is accepted without passing the full verification suite: `npx tsc --noEmit`, `npm run lint`, `npm run build`. Only the existing Avatar `<img>` warning is acceptable. |
| R-3 | **No skipped governance updates** | Every phase executes the mandatory 8-step governance loop (see `docs/governance/GOVERNANCE_MAINTENANCE_PROTOCOL.md` §3). No step — including both register updates — may be skipped. |
| R-4 | **No skipped register updates** | Every register trigger fires its mandatory update action (see `docs/governance/GOVERNANCE_MAINTENANCE_PROTOCOL.md` §2). No register update may be omitted. |
| R-5 | **No skipped Git recording** | Every completed phase is committed, pushed, and tagged (`phase-X.X`). Tags are never duplicated; each phase records its commit and tag in the registers. |
| R-6 | **No undocumented architecture changes** | Any architecture change is recorded as a new SADR (or a supersession) in `docs/ARCHITECTURE_DECISIONS.md` and indexed in the SADR Register before implementation. |

---

# Rule Details

## R-1 — No implementation without audit

- Confirm what exists before writing anything.
- Reuse before create: `types/` → `constants/` → `lib/` → `hooks/` →
  `components/` → `db/schema.sql` (priority order).
- Record the audit summary in the completion report.

## R-2 — No implementation without verification

- Verification order: `npx tsc --noEmit` → `npm run lint` → `npm run build`.
- Expected lint baseline: the `Avatar.tsx` `<img>` warning only.
- Verification results are recorded in the Implementation Register and the
  Requirements Traceability Register.

## R-3 — No skipped governance updates

Canonical phase loop:

```
1. Audit repository
2. Update registers          (pre-implementation sync)
3. Implement code
4. Verify
5. Commit
6. Update registers again    (post-implementation reconciliation)
7. Create tag
8. Record tag
```

## R-4 — No skipped register updates

Register triggers are listed in `docs/governance/GOVERNANCE_MAINTENANCE_PROTOCOL.md` §2:

- SADR Register: S-1 … S-5
- Architecture Repository Register: A-1 … A-4
- Requirements Traceability Register: R-1 … R-4
- Implementation Register: I-1 … I-6
- AI Knowledge Register: AI-1 … AI-4

## R-5 — No skipped Git recording

```
git add .
git commit -m "Phase X.X - Module"
git push origin main
git tag phase-X.X
git push origin phase-X.X
```

- Never create duplicate tags.
- If a tag exists, verify it references the correct commit.
- Record the commit and tag in the Implementation Register.

## R-6 — No undocumented architecture changes

- Any change to architecture, public types, routes, schema, or module
  boundaries is a decision.
- Decisions are recorded as SADRs (append-only in
  `docs/ARCHITECTURE_DECISIONS.md`) and indexed in the SADR Register.
- If a decision changes, a new SADR supersedes the previous one.

---

# Quality Gates

The registers shall **never contradict**:

| Source of truth | Constraint |
| --- | --- |
| Git | Register tags/commits must match Git exactly. |
| Repository | Register file/module/route entries must exist in the repository. |
| Architecture | Register SADRs must match `docs/ARCHITECTURE_DECISIONS.md`. |
| Implementation | Register phase statuses must match shipped code. |
| Verification | Register verification results must match the last verification suite run. |

When a contradiction exists, the register is corrected — never the source of
truth.

---

# Enforcement

The Repository Governance Auditor (see
`docs/governance/REPOSITORY_GOVERNANCE_AUDITOR.md`) enforces these rules:

- Every phase boundary.
- Every release.
- Every governance review.

Non-compliant changes are blocked or returned for correction before they are
considered complete.

---

# Cross References

- Maintenance protocol: `docs/governance/GOVERNANCE_MAINTENANCE_PROTOCOL.md`
- Auditor: `docs/governance/REPOSITORY_GOVERNANCE_AUDITOR.md`
- Compliance engine: `docs/governance/IMPLEMENTATION_COMPLIANCE_ENGINE.md`
- SADR Register: `docs/governance/SADR_REGISTER.md`
- Implementation Register: `docs/governance/IMPLEMENTATION_REGISTER.md`
- Protocol: `docs/AI_DEVELOPMENT_PROTOCOL.md`
- Manifest: `docs/SCHOLATIA_CORE_PLATFORM_MANIFEST.md`
- Decisions: `docs/ARCHITECTURE_DECISIONS.md`

---

# Maintenance

- **Update trigger:** any amendment to the rules or the addition of a new
  mandatory rule.
- **Owner:** Governance.
- **Next review:** on the next governance phase (Phase G0+).

---

*Version 1.0 — The permanent repository governance rules of Scholatia.*
