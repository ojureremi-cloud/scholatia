'use client';

import { useCallback, useMemo, useState } from 'react';
import { LEARNING_HIGHLIGHT_CATEGORIES, LEARNING_ROLE_LABELS } from '@/types/learning';
import {
  CURRENT_LEARNING_USER,
  CURRENT_LEARNING_USER_NAME,
  DEFAULT_PROGRAMME,
  LEARNING_ACADEMIES,
  LEARNING_ANALYTICS,
  LEARNING_ANNOUNCEMENTS,
  LEARNING_ASSESSMENTS,
  LEARNING_BOOKMARKS,
  LEARNING_CATEGORIES,
  LEARNING_COMPETENCY_ATTAINMENT,
  LEARNING_COMPETENCY_EVIDENCE,
  LEARNING_COMPETENCY_GAPS,
  LEARNING_COMPETENCY_HISTORY,
  LEARNING_COURSES,
  LEARNING_DEADLINES,
  LEARNING_EVENTS,
  LEARNING_GAP_RECOMMENDATIONS,
  LEARNING_GOALS,
  LEARNING_HIGHLIGHTS,
  LEARNING_HISTORY,
  LEARNING_INSTITUTIONS,
  LEARNING_JOURNAL,
  LEARNING_KPIS,
  LEARNING_MENTORS,
  LEARNING_MENTORSHIPS,
  LEARNING_NOTES,
  LEARNING_PASSPORT,
  LEARNING_PATHS,
  LEARNING_PORTFOLIOS,
  LEARNING_PROGRAMMES,
  LEARNING_PROGRESS,
  LEARNING_READINGS,
  LEARNING_RECOMMENDATIONS,
  LEARNING_RECOMMENDED_MENTORS,
  LEARNING_RUBRICS,
  LEARNING_STATISTICS,
  READING_LISTS,
  READING_PLAYLISTS,
  SLE_COMPETENCY_FRAMEWORK,
} from '@/constants/placeholder-learning';
import { RESEARCHERS } from '@/constants/placeholder-researchers';
import {
  addPortfolioItem,
  advanceProgress,
  allCoursesInProgramme,
  assessmentsForCourse as assessmentsForCourseEngine,
  buildLearningSlug,
  completeLearningObject,
  competenciesForCourse,
  courseProgress,
  coursesInCurriculum,
  filterCourses,
  isAssessmentPassing,
  pathProgress,
  programmeProgress,
  requestMentorship,
  resolveLearningObject,
  revokePortfolioShare,
  searchCourses,
  sharePortfolioItem,
  sortCourses,
  totalNodesInCourse,
  updateGoalStatus,
  updateMentorshipStatus,
} from '@/lib/learning';
import {
  completionRate,
  competencyPercentage,
  departmentStatistics,
  engagementIndex,
  facultyStatistics,
  institutionStatistics,
  learnerAnalytics,
  mentorshipActivity,
  organisationUnit,
  programmeStatistics,
} from '@/lib/learning-analytics';
import {
  DEFAULT_NOTIFICATION_PRIORITY,
  learningNotificationEvent,
  learningNotificationSummary,
  notificationsFromWorkflow,
} from '@/lib/learning-notifications';
import {
  LEARNING_PERMISSION_MATRIX,
  canAction,
  highestRole,
  permissionGrantsFor,
  roleAssignmentId,
  rolesForUser,
} from '@/lib/learning-permissions';
import type { LearningPermissionGrant } from '@/lib/learning-permissions';
import { updatePortfolio as updatePortfolioEntry } from '@/lib/learning-portfolio';
import { recommendCourses as recommendCoursesEngine, recommendMentorsFor } from '@/lib/learning-recommendations';
import {
  learningValidationReport,
  validateLearningAssessment,
  validateLearningCourse,
  validateLearningInstitution,
  validateLearningMentorship,
  validateLearningPortfolio,
  validateLearningProgramme,
  validateLearningRubric,
} from '@/lib/learning-validation';
import {
  awardBadgeFor,
  completeObjectInCourse,
  enrol as enrolInCourse,
  issueCertificateFor,
  recordCpdFor,
  withdraw as withdrawFromCourse,
  workflowEventSummary,
} from '@/lib/learning-workflows';
import type {
  AcademyKind,
  AnalyticsScope,
  AssessmentKind,
  CompetencyDomain,
  CourseKind,
  GoalStatus,
  KnowledgeArea,
  LearningAcademy,
  LearningAction,
  LearningAdaptiveRecommendation,
  LearningAnnouncement,
  LearningAssessment,
  LearningBadge,
  LearningBookmark,
  LearningBookmarkKind,
  LearningCertificate,
  LearningCompetency,
  LearningCompetencyHistoryEntry,
  LearningCourse,
  LearningCpdRecord,
  LearningCurriculum,
  LearningDeadline,
  LearningEvent,
  LearningEventObjectRef,
  LearningFilter,
  LearningGoal,
  LearningGoalProgressStat,
  LearningHighlight,
  LearningHighlightCategory,
  LearningHistoryEntry,
  LearningHistoryEventType,
  LearningInstitution,
  LearningJournalEntry,
  LearningKpis,
  LearningLearnerAnalytics,
  LearningLesson,
  LearningMentor,
  LearningMentorship,
  LearningMentorshipActivityStat,
  LearningModule,
  LearningNodeType,
  LearningNote,
  LearningNotificationEvent,
  LearningNotificationKind,
  LearningNotificationPriority,
  LearningOrganisationalUnit,
  LearningOrganisationStatistics,
  LearningPassport,
  LearningPath,
  LearningPermissionDecision,
  LearningPortfolio,
  LearningProgramme,
  LearningProgressEntry,
  LearningReading,
  LearningReadingList,
  LearningReadingPlaylist,
  LearningRecommendationOptions,
  LearningResourceKind,
  LearningRole,
  LearningRoleAssignment,
  LearningRubric,
  LearningSort,
  LearningStatistics,
  LearningValidationReport,
  LearningWorkflowEvent,
  LearningWorkflowKind,
  MentorshipMilestone,
  MentorshipStatus,
  PortfolioItem,
  PortfolioItemVisibility,
  ProgressState,
  Skill,
} from '@/types/learning';

type CourseProgressShape = {
  total: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  percent: number;
};

export type LearningTimelineEntry = {
  id: string;
  source: 'history' | 'workflow';
  kind: LearningHistoryEventType | LearningWorkflowKind;
  detail: string;
  occurredAt: string;
  objectRef?: LearningEventObjectRef;
};

export type LearningRecommendationView = {
  id: string;
  kind: string;
  source: 'adaptive' | 'gap' | 'engine';
  title: string;
  description: string;
  reason: string;
  score: number;
  applied: boolean;
  createdAt: string;
  mutable: boolean;
  target?: LearningEventObjectRef;
};

export type LearningDashboardModel = {
  learner: { username: string; name: string };
  statistics: LearningStatistics;
  kpis: LearningKpis;
  analytics: LearningLearnerAnalytics;
  ongoing: { course: LearningCourse; progress: CourseProgressShape }[];
  completed: { course: LearningCourse; progress: CourseProgressShape }[];
  myPaths: LearningPath[];
  goals: LearningGoal[];
  events: LearningEvent[];
  passport: LearningPassport;
  notifications: LearningNotificationEvent[];
  notificationSummary: ReturnType<typeof learningNotificationSummary>;
  timeline: LearningTimelineEntry[];
};

export type LearningWorkspaceModel = {
  learner: { username: string; name: string };
  current:
    | {
        course: LearningCourse;
        module: LearningModule | undefined;
        lesson: LearningLesson | undefined;
        progress: CourseProgressShape;
      }
    | undefined;
  programme: LearningProgramme | undefined;
  path: LearningPath | undefined;
  recentActivity: LearningTimelineEntry[];
  resume: { course: LearningCourse; progress: CourseProgressShape }[];
  pinnedResources: LearningBookmark[];
  deadlines: LearningDeadline[];
  recommendations: LearningRecommendationView[];
  statistics: LearningStatistics;
};

export type LearningReadingModel = {
  current: LearningReading | undefined;
  recentlyOpened: LearningReading[];
  saved: LearningReading[];
  research: LearningReading[];
  course: LearningReading[];
  progress: number;
  estimatedCompletionMinutes: number;
  lists: LearningReadingList[];
  playlists: LearningReadingPlaylist[];
  aiSuggestions: { title: string; description: string }[];
};

export type LearningNotesModel = {
  notes: LearningNote[];
  pinned: LearningNote[];
  recent: LearningNote[];
};

export type LearningHighlightsModel = {
  highlights: LearningHighlight[];
  categories: readonly LearningHighlightCategory[];
  byCategory: Record<LearningHighlightCategory, LearningHighlight[]>;
  colours: Record<LearningHighlightCategory, string>;
};

export type LearningBookmarksModel = {
  bookmarks: LearningBookmark[];
  pinned: LearningBookmark[];
  byKind: Record<LearningBookmarkKind, LearningBookmark[]>;
};

export type LearningJournalModel = {
  entries: LearningJournalEntry[];
  daily: LearningJournalEntry[];
  reflections: LearningJournalEntry[];
  weekly: LearningJournalEntry[];
  monthly: LearningJournalEntry[];
  research: LearningJournalEntry[];
  recent: LearningJournalEntry[];
};

export type LearningPortfolioWorkspaceModel = {
  portfolios: LearningPortfolio[];
  certificates: LearningCertificate[];
  badges: LearningBadge[];
  researchOutputs: PortfolioItem[];
  teachingActivities: PortfolioItem[];
  mentorship: LearningMentorship[];
  projects: PortfolioItem[];
  completion: number;
};

export type LearningPassportWorkspaceModel = {
  passport: LearningPassport;
  certificates: LearningCertificate[];
  badges: LearningBadge[];
  cpdRecords: LearningCpdRecord[];
  timeline: {
    id: string;
    kind: 'certificate' | 'badge' | 'cpd';
    title: string;
    issuerName: string;
    issuedAt: string;
    verificationReference: string;
  }[];
  achievements: { certificates: number; badges: number; cpdRecords: number; cpdHours: number };
  verification: { title: string; reference: string; status: string }[];
};

export type LearningGoalTrackerModel = {
  goals: LearningGoalProgressStat[];
  active: LearningGoal[];
  completedCount: number;
  activeCount: number;
  averageProgress: number;
  recommendations: LearningRecommendationView[];
};

export type LearningCompetencyRadarModel = {
  competencies: {
    key: string;
    name: string;
    domain: CompetencyDomain;
    currentLevel: number;
    targetLevel: number;
    gap: number;
    growth: number;
    state: 'gap' | 'at-par' | 'ahead';
  }[];
  attainment: number;
  history: LearningCompetencyHistoryEntry[];
  recommendations: LearningRecommendationView[];
};

