import type { ScholatiaAcademicIdentity } from '@/types/identity';
import type { TrustEntityType, VerificationEvidence } from '@/types/trust';
import type { Group } from '@/types/groups';
import type { Community } from '@/types/communities';
import type { MarketplaceListing } from '@/types/marketplace';
import type { MessageContext } from '@/types/messages';
import type { Notification, NotificationActor, NotificationSource, NotificationTarget } from '@/types/notifications';
import type { WorkflowInstance } from '@/types/workflows';
import type { ActivityActor, ActivitySource } from '@/types/activity';
import type { ResearchProject } from '@/types/research';
import type { IntelligenceInsight } from '@/types/intelligence';
import type {
  LearningAssessment,
  LearningCourse,
  LearningNotificationEvent,
  LearningWorkflowEvent,
} from '@/types/learning';

/**
 * Cross-Module Contracts — Wave 2 of the Scholatia Learning Ecosystem.
 *
 * Reference-only application contracts between the SLE and the rest of
 * Scholatia (Identity, Trust, Verification, Groups, Communities, Publishing,
 * Marketplace, Messaging, Notifications, Workflow, Activity, Research
 * Projects, Research Intelligence, Digital Twins). The SLE never duplicates
 * another module's logic; it only exchanges canonical references. The single
 * binding list below is the authoritative inventory; the mapping helpers
 * produce reference objects shaped by the receiving module's own types.
 */

export type LearningModuleName =
  | 'identity'
  | 'trust'
  | 'verification'
  | 'groups'
  | 'communities'
  | 'publishing'
  | 'marketplace'
  | 'messaging'
  | 'notifications'
  | 'workflow'
  | 'activity'
  | 'research-projects'
  | 'research-intelligence'
  | 'digital-twins';

/** Direction and reference vocabulary of a module binding. */
export type LearningModuleBinding = {
  module: LearningModuleName;
  direction: 'sends' | 'receives' | 'bidirectional';
  references: string[];
  contract: string;
};

/** Authoritative list of SLE cross-module bindings. */
export const LEARNING_MODULE_BINDINGS: readonly LearningModuleBinding[] = [
  {
    module: 'identity',
    direction: 'receives',
    references: ['username', 'SAID'],
    contract: 'SLE learners and mentors are canonical researchers resolved through ScholatiaAcademicIdentity.',
  },
  {
    module: 'trust',
    direction: 'receives',
    references: ['username', 'trustScore'],
    contract: 'SLE uses canonical researcher trust as a readiness and recommendation signal.',
  },
  {
    module: 'verification',
    direction: 'sends',
    references: ['verificationReference'],
    contract: 'SLE credentials submit their canonical verification references to the verification engine.',
  },
  {
    module: 'groups',
    direction: 'bidirectional',
    references: ['groupId'],
    contract: 'SLE academies and cohorts may reference platform groups for cohort delivery.',
  },
  {
    module: 'communities',
    direction: 'bidirectional',
    references: ['communityId'],
    contract: 'SLE academies may reference communities for mentoring and discussion surfaces.',
  },
  {
    module: 'publishing',
    direction: 'sends',
    references: ['journalId', 'conferenceId', 'manuscriptId'],
    contract: 'Research outputs produced during learning reference the publishing module by canonical ids.',
  },
  {
    module: 'marketplace',
    direction: 'sends',
    references: ['listingId'],
    contract: 'SLE may surface marketplace listings (courses, services) as learning recommendations.',
  },
  {
    module: 'messaging',
    direction: 'sends',
    references: ['conversationId'],
    contract: 'SLE mentorship and cohort conversations reference messaging by canonical conversation id.',
  },
  {
    module: 'notifications',
    direction: 'sends',
    references: ['notificationId'],
    contract: 'SLE notification events are emitted into the unified notification engine.',
  },
  {
    module: 'workflow',
    direction: 'sends',
    references: ['workflowId', 'ResearchLifecycleStageId'],
    contract: 'Research exercises and programme progress reference workflow instances by canonical id.',
  },
  {
    module: 'activity',
    direction: 'sends',
    references: ['activityId', 'username'],
    contract: 'SLE events surface into the activity feed as canonical activity records.',
  },
  {
    module: 'research-projects',
    direction: 'bidirectional',
    references: ['projectId', 'ResearchLifecycleStageId'],
    contract: 'Research-exercise assessments reference live research projects by canonical id and stage.',
  },
  {
    module: 'research-intelligence',
    direction: 'receives',
    references: ['insightId'],
    contract: 'Research intelligence insights inform SLE research-training recommendations.',
  },
  {
    module: 'digital-twins',
    direction: 'bidirectional',
    references: ['twinId'],
    contract: 'Learner digital twins (surfaced through research intelligence) mirror SLE competency and progress records.',
  },
];

