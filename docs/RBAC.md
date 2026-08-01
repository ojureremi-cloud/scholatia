# Scholatia Role-Based Access Control (RBAC)

## Purpose

`lib/rbac.ts` implements the 10-role platform hierarchy defined in the SAID
architecture. It is a lightweight **authorization projection over the existing
SAID identity model**: platform roles are derived from the identity role types
(`RoleType` in `types/identity.ts`) through `legacyRoles` mappings, and
permissions reuse the existing `PermissionKey` vocabulary from
`types/security.ts`. No identity model is duplicated.

## The 10-role hierarchy

```
0 Visitor → 1 Student → 2 Researcher → 3 Reviewer → 4 Editor →
5 Journal Admin → 6 Conference Admin → 7 Institution Admin → 8 Publisher → 9 Platform Administrator
```

| Level | Role | Direct permissions | Inherits |
|---|---|---|---|
| 0 | Visitor | — | — |
| 1 | Student | `read:profile`, `write:profile`, `read:session`, `manage:session` | Visitor |
| 2 | Researcher | `manage:content`, `manage:identity` | Visitor, Student |
| 3 | Reviewer | `manage:verification` | Visitor, Student, Researcher |
| 4 | Editor | `manage:verification` | Visitor, Student, Researcher, Reviewer |
| 5 | Journal Admin | `manage:users`, `manage:roles` | Visitor, Student, Researcher, Reviewer, Editor |
| 6 | Conference Admin | `manage:users`, `manage:roles` | Visitor, Student, Researcher, Reviewer, Editor |
| 7 | Institution Admin | `manage:users`, `manage:roles`, `manage:access`, `manage:verification`, `manage:institutions`, `manage:students` | Visitor, Student, Researcher |
| 8 | Publisher | `manage:content`, `manage:verification`, `manage:identity` | Visitor, Student, Researcher |
| 9 | Platform Administrator | all 17 permission keys | all other roles |

A role's **effective permissions** are its direct permissions plus every
permission granted by its inherited ancestors.

## Permission catalog

Defined in `types/security.ts` and exhaustively enumerated in `lib/rbac.ts`:

```
read:profile   write:profile   read:session   manage:session
read:security  manage:security read:audit     manage:audit
manage:users   manage:roles    manage:permissions
manage:access  manage:verification  manage:students
manage:institutions  manage:content  manage:identity
```

## API

| Function | Behavior |
|---|---|
| `resolvePlatformRoles(roles)` | Maps legacy identity roles to platform roles, returns `{ platformRoleIds, effectivePermissions, primaryRole }`. The highest-level platform role is `primaryRole`. |
| `getEffectivePermissions(roles)` | Flattened permission list for an identity's roles. |
| `getPrimaryPlatformRole(roles)` | Highest platform role derived from the identity. |
| `hasPlatformRole(roles, roleId)` | Whether the identity maps to the given platform role. |
| `isAtLeast(roles, minimum)` | Whether any resolved platform role is at or above `minimum`. |
| `can({ roles, verificationLevel, permission })` | **Primary authorization check.** Requires `verificationLevel >= EmailVerified` for anything other than `read:profile`. |
| `requirePermission(input)` | Alias of `can`. |
| `getPermissionsForRole(roleId)` | Permission list for a platform role (used to seed role definitions/UI). |
| `RoleHierarchyEngine` | Namespaced facade over all of the above. |

## Legacy role mapping

The `legacyRoles` arrays map existing SAID identity roles to platform roles,
e.g. `Student → student`, `Researcher/Lecturer/Professor/Academic Staff →
researcher`, `Super Administrator/System Administrator →
platform_administrator`. When several legacy roles map to different platform
roles, the **highest** wins for `primaryRole`; all resolved roles contribute
their permissions.

## Verification gating

`can()` enforces a hard precondition: an account whose
`verificationLevel < EmailVerified` may only be granted `read:profile`.
Everything else requires an email-verified account. This is enforced centrally
in the engine, so every RBAC-guarded API inherits the gate.

## Integration

- `app/api/profile/route.ts` guards `PATCH` with
  `can({ roles: current.user.roles, verificationLevel: current.user.verificationLevel, permission: 'write:profile' })`
  and `GET` with `read:profile`; both require a session from
  `getRequestSession()`.
- The auth service seeds every new account with the `Student` legacy role, so
  a freshly registered (email-verified) user can read/write their own profile.
- The SQL catalog rows (`roles`, `permissions` in `db/schema.sql`) mirror the
  definitions here for persistence; `db/schema.sql` is not required at runtime.
