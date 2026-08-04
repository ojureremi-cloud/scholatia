import {
  addCpdRecord,
  advanceProgress,
  completeLearningObject,
  isAssessmentPassing,
  isCourseCompleted,
  issueBadge,
  issueCertificate,
  progressStateOf,
  updateGoalStatus,
} from '@/lib/learning';
import type {
  LearningActivity,
  LearningAssessment,
  LearningCpdRecord,
  LearningCourse,
  LearningGoal,
  LearningLesson,
  LearningModule,
  LearningNodeType,
  LearningEventObjectRef,
  LearningPassport,
  LearningPath,
  LearningPortfolio,
  LearningProgressEntry,
  LearningProgramme,
  LearningTopic,
  LearningWorkflowEvent,
  LearningWorkflowKind,
} from '@/types/learning';

/**
 * Learning Workflow Engine — Wave 2 of the Scholatia Learning Ecosystem.
 *
 * Pure orchestration for course enrolment/withdrawal, topic/lesson/module/
 * course completion cascades, learning path, curriculum and programme
 * progress, research exercises, the assessment lifecycle, certificate
 * issuance, badge awards, CPD recording, passport and portfolio updates,
 * competency progression, and goal completion. Every operation returns the
 * new immutable state together with the workflow events it emitted. This
 * module is UI-independent.
 */

/** Result of a workflow step: the updated state plus emitted events. */
export type LearningWorkflowResult<S> = {
  state: S;
  events: LearningWorkflowEvent[];
};

/** Canonical id for a workflow event. */
export function workflowEventId(
  kind: LearningWorkflowKind,
  learnerUsername: string,
  objectRef?: LearningEventObjectRef,
): string {
  return `wf-${kind}-${learnerUsername}-${objectRef ? objectRef.nodeId : 'system'}`;
}

/** Build a workflow event (logic contract, never rendered). */
export function workflowEvent(
  kind: LearningWorkflowKind,
  learnerUsername: string,
  actorUsername: string,
  objectRef?: LearningEventObjectRef,
  detail?: string,
  occurredAt = new Date().toISOString(),
): LearningWorkflowEvent {
  return {
    id: workflowEventId(kind, learnerUsername, objectRef),
    kind,
    learnerUsername,
    actorUsername,
    objectRef,
    detail,
    occurredAt,
  };
}

/** Workflow events involving a user (as learner or actor). */
export function workflowEventsFor(
  events: readonly LearningWorkflowEvent[],
  username: string,
): LearningWorkflowEvent[] {
  return events.filter((event) => event.learnerUsername === username || event.actorUsername === username);
}

/** Group workflow events by kind with counts. */
export function workflowEventSummary(events: readonly LearningWorkflowEvent[]): {
  total: number;
  byKind: Record<LearningWorkflowKind, number>;
} {
  const byKind = Object.fromEntries(
    (
      [
        'enrolment',
        'withdrawal',
        'topic-completion',
        'lesson-completion',
        'module-completion',
        'course-completion',
        'path-progress',
        'curriculum-progress',
        'programme-progress',
        'research-exercise-progress',
        'assessment',
        'certificate',
        'badge',
        'cpd',
        'passport',
        'portfolio',
        'competency',
        'goal-completion',
      ] as LearningWorkflowKind[]
    ).map((kind) => [kind, 0]),
  ) as Record<LearningWorkflowKind, number>;
  events.forEach((event) => {
    byKind[event.kind] = (byKind[event.kind] ?? 0) + 1;
  });
  return { total: events.length, byKind };
}

// ---------------------------------------------------------------------------
// Course tree helpers
// ---------------------------------------------------------------------------

type CourseNode = LearningCourse | LearningModule | LearningLesson | LearningTopic | LearningActivity;

function nodeTypeOfNode(node: CourseNode): LearningNodeType {
  if ('modules' in node) return 'course';
  if ('lessons' in node) return 'module';
  if ('topics' in node) return 'lesson';
  if ('activities' in node) return 'topic';
  return 'activity';
}

