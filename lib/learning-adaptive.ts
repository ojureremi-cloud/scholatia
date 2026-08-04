import { progressStateOf } from '@/lib/learning';
import type {
  CompetencyFramework,
  CompetencyLevel,
  LearningCourse,
  LearningNodeType,
  LearningObjectRef,
  LearningProgressEntry,
  LearningReadinessProfile,
  LearningSequenceItem,
  LearningUnlockState,
} from '@/types/learning';

/**
 * Adaptive Learning Engine — Wave 2 of the Scholatia Learning Ecosystem.
 *
 * Pure, rule-based adaptation: prerequisite checking, dependency checking,
 * unlock logic, completion thresholds, learning velocity, difficulty
 * progression, competency progression, learning readiness, adaptive
 * sequencing, and adaptive pacing. No machine learning.
 */

/** Ordered flattening of a course tree into a learning sequence. */
export function courseNodeSequence(course: LearningCourse): LearningObjectRef[] {
  const sequence: LearningObjectRef[] = [{ nodeType: 'course', nodeId: course.id }];
  course.modules.forEach((mod) => {
    sequence.push({ nodeType: 'module', nodeId: mod.id });
    mod.lessons.forEach((lesson) => {
      sequence.push({ nodeType: 'lesson', nodeId: lesson.id });
      lesson.topics.forEach((topic) => {
        sequence.push({ nodeType: 'topic', nodeId: topic.id });
        topic.activities.forEach((activity) => {
          sequence.push({ nodeType: 'activity', nodeId: activity.id });
        });
      });
    });
  });
  return sequence;
}

/** Whether every prerequisite competency is evidenced at its target level. */
export function prerequisitesSatisfied(
  framework: CompetencyFramework,
  competencyKey: string,
  evidenceLevels: Record<string, number>,
): boolean {
  const competency = framework.competencies.find((candidate) => candidate.key === competencyKey);
  if (!competency || competency.prerequisites.length === 0) return true;
  return competency.prerequisites.every((prerequisite) => {
    const prerequisiteCompetency = framework.competencies.find((candidate) => candidate.key === prerequisite);
    const required = prerequisiteCompetency?.targetLevel ?? 1;
    return (evidenceLevels[prerequisite] ?? 1) >= required;
  });
}

/** Unmet prerequisite keys for a competency. */
export function unmetPrerequisites(
  framework: CompetencyFramework,
  competencyKey: string,
  evidenceLevels: Record<string, number>,
): string[] {
  const competency = framework.competencies.find((candidate) => candidate.key === competencyKey);
  if (!competency) return [];
  return competency.prerequisites.filter((prerequisite) => {
    const prerequisiteCompetency = framework.competencies.find((candidate) => candidate.key === prerequisite);
    const required = prerequisiteCompetency?.targetLevel ?? 1;
    return (evidenceLevels[prerequisite] ?? 1) < required;
  });
}

/** Unmet dependencies (earlier sequence nodes not yet complete) for a node. */
export function checkDependencies(
  progress: readonly LearningProgressEntry[],
  course: LearningCourse,
  targetId: string,
): LearningObjectRef[] {
  const sequence = courseNodeSequence(course);
  const index = sequence.findIndex((item) => item.nodeId === targetId);
  if (index === -1) return [];
  return sequence.slice(0, index).filter((item) => progressStateOf(progress, item.nodeType, item.nodeId) !== 'completed');
}

/** Resolve the unlock state of a course node. */
export function unlockFor(
  progress: readonly LearningProgressEntry[],
  course: LearningCourse,
  targetId: string,
): { state: LearningUnlockState; reasons: string[] } {
  const node = courseNodeSequence(course).find((item) => item.nodeId === targetId);
  if (!node) return { state: 'locked', reasons: ['Object not part of this course'] };
  const currentState = progressStateOf(progress, node.nodeType, node.nodeId);
  if (currentState === 'completed') return { state: 'completed', reasons: ['Object already completed'] };
  if (currentState === 'in-progress') return { state: 'in-progress', reasons: ['Object already started'] };
  const missing = checkDependencies(progress, course, targetId);
  if (missing.length > 0) {
    return {
      state: 'locked',
      reasons: [`${missing.length} preceding object(s) must be completed first`],
    };
  }
  return { state: 'available', reasons: ['All dependencies are complete'] };
}

/** Completion thresholds per hierarchy level (100% of children). */
export function completionThresholds(): {
  level: LearningNodeType;
  unit: LearningNodeType;
  threshold: number;
}[] {
  return [
    { level: 'activity', unit: 'activity', threshold: 100 },
    { level: 'topic', unit: 'activity', threshold: 100 },
    { level: 'lesson', unit: 'topic', threshold: 100 },
    { level: 'module', unit: 'lesson', threshold: 100 },
    { level: 'course', unit: 'module', threshold: 100 },
  ];
}

/** Number of completions recorded within a rolling window. */
export function completionsInWindow(
  progress: readonly LearningProgressEntry[],
  sinceIso: string,
): number {
  const since = new Date(sinceIso).getTime();
  return progress.filter((entry) => entry.state === 'completed' && entry.completedAt && new Date(entry.completedAt).getTime() >= since).length;
}

