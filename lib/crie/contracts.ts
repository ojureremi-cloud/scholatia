import type { ScholatiaAcademicIdentity } from '@/types/identity';
import type { TrustEntityType, VerificationEvidence } from '@/types/trust';
import type { Community } from '@/types/communities';
import type { MarketplaceListing } from '@/types/marketplace';
import type { MessageContext } from '@/types/messages';
import type { Notification, NotificationActor, NotificationSource, NotificationTarget } from '@/types/notifications';
import type { WorkflowInstance } from '@/types/workflows';
import type { ActivityActor, ActivitySource } from '@/types/activity';
import type { ResearchProject } from '@/types/research';
import type { LearningCourse } from '@/types/learning';

/**
 * CRIE Cross-Module Contracts — Mission 004-D (Wave 2).
 *
 * Reference-only application contracts between CRIE and the rest of Scholatia
 * (Learning, Communities, Research, Publishing, Marketplace, Identity,
 * Verification, Messaging, Notifications, Workflow, Activity, Digital Twins).
 * CRIE never duplicates another module's logic; it exchanges canonical
 * references only (SWTROP `sourceId`/`sourceEntity` pattern per
 * `docs/WORKFLOW_ARCHITECTURE.md`). The single binding list below is the
 * authoritative inventory; mapping helpers produce reference objects shaped
 * by the receiving module's own types.
 */

export type CrieModuleName =
  | 'learning'
  | 'communities'
  | 'research'
  | 'publishing'
  | 'marketplace'
  | 'identity'
  | 'verification'
  | 'messaging'
  | 'notifications'
  | 'workflow'
  | 'activity'
  | 'digital-twins';

/** Direction and reference vocabulary of a CRIE module binding. */
export type CrieModuleBinding = {
  module: CrieModuleName;
  direction: 'sends' | 'receives' | 'bidirectional';
  references: string[];
  contract: string;
};

/** Authoritative list of CRIE cross-module bindings. */
export const CRIE_MODULE_BINDINGS: readonly CrieModuleBinding[] = [
  {
    module: 'learning',
    direction: 'bidirectional',
    references: ['crieId', 'learnerStateId'],
    contract: 'CRIE learner signals inform just-in-time teaching; learner mastery feeds CRIE learner memory.',
  },
  {
    module: 'communities',
    direction: 'bidirectional',
    references: ['communityId'],
    contract: 'Research entities may reference communities for discussion and mentoring surfaces.',
  },
  {
    module: 'research',
    direction: 'bidirectional',
    references: ['projectId', 'ResearchLifecycleStageId'],
    contract: 'CRIE research entities reference live research projects by canonical id and stage.',
  },
  {
    module: 'publishing',
    direction: 'sends',
    references: ['journalId', 'conferenceId', 'manuscriptId'],
    contract: 'CRIE publication plans reference the publishing module by canonical ids.',
  },
  {
    module: 'marketplace',
    direction: 'sends',
    references: ['listingId'],
    contract: 'CRIE may surface marketplace listings as innovation and career recommendations.',
  },
  {
    module: 'identity',
    direction: 'receives',
    references: ['username', 'SAID'],
    contract: 'CRIE principals are canonical researchers resolved through ScholatiaAcademicIdentity.',
  },
  {
    module: 'verification',
    direction: 'sends',
    references: ['evidenceId', 'verificationReference'],
    contract: 'CRIE evidence records submit canonical references to the verification engine.',
  },
  {
    module: 'messaging',
    direction: 'sends',
    references: ['conversationId'],
    contract: 'CRIE mentoring and review conversations reference messaging by canonical conversation id.',
  },
  {
    module: 'notifications',
    direction: 'sends',
    references: ['notificationId'],
    contract: 'CRIE events (checkpoints, refusals, recommendations) emit into the unified notification engine.',
  },
  {
    module: 'workflow',
    direction: 'bidirectional',
    references: ['workflowId', 'ResearchLifecycleStageId'],
    contract: 'CRIE orchestration plans and lifecycle transitions reference workflow instances by canonical id.',
  },
  {
    module: 'activity',
    direction: 'sends',
    references: ['activityId', 'username'],
    contract: 'CRIE research activity surfaces into the activity feed as canonical activity records.',
  },
  {
    module: 'digital-twins',
    direction: 'bidirectional',
    references: ['twinId'],
    contract: 'Researcher digital twins (surfaced through research intelligence) mirror CRIE memory and context records.',
  },
];

// ---------------------------------------------------------------------------
// Learning
// ---------------------------------------------------------------------------

/** Reference a learning object surfaced by CRIE learner intelligence. */
export function crieLearningRef(course: Pick<LearningCourse, 'id' | 'title'>): Pick<LearningCourse, 'id' | 'title'> {
  return { id: course.id, title: course.title };
}

// ---------------------------------------------------------------------------
// Communities
// ---------------------------------------------------------------------------

/** Reference a platform community (canonical id + name). */
export function crieCommunityRef(community: Pick<Community, 'id' | 'name'>): Pick<Community, 'id' | 'name'> {
  return { id: community.id, name: community.name };
}

// ---------------------------------------------------------------------------
// Research
// ---------------------------------------------------------------------------

/** Reference a research project by canonical id. */
export function crieResearchRef(projectId: string): Pick<ResearchProject, 'id'> {
  return { id: projectId };
}

