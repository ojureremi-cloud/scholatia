import {
  courseProgress,
  isCourseCompleted,
} from '@/lib/learning';
import type {
  CompetencyFramework,
  LearningAssessment,
  LearningCpdRecord,
  LearningCourse,
  LearningGoal,
  LearningMentor,
  LearningPath,
  LearningProgressEntry,
  LearningReadingList,
  LearningRecommendation,
  LearningRecommendationOptions,
  LearningRecommendationScope,
} from '@/types/learning';

/**
 * Learning Recommendation Engine — Wave 2 of the Scholatia Learning Ecosystem.
 *
 * Pure, rule-based recommendation engine (no AI models). It produces course,
 * micro-course, reading list, mentor, competency, research training, career,
 * CPD, gap, and personal pathway recommendations, each scored by explainable
 * rules and returned as `LearningRecommendation` records.
 */

/** All inputs the recommendation engine needs to score a learner. */
export type LearningRecommendationInput = {
  learnerUsername: string;
  courses: readonly LearningCourse[];
  progress: readonly LearningProgressEntry[];
  goals: readonly LearningGoal[];
  framework: CompetencyFramework;
  evidenceLevels: Record<string, number>;
  assessments?: readonly LearningAssessment[];
  readingLists?: readonly LearningReadingList[];
  mentors?: readonly LearningMentor[];
  paths?: readonly LearningPath[];
  cpdRecords?: readonly LearningCpdRecord[];
  cpdTargetHours?: number;
};

export function learningRecommendationId(scope: LearningRecommendationScope, key: string): string {
  return `rec-${scope}-${key}`;
}

function goalTokens(goals: readonly LearningGoal[]): Set<string> {
  const tokens = new Set<string>();
  goals.forEach((goal) => {
    (goal.statement.toLowerCase().match(/[a-z][a-z0-9-]{2,}/g) ?? []).forEach((token) => tokens.add(token));
  });
  return tokens;
}

function makeRecommendation(
  input: Pick<LearningRecommendationInput, 'learnerUsername'>,
  scope: LearningRecommendationScope,
  title: string,
  description: string,
  reason: string,
  score: number,
  target?: LearningRecommendation['target'],
): LearningRecommendation {
  return {
    id: learningRecommendationId(scope, title.toLowerCase().replace(/[^a-z0-9]+/g, '-')),
    learnerUsername: input.learnerUsername,
    scope,
    title,
    description,
    target,
    reason,
    score,
    applied: false,
    createdAt: new Date().toISOString(),
  };
}

/** Competency keys a course trains, derived from its assessments. */
function courseCompetencyKeys(
  courses: readonly LearningCourse[],
  assessments: readonly LearningAssessment[],
  course: LearningCourse,
): Set<string> {
  const courseIds = new Set([course.id]);
  course.modules.forEach((mod) => mod.lessons.forEach((lesson) => lesson.topics.forEach((topic) => topic.activities.forEach((activity) => courseIds.add(activity.id)))));
  const keys = new Set<string>();
  assessments.forEach((assessment) => {
    if (courseIds.has(assessment.learningObjectId)) {
      assessment.competencyKeys.forEach((key) => keys.add(key));
    }
  });
  return keys;
}

/** Course recommendations ranked by progress, level, and goal fit. */
export function recommendCourses(
  input: Omit<LearningRecommendationInput, 'learnerUsername'> & { learnerUsername: string },
  options: LearningRecommendationOptions = {},
): LearningRecommendation[] {
  const { top = 4 } = options;
  const tokens = goalTokens(input.goals);
  const scored = input.courses
    .filter((course) => course.courseKind !== 'micro')
    .filter((course) => !isCourseCompleted(input.progress, course))
    .map((course) => {
      const summary = courseProgress(input.progress, course);
      const keys = courseCompetencyKeys(input.courses, input.assessments ?? [], course);
      const goalFit = [...keys].filter((key) => input.goals.some((goal) => goal.targetCompetencyKeys.includes(key))).length;
      const score =
        50 +
        (summary.percent === 0 ? 30 : 100 - summary.percent) +
        goalFit * 15 +
        (course.level <= 3 ? 10 : 0);
      return { course, summary, score };
    });
  return scored
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, top)
    .map(({ course, summary, score }) => {
      const overlap = [...tokens].filter((token) => course.title.toLowerCase().includes(token)).length;
      const reason =
        summary.percent === 0
          ? `Not started — recommended to build ${course.category} skills at level ${course.level}.`
          : `${summary.percent}% complete — continue to finish ${course.title}.`;
      return makeRecommendation(
        input,
        'course',
        course.title,
        course.description,
        overlap > 0 ? `${reason} Matches your stated goals.` : reason,
        score,
        { nodeType: 'course', nodeId: course.id },
      );
    });
}

