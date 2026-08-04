'use client';

import { useState } from 'react';
import StatisticCard from '@/components/ui/StatisticCard';
import useLearning from '@/hooks/useLearning';
import {
  assessmentKindIcon,
  assessmentKindLabel,
  progressStateLabel,
} from '../format';
import { Chip, Panel } from '../primitives';
import { AdminEmptyState } from './AdminEmptyState';
import { AdminFilters } from './AdminFilters';
import { AdminHeader } from './AdminHeader';
import { AdminWidgets } from './AdminWidgets';

type AssessmentTab = 'overview' | 'rubrics' | 'assignments' | 'results';

export function AssessmentManager() {
  const { assessmentManager } = useLearning();
  const model = assessmentManager();
  const [tab, setTab] = useState<AssessmentTab>('overview');

  const results = model.results;
  const average = results.length === 0 ? 0 : results.reduce((sum, row) => sum + (row.score ?? 0), 0) / results.length;
  const passed = results.filter((row) => row.passed).length;

  return (
    <>
      <AdminHeader
        eyebrow="Academic operations"
        title="Assessment Manager"
        description="Assessment registry, rubrics, course-linked assignments, and moderated results across the ecosystem."
        icon="📝"
      />

      <AdminWidgets>
        <StatisticCard icon="🗃️" title="Assessments" value={String(model.assessments.length)} />
        <StatisticCard icon="📏" title="Rubrics" value={String(model.rubrics.length)} />
        <StatisticCard icon="🎯" title="Average score" value={`${Math.round(average)}%`} trend={`${passed}/${results.length} passed`} trendPositive />
        <StatisticCard icon="🧪" title="Kinds covered" value={String(Object.keys(model.byKind).length)} />
      </AdminWidgets>

      <AdminFilters<AssessmentTab>
        options={[
          { label: 'Overview', value: 'overview' },
          { label: 'Rubrics', value: 'rubrics' },
          { label: 'Assignments', value: 'assignments' },
          { label: 'Results', value: 'results' },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'overview' ? (
        <Panel eyebrow="Assessment registry" title="By kind" icon="🗃️">
          {model.assessments.length === 0 ? (
            <AdminEmptyState title="No assessments" description="No assessments are registered yet." />
          ) : (
            <ul className="space-y-4">
              {(Object.keys(model.byKind) as Array<keyof typeof model.byKind>).map((kind) => (
                <li key={kind}>
                  <div className="mb-2 flex items-center gap-2">
                    <Chip tone="info" icon={assessmentKindIcon(kind)}>
                      {assessmentKindLabel(kind)}
                    </Chip>
                    <span className="text-xs text-slate-400">{model.byKind[kind].length} assessments</span>
                  </div>
                  {model.byKind[kind].length > 0 ? (
                    <ul className="space-y-2">
                      {model.byKind[kind].map((row) => (
                        <li key={row.assessment.id} className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
                          {row.assessment.title}
                          <span className="ml-2 text-xs text-slate-400">· {row.course ? row.course.title : 'Standalone'}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </Panel>
      ) : null}

      {tab === 'rubrics' ? (
        <Panel eyebrow="Rubric library" title="Scoring rubrics" icon="📏">
          {model.rubrics.length === 0 ? (
            <AdminEmptyState title="No rubrics" description="No rubrics are configured." />
          ) : (
            <ul className="space-y-4">
              {model.rubrics.map((rubric) => (
                <li key={rubric.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{rubric.title}</p>
                    <Chip tone="default">{rubric.criteria.length} criteria</Chip>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {rubric.criteria.map((criterion) => (
                      <Chip key={criterion.id} tone="info">
                        {criterion.statement} · {criterion.maxScore}pts
                      </Chip>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      ) : null}

      {tab === 'assignments' ? (
        <Panel eyebrow="Course linking" title="Assignments by course" icon="📚">
          {model.assignment.length === 0 ? (
            <AdminEmptyState title="No linked assignments" description="No assessments are linked to courses yet." />
          ) : (
            <ul className="space-y-4">
              {model.assignment.map((entry) => (
                <li key={entry.course.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{entry.course.title}</p>
                  <ul className="mt-2 space-y-1">
                    {entry.assessments.map((assessment) => (
                      <li key={assessment.id} className="text-sm text-slate-600 dark:text-slate-300">
                        {assessmentKindIcon(assessment.kind)} {assessment.title}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      ) : null}

      {tab === 'results' ? (
        <Panel eyebrow="Results" title="Graded assessments" icon="🧪">
          {results.length === 0 ? (
            <AdminEmptyState title="No results" description="No assessments have been graded yet." />
          ) : (
            <ul className="space-y-2">
              {results.map((row) => (
                <li key={row.assessment.id} className="flex flex-wrap items-center gap-3 rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {row.assessment.title}
                  </span>
                  <Chip tone={row.passed ? 'success' : 'danger'}>{row.score}%</Chip>
                  <Chip tone="default">{progressStateLabel(row.state)}</Chip>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      ) : null}
    </>
  );
}
