import type {
  CompetencyFramework,
  LearningAcademy,
  LearningAdaptiveRecommendation,
  LearningAnalytics,
  LearningAssessment,
  LearningBadge,
  LearningCertificate,
  LearningCompetency,
  LearningCourse,
  LearningCpdRecord,
  LearningEvent,
  LearningFilter,
  LearningGoal,
  LearningInstitution,
  LearningKpis,
  LearningLesson,
  LearningMentor,
  LearningMentorship,
  LearningModule,
  LearningOutcome,
  LearningPath,
  LearningPathItem,
  LearningPassport,
  LearningPortfolio,
  LearningProgramme,
  LearningProgressEntry,
  LearningReadingList,
  LearningReadingPlaylist,
  LearningRubric,
  LearningSort,
  LearningStatistics,
  LearningTopic,
  LearningActivity,
  MentorshipStatus,
  PortfolioItem,
  PortfolioItemVisibility,
  ProgressState,
  RecommendationKind,
  GoalStatus,
} from '@/types/learning';

/**
 * Pure engine for the Scholatia Learning Ecosystem (SLE) — Phase 2.2G.3.
 *
 * This module is a side-effect-free library. It owns no records, never imports
 * React, and never mutates its inputs — every operation returns new values.
 * Derived counts (nodes, progress, analytics, competency attainment, gaps,
 * recommendations) are computed from the typed learning graph. Programmes,
 * curricula, courses, modules, lessons, topics, activities, assessments,
 * reading lists and playlists, competency frameworks, credentials, portfolios,
 * mentorship, events, and academies compose the SLE catalogue. Learners,
 * instructors, and mentors are canonical researcher usernames; institutions
 * are referenced by canonical ids (e.g. `INST-UI-001`).
 */