function childrenOfNode(node: CourseNode): CourseNode[] {
  if ('modules' in node) return node.modules;
  if ('lessons' in node) return node.lessons;
  if ('topics' in node) return node.topics;
  if ('activities' in node) return node.activities;
  return [];
}

type CourseTreeNode = {
  node: CourseNode;
  nodeType: LearningNodeType;
  ancestors: CourseNode[];
};

function findNodeInCourse(course: LearningCourse, id: string): CourseTreeNode | undefined {
  const queue: { node: CourseNode; ancestors: CourseNode[] }[] = [{ node: course, ancestors: [] }];
  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) continue;
    if (current.node.id === id) {
      return { node: current.node, nodeType: nodeTypeOfNode(current.node), ancestors: current.ancestors };
    }
    childrenOfNode(current.node).forEach((child) => {
      queue.push({ node: child, ancestors: [current.node, ...current.ancestors] });
    });
  }
  return undefined;
}

function allDescendantIds(node: CourseNode): string[] {
  return [node.id, ...childrenOfNode(node).flatMap((child) => allDescendantIds(child))];
}

function completeNode(
  progress: readonly LearningProgressEntry[],
  nodeType: LearningNodeType,
  id: string,
  completedAt: string,
  score?: number,
): LearningProgressEntry[] {
  return advanceProgress(progress, { nodeType, learningObjectId: id, state: 'completed', completedAt, score });
}

/** Map a completed course node to its workflow event kind. */
function nodeWorkflowKind(node: CourseNode): LearningWorkflowKind | undefined {
  const nodeType = nodeTypeOfNode(node);
  switch (nodeType) {
    case 'course':
      return 'course-completion';
    case 'module':
      return 'module-completion';
    case 'lesson':
      return 'lesson-completion';
    case 'topic':
      return 'topic-completion';
    case 'activity':
      return 'assessmentId' in node && node.assessmentId ? 'research-exercise-progress' : undefined;
    default:
      return undefined;
  }
}

// ---------------------------------------------------------------------------
// Enrolment and withdrawal
// ---------------------------------------------------------------------------

/** Enrol a learner in a course (idempotent). */
export function enrol(
  progress: readonly LearningProgressEntry[],
  course: LearningCourse,
  learnerUsername: string,
  actorUsername = learnerUsername,
  occurredAt = new Date().toISOString(),
): LearningWorkflowResult<LearningProgressEntry[]> {
  const existing = progressStateOf(progress, 'course', course.id);
  if (existing === 'completed' || existing === 'in-progress') {
    return { state: [...progress], events: [] };
  }
  const state = advanceProgress(progress, {
    nodeType: 'course',
    learningObjectId: course.id,
    state: 'in-progress',
    completedAt: occurredAt,
  });
  return {
    state,
    events: [
      workflowEvent('enrolment', learnerUsername, actorUsername, { nodeType: 'course', nodeId: course.id }, `Enrolled in ${course.title}`, occurredAt),
    ],
  };
}

/** Withdraw a learner from a course, clearing its progress subtree. */
export function withdraw(
  progress: readonly LearningProgressEntry[],
  course: LearningCourse,
  learnerUsername: string,
  actorUsername = learnerUsername,
  occurredAt = new Date().toISOString(),
): LearningWorkflowResult<LearningProgressEntry[]> {
  const existing = progressStateOf(progress, 'course', course.id);
  const ids = new Set(allDescendantIds(course));
  const state = progress.filter((entry) => !ids.has(entry.learningObjectId));
  if (existing === 'not-started') {
    return { state, events: [] };
  }
  return {
    state,
    events: [
      workflowEvent('withdrawal', learnerUsername, actorUsername, { nodeType: 'course', nodeId: course.id }, `Withdrawn from ${course.title}`, occurredAt),
    ],
  };
}

