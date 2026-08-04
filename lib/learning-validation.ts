import type {
  CompetencyFramework,
  LearningAssessment,
  LearningCertificate,
  LearningCompetency,
  LearningCourse,
  LearningEventObjectRef,
  LearningInstitution,
  LearningMentorship,
  LearningPath,
  LearningPortfolio,
  LearningProgramme,
  LearningValidationCode,
  LearningValidationIssue,
  LearningValidationReport,
  LearningValidationSeverity,
  LearningReadingList,
  LearningRubric,
} from '@/types/learning';

/**
 * Validation Engine — Wave 2 of the Scholatia Learning Ecosystem.
 *
 * Pure validation of courses, assessments, learning paths, programmes,
 * certificates, competencies, portfolios, mentorships, institutions,
 * duplicate detection, relationship resolution, and dependency checking.
 * Each validator returns a list of issues; every engine function is
 * side-effect free and UI-independent.
 */

function issue(
  code: LearningValidationCode,
  severity: LearningValidationSeverity,
  message: string,
  ref?: LearningEventObjectRef,
  field?: string,
): LearningValidationIssue {
  return { code, severity, message, ref, field };
}

const required = (value: string | undefined, label: string, ref?: LearningEventObjectRef, field?: string): LearningValidationIssue[] =>
  value && value.trim().length > 0 ? [] : [issue('missing-field', 'error', `${label} is required`, ref, field)];

/** Merge a list of issues into a report for a named target. */
export function learningValidationReport(target: string, issues: readonly LearningValidationIssue[]): LearningValidationReport {
  const errorCount = issues.filter((item) => item.severity === 'error').length;
  const warningCount = issues.filter((item) => item.severity === 'warning').length;
  return {
    target,
    issues: issues as LearningValidationIssue[],
    valid: errorCount === 0,
    errorCount,
    warningCount,
  };
}

const COURSE_REF: (id: string) => LearningEventObjectRef = (nodeId) => ({ nodeType: 'course', nodeId });

/** Validate a course and its nested module/lesson/topic structure. */
export function validateLearningCourse(course: LearningCourse): LearningValidationIssue[] {
  const ref = COURSE_REF(course.id);
  const issues = [
    ...required(course.id, 'Course id', ref, 'id'),
    ...required(course.title, 'Course title', ref, 'title'),
    ...required(course.description, 'Course description', ref, 'description'),
    ...required(course.slug, 'Course slug', ref, 'slug'),
    ...required(course.category, 'Course category', ref, 'category'),
  ];
  if (!['standard', 'micro'].includes(course.courseKind)) {
    issues.push(issue('threshold-invalid', 'error', `Course kind must be standard or micro, got "${course.courseKind}"`, ref, 'courseKind'));
  }
  if (course.level < 1 || course.level > 5) {
    issues.push(issue('threshold-invalid', 'error', `Course level ${course.level} is outside 1..5`, ref, 'level'));
  }
  if (course.durationHours < 0) {
    issues.push(issue('threshold-invalid', 'error', `Course duration cannot be negative`, ref, 'durationHours'));
  }
  if (course.modules.length === 0) {
    issues.push(issue('missing-field', 'warning', 'Course has no modules', ref, 'modules'));
  }
  const seen = new Set<string>();
  course.modules.forEach((mod, index) => {
    if (seen.has(mod.id)) {
      issues.push(issue('duplicate', 'error', `Duplicate module id "${mod.id}"`, ref, 'modules'));
    }
    seen.add(mod.id);
    if (mod.position !== index + 1) {
      issues.push(issue('relationship-invalid', 'warning', `Module "${mod.title}" position ${mod.position} does not match its index`, ref, 'modules'));
    }
    if (mod.lessons.length === 0) {
      issues.push(issue('missing-field', 'warning', `Module "${mod.title}" has no lessons`, { nodeType: 'module', nodeId: mod.id }, 'lessons'));
    }
    const lessonIds = new Set<string>();
    mod.lessons.forEach((lesson, lessonIndex) => {
      if (lessonIds.has(lesson.id)) {
        issues.push(issue('duplicate', 'error', `Duplicate lesson id "${lesson.id}" inside module "${mod.title}"`, { nodeType: 'module', nodeId: mod.id }, 'lessons'));
      }
      lessonIds.add(lesson.id);
      if (lesson.position !== lessonIndex + 1) {
        issues.push(issue('relationship-invalid', 'warning', `Lesson "${lesson.title}" position mismatch`, { nodeType: 'lesson', nodeId: lesson.id }, 'position'));
      }
      const topicIds = new Set<string>();
      lesson.topics.forEach((topic) => {
        if (topicIds.has(topic.id)) {
          issues.push(issue('duplicate', 'error', `Duplicate topic id "${topic.id}" inside lesson "${lesson.title}"`, { nodeType: 'lesson', nodeId: lesson.id }, 'topics'));
        }
        topicIds.add(topic.id);
        if (topic.activities.length === 0) {
          issues.push(issue('missing-field', 'warning', `Topic "${topic.title}" has no activities`, { nodeType: 'topic', nodeId: topic.id }, 'activities'));
        }
      });
    });
  });
  return issues;
}