function slugOf(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function average(values: readonly number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

/** Canonical learning object id prefixes. */
export function courseId(label: string): string {
  return `crs-${slugOf(label)}`;
}

export function moduleId(label: string): string {
  return `mod-${slugOf(label)}`;
}

export function lessonId(label: string): string {
  return `les-${slugOf(label)}`;
}

export function topicId(label: string): string {
  return `top-${slugOf(label)}`;
}

export function activityId(label: string): string {
  return `act-${slugOf(label)}`;
}

export function programmeId(label: string): string {
  return `prg-${slugOf(label)}`;
}

export function curriculumId(label: string): string {
  return `cur-${slugOf(label)}`;
}

export function pathId(label: string): string {
  return `lpath-${slugOf(label)}`;
}

export function portfolioId(learnerUsername: string, kind: string): string {
  return `pf-${learnerUsername}-${kind}`;
}

export function goalId(label: string): string {
  return `goal-${slugOf(label)}`;
}

export function historyEntryId(label: string): string {
  return `hist-${slugOf(label)}`;
}

export function recommendationId(label: string): string {
  return `rec-${slugOf(label)}`;
}

export function certificateId(label: string): string {
  return `cert-${slugOf(label)}`;
}

export function badgeId(label: string): string {
  return `badge-${slugOf(label)}`;
}

export function cpdRecordId(label: string): string {
  return `cpd-${slugOf(label)}`;
}

export function academyId(label: string): string {
  return `aca-${slugOf(label)}`;
}

export function eventId(label: string): string {
  return `evt-${slugOf(label)}`;
}

/** Canonical learning slug. */
export function buildLearningSlug(label: string): string {
  return slugOf(label);
}

/** Canonical route to a learning object. */
export function learningObjectUrl(ref: { nodeType: string; nodeId: string }): string {
  switch (ref.nodeType) {
    case 'course':
    case 'microCourse':
      return `/learning/course/${ref.nodeId}`;
    case 'programme':
      return `/learning/programme/${ref.nodeId}`;
    case 'module':
    case 'lesson':
    case 'topic':
    case 'activity':
      return `/learning/courses?node=${ref.nodeType}:${ref.nodeId}`;
    default:
      return `/learning/${ref.nodeType}s/${ref.nodeId}`;
  }
}

// ---------------------------------------------------------------------------
// Construction
// ---------------------------------------------------------------------------

export type CreateCourseInput = {
  title: string;
  description: string;
  status?: LearningCourse['status'];
  courseKind?: LearningCourse['courseKind'];
  category?: string;
  level?: LearningCourse['level'];
  durationHours?: number;
  institutionId?: string;
  institutionName?: string;
  instructorUsername?: string;
  curriculumId?: string;
  outcomes?: LearningOutcome[];
  modules?: LearningModule[];
};

/** Build a course with canonical ids, slugs, and defaults. */
export function createCourse(input: CreateCourseInput): LearningCourse {
  const now = new Date().toISOString();
  const slug = buildLearningSlug(input.title);
  return {
    id: courseId(input.title),
    slug,
    title: input.title,
    description: input.description,
    status: input.status ?? 'published',
    courseKind: input.courseKind ?? 'standard',
    category: input.category ?? 'General Research Skills',
    level: input.level ?? 3,
    durationHours: input.durationHours ?? 8,
    institutionId: input.institutionId,
    institutionName: input.institutionName,
    instructorUsername: input.instructorUsername,
    curriculumId: input.curriculumId,
    outcomes: input.outcomes ?? [],
    modules: input.modules ?? [],
    createdAt: now,
    updatedAt: now,
  };
}

export type CreateProgrammeInput = {
  title: string;
  description: string;
  qualification: string;
  durationLabel: string;
  institutionId?: string;
  institutionName?: string;
  curricula?: LearningProgramme['curricula'];
};

/** Build a programme with canonical ids and defaults. */
export function createProgramme(input: CreateProgrammeInput): LearningProgramme {
  const now = new Date().toISOString();
  return {
    id: programmeId(input.title),
    slug: buildLearningSlug(input.title),
    title: input.title,
    description: input.description,
    qualification: input.qualification,
    durationLabel: input.durationLabel,
    institutionId: input.institutionId,
    institutionName: input.institutionName,
    curricula: input.curricula ?? [],
    createdAt: now,
    updatedAt: now,
  };
}

export type CreatePathInput = {
  title: string;
  description: string;
  ownerUsername: string;
  purpose: string;
  items?: LearningPathItem[];
  isPublic?: boolean;
};

/** Build a personal learning path. */
export function createPath(input: CreatePathInput): LearningPath {
  const now = new Date().toISOString();
  return {
    id: pathId(input.title),
    slug: buildLearningSlug(input.title),
    title: input.title,
    description: input.description,
    ownerUsername: input.ownerUsername,
    purpose: input.purpose,
    items: input.items ?? [],
    isPublic: input.isPublic ?? true,
    createdAt: now,
    updatedAt: now,
  };
}

export type CreatePortfolioInput = {
  learnerUsername: string;
  kind: LearningPortfolio['kind'];
  title: string;
  description: string;
};

/** Build an academic portfolio. */
export function createPortfolio(input: CreatePortfolioInput): LearningPortfolio {
  const now = new Date().toISOString();
  return {
    id: portfolioId(input.learnerUsername, input.kind),
    learnerUsername: input.learnerUsername,
    kind: input.kind,
    title: input.title,
    description: input.description,
    items: [],
    createdAt: now,
    updatedAt: now,
  };
}

/** Append an item to a portfolio (immutably). */
export function addPortfolioItem(portfolio: LearningPortfolio, item: PortfolioItem): LearningPortfolio {
  return {
    ...portfolio,
    items: [...portfolio.items, item],
    updatedAt: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

/** Validate a course, returning a list of issues (empty when sound). */
export function validateCourse(course: LearningCourse): string[] {
  const issues: string[] = [];
  if (!course.title.trim()) issues.push('Course title is required.');
  if (!course.description.trim()) issues.push('Course description is required.');
  if (course.durationHours <= 0) issues.push('Course duration must be positive.');
  if (course.modules.length === 0) issues.push('Course must contain at least one module.');
  return issues;
}

/** Validate a learning path, returning a list of issues. */
export function validatePath(path: LearningPath): string[] {
  const issues: string[] = [];
  if (!path.title.trim()) issues.push('Path title is required.');
  if (!path.purpose.trim()) issues.push('Path purpose is required.');
  if (path.items.length === 0) issues.push('Path must contain at least one item.');
  return issues;
}

/** Whether a score meets an assessment's pass mark. */
export function isAssessmentPassing(assessment: LearningAssessment, score: number): boolean {
  return score >= assessment.passMark;
}

/** Whether all prerequisite competencies are evidenced at a competent level. */
export function hasPrerequisites(competency: LearningCompetency, evidenceLevels: Record<string, number>): boolean {
  return competency.prerequisites.every((key) => (evidenceLevels[key] ?? 1) >= 3);
}

// ---------------------------------------------------------------------------
// Relationships
// ---------------------------------------------------------------------------

/** All courses nested inside a programme (across every curriculum). */
export function allCoursesInProgramme(programme: LearningProgramme): LearningCourse[] {
  return programme.curricula.flatMap((curriculum) => curriculum.courses);
}

/** Courses belonging to one curriculum of a programme. */
export function coursesInCurriculum(programme: LearningProgramme, curriculumIdValue: string): LearningCourse[] {
  return programme.curricula.find((curriculum) => curriculum.id === curriculumIdValue)?.courses ?? [];
}

/** Modules nested inside a course. */
export function modulesForCourse(course: LearningCourse): LearningModule[] {
  return course.modules;
}

/** Lessons nested inside a module. */
export function lessonsForModule(module: LearningModule): LearningLesson[] {
  return module.lessons;
}

/** Topics nested inside a lesson. */
export function topicsForLesson(lesson: LearningLesson): LearningTopic[] {
  return lesson.topics;
}

/** Activities nested inside a topic. */
export function activitiesForTopic(topic: LearningTopic): LearningActivity[] {
  return topic.activities;
}

/** Total nodes (course + modules + lessons + topics + activities) in a course. */
export function totalNodesInCourse(course: LearningCourse): number {
  return 1 + course.modules.reduce(
    (moduleSum, mod) =>
      moduleSum +
      1 +
      mod.lessons.reduce(
        (lessonSum, lesson) => lessonSum + 1 + lesson.topics.reduce((topicSum, topic) => topicSum + 1 + topic.activities.length, 0),
        0,
      ),
    0,
  );
}

/** Assessments attached to a course (directly, via its course id). */
export function assessmentsForCourse(assessments: readonly LearningAssessment[], course: LearningCourse): LearningAssessment[] {
  return assessments.filter((assessment) => assessment.learningObjectId === course.id);
}

/** Competencies linked to a course through its assessments. */
export function competenciesForCourse(framework: CompetencyFramework, course: LearningCourse, assessments: readonly LearningAssessment[]): LearningCompetency[] {
  const keys = new Set(
    assessmentsForCourse(assessments, course).flatMap((assessment) => assessment.competencyKeys),
  );
  return framework.competencies.filter((competency) => keys.has(competency.key));
}

/** Find a learning object (course or nested node) by reference. */
export function resolveLearningObject(
  courses: readonly LearningCourse[],
  ref: { nodeType: string; nodeId: string },
): LearningCourse | LearningModule | LearningLesson | LearningTopic | LearningActivity | undefined {
  const course = courses.find((candidate) => candidate.id === ref.nodeId || candidate.slug === ref.nodeId);
  if (course) return course;
  for (const candidate of courses) {
    for (const mod of candidate.modules) {
      if (mod.id === ref.nodeId) return mod;
      for (const lesson of mod.lessons) {
        if (lesson.id === ref.nodeId) return lesson;
        for (const topic of lesson.topics) {
          if (topic.id === ref.nodeId) return topic;
          const activity = topic.activities.find((item) => item.id === ref.nodeId);
          if (activity) return activity;
        }
      }
    }
  }
  return undefined;
}

/** Whether every reference in a path resolves to a real learning object. */
export function pathResolves(courses: readonly LearningCourse[], path: LearningPath): boolean {
  return path.items.every((item) => Boolean(resolveLearningObject(courses, item.ref)));
}

// ---------------------------------------------------------------------------
// Filtering and sorting
// ---------------------------------------------------------------------------

/** Filter the course catalogue. */
export function filterCourses(courses: readonly LearningCourse[], filter: LearningFilter = {}): LearningCourse[] {
  return courses.filter((course) => {
    if (filter.courseKind && course.courseKind !== filter.courseKind) return false;
    if (filter.status && course.status !== filter.status) return false;
    if (filter.level && course.level !== filter.level) return false;
    if (filter.category && course.category.toLowerCase() !== filter.category.toLowerCase()) return false;
    return true;
  });
}

/** Sort the course catalogue (progress-aware for `progress`). */
export function sortCourses(
  courses: readonly LearningCourse[],
  sort: LearningSort,
  progress: readonly LearningProgressEntry[] = [],
): LearningCourse[] {
  const sorted = [...courses];
  switch (sort) {
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'level':
      return sorted.sort((a, b) => a.level - b.level);
    case 'duration':
      return sorted.sort((a, b) => a.durationHours - b.durationHours);
    case 'progress':
      return sorted.sort((a, b) => courseProgress(progress, b).percent - courseProgress(progress, a).percent);
    case 'recent':
    default:
      return sorted.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }
}

/** Search courses across title, description, category, and nested node titles. */
export function searchCourses(courses: readonly LearningCourse[], query: string): LearningCourse[] {
  const term = query.trim().toLowerCase();
  if (!term) return [...courses];
  return courses.filter((course) => {
    const haystack = [
      course.title,
      course.description,
      course.category,
      course.institutionName ?? '',
      ...course.outcomes.map((outcome) => outcome.statement),
      ...course.modules.flatMap((module) => [
        module.title,
        ...module.lessons.flatMap((lesson) => [lesson.title, ...lesson.topics.flatMap((topic) => [topic.title, ...topic.activities.map((activity) => activity.title)])]),
      ]),
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(term);
  });
}

/** Search programmes across title, description, and qualification. */
export function filterProgrammes(programmes: readonly LearningProgramme[], query: string): LearningProgramme[] {
  const term = query.trim().toLowerCase();
  if (!term) return [...programmes];
  return programmes.filter((programme) =>
    [programme.title, programme.description, programme.qualification, programme.institutionName ?? '']
      .join(' ')
      .toLowerCase()
      .includes(term),
  );
}

/** Group courses by category, returning counts per category. */
export function coursesByCategory(courses: readonly LearningCourse[]): { category: string; count: number }[] {
  const counts = new Map<string, number>();
  courses.forEach((course) => counts.set(course.category, (counts.get(course.category) ?? 0) + 1));
  return [...counts.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

/** Courses of one kind (standard or micro). */
export function coursesByKind(courses: readonly LearningCourse[], courseKind: LearningCourse['courseKind']): LearningCourse[] {
  return courses.filter((course) => course.courseKind === courseKind);
}

// ---------------------------------------------------------------------------
// Permissions
// ---------------------------------------------------------------------------

/** Whether a learner may enrol in a course (published, not their own). */
export function canEnrolCourse(course: LearningCourse, username: string): boolean {
  return course.status !== 'archived' && username !== course.instructorUsername;
}

/** Whether a learner may view a course. */
export function canViewCourse(course: LearningCourse, username: string): boolean {
  return course.status !== 'draft' || username === course.instructorUsername;
}

/** Whether a user may manage a course. */
export function canManageCourse(course: LearningCourse, username: string): boolean {
  return username === course.instructorUsername;
}

/** Whether a user may assess learner work for a course. */
export function canAssess(_assessment: LearningAssessment, course: LearningCourse, username: string): boolean {
  return username === course.instructorUsername;
}

// ---------------------------------------------------------------------------
// Progress
// ---------------------------------------------------------------------------

/** The current state of a learning object within a learner's progress. */
export function progressStateOf(progress: readonly LearningProgressEntry[], nodeType: LearningProgressEntry['nodeType'], learningObjectId: string): ProgressState {
  return progress.find((entry) => entry.nodeType === nodeType && entry.learningObjectId === learningObjectId)?.state ?? 'not-started';
}

/** Add or update a progress entry (immutably). */
export function advanceProgress(progress: readonly LearningProgressEntry[], entry: LearningProgressEntry): LearningProgressEntry[] {
  const index = progress.findIndex(
    (candidate) => candidate.nodeType === entry.nodeType && candidate.learningObjectId === entry.learningObjectId,
  );
  if (index === -1) return [...progress, entry];
  const next = [...progress];
  next[index] = entry;
  return next;
}

/** Mark a learning object completed within a learner's progress. */
export function completeLearningObject(
  progress: readonly LearningProgressEntry[],
  nodeType: LearningProgressEntry['nodeType'],
  learningObjectId: string,
  completedAt = new Date().toISOString(),
  score?: number,
): LearningProgressEntry[] {
  return advanceProgress(progress, { nodeType, learningObjectId, state: 'completed', completedAt, score });
}

/** Aggregate progress across a course. */
export function courseProgress(progress: readonly LearningProgressEntry[], course: LearningCourse): {
  total: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  percent: number;
} {
  const total = totalNodesInCourse(course);
  const entries = [course, ...course.modules, ...course.modules.flatMap((module) => module.lessons), ...course.modules.flatMap((module) => module.lessons.flatMap((lesson) => lesson.topics)), ...course.modules.flatMap((module) => module.lessons.flatMap((lesson) => lesson.topics.flatMap((topic) => topic.activities)))];
  const ids = entries.map((node) => node.id);
  const completed = progress.filter((entry) => ids.includes(entry.learningObjectId) && entry.state === 'completed').length;
  const inProgress = progress.filter((entry) => ids.includes(entry.learningObjectId) && entry.state === 'in-progress').length;
  return {
    total,
    completed,
    inProgress,
    notStarted: total - completed - inProgress,
    percent: Math.round((completed / Math.max(1, total)) * 100),
  };
}

/** Aggregate progress across a learning path. */
export function pathProgress(progress: readonly LearningProgressEntry[], path: LearningPath): {
  total: number;
  completed: number;
  percent: number;
} {
  let total = 0;
  let completed = 0;
  path.items.forEach((item) => {
    total += 1;
    if (progress.some((entry) => entry.learningObjectId === item.ref.nodeId && entry.state === 'completed')) completed += 1;
  });
  return { total, completed, percent: Math.round((completed / Math.max(1, total)) * 100) };
}

/** Aggregate progress across every course in a programme. */
export function programmeProgress(progress: readonly LearningProgressEntry[], programme: LearningProgramme): {
  total: number;
  completed: number;
  percent: number;
} {
  let total = 0;
  let completed = 0;
  allCoursesInProgramme(programme).forEach((course) => {
    const courseProgressValue = courseProgress(progress, course);
    total += courseProgressValue.total;
    completed += courseProgressValue.completed;
  });
  return { total, completed, percent: Math.round((completed / Math.max(1, total)) * 100) };
}

/** Whether a learner has fully completed a course. */
export function isCourseCompleted(progress: readonly LearningProgressEntry[], course: LearningCourse): boolean {
  return courseProgress(progress, course).percent >= 100;
}

// ---------------------------------------------------------------------------
// Competency
// ---------------------------------------------------------------------------

/** Competencies in a domain. */
export function competenciesByDomain(framework: CompetencyFramework, domain: LearningCompetency['domain']): LearningCompetency[] {
  return framework.competencies.filter((competency) => competency.domain === domain);
}

/** A competency by its canonical key. */
export function competencyForKey(framework: CompetencyFramework, key: string): LearningCompetency | undefined {
  return framework.competencies.find((competency) => competency.key === key);
}

/** Derive evidence levels per competency key from completed assessments and activities. */
export function evidenceToLevels(progress: readonly LearningProgressEntry[], assessments: readonly LearningAssessment[]): Record<string, number> {
  const evidence: Record<string, number> = {};
  assessments.forEach((assessment) => {
    const entry = progress.find((candidate) => candidate.learningObjectId === assessment.learningObjectId);
    if (entry?.state === 'completed' && entry.score !== undefined && isAssessmentPassing(assessment, entry.score)) {
      assessment.competencyKeys.forEach((key) => {
        evidence[key] = (evidence[key] ?? 0) + 1;
      });
    }
  });
  const levels: Record<string, number> = {};
  Object.entries(evidence).forEach(([key, count]) => {
    levels[key] = clamp(1 + Math.floor(count / 2), 1, 5);
  });
  return levels;
}

/** Average attainment of target competency levels. */
export function competencyAttainment(framework: CompetencyFramework, evidenceLevels: Record<string, number>): number {
  if (framework.competencies.length === 0) return 0;
  const ratios = framework.competencies.map((competency) => {
    const current = evidenceLevels[competency.key] ?? 1;
    return clamp(current / competency.targetLevel, 0, 1);
  });
  return round(average(ratios) * 100);
}

/** Gap analysis between evidence and target levels. */
export function competencyGapAnalysis(framework: CompetencyFramework, evidenceLevels: Record<string, number>): {
  competency: LearningCompetency;
  currentLevel: number;
  targetLevel: number;
  gap: number;
  state: 'ahead' | 'at-par' | 'gap';
}[] {
  return framework.competencies.map((competency) => {
    const currentLevel = evidenceLevels[competency.key] ?? 1;
    const gap = competency.targetLevel - currentLevel;
    return {
      competency,
      currentLevel,
      targetLevel: competency.targetLevel,
      gap,
      state: gap < 0 ? 'ahead' : gap === 0 ? 'at-par' : 'gap',
    };
  });
}

// ---------------------------------------------------------------------------
// Credentials
// ---------------------------------------------------------------------------

/** Canonical verification reference for a credential. */
export function verificationReferenceFor(kind: LearningCredentialKind, id: string): string {
  return `SLA-${kind.toUpperCase()}-${id.toUpperCase()}`;
}

type LearningCredentialKind = 'certificate' | 'badge' | 'cpd';

/** Issue a course completion certificate. */
export function issueCertificate(input: {
  title: string;
  issuerUsername: string;
  issuerName: string;
  learnerUsername: string;
  learnerName: string;
  courseId: string;
  completedAt?: string;
}): LearningCertificate {
  const issuedAt = new Date().toISOString();
  const id = certificateId(`${input.courseId}-${input.learnerUsername}`);
  return {
    id,
    kind: 'certificate',
    title: input.title,
    issuerUsername: input.issuerUsername,
    issuerName: input.issuerName,
    learnerUsername: input.learnerUsername,
    learnerName: input.learnerName,
    issuedAt,
    verificationReference: verificationReferenceFor('certificate', id),
    status: 'issued',
    courseId: input.courseId,
    completedAt: input.completedAt ?? issuedAt,
  };
}

/** Issue a digital badge. */
export function issueBadge(input: {
  title: string;
  issuerUsername: string;
  issuerName: string;
  learnerUsername: string;
  learnerName: string;
  competencyKey?: string;
  imageUrl: string;
  standard?: string;
}): LearningBadge {
  const issuedAt = new Date().toISOString();
  const id = badgeId(`${input.title}-${input.learnerUsername}`);
  return {
    id,
    kind: 'badge',
    title: input.title,
    issuerUsername: input.issuerUsername,
    issuerName: input.issuerName,
    learnerUsername: input.learnerUsername,
    learnerName: input.learnerName,
    issuedAt,
    verificationReference: verificationReferenceFor('badge', id),
    status: 'issued',
    competencyKey: input.competencyKey,
    imageUrl: input.imageUrl,
    standard: input.standard,
  };
}

/** Append a CPD record to a passport (immutably). */
export function addCpdRecord(passport: LearningPassport, record: Omit<LearningCpdRecord, 'id' | 'kind' | 'issuedAt' | 'verificationReference' | 'status' | 'learnerUsername' | 'learnerName' | 'issuerUsername' | 'issuerName'>): LearningPassport {
  const issuedAt = new Date().toISOString();
  const id = cpdRecordId(`${record.activityTitle}-${passport.learnerUsername}`);
  const entry: LearningCpdRecord = {
    ...record,
    id,
    kind: 'cpd',
    issuerUsername: passport.learnerUsername,
    issuerName: passport.learnerUsername,
    learnerUsername: passport.learnerUsername,
    learnerName: passport.learnerUsername,
    issuedAt,
    verificationReference: verificationReferenceFor('cpd', id),
    status: 'issued',
  };
  return {
    ...passport,
    cpdRecords: [...passport.cpdRecords, entry],
    updatedAt: issuedAt,
  };
}

/** Verify a credential against a reference string. */
export function verifyCredential(credential: { verificationReference: string }, reference: string): boolean {
  return credential.verificationReference === reference;
}

/** All credentials held in a passport. */
export function credentialsForLearner(passport: LearningPassport): (LearningCertificate | LearningBadge | LearningCpdRecord)[] {
  return [...passport.certificates, ...passport.badges, ...passport.cpdRecords];
}

// ---------------------------------------------------------------------------
// Portfolio
// ---------------------------------------------------------------------------

/** A learner's portfolio of one kind. */
export function portfolioFor(portfolios: readonly LearningPortfolio[], learnerUsername: string, kind: LearningPortfolio['kind']): LearningPortfolio | undefined {
  return portfolios.find((portfolio) => portfolio.learnerUsername === learnerUsername && portfolio.kind === kind);
}

/** Share a portfolio item (immutably). */
export function sharePortfolioItem(portfolio: LearningPortfolio, itemId: string, visibility: PortfolioItemVisibility = 'shared'): LearningPortfolio {
  return {
    ...portfolio,
    items: portfolio.items.map((item) => (item.id === itemId ? { ...item, visibility } : item)),
    updatedAt: new Date().toISOString(),
  };
}

/** Revoke sharing of a portfolio item. */
export function revokePortfolioShare(portfolio: LearningPortfolio, itemId: string): LearningPortfolio {
  return sharePortfolioItem(portfolio, itemId, 'private');
}

/** Public items of a portfolio. */
export function publicItemsFor(portfolio: LearningPortfolio): PortfolioItem[] {
  return portfolio.items.filter((item) => item.visibility === 'public');
}

/** One-line textual summary of a portfolio. */
export function exportPortfolioSummary(portfolio: LearningPortfolio): string {
  return `${portfolio.title} — ${portfolio.items.length} item(s)`;
}

// ---------------------------------------------------------------------------
// Mentorship
// ---------------------------------------------------------------------------

/** Create a mentorship request. */
export function requestMentorship(input: {
  mentor: LearningMentor;
  menteeUsername: string;
  menteeName: string;
  kind: LearningMentor['kind'];
}): LearningMentorship {
  const now = new Date().toISOString();
  return {
    id: mentorshipId(input.menteeUsername, input.mentor.username),
    mentorUsername: input.mentor.username,
    mentorName: input.mentor.name,
    menteeUsername: input.menteeUsername,
    menteeName: input.menteeName,
    kind: input.kind,
    status: 'requested',
    milestones: [],
    createdAt: now,
    updatedAt: now,
  };
}

/** Canonical mentorship id. */
export function mentorshipId(menteeUsername: string, mentorUsername: string): string {
  return `mtr-${menteeUsername}-${mentorUsername}`;
}

/** Mentorships involving a user (as mentor or mentee). */
export function mentorshipsFor(mentorships: readonly LearningMentorship[], username: string): LearningMentorship[] {
  return mentorships.filter((mentorship) => mentorship.mentorUsername === username || mentorship.menteeUsername === username);
}

/** Recommend mentors by expertise overlap with goal statements. */
export function recommendMentors(mentors: readonly LearningMentor[], goals: readonly LearningGoal[], options: { top?: number } = {}): LearningMentor[] {
  const tokens = new Set(
    goals.flatMap((goal) => goal.statement.toLowerCase().match(/[a-z]+/g) ?? []),
  );
  const scored = mentors.map((mentor) => {
    const expertise = mentor.expertise.join(' ').toLowerCase();
    const overlap = [...tokens].filter((token) => expertise.includes(token)).length;
    return { mentor, score: overlap };
  });
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, options.top ?? 3)
    .map(({ mentor }) => mentor);
}

/** Update a mentorship status (immutably). */
export function updateMentorshipStatus(mentorship: LearningMentorship, status: MentorshipStatus): LearningMentorship {
  return {
    ...mentorship,
    status,
    startedAt: mentorship.startedAt ?? (status === 'active' ? new Date().toISOString() : mentorship.startedAt),
    updatedAt: new Date().toISOString(),
  };
}

/** Advance a mentorship milestone (immutably). */
export function advanceMilestone(mentorship: LearningMentorship, milestoneId: string, status: LearningMentorship['milestones'][number]['status']): LearningMentorship {
  return {
    ...mentorship,
    milestones: mentorship.milestones.map((milestone) => (milestone.id === milestoneId ? { ...milestone, status } : milestone)),
    updatedAt: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Analytics
// ---------------------------------------------------------------------------

/** Statistics across the whole SLE dataset. */
export function learningStatistics(data: {
  courses: readonly LearningCourse[];
  programmes: readonly LearningProgramme[];
  paths: readonly LearningPath[];
  assessments: readonly LearningAssessment[];
  rubrics: readonly LearningRubric[];
  readingLists: readonly LearningReadingList[];
  readingPlaylists: readonly LearningReadingPlaylist[];
  framework: CompetencyFramework;
  certificates: readonly LearningCertificate[];
  badges: readonly LearningBadge[];
  cpdRecords: readonly LearningCpdRecord[];
  mentors: readonly LearningMentor[];
  mentorships: readonly LearningMentorship[];
  academies: readonly LearningAcademy[];
  events: readonly LearningEvent[];
  goals: readonly LearningGoal[];
  learners: readonly string[];
  institutions: readonly LearningInstitution[];
  portfolios: readonly LearningPortfolio[];
}): LearningStatistics {
  const skills = new Set(data.framework.competencies.flatMap((competency) => competency.skills));
  const knowledgeAreas = new Set(data.framework.competencies.flatMap((competency) => competency.knowledgeAreas));
  return {
    totalProgrammes: data.programmes.length,
    totalCurricula: data.programmes.reduce((sum, programme) => sum + programme.curricula.length, 0),
    totalCourses: data.courses.length,
    totalMicroCourses: data.courses.filter((course) => course.courseKind === 'micro').length,
    totalModules: data.courses.reduce((sum, course) => sum + course.modules.length, 0),
    totalLessons: data.courses.reduce((sum, course) => sum + course.modules.reduce((moduleSum, mod) => moduleSum + mod.lessons.length, 0), 0),
    totalTopics: data.courses.reduce(
      (sum, course) => sum + course.modules.reduce((moduleSum, mod) => moduleSum + mod.lessons.reduce((lessonSum, lesson) => lessonSum + lesson.topics.length, 0), 0),
      0,
    ),
    totalActivities: data.courses.reduce(
      (sum, course) =>
        sum +
        course.modules.reduce(
          (moduleSum, mod) =>
            moduleSum +
            mod.lessons.reduce(
              (lessonSum, lesson) => lessonSum + lesson.topics.reduce((topicSum, topic) => topicSum + topic.activities.length, 0),
              0,
            ),
          0,
        ),
      0,
    ),
    totalAssessments: data.assessments.length,
    totalReadingLists: data.readingLists.length,
    totalReadingPlaylists: data.readingPlaylists.length,
    totalCompetencies: data.framework.competencies.length,
    totalSkills: skills.size,
    totalKnowledgeAreas: knowledgeAreas.size,
    totalRubrics: data.rubrics.length,
    totalCertificates: data.certificates.length,
    totalBadges: data.badges.length,
    totalCpdHours: data.cpdRecords.reduce((sum, record) => sum + record.hours, 0),
    totalMentors: data.mentors.length,
    totalMentorships: data.mentorships.length,
    totalAcademies: data.academies.length,
    totalEvents: data.events.length,
    totalPaths: data.paths.length,
    totalGoals: data.goals.length,
    totalLearners: data.learners.length,
    totalInstitutions: data.institutions.length,
    totalPortfolios: data.portfolios.length,
  };
}

/** Drop-off risk (0-100) of a course for a learner. */
export function dropOffRisk(progress: readonly LearningProgressEntry[], course: LearningCourse): number {
  const summary = courseProgress(progress, course);
  if (summary.total === 0 || summary.percent >= 100) return 0;
  const stalled = summary.inProgress;
  return Math.round(clamp((stalled / summary.total) * 100 + (100 - summary.percent) * 0.2, 0, 100));
}

/** Learning velocity (0-100) from completed nodes. */
export function learningVelocity(progress: readonly LearningProgressEntry[]): number {
  const completed = progress.filter((entry) => entry.state === 'completed').length;
  if (progress.length === 0) return 0;
  return Math.round(clamp((completed / progress.length) * 100, 0, 100));
}

/** Learner-scope KPIs derived from progress and the course catalogue. */
export function learningKpis(
  progress: readonly LearningProgressEntry[],
  courses: readonly LearningCourse[],
  assessments: readonly LearningAssessment[],
  framework: CompetencyFramework,
): LearningKpis {
  const enrolled = courses;
  const rates = enrolled.map((course) => courseProgress(progress, course).percent);
  const progressRate = round(average(rates));
  const completedCourses = enrolled.filter((course) => courseProgress(progress, course).percent >= 100).length;
  const completionRate = enrolled.length > 0 ? round((completedCourses / enrolled.length) * 100) : 0;
  const risks = enrolled.map((course) => dropOffRisk(progress, course));
  const dropOffRiskValue = round(average(risks));
  const engagementIndex = round(average(enrolled.map((course) => courseProgress(progress, course).percent)));
  const velocity = learningVelocity(progress);
  const attainment = competencyAttainment(framework, evidenceToLevels(progress, assessments));
  return {
    progressRate,
    completionRate,
    retentionRate: round(clamp(100 - dropOffRiskValue, 0, 100)),
    engagementIndex,
    learningVelocity: velocity,
    competencyAttainment: round(attainment),
    dropOffRisk: dropOffRiskValue,
    interventionCoverage: round(dropOffRiskValue > 0 ? Math.max(0, 100 - dropOffRiskValue) : 100),
  };
}

/** Build an analytics snapshot. */
export function buildLearningAnalytics(
  scope: LearningAnalytics['scope'],
  scopeId: string,
  kpis: LearningKpis,
  generatedAt = new Date().toISOString(),
  learnerUsername?: string,
): LearningAnalytics {
  return {
    scope,
    scopeId,
    learnerUsername,
    kpis,
    generatedAt,
    evidenceVersion: 'learning-ecosystem-v1',
  };
}

// ---------------------------------------------------------------------------
// Goals and adaptive recommendations
// ---------------------------------------------------------------------------

/** Create a learning goal. */
export function createGoal(input: {
  learnerUsername: string;
  statement: string;
  targetCompetencyKeys: string[];
}): LearningGoal {
  return {
    id: goalId(input.statement),
    learnerUsername: input.learnerUsername,
    statement: input.statement,
    targetCompetencyKeys: input.targetCompetencyKeys,
    status: 'active',
    createdAt: new Date().toISOString(),
  };
}

/** Update a goal status (immutably). */
export function updateGoalStatus(goal: LearningGoal, status: GoalStatus): LearningGoal {
  return { ...goal, status };
}

/** Recommend courses for a learner based on progress. */
export function recommendLearning(
  courses: readonly LearningCourse[],
  progress: readonly LearningProgressEntry[],
  options: { top?: number; learnerUsername?: string } = {},
): LearningAdaptiveRecommendation[] {
  const eligible = courses.filter((course) => course.status !== 'archived' && !isCourseCompleted(progress, course));
  const scored = eligible.map((course) => {
    const summary = courseProgress(progress, course);
    const recency = new Date(course.updatedAt).getTime();
    return {
      course,
      score: 50 + (summary.percent === 0 ? 30 : 100 - summary.percent) + (course.level <= 3 ? 20 : 0) + recency / 1e11,
    };
  });
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, options.top ?? 3)
    .map(({ course }) => ({
      id: recommendationId(`course-${course.id}`),
      learnerUsername: options.learnerUsername ?? 'ojuri',
      kind: 'course' as RecommendationKind,
      title: course.title,
      description: course.description,
      target: { nodeType: 'course', nodeId: course.id },
      reason: `${courseProgress(progress, course).percent}% complete — continue this course to build ${course.category.toLowerCase()} skills.`,
      applied: false,
      createdAt: new Date().toISOString(),
    }));
}

/** The single most valuable next course for a learner. */
export function nextBestCourse(courses: readonly LearningCourse[], progress: readonly LearningProgressEntry[]): LearningCourse | undefined {
  return recommendLearning(courses, progress, { top: 1 })[0]?.target
    ? courses.find((course) => course.id === recommendLearning(courses, progress, { top: 1 })[0]?.target?.nodeId)
    : undefined;
}

/** Recommendations for competency gaps behind a learner's goals. */
export function gapRecommendations(
  goals: readonly LearningGoal[],
  framework: CompetencyFramework,
  evidenceLevels: Record<string, number>,
  options: { learnerUsername?: string; top?: number } = {},
): LearningAdaptiveRecommendation[] {
  const keys = new Set(goals.flatMap((goal) => goal.targetCompetencyKeys));
  const gaps = framework.competencies.filter((competency) => keys.has(competency.key));
  const recommendations = gaps.flatMap((competency) => {
    const current = evidenceLevels[competency.key] ?? 1;
    if (current >= competency.targetLevel) return [];
    return [
      {
        id: recommendationId(`gap-${competency.key}`),
        learnerUsername: options.learnerUsername ?? 'ojuri',
        kind: 'competency-gap' as RecommendationKind,
        title: `Build ${competency.name}`,
        description: `Currently ${current} / ${competency.targetLevel} in ${competency.domain} — coursework and practice will close the gap.`,
        reason: `Goal targets ${competency.name} at level ${competency.targetLevel}, but evidence shows level ${current}.`,
        applied: false,
        createdAt: new Date().toISOString(),
      },
    ];
  });
  return recommendations.slice(0, options.top ?? 5);
}

/** Human-readable explanation of a recommendation. */
export function explainRecommendation(recommendation: LearningAdaptiveRecommendation): string {
  return `${recommendation.title} — ${recommendation.reason}`;
}
