import type {
  LearningEventObjectRef,
  LearningNotificationEvent,
  LearningNotificationKind,
  LearningNotificationPriority,
  LearningWorkflowEvent,
} from '@/types/learning';

/**
 * Notification Contracts — Wave 2 of the Scholatia Learning Ecosystem.
 *
 * Pure logic (never UI) that generates `LearningNotificationEvent` records
 * for enrolment, completion, assessment, certification, badge, mentorship,
 * goal achievement, recommendation availability, portfolio updates, and
 * passport updates. The events describe recipients, channels, and
 * priorities; a transport layer renders them.
 */

/** Default channel per notification kind. */
export const DEFAULT_NOTIFICATION_CHANNEL: Record<LearningNotificationKind, LearningNotificationEvent['channel']> = {
  enrolment: 'in-app',
  completion: 'in-app',
  assessment: 'in-app',
  certification: 'email',
  badge: 'in-app',
  mentorship: 'in-app',
  'goal-achieved': 'email',
  'recommendation-available': 'in-app',
  'portfolio-updated': 'in-app',
  'passport-updated': 'in-app',
};

/** Default priority per notification kind. */
export const DEFAULT_NOTIFICATION_PRIORITY: Record<LearningNotificationKind, LearningNotificationPriority> = {
  enrolment: 'normal',
  completion: 'normal',
  assessment: 'high',
  certification: 'high',
  badge: 'normal',
  mentorship: 'normal',
  'goal-achieved': 'high',
  'recommendation-available': 'low',
  'portfolio-updated': 'low',
  'passport-updated': 'low',
};

export function learningNotificationEventId(kind: LearningNotificationKind, key: string): string {
  return `lnt-${kind}-${key}`;
}

/** Build a notification event with kind defaults. */
export function learningNotificationEvent(
  kind: LearningNotificationKind,
  actorUsername: string,
  recipientUsernames: readonly string[],
  detail: string,
  objectRef?: LearningEventObjectRef,
  occurredAt = new Date().toISOString(),
): LearningNotificationEvent {
  return {
    id: learningNotificationEventId(kind, `${recipientUsernames[0] ?? 'user'}-${objectRef ? objectRef.nodeId : 'system'}`),
    kind,
    actorUsername,
    recipientUsernames: Array.from(new Set(recipientUsernames)),
    objectRef,
    detail,
    occurredAt,
    channel: DEFAULT_NOTIFICATION_CHANNEL[kind],
    priority: DEFAULT_NOTIFICATION_PRIORITY[kind],
  };
}

function recipientsOf(primary: string, extra?: string): string[] {
  return extra && extra !== primary ? [primary, extra] : [primary];
}

/** Enrolment notification (learner + optional instructor). */
export function emitEnrolment(input: {
  actorUsername: string;
  learnerUsername: string;
  course: { id: string; title: string; instructorUsername?: string };
  occurredAt?: string;
}): LearningNotificationEvent {
  return learningNotificationEvent(
    'enrolment',
    input.actorUsername,
    recipientsOf(input.learnerUsername, input.course.instructorUsername),
    `Enrolled in ${input.course.title}`,
    { nodeType: 'course', nodeId: input.course.id },
    input.occurredAt,
  );
}

/** Completion notification (learner + optional instructor). */
export function emitCompletion(input: {
  actorUsername: string;
  learnerUsername: string;
  objectRef: LearningEventObjectRef;
  detail: string;
  additionalRecipients?: string[];
  occurredAt?: string;
}): LearningNotificationEvent {
  return learningNotificationEvent(
    'completion',
    input.actorUsername,
    [input.learnerUsername, ...(input.additionalRecipients ?? [])],
    input.detail,
    input.objectRef,
    input.occurredAt,
  );
}

/** Assessment notification. */
export function emitAssessment(input: {
  actorUsername: string;
  learnerUsername: string;
  objectRef: LearningEventObjectRef;
  detail: string;
  passed: boolean;
  occurredAt?: string;
}): LearningNotificationEvent {
  const event = learningNotificationEvent('assessment', input.actorUsername, [input.learnerUsername], input.detail, input.objectRef, input.occurredAt);
  return input.passed ? event : { ...event, priority: 'high' };
}

/** Certification notification. */
export function emitCertification(input: {
  actorUsername: string;
  learnerUsername: string;
  objectRef: LearningEventObjectRef;
  detail: string;
  occurredAt?: string;
}): LearningNotificationEvent {
  return learningNotificationEvent('certification', input.actorUsername, [input.learnerUsername], input.detail, input.objectRef, input.occurredAt);
}