// ---------------------------------------------------------------------------
// Completion cascade
// ---------------------------------------------------------------------------

/**
 * Complete a learning object inside a course and cascade completion upward:
 * an object completes when all of its children are complete, so completing a
 * topic may complete its lesson, module, and eventually the course. Emits a
 * workflow event per level newly completed.
 */
export function completeObjectInCourse(
  progress: readonly LearningProgressEntry[],
  course: LearningCourse,
  targetId: string,
  learnerUsername: string,
  actorUsername = learnerUsername,
  score?: number,
  completedAt = new Date().toISOString(),
): LearningWorkflowResult<LearningProgressEntry[]> {
  const target = findNodeInCourse(course, targetId);
  if (!target) return { state: [...progress], events: [] };

  let state: LearningProgressEntry[] = [...progress];
  const events: LearningWorkflowEvent[] = [];

  allDescendantIds(target.node).forEach((id) => {
    state = completeNode(state, nodeTypeOfNode(target.node), id, completedAt);
  });
  state = completeNode(state, target.nodeType, target.node.id, completedAt, score);

  const targetKind = nodeWorkflowKind(target.node);
  if (targetKind) {
    events.push(
      workflowEvent(
        targetKind,
        learnerUsername,
        actorUsername,
        { nodeType: target.nodeType, nodeId: target.node.id },
        `Completed ${target.nodeType}: ${target.node.title ?? target.node.id}`,
        completedAt,
      ),
    );
  }

  for (const ancestor of target.ancestors) {
    const ancestorType = nodeTypeOfNode(ancestor);
    const children = childrenOfNode(ancestor);
    const allChildrenComplete = children.every((child) => progressStateOf(state, nodeTypeOfNode(child), child.id) === 'completed');
    if (!allChildrenComplete) break;
    state = completeNode(state, ancestorType, ancestor.id, completedAt);
    const kind = nodeWorkflowKind(ancestor);
    if (kind) {
      events.push(
        workflowEvent(
          kind,
          learnerUsername,
          actorUsername,
          { nodeType: ancestorType, nodeId: ancestor.id },
          `Completed ${ancestorType}: ${ancestor.title ?? ancestor.id}`,
          completedAt,
        ),
      );
    }
  }

  return { state, events };
}

/** Convenience: complete a lesson (cascades to module/course). */
export function completeLesson(
  progress: readonly LearningProgressEntry[],
  course: LearningCourse,
  lessonIdValue: string,
  learnerUsername: string,
  actorUsername = learnerUsername,
  completedAt = new Date().toISOString(),
): LearningWorkflowResult<LearningProgressEntry[]> {
  return completeObjectInCourse(progress, course, lessonIdValue, learnerUsername, actorUsername, undefined, completedAt);
}

/** Convenience: complete a module (cascades to course). */
export function completeModule(
  progress: readonly LearningProgressEntry[],
  course: LearningCourse,
  moduleIdValue: string,
  learnerUsername: string,
  actorUsername = learnerUsername,
  completedAt = new Date().toISOString(),
): LearningWorkflowResult<LearningProgressEntry[]> {
  return completeObjectInCourse(progress, course, moduleIdValue, learnerUsername, actorUsername, undefined, completedAt);
}

/** Convenience: complete a topic (cascades to lesson/module/course). */
export function completeTopic(
  progress: readonly LearningProgressEntry[],
  course: LearningCourse,
  topicIdValue: string,
  learnerUsername: string,
  actorUsername = learnerUsername,
  completedAt = new Date().toISOString(),
): LearningWorkflowResult<LearningProgressEntry[]> {
  return completeObjectInCourse(progress, course, topicIdValue, learnerUsername, actorUsername, undefined, completedAt);
}

// ---------------------------------------------------------------------------
// Path, curriculum and programme progress
// ---------------------------------------------------------------------------

