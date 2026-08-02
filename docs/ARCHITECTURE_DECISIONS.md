# SCHOLATIA ARCHITECTURE DECISIONS

**Version 1.0**

*"Every major architectural decision is recorded, justified, and never forgotten."*

---

# Purpose

This document records significant architectural decisions made during the development of Scholatia.

Each decision includes:

- Context
- Decision
- Rationale
- Consequences
- Status

This file is append-only.

Existing decisions are never rewritten. If a decision changes, a new ADR supersedes the previous one.

---

# Decision Status Values

- Proposed
- Accepted
- Superseded
- Deprecated
- Rejected

---

# ADR-001 — Single Platform Architecture

**Status:** Accepted

## Context

Scholatia consists of many modules that could have been developed independently.

## Decision

Scholatia will be engineered as **one integrated scholarly operating system** rather than a collection of unrelated applications.

## Rationale

Unified identity.

Unified search.

Unified trust.

Unified commerce.

Unified lifecycle.

Unified analytics.

## Consequences

Every module must integrate with existing modules.

---

# ADR-002 — Canonical Type System

**Status:** Accepted

## Decision

Every domain entity has exactly one canonical TypeScript definition.

No duplicated interfaces.

## Consequences

Modules import types.

Modules never redefine them.

---

# ADR-003 — Canonical Placeholder Data

**Status:** Accepted

## Decision

Placeholder datasets own identities.

Derived modules reference canonical records.

## Consequences

No duplicated researchers.

No duplicated journals.

No duplicated institutions.

---

# ADR-004 — Single Lifecycle Engine

**Status:** Accepted

## Decision

One lifecycle engine governs Scholatia.

Modules consume it.

Modules never redefine stages.

---

# ADR-005 — Discovery Owns No Data

**Status:** Accepted

## Decision

Discovery indexes records.

Discovery never owns records.

---

# ADR-006 — Intelligence Is Fully Derived

**Status:** Accepted

## Decision

Intelligence derives:

- recommendations
- trends
- forecasts
- analytics
- knowledge graphs

from canonical modules.

---

# ADR-007 — Trust Is Cross-Platform

**Status:** Accepted

Trust signals are reusable across:

- Commerce
- Marketplace
- Services
- Publishing
- Institutions
- Research

---

# ADR-008 — Unified Commerce Engine

**Status:** Accepted

All revenue streams use one commerce engine.

Examples:

- advertising
- marketplace
- subscriptions
- services
- publishing
- institutional licensing
- enterprise

---

# ADR-009 — Append-Only Database

**Status:** Accepted

Schema changes are additive.

Tables are never dropped.

Tables are never renamed without migration.

---

# ADR-010 — Component Standardisation

**Status:** Accepted

Every module follows the same component architecture.

Example:

```
components/module/

format.ts

Badge.tsx

Statistics.tsx

Analytics.tsx

SearchPanel.tsx

CategoryTabs.tsx

Browser.tsx

Card components

index.ts
```

---

# ADR-011 — Utility Layer

**Status:** Accepted

Business logic belongs in `lib/`.

Pages compose.

Components render.

Utilities compute.

---

# ADR-012 — Hook Layer

**Status:** Accepted

Every domain owns a single canonical hook.

Hooks are extended.

Hooks are never duplicated.

---

# ADR-013 — Verification Suite

**Status:** Accepted

Every completed phase must pass:

```bash
npx tsc --noEmit

npm run lint

npm run build
```

---

# ADR-014 — Documentation Is Part of Done

**Status:** Accepted

Every completed phase includes:

- architecture document
- schema updates
- barrel exports
- hook registration
- utility registration
- completion report

---

# ADR-015 — AI Governance

**Status:** Accepted

Every AI contributor follows:

- SCHOLATIA_CORE_PLATFORM_MANIFEST.md
- AI_DEVELOPMENT_PROTOCOL.md
- PHASE_ROADMAP.md
- ARCHITECTURE_DECISIONS.md

before modifying the repository.

---

# ADR-016 — Phase Boundary Rule

**Status:** Accepted

AI contributors stop exactly at the approved phase.

No feature creep.

No unapproved optimisation.

No unsolicited refactoring.

---

# ADR-017 — Git Release Strategy

**Status:** Accepted

Every completed phase follows:

```bash
git add .

git commit

git push

git tag phase-X.X

git push origin phase-X.X
```

---

# ADR-018 — Platform Identity

**Status:** Accepted

Scholatia is:

- a scholarly identity platform,
- a research operating system,
- a scholarly marketplace,
- a publishing infrastructure,
- an intelligence platform,
- a trust network,
- and an enterprise academic ecosystem.

Every architectural decision must reinforce that identity.

---

# Future Decisions

All new architectural decisions should be appended using the following template.

---

## ADR-XXX — Title

**Status:** Proposed | Accepted | Superseded | Deprecated

### Context

Describe the problem or situation.

### Decision

Describe the chosen solution.

### Rationale

Explain why this approach was selected.

### Consequences

Describe technical and architectural implications.

### Related Documents

Reference:

- SCHOLATIA_CORE_PLATFORM_MANIFEST.md
- AI_DEVELOPMENT_PROTOCOL.md
- PHASE_ROADMAP.md
- Previous ADRs

---

# Governance Framework Complete

With this addition, Scholatia now has a complete governance framework:

```
docs/
├── SCHOLATIA_CORE_PLATFORM_MANIFEST.md
├── AI_DEVELOPMENT_PROTOCOL.md
├── PHASE_ROADMAP.md
└── ARCHITECTURE_DECISIONS.md
```

Together, these four documents provide:

- **Platform Constitution** — what Scholatia is.
- **Engineering Protocol** — how development must be carried out.
- **Strategic Roadmap** — where the platform is going.
- **Architectural Memory** — why major technical decisions were made.

This is a governance structure comparable to what mature open-source foundations and large engineering organizations use to keep architecture consistent over many years of development.
