import {
  LEARNING_RESOURCE_KINDS,
} from '@/types/learning';
import type {
  LearningAction,
  LearningPermissionDecision,
  LearningResourceKind,
  LearningRole,
  LearningRoleAssignment,
} from '@/types/learning';

/**
 * Permission Engine — Wave 2 of the Scholatia Learning Ecosystem.
 *
 * Pure, rule-based access control for the SLE. A role grants a set of
 * actions per resource kind; scope qualifiers (platform, institution,
 * faculty, department, programme, course) are evaluated against the
 * actor's role assignments. UI-independent and side-effect free.
 */

/** A single grant within a role's permission matrix. */
export type LearningPermissionGrant = {
  role: LearningRole;
  resource: LearningResourceKind;
  actions: readonly LearningAction[];
};

/** The full role → (resource → actions) permission matrix. */
export type LearningPermissionMatrix = Record<LearningRole, Partial<Record<LearningResourceKind, readonly LearningAction[]>>>;

const READ: readonly LearningAction[] = ['read'];
const READ_RECOMMEND: readonly LearningAction[] = ['read', 'recommend'];
const READ_WRITE: readonly LearningAction[] = ['read', 'create', 'update', 'delete'];
const OWNER_ACTIONS: readonly LearningAction[] = [
  'read',
  'create',
  'update',
  'delete',
  'approve',
  'review',
  'certify',
  'recommend',
  'mentor',
  'moderate',
  'assign',
  'export',
];

/** Build a resource→actions grant map for a fixed action set. */
function grant(
  resources: readonly LearningResourceKind[],
  actions: readonly LearningAction[],
): Partial<Record<LearningResourceKind, readonly LearningAction[]>> {
  const result: Partial<Record<LearningResourceKind, readonly LearningAction[]>> = {};
  resources.forEach((resource) => {
    result[resource] = actions;
  });
  return result;
}

const FULL_ACCESS = grant(LEARNING_RESOURCE_KINDS, OWNER_ACTIONS);

const STUDENT_ACCESS: Partial<Record<LearningResourceKind, readonly LearningAction[]>> = {
  course: READ,
  module: READ,
  lesson: READ,
  topic: READ,
  activity: READ,
  assessment: READ,
  'reading-list': READ,
  'reading-playlist': READ,
  path: ['read', 'create', 'update'],
  portfolio: ['read', 'create', 'update', 'export'],
  passport: ['read', 'export'],
  mentorship: ['read', 'create', 'update'],
  goal: ['read', 'create', 'update'],
  recommendation: ['read', 'update'],
  analytics: READ,
  event: READ,
  academy: READ,
  certificate: READ,
  badge: READ,
  cpd: READ,
  notification: READ,
};

const RESEARCHER_ACCESS: Partial<Record<LearningResourceKind, readonly LearningAction[]>> = {
  ...STUDENT_ACCESS,
  programme: READ,
  curriculum: READ,
  microCourse: READ,
  competency: READ_RECOMMEND,
  certificate: ['read', 'export'],
  badge: ['read', 'export'],
  cpd: ['read', 'create', 'export'],
};

const LECTURER_ACCESS: Partial<Record<LearningResourceKind, readonly LearningAction[]>> = {
  ...RESEARCHER_ACCESS,
  course: ['read', 'create', 'update', 'review', 'recommend'],
  microCourse: ['read', 'create', 'update'],
  module: ['read', 'create', 'update'],
  lesson: ['read', 'create', 'update'],
  topic: ['read', 'create', 'update'],
  activity: ['read', 'create', 'update'],
  assessment: ['read', 'create', 'update', 'review'],
  'reading-list': ['read', 'create', 'update'],
  'reading-playlist': ['read', 'create', 'update'],
  analytics: ['read', 'export'],
};

const SUPERVISOR_ACCESS: Partial<Record<LearningResourceKind, readonly LearningAction[]>> = {
  ...RESEARCHER_ACCESS,
  mentorship: ['read', 'create', 'update', 'approve', 'mentor'],
  assessment: ['read', 'review', 'assign'],
  course: ['read', 'review', 'recommend'],
  portfolio: ['read', 'review', 'export'],
  competency: ['read', 'recommend', 'certify'],
  goal: ['read', 'create', 'update', 'approve'],
  analytics: ['read', 'export'],
};

const MENTOR_ACCESS: Partial<Record<LearningResourceKind, readonly LearningAction[]>> = {
  ...RESEARCHER_ACCESS,
  mentorship: ['read', 'create', 'update', 'mentor'],
  portfolio: ['read', 'review'],
  competency: READ_RECOMMEND,
  goal: ['read', 'update', 'recommend'],
};

