import {
  ACTIVITY_KIND_ICONS,
  ACTIVITY_KIND_LABELS,
  ACADEMY_KIND_ICONS,
  ACADEMY_KIND_LABELS,
  ANALYTICS_SCOPE_ICONS,
  ANALYTICS_SCOPE_LABELS,
  ASSESSMENT_KIND_ICONS,
  ASSESSMENT_KIND_LABELS,
  BOOKMARK_KIND_ICONS,
  BOOKMARK_KIND_LABELS,
  COMPETENCY_DOMAIN_ICONS,
  COMPETENCY_DOMAIN_LABELS,
  COMPETENCY_LEVEL_NAMES,
  COURSE_KIND_ICONS,
  COURSE_KIND_LABELS,
  CREDENTIAL_KIND_ICONS,
  CREDENTIAL_KIND_LABELS,
  CREDENTIAL_STATUS_LABELS,
  DEADLINE_KIND_ICONS,
  DEADLINE_KIND_LABELS,
  GOAL_STATUS_LABELS,
  HIGHLIGHT_CATEGORY_ICONS,
  HIGHLIGHT_CATEGORY_LABELS,
  INSTITUTION_KIND_ICONS,
  INSTITUTION_KIND_LABELS,
  JOURNAL_KIND_ICONS,
  JOURNAL_KIND_LABELS,
  LEARNING_ACTION_ICONS,
  LEARNING_ACTION_LABELS,
  LEARNING_EVENT_KIND_ICONS,
  LEARNING_EVENT_KIND_LABELS,
  LEARNING_EVENT_MODE_LABELS,
  LEARNING_HISTORY_EVENT_TYPE_LABELS,
  LEARNING_NODE_TYPE_ICONS,
  LEARNING_NODE_TYPE_LABELS,
  LEARNING_NOTIFICATION_KIND_ICONS,
  LEARNING_NOTIFICATION_KIND_LABELS,
  LEARNING_READING_KIND_ICONS,
  LEARNING_READING_KIND_LABELS,
  LEARNING_RECOMMENDATION_SCOPE_LABELS,
  LEARNING_RESOURCE_KIND_ICONS,
  LEARNING_RESOURCE_KIND_LABELS,
  LEARNING_ROLE_ICONS,
  LEARNING_ROLE_LABELS,
  LEARNING_WORKFLOW_KIND_ICONS,
  LEARNING_WORKFLOW_KIND_LABELS,
  MENTOR_KIND_ICONS,
  MENTOR_KIND_LABELS,
  MENTORSHIP_STATUS_LABELS,
  PORTFOLIO_KIND_ICONS,
  PORTFOLIO_KIND_LABELS,
  PROGRESS_STATE_LABELS,
  RECOMMENDATION_KIND_ICONS,
  RECOMMENDATION_KIND_LABELS,
} from '@/types/learning';
import type {
  AcademyKind,
  ActivityKind,
  AnalyticsScope,
  AssessmentKind,
  CompetencyDomain,
  CompetencyLevel,
  CourseKind,
  CredentialKind,
  CredentialStatus,
  GoalStatus,
  InstitutionKind,
  LearningAction,
  LearningBookmarkKind,
  LearningDeadlineKind,
  LearningEventKind,
  LearningEventMode,
  LearningHighlightCategory,
  LearningHistoryEventType,
  LearningJournalEntryKind,
  LearningNodeType,
  LearningNotificationKind,
  LearningReadingKind,
  LearningRecommendationScope,
  LearningResourceKind,
  LearningRole,
  LearningWorkflowKind,
  MentorKind,
  MentorshipStatus,
  PortfolioKind,
  ProgressState,
  RecommendationKind,
} from '@/types/learning';

export function formatDate(iso: string | undefined): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatTime(iso: string | undefined): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export function formatDateTime(iso: string | undefined): string {
  if (!iso) return '—';
  return `${formatDate(iso)} at ${formatTime(iso)}`;
}