export type LearningStudentHomeModel = {
  learner: { username: string; name: string };
  resume: { course: LearningCourse; progress: CourseProgressShape }[];
  recentLearning: LearningTimelineEntry[];
  currentCourses: { course: LearningCourse; progress: CourseProgressShape }[];
  currentPaths: LearningPath[];
  goals: LearningGoal[];
  competencies: LearningCompetencyRadarModel;
  certificates: LearningCertificate[];
  reading: LearningReading[];
  portfolio: LearningPortfolio[];
  events: LearningEvent[];
  announcements: LearningAnnouncement[];
  recommendations: LearningRecommendationView[];
};

// ---------------------------------------------------------------------------
// Wave 4 — Academic & Institutional Learning Operations
// ---------------------------------------------------------------------------

export type LearningGradebookRow = {
  assessment: LearningAssessment;
  course: LearningCourse | undefined;
  rubric: LearningRubric | undefined;
  score: number | undefined;
  state: ProgressState;
  passed: boolean;
};

export type LearningEducatorCourseRow = {
  course: LearningCourse;
  progress: CourseProgressShape;
  assessmentCount: number;
  competencies: LearningCompetency[];
  instructor: string;
  instructorName: string;
  institution: string;
};

export type LearningTeachingLoadRow = {
  instructor: string;
  instructorName: string;
  courseCount: number;
  learners: number;
};

export type LearningEducatorModel = {
  learner: { username: string; name: string };
  courses: LearningEducatorCourseRow[];
  teachingLoad: LearningTeachingLoadRow[];
  gradebook: LearningGradebookRow[];
  moderation: LearningGradebookRow[];
  feedbackQueue: LearningGradebookRow[];
  statistics: LearningStatistics;
  analytics: LearningLearnerAnalytics;
};

export type LearningMentorWorkspaceModel = {
  learner: { username: string; name: string };
  mentorships: LearningMentorship[];
  asMentor: LearningMentorship[];
  asMentee: LearningMentorship[];
  requests: LearningMentorship[];
  active: LearningMentorship[];
  agenda: { mentorship: LearningMentorship; milestone: MentorshipMilestone }[];
  weeklyChecks: { mentorship: LearningMentorship; milestone: MentorshipMilestone; progress: number }[];
  menteePortfolios: { mentee: string; menteeName: string; portfolios: LearningPortfolio[]; coverage: number }[];
  activity: LearningMentorshipActivityStat[];
  statistics: LearningStatistics;
};

export type LearningProgrammeRow = {
  programme: LearningProgramme;
  courseCount: number;
  curriculaCount: number;
  completion: number;
  percent: number;
  analytics: LearningOrganisationStatistics | undefined;
};

export type LearningCurriculumRow = {
  programme: LearningProgramme;
  curriculum: LearningCurriculum;
  courses: LearningCourse[];
  totalNodes: number;
  completedNodes: number;
  completion: number;
};

export type LearningProgrammeManagerModel = {
  programmes: LearningProgrammeRow[];
  curricula: LearningCurriculumRow[];
  analytics: LearningOrganisationStatistics[];
  workflows: { kind: LearningWorkflowKind; count: number }[];
  progression: { programme: LearningProgramme; percent: number; completed: number; total: number }[];
  approvals: LearningPermissionDecision[];
  statistics: LearningStatistics;
};

export type LearningCurriculumModel = {
  curricula: LearningCurriculumRow[];
  courseMap: { course: LearningCourse; placements: { programme: string; curriculum: string }[] }[];
  competencies: LearningCompetency[];
  skills: Skill[];
  knowledgeAreas: KnowledgeArea[];
  statistics: LearningStatistics;
};

export type LearningAssessmentManagerModel = {
  assessments: LearningGradebookRow[];
  byKind: Record<AssessmentKind, LearningGradebookRow[]>;
  rubrics: LearningRubric[];
  assignment: { course: LearningCourse; assessments: LearningAssessment[] }[];
  results: LearningGradebookRow[];
  statistics: LearningStatistics;
};

export type LearningInstitutionRow = {
  institution: LearningInstitution;
  courseCount: number;
  learnerCount: number;
  analytics: LearningOrganisationStatistics | undefined;
  academies: LearningAcademy[];
};

export type LearningInstitutionModel = {
  institutions: LearningInstitutionRow[];
  analytics: LearningOrganisationStatistics[];
  kpis: LearningKpis;
  statistics: LearningStatistics;
};

export type LearningUnitRow = {
  unit: LearningOrganisationalUnit;
  analytics: LearningOrganisationStatistics;
  courses: LearningCourse[];
};

export type LearningFacultyModel = {
  faculties: LearningUnitRow[];
  analytics: LearningOrganisationStatistics[];
  kpis: LearningKpis;
  statistics: LearningStatistics;
};

export type LearningDepartmentModel = {
  departments: LearningUnitRow[];
  analytics: LearningOrganisationStatistics[];
  kpis: LearningKpis;
  statistics: LearningStatistics;
};

export type LearningAcademyRow = {
  academy: LearningAcademy;
  members: string[];
  memberCount: number;
  events: LearningEvent[];
  eventCount: number;
  registrations: number;
  kind: AcademyKind;
};

export type LearningAcademyModel = {
  academies: LearningAcademyRow[];
  statistics: LearningStatistics;
};

export type LearningCohortRow = {
  learner: string;
  learnerName: string;
  role: LearningRole;
  courses: number;
  mentorships: number;
  completion: number;
  competency: number;
  engagement: number;
};

export type LearningAnalyticsCentreModel = {
  learner: LearningLearnerAnalytics;
  kpis: LearningKpis;
  scopes: AnalyticsScope[];
  cohort: LearningCohortRow[];
  programme: LearningOrganisationStatistics[];
  institution: LearningOrganisationStatistics[];
  faculty: LearningOrganisationStatistics[];
  department: LearningOrganisationStatistics[];
  academy: LearningAcademyRow[];
  generatedAt: string;
};

export type LearningAdministrationModel = {
  roles: { role: LearningRole; label: string; grants: number }[];
  grants: LearningPermissionGrant[];
  matrix: { role: LearningRole; resource: LearningResourceKind; actions: readonly LearningAction[] }[];
  assignments: LearningRoleAssignment[];
  workflows: { kind: LearningWorkflowKind; count: number; total: number }[];
  validation: { target: string; report: LearningValidationReport }[];
  notifications: { kind: LearningNotificationKind; priority: LearningNotificationPriority; count: number }[];
  statistics: LearningStatistics;
};

const HIGHLIGHT_COLOURS: Record<LearningHighlightCategory, string> = {
  methodology: '#f59e0b',
  finding: '#0ea5e9',
  definition: '#6366f1',
  citation: '#ec4899',
  insight: '#10b981',
  'follow-up': '#8b5cf6',
};

function toRecommendationView(
  recommendation: LearningAdaptiveRecommendation,
  source: 'adaptive' | 'gap',
): LearningRecommendationView {
  return {
    id: recommendation.id,
    kind: recommendation.kind,
    source,
    title: recommendation.title,
    description: recommendation.description,
    reason: recommendation.reason,
    score: 0,
    applied: recommendation.applied,
    createdAt: recommendation.createdAt,
    mutable: source === 'adaptive',
    target: recommendation.target,
  };
}

function firstIncompleteLesson(course: LearningCourse, completedLessonIds: Set<string>): { module: LearningModule; lesson: LearningLesson } | undefined {
  for (const moduleEntry of course.modules) {
    for (const lessonEntry of moduleEntry.lessons) {
      if (!completedLessonIds.has(lessonEntry.id)) {
        return { module: moduleEntry, lesson: lessonEntry };
      }
    }
  }
  return undefined;
}

function growthOf(history: LearningCompetencyHistoryEntry[], competencyKey: string): number {
  const snapshots = history
    .filter((entry) => entry.competencyKey === competencyKey)
    .sort((a, b) => a.at.localeCompare(b.at));
  if (snapshots.length < 2) return 0;
  return snapshots[snapshots.length - 1].level - snapshots[0].level;
}

// ---------------------------------------------------------------------------
// Wave 4 — module-scope helpers (no component/state duplication)
// ---------------------------------------------------------------------------

const RESEARCHER_NAMES: Record<string, string> = Object.fromEntries(
  RESEARCHERS.map((researcher) => [researcher.username, researcher.displayName]),
);

function nameFor(username: string): string {
  return RESEARCHER_NAMES[username] ?? username;
}

const HISTORY_WORKFLOW_KIND: Record<LearningHistoryEventType, LearningWorkflowKind> = {
  enrolled: 'enrolment',
  'path-started': 'path-progress',
  'lesson-viewed': 'lesson-completion',
  'activity-completed': 'topic-completion',
  'assessment-passed': 'assessment',
  'assessment-failed': 'assessment',
  'reflection-added': 'portfolio',
  'course-completed': 'course-completion',
  'certificate-issued': 'certificate',
  'badge-earned': 'badge',
  'mentorship-started': 'portfolio',
  'cpd-recorded': 'cpd',
};

const HISTORY_NOTIFICATION_KIND: Record<LearningHistoryEventType, LearningNotificationKind> = {
  enrolled: 'enrolment',
  'path-started': 'enrolment',
  'lesson-viewed': 'completion',
  'activity-completed': 'completion',
  'assessment-passed': 'assessment',
  'assessment-failed': 'assessment',
  'reflection-added': 'portfolio-updated',
  'course-completed': 'completion',
  'certificate-issued': 'certification',
  'badge-earned': 'badge',
  'mentorship-started': 'mentorship',
  'cpd-recorded': 'passport-updated',
};

const DEFAULT_ROLE_ASSIGNMENTS: LearningRoleAssignment[] = [
  { id: roleAssignmentId('ojuri', 'student'), username: 'ojuri', role: 'student', scopeType: 'platform', grantedAt: '2026-03-18T09:00:00.000Z' },
  { id: roleAssignmentId('ojuri', 'researcher'), username: 'ojuri', role: 'researcher', scopeType: 'institution', scopeId: 'INST-UI-001', grantedAt: '2026-03-18T09:00:00.000Z' },
  { id: roleAssignmentId('smith', 'lecturer'), username: 'smith', role: 'lecturer', scopeType: 'institution', scopeId: 'INST-UI-001', grantedAt: '2026-03-18T09:00:00.000Z' },
  { id: roleAssignmentId('smith', 'supervisor'), username: 'smith', role: 'supervisor', scopeType: 'programme', scopeId: DEFAULT_PROGRAMME.id, grantedAt: '2026-03-18T09:00:00.000Z' },
  { id: roleAssignmentId('adebayo', 'mentor'), username: 'adebayo', role: 'mentor', scopeType: 'platform', grantedAt: '2026-05-02T09:00:00.000Z' },
  { id: roleAssignmentId('tanaka', 'mentor'), username: 'tanaka', role: 'mentor', scopeType: 'platform', grantedAt: '2026-06-10T09:00:00.000Z' },
  { id: roleAssignmentId('maria', 'lecturer'), username: 'maria', role: 'lecturer', scopeType: 'institution', scopeId: 'INST-UI-001', grantedAt: '2026-03-18T09:00:00.000Z' },
  { id: roleAssignmentId('okonkwo', 'lecturer'), username: 'okonkwo', role: 'lecturer', scopeType: 'institution', scopeId: 'INST-UG-004', grantedAt: '2026-03-18T09:00:00.000Z' },
  { id: roleAssignmentId('dube', 'lecturer'), username: 'dube', role: 'lecturer', scopeType: 'institution', scopeId: 'INST-UI-001', grantedAt: '2026-03-18T09:00:00.000Z' },
];

