import type { ResearchLifecycleStageId } from '@/types/research';
export type { ResearchLifecycleStageId } from '@/types/research';

/**
 * Learning Ecosystem (SLE) domain types — Scholatia Mission 003 (Phase 2.2G.3).
 *
 * The SLE models programmes, curricula, courses (standard and micro), modules,
 * lessons, topics, learning activities, reading lists and playlists,
 * assessments, competency frameworks, certificates, badges, continuing
 * professional development (CPD), academic portfolios, mentorship, learning
 * events, academies, analytics, goals, and adaptive recommendations. All
 * person references are canonical researcher usernames; institutions are
 * referenced by canonical ids (e.g. `INST-UI-001`).
 */

// ---------------------------------------------------------------------------
// Vocabulary
// ---------------------------------------------------------------------------

/** Lifecycle of a learning object inside the SLE. */
export type LearningNodeStatus = 'draft' | 'published' | 'archived';

/** Kind of a learning object in the SLE hierarchy. */
export type LearningNodeType =
  | 'programme'
  | 'curriculum'
  | 'path'
  | 'course'
  | 'microCourse'
  | 'module'
  | 'lesson'
  | 'topic'
  | 'activity'
  | 'readingList'
  | 'readingPlaylist'
  | 'assessment';

/** A course may be a full course or a micro course. */
export type CourseKind = 'standard' | 'micro';

/** Kind of a learning activity inside a topic. */
export type ActivityKind = 'reading' | 'task' | 'exercise' | 'discussion' | 'project-step';

/** Kind of an assessment. */
export type AssessmentKind = 'quiz' | 'assignment' | 'practical' | 'research-exercise';

/** Kind of an assessment question. */
export type QuestionType = 'mcq' | 'true-false' | 'short-answer';

/** Competency domain of the SLE competency framework. */
export type CompetencyDomain =
  | 'knowledge'
  | 'skills'
  | 'research'
  | 'digital'
  | 'teaching'
  | 'leadership'
  | 'innovation'
  | 'entrepreneurship'
  | 'professional';

/** Competency proficiency level (1 = foundational .. 5 = expert). */
export type CompetencyLevel = 1 | 2 | 3 | 4 | 5;

/** Kind of a learner credential. */
export type CredentialKind = 'certificate' | 'badge' | 'cpd';

/** Status of a learner credential. */
export type CredentialStatus = 'issued' | 'revoked' | 'expired';

/** Kind of an academic portfolio. */
export type PortfolioKind =
  | 'academic'
  | 'research'
  | 'teaching'
  | 'professional'
  | 'innovation'
  | 'community'
  | 'leadership'
  | 'volunteer'
  | 'awards'
  | 'certification'
  | 'competency'
  | 'digital-badges';

/** Visibility of a portfolio item. */
export type PortfolioItemVisibility = 'private' | 'shared' | 'public';

/** Kind of a learning mentor. */
export type MentorKind =
  | 'supervisor'
  | 'mentor'
  | 'coach'
  | 'peer-mentor'
  | 'industry-mentor'
  | 'institutional-mentor'
  | 'research-mentor'
  | 'community-mentor';

/** Status of a mentorship. */
export type MentorshipStatus = 'requested' | 'matched' | 'agreed' | 'active' | 'closed';

/** Status of a mentorship milestone. */
export type MentorshipMilestoneStatus = 'planned' | 'in-progress' | 'achieved';

/** Kind of a learning event. */
export type LearningEventKind =
  | 'workshop'
  | 'bootcamp'
  | 'masterclass'
  | 'seminar'
  | 'summer-school'
  | 'training-series';

/** Delivery mode of a learning event. */
export type LearningEventMode = 'online' | 'in-person' | 'hybrid';

/** Kind of a learning academy. */
export type AcademyKind =
  | 'institution'
  | 'faculty'
  | 'department'
  | 'doctoral'
  | 'research'
  | 'virtual-research';

/** Analytics scope of the SLE. */
export type AnalyticsScope = 'learner' | 'cohort' | 'faculty' | 'institution' | 'national' | 'global';

/** State of a learning object within a learner's progress. */
export type ProgressState = 'not-started' | 'in-progress' | 'completed';

/** Type of a learning history event. */
export type LearningHistoryEventType =
  | 'enrolled'
  | 'path-started'
  | 'lesson-viewed'
  | 'activity-completed'
  | 'assessment-passed'
  | 'assessment-failed'
  | 'reflection-added'
  | 'course-completed'
  | 'certificate-issued'
  | 'badge-earned'
  | 'mentorship-started'
  | 'cpd-recorded';

/** Kind of an adaptive learning recommendation. */
export type RecommendationKind =
  | 'course'
  | 'path'
  | 'assessment'
  | 'reading-list'
  | 'research-training'
  | 'career'
  | 'cpd'
  | 'intervention'
  | 'competency-gap'
  | 'mentor';

/** Status of a learning goal. */
export type GoalStatus = 'active' | 'achieved' | 'dropped';

/** Kind of an institution in the SLE. */
export type InstitutionKind =
  | 'university'
  | 'polytechnic'
  | 'college-of-education'
  | 'research-institute'
  | 'professional-body'
  | 'agency'
  | 'ngo'
  | 'academy'
  | 'corporate';

// ---------------------------------------------------------------------------
// Vocabularies
// ---------------------------------------------------------------------------

export const LEARNING_NODE_TYPES: readonly LearningNodeType[] = [
  'programme',
  'curriculum',
  'path',
  'course',
  'microCourse',
  'module',
  'lesson',
  'topic',
  'activity',
  'readingList',
  'readingPlaylist',
  'assessment',
] as const;

export const LEARNING_NODE_TYPE_LABELS: Record<LearningNodeType, string> = {
  programme: 'Programme',
  curriculum: 'Curriculum',
  path: 'Learning Path',
  course: 'Course',
  microCourse: 'Micro Course',
  module: 'Module',
  lesson: 'Lesson',
  topic: 'Topic',
  activity: 'Activity',
  readingList: 'Reading List',
  readingPlaylist: 'Reading Playlist',
  assessment: 'Assessment',
};

export const LEARNING_NODE_TYPE_ICONS: Record<LearningNodeType, string> = {
  programme: '🎓',
  curriculum: '📚',
  path: '🧭',
  course: '📘',
  microCourse: '📗',
  module: '🗂️',
  lesson: '📖',
  topic: '📌',
  activity: '✍️',
  readingList: '📄',
  readingPlaylist: '🎧',
  assessment: '✅',
};