export function formatRelative(iso: string | undefined, now = new Date()): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const diffMs = now.getTime() - date.getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.round(days / 7)}w ago`;
  return formatDate(iso);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

export function formatPercentRatio(numerator: number, denominator: number): string {
  return formatPercent((numerator / Math.max(1, denominator)) * 100);
}

export function formatDuration(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)} minutes`;
  if (hours < 48) return `${hours} hours`;
  return `${Math.round(hours / 24)} days`;
}

export function formatHours(hours: number): string {
  return `${hours}h`;
}

// ---------------------------------------------------------------------------
// Labels and icons
// ---------------------------------------------------------------------------

export function levelName(level: number): string {
  return COMPETENCY_LEVEL_NAMES[level as CompetencyLevel] ?? String(level);
}

export function nodeTypeLabel(type: LearningNodeType): string {
  return LEARNING_NODE_TYPE_LABELS[type] ?? type;
}

export function nodeTypeIcon(type: LearningNodeType): string {
  return LEARNING_NODE_TYPE_ICONS[type] ?? '📘';
}

export function courseKindLabel(kind: CourseKind): string {
  return COURSE_KIND_LABELS[kind] ?? kind;
}

export function courseKindIcon(kind: CourseKind): string {
  return COURSE_KIND_ICONS[kind] ?? '📘';
}

export function activityKindLabel(kind: ActivityKind): string {
  return ACTIVITY_KIND_LABELS[kind] ?? kind;
}

export function activityKindIcon(kind: ActivityKind): string {
  return ACTIVITY_KIND_ICONS[kind] ?? '✍️';
}

export function assessmentKindLabel(kind: AssessmentKind): string {
  return ASSESSMENT_KIND_LABELS[kind] ?? kind;
}

export function assessmentKindIcon(kind: AssessmentKind): string {
  return ASSESSMENT_KIND_ICONS[kind] ?? '✅';
}

export function domainLabel(domain: CompetencyDomain): string {
  return COMPETENCY_DOMAIN_LABELS[domain] ?? domain;
}

export function domainIcon(domain: CompetencyDomain): string {
  return COMPETENCY_DOMAIN_ICONS[domain] ?? '🧠';
}

export function credentialKindLabel(kind: CredentialKind): string {
  return CREDENTIAL_KIND_LABELS[kind] ?? kind;
}

export function credentialKindIcon(kind: CredentialKind): string {
  return CREDENTIAL_KIND_ICONS[kind] ?? '🎖️';
}

export function credentialStatusLabel(status: CredentialStatus): string {
  return CREDENTIAL_STATUS_LABELS[status] ?? status;
}

export function progressStateLabel(state: ProgressState): string {
  return PROGRESS_STATE_LABELS[state] ?? state;
}

export function historyEventTypeLabel(type: LearningHistoryEventType): string {
  return LEARNING_HISTORY_EVENT_TYPE_LABELS[type] ?? type;
}

export function recommendationKindLabel(kind: RecommendationKind): string {
  return RECOMMENDATION_KIND_LABELS[kind] ?? kind;
}

export function recommendationKindIcon(kind: RecommendationKind): string {
  return RECOMMENDATION_KIND_ICONS[kind] ?? '💡';
}

export function recommendationScopeLabel(scope: LearningRecommendationScope): string {
  return LEARNING_RECOMMENDATION_SCOPE_LABELS[scope] ?? scope;
}

export function eventKindLabel(kind: LearningEventKind): string {
  return LEARNING_EVENT_KIND_LABELS[kind] ?? kind;
}

export function eventKindIcon(kind: LearningEventKind): string {
  return LEARNING_EVENT_KIND_ICONS[kind] ?? '📅';
}

export function eventModeLabel(mode: LearningEventMode): string {
  return LEARNING_EVENT_MODE_LABELS[mode] ?? mode;
}