function assessmentsLinkedTo(course: LearningCourse, assessments: readonly LearningAssessment[]): LearningAssessment[] {
  return assessments.filter((assessment) => {
    if (assessment.learningObjectId === course.id) return true;
    return resolveLearningObject([course], { nodeType: 'activity', nodeId: assessment.learningObjectId }) !== undefined;
  });
}

function courseForAssessment(courses: readonly LearningCourse[], assessment: LearningAssessment): LearningCourse | undefined {
  return (
    courses.find((course) => course.id === assessment.learningObjectId) ??
    courses.find((course) => resolveLearningObject([course], { nodeType: 'activity', nodeId: assessment.learningObjectId }) !== undefined)
  );
}

function milestoneProgress(milestones: readonly MentorshipMilestone[]): number {
  const achieved = milestones.filter((milestone) => milestone.status === 'achieved').length;
  return Math.round((achieved / Math.max(1, milestones.length)) * 100);
}

function curriculumCompletionStats(
  courses: readonly LearningCourse[],
  progress: readonly LearningProgressEntry[],
): { totalNodes: number; completedNodes: number; completion: number } {
  const totalNodes = courses.reduce((sum, course) => sum + totalNodesInCourse(course), 0);
  const completedNodes = courses.reduce((sum, course) => sum + courseProgress(progress, course).completed, 0);
  return { totalNodes, completedNodes, completion: Math.round((completedNodes / Math.max(1, totalNodes)) * 100) };
}

function retroactiveWorkflowEvents(): LearningWorkflowEvent[] {
  return LEARNING_HISTORY.map((entry) => ({
    id: `rf-${entry.id}`,
    kind: HISTORY_WORKFLOW_KIND[entry.eventType],
    learnerUsername: entry.learnerUsername,
    actorUsername: entry.learnerUsername,
    objectRef: entry.objectRef,
    detail: entry.detail,
    occurredAt: entry.occurredAt,
  }));
}

function retroactiveNotificationEvents(): LearningNotificationEvent[] {
  return LEARNING_HISTORY.map((entry) =>
    learningNotificationEvent(
      HISTORY_NOTIFICATION_KIND[entry.eventType],
      entry.learnerUsername,
      [entry.learnerUsername],
      entry.detail ?? entry.eventType,
      entry.objectRef,
      entry.occurredAt,
    ),
  );
}