/** Complete a step of a personal learning path. */
export function completePathStep(
  progress: readonly LearningProgressEntry[],
  path: LearningPath,
  stepId: string,
  learnerUsername: string,
  actorUsername = learnerUsername,
  occurredAt = new Date().toISOString(),
): LearningWorkflowResult<LearningProgressEntry[]> {
  const step = path.items.find((item) => item.id === stepId);
  if (!step) return { state: [...progress], events: [] };
  const state = completeLearningObject(progress, step.ref.nodeType, step.ref.nodeId, occurredAt);
  return {
    state,
    events: [
      workflowEvent('path-progress', learnerUsername, actorUsername, step.ref, `Completed path step: ${step.title}`, occurredAt),
    ],
  };
}

/** Mark every course of a curriculum complete and report curriculum progress. */
export function completeCurriculum(
  progress: readonly LearningProgressEntry[],
  programme: LearningProgramme,
  curriculumIdValue: string,
  learnerUsername: string,
  actorUsername = learnerUsername,
  occurredAt = new Date().toISOString(),
): LearningWorkflowResult<LearningProgressEntry[]> {
  const curriculum = programme.curricula.find((c) => c.id === curriculumIdValue);
  if (!curriculum) return { state: [...progress], events: [] };
  let state: LearningProgressEntry[] = [...progress];
  const events: LearningWorkflowEvent[] = [];
  curriculum.courses.forEach((course) => {
    if (progressStateOf(state, 'course', course.id) !== 'completed') {
      state = completeNode(state, 'course', course.id, occurredAt);
    }
  });
  events.push(
    workflowEvent(
      'curriculum-progress',
      learnerUsername,
      actorUsername,
      { nodeType: 'curriculum', nodeId: curriculum.id },
      `Completed curriculum: ${curriculum.title}`,
      occurredAt,
    ),
  );
  const allCurriculaComplete = programme.curricula.every((c) =>
    c.courses.every((course) => progressStateOf(state, 'course', course.id) === 'completed'),
  );
  if (allCurriculaComplete) {
    events.push(
      workflowEvent(
        'programme-progress',
        learnerUsername,
        actorUsername,
        { nodeType: 'programme', nodeId: programme.id },
        `Completed programme: ${programme.title}`,
        occurredAt,
      ),
    );
  }
  return { state, events };
}

/** Mark every course of a programme complete. */
export function completeProgramme(
  progress: readonly LearningProgressEntry[],
  programme: LearningProgramme,
  learnerUsername: string,
  actorUsername = learnerUsername,
  occurredAt = new Date().toISOString(),
): LearningWorkflowResult<LearningProgressEntry[]> {
  let state: LearningProgressEntry[] = [...progress];
  programme.curricula.forEach((curriculum) => {
    curriculum.courses.forEach((course) => {
      if (progressStateOf(state, 'course', course.id) !== 'completed') {
        state = completeNode(state, 'course', course.id, occurredAt);
      }
    });
  });
  return {
    state,
    events: [
      workflowEvent(
        'programme-progress',
        learnerUsername,
        actorUsername,
        { nodeType: 'programme', nodeId: programme.id },
        `Completed programme: ${programme.title}`,
        occurredAt,
      ),
    ],
  };
}

// ---------------------------------------------------------------------------
// Research exercises and assessment lifecycle
// ---------------------------------------------------------------------------

/** Record progress on a research exercise assessment. */
export function submitResearchExercise(
  progress: readonly LearningProgressEntry[],
  assessment: LearningAssessment,
  score: number,
  learnerUsername: string,
  actorUsername = learnerUsername,
  occurredAt = new Date().toISOString(),
): LearningWorkflowResult<LearningProgressEntry[]> {
  const state = completeLearningObject(progress, 'assessment', assessment.id, occurredAt, score);
  const passed = isAssessmentPassing(assessment, score);
  return {
    state,
    events: [
      workflowEvent(
        'research-exercise-progress',
        learnerUsername,
        actorUsername,
        { nodeType: 'assessment', nodeId: assessment.id },
        `${passed ? 'Submitted' : 'Submitted (below pass mark)'} research exercise: ${assessment.title} (${score}%)`,
        occurredAt,
      ),
    ],
  };
}

