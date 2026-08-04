'use client';

import { useState } from 'react';
import StatisticCard from '@/components/ui/StatisticCard';
import useLearning from '@/hooks/useLearning';
import { formatPercent } from '../format';
import { ProgressBar } from '../ProgressBar';
import { Chip, Panel } from '../primitives';
import { AdminEmptyState } from './AdminEmptyState';
import { AdminFilters } from './AdminFilters';
import { AdminHeader } from './AdminHeader';
import { AdminWidgets } from './AdminWidgets';
import { DepartmentAnalytics } from './DepartmentAnalytics';

type DepartmentTab = 'overview' | 'analytics';

export function DepartmentDashboard() {
  const { department } = useLearning();
  const model = department();
  const [tab, setTab] = useState<DepartmentTab>('overview');

  return (
    <>
      <AdminHeader
        eyebrow="Academic operations"
        title="Department Dashboard"
        description="Departments aligned to programme curricula, their course delivery, and aggregated statistics."
        icon="🏛️"
      />

      <AdminWidgets>
        <StatisticCard icon="🏛️" title="Departments" value={String(model.departments.length)} />
        <StatisticCard
          icon="📘"
          title="Courses"
          value={String(model.departments.reduce((sum, row) => sum + row.courses.length, 0))}
          trend="Across departments"
          trendPositive
        />
        <StatisticCard icon="📈" title="Completion" value={formatPercent(model.kpis.completionRate)} trend="Ecosystem KPI" trendPositive />
        <StatisticCard icon="🧩" title="Competency" value={formatPercent(model.kpis.competencyAttainment)} trend="Ecosystem KPI" trendPositive />
      </AdminWidgets>

      <AdminFilters<DepartmentTab>
        options={[
          { label: 'Overview', value: 'overview' },
          { label: 'Analytics', value: 'analytics' },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'overview' ? (
        <Panel eyebrow="Departments" title="Curriculum-aligned units" icon="🏛️">
          {model.departments.length === 0 ? (
            <AdminEmptyState title="No departments" description="Department units will derive from programme curricula." />
          ) : (
            <ul className="space-y-4">
              {model.departments.map((row) => (
                <li key={row.unit.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{row.unit.name}</p>
                      <p className="text-xs text-slate-400">Department unit · {row.courses.length} courses</p>
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
                        <Chip key={course.id} tone="default">
                          {course.title}
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

      {tab === 'analytics' ? <DepartmentAnalytics /> : null}
    </>
  );
}
