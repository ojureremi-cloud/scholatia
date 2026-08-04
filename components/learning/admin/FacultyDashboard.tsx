'use client';

import { useState } from 'react';
import StatisticCard from '@/components/ui/StatisticCard';
import useLearning from '@/hooks/useLearning';
import { formatPercent, courseKindIcon, courseKindLabel } from '../format';
import { ProgressBar } from '../ProgressBar';
import { Chip, Panel } from '../primitives';
import { AdminEmptyState } from './AdminEmptyState';
import { AdminFilters } from './AdminFilters';
import { AdminHeader } from './AdminHeader';
import { AdminWidgets } from './AdminWidgets';
import { FacultyAnalytics } from './FacultyAnalytics';

type FacultyTab = 'overview' | 'analytics';

export function FacultyDashboard() {
  const { faculty } = useLearning();
  const model = faculty();
  const [tab, setTab] = useState<FacultyTab>('overview');

  return (
    <>
      <AdminHeader
        eyebrow="Academic operations"
        title="Faculty Dashboard"
        description="Faculties derived from course disciplines, their course inventory, and aggregated delivery statistics."
        icon="🏛️"
      />

      <AdminWidgets>
        <StatisticCard icon="🏛️" title="Faculties" value={String(model.faculties.length)} />
        <StatisticCard
          icon="📘"
          title="Courses"
          value={String(model.faculties.reduce((sum, row) => sum + row.courses.length, 0))}
          trend="Across faculties"
          trendPositive
        />
        <StatisticCard icon="📈" title="Completion" value={formatPercent(model.kpis.completionRate)} trend="Ecosystem KPI" trendPositive />
        <StatisticCard icon="🧩" title="Competency" value={formatPercent(model.kpis.competencyAttainment)} trend="Ecosystem KPI" trendPositive />
      </AdminWidgets>

      <AdminFilters<FacultyTab>
        options={[
          { label: 'Overview', value: 'overview' },
          { label: 'Analytics', value: 'analytics' },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'overview' ? (
        <Panel eyebrow="Faculties" title="Discipline units" icon="🏛️">
          {model.faculties.length === 0 ? (
            <AdminEmptyState title="No faculties" description="Faculty units will derive from course disciplines." />
          ) : (
            <ul className="space-y-4">
              {model.faculties.map((row) => (
                <li key={row.unit.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{row.unit.name}</p>
                      <p className="text-xs text-slate-400">Faculty unit · {row.courses.length} courses</p>
                    </div>
                    {row.analytics ? (
                      <Chip tone={row.analytics.completionRate >= 50 ? 'success' : 'warning'}>
                        {formatPercent(row.analytics.completionRate)} completion
                      </Chip>
                    ) : null}
                  </div>
                  {row.analytics ? (
                    <div className="mt-3">
                      <ProgressBar percent={row.analytics.completionRate} />
                    </div>
                  ) : null}
                  {row.courses.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {row.courses.map((course) => (
                        <Chip key={course.id} tone="default" icon={courseKindIcon(course.courseKind)}>
                          {course.title} · {courseKindLabel(course.courseKind)}
                        </Chip>
                      ))}
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </Panel>
      ) : null}

      {tab === 'analytics' ? <FacultyAnalytics /> : null}
    </>
  );
}