export const LEARNING_NODE_STATUSES: readonly LearningNodeStatus[] = ['draft', 'published', 'archived'] as const;

export const LEARNING_NODE_STATUS_LABELS: Record<LearningNodeStatus, string> = {
  draft: 'Draft',
  published: 'Published',
  archived: 'Archived',
};

export const COURSE_KINDS: readonly CourseKind[] = ['standard', 'micro'] as const;

export const COURSE_KIND_LABELS: Record<CourseKind, string> = {
  standard: 'Course',
  micro: 'Micro Course',
};

export const COURSE_KIND_ICONS: Record<CourseKind, string> = {
  standard: '📘',
  micro: '📗',
};

export const ACTIVITY_KINDS: readonly ActivityKind[] = [
  'reading',
  'task',
  'exercise',
  'discussion',
  'project-step',
] as const;

export const ACTIVITY_KIND_LABELS: Record<ActivityKind, string> = {
  reading: 'Reading',
  task: 'Task',
  exercise: 'Exercise',
  discussion: 'Discussion',
  'project-step': 'Project Step',
};

export const ACTIVITY_KIND_ICONS: Record<ActivityKind, string> = {
  reading: '📖',
  task: '🗂️',
  exercise: '📝',
  discussion: '💬',
  'project-step': '🧩',
};

export const ASSESSMENT_KINDS: readonly AssessmentKind[] = [
  'quiz',
  'assignment',
  'practical',
  'research-exercise',
] as const;

export const ASSESSMENT_KIND_LABELS: Record<AssessmentKind, string> = {
  quiz: 'Quiz',
  assignment: 'Assignment',
  practical: 'Practical',
  'research-exercise': 'Research Exercise',
};

export const ASSESSMENT_KIND_ICONS: Record<AssessmentKind, string> = {
  quiz: '❓',
  assignment: '📄',
  practical: '🧪',
  'research-exercise': '🔬',
};

export const QUESTION_TYPES: readonly QuestionType[] = ['mcq', 'true-false', 'short-answer'] as const;

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  mcq: 'Multiple Choice',
  'true-false': 'True / False',
  'short-answer': 'Short Answer',
};

export const COMPETENCY_DOMAINS: readonly CompetencyDomain[] = [
  'knowledge',
  'skills',
  'research',
  'digital',
  'teaching',
  'leadership',
  'innovation',
  'entrepreneurship',
  'professional',
] as const;

export const COMPETENCY_DOMAIN_LABELS: Record<CompetencyDomain, string> = {
  knowledge: 'Knowledge',
  skills: 'Skills',
  research: 'Research',
  digital: 'Digital',
  teaching: 'Teaching',
  leadership: 'Leadership',
  innovation: 'Innovation',
  entrepreneurship: 'Entrepreneurship',
  professional: 'Professional',
};

export const COMPETENCY_DOMAIN_ICONS: Record<CompetencyDomain, string> = {
  knowledge: '🧠',
  skills: '🛠️',
  research: '🔬',
  digital: '💻',
  teaching: '🎓',
  leadership: '🧭',
  innovation: '💡',
  entrepreneurship: '🚀',
  professional: '💼',
};

export const COMPETENCY_LEVELS: readonly CompetencyLevel[] = [1, 2, 3, 4, 5] as const;

export const COMPETENCY_LEVEL_NAMES: Record<CompetencyLevel, string> = {
  1: 'Foundational',
  2: 'Developing',
  3: 'Competent',
  4: 'Proficient',
  5: 'Expert',
};

export const CREDENTIAL_KINDS: readonly CredentialKind[] = ['certificate', 'badge', 'cpd'] as const;

export const CREDENTIAL_KIND_LABELS: Record<CredentialKind, string> = {
  certificate: 'Certificate',
  badge: 'Digital Badge',
  cpd: 'CPD Record',
};

export const CREDENTIAL_KIND_ICONS: Record<CredentialKind, string> = {
  certificate: '🏅',
  badge: '🎖️',
  cpd: '📜',
};

export const CREDENTIAL_STATUSES: readonly CredentialStatus[] = ['issued', 'revoked', 'expired'] as const;

export const CREDENTIAL_STATUS_LABELS: Record<CredentialStatus, string> = {
  issued: 'Issued',
  revoked: 'Revoked',
  expired: 'Expired',
};

export const PORTFOLIO_KINDS: readonly PortfolioKind[] = [
  'academic',
  'research',
  'teaching',
  'professional',
  'innovation',
  'community',
  'leadership',
  'volunteer',
  'awards',
  'certification',
  'competency',
  'digital-badges',
] as const;

export const PORTFOLIO_KIND_LABELS: Record<PortfolioKind, string> = {
  academic: 'Academic',
  research: 'Research',
  teaching: 'Teaching',
  professional: 'Professional',
  innovation: 'Innovation',
  community: 'Community',
  leadership: 'Leadership',
  volunteer: 'Volunteer',
  awards: 'Awards',
  certification: 'Certification',
  competency: 'Competency',
  'digital-badges': 'Digital Badges',
};

export const PORTFOLIO_KIND_ICONS: Record<PortfolioKind, string> = {
  academic: '🎓',
  research: '🔬',
  teaching: '👩‍🏫',
  professional: '💼',
  innovation: '💡',
  community: '🤝',
  leadership: '🧭',
  volunteer: '🙋',
  awards: '🏆',
  certification: '📜',
  competency: '🧠',
  'digital-badges': '🎖️',
};

export const PORTFOLIO_ITEM_VISIBILITIES: readonly PortfolioItemVisibility[] = [
  'private',
  'shared',
  'public',
] as const;

export const PORTFOLIO_ITEM_VISIBILITY_LABELS: Record<PortfolioItemVisibility, string> = {
  private: 'Private',
  shared: 'Shared',
  public: 'Public',
};

export const MENTOR_KINDS: readonly MentorKind[] = [
  'supervisor',
  'mentor',
  'coach',
  'peer-mentor',
  'industry-mentor',
  'institutional-mentor',
  'research-mentor',
  'community-mentor',
] as const;

export const MENTOR_KIND_LABELS: Record<MentorKind, string> = {
  supervisor: 'Supervisor',
  mentor: 'Mentor',
  coach: 'Coach',
  'peer-mentor': 'Peer Mentor',
  'industry-mentor': 'Industry Mentor',
  'institutional-mentor': 'Institutional Mentor',
  'research-mentor': 'Research Mentor',
  'community-mentor': 'Community Mentor',
};

