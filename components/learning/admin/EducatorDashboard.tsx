'use client';

import Badge from '@/components/ui/Badge';
import StatisticCard from '@/components/ui/StatisticCard';
import useLearning from '@/hooks/useLearning';
import {
  assessmentKindIcon,
  assessmentKindLabel,
  courseKindIcon,
  courseKindLabel,
  courseUrl,
  domainIcon,
  domainLabel,
  formatPercent,
  progressStateLabel,
  progressVariant,
  roleIcon,
} from '../format';
import { ProgressBar } from '../ProgressBar';
import { Chip, Panel, Row } from '../primitives';
import { AdminEmptyState } from './AdminEmptyState';
import { AdminHeader } from './AdminHeader';
import { AdminWidgets } from './AdminWidgets';

export function EducatorDashboard() {
  const { educator } = useLearning();
  const model = educator();

  const totalAssessments = model.gradebook.length;
  const passed = model.gradebook.filter((row) => row.passed).length;
  const passRate = totalAssessments === 0 ? 0 : (passed / totalAssessments) * 100;

  return (
    <>
      <AdminHeader
        eyebrow="Academic operations"
        title="Educator Dashboard"
        description="Teaching load, course delivery, and assessment moderation across the Scholatia Learning Ecosystem."
        icon="👩‍🏫"
      />

      <AdminWidgets>
        <StatisticCard icon="📘" title="Courses in delivery" value={String(model.courses.length)} />
        <StatisticCard icon="🧑‍🏫" title="Instructors" value={String(model.teachingLoad.length)} />
        <StatisticCard icon="📝" title="Assessments" value={String(totalAssessments)} trend={`${formatPercent(passRate)} passed`} trendPositive={passRate >= 50} />
        <StatisticCard icon="📊" title="Completion" value={formatPercent(model.analytics.completion.percent)} trend={`${model.analytics.retention}% retention`} trendPositive />
      </AdminWidgets>

      <Panel eyebrow="Teaching load" title="Courses per instructor" icon="🧑‍🏫">
        {model.teachingLoad.length === 0 ? (
          <AdminEmptyState title="No teaching load" description="No instructors are assigned courses yet." />
        ) : (
          <div className="space-y-3">
            {model.teachingLoad.map((row) => (
              <Row key={row.instructor}>
                <Chip tone="info" icon={roleIcon('lecturer')}>
                  {row.instructorName}
                </Chip>
                <span className="text-sm text-slate-500 dark:text-slate-400">@{row.instructor}</span>
                <span className="ml-auto text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {row.courseCount} courses · {row.learners} learners
                </span>
              </Row>
            ))}
          </div>
        )}
      </Panel>

      <Panel eyebrow="Gradebook" title="Assessment results" icon="📝">
        {model.gradebook.length === 0 ? (
          <AdminEmptyState title="No assessments" description="No assessments have been published yet." />
        ) : (
          <ul className="space-y-3">
            {model.gradebook.map((row) => (
              <li
                key={row.assessment.id}
                className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-700"
              >
                <span aria-hidden="true">{assessmentKindIcon(row.assessment.kind)}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{row.assessment.title}</p>
                  <p className="text-xs text-slate-400">
                    {assessmentKindLabel(row.assessment.kind)} · {row.course ? row.course.title : 'Standalone'} ·{' '}
                    {row.rubric ? row.rubric.title : 'No rubric'}
                  </p>
                </div>
                {row.score !== undefined ? (
                  <Chip tone={row.passed ? 'success' : 'danger'}>{row.score}%</Chip>
                ) : (
                  <Chip tone="default">Not attempted</Chip>
                )}
                <Badge variant={progressVariant(row.state)}>{progressStateLabel(row.state)}</Badge>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <AdminWidgets>
        <Panel eyebrow="Moderation" title="Assignments & practicals" icon="🗂️">
          {model.moderation.length === 0 ? (
            <p className="text-sm text-slate-400 dark:text-slate-500">Nothing to moderate.</p>
          ) : (
            <ul className="space-y-2">
              {model.moderation.map((row) => (
                <li key={row.assessment.id} className="text-sm text-slate-600 dark:text-slate-300">
                  {row.assessment.title}
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel eyebrow="Feedback" title="In-progress submissions" icon="💬">
          {model.feedbackQueue.length === 0 ? (
            <p className="text-sm text-slate-400 dark:text-slate-500">No submissions awaiting feedback.</p>
          ) : (
            <ul className="space-y-2">
              {model.feedbackQueue.map((row) => (
                <li key={row.assessment.id} className="text-sm text-slate-600 dark:text-slate-300">
                  {row.assessment.title} — {row.score ?? 'unscored'}%
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </AdminWidgets>

      <Panel eyebrow="Course catalogue" title="Delivery overview" icon="📘">
        {model.courses.length === 0 ? (
          <AdminEmptyState title="No courses" description="No courses are published." />
        ) : (
          <ul className="space-y-4">
            {model.courses.map((row) => (
              <li key={row.course.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <a
                    href={courseUrl(row.course)}
                    className="text-sm font-semibold text-slate-800 hover:text-sky-600 dark:text-slate-100 dark:hover:text-sky-400"
                  >
                    {row.course.title}
                  </a>
                  <div className="flex flex-wrap items-center gap-2">
                    <Chip tone="default" icon={courseKindIcon(row.course.courseKind)}>
                      {courseKindLabel(row.course.courseKind)}
                    </Chip>
                    <Chip tone="info">{row.instructorName}</Chip>
                    <Chip tone="warning">🏛️ {row.institution}</Chip>
                  </div>
                </div>
                <div className="mt-3">
                  <ProgressBar percent={row.progress.percent} />
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  <span>{formatPercent(row.progress.percent)} complete</span>
                  <span>{row.assessmentCount} assessments</span>
                  {row.competencies.length > 0 ? (
                    <span>
                      {row.competencies.map((competency) => `${domainIcon(competency.domain)} ${domainLabel(competency.domain)}`).filter((value, index, all) => all.indexOf(value) === index).slice(0, 2).join(' · ')}
                    </span>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}