const REVIEWER_ACCESS: Partial<Record<LearningResourceKind, readonly LearningAction[]>> = {
  ...RESEARCHER_ACCESS,
  assessment: ['read', 'review', 'assign'],
  course: ['read', 'review'],
  portfolio: ['read', 'review'],
  certificate: ['read', 'review'],
  badge: ['read', 'review'],
  competency: READ_RECOMMEND,
  analytics: READ,
};

const INSTITUTION_ADMIN_ACCESS: Partial<Record<LearningResourceKind, readonly LearningAction[]>> = {
  ...FULL_ACCESS,
  certificate: ['read', 'create', 'certify', 'approve', 'export'],
  badge: ['read', 'create', 'certify', 'approve', 'export'],
  cpd: ['read', 'create', 'approve', 'export'],
  passport: ['read', 'export'],
  portfolio: ['read', 'approve', 'export'],
  analytics: ['read', 'export'],
  notification: ['read', 'create'],
};

const FACULTY_ADMIN_ACCESS: Partial<Record<LearningResourceKind, readonly LearningAction[]>> = {
  ...grant(LEARNING_RESOURCE_KINDS, READ_WRITE),
  analytics: ['read', 'export'],
  programme: ['read', 'update', 'approve', 'assign'],
  curriculum: ['read', 'update', 'approve', 'assign'],
  course: ['read', 'update', 'approve', 'review', 'assign'],
  assessment: ['read', 'update', 'approve', 'assign'],
  certificate: ['read', 'certify', 'approve'],
  badge: ['read', 'certify', 'approve'],
  portfolio: ['read', 'approve'],
  mentorship: ['read', 'approve'],
  notification: ['read', 'create'],
};

const DEPARTMENT_ADMIN_ACCESS: Partial<Record<LearningResourceKind, readonly LearningAction[]>> = {
  ...grant(LEARNING_RESOURCE_KINDS, READ_WRITE),
  analytics: READ,
  course: ['read', 'update', 'review', 'assign'],
  module: ['read', 'update'],
  lesson: ['read', 'update'],
  topic: ['read', 'update'],
  activity: ['read', 'update'],
  assessment: ['read', 'update', 'review', 'assign'],
  mentorship: ['read', 'approve'],
  notification: ['read', 'create'],
};

const PLATFORM_ADMIN_ACCESS: Partial<Record<LearningResourceKind, readonly LearningAction[]>> = {
  ...FULL_ACCESS,
  analytics: ['read', 'export'],
  notification: ['read', 'create', 'update', 'moderate'],
  institution: ['read', 'create', 'update', 'approve'],
  academy: READ_RECOMMEND,
};

const CRIE_ACCESS: Partial<Record<LearningResourceKind, readonly LearningAction[]>> = {
  ...FULL_ACCESS,
  course: ['read', 'review', 'approve', 'certify', 'recommend', 'moderate'],
  assessment: ['read', 'review', 'approve', 'assign'],
  certificate: ['read', 'certify', 'approve', 'moderate', 'export'],
  badge: ['read', 'certify', 'approve', 'moderate', 'export'],
  cpd: ['read', 'approve', 'export'],
  competency: ['read', 'create', 'update', 'certify', 'recommend'],
  institution: ['read', 'approve', 'moderate'],
  analytics: ['read', 'export'],
  notification: ['read', 'create', 'moderate'],
};

const SYSTEM_AI_ACCESS: Partial<Record<LearningResourceKind, readonly LearningAction[]>> = {
  ...grant(LEARNING_RESOURCE_KINDS, READ_RECOMMEND),
  analytics: ['read', 'recommend', 'export'],
  recommendation: ['read', 'create', 'recommend', 'update'],
  notification: ['read', 'create', 'recommend'],
};

/**
 * Default permission matrix for the SLE. Platform admin and CRIE are the
 * broadest roles; students are scoped to their own learning records.
 */
export const LEARNING_PERMISSION_MATRIX: LearningPermissionMatrix = {
  student: STUDENT_ACCESS,
  researcher: RESEARCHER_ACCESS,
  lecturer: LECTURER_ACCESS,
  supervisor: SUPERVISOR_ACCESS,
  mentor: MENTOR_ACCESS,
  reviewer: REVIEWER_ACCESS,
  'institution-admin': INSTITUTION_ADMIN_ACCESS,
  'faculty-admin': FACULTY_ADMIN_ACCESS,
  'department-admin': DEPARTMENT_ADMIN_ACCESS,
  'platform-admin': PLATFORM_ADMIN_ACCESS,
  crie: CRIE_ACCESS,
  'system-ai': SYSTEM_AI_ACCESS,
};