/** Validate an assessment against the course catalogue (optional). */
export function validateLearningAssessment(
  assessment: LearningAssessment,
  courses?: readonly LearningCourse[],
): LearningValidationIssue[] {
  const ref: LearningEventObjectRef = { nodeType: 'assessment', nodeId: assessment.id };
  const issues = [
    ...required(assessment.id, 'Assessment id', ref, 'id'),
    ...required(assessment.title, 'Assessment title', ref, 'title'),
    ...required(assessment.description, 'Assessment description', ref, 'description'),
  ];
  if (!['quiz', 'assignment', 'practical', 'research-exercise'].includes(assessment.kind)) {
    issues.push(issue('threshold-invalid', 'error', `Assessment kind "${assessment.kind}" is unknown`, ref, 'kind'));
  }
  if (assessment.passMark < 0 || assessment.passMark > 100) {
    issues.push(issue('pass-mark-invalid', 'error', `Pass mark ${assessment.passMark} is outside 0..100`, ref, 'passMark'));
  }
  if (assessment.competencyKeys.length === 0) {
    issues.push(issue('unresolved-competency', 'warning', 'Assessment maps to no competency keys', ref, 'competencyKeys'));
  }
  if (assessment.kind === 'research-exercise' && !assessment.lifecycleStageId) {
    issues.push(issue('relationship-invalid', 'warning', 'Research exercise has no lifecycle stage', ref, 'lifecycleStageId'));
  }
  if (courses) {
    const resolves = courses.some((course) => course.id === assessment.learningObjectId) ||
      courses.some((course) => course.modules.some((mod) => mod.lessons.some((lesson) => lesson.topics.some((topic) => topic.activities.some((activity) => activity.id === assessment.learningObjectId)))));
    if (!resolves) {
      issues.push(issue('broken-reference', 'error', `Assessment learningObjectId "${assessment.learningObjectId}" does not resolve`, ref, 'learningObjectId'));
    }
  }
  return issues;
}

/** Validate a learning path and resolve its steps. */
export function validateLearningPath(path: LearningPath, courses?: readonly LearningCourse[]): LearningValidationIssue[] {
  const ref: LearningEventObjectRef = { nodeType: 'path', nodeId: path.id };
  const issues = [
    ...required(path.id, 'Path id', ref, 'id'),
    ...required(path.title, 'Path title', ref, 'title'),
    ...required(path.ownerUsername, 'Path owner', ref, 'ownerUsername'),
  ];
  if (path.items.length === 0) {
    issues.push(issue('missing-field', 'warning', 'Path has no items', ref, 'items'));
  }
  if (courses) {
    const courseIds = new Set(courses.map((course) => course.id));
    path.items.forEach((item) => {
      if (item.ref.nodeType === 'course' && !courseIds.has(item.ref.nodeId)) {
        issues.push(issue('broken-reference', 'error', `Path step "${item.title}" references unknown course "${item.ref.nodeId}"`, ref, 'items'));
      }
    });
  }
  return issues;
}

