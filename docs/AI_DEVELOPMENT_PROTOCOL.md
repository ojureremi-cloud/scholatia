# SCHOLATIA AI DEVELOPMENT PROTOCOL

Version 1.0

Status: Active

---

# Purpose

This document defines the mandatory engineering protocol that every AI
contributor (OpenCode, ChatGPT, Claude, Cursor, Copilot, etc.) must follow
when modifying the Scholatia codebase.

This protocol complements:

- SCHOLATIA_CORE_PLATFORM_MANIFEST.md
- PHASE_ROADMAP.md
- ARCHITECTURE_DECISIONS.md

It defines **how** development is performed.

---

# SECTION 1 — Audit First

Before writing any code:

The AI MUST audit the repository.

Confirm:

- existing types
- existing constants
- existing placeholders
- existing hooks
- existing utilities
- existing components
- existing schema
- existing routes
- existing documentation

Never assume something is missing.

Audit first.

---

# SECTION 2 — Reuse Before Create

Always reuse existing assets.

Priority order:

1. types/
2. constants/
3. lib/
4. hooks/
5. components/
6. db/schema.sql

Never duplicate existing functionality.

---

# SECTION 3 — Canonical Types

Every shared type belongs inside:

types/

Never redefine:

- interfaces
- enums
- unions
- lifecycle stages
- identifiers

Import them.

---

# SECTION 4 — Placeholder Data

Placeholder records are canonical.

Always consume:

constants/placeholder-*.ts

Never duplicate sample data.

Reference existing IDs through:

sourceId

sourceEntity

---

# SECTION 5 — Lifecycle

The lifecycle engine is canonical.

Reuse:

lib/lifecycle.ts

Never recreate lifecycle stages.

Never create another lifecycle engine.

---

# SECTION 6 — Utilities

Business logic belongs inside:

lib/

Never duplicate calculations inside:

components

hooks

pages

Utilities should remain pure.

---

# SECTION 7 — Hooks

Every module exposes:

hooks/useX.ts

Hooks orchestrate state.

Hooks consume utilities.

Hooks never duplicate utility logic.

---

# SECTION 8 — Components

Module structure:

components/module/

Shared UI:

components/ui/

Pages assemble components.

Components should remain reusable.

---

# SECTION 9 — Database

db/schema.sql is canonical.

Rules:

append-only

no table deletion

no silent renaming

module_entity naming

proper indexes

cross-module references

typed comments

---

# SECTION 10 — Cross-Module Integration

Every new module must integrate with existing modules.

Never create isolated systems.

Reuse:

Identity

Research

Discovery

Trust

Commerce

Marketplace

Publishing

Institutions

Knowledge Graph

---

# SECTION 11 — Documentation

Every completed phase includes:

- architecture document
- schema updates
- barrel exports
- hook registration
- utility registration
- completion report

---

# SECTION 12 — Verification

Every completed phase MUST pass:

npx tsc --noEmit

npm run lint

npm run build

Expected lint baseline:

components/ui/Avatar.tsx

<img> warning only

No additional warnings.

---

# SECTION 13 — Recovery Protocol

If execution stops:

Audit first.

Determine:

completed work

missing work

missing files

missing exports

missing documentation

verification status

Only complete missing work.

Never rebuild completed modules.

---

# SECTION 14 — Git Protocol

Every completed phase:

git add .

git commit -m "Phase X.X - Module"

git push origin main

git tag phase-X.X

git push origin phase-X.X

Never create duplicate tags.

If tag exists:

verify it references the correct commit.

---

# SECTION 15 — Phase Boundary Rule

Stop exactly at the approved phase.

Do not:

feature creep

optimise unrelated code

refactor working modules

begin later phases

unless explicitly approved.

---

# SECTION 16 — Completion Report

Every phase ends with:

Audit summary

Files created

Files modified

Cross-module integration

Lifecycle verification

Schema verification

TypeScript verification

Lint verification

Build verification

Architecture summary

Status

---

# SECTION 17 — Engineering Standards

Strict TypeScript

No any

Shared types

Shared enums

Shared constants

Named exports

Reusable utilities

Reusable hooks

Reusable components

Path aliases

No duplicated business logic

---

# SECTION 18 — Platform Principle

Scholatia is engineered as one platform.

Identity powers research.

Research powers discovery.

Discovery powers intelligence.

Intelligence powers trust.

Trust powers commerce.

Commerce powers services.

Services power marketplace.

Marketplace powers publishing.

Publishing strengthens the scholarly ecosystem.

Every engineering decision must reinforce this unified architecture.

---

Version 1.0

Approved for all future Scholatia development.