// ---------------------------------------------------------------------------
// Identity
// ---------------------------------------------------------------------------

export type LearningIdentityContract = {
  module: 'identity';
  direction: 'receives';
  learnerUsername: string;
  learnerName?: string;
  saidReference?: Pick<ScholatiaAcademicIdentity, 'said'>;
};

/** Reference the canonical identity of a learner (SAID is resolved by identity). */
export function learningIdentityRef(username: string, name?: string): LearningIdentityContract {
  return {
    module: 'identity',
    direction: 'receives',
    learnerUsername: username,
    learnerName: name,
  };
}

// ---------------------------------------------------------------------------
// Trust
// ---------------------------------------------------------------------------

export type LearningTrustContract = {
  module: 'trust';
  direction: 'receives';
  entityType: TrustEntityType;
  entityId: string;
};

/** Reference the canonical trust record of a researcher. */
export function learningTrustRef(username: string, entityType: TrustEntityType = 'researcher'): LearningTrustContract {
  return { module: 'trust', direction: 'receives', entityType, entityId: username };
}

// ---------------------------------------------------------------------------
// Verification
// ---------------------------------------------------------------------------

export type LearningVerificationContract = {
  module: 'verification';
  direction: 'sends';
  credentialReference: string;
  learnerUsername: string;
};

/** Submit a credential's verification reference to the verification engine. */
export function learningVerificationContract(
  credentialReference: string,
  learnerUsername: string,
): LearningVerificationContract {
  return { module: 'verification', direction: 'sends', credentialReference, learnerUsername };
}

/** Reference-shaped evidence pending verification (never duplicates logic). */
export function verificationEvidenceFor(reference: string, label: string): VerificationEvidence {
  return { id: `ver-${reference}`, label, status: 'pending' };
}

// ---------------------------------------------------------------------------
// Groups and Communities
// ---------------------------------------------------------------------------

/** Reference a platform group (canonical id + name). */
export function learningGroupRef(group: Pick<Group, 'id' | 'name'>): Pick<Group, 'id' | 'name'> {
  return { id: group.id, name: group.name };
}

/** Reference a platform community (canonical id + name). */
export function learningCommunityRef(community: Pick<Community, 'id' | 'name'>): Pick<Community, 'id' | 'name'> {
  return { id: community.id, name: community.name };
}

// ---------------------------------------------------------------------------
// Publishing
// ---------------------------------------------------------------------------

export type LearningPublishingContract = {
  module: 'publishing';
  direction: 'sends';
  journalId?: string;
  conferenceId?: string;
  manuscriptId?: string;
};

/** Reference the publishing records a research output belongs to. */
export function learningPublishingRef(input: {
  journalId?: string;
  conferenceId?: string;
  manuscriptId?: string;
}): LearningPublishingContract {
  return { module: 'publishing', direction: 'sends', ...input };
}

// ---------------------------------------------------------------------------
// Marketplace
// ---------------------------------------------------------------------------