export function mentorshipStatusLabel(status: MentorshipStatus): string {
  return MENTORSHIP_STATUS_LABELS[status] ?? status;
}

export function mentorKindLabel(kind: MentorKind): string {
  return MENTOR_KIND_LABELS[kind] ?? kind;
}

export function mentorKindIcon(kind: MentorKind): string {
  return MENTOR_KIND_ICONS[kind] ?? '🧭';
}

export function goalStatusLabel(status: GoalStatus): string {
  return GOAL_STATUS_LABELS[status] ?? status;
}

export function academyKindLabel(kind: AcademyKind): string {
  return ACADEMY_KIND_LABELS[kind] ?? kind;
}

export function academyKindIcon(kind: AcademyKind): string {
  return ACADEMY_KIND_ICONS[kind] ?? '🎓';
}

export function workflowKindLabel(kind: LearningWorkflowKind): string {
  return LEARNING_WORKFLOW_KIND_LABELS[kind] ?? kind;
}

export function notificationKindLabel(kind: LearningNotificationKind): string {
  return LEARNING_NOTIFICATION_KIND_LABELS[kind] ?? kind;
}

export function notificationKindIcon(kind: LearningNotificationKind): string {
  return LEARNING_NOTIFICATION_KIND_ICONS[kind] ?? '🔔';
}

export function readingKindLabel(kind: LearningReadingKind): string {
  return LEARNING_READING_KIND_LABELS[kind] ?? kind;
}

export function readingKindIcon(kind: LearningReadingKind): string {
  return LEARNING_READING_KIND_ICONS[kind] ?? '📚';
}

export function highlightCategoryLabel(category: LearningHighlightCategory): string {
  return HIGHLIGHT_CATEGORY_LABELS[category] ?? category;
}

export function highlightCategoryIcon(category: LearningHighlightCategory): string {
  return HIGHLIGHT_CATEGORY_ICONS[category] ?? '🔆';
}

export function bookmarkKindLabel(kind: LearningBookmarkKind): string {
  return BOOKMARK_KIND_LABELS[kind] ?? kind;
}

export function bookmarkKindIcon(kind: LearningBookmarkKind): string {
  return BOOKMARK_KIND_ICONS[kind] ?? '🔖';
}

export function journalKindLabel(kind: LearningJournalEntryKind): string {
  return JOURNAL_KIND_LABELS[kind] ?? kind;
}

export function journalKindIcon(kind: LearningJournalEntryKind): string {
  return JOURNAL_KIND_ICONS[kind] ?? '📓';
}

export function deadlineKindLabel(kind: LearningDeadlineKind): string {
  return DEADLINE_KIND_LABELS[kind] ?? kind;
}

export function deadlineKindIcon(kind: LearningDeadlineKind): string {
  return DEADLINE_KIND_ICONS[kind] ?? '📌';
}

export function portfolioKindLabel(kind: PortfolioKind): string {
  return PORTFOLIO_KIND_LABELS[kind] ?? kind;
}

export function portfolioKindIcon(kind: PortfolioKind): string {
  return PORTFOLIO_KIND_ICONS[kind] ?? '📁';
}

export function institutionKindLabel(kind: InstitutionKind): string {
  return INSTITUTION_KIND_LABELS[kind] ?? kind;
}

export function institutionKindIcon(kind: InstitutionKind): string {
  return INSTITUTION_KIND_ICONS[kind] ?? '🏦';
}

export function roleLabel(role: LearningRole): string {
  return LEARNING_ROLE_LABELS[role] ?? role;
}

export function roleIcon(role: LearningRole): string {
  return LEARNING_ROLE_ICONS[role] ?? '🪪';
}

export function actionLabel(action: LearningAction): string {
  return LEARNING_ACTION_LABELS[action] ?? action;
}

export function actionIcon(action: LearningAction): string {
  return LEARNING_ACTION_ICONS[action] ?? '⚙️';
}

