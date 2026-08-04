import {
  competencyAttainment,
  courseProgress,
  dropOffRisk,
  isCourseCompleted,
  learningVelocity,
} from '@/lib/learning';
import type {
  CompetencyFramework,
  LearningAssessment,
  LearningCpdRecord,
  LearningCourse,
  LearningCpdStat,
  LearningGoal,
  LearningGoalProgressStat,
  LearningInstitution,
  LearningLearnerAnalytics,
  LearningMentorship,
  LearningMentorshipActivityStat,
  LearningOrganisationStatistics,
  LearningOrganisationalUnit,
  LearningPercentageBreakdown,
  LearningPortfolio,
  LearningKnowledgeSkillStat,
  LearningProgressEntry,
  LearningProgramme,
} from '@/types/learning';

/**
 * Analytics Engine — Wave 2 of the Scholatia Learning Ecosystem.
 *
 * Pure calculations for learning progress, completion, competency,
 * knowledge and skill percentages, portfolio and CPD coverage, learning
 * velocity, retention, engagement, goal progress, mentorship activity,
 * and institution / faculty / department / programme statistics. Every
 * function is side-effect free and UI-independent.
 */

function round(value: number): number {
  return Math.round(value);
}

function average(values: readonly number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

const breakdown = (numerator: number, denominator: number): LearningPercentageBreakdown => ({
  numerator,
  denominator,
  percent: denominator === 0 ? 0 : round((numerator / denominator) * 100),
});

/** Completion percentage of a single course. */
export function completionPercentage(progress: readonly LearningProgressEntry[], course: LearningCourse): LearningPercentageBreakdown {
  const summary = courseProgress(progress, course);
  return breakdown(summary.completed, summary.total);
}

/** Completion percentage across a set of courses. */
export function completionRate(progress: readonly LearningProgressEntry[], courses: readonly LearningCourse[]): LearningPercentageBreakdown {
  let total = 0;
  let completed = 0;
  courses.forEach((course) => {
    const summary = courseProgress(progress, course);
    total += summary.total;
    completed += summary.completed;
  });
  return breakdown(completed, total);
}

/** Competency attainment percentage (competencies at or above target). */
export function competencyPercentage(framework: CompetencyFramework, evidenceLevels: Record<string, number>): LearningPercentageBreakdown {
  const attained = framework.competencies.filter((competency) => (evidenceLevels[competency.key] ?? 1) >= competency.targetLevel).length;
  return breakdown(attained, framework.competencies.length);
}

/** Knowledge-domain attainment percentage. */
export function knowledgePercentage(framework: CompetencyFramework, evidenceLevels: Record<string, number>): LearningPercentageBreakdown {
  const knowledge = framework.competencies.filter((competency) => competency.domain === 'knowledge');
  const attained = knowledge.filter((competency) => (evidenceLevels[competency.key] ?? 1) >= competency.targetLevel).length;
  return breakdown(attained, knowledge.length);
}

/** Skill-domain attainment percentage. */
export function skillPercentage(framework: CompetencyFramework, evidenceLevels: Record<string, number>): LearningPercentageBreakdown {
  const skills = framework.competencies.filter((competency) => competency.domain === 'skills');
  const attained = skills.filter((competency) => (evidenceLevels[competency.key] ?? 1) >= competency.targetLevel).length;
  return breakdown(attained, skills.length);
}

/** Knowledge vs skill vs other competency breakdown. */
export function knowledgeSkillBreakdown(framework: CompetencyFramework, evidenceLevels: Record<string, number>): LearningKnowledgeSkillStat {
  const attainmentOf = (competencies: typeof framework.competencies): number => {
    if (competencies.length === 0) return 0;
    return round(
      average(
        competencies.map((competency) => clamp((evidenceLevels[competency.key] ?? 1) / Math.max(1, competency.targetLevel), 0, 1) * 100),
      ),
    );
  };
  const knowledge = framework.competencies.filter((competency) => competency.domain === 'knowledge');
  const skills = framework.competencies.filter((competency) => competency.domain === 'skills');
  const other = framework.competencies.filter((competency) => competency.domain !== 'knowledge' && competency.domain !== 'skills');
  return {
    knowledgeCompetencies: knowledge.length,
    knowledgeAttainment: attainmentOf(knowledge),
    skillCompetencies: skills.length,
    skillAttainment: attainmentOf(skills),
    otherAttainment: attainmentOf(other),
  };
}

/** Portfolio coverage percentage for a learner. */
export function portfolioPercentage(portfolios: readonly LearningPortfolio[], learnerUsername: string): LearningPercentageBreakdown {
  const owned = portfolios.filter((portfolio) => portfolio.learnerUsername === learnerUsername);
  const allKinds = new Set(owned.map((portfolio) => portfolio.kind));
  const kindsWithItems = new Set(owned.filter((portfolio) => portfolio.items.length > 0).map((portfolio) => portfolio.kind));
  return breakdown(kindsWithItems.size, allKinds.size);
}

/** CPD coverage against an annual hours target. */
export function cpdPercentage(cpdRecords: readonly LearningCpdRecord[], targetHours = 40): LearningCpdStat {
  const hours = cpdRecords.reduce((sum, record) => sum + record.hours, 0);
  return {
    hours,
    records: cpdRecords.length,
    targetHours,
    percent: round((hours / Math.max(1, targetHours)) * 100),
  };
}

/** Retention rate (100 minus average drop-off risk) across courses. */
export function retentionRate(progress: readonly LearningProgressEntry[], courses: readonly LearningCourse[]): number {
  if (courses.length === 0) return 0;
  const risks = courses.map((course) => dropOffRisk(progress, course));
  return round(clamp(100 - average(risks), 0, 100));
}

/** Engagement index (average course progress percentage). */
export function engagementIndex(progress: readonly LearningProgressEntry[], courses: readonly LearningCourse[]): number {
  if (courses.length === 0) return 0;
  return round(average(courses.map((course) => courseProgress(progress, course).percent)));
}

/** Goal progress statistics derived from evidence levels. */
export function goalProgressStatistics(
  goals: readonly LearningGoal[],
  framework: CompetencyFramework,
  evidenceLevels: Record<string, number>,
): LearningGoalProgressStat[] {
  return goals.map((goal) => {
    const achievedKeys = goal.targetCompetencyKeys.filter((key) => {
      const competency = framework.competencies.find((candidate) => candidate.key === key);
      return (evidenceLevels[key] ?? 1) >= (competency?.targetLevel ?? 1);
    });
    return {
      goalId: goal.id,
      statement: goal.statement,
      targetCompetencyKeys: goal.targetCompetencyKeys,
      achievedKeys,
      progress: round((achievedKeys.length / Math.max(1, goal.targetCompetencyKeys.length)) * 100),
      status: goal.status,
    };
  });
}

/** Mentorship activity aggregates per user. */
export function mentorshipActivity(mentorships: readonly LearningMentorship[]): LearningMentorshipActivityStat[] {
  const users = new Set<string>();
  mentorships.forEach((mentorship) => {
    users.add(mentorship.mentorUsername);
    users.add(mentorship.menteeUsername);
  });
  return Array.from(users)
    .map((username) => {
      const mine = mentorships.filter((mentorship) => mentorship.mentorUsername === username || mentorship.menteeUsername === username);
      return {
        username,
        total: mine.length,
        active: mine.filter((mentorship) => mentorship.status === 'active').length,
        requested: mine.filter((mentorship) => mentorship.status === 'requested').length,
        completed: mine.filter((mentorship) => mentorship.status === 'closed').length,
      };
    })
    .sort((a, b) => b.total - a.total);
}

/** Build an organisational unit descriptor. */
export function organisationUnit(
  id: string,
  name: string,
  kind: LearningOrganisationalUnit['kind'],
  courseIds: readonly string[],
  parentId?: string,
): LearningOrganisationalUnit {
  return { id, name, kind, parentId, courseIds: courseIds as string[] };
}

/** Aggregate statistics for organisational units. */
export function organisationalStatistics(
  units: readonly LearningOrganisationalUnit[],
  courses: readonly LearningCourse[],
  progress: readonly LearningProgressEntry[],
  learners: readonly string[],
  framework: CompetencyFramework,
  evidenceLevels: Record<string, number>,
): LearningOrganisationStatistics[] {
  return units.map((unit) => {
    const unitCourses = courses.filter((course) => unit.courseIds.includes(course.id));
    const summaries = unitCourses.map((course) => courseProgress(progress, course));
    const completed = unitCourses.filter((course) => isCourseCompleted(progress, course)).length;
    const averageProgress = unitCourses.length === 0 ? 0 : round(average(summaries.map((summary) => summary.percent)));
    return {
      unit,
      courseCount: unitCourses.length,
      learners: learners.length,
      enrolmentCount: unitCourses.filter((course) => progress.some((entry) => entry.learningObjectId === course.id)).length,
      completionRate: unitCourses.length === 0 ? 0 : round((completed / unitCourses.length) * 100),
      engagementIndex: averageProgress,
      averageProgress,
      competencyAttainment: competencyAttainment(framework, evidenceLevels),
    };
  });
}

/** Institution-level statistics. */
export function institutionStatistics(
  institutions: readonly LearningInstitution[],
  courses: readonly LearningCourse[],
  progress: readonly LearningProgressEntry[],
  learners: readonly string[],
  framework: CompetencyFramework,
  evidenceLevels: Record<string, number>,
): LearningOrganisationStatistics[] {
  const units = institutions.map((institution) =>
    organisationUnit(
      institution.id,
      institution.name,
      'institution',
      courses.filter((course) => course.institutionId === institution.id).map((course) => course.id),
    ),
  );
  return organisationalStatistics(units, courses, progress, learners, framework, evidenceLevels);
}

/** Faculty-level statistics from provided faculty units. */
export function facultyStatistics(
  units: readonly LearningOrganisationalUnit[],
  courses: readonly LearningCourse[],
  progress: readonly LearningProgressEntry[],
  learners: readonly string[],
  framework: CompetencyFramework,
  evidenceLevels: Record<string, number>,
): LearningOrganisationStatistics[] {
  return organisationalStatistics(
    units.filter((unit) => unit.kind === 'faculty'),
    courses,
    progress,
    learners,
    framework,
    evidenceLevels,
  );
}

/** Department-level statistics from provided department units. */
export function departmentStatistics(
  units: readonly LearningOrganisationalUnit[],
  courses: readonly LearningCourse[],
  progress: readonly LearningProgressEntry[],
  learners: readonly string[],
  framework: CompetencyFramework,
  evidenceLevels: Record<string, number>,
): LearningOrganisationStatistics[] {
  return organisationalStatistics(
    units.filter((unit) => unit.kind === 'department'),
    courses,
    progress,
    learners,
    framework,
    evidenceLevels,
  );
}

/** Programme-level statistics. */
export function programmeStatistics(
  programmes: readonly LearningProgramme[],
  courses: readonly LearningCourse[],
  progress: readonly LearningProgressEntry[],
  learners: readonly string[],
  framework: CompetencyFramework,
  evidenceLevels: Record<string, number>,
): LearningOrganisationStatistics[] {
  const units = programmes.map((programme) => {
    const courseIds = new Set<string>();
    programme.curricula.forEach((curriculum) => curriculum.courses.forEach((course) => courseIds.add(course.id)));
    return organisationUnit(programme.id, programme.title, 'programme', Array.from(courseIds), programme.institutionId);
  });
  return organisationalStatistics(units, courses, progress, learners, framework, evidenceLevels);
}

/** Consolidated analytics snapshot for one learner. */
export function learnerAnalytics(input: {
  learnerUsername: string;
  courses: readonly LearningCourse[];
  progress: readonly LearningProgressEntry[];
  assessments: readonly LearningAssessment[];
  framework: CompetencyFramework;
  evidenceLevels: Record<string, number>;
  portfolios: readonly LearningPortfolio[];
  cpdRecords: readonly LearningCpdRecord[];
  cpdTargetHours?: number;
  goals: readonly LearningGoal[];
  mentorships: readonly LearningMentorship[];
}): LearningLearnerAnalytics {
  const completion = completionRate(input.progress, input.courses);
  const competency = competencyPercentage(input.framework, input.evidenceLevels);
  const knowledgeSkill = knowledgeSkillBreakdown(input.framework, input.evidenceLevels);
  const portfolio = portfolioPercentage(input.portfolios, input.learnerUsername);
  const cpd = cpdPercentage(input.cpdRecords, input.cpdTargetHours ?? 40);
  return {
    learnerUsername: input.learnerUsername,
    generatedAt: new Date().toISOString(),
    completion,
    competency,
    knowledgeSkill,
    portfolio,
    cpd,
    velocity: learningVelocity(input.progress),
    retention: retentionRate(input.progress, input.courses),
    engagement: engagementIndex(input.progress, input.courses),
    goalProgress: goalProgressStatistics(input.goals, input.framework, input.evidenceLevels),
    mentorship: mentorshipActivity(input.mentorships),
  };
}