export default function useLearning() {
  const allCourses = LEARNING_COURSES;
  const allProgrammes = LEARNING_PROGRAMMES;
  const allPaths = LEARNING_PATHS;
  const [portfolios, setPortfolios] = useState(LEARNING_PORTFOLIOS);
  const [mentorships, setMentorships] = useState(LEARNING_MENTORSHIPS);
  const [goals, setGoals] = useState(LEARNING_GOALS);
  const [progress, setProgress] = useState<LearningProgressEntry[]>(LEARNING_PROGRESS);
  const [adaptiveRecommendations, setAdaptiveRecommendations] = useState(LEARNING_RECOMMENDATIONS);
  const [passport, setPassport] = useState<LearningPassport>(LEARNING_PASSPORT);
  const [workflowEvents, setWorkflowEvents] = useState<LearningWorkflowEvent[]>([]);
  const [readingLists, setReadingLists] = useState<LearningReadingList[]>(READING_LISTS);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | string>('all');
  const [courseKind, setCourseKind] = useState<'all' | CourseKind>('all');
  const [domain, setDomain] = useState<'all' | CompetencyDomain>('all');
  const [sort, setSort] = useState<LearningSort>('recent');
  const [scope, setScope] = useState<AnalyticsScope>('learner');

  const learner = useMemo(() => ({ username: CURRENT_LEARNING_USER, name: CURRENT_LEARNING_USER_NAME }), []);

  const searchResults = useMemo(() => (query.trim() ? searchCourses(allCourses, query) : []), [query, allCourses]);

  const myPaths = useMemo(() => allPaths.filter((path) => path.ownerUsername === learner.username), [allPaths, learner]);

  const statisticsData = useMemo(() => LEARNING_STATISTICS, []);
  const kpis = useMemo(() => LEARNING_KPIS, []);
  const analytics = useMemo(() => LEARNING_ANALYTICS, []);
  const mentors = useMemo(() => LEARNING_MENTORS, []);
  const recommendedMentors = useMemo(() => LEARNING_RECOMMENDED_MENTORS, []);
  const academies = useMemo(() => LEARNING_ACADEMIES, []);
  const events = useMemo(() => LEARNING_EVENTS, []);
  const categories = useMemo(() => LEARNING_CATEGORIES, []);
  const competencyGaps = useMemo(() => LEARNING_COMPETENCY_GAPS, []);
  const competencyAttainment = useMemo(() => LEARNING_COMPETENCY_ATTAINMENT, []);
  const evidenceLevels = useMemo(() => LEARNING_COMPETENCY_EVIDENCE, []);
  const gapRecommendations = useMemo(() => LEARNING_GAP_RECOMMENDATIONS, []);

  const progressOf = useCallback((course: LearningCourse) => courseProgress(progress, course), [progress]);

  const pathProgressOf = useCallback(
    (pathId: string) => {
      const foundPath = allPaths.find((entry) => entry.id === pathId);
      return foundPath ? pathProgress(progress, foundPath) : { total: 0, completed: 0, percent: 0 };
    },
    [allPaths, progress],
  );

  const courses = useCallback(() => {
    const filter: LearningFilter = {
      category: category === 'all' ? undefined : category,
      courseKind: courseKind === 'all' ? undefined : courseKind,
      status: 'published',
    };
    return sortCourses(filterCourses(allCourses, filter), sort, progress);
  }, [allCourses, category, courseKind, sort, progress]);

  const course = useCallback((slug: string) => allCourses.find((entry) => entry.slug === slug), [allCourses]);

  const programmes = useCallback(() => allProgrammes, [allProgrammes]);

  const programme = useCallback((slug: string) => allProgrammes.find((entry) => entry.slug === slug), [allProgrammes]);

  const paths = useCallback(() => allPaths, [allPaths]);

  const path = useCallback((slug: string) => allPaths.find((entry) => entry.slug === slug), [allPaths]);

  const lesson = useCallback(
    (courseSlug: string, lessonSlug: string) => {
      const foundCourse = allCourses.find((entry) => entry.slug === courseSlug);
      if (!foundCourse) return undefined;
      for (const moduleEntry of foundCourse.modules) {
        const foundLesson = moduleEntry.lessons.find((entry) => entry.slug === lessonSlug);
        if (foundLesson) return { course: foundCourse, module: moduleEntry, lesson: foundLesson };
      }
      return undefined;
    },
    [allCourses],
  );

  const moduleOf = useCallback(
    (courseSlug: string, moduleSlug: string) => {
      const foundCourse = allCourses.find((entry) => entry.slug === courseSlug);
      if (!foundCourse) return undefined;
      const foundModule = foundCourse.modules.find((entry) => entry.slug === moduleSlug);
      return foundModule ? { course: foundCourse, module: foundModule } : undefined;
    },
    [allCourses],
  );

  const timeline = useCallback((): LearningTimelineEntry[] => {
    const history: LearningTimelineEntry[] = LEARNING_HISTORY.map((entry: LearningHistoryEntry) => ({
      id: entry.id,
      source: 'history',
      kind: entry.eventType,
      detail: entry.detail ?? '',
      occurredAt: entry.occurredAt,
      objectRef: entry.objectRef,
    }));
    const workflow: LearningTimelineEntry[] = workflowEvents.map((event) => ({
      id: event.id,
      source: 'workflow',
      kind: event.kind,
      detail: event.detail ?? '',
      occurredAt: event.occurredAt,
      objectRef: event.objectRef,
    }));
    return [...history, ...workflow].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
  }, [workflowEvents]);

  const recommendations = useCallback((): LearningRecommendationView[] => {
    const adaptive: LearningRecommendationView[] = adaptiveRecommendations.map((rec) => ({
      id: rec.id,
      kind: rec.kind,
      source: 'adaptive',
      title: rec.title,
      description: rec.description,
      reason: rec.reason,
      score: 0,
      applied: rec.applied,
      createdAt: rec.createdAt,
      mutable: true,
      target: rec.target,
    }));
    const gap: LearningRecommendationView[] = gapRecommendations.map((rec) => ({
      id: rec.id,
      kind: rec.kind,
      source: 'gap',
      title: rec.title,
      description: rec.description,
      reason: rec.reason,
      score: 0,
      applied: rec.applied,
      createdAt: rec.createdAt,
      mutable: false,
      target: rec.target,
    }));
    const engine = recommendCoursesEngine(
      {
        learnerUsername: learner.username,
        courses: allCourses,
        progress,
        goals,
        framework: SLE_COMPETENCY_FRAMEWORK,
        evidenceLevels,
        mentors,
      },
      { top: 3 },
    ).map((rec) => ({
      id: rec.id,
      kind: rec.scope,
      source: 'engine' as const,
      title: rec.title,
      description: rec.description,
      reason: rec.reason,
      score: rec.score,
      applied: rec.applied,
      createdAt: rec.createdAt,
      mutable: false,
      target: rec.target,
    }));
    return [...adaptive, ...gap, ...engine];
  }, [adaptiveRecommendations, gapRecommendations, learner, allCourses, progress, goals, evidenceLevels, mentors]);

  const notifications = useMemo(() => notificationsFromWorkflow(workflowEvents), [workflowEvents]);

  const notificationSummary = useMemo(() => learningNotificationSummary(notifications), [notifications]);

  const calculateAnalytics = useCallback(
    () =>
      learnerAnalytics({
        learnerUsername: learner.username,
        courses: allCourses,
        progress,
        assessments: LEARNING_ASSESSMENTS,
        framework: SLE_COMPETENCY_FRAMEWORK,
        evidenceLevels,
        portfolios,
        cpdRecords: passport.cpdRecords,
        goals,
        mentorships,
      }),
    [allCourses, progress, evidenceLevels, portfolios, passport, goals, mentorships, learner],
  );

  const statistics = useCallback(
    () => ({
      statistics: statisticsData,
      kpis: LEARNING_KPIS,
      analytics: calculateAnalytics(),
    }),
    [statisticsData, calculateAnalytics],
  );

  const dashboard = useCallback((): LearningDashboardModel => {
    const withProgress = allCourses.map((item) => ({ course: item, progress: courseProgress(progress, item) }));
    const ongoing = withProgress
      .filter(({ progress }) => progress.percent > 0 && progress.percent < 100)
      .sort((a, b) => b.progress.percent - a.progress.percent);
    const completed = withProgress
      .filter(({ progress }) => progress.percent >= 100)
      .sort((a, b) => b.progress.percent - a.progress.percent);
    return {
      learner,
      statistics: statisticsData,
      kpis: LEARNING_KPIS,
      analytics: calculateAnalytics(),
      ongoing,
      completed,
      myPaths,
      goals,
      events,
      passport,
      notifications,
      notificationSummary,
      timeline: timeline(),
    };
  }, [allCourses, progress, learner, statisticsData, calculateAnalytics, myPaths, goals, events, passport, notifications, notificationSummary, timeline]);

  const workspace = useCallback((): LearningWorkspaceModel => {
    const withProgress = allCourses.map((item) => ({ course: item, progress: courseProgress(progress, item) }));
    const ongoing = withProgress
      .filter(({ progress }) => progress.percent > 0 && progress.percent < 100)
      .sort((a, b) => b.progress.percent - a.progress.percent);
    const current = ongoing[0];
    const completedLessonIds = new Set(
      progress
        .filter((entry) => entry.nodeType === 'lesson' && entry.state === 'completed')
        .map((entry) => entry.learningObjectId),
    );
    const incomplete = current ? firstIncompleteLesson(current.course, completedLessonIds) : undefined;
    const currentProgramme =
      allProgrammes.find((programme) => programme.curricula.some((curriculum) => curriculum.courses.some((item) => item.id === current?.course.id))) ??
      DEFAULT_PROGRAMME;
    return {
      learner,
      current: current ? { course: current.course, module: incomplete?.module, lesson: incomplete?.lesson, progress: current.progress } : undefined,
      programme: currentProgramme,
      path: myPaths[0],
      recentActivity: timeline().slice(0, 8),
      resume: ongoing,
      pinnedResources: LEARNING_BOOKMARKS.filter((bookmark) => bookmark.pinned),
      deadlines: [...LEARNING_DEADLINES].sort((a, b) => a.dueAt.localeCompare(b.dueAt)),
      recommendations: recommendations(),
      statistics: statisticsData,
    };
  }, [allCourses, progress, allProgrammes, myPaths, learner, timeline, recommendations, statisticsData]);

  const reading = useCallback((): LearningReadingModel => {
    const inProgress = LEARNING_READINGS.filter((item) => item.progress > 0 && item.progress < 100);
    const current = inProgress.sort((a, b) => b.openedAt.localeCompare(a.openedAt))[0];
    const recentlyOpened = [...LEARNING_READINGS].sort((a, b) => b.openedAt.localeCompare(a.openedAt)).slice(0, 4);
    const averageProgress = Math.round(
      LEARNING_READINGS.reduce((sum, item) => sum + item.progress, 0) / Math.max(1, LEARNING_READINGS.length),
    );
    const estimatedCompletionMinutes = Math.round(
      LEARNING_READINGS.reduce((sum, item) => sum + item.estimatedMinutes * (1 - item.progress / 100), 0),
    );
    return {
      current,
      recentlyOpened,
      saved: LEARNING_READINGS.filter((item) => item.kind === 'saved'),
      research: LEARNING_READINGS.filter((item) => item.kind === 'research'),
      course: LEARNING_READINGS.filter((item) => item.kind === 'course'),
      progress: averageProgress,
      estimatedCompletionMinutes,
      lists: readingLists,
      playlists: READING_PLAYLISTS,
      aiSuggestions: [
        { title: 'Summarise this reading', description: 'Generate a concise summary of the current reading for your journal.' },
        { title: 'Related readings', description: 'Suggest readings related to your current research focus.' },
        { title: 'Key concepts', description: 'Extract the key concepts and definitions from your reading list.' },
      ],
    };
  }, [readingLists]);

  const notes = useCallback((): LearningNotesModel => {
    const sorted = [...LEARNING_NOTES].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    return {
      notes: sorted,
      pinned: sorted.filter((note) => note.pinned),
      recent: sorted.slice(0, 3),
    };
  }, []);

  const highlights = useCallback((): LearningHighlightsModel => {
    const byCategory = Object.fromEntries(
      LEARNING_HIGHLIGHT_CATEGORIES.map((category) => [
        category,
        LEARNING_HIGHLIGHTS.filter((highlight) => highlight.category === category),
      ]),
    ) as Record<LearningHighlightCategory, LearningHighlight[]>;
    return {
      highlights: [...LEARNING_HIGHLIGHTS].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      categories: LEARNING_HIGHLIGHT_CATEGORIES,
      byCategory,
      colours: HIGHLIGHT_COLOURS,
    };
  }, []);

  const bookmarks = useCallback((): LearningBookmarksModel => {
    const kinds: LearningBookmarkKind[] = ['course', 'lesson', 'module', 'topic', 'reading', 'research', 'video', 'resource'];
    const byKind = Object.fromEntries(
      kinds.map((kind) => [kind, LEARNING_BOOKMARKS.filter((bookmark) => bookmark.kind === kind)]),
    ) as Record<LearningBookmarkKind, LearningBookmark[]>;
    return {
      bookmarks: [...LEARNING_BOOKMARKS].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      pinned: LEARNING_BOOKMARKS.filter((bookmark) => bookmark.pinned),
      byKind,
    };
  }, []);

  const journal = useCallback((): LearningJournalModel => {
    const sorted = [...LEARNING_JOURNAL].sort((a, b) => b.date.localeCompare(a.date));
    return {
      entries: sorted,
      daily: sorted.filter((entry) => entry.kind === 'daily'),
      reflections: sorted.filter((entry) => entry.kind === 'reflection'),
      weekly: sorted.filter((entry) => entry.kind === 'weekly'),
      monthly: sorted.filter((entry) => entry.kind === 'monthly'),
      research: sorted.filter((entry) => entry.kind === 'research'),
      recent: sorted.slice(0, 4),
    };
  }, []);

  const createReadingList = useCallback(
    (input: { title: string; description?: string; category?: string }) => {
      const now = new Date().toISOString();
      const slug = input.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .slice(0, 48);
      const id = `rlist-${Date.now()}`;
      setReadingLists((current) => [
        {
          id,
          slug: slug || id,
          title: input.title,
          description: input.description ?? '',
          ownerUsername: learner.username,
          items: [],
          category: input.category ?? 'General',
          pinned: true,
          createdAt: now,
          updatedAt: now,
        },
        ...current,
      ]);
    },
    [learner],
  );

  const updateReadingList = useCallback(
    (readingListId: string, patch: Partial<Pick<LearningReadingList, 'title' | 'description' | 'category'>>) => {
      setReadingLists((current) =>
        current.map((list) =>
          list.id === readingListId ? { ...list, ...patch, updatedAt: new Date().toISOString() } : list,
        ),
      );
    },
    [],
  );

  const deleteReadingList = useCallback((readingListId: string) => {
    setReadingLists((current) => current.filter((list) => list.id !== readingListId));
  }, []);

  const duplicateReadingList = useCallback((readingListId: string) => {
    setReadingLists((current) => {
      const found = current.find((list) => list.id === readingListId);
      if (!found) return current;
      const now = new Date().toISOString();
      const copy: LearningReadingList = {
        ...found,
        id: `rlist-${Date.now()}`,
        slug: `${found.slug}-copy`,
        title: `${found.title} (copy)`,
        pinned: false,
        favourite: false,
        createdAt: now,
        updatedAt: now,
      };
      return [copy, ...current];
    });
  }, []);

  const togglePinReadingList = useCallback((readingListId: string) => {
    setReadingLists((current) =>
      current.map((list) => (list.id === readingListId ? { ...list, pinned: !list.pinned } : list)),
    );
  }, []);

  const toggleFavouriteReadingList = useCallback((readingListId: string) => {
    setReadingLists((current) =>
      current.map((list) => (list.id === readingListId ? { ...list, favourite: !list.favourite } : list)),
    );
  }, []);

  const toggleArchiveReadingList = useCallback((readingListId: string) => {
    setReadingLists((current) =>
      current.map((list) => (list.id === readingListId ? { ...list, archived: !list.archived } : list)),
    );
  }, []);

  const setReadingListCategory = useCallback((readingListId: string, category: string) => {
    setReadingLists((current) =>
      current.map((list) => (list.id === readingListId ? { ...list, category } : list)),
    );
  }, []);

  const portfolioWorkspace = useCallback((): LearningPortfolioWorkspaceModel => {
    const researchOutputs = portfolios.find((entry) => entry.kind === 'research')?.items ?? [];
    const teachingActivities = portfolios.find((entry) => entry.kind === 'teaching')?.items ?? [];
    const projects = portfolios.flatMap((entry) => entry.items.filter((item) => item.evidenceType === 'project'));
    return {
      portfolios,
      certificates: passport.certificates,
      badges: passport.badges,
      researchOutputs,
      teachingActivities,
      mentorship: mentorships.filter((entry) => entry.menteeUsername === learner.username),
      projects,
      completion: calculateAnalytics().portfolio.percent,
    };
  }, [portfolios, passport, mentorships, learner, calculateAnalytics]);

  const passportWorkspace = useCallback((): LearningPassportWorkspaceModel => {
    const timeline: LearningPassportWorkspaceModel['timeline'] = [
      ...passport.certificates.map((item) => ({
        id: item.id,
        kind: 'certificate' as const,
        title: item.title,
        issuerName: item.issuerName,
        issuedAt: item.issuedAt,
        verificationReference: item.verificationReference,
      })),
      ...passport.badges.map((item) => ({
        id: item.id,
        kind: 'badge' as const,
        title: item.title,
        issuerName: item.issuerName,
        issuedAt: item.issuedAt,
        verificationReference: item.verificationReference,
      })),
      ...passport.cpdRecords.map((item) => ({
        id: item.id,
        kind: 'cpd' as const,
        title: item.activityTitle,
        issuerName: item.issuerName,
        issuedAt: item.issuedAt,
        verificationReference: item.verificationReference,
      })),
    ].sort((a, b) => b.issuedAt.localeCompare(a.issuedAt));
    const cpdHours = passport.cpdRecords.reduce((sum, item) => sum + item.hours, 0);
    return {
      passport,
      certificates: passport.certificates,
      badges: passport.badges,
      cpdRecords: passport.cpdRecords,
      timeline,
      achievements: {
        certificates: passport.certificates.length,
        badges: passport.badges.length,
        cpdRecords: passport.cpdRecords.length,
        cpdHours,
      },
      verification: [...passport.certificates, ...passport.badges].map((item) => ({
        title: item.title,
        reference: item.verificationReference,
        status: item.status,
      })),
    };
  }, [passport]);

  const goalTracker = useCallback((): LearningGoalTrackerModel => {
    const goalStats = calculateAnalytics().goalProgress;
    return {
      goals: goalStats,
      active: goals.filter((goal) => goal.status === 'active'),
      completedCount: goalStats.filter((goal) => goal.status === 'achieved' || goal.progress >= 100).length,
      activeCount: goals.filter((goal) => goal.status === 'active').length,
      averageProgress: Math.round(goalStats.reduce((sum, goal) => sum + goal.progress, 0) / Math.max(1, goalStats.length)),
      recommendations: gapRecommendations.map((recommendation) => toRecommendationView(recommendation, 'gap')),
    };
  }, [calculateAnalytics, goals, gapRecommendations]);

  const competencyRadar = useCallback((): LearningCompetencyRadarModel => {
    const competencies = SLE_COMPETENCY_FRAMEWORK.competencies.map((competency) => {
      const currentLevel = LEARNING_COMPETENCY_EVIDENCE[competency.key] ?? 1;
      const targetLevel = competency.targetLevel;
      const gap = targetLevel - currentLevel;
      return {
        key: competency.key,
        name: competency.name,
        domain: competency.domain,
        currentLevel,
        targetLevel,
        gap,
        growth: growthOf(LEARNING_COMPETENCY_HISTORY, competency.key),
        state: (gap > 0 ? 'gap' : gap < 0 ? 'ahead' : 'at-par') as 'gap' | 'at-par' | 'ahead',
      };
    });
    return {
      competencies,
      attainment: LEARNING_COMPETENCY_ATTAINMENT,
      history: LEARNING_COMPETENCY_HISTORY,
      recommendations: gapRecommendations.map((recommendation) => toRecommendationView(recommendation, 'gap')),
    };
  }, [gapRecommendations]);

  const studentHome = useCallback((): LearningStudentHomeModel => {
    const withProgress = allCourses.map((item) => ({ course: item, progress: courseProgress(progress, item) }));
    const ongoing = withProgress
      .filter(({ progress }) => progress.percent > 0 && progress.percent < 100)
      .sort((a, b) => b.progress.percent - a.progress.percent);
    return {
      learner,
      resume: ongoing,
      recentLearning: timeline().slice(0, 6),
      currentCourses: ongoing,
      currentPaths: myPaths,
      goals,
      competencies: competencyRadar(),
      certificates: passport.certificates,
      reading: LEARNING_READINGS,
      portfolio: portfolios,
      events: events.slice(0, 4),
      announcements: LEARNING_ANNOUNCEMENTS,
      recommendations: recommendations(),
    };
  }, [allCourses, progress, learner, timeline, myPaths, goals, competencyRadar, passport, portfolios, events, recommendations]);

  const applyWorkflow = useCallback(
    (result: { state: LearningProgressEntry[]; events: LearningWorkflowEvent[] }) => {
      setProgress(result.state);
      setWorkflowEvents((current) => [...result.events, ...current]);
    },
    [],
  );

  const applyPassportWorkflow = useCallback(
    (result: { state: LearningPassport; events: LearningWorkflowEvent[] }) => {
      setPassport(result.state);
      setWorkflowEvents((current) => [...result.events, ...current]);
    },
    [],
  );

  const enrol = useCallback(
    (courseIdValue: string) => {
      const foundCourse = allCourses.find((item) => item.id === courseIdValue);
      if (!foundCourse) return;
      applyWorkflow(enrolInCourse(progress, foundCourse, learner.username));
    },
    [allCourses, progress, learner, applyWorkflow],
  );

  const setCourseState = useCallback((courseIdValue: string, state: ProgressState) => {
    setProgress((current) => advanceProgress(current, { nodeType: 'course', learningObjectId: courseIdValue, state }));
  }, []);

  const completeObject = useCallback((nodeType: LearningNodeType, learningObjectId: string, score?: number) => {
    setProgress((current) =>
      completeLearningObject(current, nodeType, learningObjectId, new Date().toISOString(), score),
    );
  }, []);

  const applyRecommendation = useCallback((recommendationIdValue: string) => {
    setAdaptiveRecommendations((current) =>
      current.map((recommendation) =>
        recommendation.id === recommendationIdValue ? { ...recommendation, applied: true } : recommendation,
      ),
    );
  }, []);

  const dismissRecommendation = useCallback((recommendationIdValue: string) => {
    setAdaptiveRecommendations((current) =>
      current.filter((recommendation) => recommendation.id !== recommendationIdValue),
    );
  }, []);

  const requestMentorshipFor = useCallback(
    (mentor: LearningMentor) => {
      setMentorships((current) => [
        requestMentorship({
          mentor,
          menteeUsername: learner.username,
          menteeName: learner.name,
          kind: mentor.kind,
        }),
        ...current,
      ]);
    },
    [learner],
  );

  const updateMentorshipStatusOf = useCallback((mentorshipIdValue: string, status: MentorshipStatus) => {
    setMentorships((current) =>
      current.map((mentorship) => (mentorship.id === mentorshipIdValue ? updateMentorshipStatus(mentorship, status) : mentorship)),
    );
  }, []);

  const setGoalStatusOf = useCallback((goalIdValue: string, status: GoalStatus) => {
    setGoals((current) => current.map((goal) => (goal.id === goalIdValue ? updateGoalStatus(goal, status) : goal)));
  }, []);

  const addItemToPortfolio = useCallback(
    (kind: LearningPortfolio['kind'], item: PortfolioItem) => {
      setPortfolios((current) =>
        current.map((portfolio) =>
          portfolio.learnerUsername === learner.username && portfolio.kind === kind
            ? addPortfolioItem(portfolio, item)
            : portfolio,
        ),
      );
    },
    [learner],
  );

  const shareItemInPortfolio = useCallback(
    (kind: LearningPortfolio['kind'], itemId: string, visibility: PortfolioItemVisibility = 'shared') => {
      setPortfolios((current) =>
        current.map((portfolio) =>
          portfolio.learnerUsername === learner.username && portfolio.kind === kind
            ? sharePortfolioItem(portfolio, itemId, visibility)
            : portfolio,
        ),
      );
    },
    [learner],
  );

  const revokeItemShareInPortfolio = useCallback((kind: LearningPortfolio['kind'], itemId: string) => {
    setPortfolios((current) =>
      current.map((portfolio) =>
        portfolio.learnerUsername === CURRENT_LEARNING_USER && portfolio.kind === kind
          ? revokePortfolioShare(portfolio, itemId)
          : portfolio,
      ),
    );
  }, []);

  const withdraw = useCallback(
    (courseIdValue: string) => {
      const foundCourse = allCourses.find((item) => item.id === courseIdValue);
      if (!foundCourse) return;
      applyWorkflow(withdrawFromCourse(progress, foundCourse, learner.username));
    },
    [allCourses, progress, learner, applyWorkflow],
  );

  const completeLesson = useCallback(
    (courseIdValue: string, lessonIdValue: string) => {
      const foundCourse = allCourses.find((item) => item.id === courseIdValue);
      if (!foundCourse) return;
      applyWorkflow(completeObjectInCourse(progress, foundCourse, lessonIdValue, learner.username));
    },
    [allCourses, progress, learner, applyWorkflow],
  );

  const completeModule = useCallback(
    (courseIdValue: string, moduleIdValue: string) => {
      const foundCourse = allCourses.find((item) => item.id === courseIdValue);
      if (!foundCourse) return;
      applyWorkflow(completeObjectInCourse(progress, foundCourse, moduleIdValue, learner.username));
    },
    [allCourses, progress, learner, applyWorkflow],
  );

  const completeCourse = useCallback(
    (courseIdValue: string) => {
      const foundCourse = allCourses.find((item) => item.id === courseIdValue);
      if (!foundCourse) return;
      applyWorkflow(completeObjectInCourse(progress, foundCourse, courseIdValue, learner.username));
    },
    [allCourses, progress, learner, applyWorkflow],
  );

  const issueCertificate = useCallback(
    (courseIdValue: string, title?: string) => {
      const foundCourse = allCourses.find((item) => item.id === courseIdValue);
      if (!foundCourse) return;
      applyPassportWorkflow(
        issueCertificateFor(progress, passport, foundCourse, {
          title: title ?? `${foundCourse.title} — Certificate`,
          issuerUsername: CURRENT_LEARNING_USER,
          issuerName: CURRENT_LEARNING_USER_NAME,
          learnerUsername: learner.username,
          learnerName: learner.name,
        }),
      );
    },
    [allCourses, progress, passport, learner, applyPassportWorkflow],
  );

  const awardBadge = useCallback(
    (input: { title: string; competencyKey?: string; imageUrl?: string; standard?: string }) => {
      applyPassportWorkflow(
        awardBadgeFor(passport, {
          title: input.title,
          issuerUsername: CURRENT_LEARNING_USER,
          issuerName: CURRENT_LEARNING_USER_NAME,
          learnerUsername: learner.username,
          learnerName: learner.name,
          competencyKey: input.competencyKey,
          imageUrl: input.imageUrl ?? '',
          standard: input.standard,
        }),
      );
    },
    [passport, learner, applyPassportWorkflow],
  );

  const recordCPD = useCallback(
    (input: { activityTitle: string; hours: number; activityDate?: string; title?: string }) => {
      applyPassportWorkflow(
        recordCpdFor(passport, {
          title: input.title ?? input.activityTitle,
          activityTitle: input.activityTitle,
          hours: input.hours,
          activityDate: input.activityDate ?? new Date().toISOString().slice(0, 10),
        }),
      );
    },
    [passport, applyPassportWorkflow],
  );

  const updatePortfolio = useCallback(
    (item: PortfolioItem, kind?: LearningPortfolio['kind']) => {
      const portfolioKind = kind ?? item.kind;
      setPortfolios((current) =>
        current.map((portfolio) =>
          portfolio.learnerUsername === learner.username && portfolio.kind === portfolioKind
            ? updatePortfolioEntry(portfolio, item)
            : portfolio,
        ),
      );
    },
    [learner],
  );

  const recommendCourses = useCallback(
    (options: LearningRecommendationOptions = {}) =>
      recommendCoursesEngine(
        {
          learnerUsername: learner.username,
          courses: allCourses,
          progress,
          goals,
          framework: SLE_COMPETENCY_FRAMEWORK,
          evidenceLevels,
          mentors,
        },
        options,
      ),
    [allCourses, progress, goals, evidenceLevels, mentors, learner],
  );

  const recommendMentors = useCallback(
    (options: LearningRecommendationOptions = {}) =>
      recommendMentorsFor(
        {
          learnerUsername: learner.username,
          courses: allCourses,
          progress,
          goals,
          framework: SLE_COMPETENCY_FRAMEWORK,
          evidenceLevels,
          mentors,
        },
        options,
      ),
    [allCourses, progress, goals, evidenceLevels, mentors, learner],
  );

  const trackProgress = useCallback(
    (courseIdValue?: string) =>
      courseIdValue ? progress.filter((entry) => entry.learningObjectId === courseIdValue) : progress,
    [progress],
  );

  // -------------------------------------------------------------------------
  // Wave 4 — Academic & Institutional Learning Operations
  // -------------------------------------------------------------------------

  const rubrics = useMemo(() => LEARNING_RUBRICS, []);
  const institutions = useMemo(() => LEARNING_INSTITUTIONS, []);
  const roleAssignments = useMemo<LearningRoleAssignment[]>(() => DEFAULT_ROLE_ASSIGNMENTS, []);

  const canonicalLearners = useMemo(() => {
    const usernames = new Set<string>([learner.username]);
    allCourses.forEach((course) => {
      if (course.instructorUsername) usernames.add(course.instructorUsername);
    });
    mentors.forEach((mentorEntry) => usernames.add(mentorEntry.username));
    mentorships.forEach((mentorship) => {
      usernames.add(mentorship.mentorUsername);
      usernames.add(mentorship.menteeUsername);
    });
    events.forEach((eventEntry) => usernames.add(eventEntry.hostUsername));
    academies.forEach((academy) => academy.members.forEach((member) => usernames.add(member)));
    return Array.from(usernames).map((username) => ({ username, name: nameFor(username) }));
  }, [learner, allCourses, mentors, mentorships, events, academies]);

  const facultyUnits = useMemo<LearningOrganisationalUnit[]>(() => {
    const byCategory = new Map<string, LearningCourse[]>();
    allCourses.forEach((course) => {
      const bucket = byCategory.get(course.category) ?? [];
      bucket.push(course);
      byCategory.set(course.category, bucket);
    });
    return Array.from(byCategory.entries()).map(([category, coursesOf]) =>
      organisationUnit(`fac-${buildLearningSlug(category)}`, category, 'faculty', coursesOf.map((course) => course.id)),
    );
  }, [allCourses]);

  const departmentUnits = useMemo<LearningOrganisationalUnit[]>(() => {
    return allProgrammes.flatMap((programme) =>
      programme.curricula.map((curriculum) =>
        organisationUnit(
          curriculum.id,
          curriculum.title,
          'department',
          curriculum.courses.map((course) => course.id),
          programme.institutionId,
        ),
      ),
    );
  }, [allProgrammes]);

  const gradebookRows = useMemo<LearningGradebookRow[]>(
    () =>
      LEARNING_ASSESSMENTS.map((assessment) => {
        const rowCourse = courseForAssessment(allCourses, assessment);
        const rubric = rubrics.find((entry) => entry.id === assessment.rubricId);
        const entry = progress.find((item) => item.learningObjectId === assessment.id && item.nodeType === 'assessment');
        const score = entry?.score;
        return {
          assessment,
          course: rowCourse,
          rubric,
          score,
          state: entry?.state ?? 'not-started',
          passed: score === undefined ? false : isAssessmentPassing(assessment, score),
        };
      }),
    [allCourses, rubrics, progress],
  );

  const combinedWorkflowEvents = useMemo(
    () => [...retroactiveWorkflowEvents(), ...workflowEvents],
    [workflowEvents],
  );

  const programmeWorkflowKinds = useMemo(
    () => workflowEventSummary(combinedWorkflowEvents),
    [combinedWorkflowEvents],
  );

  const combinedNotifications = useMemo(
    () => [...retroactiveNotificationEvents(), ...notifications],
    [notifications],
  );

  const educator = useCallback((): LearningEducatorModel => {
    const courses: LearningEducatorCourseRow[] = allCourses.map((course) => {
      const rowProgress = courseProgress(progress, course);
      const instructor = course.instructorUsername ?? learner.username;
      return {
        course,
        progress: rowProgress,
        assessmentCount: assessmentsLinkedTo(course, LEARNING_ASSESSMENTS).length,
        competencies: competenciesForCourse(SLE_COMPETENCY_FRAMEWORK, course, LEARNING_ASSESSMENTS),
        instructor,
        instructorName: nameFor(instructor),
        institution: course.institutionName ?? '—',
      };
    });
    const loadMap = new Map<string, LearningTeachingLoadRow>();
    courses.forEach((row) => {
      const current = loadMap.get(row.instructor) ?? {
        instructor: row.instructor,
        instructorName: row.instructorName,
        courseCount: 0,
        learners: 0,
      };
      current.courseCount += 1;
      current.learners += row.progress.total > 0 ? 1 : 0;
      loadMap.set(row.instructor, current);
    });
    const teachingLoad = Array.from(loadMap.values()).sort((a, b) => b.courseCount - a.courseCount);
    const moderation = gradebookRows.filter((row) => row.assessment.kind === 'assignment' || row.assessment.kind === 'practical');
    const feedbackQueue = gradebookRows.filter((row) => row.state === 'in-progress');
    return {
      learner,
      courses,
      teachingLoad,
      gradebook: gradebookRows,
      moderation,
      feedbackQueue,
      statistics: statisticsData,
      analytics: calculateAnalytics(),
    };
  }, [allCourses, progress, gradebookRows, learner, statisticsData, calculateAnalytics]);

  const menteePortfolioReviews = useCallback(
    () =>
      mentorships.map((mentorship) => {
        const learnerPortfolios = portfolios.filter((portfolio) => portfolio.learnerUsername === mentorship.menteeUsername);
        const coverage =
          learnerPortfolios.length === 0
            ? 0
            : Math.round((learnerPortfolios.filter((portfolio) => portfolio.items.length > 0).length / learnerPortfolios.length) * 100);
        return { mentee: mentorship.menteeUsername, menteeName: mentorship.menteeName, portfolios: learnerPortfolios, coverage };
      }),
    [mentorships, portfolios],
  );

  const mentor = useCallback((): LearningMentorWorkspaceModel => {
    const asMentor = mentorships.filter((entry) => entry.mentorUsername === learner.username);
    const asMentee = mentorships.filter((entry) => entry.menteeUsername === learner.username);
    const requests = mentorships.filter((entry) => entry.status === 'requested');
    const active = mentorships.filter((entry) => entry.status === 'active');
    const agenda = mentorships.flatMap((mentorship) => {
      const next = mentorship.milestones.find((milestone) => milestone.status === 'in-progress');
      return next ? [{ mentorship, milestone: next }] : [];
    });
    const weeklyChecks = mentorships.flatMap((mentorship) => {
      const next = mentorship.milestones.find((milestone) => milestone.status === 'in-progress') ?? mentorship.milestones[0];
      return next
        ? [{ mentorship, milestone: next, progress: milestoneProgress(mentorship.milestones) }]
        : [];
    });
    const menteePortfolios = menteePortfolioReviews();
    return {
      learner,
      mentorships,
      asMentor,
      asMentee,
      requests,
      active,
      agenda,
      weeklyChecks,
      menteePortfolios,
      activity: mentorshipActivity(mentorships),
      statistics: statisticsData,
    };
  }, [mentorships, learner, statisticsData, menteePortfolioReviews]);

  const curriculum = useCallback((): LearningCurriculumModel => {
    const curriculaRows: LearningCurriculumRow[] = allProgrammes.flatMap((programme) =>
      programme.curricula.map((curriculumEntry) => {
        const courses = coursesInCurriculum(programme, curriculumEntry.id);
        const stats = curriculumCompletionStats(courses, progress);
        return {
          programme,
          curriculum: curriculumEntry,
          courses,
          totalNodes: stats.totalNodes,
          completedNodes: stats.completedNodes,
          completion: stats.completion,
        };
      }),
    );
    const courseMap = allCourses.map((course) => ({
      course,
      placements: curriculaRows
        .filter((row) => row.courses.some((entry) => entry.id === course.id))
        .map((row) => ({ programme: row.programme.title, curriculum: row.curriculum.title })),
    }));
    const skillNames = Array.from(new Set(SLE_COMPETENCY_FRAMEWORK.competencies.flatMap((competency) => competency.skills)));
    const knowledgeNames = Array.from(new Set(SLE_COMPETENCY_FRAMEWORK.competencies.flatMap((competency) => competency.knowledgeAreas)));
    const skills: Skill[] = skillNames.map((name, index) => ({
      id: `skl-${index}`,
      key: buildLearningSlug(name),
      name,
      description: 'Skill referenced by the Scholarly Learning Competency Framework.',
    }));
    const knowledgeAreas: KnowledgeArea[] = knowledgeNames.map((name, index) => ({
      id: `ka-${index}`,
      key: buildLearningSlug(name),
      name,
      description: 'Knowledge area referenced by the Scholarly Learning Competency Framework.',
    }));
    return {
      curricula: curriculaRows,
      courseMap,
      competencies: SLE_COMPETENCY_FRAMEWORK.competencies,
      skills,
      knowledgeAreas,
      statistics: statisticsData,
    };
  }, [allProgrammes, allCourses, progress, statisticsData]);

  const programmeManager = useCallback((): LearningProgrammeManagerModel => {
    const programmeAnalytics = programmeStatistics(
      allProgrammes,
      allCourses,
      progress,
      canonicalLearners.map((entry) => entry.username),
      SLE_COMPETENCY_FRAMEWORK,
      evidenceLevels,
    );
    const programmes: LearningProgrammeRow[] = allProgrammes.map((entry) => {
      const rowAnalytics = programmeAnalytics.find((stats) => stats.unit.id === entry.id);
      const rowProgress = programmeProgress(progress, entry);
      return {
        programme: entry,
        courseCount: allCoursesInProgramme(entry).length,
        curriculaCount: entry.curricula.length,
        completion: rowProgress.completed,
        percent: rowProgress.percent,
        analytics: rowAnalytics,
      };
    });
    const progression = programmes.map((row) => ({
      programme: row.programme,
      percent: row.percent,
      completed: row.completion,
      total: row.courseCount,
    }));
    const workflows = Object.entries(programmeWorkflowKinds.byKind)
      .filter(([, count]) => count > 0)
      .map(([kind, count]) => ({ kind: kind as LearningWorkflowKind, count }));
    const approvals: LearningPermissionDecision[] = [
      canAction('platform-admin', 'approve', 'programme'),
      canAction('faculty-admin', 'approve', 'curriculum'),
      canAction('lecturer', 'certify', 'course'),
      canAction('student', 'approve', 'assessment'),
      canAction('mentor', 'mentor', 'mentorship'),
    ];
    return {
      programmes,
      curricula: curriculum().curricula,
      analytics: programmeAnalytics,
      workflows,
      progression,
      approvals,
      statistics: statisticsData,
    };
  }, [allProgrammes, allCourses, progress, canonicalLearners, evidenceLevels, programmeWorkflowKinds, curriculum, statisticsData]);

  const assessmentManager = useCallback((): LearningAssessmentManagerModel => {
    const kinds: AssessmentKind[] = ['quiz', 'assignment', 'practical', 'research-exercise'];
    const byKind = Object.fromEntries(
      kinds.map((kind) => [kind, gradebookRows.filter((row) => row.assessment.kind === kind)]),
    ) as Record<AssessmentKind, LearningGradebookRow[]>;
    const assignment = allCourses
      .map((course) => ({ course, assessments: assessmentsForCourseEngine(LEARNING_ASSESSMENTS, course) }))
      .filter((row) => row.assessments.length > 0);
    return {
      assessments: gradebookRows,
      byKind,
      rubrics,
      assignment,
      results: gradebookRows.filter((row) => row.score !== undefined),
      statistics: statisticsData,
    };
  }, [gradebookRows, allCourses, rubrics, statisticsData]);

  const institution = useCallback((): LearningInstitutionModel => {
    const learnerUsernames = canonicalLearners.map((entry) => entry.username);
    const analyticsRows = institutionStatistics(
      institutions,
      allCourses,
      progress,
      learnerUsernames,
      SLE_COMPETENCY_FRAMEWORK,
      evidenceLevels,
    );
    const rows: LearningInstitutionRow[] = institutions.map((entry) => {
      const entryCourses = allCourses.filter((course) => course.institutionId === entry.id);
      const entryAnalytics = analyticsRows.find((stats) => stats.unit.id === entry.id);
      const learnerCount = new Set(entryCourses.flatMap((course) => (course.instructorUsername ? [course.instructorUsername] : []))).size;
      return {
        institution: entry,
        courseCount: entryCourses.length,
        learnerCount,
        analytics: entryAnalytics,
        academies: academies.filter((academy) => academy.institutionId === entry.id),
      };
    });
    return {
      institutions: rows,
      analytics: analyticsRows,
      kpis: LEARNING_KPIS,
      statistics: statisticsData,
    };
  }, [institutions, allCourses, progress, canonicalLearners, academies, evidenceLevels, statisticsData]);

  const faculty = useCallback((): LearningFacultyModel => {
    const learnerUsernames = canonicalLearners.map((entry) => entry.username);
    const analyticsRows = facultyStatistics(
      facultyUnits,
      allCourses,
      progress,
      learnerUsernames,
      SLE_COMPETENCY_FRAMEWORK,
      evidenceLevels,
    );
    const faculties: LearningUnitRow[] = facultyUnits.map((unit, index) => ({
      unit,
      analytics: analyticsRows[index],
      courses: allCourses.filter((course) => unit.courseIds.includes(course.id)),
    }));
    return {
      faculties,
      analytics: analyticsRows,
      kpis: LEARNING_KPIS,
      statistics: statisticsData,
    };
  }, [facultyUnits, allCourses, progress, canonicalLearners, evidenceLevels, statisticsData]);

  const department = useCallback((): LearningDepartmentModel => {
    const learnerUsernames = canonicalLearners.map((entry) => entry.username);
    const analyticsRows = departmentStatistics(
      departmentUnits,
      allCourses,
      progress,
      learnerUsernames,
      SLE_COMPETENCY_FRAMEWORK,
      evidenceLevels,
    );
    const departments: LearningUnitRow[] = departmentUnits.map((unit, index) => ({
      unit,
      analytics: analyticsRows[index],
      courses: allCourses.filter((course) => unit.courseIds.includes(course.id)),
    }));
    return {
      departments,
      analytics: analyticsRows,
      kpis: LEARNING_KPIS,
      statistics: statisticsData,
    };
  }, [departmentUnits, allCourses, progress, canonicalLearners, evidenceLevels, statisticsData]);

  const academy = useCallback((): LearningAcademyModel => {
    const rows: LearningAcademyRow[] = academies.map((entry) => {
      const entryEvents = events.filter((eventEntry) => eventEntry.academyId === entry.id);
      return {
        academy: entry,
        members: entry.members,
        memberCount: entry.members.length,
        events: entryEvents,
        eventCount: entryEvents.length,
        registrations: entryEvents.reduce((sum, eventEntry) => sum + (eventEntry.registrationCount ?? 0), 0),
        kind: entry.kind,
      };
    });
    return { academies: rows, statistics: statisticsData };
  }, [academies, events, statisticsData]);

  const analyticsCentre = useCallback((): LearningAnalyticsCentreModel => {
    const learnerUsernames = canonicalLearners.map((entry) => entry.username);
    const centreCompletion = completionRate(progress, allCourses).percent;
    const centreCompetency = competencyPercentage(SLE_COMPETENCY_FRAMEWORK, evidenceLevels).percent;
    const centreEngagement = engagementIndex(progress, allCourses);
    const cohort: LearningCohortRow[] = canonicalLearners.map((entry) => {
      const taught = allCourses.filter((course) => course.instructorUsername === entry.username);
      const completion =
        taught.length > 0
          ? Math.round(taught.reduce((sum, course) => sum + courseProgress(progress, course).percent, 0) / taught.length)
          : entry.username === learner.username
            ? centreCompletion
            : mentorships.some((mentorship) => mentorship.mentorUsername === entry.username || mentorship.menteeUsername === entry.username)
              ? centreCompletion
              : 0;
      return {
        learner: entry.username,
        learnerName: entry.name,
        role: highestRole(roleAssignments, entry.username),
        courses:
          allCourses.filter((course) => course.instructorUsername === entry.username).length +
          (entry.username === learner.username ? allCourses.length : 0),
        mentorships: mentorships.filter(
          (mentorship) => mentorship.mentorUsername === entry.username || mentorship.menteeUsername === entry.username,
        ).length,
        completion,
        competency: entry.username === learner.username ? centreCompetency : 0,
        engagement: entry.username === learner.username ? centreEngagement : 0,
      };
    });
    const generatedAt = calculateAnalytics().generatedAt;
    return {
      learner: calculateAnalytics(),
      kpis: LEARNING_KPIS,
      scopes: ['learner', 'cohort', 'faculty', 'institution', 'national', 'global'],
      cohort,
      programme: programmeStatistics(allProgrammes, allCourses, progress, learnerUsernames, SLE_COMPETENCY_FRAMEWORK, evidenceLevels),
      institution: institutionStatistics(institutions, allCourses, progress, learnerUsernames, SLE_COMPETENCY_FRAMEWORK, evidenceLevels),
      faculty: facultyStatistics(facultyUnits, allCourses, progress, learnerUsernames, SLE_COMPETENCY_FRAMEWORK, evidenceLevels),
      department: departmentStatistics(departmentUnits, allCourses, progress, learnerUsernames, SLE_COMPETENCY_FRAMEWORK, evidenceLevels),
      academy: academy().academies,
      generatedAt,
    };
  }, [allCourses, progress, canonicalLearners, evidenceLevels, roleAssignments, mentorships, learner, allProgrammes, institutions, facultyUnits, departmentUnits, academy, calculateAnalytics]);

  const validationRegistry = useCallback(() => {
    const targets: { target: string; report: LearningValidationReport }[] = [];
    allProgrammes.forEach((programme) =>
      targets.push({ target: `Programme — ${programme.title}`, report: learningValidationReport(`Programme — ${programme.title}`, validateLearningProgramme(programme)) }),
    );
    allCourses.forEach((course) =>
      targets.push({ target: `Course — ${course.title}`, report: learningValidationReport(`Course — ${course.title}`, validateLearningCourse(course)) }),
    );
    LEARNING_ASSESSMENTS.forEach((assessment) =>
      targets.push({ target: `Assessment — ${assessment.title}`, report: learningValidationReport(`Assessment — ${assessment.title}`, validateLearningAssessment(assessment)) }),
    );
    mentorships.forEach((mentorship) =>
      targets.push({ target: `Mentorship — ${mentorship.id}`, report: learningValidationReport(`Mentorship — ${mentorship.id}`, validateLearningMentorship(mentorship)) }),
    );
    institutions.forEach((institutionEntry) =>
      targets.push({ target: `Institution — ${institutionEntry.name}`, report: learningValidationReport(`Institution — ${institutionEntry.name}`, validateLearningInstitution(institutionEntry)) }),
    );
    rubrics.forEach((rubric) =>
      targets.push({ target: `Rubric — ${rubric.title}`, report: learningValidationReport(`Rubric — ${rubric.title}`, validateLearningRubric(rubric)) }),
    );
    portfolios.forEach((portfolio) =>
      targets.push({ target: `Portfolio — ${portfolio.learnerUsername} (${portfolio.kind})`, report: learningValidationReport(`Portfolio — ${portfolio.learnerUsername} (${portfolio.kind})`, validateLearningPortfolio(portfolio)) }),
    );
    return targets;
  }, [allProgrammes, allCourses, mentorships, institutions, rubrics, portfolios]);

  const administration = useCallback((): LearningAdministrationModel => {
    const allRoles = Object.keys(LEARNING_PERMISSION_MATRIX) as LearningRole[];
    const roles = allRoles.map((role) => ({ role, label: LEARNING_ROLE_LABELS[role], grants: permissionGrantsFor(role).length }));
    const grants = allRoles.flatMap((role) => permissionGrantsFor(role));
    const matrix = grants.map((grant) => ({ role: grant.role, resource: grant.resource, actions: grant.actions }));
    const workflows = Object.entries(programmeWorkflowKinds.byKind)
      .filter(([, count]) => count > 0)
      .map(([kind, count]) => ({ kind: kind as LearningWorkflowKind, count, total: programmeWorkflowKinds.total }));
    const notificationsRegistry = (Object.keys(DEFAULT_NOTIFICATION_PRIORITY) as LearningNotificationKind[]).map((kind) => ({
      kind,
      priority: DEFAULT_NOTIFICATION_PRIORITY[kind],
      count: combinedNotifications.filter((event) => event.kind === kind).length,
    }));
    return {
      roles,
      grants,
      matrix,
      assignments: roleAssignments,
      workflows,
      validation: validationRegistry(),
      notifications: notificationsRegistry,
      statistics: statisticsData,
    };
  }, [programmeWorkflowKinds, combinedNotifications, roleAssignments, validationRegistry, statisticsData]);

  const gradebookFor = useCallback(
    (courseIdValue: string) => gradebookRows.filter((row) => row.course?.id === courseIdValue),
    [gradebookRows],
  );

  const assessmentsForCourseOf = useCallback(
    (courseIdValue: string) => {
      const foundCourse = allCourses.find((entry) => entry.id === courseIdValue);
      return foundCourse ? assessmentsForCourseEngine(LEARNING_ASSESSMENTS, foundCourse) : [];
    },
    [allCourses],
  );

  const moderationQueue = useCallback(
    () => gradebookRows.filter((row) => row.assessment.kind === 'assignment' || row.assessment.kind === 'practical'),
    [gradebookRows],
  );

  const menteesOf = useCallback(
    (mentorUsername: string) => mentorships.filter((entry) => entry.mentorUsername === mentorUsername),
    [mentorships],
  );

  const milestonesOf = useCallback(
    (mentorshipIdValue: string) => mentorships.find((entry) => entry.id === mentorshipIdValue)?.milestones ?? [],
    [mentorships],
  );

  const programmeCoursesOf = useCallback(
    (programmeIdValue: string) => {
      const foundProgramme = allProgrammes.find((entry) => entry.id === programmeIdValue);
      return foundProgramme ? allCoursesInProgramme(foundProgramme) : [];
    },
    [allProgrammes],
  );

  const curriculumCoursesOf = useCallback(
    (programmeIdValue: string, curriculumIdValue: string) => {
      const foundProgramme = allProgrammes.find((entry) => entry.id === programmeIdValue);
      return foundProgramme ? coursesInCurriculum(foundProgramme, curriculumIdValue) : [];
    },
    [allProgrammes],
  );

  const programmeWorkflowStats = useCallback(() => programmeWorkflowKinds, [programmeWorkflowKinds]);

  const curriculumCompletionOf = useCallback(
    (programmeIdValue: string, curriculumIdValue: string) => {
      const courses = curriculumCoursesOf(programmeIdValue, curriculumIdValue);
      return curriculumCompletionStats(courses, progress).completion;
    },
    [curriculumCoursesOf, progress],
  );

  const assessmentResultOf = useCallback(
    (assessmentIdValue: string) => gradebookRows.find((row) => row.assessment.id === assessmentIdValue),
    [gradebookRows],
  );

  const institutionCoursesOf = useCallback(
    (institutionIdValue: string) => allCourses.filter((course) => course.institutionId === institutionIdValue),
    [allCourses],
  );

  const institutionAnalyticsOf = useCallback(
    (institutionIdValue: string) => institution().analytics.find((stats) => stats.unit.id === institutionIdValue),
    [institution],
  );

  const facultyCoursesOf = useCallback(
    (facultyIdValue: string) =>
      allCourses.filter((course) => facultyUnits.some((unit) => unit.id === facultyIdValue && unit.courseIds.includes(course.id))),
    [allCourses, facultyUnits],
  );

  const facultyAnalyticsOf = useCallback(
    (facultyIdValue: string) => faculty().analytics.find((stats) => stats.unit.id === facultyIdValue),
    [faculty],
  );

  const departmentCoursesOf = useCallback(
    (departmentIdValue: string) =>
      allCourses.filter((course) => departmentUnits.some((unit) => unit.id === departmentIdValue && unit.courseIds.includes(course.id))),
    [allCourses, departmentUnits],
  );

  const departmentAnalyticsOf = useCallback(
    (departmentIdValue: string) => department().analytics.find((stats) => stats.unit.id === departmentIdValue),
    [department],
  );

  const academyEventsOf = useCallback(
    (academyIdValue: string) => events.filter((eventEntry) => eventEntry.academyId === academyIdValue),
    [events],
  );

  const academyMembersOf = useCallback(
    (academyIdValue: string) => academies.find((academyEntry) => academyEntry.id === academyIdValue)?.members ?? [],
    [academies],
  );

  const analyticsAt = useCallback(
    (analyticsScope: AnalyticsScope, scopeId?: string) => {
      const centre = analyticsCentre();
      switch (analyticsScope) {
        case 'learner':
          return { scope: analyticsScope, id: scopeId, model: centre.learner };
        case 'cohort':
          return { scope: analyticsScope, id: scopeId, model: centre.cohort };
        case 'faculty':
          return { scope: analyticsScope, id: scopeId, model: centre.faculty };
        case 'institution':
          return { scope: analyticsScope, id: scopeId, model: centre.institution };
        default:
          return { scope: analyticsScope, id: scopeId, model: centre.kpis };
      }
    },
    [analyticsCentre],
  );

  const permissionsOf = useCallback((role: LearningRole) => permissionGrantsFor(role), []);

  const assignmentsOf = useCallback(
    (username: string) => rolesForUser(roleAssignments, username),
    [roleAssignments],
  );

  const workflowRegistry = useCallback(
    () =>
      Object.entries(programmeWorkflowKinds.byKind)
        .filter(([, count]) => count > 0)
        .map(([kind, count]) => ({ kind: kind as LearningWorkflowKind, count, total: programmeWorkflowKinds.total })),
    [programmeWorkflowKinds],
  );

  const notificationRegistry = useCallback(
    () =>
      (Object.keys(DEFAULT_NOTIFICATION_PRIORITY) as LearningNotificationKind[]).map((kind) => ({
        kind,
        priority: DEFAULT_NOTIFICATION_PRIORITY[kind],
        count: combinedNotifications.filter((event) => event.kind === kind).length,
      })),
    [combinedNotifications],
  );

  return useMemo(
    () => ({
      allCourses,
      allProgrammes,
      allPaths,
      adaptiveRecommendations,
      portfolios,
      mentorships,
      goals,
      progress,
      gapRecommendations,
      searchResults,
      statisticsData,
      kpis,
      analytics,
      mentors,
      recommendedMentors,
      academies,
      events,
      passport,
      workflowEvents,
      notifications,
      notificationSummary,
      categories,
      competencyGaps,
      competencyAttainment,
      evidenceLevels,
      myPaths,
      query,
      setQuery,
      category,
      setCategory,
      courseKind,
      setCourseKind,
      domain,
      setDomain,
      sort,
      setSort,
      scope,
      setScope,
      currentUser: CURRENT_LEARNING_USER,
      currentUserName: CURRENT_LEARNING_USER_NAME,
      courses,
      course,
      programmes,
      programme,
      paths,
      path,
      lesson,
      module: moduleOf,
      timeline,
      recommendations,
      statistics,
      dashboard,
      workspace,
      reading,
      notes,
      highlights,
      bookmarks,
      journal,
      readingLists,
      createReadingList,
      updateReadingList,
      deleteReadingList,
      duplicateReadingList,
      togglePinReadingList,
      toggleFavouriteReadingList,
      toggleArchiveReadingList,
      setReadingListCategory,
      portfolioWorkspace,
      passportWorkspace,
      goalTracker,
      competencyRadar,
      studentHome,
      progressOf,
      pathProgressOf,
      enrol,
      setCourseState,
      completeObject,
      applyRecommendation,
      dismissRecommendation,
      requestMentorshipFor,
      updateMentorshipStatusOf,
      setGoalStatusOf,
      addItemToPortfolio,
      shareItemInPortfolio,
      revokeItemShareInPortfolio,
      withdraw,
      completeLesson,
      completeModule,
      completeCourse,
      issueCertificate,
      awardBadge,
      recordCPD,
      updatePortfolio,
      recommendCourses,
      recommendMentors,
      trackProgress,
      calculateAnalytics,
      rubrics,
      institutions,
      roleAssignments,
      canonicalLearners,
      facultyUnits,
      departmentUnits,
      gradebookRows,
      programmeWorkflowKinds,
      educator,
      mentor,
      programmeManager,
      curriculum,
      assessmentManager,
      institution,
      faculty,
      department,
      academy,
      analyticsCentre,
      administration,
      gradebookFor,
      assessmentsForCourseOf,
      moderationQueue,
      menteesOf,
      milestonesOf,
      menteePortfolioReviews,
      programmeCoursesOf,
      curriculumCoursesOf,
      programmeWorkflowStats,
      curriculumCompletionOf,
      assessmentResultOf,
      institutionCoursesOf,
      institutionAnalyticsOf,
      facultyCoursesOf,
      facultyAnalyticsOf,
      departmentCoursesOf,
      departmentAnalyticsOf,
      academyEventsOf,
      academyMembersOf,
      analyticsAt,
      permissionsOf,
      assignmentsOf,
      workflowRegistry,
      validationRegistry,
      notificationRegistry,
    }),
    [
      allCourses,
      allProgrammes,
      allPaths,
      adaptiveRecommendations,
      portfolios,
      mentorships,
      goals,
      progress,
      gapRecommendations,
      searchResults,
      statisticsData,
      kpis,
      analytics,
      mentors,
      recommendedMentors,
      academies,
      events,
      passport,
      workflowEvents,
      notifications,
      notificationSummary,
      categories,
      competencyGaps,
      competencyAttainment,
      evidenceLevels,
      myPaths,
      query,
      category,
      courseKind,
      domain,
      sort,
      scope,
      courses,
      course,
      programmes,
      programme,
      paths,
      path,
      lesson,
      moduleOf,
      timeline,
      recommendations,
      statistics,
      dashboard,
      workspace,
      reading,
      notes,
      highlights,
      bookmarks,
      journal,
      readingLists,
      createReadingList,
      updateReadingList,
      deleteReadingList,
      duplicateReadingList,
      togglePinReadingList,
      toggleFavouriteReadingList,
      toggleArchiveReadingList,
      setReadingListCategory,
      portfolioWorkspace,
      passportWorkspace,
      goalTracker,
      competencyRadar,
      studentHome,
      progressOf,
      pathProgressOf,
      enrol,
      setCourseState,
      completeObject,
      applyRecommendation,
      dismissRecommendation,
      requestMentorshipFor,
      updateMentorshipStatusOf,
      setGoalStatusOf,
      addItemToPortfolio,
      shareItemInPortfolio,
      revokeItemShareInPortfolio,
      withdraw,
      completeLesson,
      completeModule,
      completeCourse,
      issueCertificate,
      awardBadge,
      recordCPD,
      updatePortfolio,
      recommendCourses,
      recommendMentors,
      trackProgress,
      calculateAnalytics,
      rubrics,
      institutions,
      roleAssignments,
      canonicalLearners,
      facultyUnits,
      departmentUnits,
      gradebookRows,
      programmeWorkflowKinds,
      educator,
      mentor,
      programmeManager,
      curriculum,
      assessmentManager,
      institution,
      faculty,
      department,
      academy,
      analyticsCentre,
      administration,
      gradebookFor,
      assessmentsForCourseOf,
      moderationQueue,
      menteesOf,
      milestonesOf,
      menteePortfolioReviews,
      programmeCoursesOf,
      curriculumCoursesOf,
      programmeWorkflowStats,
      curriculumCompletionOf,
      assessmentResultOf,
      institutionCoursesOf,
      institutionAnalyticsOf,
      facultyCoursesOf,
      facultyAnalyticsOf,
      departmentCoursesOf,
      departmentAnalyticsOf,
      academyEventsOf,
      academyMembersOf,
      analyticsAt,
      permissionsOf,
      assignmentsOf,
      workflowRegistry,
      validationRegistry,
      notificationRegistry,
    ],
  );
}
