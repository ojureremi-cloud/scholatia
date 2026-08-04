'use client';

import { assessmentKindIcon, assessmentKindLabel, formatNumber, formatPercent, nodeTypeIcon } from './format';
import { LEARNING_ASSESSMENTS } from '@/constants/placeholder-learning';
import { assessmentsForCourse } from '@/lib/learning';
import useLearning from '@/hooks/useLearning';
import type { LearningAssessment, LearningCourse } from '@/types/learning';

type AssessmentSummaryProps = {
  course: LearningCourse;
};

export function AssessmentSummary({ course }: AssessmentSummaryProps) {
  const { progress } = useLearning();
  const assessments = assessmentsForCourse(LEARNING_ASSESSMENTS, course);

  if (assessments.length === 0) return null;

  const scoreOf = (assessment: LearningAssessment) =>
    progress.find((entry) => entry.learningObjectId === assessment.id)?.score;

  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
      <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
        Assessments
      </h2>
      <ul className="mt-4 space-y-3">
        {assessments.map((assessment) => {
          const score = scoreOf(assessment);
          const passed = score !== undefined && score >= assessment.passMark;
          return (
            <li key={assessment.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-2">
                  <span aria-hidden="true" className="shrink-0 text-base">
                    {assessmentKindIcon(assessment.kind)}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{assessment.title}</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {assessmentKindLabel(assessment.kind)} · pass mark {formatPercent(assessment.passMark)}
                      {assessment.timeLimitMinutes ? ` · ${assessment.timeLimitMinutes} min` : ''}
                    </p>
                    {assessment.competencyKeys.length > 0 ? (
                      <p className="mt-1 text-xs text-slate-400">
                        {assessment.competencyKeys.map((key) => `#${key}`).join(' ')}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  {score !== undefined ? (
                    <>
                      <p className={passed ? 'text-sm font-bold text-emerald-600' : 'text-sm font-bold text-amber-600'}>
                        {formatNumber(score)}%
                      </p>
                      <p className="text-xs text-slate-400">{passed ? 'Passed' : 'Below pass mark'}</p>
                    </>
                  ) : (
                    <p className="flex items-center gap-1 text-xs text-slate-400">
                      <span aria-hidden="true">{nodeTypeIcon('assessment')}</span> Not attempted
                    </p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