/** Weekly learning velocity from completions in the last 30 days. */
export function learningVelocityRate(
  progress: readonly LearningProgressEntry[],
  windowDays = 30,
): number {
  const since = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000).toISOString();
  const completed = completionsInWindow(progress, since);
  return Math.round((completed / Math.max(1, windowDays / 7)) * 10) / 10;
}

/** Adaptive pacing estimate for a course. */
export function adaptivePacing(
  progress: readonly LearningProgressEntry[],
  course: LearningCourse,
  options: { targetWeeks?: number; windowDays?: number } = {},
): {
  remainingNodes: number;
  velocityPerWeek: number;
  predictedWeeks: number;
  pace: 'slow' | 'steady' | 'fast';
  onTrack: boolean;
} {
  const sequence = courseNodeSequence(course);
  const remainingNodes = sequence.filter((item) => progressStateOf(progress, item.nodeType, item.nodeId) !== 'completed').length;
  const velocityPerWeek = learningVelocityRate(progress, options.windowDays ?? 30);
  const predictedWeeks = remainingNodes === 0 ? 0 : Math.ceil(remainingNodes / Math.max(1, velocityPerWeek));
  const targetWeeks = options.targetWeeks ?? 12;
  const pace: 'slow' | 'steady' | 'fast' = velocityPerWeek < 2 ? 'slow' : velocityPerWeek <= 6 ? 'steady' : 'fast';
  return {
    remainingNodes,
    velocityPerWeek,
    predictedWeeks,
    pace,
    onTrack: predictedWeeks <= targetWeeks,
  };
}

/** Difficulty progression across the course catalogue. */
export function difficultyProgression(
  courses: readonly LearningCourse[],
  evidenceLevels: Record<string, number>,
): {
  currentLevel: number;
  suggestedLevel: number;
  nextCourses: LearningCourse[];
} {
  const levels = Object.values(evidenceLevels);
  const currentLevel = levels.length === 0 ? 1 : Math.max(1, Math.min(5, Math.round(levels.reduce((sum, level) => sum + level, 0) / levels.length)));
  const suggestedLevel = Math.min(5, currentLevel + 1);
  const nextCourses = courses.filter((course) => course.level === suggestedLevel && !['draft', 'archived'].includes(course.status)).slice(0, 3);
  return { currentLevel, suggestedLevel, nextCourses };
}

/** Competency progression per key (current vs target). */
export function competencyProgression(
  framework: CompetencyFramework,
  evidenceLevels: Record<string, number>,
): {
  key: string;
  name: string;
  current: number;
  target: number;
  progress: number;
}[] {
  return framework.competencies.map((competency) => {
    const current = evidenceLevels[competency.key] ?? 1;
    return {
      key: competency.key,
      name: competency.name,
      current,
      target: competency.targetLevel,
      progress: Math.round(Math.min(1, current / Math.max(1, competency.targetLevel)) * 100),
    };
  });
}

/** Adaptive readiness snapshot for a course. */
export function learningReadiness(
  learnerUsername: string,
  framework: CompetencyFramework,
  evidenceLevels: Record<string, number>,
  course: LearningCourse,
  progress: readonly LearningProgressEntry[],
): LearningReadinessProfile {
  const courseCompetencies = framework.competencies.filter((competency) =>
    competency.skills.some((skill) => course.title.toLowerCase().includes(skill.toLowerCase())) ||
    competency.name.toLowerCase().includes(course.category?.toLowerCase() ?? ''),
  );
  const prerequisiteGaps = courseCompetencies.flatMap((competency) => unmetPrerequisites(framework, competency.key, evidenceLevels));
  const dependencies = courseNodeSequence(course).flatMap((item) => checkDependencies(progress, course, item.nodeId));
  const uniqueDependencies = Array.from(new Set(dependencies.map((dep) => dep.nodeId)));
  const readiness = Math.max(0, Math.min(100, 100 - prerequisiteGaps.length * 25 - Math.min(uniqueDependencies.length, 4) * 10));
  const levels = Object.values(evidenceLevels);
  const average = levels.length === 0 ? 1 : Math.round(levels.reduce((sum, level) => sum + level, 0) / levels.length);
  const suggestedLevel = Math.max(1, Math.min(5, Math.min(course.level, Math.max(1, average)))) as CompetencyLevel;
  const velocity = learningVelocityRate(progress);
  const pace: LearningReadinessProfile['pace'] = velocity < 2 ? 'slow' : velocity <= 6 ? 'steady' : 'fast';
  return {
    learnerUsername,
    readiness,
    unmetPrerequisites: Array.from(new Set(prerequisiteGaps)),
    missingDependencies: uniqueDependencies.slice(0, 5),
    suggestedLevel,
    pace,
  };
}

/** Adaptive sequence of a course with per-object unlock states. */
export function adaptiveSequence(
  course: LearningCourse,
  progress: readonly LearningProgressEntry[],
): LearningSequenceItem[] {
  return courseNodeSequence(course).map((ref, index) => {
    const resolved = unlockFor(progress, course, ref.nodeId);
    return {
      ref,
      position: index + 1,
      state: resolved.state,
      prerequisitesMet: resolved.state !== 'locked',
    };
  });
}