/** Open an assessment attempt (sets the assessment in-progress). */
export function startAssessment(
  progress: readonly LearningProgressEntry[],
  assessment: LearningAssessment,
  learnerUsername: string,
  actorUsername = learnerUsername,
  occurredAt = new Date().toISOString(),
): LearningWorkflowResult<LearningProgressEntry[]> {
  const state = advanceProgress(progress, {
    nodeType: 'assessment',
    learningObjectId: assessment.id,
    state: 'in-progress',
    completedAt: occurredAt,
  });
  return {
    state,
    events: [
      workflowEvent('assessment', learnerUsername, actorUsername, { nodeType: 'assessment', nodeId: assessment.id }, `Started assessment: ${assessment.title}`, occurredAt),
    ],
  };
}

/** Submit an assessment result (passed or failed). */
export function submitAssessment(
  progress: readonly LearningProgressEntry[],
  assessment: LearningAssessment,
  score: number,
  learnerUsername: string,
  actorUsername = learnerUsername,
  occurredAt = new Date().toISOString(),
): LearningWorkflowResult<LearningProgressEntry[]> {
  const passed = isAssessmentPassing(assessment, score);
  const state = completeLearningObject(progress, 'assessment', assessment.id, occurredAt, score);
  return {
    state,
    events: [
      workflowEvent(
        'assessment',
        learnerUsername,
        actorUsername,
        { nodeType: 'assessment', nodeId: assessment.id },
        `${passed ? 'Passed' : 'Failed'} assessment: ${assessment.title} (${score}%, pass mark ${assessment.passMark}%)`,
        occurredAt,
      ),
    ],
  };
}

// ---------------------------------------------------------------------------
// Credential pipelines
// ---------------------------------------------------------------------------

/** Issue a certificate only when the course is fully completed. */
export function issueCertificateFor(
  progress: readonly LearningProgressEntry[],
  passport: LearningPassport,
  course: LearningCourse,
  input: {
    title: string;
    issuerUsername: string;
    issuerName: string;
    learnerUsername: string;
    learnerName: string;
  },
  occurredAt = new Date().toISOString(),
): LearningWorkflowResult<LearningPassport> {
  if (!isCourseCompleted(progress, course)) return { state: passport, events: [] };
  if (passport.certificates.some((certificate) => certificate.courseId === course.id)) {
    return { state: passport, events: [] };
  }
  const certificate = issueCertificate({ ...input, courseId: course.id, completedAt: occurredAt });
  const state: LearningPassport = {
    ...passport,
    certificates: [...passport.certificates, certificate],
    updatedAt: occurredAt,
  };
  return {
    state,
    events: [
      workflowEvent(
        'certificate',
        input.learnerUsername,
        input.issuerUsername,
        { nodeType: 'assessment', nodeId: certificate.id },
        `Certificate issued: ${certificate.title}`,
        occurredAt,
      ),
    ],
  };
}

/** Award a digital badge and append it to the passport. */
export function awardBadgeFor(
  passport: LearningPassport,
  input: {
    title: string;
    issuerUsername: string;
    issuerName: string;
    learnerUsername: string;
    learnerName: string;
    competencyKey?: string;
    imageUrl: string;
    standard?: string;
  },
  actorUsername = input.issuerUsername,
  occurredAt = new Date().toISOString(),
): LearningWorkflowResult<LearningPassport> {
  const badge = issueBadge(input);
  const state: LearningPassport = {
    ...passport,
    badges: [...passport.badges, badge],
    updatedAt: occurredAt,
  };
  return {
    state,
    events: [
      workflowEvent('badge', input.learnerUsername, actorUsername, { nodeType: 'badge', nodeId: badge.id }, `Badge earned: ${badge.title}`, occurredAt),
    ],
  };
}