/** Validate a programme and its curricula. */
export function validateLearningProgramme(programme: LearningProgramme, courses?: readonly LearningCourse[]): LearningValidationIssue[] {
  const ref: LearningEventObjectRef = { nodeType: 'programme', nodeId: programme.id };
  const issues = [
    ...required(programme.id, 'Programme id', ref, 'id'),
    ...required(programme.title, 'Programme title', ref, 'title'),
    ...required(programme.qualification, 'Programme qualification', ref, 'qualification'),
  ];
  if (programme.curricula.length === 0) {
    issues.push(issue('missing-field', 'warning', 'Programme has no curricula', ref, 'curricula'));
  }
  if (courses) {
    const courseIds = new Set(courses.map((course) => course.id));
    programme.curricula.forEach((curriculum) => {
      if (curriculum.courses.length === 0) {
        issues.push(issue('missing-field', 'warning', `Curriculum "${curriculum.title}" has no courses`, { nodeType: 'curriculum', nodeId: curriculum.id }, 'courses'));
      }
      curriculum.courses.forEach((course) => {
        if (!courseIds.has(course.id)) {
          issues.push(issue('broken-reference', 'error', `Curriculum "${curriculum.title}" references unknown course "${course.id}"`, { nodeType: 'curriculum', nodeId: curriculum.id }, 'courses'));
        }
      });
    });
  }
  return issues;
}

/** Validate a certificate. */
export function validateLearningCertificate(
  certificate: LearningCertificate,
  courses?: readonly LearningCourse[],
): LearningValidationIssue[] {
  const ref: LearningEventObjectRef = { nodeType: 'certificate', nodeId: certificate.id };
  const issues = [
    ...required(certificate.id, 'Certificate id', ref, 'id'),
    ...required(certificate.title, 'Certificate title', ref, 'title'),
    ...required(certificate.verificationReference, 'Certificate verification reference', ref, 'verificationReference'),
    ...required(certificate.learnerUsername, 'Certificate learner', ref, 'learnerUsername'),
  ];
  if (!/^SLA-CERTIFICATE-[A-Z0-9-]+$/.test(certificate.verificationReference)) {
    issues.push(issue('credential-invalid', 'warning', 'Verification reference does not match the canonical SLA-CERTIFICATE format', ref, 'verificationReference'));
  }
  if (courses && !courses.some((course) => course.id === certificate.courseId)) {
    issues.push(issue('broken-reference', 'error', `Certificate courseId "${certificate.courseId}" does not resolve`, ref, 'courseId'));
  }
  return issues;
}

/** Validate a competency within (optionally) its framework. */
export function validateLearningCompetency(
  competency: LearningCompetency,
  framework?: CompetencyFramework,
): LearningValidationIssue[] {
  const ref: LearningEventObjectRef = { nodeType: 'competency', nodeId: competency.key };
  const issues = [
    ...required(competency.key, 'Competency key', ref, 'key'),
    ...required(competency.name, 'Competency name', ref, 'name'),
    ...required(competency.frameworkId, 'Competency framework id', ref, 'frameworkId'),
  ];
  if (competency.targetLevel < 1 || competency.targetLevel > 5) {
    issues.push(issue('threshold-invalid', 'error', `Target level ${competency.targetLevel} is outside 1..5`, ref, 'targetLevel'));
  }
  if (framework) {
    const knownKeys = new Set(framework.competencies.map((candidate) => candidate.key));
    competency.prerequisites.forEach((prerequisite) => {
      if (!knownKeys.has(prerequisite)) {
        issues.push(issue('missing-prerequisite', 'error', `Prerequisite "${prerequisite}" is not a known competency`, ref, 'prerequisites'));
      }
    });
  }
  return issues;
}

/** Validate a portfolio. */
export function validateLearningPortfolio(portfolio: LearningPortfolio): LearningValidationIssue[] {
  const ref: LearningEventObjectRef = { nodeType: 'portfolio', nodeId: portfolio.id };
  const issues = [
    ...required(portfolio.id, 'Portfolio id', ref, 'id'),
    ...required(portfolio.title, 'Portfolio title', ref, 'title'),
    ...required(portfolio.learnerUsername, 'Portfolio owner', ref, 'learnerUsername'),
  ];
  const seen = new Set<string>();
  portfolio.items.forEach((item) => {
    if (seen.has(item.id)) {
      issues.push(issue('duplicate', 'error', `Duplicate portfolio item id "${item.id}"`, ref, 'items'));
    }
    seen.add(item.id);
    if (!['private', 'shared', 'public'].includes(item.visibility)) {
      issues.push(issue('threshold-invalid', 'error', `Portfolio item visibility "${item.visibility}" is unknown`, ref, 'items'));
    }
  });
  return issues;
}