export const MENTOR_KIND_ICONS: Record<MentorKind, string> = {
  supervisor: '🧑‍🏫',
  mentor: '🧭',
  coach: '🏀',
  'peer-mentor': '🤝',
  'industry-mentor': '🏢',
  'institutional-mentor': '🏛️',
  'research-mentor': '🔬',
  'community-mentor': '🌍',
};

export const MENTORSHIP_STATUSES: readonly MentorshipStatus[] = [
  'requested',
  'matched',
  'agreed',
  'active',
  'closed',
] as const;

export const MENTORSHIP_STATUS_LABELS: Record<MentorshipStatus, string> = {
  requested: 'Requested',
  matched: 'Matched',
  agreed: 'Agreed',
  active: 'Active',
  closed: 'Closed',
};

export const MENTORSHIP_MILESTONE_STATUSES: readonly MentorshipMilestoneStatus[] = [
  'planned',
  'in-progress',
  'achieved',
] as const;

export const MENTORSHIP_MILESTONE_STATUS_LABELS: Record<MentorshipMilestoneStatus, string> = {
  planned: 'Planned',
  'in-progress': 'In Progress',
  achieved: 'Achieved',
};

export const LEARNING_EVENT_KINDS: readonly LearningEventKind[] = [
  'workshop',
  'bootcamp',
  'masterclass',
  'seminar',
  'summer-school',
  'training-series',
] as const;

export const LEARNING_EVENT_KIND_LABELS: Record<LearningEventKind, string> = {
  workshop: 'Workshop',
  bootcamp: 'Bootcamp',
  masterclass: 'Masterclass',
  seminar: 'Seminar',
  'summer-school': 'Summer School',
  'training-series': 'Training Series',
};

export const LEARNING_EVENT_KIND_ICONS: Record<LearningEventKind, string> = {
  workshop: '🛠️',
  bootcamp: '🔥',
  masterclass: '🎓',
  seminar: '💬',
  'summer-school': '☀️',
  'training-series': '📅',
};

export const LEARNING_EVENT_MODES: readonly LearningEventMode[] = ['online', 'in-person', 'hybrid'] as const;

export const LEARNING_EVENT_MODE_LABELS: Record<LearningEventMode, string> = {
  online: 'Online',
  'in-person': 'In Person',
  hybrid: 'Hybrid',
};

export const ACADEMY_KINDS: readonly AcademyKind[] = [
  'institution',
  'faculty',
  'department',
  'doctoral',
  'research',
  'virtual-research',
] as const;

export const ACADEMY_KIND_LABELS: Record<AcademyKind, string> = {
  institution: 'Institution',
  faculty: 'Faculty',
  department: 'Department',
  doctoral: 'Doctoral School',
  research: 'Research School',
  'virtual-research': 'Virtual Research School',
};

export const ACADEMY_KIND_ICONS: Record<AcademyKind, string> = {
  institution: '🏛️',
  faculty: '🏫',
  department: '🏬',
  doctoral: '🎓',
  research: '🔬',
  'virtual-research': '🌐',
};

export const ANALYTICS_SCOPES: readonly AnalyticsScope[] = [
  'learner',
  'cohort',
  'faculty',
  'institution',
  'national',
  'global',
] as const;

export const ANALYTICS_SCOPE_LABELS: Record<AnalyticsScope, string> = {
  learner: 'Learner',
  cohort: 'Cohort',
  faculty: 'Faculty',
  institution: 'Institution',
  national: 'National',
  global: 'Global',
};

export const PROGRESS_STATES: readonly ProgressState[] = ['not-started', 'in-progress', 'completed'] as const;

export const PROGRESS_STATE_LABELS: Record<ProgressState, string> = {
  'not-started': 'Not Started',
  'in-progress': 'In Progress',
  completed: 'Completed',
};

export const LEARNING_HISTORY_EVENT_TYPES: readonly LearningHistoryEventType[] = [
  'enrolled',
  'path-started',
  'lesson-viewed',
  'activity-completed',
  'assessment-passed',
  'assessment-failed',
  'reflection-added',
  'course-completed',
  'certificate-issued',
  'badge-earned',
  'mentorship-started',
  'cpd-recorded',
] as const;

export const LEARNING_HISTORY_EVENT_TYPE_LABELS: Record<LearningHistoryEventType, string> = {
  enrolled: 'Enrolled',
  'path-started': 'Path Started',
  'lesson-viewed': 'Lesson Viewed',
  'activity-completed': 'Activity Completed',
  'assessment-passed': 'Assessment Passed',
  'assessment-failed': 'Assessment Failed',
  'reflection-added': 'Reflection Added',
  'course-completed': 'Course Completed',
  'certificate-issued': 'Certificate Issued',
  'badge-earned': 'Badge Earned',
  'mentorship-started': 'Mentorship Started',
  'cpd-recorded': 'CPD Recorded',
};

export const RECOMMENDATION_KINDS: readonly RecommendationKind[] = [
  'course',
  'path',
  'assessment',
  'reading-list',
  'research-training',
  'career',
  'cpd',
  'intervention',
  'competency-gap',
  'mentor',
] as const;

export const RECOMMENDATION_KIND_LABELS: Record<RecommendationKind, string> = {
  course: 'Course',
  path: 'Learning Path',
  assessment: 'Assessment',
  'reading-list': 'Reading List',
  'research-training': 'Research Training',
  career: 'Career',
  cpd: 'CPD',
  intervention: 'Intervention',
  'competency-gap': 'Competency Gap',
  mentor: 'Mentor',
};

export const RECOMMENDATION_KIND_ICONS: Record<RecommendationKind, string> = {
  course: '📘',
  path: '🧭',
  assessment: '✅',
  'reading-list': '📄',
  'research-training': '🔬',
  career: '💼',
  cpd: '📜',
  intervention: '🚦',
  'competency-gap': '🧩',
  mentor: '🤝',
};

export const GOAL_STATUSES: readonly GoalStatus[] = ['active', 'achieved', 'dropped'] as const;

export const GOAL_STATUS_LABELS: Record<GoalStatus, string> = {
  active: 'Active',
  achieved: 'Achieved',
  dropped: 'Dropped',
};

export const INSTITUTION_KINDS: readonly InstitutionKind[] = [
  'university',
  'polytechnic',
  'college-of-education',
  'research-institute',
  'professional-body',
  'agency',
  'ngo',
  'academy',
  'corporate',
] as const;