/** Badge notification. */
export function emitBadge(input: {
  actorUsername: string;
  learnerUsername: string;
  objectRef: LearningEventObjectRef;
  detail: string;
  occurredAt?: string;
}): LearningNotificationEvent {
  return learningNotificationEvent('badge', input.actorUsername, [input.learnerUsername], input.detail, input.objectRef, input.occurredAt);
}

/** Mentorship notification (mentor + mentee). */
export function emitMentorship(input: {
  actorUsername: string;
  mentorUsername: string;
  menteeUsername: string;
  detail: string;
  occurredAt?: string;
}): LearningNotificationEvent {
  return learningNotificationEvent(
    'mentorship',
    input.actorUsername,
    [input.mentorUsername, input.menteeUsername],
    input.detail,
    undefined,
    input.occurredAt,
  );
}

/** Goal achieved notification. */
export function emitGoalAchieved(input: {
  actorUsername: string;
  learnerUsername: string;
  objectRef: LearningEventObjectRef;
  detail: string;
  occurredAt?: string;
}): LearningNotificationEvent {
  return learningNotificationEvent('goal-achieved', input.actorUsername, [input.learnerUsername], input.detail, input.objectRef, input.occurredAt);
}

/** Recommendation available notification. */
export function emitRecommendationAvailable(input: {
  actorUsername: string;
  learnerUsername: string;
  detail: string;
  objectRef?: LearningEventObjectRef;
  occurredAt?: string;
}): LearningNotificationEvent {
  return learningNotificationEvent('recommendation-available', input.actorUsername, [input.learnerUsername], input.detail, input.objectRef, input.occurredAt);
}

/** Portfolio updated notification. */
export function emitPortfolioUpdated(input: {
  actorUsername: string;
  learnerUsername: string;
  objectRef: LearningEventObjectRef;
  detail: string;
  occurredAt?: string;
}): LearningNotificationEvent {
  return learningNotificationEvent('portfolio-updated', input.actorUsername, [input.learnerUsername], input.detail, input.objectRef, input.occurredAt);
}

/** Passport updated notification. */
export function emitPassportUpdated(input: {
  actorUsername: string;
  learnerUsername: string;
  objectRef: LearningEventObjectRef;
  detail: string;
  occurredAt?: string;
}): LearningNotificationEvent {
  return learningNotificationEvent('passport-updated', input.actorUsername, [input.learnerUsername], input.detail, input.objectRef, input.occurredAt);
}

/** Notifications addressed to a user. */
export function learningNotificationEventsFor(events: readonly LearningNotificationEvent[], username: string): LearningNotificationEvent[] {
  return events.filter((event) => event.recipientUsernames.includes(username));
}

/** Map workflow events to notification events automatically. */
export function notificationsFromWorkflow(events: readonly LearningWorkflowEvent[]): LearningNotificationEvent[] {
  const kindMap: Partial<Record<LearningWorkflowEvent['kind'], LearningNotificationKind>> = {
    enrolment: 'enrolment',
    'topic-completion': 'completion',
    'lesson-completion': 'completion',
    'module-completion': 'completion',
    'course-completion': 'completion',
    'path-progress': 'completion',
    'curriculum-progress': 'completion',
    'programme-progress': 'completion',
    'research-exercise-progress': 'assessment',
    assessment: 'assessment',
    certificate: 'certification',
    badge: 'badge',
    cpd: 'passport-updated',
    passport: 'passport-updated',
    portfolio: 'portfolio-updated',
    competency: 'completion',
    'goal-completion': 'goal-achieved',
  };
  return events.flatMap((event) => {
    const kind = kindMap[event.kind];
    if (!kind) return [];
    const eventNotification = learningNotificationEvent(
      kind,
      event.actorUsername,
      [event.learnerUsername],
      event.detail ?? event.kind,
      event.objectRef,
      event.occurredAt,
    );
    return [eventNotification];
  });
}

/** Group notification events by kind with counts. */
export function learningNotificationSummary(events: readonly LearningNotificationEvent[]): {
  total: number;
  unread: number;
  byKind: Record<LearningNotificationKind, number>;
} {
  const byKind = Object.fromEntries(
    (
      [
        'enrolment',
        'completion',
        'assessment',
        'certification',
        'badge',
        'mentorship',
        'goal-achieved',
        'recommendation-available',
        'portfolio-updated',
        'passport-updated',
      ] as LearningNotificationKind[]
    ).map((kind) => [kind, 0]),
  ) as Record<LearningNotificationKind, number>;
  events.forEach((event) => {
    byKind[event.kind] = (byKind[event.kind] ?? 0) + 1;
  });
  return { total: events.length, unread: events.length, byKind };
}