/** Record a CPD entry on the learner passport. */
export function recordCpdFor(
  passport: LearningPassport,
  record: Omit<LearningCpdRecord, 'id' | 'kind' | 'issuedAt' | 'verificationReference' | 'status' | 'learnerUsername' | 'learnerName' | 'issuerUsername' | 'issuerName'>,
  learnerUsername = passport.learnerUsername,
  actorUsername = learnerUsername,
  occurredAt = new Date().toISOString(),
): LearningWorkflowResult<LearningPassport> {
  const state = addCpdRecord(passport, record);
  const latest = state.cpdRecords[state.cpdRecords.length - 1];
  return {
    state,
    events: [
      workflowEvent('cpd', learnerUsername, actorUsername, { nodeType: 'cpd', nodeId: latest.id }, `CPD recorded: ${record.activityTitle} (${record.hours} h)`, occurredAt),
    ],
  };
}

/** Touch the passport record (explicit passport update step). */
export function updatePassportFor(
  passport: LearningPassport,
  learnerUsername = passport.learnerUsername,
  actorUsername = learnerUsername,
  occurredAt = new Date().toISOString(),
): LearningWorkflowResult<LearningPassport> {
  return {
    state: { ...passport, updatedAt: occurredAt },
    events: [
      workflowEvent('passport', learnerUsername, actorUsername, { nodeType: 'passport', nodeId: passport.id }, `Passport updated`, occurredAt),
    ],
  };
}

/** Touch a portfolio record (explicit portfolio update step). */
export function updatePortfolioFor(
  portfolio: LearningPortfolio,
  learnerUsername: string,
  actorUsername = learnerUsername,
  occurredAt = new Date().toISOString(),
): LearningWorkflowResult<LearningPortfolio> {
  return {
    state: { ...portfolio, updatedAt: occurredAt },
    events: [
      workflowEvent('portfolio', learnerUsername, actorUsername, { nodeType: 'portfolio', nodeId: portfolio.id }, `Portfolio updated: ${portfolio.title}`, occurredAt),
    ],
  };
}

// ---------------------------------------------------------------------------
// Competency progression and goal completion
// ---------------------------------------------------------------------------

/** Advance an evidence level for a competency key (clamped to 1..5). */
export function advanceCompetencyFor(
  evidenceLevels: Record<string, number>,
  competencyKey: string,
  by = 1,
  learnerUsername: string,
  actorUsername = learnerUsername,
  occurredAt = new Date().toISOString(),
): LearningWorkflowResult<Record<string, number>> {
  const current = evidenceLevels[competencyKey] ?? 1;
  const next = Math.max(1, Math.min(5, current + by));
  const state = { ...evidenceLevels, [competencyKey]: next };
  return {
    state,
    events: [
      workflowEvent('competency', learnerUsername, actorUsername, undefined, `Competency ${competencyKey}: level ${current} → ${next}`, occurredAt),
    ],
  };
}

/** Complete (achieve) a learning goal. */
export function completeGoalFor(
  goals: readonly LearningGoal[],
  goalIdValue: string,
  learnerUsername: string,
  actorUsername = learnerUsername,
  occurredAt = new Date().toISOString(),
): LearningWorkflowResult<LearningGoal[]> {
  const goal = goals.find((candidate) => candidate.id === goalIdValue);
  if (!goal || goal.status === 'achieved') return { state: goals as LearningGoal[], events: [] };
  const updated = updateGoalStatus(goal, 'achieved');
  const state = goals.map((candidate) => (candidate.id === goalIdValue ? updated : candidate));
  return {
    state,
    events: [
      workflowEvent('goal-completion', learnerUsername, actorUsername, { nodeType: 'goal', nodeId: goal.id }, `Goal achieved: ${goal.statement}`, occurredAt),
    ],
  };
}