export const INSTITUTION_KIND_LABELS: Record<InstitutionKind, string> = {
  university: 'University',
  polytechnic: 'Polytechnic',
  'college-of-education': 'College of Education',
  'research-institute': 'Research Institute',
  'professional-body': 'Professional Body',
  agency: 'Agency',
  ngo: 'Non-Governmental Organisation',
  academy: 'Academy',
  corporate: 'Corporate',
};

// ---------------------------------------------------------------------------
// Learning objects
// ---------------------------------------------------------------------------

/** Reference to a learning object by kind + canonical id. */
export type LearningObjectRef = {
  nodeType: LearningNodeType;
  nodeId: string;
};

/**
 * Node kinds that appear in workflow events, validation issues, and
 * recommendations beyond the course tree (credentials, goals, and so on).
 */
export type LearningReferenceNodeType =
  | LearningNodeType
  | 'certificate'
  | 'badge'
  | 'cpd'
  | 'passport'
  | 'portfolio'
  | 'goal'
  | 'competency'
  | 'mentorship'
  | 'institution'
  | 'rubric';

/** Reference to any SLE object by extended kind + canonical id. */
export type LearningEventObjectRef = {
  nodeType: LearningReferenceNodeType;
  nodeId: string;
  title?: string;
};

/** Lightweight reference to a researcher. */
export type ResearcherRef = {
  username: string;
  name?: string;
  avatarUrl?: string;
};

/** A stated learning outcome of a course or curriculum. */
export type LearningOutcome = {
  id: string;
  statement: string;
};

/** Rubric criterion used to grade an assessment. */
export type LearningRubricCriterion = {
  id: string;
  statement: string;
  maxScore: number;
};

/** Grading rubric shared across assessments. */
export type LearningRubric = {
  id: string;
  title: string;
  criteria: LearningRubricCriterion[];
  createdAt: string;
  updatedAt: string;
};

/** A single assessment question. */
export type LearningQuestion = {
  id: string;
  prompt: string;
  type: QuestionType;
  options?: string[];
  answer?: string;
};

/** A learning activity nested inside a topic. */
export type LearningActivity = {
  id: string;
  slug: string;
  title: string;
  description: string;
  position: number;
  kind: ActivityKind;
  assessmentId?: string;
  createdAt: string;
  updatedAt: string;
};

/** A topic nested inside a lesson. */
export type LearningTopic = {
  id: string;
  slug: string;
  title: string;
  description: string;
  position: number;
  activities: LearningActivity[];
  createdAt: string;
  updatedAt: string;
};

/** A lesson nested inside a module. */
export type LearningLesson = {
  id: string;
  slug: string;
  title: string;
  description: string;
  position: number;
  topics: LearningTopic[];
  readingListId?: string;
  createdAt: string;
  updatedAt: string;
};

/** A module nested inside a course. */
export type LearningModule = {
  id: string;
  slug: string;
  title: string;
  description: string;
  position: number;
  lessons: LearningLesson[];
  createdAt: string;
  updatedAt: string;
};

/** A standard or micro course in the SLE. */
export type LearningCourse = {
  id: string;
  slug: string;
  title: string;
  description: string;
  status: LearningNodeStatus;
  courseKind: CourseKind;
  category: string;
  level: CompetencyLevel;
  durationHours: number;
  institutionId?: string;
  institutionName?: string;
  instructorUsername?: string;
  curriculumId?: string;
  outcomes: LearningOutcome[];
  modules: LearningModule[];
  createdAt: string;
  updatedAt: string;
};

/** A curriculum grouping a set of courses. */
export type LearningCurriculum = {
  id: string;
  slug: string;
  title: string;
  description: string;
  position: number;
  courses: LearningCourse[];
  createdAt: string;
  updatedAt: string;
};

/** A programme grouping a set of curricula. */
export type LearningProgramme = {
  id: string;
  slug: string;
  title: string;
  description: string;
  qualification: string;
  durationLabel: string;
  institutionId?: string;
  institutionName?: string;
  curricula: LearningCurriculum[];
  createdAt: string;
  updatedAt: string;
};

/** A step within a personal learning path. */
export type LearningPathItem = {
  id: string;
  position: number;
  title: string;
  ref: LearningObjectRef;
};