/** Validate a mentorship. */
export function validateLearningMentorship(mentorship: LearningMentorship): LearningValidationIssue[] {
  const ref: LearningEventObjectRef = { nodeType: 'mentorship', nodeId: mentorship.id };
  const issues = [
    ...required(mentorship.id, 'Mentorship id', ref, 'id'),
    ...required(mentorship.mentorUsername, 'Mentor username', ref, 'mentorUsername'),
    ...required(mentorship.menteeUsername, 'Mentee username', ref, 'menteeUsername'),
  ];
  if (!['requested', 'matched', 'agreed', 'active', 'closed'].includes(mentorship.status)) {
    issues.push(issue('relationship-invalid', 'error', `Mentorship status "${mentorship.status}" is unknown`, ref, 'status'));
  }
  if (mentorship.mentorUsername === mentorship.menteeUsername) {
    issues.push(issue('relationship-invalid', 'error', 'A learner cannot mentor themselves', ref));
  }
  if (mentorship.status === 'active' && !mentorship.startedAt) {
    issues.push(issue('relationship-invalid', 'warning', 'Active mentorship has no start date', ref, 'startedAt'));
  }
  return issues;
}

/** Validate an institution reference. */
export function validateLearningInstitution(institution: LearningInstitution): LearningValidationIssue[] {
  const ref: LearningEventObjectRef = { nodeType: 'institution', nodeId: institution.id };
  return [
    ...required(institution.id, 'Institution id', ref, 'id'),
    ...required(institution.name, 'Institution name', ref, 'name'),
    ...required(institution.country, 'Institution country', ref, 'country'),
  ];
}

/** Validate a reading list. */
export function validateLearningReadingList(list: LearningReadingList): LearningValidationIssue[] {
  const ref: LearningEventObjectRef = { nodeType: 'readingList', nodeId: list.id };
  const issues = [
    ...required(list.id, 'Reading list id', ref, 'id'),
    ...required(list.title, 'Reading list title', ref, 'title'),
  ];
  if (list.items.length === 0) {
    issues.push(issue('missing-field', 'warning', 'Reading list has no items', ref, 'items'));
  }
  return issues;
}

/** Validate a rubric. */
export function validateLearningRubric(rubric: LearningRubric): LearningValidationIssue[] {
  const ref: LearningEventObjectRef = { nodeType: 'assessment', nodeId: rubric.id };
  const issues = [
    ...required(rubric.id, 'Rubric id', ref, 'id'),
    ...required(rubric.title, 'Rubric title', ref, 'title'),
  ];
  if (rubric.criteria.length === 0) {
    issues.push(issue('missing-field', 'warning', 'Rubric has no criteria', ref, 'criteria'));
  }
  rubric.criteria.forEach((criterion) => {
    if (criterion.maxScore <= 0) {
      issues.push(issue('threshold-invalid', 'error', `Rubric criterion "${criterion.statement}" has non-positive maxScore`, ref, 'criteria'));
    }
  });
  return issues;
}

/** Detect duplicate ids and duplicate titles within a collection. */
export function findDuplicateLearningObjects(
  items: readonly { id: string; title: string }[],
): LearningValidationIssue[] {
  const issues: LearningValidationIssue[] = [];
  const idCounts = new Map<string, number>();
  const titleCounts = new Map<string, number>();
  items.forEach((item) => {
    idCounts.set(item.id, (idCounts.get(item.id) ?? 0) + 1);
    titleCounts.set(item.title, (titleCounts.get(item.title) ?? 0) + 1);
  });
  idCounts.forEach((count, id) => {
    if (count > 1) issues.push(issue('duplicate', 'error', `Duplicate object id "${id}" appears ${count} times`, COURSE_REF(id), 'id'));
  });
  titleCounts.forEach((count, title) => {
    if (count > 1) issues.push(issue('name-collision', 'warning', `Duplicate object title "${title}" appears ${count} times`, undefined, 'title'));
  });
  return issues;
}