export function resourceKindLabel(kind: LearningResourceKind): string {
  return LEARNING_RESOURCE_KIND_LABELS[kind] ?? kind;
}

export function resourceKindIcon(kind: LearningResourceKind): string {
  return LEARNING_RESOURCE_KIND_ICONS[kind] ?? '📦';
}

export function analyticsScopeLabel(scope: AnalyticsScope): string {
  return ANALYTICS_SCOPE_LABELS[scope] ?? scope;
}

export function analyticsScopeIcon(scope: AnalyticsScope): string {
  return ANALYTICS_SCOPE_ICONS[scope] ?? '📊';
}

export function workflowKindIcon(kind: LearningWorkflowKind): string {
  return LEARNING_WORKFLOW_KIND_ICONS[kind] ?? '⚙️';
}

// ---------------------------------------------------------------------------
// Badge variants
// ---------------------------------------------------------------------------

export type BadgeTone = 'default' | 'success' | 'warning' | 'danger' | 'info';

export function progressVariant(state: ProgressState): BadgeTone {
  switch (state) {
    case 'completed':
      return 'success';
    case 'in-progress':
      return 'info';
    default:
      return 'default';
  }
}

export function courseKindVariant(kind: CourseKind): BadgeTone {
  return kind === 'micro' ? 'info' : 'default';
}

export function levelVariant(level: CompetencyLevel): BadgeTone {
  if (level >= 4) return 'success';
  if (level >= 3) return 'info';
  if (level >= 2) return 'warning';
  return 'default';
}

export function eventModeVariant(mode: LearningEventMode): BadgeTone {
  switch (mode) {
    case 'online':
      return 'info';
    case 'in-person':
      return 'warning';
    case 'hybrid':
      return 'default';
    default:
      return 'default';
  }
}

export function eventKindVariant(kind: LearningEventKind): BadgeTone {
  switch (kind) {
    case 'workshop':
      return 'info';
    case 'bootcamp':
      return 'warning';
    case 'masterclass':
      return 'success';
    case 'seminar':
      return 'default';
    case 'summer-school':
      return 'info';
    case 'training-series':
      return 'default';
    default:
      return 'default';
  }
}

export function mentorshipStatusVariant(status: MentorshipStatus): BadgeTone {
  switch (status) {
    case 'active':
      return 'success';
    case 'agreed':
    case 'matched':
      return 'info';
    case 'requested':
      return 'warning';
    case 'closed':
      return 'default';
    default:
      return 'default';
  }
}

export function goalStatusVariant(status: GoalStatus): BadgeTone {
  switch (status) {
    case 'achieved':
      return 'success';
    case 'active':
      return 'info';
    case 'dropped':
      return 'danger';
    default:
      return 'default';
  }
}

export function credentialStatusVariant(status: CredentialStatus): BadgeTone {
  switch (status) {
    case 'issued':
      return 'success';
    case 'expired':
      return 'warning';
    case 'revoked':
      return 'danger';
    default:
      return 'default';
  }
}

export function domainVariant(domain: CompetencyDomain): BadgeTone {
  switch (domain) {
    case 'research':
    case 'knowledge':
      return 'info';
    case 'skills':
    case 'digital':
      return 'success';
    case 'leadership':
    case 'innovation':
    case 'entrepreneurship':
      return 'warning';
    default:
      return 'default';
  }
}

export function workflowKindVariant(kind: LearningWorkflowKind): BadgeTone {
  switch (kind) {
    case 'certificate':
    case 'badge':
    case 'goal-completion':
    case 'course-completion':
      return 'success';
    case 'enrolment':
    case 'assessment':
    case 'competency':
      return 'info';
    case 'withdrawal':
      return 'danger';
    default:
      return 'default';
  }
}

