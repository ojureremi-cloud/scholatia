# Scholatia User Model & SAID Account Schema

## Purpose

The user domain is the account foundation of the Scholatia platform: every
account is a **user** row (credentials, security state, roles), backed by a
**profile** (public identity), a **SAID** (Scholatia Academic Identity
identifier), and lifecycle artifacts — sessions, email-verification tokens, and
password-reset tokens. This document describes the model, the relationship to
the pre-existing SAID architecture, and the SQL-ready persistence shape.

## Entities

| Entity | Description |
|---|---|
| `UserRow` | Account root: `id`, `email`/`emailNormalized`, `passwordHash`, `securityStatus`, `verificationLevel`, `emailVerifiedAt`, `accountCategory`/`accountType`, `roles`, `institutionId`, `mustResetPassword`, `lastLoginAt`, timestamps. |
| `ProfileRow` | Public identity: `user_id` (1:1), `fullName`, `institution`, `department`, `country`, `avatarUrl`, `biography`, `privacy` setting. |
| `SaidRow` | The linked SAID: `said` identifier (e.g. `SAID-0000-0000-0001`), `displayName`, `verificationLevel`, `isVerified`. |
| `SessionRow` | A persistent login: `rememberMe`, `userAgent`, `ipAddress`, `expiresAt`, `revokedAt`, `lastActivityAt`. |
| `VerificationTokenRow` | Single-use email verification token, stored **hashed** (`tokenHash`), with expiry. |
| `PasswordResetTokenRow` | Single-use reset token, stored **hashed**, with expiry. |
| `RoleRow` / `PermissionRow` | RBAC catalog rows mirroring the engines in `lib/rbac.ts` (see `RBAC.md`). |

Row models live in `types/schema.ts`; the DDL lives in `db/schema.sql`
(PostgreSQL, `TEXT[]` for roles, `TIMESTAMPTZ` for time, UUID primary keys).

## Lifecycle states

- **Security status** (`SecurityStatus`): `Active`, `Suspended`, `Locked`,
  `PendingVerification`, `Deactivated`. A new account starts as
  `PendingVerification` until the email-verification token is consumed.
- **Verification level** (`VerificationLevel`, 0–9): `Unverified` (0),
  `Basic` (1), `StudentVerified` (2), `InstitutionVerified` (3),
  `ProfessionalVerified` (4), `Advanced` (5), `Elevated` (6),
  `ResearchVerified` (7), `Expert` (8), `Comprehensive` (9). Registration sets
  level `Unverified`; email verification promotes to `Basic` and flips
  `isVerified` on the SAID. Further levels are granted by future verification
  flows.
- **Account category / type**: category is `Individual` by default (future:
  `Organization`, `Publisher`, `Institutional`); type defaults to `Student`
  and maps to the RBAC role set.

## Default account (registration)

```
UserRow  → securityStatus: 'PendingVerification'
         → verificationLevel: 0 (Unverified)
         → roles: ['Student']
         → accountCategory: 'Individual'
         → accountType: 'Student'
ProfileRow → fullName (from registration), institution (optional)
SaidRow   → said: SAID-0000-0000-000N (created via lib/auth.ts createSaidIdentifier)
         → isVerified: false
```

Email verification flips the user to `Active`/`Basic`, sets
`emailVerifiedAt`, and marks the SAID `isVerified = true`.

## Identity linkage

- A user links to an existing Scholatia institution via `institutionId`
  (registered by email normalization lookup at signup).
- The SAID is the platform's canonical researcher identifier; profile
  permissions (`read:profile`, `write:profile`) apply to the account that owns
  the SAID. SAID generation, display, and verification follow the conventions
  documented in `identity-architecture.md`.
- The repository (`lib/auth/store.ts`) keys lookups on `emailNormalized` for
  sign-in and on `user_id`/`said` for profiles.

## Persistence strategy

Phase 1.1 has no external database; `lib/auth/store.ts` implements this schema
in memory. Important constraint: because Next.js compiles route handlers and
server components into separate bundles, the repository state is attached to a
`globalThis` singleton (`__scholatiaStore`) so one server process shares one
dataset. Replacing `lib/auth/store.ts` with real database access
(`pg`/prisma) is the entire migration cost — the service, API, session, and
RBAC layers already operate on the row models above.