/** Validate all object relationships across the SLE graph. */
export function validateLearningRelationships(data: {
  courses: readonly LearningCourse[];
  programmes: readonly LearningProgramme[];
  assessments: readonly LearningAssessment[];
  paths: readonly LearningPath[];
}): LearningValidationIssue[] {
  const courseIds = new Set(data.courses.map((course) => course.id));
  const activityIds = new Set(
    data.courses.flatMap((course) =>
      course.modules.flatMap((mod) =>
        mod.lessons.flatMap((lesson) => lesson.topics.flatMap((topic) => topic.activities.map((activity) => activity.id))),
      ),
    ),
  );
  const issues: LearningValidationIssue[] = [];
  data.assessments.forEach((assessment) => {
    if (!courseIds.has(assessment.learningObjectId) && !activityIds.has(assessment.learningObjectId)) {
      issues.push(issue('broken-reference', 'error', `Assessment "${assessment.id}" targets unknown object "${assessment.learningObjectId}"`, { nodeType: 'assessment', nodeId: assessment.id }, 'learningObjectId'));
    }
  });
  data.paths.forEach((path) => {
    path.items.forEach((item) => {
      if (item.ref.nodeType === 'course' && !courseIds.has(item.ref.nodeId)) {
        issues.push(issue('broken-reference', 'error', `Path "${path.id}" step references unknown course "${item.ref.nodeId}"`, { nodeType: 'path', nodeId: path.id }, 'items'));
      }
    });
  });
  data.programmes.forEach((programme) => {
    programme.curricula.forEach((curriculum) => {
      curriculum.courses.forEach((course) => {
        if (!courseIds.has(course.id)) {
          issues.push(issue('broken-reference', 'error', `Programme "${programme.id}" references unknown course "${course.id}"`, { nodeType: 'programme', nodeId: programme.id }, 'curricula'));
        }
      });
    });
  });
  return issues;
}

/** Validate competency prerequisite dependencies, including cycles. */
export function validateLearningDependencies(framework: CompetencyFramework): LearningValidationIssue[] {
  const issues: LearningValidationIssue[] = [];
  const byKey = new Map(framework.competencies.map((competency) => [competency.key, competency]));
  framework.competencies.forEach((competency) => {
    competency.prerequisites.forEach((prerequisite) => {
      if (!byKey.has(prerequisite)) {
        issues.push(issue('missing-prerequisite', 'error', `Competency "${competency.key}" prerequisites unknown "${prerequisite}"`, { nodeType: 'competency', nodeId: competency.key }, 'prerequisites'));
      }
    });
  });

  const visiting = new Set<string>();
  const visited = new Set<string>();
  const cyclePath: string[] = [];
  const visit = (key: string): boolean => {
    if (visiting.has(key)) {
      cyclePath.push(key);
      return true;
    }
    if (visited.has(key)) return false;
    visiting.add(key);
    const competency = byKey.get(key);
    if (competency) {
      for (const prerequisite of competency.prerequisites) {
        if (visit(prerequisite)) {
          cyclePath.push(key);
          return true;
        }
      }
    }
    visiting.delete(key);
    visited.add(key);
    return false;
  };
  framework.competencies.forEach((competency) => {
    if (visit(competency.key)) {
      issues.push(issue('dependency-cycle', 'error', `Competency prerequisite cycle detected: ${cyclePath.slice(0, 5).join(' → ')}`, { nodeType: 'competency', nodeId: competency.key }, 'prerequisites'));
      cyclePath.length = 0;
      visiting.clear();
      visited.clear();
    }
  });
  return issues;
}

/** Run every validator over the SLE graph and merge into a single report. */
export function validateAllLearningGraph(data: {
  courses: readonly LearningCourse[];
  programmes: readonly LearningProgramme[];
  assessments: readonly LearningAssessment[];
  paths: readonly LearningPath[];
  certificates: readonly LearningCertificate[];
  framework: CompetencyFramework;
  portfolios: readonly LearningPortfolio[];
  mentorships: readonly LearningMentorship[];
  institutions: readonly LearningInstitution[];
}): LearningValidationReport {
  const issues: LearningValidationIssue[] = [
    ...data.courses.flatMap((course) => validateLearningCourse(course)),
    ...data.assessments.flatMap((assessment) => validateLearningAssessment(assessment, data.courses)),
    ...data.paths.flatMap((path) => validateLearningPath(path, data.courses)),
    ...data.programmes.flatMap((programme) => validateLearningProgramme(programme, data.courses)),
    ...data.certificates.flatMap((certificate) => validateLearningCertificate(certificate, data.courses)),
    ...data.framework.competencies.flatMap((competency) => validateLearningCompetency(competency, data.framework)),
    ...validateLearningDependencies(data.framework),
    ...data.portfolios.flatMap((portfolio) => validateLearningPortfolio(portfolio)),
    ...data.mentorships.flatMap((mentorship) => validateLearningMentorship(mentorship)),
    ...data.institutions.flatMap((institution) => validateLearningInstitution(institution)),
    ...validateLearningRelationships(data),
    ...findDuplicateLearningObjects([...data.courses, ...data.programmes, ...data.paths]),
  ];
  return learningValidationReport('learning-graph', issues);
}