/** A personal, goal-oriented learning path. */
export type LearningPath = {
  id: string;
  slug: string;
  title: string;
  description: string;
  ownerUsername: string;
  purpose: string;
  items: LearningPathItem[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
};

/** An assessment attached to a learning object. */
export type LearningAssessment = {
  id: string;
  title: string;
  description: string;
  kind: AssessmentKind;
  learningObjectId: string;
  rubricId?: string;
  competencyKeys: string[];
  timeLimitMinutes?: number;
  passMark: number;
  lifecycleStageId?: ResearchLifecycleStageId;
  createdAt: string;
  updatedAt: string;
};

/** An item of a reading list. */
export type LearningReadingListItem = {
  id: string;
  position: number;
  title: string;
  authors?: string;
  year?: number;
  doi?: string;
  publicationType?: string;
};

/** A curated reading list. */
export type LearningReadingList = {
  id: string;
  slug: string;
  title: string;
  description: string;
  ownerUsername?: string;
  items: LearningReadingListItem[];
  createdAt: string;
  updatedAt: string;
};

/** An item of a reading playlist (references another learning object). */
export type LearningReadingPlaylistItem = {
  id: string;
  position: number;
  title: string;
  ref: LearningObjectRef;
};

/** A reading playlist composing learning objects in sequence. */
export type LearningReadingPlaylist = {
  id: string;
  slug: string;
  title: string;
  description: string;
  ownerUsername?: string;
  items: LearningReadingPlaylistItem[];
  createdAt: string;
  updatedAt: string;
};

// ---------------------------------------------------------------------------
// Competency framework
// ---------------------------------------------------------------------------

/** A named proficiency level within a competency framework. */
export type CompetencyLevelModel = {
  level: CompetencyLevel;
  name: string;
};

/** A skill referenced by competencies. */
export type Skill = {
  id: string;
  key: string;
  name: string;
  description: string;
};

/** A knowledge area referenced by competencies. */
export type KnowledgeArea = {
  id: string;
  key: string;
  name: string;
  description: string;
};

/** A single competency in a competency framework. */
export type LearningCompetency = {
  id: string;
  key: string;
  name: string;
  description: string;
  domain: CompetencyDomain;
  frameworkId: string;
  targetLevel: CompetencyLevel;
  skills: string[];
  knowledgeAreas: string[];
  prerequisites: string[];
};

/** A competency framework with named levels and competencies. */
export type CompetencyFramework = {
  id: string;
  name: string;
  description: string;
  version: string;
  levels: CompetencyLevelModel[];
  competencies: LearningCompetency[];
};

// ---------------------------------------------------------------------------
// Credentials
// ---------------------------------------------------------------------------

/** Base shape of a learner credential. */
export type CredentialBase = {
  id: string;
  kind: CredentialKind;
  title: string;
  issuerUsername: string;
  issuerName: string;
  learnerUsername: string;
  learnerName: string;
  issuedAt: string;
  verificationReference: string;
  status: CredentialStatus;
};

/** A course completion certificate. */
export type LearningCertificate = CredentialBase & {
  kind: 'certificate';
  courseId: string;
  completedAt: string;
};

/** A digital badge. */
export type LearningBadge = CredentialBase & {
  kind: 'badge';
  competencyKey?: string;
  imageUrl: string;
  standard?: string;
};

/** A continuing professional development record. */
export type LearningCpdRecord = CredentialBase & {
  kind: 'cpd';
  hours: number;
  activityTitle: string;
  activityDate?: string;
};

/** A learner credential (certificate | badge | cpd record). */
export type LearningCredential = LearningCertificate | LearningBadge | LearningCpdRecord;

/** A learner's digital passport holding all credentials. */
export type LearningPassport = {
  id: string;
  learnerUsername: string;
  certificates: LearningCertificate[];
  badges: LearningBadge[];
  cpdRecords: LearningCpdRecord[];
  updatedAt: string;
};

// ---------------------------------------------------------------------------
// Portfolio
// ---------------------------------------------------------------------------

/** An entry inside a portfolio. */
export type PortfolioItem = {
  id: string;
  title: string;
  kind: PortfolioKind;
  date?: string;
  evidenceRef?: string;
  evidenceType?: string;
  visibility: PortfolioItemVisibility;
};

/** A learner's academic portfolio. */
export type LearningPortfolio = {
  id: string;
  learnerUsername: string;
  kind: PortfolioKind;
  title: string;
  description: string;
  items: PortfolioItem[];
  createdAt: string;
  updatedAt: string;
};

// ---------------------------------------------------------------------------
// Mentorship
// ---------------------------------------------------------------------------

/** A learning mentor (a canonical researcher in a mentor role). */
export type LearningMentor = {
  username: string;
  name: string;
  kind: MentorKind;
  expertise: string[];
  institutionId?: string;
  institutionName?: string;
};

/** A milestone within a mentorship. */
export type MentorshipMilestone = {
  id: string;
  title: string;
  status: MentorshipMilestoneStatus;
  dueDate?: string;
};

/** A mentorship between a mentor and a mentee. */
export type LearningMentorship = {
  id: string;
  mentorUsername: string;
  mentorName: string;
  menteeUsername: string;
  menteeName: string;
  kind: MentorKind;
  status: MentorshipStatus;
  startedAt?: string;
  milestones: MentorshipMilestone[];
  createdAt: string;
  updatedAt: string;
};

// ---------------------------------------------------------------------------
// Events and academies
// ---------------------------------------------------------------------------

/** A learning event (workshop, bootcamp, masterclass, ...). */
export type LearningEvent = {
  id: string;
  slug: string;
  title: string;
  description: string;
  kind: LearningEventKind;
  mode: LearningEventMode;
  hostUsername: string;
  hostName: string;
  startAt: string;
  endAt: string;
  capacity?: number;
  academyId?: string;
  registrationCount?: number;
  createdAt: string;
};

/** A learning academy. */
export type LearningAcademy = {
  id: string;
  slug: string;
  name: string;
  description: string;
  kind: AcademyKind;
  institutionId?: string;
  institutionName?: string;
  members: string[];
  createdAt: string;
};

// ---------------------------------------------------------------------------
// Institution
// ---------------------------------------------------------------------------

/** A lightweight canonical institution reference in the SLE. */
export type LearningInstitution = {
  id: string;
  name: string;
  shortName: string;
  country: string;
  kind: InstitutionKind;
};

// ---------------------------------------------------------------------------
// Analytics and learner records
// ---------------------------------------------------------------------------

/** KPI metrics of a learner or cohort in the SLE. */
export type LearningKpis = {
  progressRate: number;
  completionRate: number;
  retentionRate: number;
  engagementIndex: number;
  learningVelocity: number;
  competencyAttainment: number;
  dropOffRisk: number;
  interventionCoverage: number;
};

/** Learning analytics snapshot at a scope. */
export type LearningAnalytics = {
  scope: AnalyticsScope;
  scopeId: string;
  learnerUsername?: string;
  kpis: LearningKpis;
  generatedAt: string;
  evidenceVersion: string;
};

/** A learner's progress entry for a learning object. */
export type LearningProgressEntry = {
  nodeType: LearningNodeType;
  learningObjectId: string;
  state: ProgressState;
  completedAt?: string;
  score?: number;
};

/** A single learning history event. */
export type LearningHistoryEntry = {
  id: string;
  learnerUsername: string;
  eventType: LearningHistoryEventType;
  objectRef?: LearningObjectRef;
  detail?: string;
  occurredAt: string;
};

/** A learning goal of a learner. */
export type LearningGoal = {
  id: string;
  learnerUsername: string;
  statement: string;
  targetCompetencyKeys: string[];
  status: GoalStatus;
  createdAt: string;
};

/** An adaptive recommendation for a learner. */
export type LearningAdaptiveRecommendation = {
  id: string;
  learnerUsername: string;
  kind: RecommendationKind;
  title: string;
  description: string;
  target?: LearningObjectRef;
  reason: string;
  applied: boolean;
  createdAt: string;
};

// ---------------------------------------------------------------------------
// Query surface
// ---------------------------------------------------------------------------

/** Filtering options for the course catalogue. */
export type LearningFilter = {
  category?: string;
  courseKind?: CourseKind;
  domain?: CompetencyDomain;
  status?: LearningNodeStatus;
  level?: CompetencyLevel;
};

/** Sorting options for the course catalogue. */
export type LearningSort = 'recent' | 'title' | 'level' | 'duration' | 'progress';

/** Statistics across the whole SLE dataset. */
export type LearningStatistics = {
  totalProgrammes: number;
  totalCurricula: number;
  totalCourses: number;
  totalMicroCourses: number;
  totalModules: number;
  totalLessons: number;
  totalTopics: number;
  totalActivities: number;
  totalAssessments: number;
  totalReadingLists: number;
  totalReadingPlaylists: number;
  totalCompetencies: number;
  totalSkills: number;
  totalKnowledgeAreas: number;
  totalRubrics: number;
  totalCertificates: number;
  totalBadges: number;
  totalCpdHours: number;
  totalMentors: number;
  totalMentorships: number;
  totalAcademies: number;
  totalEvents: number;
  totalPaths: number;
  totalGoals: number;
  totalLearners: number;
  totalInstitutions: number;
  totalPortfolios: number;
};

// ---------------------------------------------------------------------------
// Roles and permissions (Wave 2)
// ---------------------------------------------------------------------------

/** Role of an actor inside the SLE permission engine. */
export type LearningRole =
  | 'student'
  | 'researcher'
  | 'lecturer'
  | 'supervisor'
  | 'mentor'
  | 'reviewer'
  | 'institution-admin'
  | 'faculty-admin'
  | 'department-admin'
  | 'platform-admin'
  | 'crie'
  | 'system-ai';

/** Action an actor may attempt on a SLE resource. */
export type LearningAction =
  | 'read'
  | 'create'
  | 'update'
  | 'delete'
  | 'approve'
  | 'review'
  | 'certify'
  | 'recommend'
  | 'mentor'
  | 'moderate'
  | 'assign'
  | 'export';

/** Kind of a resource governed by the SLE permission engine. */
export type LearningResourceKind =
  | 'programme'
  | 'curriculum'
  | 'course'
  | 'microCourse'
  | 'module'
  | 'lesson'
  | 'topic'
  | 'activity'
  | 'assessment'
  | 'reading-list'
  | 'reading-playlist'
  | 'path'
  | 'competency'
  | 'certificate'
  | 'badge'
  | 'cpd'
  | 'passport'
  | 'portfolio'
  | 'mentor'
  | 'mentorship'
  | 'event'
  | 'academy'
  | 'institution'
  | 'goal'
  | 'recommendation'
  | 'analytics'
  | 'notification';

/** Result of a single permission check. */
export type LearningPermissionDecision = {
  allowed: boolean;
  role: LearningRole;
  action: LearningAction;
  resource: LearningResourceKind;
  reason?: string;
};

/** Assignment of a role to a canonical researcher, optionally scoped. */
export type LearningRoleAssignment = {
  id: string;
  username: string;
  role: LearningRole;
  scopeType?: 'platform' | 'institution' | 'faculty' | 'department' | 'programme' | 'course';
  scopeId?: string;
  grantedAt: string;
};

// ---------------------------------------------------------------------------
// Workflow engine (Wave 2)
// ---------------------------------------------------------------------------

/** Kind of a workflow orchestration step inside the SLE. */
export type LearningWorkflowKind =
  | 'enrolment'
  | 'withdrawal'
  | 'topic-completion'
  | 'lesson-completion'
  | 'module-completion'
  | 'course-completion'
  | 'path-progress'
  | 'curriculum-progress'
  | 'programme-progress'
  | 'research-exercise-progress'
  | 'assessment'
  | 'certificate'
  | 'badge'
  | 'cpd'
  | 'passport'
  | 'portfolio'
  | 'competency'
  | 'goal-completion';

/** A single orchestrated workflow event emitted by the SLE workflow engine. */
export type LearningWorkflowEvent = {
  id: string;
  kind: LearningWorkflowKind;
  learnerUsername: string;
  actorUsername: string;
  objectRef?: LearningEventObjectRef;
  detail?: string;
  occurredAt: string;
};

// ---------------------------------------------------------------------------
// Validation engine (Wave 2)
// ---------------------------------------------------------------------------

/** Severity of a validation finding. */
export type LearningValidationSeverity = 'error' | 'warning' | 'info';

/** Stable machine code of a validation finding. */
export type LearningValidationCode =
  | 'missing-field'
  | 'duplicate'
  | 'broken-reference'
  | 'missing-prerequisite'
  | 'dependency-cycle'
  | 'threshold-invalid'
  | 'unresolved-competency'
  | 'capacity-exceeded'
  | 'date-range-invalid'
  | 'pass-mark-invalid'
  | 'credential-invalid'
  | 'relationship-invalid'
  | 'name-collision'
  | 'other';

/** A single finding produced by the SLE validation engine. */
export type LearningValidationIssue = {
  code: LearningValidationCode;
  severity: LearningValidationSeverity;
  message: string;
  ref?: LearningEventObjectRef;
  field?: string;
};

/** Complete report of a validation pass over a SLE resource. */
export type LearningValidationReport = {
  target: string;
  issues: LearningValidationIssue[];
  valid: boolean;
  errorCount: number;
  warningCount: number;
};

// ---------------------------------------------------------------------------
// Recommendation engine (Wave 2)
// ---------------------------------------------------------------------------

/** Scope of a recommendation produced by the SLE recommendation engine. */
export type LearningRecommendationScope =
  | 'course'
  | 'micro-course'
  | 'reading-list'
  | 'mentor'
  | 'competency'
  | 'research-training'
  | 'career'
  | 'cpd'
  | 'gap'
  | 'pathway';

/** A rule-based recommendation for a learner. */
export type LearningRecommendation = {
  id: string;
  learnerUsername: string;
  scope: LearningRecommendationScope;
  title: string;
  description: string;
  target?: LearningEventObjectRef;
  reason: string;
  score: number;
  applied: boolean;
  createdAt: string;
};

/** Options shared by recommendation engine functions. */
export type LearningRecommendationOptions = {
  learnerUsername?: string;
  top?: number;
  excludeApplied?: boolean;
  onlyNotStarted?: boolean;
};

// ---------------------------------------------------------------------------
// Adaptive learning engine (Wave 2)
// ---------------------------------------------------------------------------

/** Availability state of a learning object under adaptive rules. */
export type LearningUnlockState = 'locked' | 'available' | 'in-progress' | 'completed';

/** A learner's adaptive readiness snapshot. */
export type LearningReadinessProfile = {
  learnerUsername: string;
  readiness: number;
  unmetPrerequisites: string[];
  missingDependencies: string[];
  suggestedLevel: CompetencyLevel;
  pace: 'slow' | 'steady' | 'fast';
};

/** A single step of an adaptive learning sequence. */
export type LearningSequenceItem = {
  ref: LearningObjectRef;
  position: number;
  state: LearningUnlockState;
  prerequisitesMet: boolean;
};

// ---------------------------------------------------------------------------
// Analytics engine (Wave 2)
// ---------------------------------------------------------------------------

/** Numerator/denominator with a derived percentage. */
export type LearningPercentageBreakdown = {
  numerator: number;
  denominator: number;
  percent: number;
};

/** Organisational unit the SLE analytics engine can aggregate by. */
export type LearningOrganisationalUnit = {
  id: string;
  name: string;
  kind: 'institution' | 'faculty' | 'department' | 'programme';
  parentId?: string;
  courseIds: string[];
};

/** Aggregated statistics for an organisational unit. */
export type LearningOrganisationStatistics = {
  unit: LearningOrganisationalUnit;
  courseCount: number;
  learners: number;
  enrolmentCount: number;
  completionRate: number;
  engagementIndex: number;
  averageProgress: number;
  competencyAttainment: number;
};

/** Progress of a learner goal against its target competencies. */
export type LearningGoalProgressStat = {
  goalId: string;
  statement: string;
  targetCompetencyKeys: string[];
  achievedKeys: string[];
  progress: number;
  status: GoalStatus;
};

/** Mentorship activity aggregates for a user. */
export type LearningMentorshipActivityStat = {
  username: string;
  total: number;
  active: number;
  requested: number;
  completed: number;
};

/** Coverage of a learner's portfolio across portfolio kinds. */
export type LearningPortfolioCoverage = {
  learnerUsername: string;
  kinds: PortfolioKind[];
  itemCount: number;
  sharedCount: number;
  publicCount: number;
};

/** Continuing professional development statistics. */
export type LearningCpdStat = {
  hours: number;
  records: number;
  targetHours?: number;
  percent: number;
};

/** Knowledge vs skill competency breakdown. */
export type LearningKnowledgeSkillStat = {
  knowledgeCompetencies: number;
  knowledgeAttainment: number;
  skillCompetencies: number;
  skillAttainment: number;
  otherAttainment: number;
};

// ---------------------------------------------------------------------------
// Portfolio evidence engine (Wave 2)
// ---------------------------------------------------------------------------

/** Provenance kind of a piece of portfolio evidence. */
export type LearningPortfolioEvidenceKind =
  | 'certificate'
  | 'badge'
  | 'cpd'
  | 'research-output'
  | 'teaching-activity'
  | 'mentorship-activity'
  | 'assessment'
  | 'event'
  | 'publication'
  | 'reflection';

/** A piece of evidence collected into a learner's portfolio. */
export type LearningPortfolioEvidence = {
  id: string;
  learnerUsername: string;
  kind: LearningPortfolioEvidenceKind;
  title: string;
  sourceRef?: string;
  date?: string;
  verified: boolean;
  portfolioKinds: PortfolioKind[];
};

// ---------------------------------------------------------------------------
// Notification contracts (Wave 2)
// ---------------------------------------------------------------------------

/** Kind of a notification event emitted by the SLE. */
export type LearningNotificationKind =
  | 'enrolment'
  | 'completion'
  | 'assessment'
  | 'certification'
  | 'badge'
  | 'mentorship'
  | 'goal-achieved'
  | 'recommendation-available'
  | 'portfolio-updated'
  | 'passport-updated';

/** Priority of a SLE notification event. */
export type LearningNotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

/** A notification event contract emitted by the SLE (logic, not UI). */
export type LearningNotificationEvent = {
  id: string;
  kind: LearningNotificationKind;
  actorUsername: string;
  recipientUsernames: string[];
  objectRef?: LearningEventObjectRef;
  detail: string;
  occurredAt: string;
  channel: 'in-app' | 'email' | 'push';
  priority: LearningNotificationPriority;
};

// ---------------------------------------------------------------------------
// Wave 2 vocabularies
// ---------------------------------------------------------------------------

export const LEARNING_ROLES: readonly LearningRole[] = [
  'student',
  'researcher',
  'lecturer',
  'supervisor',
  'mentor',
  'reviewer',
  'institution-admin',
  'faculty-admin',
  'department-admin',
  'platform-admin',
  'crie',
  'system-ai',
] as const;

export const LEARNING_ROLE_LABELS: Record<LearningRole, string> = {
  student: 'Student',
  researcher: 'Researcher',
  lecturer: 'Lecturer',
  supervisor: 'Supervisor',
  mentor: 'Mentor',
  reviewer: 'Reviewer',
  'institution-admin': 'Institution Admin',
  'faculty-admin': 'Faculty Admin',
  'department-admin': 'Department Admin',
  'platform-admin': 'Platform Admin',
  crie: 'CRIE',
  'system-ai': 'System AI',
};

export const LEARNING_ROLE_ICONS: Record<LearningRole, string> = {
  student: 'graduation-cap',
  researcher: 'microscope',
  lecturer: 'chalkboard',
  supervisor: 'user-tie',
  mentor: 'user-graduate',
  reviewer: 'clipboard-check',
  'institution-admin': 'building-columns',
  'faculty-admin': 'building',
  'department-admin': 'folder-tree',
  'platform-admin': 'server',
  crie: 'shield-halved',
  'system-ai': 'robot',
};

export const LEARNING_ACTIONS: readonly LearningAction[] = [
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
] as const;

export const LEARNING_ACTION_LABELS: Record<LearningAction, string> = {
  read: 'Read',
  create: 'Create',
  update: 'Update',
  delete: 'Delete',
  approve: 'Approve',
  review: 'Review',
  certify: 'Certify',
  recommend: 'Recommend',
  mentor: 'Mentor',
  moderate: 'Moderate',
  assign: 'Assign',
  export: 'Export',
};

export const LEARNING_ACTION_ICONS: Record<LearningAction, string> = {
  read: 'eye',
  create: 'plus-circle',
  update: 'pen',
  delete: 'trash',
  approve: 'circle-check',
  review: 'file-pen',
  certify: 'award',
  recommend: 'lightbulb',
  mentor: 'users',
  moderate: 'gavel',
  assign: 'user-plus',
  export: 'download',
};

export const LEARNING_RESOURCE_KINDS: readonly LearningResourceKind[] = [
  'programme',
  'curriculum',
  'course',
  'microCourse',
  'module',
  'lesson',
  'topic',
  'activity',
  'assessment',
  'reading-list',
  'reading-playlist',
  'path',
  'competency',
  'certificate',
  'badge',
  'cpd',
  'passport',
  'portfolio',
  'mentor',
  'mentorship',
  'event',
  'academy',
  'institution',
  'goal',
  'recommendation',
  'analytics',
  'notification',
] as const;

export const LEARNING_RESOURCE_KIND_LABELS: Record<LearningResourceKind, string> = {
  programme: 'Programme',
  curriculum: 'Curriculum',
  course: 'Course',
  microCourse: 'Micro Course',
  module: 'Module',
  lesson: 'Lesson',
  topic: 'Topic',
  activity: 'Activity',
  assessment: 'Assessment',
  'reading-list': 'Reading List',
  'reading-playlist': 'Reading Playlist',
  path: 'Learning Path',
  competency: 'Competency',
  certificate: 'Certificate',
  badge: 'Badge',
  cpd: 'CPD Record',
  passport: 'Passport',
  portfolio: 'Portfolio',
  mentor: 'Mentor',
  mentorship: 'Mentorship',
  event: 'Event',
  academy: 'Academy',
  institution: 'Institution',
  goal: 'Goal',
  recommendation: 'Recommendation',
  analytics: 'Analytics',
  notification: 'Notification',
};

export const LEARNING_WORKFLOW_KINDS: readonly LearningWorkflowKind[] = [
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
] as const;

export const LEARNING_WORKFLOW_KIND_LABELS: Record<LearningWorkflowKind, string> = {
  enrolment: 'Enrolment',
  withdrawal: 'Withdrawal',
  'topic-completion': 'Topic Completion',
  'lesson-completion': 'Lesson Completion',
  'module-completion': 'Module Completion',
  'course-completion': 'Course Completion',
  'path-progress': 'Path Progress',
  'curriculum-progress': 'Curriculum Progress',
  'programme-progress': 'Programme Progress',
  'research-exercise-progress': 'Research Exercise Progress',
  assessment: 'Assessment',
  certificate: 'Certificate',
  badge: 'Badge',
  cpd: 'CPD Record',
  passport: 'Passport',
  portfolio: 'Portfolio',
  competency: 'Competency',
  'goal-completion': 'Goal Completion',
};

export const LEARNING_VALIDATION_SEVERITIES: readonly LearningValidationSeverity[] = ['error', 'warning', 'info'] as const;

export const LEARNING_RECOMMENDATION_SCOPES: readonly LearningRecommendationScope[] = [
  'course',
  'micro-course',
  'reading-list',
  'mentor',
  'competency',
  'research-training',
  'career',
  'cpd',
  'gap',
  'pathway',
] as const;

export const LEARNING_RECOMMENDATION_SCOPE_LABELS: Record<LearningRecommendationScope, string> = {
  course: 'Course',
  'micro-course': 'Micro Course',
  'reading-list': 'Reading List',
  mentor: 'Mentor',
  competency: 'Competency',
  'research-training': 'Research Training',
  career: 'Career',
  cpd: 'CPD',
  gap: 'Competency Gap',
  pathway: 'Personal Pathway',
};

export const LEARNING_UNLOCK_STATES: readonly LearningUnlockState[] = ['locked', 'available', 'in-progress', 'completed'] as const;

export const LEARNING_PORTFOLIO_EVIDENCE_KINDS: readonly LearningPortfolioEvidenceKind[] = [
  'certificate',
  'badge',
  'cpd',
  'research-output',
  'teaching-activity',
  'mentorship-activity',
  'assessment',
  'event',
  'publication',
  'reflection',
] as const;

export const LEARNING_PORTFOLIO_EVIDENCE_KIND_LABELS: Record<LearningPortfolioEvidenceKind, string> = {
  certificate: 'Certificate',
  badge: 'Badge',
  cpd: 'CPD Record',
  'research-output': 'Research Output',
  'teaching-activity': 'Teaching Activity',
  'mentorship-activity': 'Mentorship Activity',
  assessment: 'Assessment',
  event: 'Event',
  publication: 'Publication',
  reflection: 'Reflection',
};

export const LEARNING_PORTFOLIO_EVIDENCE_KIND_ICONS: Record<LearningPortfolioEvidenceKind, string> = {
  certificate: 'file-certificate',
  badge: 'medal',
  cpd: 'clock',
  'research-output': 'flask',
  'teaching-activity': 'chalkboard',
  'mentorship-activity': 'users',
  assessment: 'clipboard-check',
  event: 'calendar',
  publication: 'book',
  reflection: 'message-circle',
};

export const LEARNING_NOTIFICATION_KINDS: readonly LearningNotificationKind[] = [
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
] as const;

export const LEARNING_NOTIFICATION_KIND_LABELS: Record<LearningNotificationKind, string> = {
  enrolment: 'Enrolment',
  completion: 'Completion',
  assessment: 'Assessment',
  certification: 'Certification',
  badge: 'Badge',
  mentorship: 'Mentorship',
  'goal-achieved': 'Goal Achieved',
  'recommendation-available': 'Recommendation Available',
  'portfolio-updated': 'Portfolio Updated',
  'passport-updated': 'Passport Updated',
};

export const LEARNING_NOTIFICATION_KIND_ICONS: Record<LearningNotificationKind, string> = {
  enrolment: 'user-plus',
  completion: 'circle-check',
  assessment: 'clipboard-check',
  certification: 'award',
  badge: 'medal',
  mentorship: 'users',
  'goal-achieved': 'flag',
  'recommendation-available': 'lightbulb',
  'portfolio-updated': 'folder-open',
  'passport-updated': 'id-card',
};

export const LEARNING_NOTIFICATION_PRIORITIES: readonly LearningNotificationPriority[] = ['low', 'normal', 'high', 'urgent'] as const;

/** Consolidated analytics snapshot for a single learner (Wave 2). */
export type LearningLearnerAnalytics = {
  learnerUsername: string;
  generatedAt: string;
  completion: LearningPercentageBreakdown;
  competency: LearningPercentageBreakdown;
  knowledgeSkill: LearningKnowledgeSkillStat;
  portfolio: LearningPercentageBreakdown;
  cpd: LearningCpdStat;
  velocity: number;
  retention: number;
  engagement: number;
  goalProgress: LearningGoalProgressStat[];
  mentorship: LearningMentorshipActivityStat[];
};