/** Reference a marketplace listing surfaced as a learning recommendation. */
export function learningMarketplaceRef(listing: Pick<MarketplaceListing, 'id' | 'title'>): Pick<MarketplaceListing, 'id' | 'title'> {
  return { id: listing.id, title: listing.title };
}

// ---------------------------------------------------------------------------
// Messaging
// ---------------------------------------------------------------------------

/**
 * Reference-shaped conversation context for a course. The SLE registers its
 * course vocabulary into the unified `ConversationEntityType` union.
 */
export function learningConversationContext(course: LearningCourse): MessageContext {
  return {
    entityType: 'course' as MessageContext['entityType'],
    id: course.id,
    title: course.title,
  };
}

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

/** Source entity type the SLE registers into the unified notification union. */
export const LEARNING_SOURCE_ENTITY_TYPE = 'course' as NotificationSource['entityType'];

/** Map a SLE notification event to the unified notification record shape. */
export function toUnifiedNotification(event: LearningNotificationEvent): Notification {
  const source: NotificationSource = {
    id: event.objectRef?.nodeId ?? event.id,
    entityType: LEARNING_SOURCE_ENTITY_TYPE,
    title: event.detail,
  };
  const target: NotificationTarget = {
    username: event.recipientUsernames[0],
  };
  const actor: NotificationActor = {
    id: event.actorUsername,
    name: event.actorUsername,
  };
  return {
    id: event.id,
    title: event.detail,
    body: event.detail,
    category: 'research',
    priority: event.priority,
    status: 'unread',
    channels: [event.channel],
    source,
    target,
    actor,
    createdAt: event.occurredAt,
  };
}

// ---------------------------------------------------------------------------
// Workflow
// ---------------------------------------------------------------------------

/** Reference a workflow instance by canonical id. */
export function learningWorkflowRef(workflowId: string): Pick<WorkflowInstance, 'id'> {
  return { id: workflowId };
}

// ---------------------------------------------------------------------------
// Activity
// ---------------------------------------------------------------------------

/** Map a SLE workflow event to an activity feed source record. */
export function toActivitySource(event: LearningWorkflowEvent): ActivitySource {
  return {
    id: event.objectRef?.nodeId ?? event.id,
    entityType: 'course' as ActivitySource['entityType'],
    title: event.detail,
  };
}

/** Reference-shaped activity actor (canonical researcher username). */
export function learningActivityActor(username: string, name?: string): ActivityActor {
  return { id: username, name: name ?? username, username };
}

// ---------------------------------------------------------------------------
// Research projects
// ---------------------------------------------------------------------------

/** Reference a research project by canonical id. */
export function learningProjectRef(projectId: string): Pick<ResearchProject, 'id'> {
  return { id: projectId };
}

/** Reference the research lifecycle stage carried by a research exercise. */
export function learningLifecycleStageRef(assessment: LearningAssessment): { lifecycleStageId?: string } {
  return { lifecycleStageId: assessment.lifecycleStageId };
}

// ---------------------------------------------------------------------------
// Research intelligence
// ---------------------------------------------------------------------------

/** Reference a research intelligence insight by canonical id. */
export function learningInsightRef(insightId: string): Pick<IntelligenceInsight, 'id'> {
  return { id: insightId };
}

// ---------------------------------------------------------------------------
// Digital twins
// ---------------------------------------------------------------------------

export type LearningDigitalTwinContract = {
  module: 'digital-twins';
  direction: 'bidirectional';
  twinId: string;
  sourceModule: 'intelligence';
  entityType: 'researcher';
};

/**
 * Reference a learner digital twin. The Digital Twins binding is surfaced
 * through research intelligence; the SLE mirrors competency and progress
 * records into the twin, and the twin supplies readiness signals back.
 */
export function learningDigitalTwinRef(username: string): LearningDigitalTwinContract {
  return {
    module: 'digital-twins',
    direction: 'bidirectional',
    twinId: `twin-${username}`,
    sourceModule: 'intelligence',
    entityType: 'researcher',
  };
}