/** Micro-course recommendations (short, targeted learning bursts). */
export function recommendMicroCourses(
  input: LearningRecommendationInput,
  options: LearningRecommendationOptions = {},
): LearningRecommendation[] {
  const { top = 3, excludeApplied = false } = options;
  const micro = input.courses.filter((course) => course.courseKind === 'micro');
  const recommendations = recommendCourses(
    { ...input, courses: micro },
    { top, excludeApplied },
  ).map((recommendation) => ({ ...recommendation, scope: 'micro-course' as LearningRecommendationScope }));
  return recommendations;
}

/** Reading list recommendations by keyword overlap with goals. */
export function recommendReadingLists(
  input: LearningRecommendationInput,
  options: LearningRecommendationOptions = {},
): LearningRecommendation[] {
  const { top = 3 } = options;
  const tokens = goalTokens(input.goals);
  const scored = (input.readingLists ?? [])
    .map((list) => {
      const haystack = `${list.title} ${list.description}`.toLowerCase();
      const overlap = [...tokens].filter((token) => haystack.includes(token)).length;
      return { list, score: overlap * 20 + list.items.length };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, top);
  return scored.map(({ list, score }) =>
    makeRecommendation(
      input,
      'reading-list',
      list.title,
      `${list.items.length} curated item(s).`,
      'Reading list overlaps with your learning goals.',
      score,
      { nodeType: 'readingList', nodeId: list.id },
    ),
  );
}

/** Mentor recommendations ranked by expertise overlap with goals. */
export function recommendMentorsFor(
  input: LearningRecommendationInput,
  options: LearningRecommendationOptions = {},
): LearningRecommendation[] {
  const { top = 3 } = options;
  const tokens = goalTokens(input.goals);
  const scored = (input.mentors ?? [])
    .map((mentor) => {
      const expertise = mentor.expertise.join(' ').toLowerCase();
      const overlap = [...tokens].filter((token) => expertise.includes(token)).length;
      return { mentor, score: overlap * 25 };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, top);
  return scored.map(({ mentor, score }) =>
    makeRecommendation(
      input,
      'mentor',
      `Mentor: ${mentor.name}`,
      `${mentor.expertise.join(', ')}${mentor.institutionName ? ` — ${mentor.institutionName}` : ''}`,
      'Mentor expertise overlaps with your learning goals.',
      score,
      undefined,
    ),
  );
}

/** Competency recommendations from the evidence-level gaps. */
export function recommendCompetencies(
  input: LearningRecommendationInput,
  options: LearningRecommendationOptions = {},
): LearningRecommendation[] {
  const { top = 5 } = options;
  const gaps = input.framework.competencies
    .map((competency) => {
      const current = input.evidenceLevels[competency.key] ?? 1;
      return { competency, current, gap: competency.targetLevel - current };
    })
    .filter(({ gap }) => gap > 0)
    .sort((a, b) => b.gap - a.gap)
    .slice(0, top);
  return gaps.map(({ competency, current, gap }) =>
    makeRecommendation(
      input,
      'competency',
      `Build ${competency.name}`,
      `${competency.domain} · currently ${current}/${competency.targetLevel}`,
      `Evidence shows level ${current}; target is ${competency.targetLevel}.`,
      gap * 25,
      { nodeType: 'competency', nodeId: competency.key },
    ),
  );
}

/** Research training recommendations (research-exercise assessments). */
export function recommendResearchTraining(
  input: LearningRecommendationInput,
  options: LearningRecommendationOptions = {},
): LearningRecommendation[] {
  const { top = 3 } = options;
  const exercises = (input.assessments ?? []).filter((assessment) => assessment.kind === 'research-exercise');
  const scored = exercises
    .map((assessment) => {
      const low = assessment.competencyKeys.filter((key) => (input.evidenceLevels[key] ?? 1) < (input.framework.competencies.find((c) => c.key === key)?.targetLevel ?? 1));
      return { assessment, gapCount: low.length };
    })
    .filter(({ gapCount }) => gapCount > 0)
    .sort((a, b) => b.gapCount - a.gapCount)
    .slice(0, top);
  return scored.map(({ assessment, gapCount }) =>
    makeRecommendation(
      input,
      'research-training',
      `Research exercise: ${assessment.title}`,
      `Trains ${assessment.competencyKeys.join(', ')}.`,
      `${gapCount} underlying competence gap(s) remain open.`,
      30 + gapCount * 20,
      { nodeType: 'assessment', nodeId: assessment.id },
    ),
  );
}

/** Career recommendations (research, leadership, and professional gaps). */
export function recommendCareer(
  input: LearningRecommendationInput,
  options: LearningRecommendationOptions = {},
): LearningRecommendation[] {
  const { top = 3 } = options;
  const targets = input.framework.competencies.filter((competency) =>
    ['research', 'leadership', 'professional'].includes(competency.domain),
  );
  const scored = targets
    .map((competency) => {
      const current = input.evidenceLevels[competency.key] ?? 1;
      return { competency, gap: competency.targetLevel - current };
    })
    .filter(({ gap }) => gap > 0)
    .sort((a, b) => b.gap - a.gap)
    .slice(0, top);
  return scored.map(({ competency, gap }) =>
    makeRecommendation(
      input,
      'career',
      `Career growth: ${competency.name}`,
      `${competency.domain} · currently ${input.evidenceLevels[competency.key] ?? 1}/${competency.targetLevel}`,
      'Developing this competency advances your research career profile.',
      20 + gap * 15,
      { nodeType: 'competency', nodeId: competency.key },
    ),
  );
}

/** CPD recommendations toward a target annual hours goal. */
export function recommendCpd(
  input: LearningRecommendationInput,
  options: LearningRecommendationOptions = {},
): LearningRecommendation[] {
  const { top = 3 } = options;
  const target = input.cpdTargetHours ?? 40;
  const records = input.cpdRecords ?? [];
  const totalHours = records.reduce((sum, record) => sum + record.hours, 0);
  const shortfall = Math.max(0, target - totalHours);
  if (shortfall === 0) return [];
  const percent = Math.round((totalHours / Math.max(1, target)) * 100);
  return [
    makeRecommendation(
      input,
      'cpd',
      `Record ${shortfall} more CPD hours`,
      `${totalHours}/${target} hours recorded this cycle.`,
      'Your annual CPD target is not yet met.',
      Math.min(100, percent + 20),
      undefined,
    ),
  ].slice(0, top);
}

/** Gap-closer recommendations: courses/assessments that train open gaps. */
export function recommendGapClosers(
  input: LearningRecommendationInput,
  options: LearningRecommendationOptions = {},
): LearningRecommendation[] {
  const { top = 5 } = options;
  const openGaps = new Set(
    input.framework.competencies
      .filter((competency) => (input.evidenceLevels[competency.key] ?? 1) < competency.targetLevel)
      .map((competency) => competency.key),
  );
  const recommendations: LearningRecommendation[] = [];
  input.courses.forEach((course) => {
    if (isCourseCompleted(input.progress, course)) return;
    const keys = courseCompetencyKeys(input.courses, input.assessments ?? [], course);
    const trained = [...keys].filter((key) => openGaps.has(key));
    if (trained.length === 0) return;
    const summary = courseProgress(input.progress, course);
    const score = trained.length * 25 + (summary.percent === 0 ? 20 : 100 - summary.percent);
    recommendations.push(
      makeRecommendation(
        input,
        'gap',
        `Close gaps via ${course.title}`,
        `Trains: ${trained.join(', ')}.`,
        `This course trains ${trained.length} open competence gap(s).`,
        score,
        { nodeType: 'course', nodeId: course.id },
      ),
    );
  });
  return recommendations.sort((a, b) => b.score - a.score).slice(0, top);
}

/** Personal learning pathway recommendations matching learner goals. */
export function recommendPersonalPathways(
  input: LearningRecommendationInput,
  options: LearningRecommendationOptions = {},
): LearningRecommendation[] {
  const { top = 2 } = options;
  const tokens = goalTokens(input.goals);
  const scored = (input.paths ?? [])
    .filter((path) => path.isPublic)
    .map((path) => {
      const haystack = `${path.title} ${path.description} ${path.purpose}`.toLowerCase();
      const overlap = [...tokens].filter((token) => haystack.includes(token)).length;
      return { path, score: overlap * 30 + path.items.length };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, top);
  return scored.map(({ path, score }) =>
    makeRecommendation(
      input,
      'pathway',
      `Pathway: ${path.title}`,
      `${path.items.length} step(s) · ${path.purpose}`,
      'This pathway is aligned with your learning goals.',
      score,
      { nodeType: 'path', nodeId: path.id },
    ),
  );
}

/** Aggregate every recommendation scope into one ranked list. */
export function recommendationsForLearner(
  input: LearningRecommendationInput,
  options: LearningRecommendationOptions = {},
): LearningRecommendation[] {
  const { top = 10, excludeApplied = false } = options;
  const collected = [
    ...recommendCourses(input, options),
    ...recommendMicroCourses(input, options),
    ...recommendReadingLists(input, options),
    ...recommendMentorsFor(input, options),
    ...recommendCompetencies(input, options),
    ...recommendResearchTraining(input, options),
    ...recommendCareer(input, options),
    ...recommendCpd(input, options),
    ...recommendGapClosers(input, options),
    ...recommendPersonalPathways(input, options),
  ];
  const seen = new Set<string>();
  const unique = collected.filter((recommendation) => {
    if (seen.has(recommendation.id)) return false;
    seen.add(recommendation.id);
    if (excludeApplied && recommendation.applied) return false;
    return true;
  });
  return unique.sort((a, b) => b.score - a.score).slice(0, top);
}
