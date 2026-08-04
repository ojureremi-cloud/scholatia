'use client';

import { useState } from 'react';
import StatisticCard from '@/components/ui/StatisticCard';
import useLearning from '@/hooks/useLearning';
import {
  academyKindIcon,
  academyKindLabel,
  formatPercent,
  institutionKindLabel,
} from '../format';
import { ProgressBar } from '../ProgressBar';
import { Chip, Panel } from '../primitives';
import { AdminEmptyState } from './AdminEmptyState';
import { AdminFilters } from './AdminFilters';
import { AdminHeader } from './AdminHeader';
import { AdminWidgets } from './AdminWidgets';
import { InstitutionAnalytics } from './InstitutionAnalytics';

type InstitutionTab = 'overview' | 'analytics';

export function InstitutionDashboard() {
  const { institution } = useLearning();
  const model = institution();
  const [tab, setTab] = useState<InstitutionTab>('overview');

  return (
    <>
      <AdminHeader
        eyebrow="Academic operations"
        title="Institution Dashboard"
        description="Partner institutions, their programmes, academics, and aggregated institutional statistics."
        icon="🏛️"
      />

      <AdminWidgets>
        <StatisticCard icon="🏛️" title="Institutions" value={String(model.institutions.length)} />
        <StatisticCard
          icon="📘"
          title="Courses"
          value={String(model.institutions.reduce((sum, row) => sum + row.courseCount, 0))}
          trend="Across institutions"
          trendPositive
        />
        <StatisticCard icon="🎓" title="Academies" value={String(model.institutions.reduce((sum, row) => sum + row.academies.length, 0))} />
        <StatisticCard icon="📈" title="Completion" value={formatPercent(model.kpis.completionRate)} trend="Ecosystem KPI" trendPositive />
      </AdminWidgets>

      <AdminFilters<InstitutionTab>
        options={[
          { label: 'Overview', value: 'overview' },
          { label: 'Analytics', value: 'analytics' },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'overview' ? (
        <Panel eyebrow="Institutions" title="Ecosystem partners" icon="🏛️">
          {model.institutions.length === 0 ? (
            <AdminEmptyState title="No institutions" description="No institutions are registered." />
          ) : (
            <ul className="space-y-4">
              {model.institutions.map((row) => (
                <li key={row.institution.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{row.institution.name}</p>
                      <p className="text-xs text-slate-400">
                        {row.institution.country} · {institutionKindLabel(row.institution.kind)}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Chip tone="default">{row.courseCount} courses</Chip>
                      <Chip tone="info">{row.academies.length} academies</Chip>
                      {row.analytics ? (
                        <Chip tone={row.analytics.completionRate >= 50 ? 'success' : 'warning'}>
                          {formatPercent(row.analytics.completionRate)} completion
                        </Chip>
                      ) : null}
                    </div>
                  </div>
                  {row.analytics ? (
                    <div className="mt-3">
                      <ProgressBar percent={row.analytics.completionRate} />
                    </div>
                  ) : null}
                  {row.academies.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {row.academies.map((academy) => (
                        <Chip key={academy.id} tone="warning" icon={academyKindIcon(academy.kind)}>
                          {academy.name} · {academyKindLabel(academy.kind)}
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

      {tab === 'analytics' ? <InstitutionAnalytics /> : null}
    </>
  );
}
