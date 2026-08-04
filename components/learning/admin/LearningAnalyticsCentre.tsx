'use client';

import { useState } from 'react';
import StatisticCard from '@/components/ui/StatisticCard';
import useLearning from '@/hooks/useLearning';
import type { AnalyticsScope } from '@/types/learning';
import {
  analyticsScopeLabel,
  formatDate,
  formatPercent,
  roleIcon,
  roleLabel,
} from '../format';
import { ProgressBar } from '../ProgressBar';
import { Chip, Panel } from '../primitives';
import { AdminEmptyState } from './AdminEmptyState';
import { AdminFilters } from './AdminFilters';
import { AdminHeader } from './AdminHeader';
import { AdminWidgets } from './AdminWidgets';

export function LearningAnalyticsCentre() {
  const { analyticsCentre } = useLearning();
  const model = analyticsCentre();
  const [scope, setScope] = useState<AnalyticsScope>('learner');

  const kpis = model.kpis;

  return (
    <>
      <AdminHeader
        eyebrow="Learning analytics"
        title="Analytics Centre"
        description="Ecosystem KPIs, learner analytics, cohort intelligence, and organisation-level statistics."
        icon="📊"
      />

      <p className="text-xs text-slate-400">Snapshot generated {formatDate(model.generatedAt)} · {model.scopes.length} scopes available</p>

      <AdminWidgets>
        <StatisticCard icon="📈" title="Completion rate" value={formatPercent(kpis.completionRate)} />
        <StatisticCard icon="💾" title="Retention rate" value={formatPercent(kpis.retentionRate)} trend="Ecosystem KPI" trendPositive={kpis.retentionRate >= 50} />
        <StatisticCard icon="🧲" title="Engagement index" value={formatPercent(kpis.engagementIndex)} trend="Ecosystem KPI" trendPositive={kpis.engagementIndex >= 50} />
        <StatisticCard icon="🎯" title="Competency attainment" value={formatPercent(kpis.competencyAttainment)} trend="Ecosystem KPI" trendPositive={kpis.competencyAttainment >= 50} />
      </AdminWidgets>

      <AdminFilters<AnalyticsScope>
        options={model.scopes.map((entry) => ({ label: analyticsScopeLabel(entry), value: entry }))}
        value={scope}
        onChange={setScope}
      />

      {scope === 'learner' ? (
        <Panel eyebrow="Learner analytics" title={model.learner.learnerUsername} icon="🧑‍🎓">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">Course completion</p>
              <p className="mt-1 text-3xl font-semibold text-slate-900 dark:text-slate-100">
                {formatPercent(model.learner.completion.percent)}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {model.learner.completion.numerator}/{model.learner.completion.denominator} nodes
              </p>
              <div className="mt-2">
                <ProgressBar percent={model.learner.completion.percent} />
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">Competency attainment</p>
              <p className="mt-1 text-3xl font-semibold text-slate-900 dark:text-slate-100">
                {formatPercent(model.learner.competency.percent)}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {model.learner.competency.numerator}/{model.learner.competency.denominator} competencies
              </p>
              <div className="mt-2">
                <ProgressBar percent={model.learner.competency.percent} />
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-6 text-sm text-slate-500 dark:text-slate-400">
            <span>Velocity: <strong className="text-slate-800 dark:text-slate-100">{model.learner.velocity}</strong></span>
            <span>Retention: <strong className="text-slate-800 dark:text-slate-100">{formatPercent(model.learner.retention)}</strong></span>
            <span>Engagement: <strong className="text-slate-800 dark:text-slate-100">{formatPercent(model.learner.engagement)}</strong></span>
            <span>CPD: <strong className="text-slate-800 dark:text-slate-100">{model.learner.cpd.records} records · {model.learner.cpd.hours}h</strong></span>
          </div>
        </Panel>
      ) : null}

      {scope === 'cohort' ? (
        <Panel eyebrow="Cohort intelligence" title="Canonical learners" icon="👥">
          {model.cohort.length === 0 ? (
            <AdminEmptyState title="No cohort" description="Cohort rows will appear here." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400 dark:border-slate-700">
                    <th className="py-3 pr-4">Learner</th>
                    <th className="py-3 pr-4">Role</th>
                    <th className="py-3 pr-4">Courses</th>
                    <th className="py-3 pr-4">Mentorships</th>
                    <th className="py-3 pr-4">Completion</th>
                    <th className="py-3 pr-4">Competency</th>
                    <th className="py-3">Engagement</th>
                  </tr>
                </thead>
                <tbody>
                  {model.cohort.map((row) => (
                    <tr key={row.learner} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                      <td className="py-3 pr-4 font-semibold text-slate-800 dark:text-slate-100">
                        {row.learnerName}
                        <span className="ml-2 text-xs font-normal text-slate-400">@{row.learner}</span>
                      </td>
                      <td className="py-3 pr-4">
                        <Chip tone="info" icon={roleIcon(row.role)}>
                          {roleLabel(row.role)}
                        </Chip>
                      </td>
                      <td className="py-3 pr-4 text-slate-500">{row.courses}</td>
                      <td className="py-3 pr-4 text-slate-500">{row.mentorships}</td>
                      <td className="py-3 pr-4 text-slate-500">{formatPercent(row.completion)}</td>
                      <td className="py-3 pr-4 text-slate-500">{formatPercent(row.competency)}</td>
                      <td className="py-3 text-slate-500">{formatPercent(row.engagement)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      ) : null}

      {scope === 'faculty' || scope === 'institution' ? (
        <Panel eyebrow="Organisation analytics" title={analyticsScopeLabel(scope)} icon="🏛️">
          {(scope === 'faculty' ? model.faculty : model.institution).map((row) => (
            <div key={row.unit.id} className="mb-3 last:mb-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{row.unit.name}</span>
                <span className="text-xs text-slate-400">
                  {row.courseCount} courses · {row.learners} learners · {formatPercent(row.completionRate)} completion
                </span>
              </div>
              <div className="mt-2">
                <ProgressBar percent={row.completionRate} />
              </div>
            </div>
          ))}
        </Panel>
      ) : null}

      {scope === 'national' || scope === 'global' ? (
        <Panel eyebrow="Macro analytics" title={analyticsScopeLabel(scope)} icon="🌍">
          <AdminWidgets>
            <StatisticCard icon="📉" title="Drop-off risk" value={formatPercent(kpis.dropOffRisk)} trend={kpis.dropOffRisk < 30 ? 'Low risk' : 'Elevated'} trendPositive={kpis.dropOffRisk < 30} />
            <StatisticCard icon="🛟" title="Intervention coverage" value={formatPercent(kpis.interventionCoverage)} trend="At-risk learners" trendPositive={kpis.interventionCoverage >= 50} />
          </AdminWidgets>
        </Panel>
      ) : null}
    </>
  );
}