// ---------------------------------------------------------------------------
// Publishing
// ---------------------------------------------------------------------------

export type CriePublishingContract = {
  module: 'publishing';
  direction: 'sends';
  journalId?: string;
  conferenceId?: string;
  manuscriptId?: string;
};

/** Reference the publishing records a CRIE publication plan belongs to. */
export function criePublishingRef(input: {
  journalId?: string;
  conferenceId?: string;
  manuscriptId?: string;
}): CriePublishingContract {
  return { module: 'publishing', direction: 'sends', ...input };
}

// ---------------------------------------------------------------------------
// Marketplace
// ---------------------------------------------------------------------------

/** Reference a marketplace listing surfaced as an innovation or career signal. */
export function crieMarketplaceRef(listing: Pick<MarketplaceListing, 'id' | 'title'>): Pick<MarketplaceListing, 'id' | 'title'> {
  return { id: listing.id, title: listing.title };
}

// ---------------------------------------------------------------------------
// Identity
// ---------------------------------------------------------------------------

export type CrieIdentityContract = {
  module: 'identity';
  direction: 'receives';
  principalUsername: string;
  principalName?: string;
  saidReference?: Pick<ScholatiaAcademicIdentity, 'said'>;
};

/** Reference the canonical identity of a CRIE principal (SAID resolved by identity). */
export function crieIdentityRef(username: string, name?: string): CrieIdentityContract {
  return {
    module: 'identity',
    direction: 'receives',
    principalUsername: username,
    principalName: name,
  };
}

// ---------------------------------------------------------------------------
// Verification
// ---------------------------------------------------------------------------

export type CrieVerificationContract = {
  module: 'verification';
  direction: 'sends';
  evidenceReference: string;
  entityType: TrustEntityType;
  entityId: string;
};

/** Reference-shaped evidence pending verification (never duplicates logic). */
export function crieVerificationRef(
  evidenceReference: string,
  entityId: string,
  entityType: TrustEntityType = 'researcher',
): CrieVerificationContract {
  return { module: 'verification', direction: 'sends', evidenceReference, entityType, entityId };
}

/** Reference-shaped evidence record compatible with the verification engine. */
export function crieVerificationEvidence(reference: string, label: string): VerificationEvidence {
  return { id: `crie-evidence-${reference}`, label, status: 'pending' };
}

// ---------------------------------------------------------------------------
// Messaging
// ---------------------------------------------------------------------------

/** Reference-shaped conversation context for a CRIE research entity. */
export function crieMessagingRef(entity: {
  id: string;
  title: string;
}): MessageContext {
  return {
    entityType: 'project' as MessageContext['entityType'],
    id: entity.id,
    title: entity.title,
  };
}

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

/** Source entity type CRIE registers into the unified notification union. */
export const CRIE_SOURCE_ENTITY_TYPE = 'project' as NotificationSource['entityType'];

/** Map a CRIE event to the unified notification record shape. */
export function toUnifiedNotification(input: {
  id: string;
  detail: string;
  actorUsername: string;
  recipientUsername: string;
  sourceId: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  occurredAt: string;
}): Notification {
  const source: NotificationSource = {
    id: input.sourceId,
    entityType: CRIE_SOURCE_ENTITY_TYPE,
    title: input.detail,
  };
  const target: NotificationTarget = { username: input.recipientUsername };
  const actor: NotificationActor = { id: input.actorUsername, name: input.actorUsername };
  return {
    id: input.id,
    title: input.detail,
    body: input.detail,
    category: 'research',
    priority: input.priority,
    status: 'unread',
    channels: ['in-app'],
    source,
    target,
    actor,
    createdAt: input.occurredAt,
  };
}

// ---------------------------------------------------------------------------
// Workflow
// ---------------------------------------------------------------------------

/** Reference a workflow instance by canonical id. */
export function crieWorkflowRef(workflowId: string): Pick<WorkflowInstance, 'id'> {
  return { id: workflowId };
}

// ---------------------------------------------------------------------------
// Activity
// ---------------------------------------------------------------------------

/** Map a CRIE research event to an activity feed source record. */
export function toActivitySource(input: { id: string; title: string }): ActivitySource {
  return {
    id: input.id,
    entityType: 'project' as ActivitySource['entityType'],
    title: input.title,
  };
}

/** Reference-shaped activity actor (canonical researcher username). */
export function crieActivityActor(username: string, name?: string): ActivityActor {
  return { id: username, name: name ?? username, username };
}

// ---------------------------------------------------------------------------
// Digital Twins
// ---------------------------------------------------------------------------

export type CrieDigitalTwinContract = {
  module: 'digital-twins';
  direction: 'bidirectional';
  twinId: string;
  sourceModule: 'intelligence';
  entityType: 'researcher';
};

/**
 * Reference a researcher digital twin. The Digital Twins binding is surfaced
 * through research intelligence; CRIE mirrors memory and context records into
 * the twin, and the twin supplies readiness signals back.
 */
export function crieDigitalTwinRef(username: string): CrieDigitalTwinContract {
  return {
    module: 'digital-twins',
    direction: 'bidirectional',
    twinId: `twin-${username}`,
    sourceModule: 'intelligence',
    entityType: 'researcher',
  };
}