/** Actions a role is granted for a given resource kind. */
export function permissionsForRole(
  role: LearningRole,
  resource: LearningResourceKind,
): readonly LearningAction[] {
  return LEARNING_PERMISSION_MATRIX[role]?.[resource] ?? [];
}

/** The complete grant list derived from the matrix. */
export function permissionGrantsFor(role: LearningRole): LearningPermissionGrant[] {
  const grants: LearningPermissionGrant[] = [];
  const resources = Object.keys(LEARNING_PERMISSION_MATRIX[role]) as LearningResourceKind[];
  resources.forEach((resource) => {
    const actions = LEARNING_PERMISSION_MATRIX[role][resource];
    if (actions && actions.length > 0) grants.push({ role, resource, actions });
  });
  return grants;
}

/**
 * Decide whether an actor holding a role may perform an action on a resource.
 * `resourceOwner` is the canonical username that owns the resource; ownership
 * grants additional self-service actions where a role would otherwise be
 * read-only.
 */
export function canAction(
  role: LearningRole,
  action: LearningAction,
  resource: LearningResourceKind,
  options: {
    resourceOwner?: string;
    actorUsername?: string;
    assignment?: LearningRoleAssignment;
  } = {},
): LearningPermissionDecision {
  const owned = options.resourceOwner !== undefined && options.resourceOwner === options.actorUsername;
  const granted = permissionsForRole(role, resource).includes(action);
  if (granted) {
    return {
      allowed: true,
      role,
      action,
      resource,
      reason: `${role} is granted ${action} on ${resource}`,
    };
  }
  if (owned && ['update', 'read', 'export'].includes(action)) {
    return {
      allowed: true,
      role,
      action,
      resource,
      reason: `${role} owns this ${resource} and may ${action} it`,
    };
  }
  return {
    allowed: false,
    role,
    action,
    resource,
    reason: `${role} is not granted ${action} on ${resource}`,
  };
}

/**
 * Whether the scope of a role assignment authorises an action over a scoped
 * resource. Platform- and institution-scoped assignments cover any resource
 * within that scope; more specific scopes must match the scope id exactly.
 */
export function scopeAuthorises(
  assignment: LearningRoleAssignment | undefined,
  scopeId: string | undefined,
): boolean {
  if (!assignment) return true;
  if (assignment.scopeType === 'platform' || assignment.scopeType === 'institution') return true;
  if (scopeId === undefined) return false;
  return assignment.scopeId === scopeId;
}

/** Canonical id for a role assignment. */
export function roleAssignmentId(username: string, role: LearningRole, scopeType?: string): string {
  return `ra-${username}-${role}${scopeType ? `-${scopeType}` : ''}`;
}

/** Assign a role to a canonical researcher (immutable list). */
export function assignRole(
  assignments: readonly LearningRoleAssignment[],
  input: Omit<LearningRoleAssignment, 'id' | 'grantedAt'>,
): LearningRoleAssignment[] {
  const existing = assignments.find(
    (assignment) =>
      assignment.username === input.username &&
      assignment.role === input.role &&
      assignment.scopeType === input.scopeType &&
      assignment.scopeId === input.scopeId,
  );
  if (existing) return assignments as LearningRoleAssignment[];
  return [
    ...(assignments as LearningRoleAssignment[]),
    {
      ...input,
      id: roleAssignmentId(input.username, input.role, input.scopeType),
      grantedAt: new Date().toISOString(),
    },
  ];
}

/** Revoke a role assignment (immutable list). */
export function revokeRole(
  assignments: readonly LearningRoleAssignment[],
  username: string,
  role: LearningRole,
  scopeType?: string,
  scopeId?: string,
): LearningRoleAssignment[] {
  return (assignments as LearningRoleAssignment[]).filter(
    (assignment) =>
      !(
        assignment.username === username &&
        assignment.role === role &&
        assignment.scopeType === scopeType &&
        assignment.scopeId === scopeId
      ),
  );
}

/** All roles currently assigned to a user, in grant order. */
export function rolesForUser(
  assignments: readonly LearningRoleAssignment[],
  username: string,
): LearningRoleAssignment[] {
  return assignments.filter((assignment) => assignment.username === username);
}

/** The most permissive role a user holds (higher rank wins). */
export function highestRole(assignments: readonly LearningRoleAssignment[], username: string): LearningRole {
  const order: LearningRole[] = [
    'student',
    'researcher',
    'lecturer',
    'supervisor',
    'mentor',
    'reviewer',
    'department-admin',
    'faculty-admin',
    'institution-admin',
    'crie',
    'platform-admin',
    'system-ai',
  ];
  const held = new Set(rolesForUser(assignments, username).map((assignment) => assignment.role));
  for (let index = order.length - 1; index >= 0; index -= 1) {
    if (held.has(order[index])) return order[index];
  }
  return 'student';
}