export function roleVariant(role: LearningRole): BadgeTone {
  switch (role) {
    case 'student':
      return 'default';
    case 'researcher':
    case 'lecturer':
    case 'supervisor':
    case 'mentor':
      return 'info';
    case 'reviewer':
      return 'warning';
    case 'department-admin':
    case 'faculty-admin':
    case 'institution-admin':
      return 'success';
    case 'platform-admin':
    case 'crie':
    case 'system-ai':
      return 'danger';
    default:
      return 'default';
  }
}

export function recommendationKindVariant(kind: RecommendationKind): BadgeTone {
  switch (kind) {
    case 'course':
    case 'path':
      return 'info';
    case 'reading-list':
      return 'default';
    case 'research-training':
    case 'assessment':
      return 'success';
    case 'competency-gap':
    case 'intervention':
      return 'warning';
    case 'mentor':
      return 'default';
    case 'career':
    case 'cpd':
      return 'info';
    default:
      return 'default';
  }
}

export function historyEventVariant(type: LearningHistoryEventType): BadgeTone {
  switch (type) {
    case 'course-completed':
    case 'certificate-issued':
    case 'badge-earned':
    case 'assessment-passed':
      return 'success';
    case 'enrolled':
    case 'path-started':
    case 'lesson-viewed':
      return 'info';
    case 'assessment-failed':
      return 'danger';
    default:
      return 'default';
  }
}

export function bookmarkKindVariant(kind: LearningBookmarkKind): BadgeTone {
  switch (kind) {
    case 'course':
    case 'module':
      return 'info';
    case 'lesson':
    case 'topic':
      return 'default';
    case 'research':
      return 'success';
    case 'video':
      return 'warning';
    default:
      return 'default';
  }
}

export function journalKindVariant(kind: LearningJournalEntryKind): BadgeTone {
  switch (kind) {
    case 'reflection':
      return 'info';
    case 'weekly':
    case 'monthly':
      return 'success';
    case 'research':
      return 'warning';
    default:
      return 'default';
  }
}

export function deadlineKindVariant(kind: LearningDeadlineKind): BadgeTone {
  switch (kind) {
    case 'assessment':
      return 'danger';
    case 'submission':
      return 'warning';
    case 'goal':
      return 'info';
    default:
      return 'default';
  }
}

// ---------------------------------------------------------------------------
// URLs
// ---------------------------------------------------------------------------

export function learningUrl(): string {
  return '/learning';
}

export function coursesUrl(): string {
  return '/learning/courses';
}

export function programmesUrl(): string {
  return '/learning/programmes';
}

export function pathsUrl(): string {
  return '/learning/paths';
}

export function courseUrl(course: { slug: string }): string {
  return `/learning/courses/${course.slug}`;
}

export function programmeUrl(programme: { slug: string }): string {
  return `/learning/programmes/${programme.slug}`;
}

export function pathUrl(path: { slug: string }): string {
  return `/learning/paths/${path.slug}`;
}

export function moduleUrl(course: { slug: string }, module: { slug: string }): string {
  return `${courseUrl(course)}?module=${module.slug}`;
}

export function lessonUrl(course: { slug: string }, lesson: { slug: string }): string {
  return `${courseUrl(course)}?lesson=${lesson.slug}`;
}

export function workspaceUrl(): string {
  return '/learning/workspace';
}

export function readingUrl(): string {
  return '/learning/reading';
}

export function homeUrl(): string {
  return '/learning/home';
}

export function educatorUrl(): string {
  return '/learning/educator';
}

export function mentorUrl(): string {
  return '/learning/mentor';
}

export function programmesManageUrl(): string {
  return '/learning/programmes/manage';
}

export function assessmentsUrl(): string {
  return '/learning/assessments';
}

export function institutionsUrl(): string {
  return '/learning/institutions';
}

export function analyticsCentreUrl(): string {
  return '/learning/analytics';
}

export function adminUrl(): string {
  return '/learning/admin';
}
