'use client';

import StatisticCard from '@/components/ui/StatisticCard';
import useLearning from '@/hooks/useLearning';
import { formatPercent } from '../format';
import { Panel, Row } from '../primitives';
import { AdminEmptyState } from './AdminEmptyState';
import { AdminWidgets } from './AdminWidgets';

export function ProgrammeAnalytics() {
  const { programmeManager } = useLearning();
  const model = programmeManager();
  const rows = model.analytics;

  return (
    <>
      <AdminWidgets>
        <StatisticCard icon="🎯" title="Programmes tracked" value={String(rows.length)} />
        <StatisticCard
          icon="🧮"
          title="Learners covered"
          value={String(rows.reduce((sum, row) => sum + row.learners, 0))}
          trend="Across tracked programmes"
          trendPositive
        />
      </AdminWidgets>

      {rows.length === 0 ? (
        <AdminEmptyState title="No analytics" description="Programme analytics will appear here." />
      ) : (
        <Panel eyebrow="Programme analytics" title="Aggregated statistics" icon="📈">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400 dark:border-slate-700">
                  <th className="py-3 pr-4">Programme</th>
                  <th className="py-3 pr-4">Courses</th>
                  <th className="py-3 pr-4">Learners</th>
                  <th className="py-3 pr-4">Enrolments</th>
                  <th className="py-3 pr-4">Completion</th>
                  <th className="py-3 pr-4">Engagement</th>
                  <th className="py-3 pr-4">Progress</th>
                  <th className="py-3">Competency</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.unit.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                    <td className="py-3 pr-4 font-semibold text-slate-800 dark:text-slate-100">{row.unit.name}</td>
                    <td className="py-3 pr-4 text-slate-500">{row.courseCount}</td>
                    <td className="py-3 pr-4 text-slate-500">{row.learners}</td>
                    <td className="py-3 pr-4 text-slate-500">{row.enrolmentCount}</td>
                    <td className="py-3 pr-4 text-slate-500">{formatPercent(row.completionRate)}</td>
                    <td className="py-3 pr-4 text-slate-500">{formatPercent(row.engagementIndex)}</td>
                    <td className="py-3 pr-4 text-slate-500">{formatPercent(row.averageProgress)}</td>
                    <td className="py-3 text-slate-500">{formatPercent(row.competencyAttainment)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      <Panel eyebrow="Scope snapshot" title="Organisation-level view" icon="🗺️">
        <div className="space-y-2">
          {rows.map((row) => (
            <Row key={`${row.unit.id}-scope`} className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-700 dark:text-slate-200">{row.unit.name}</span>
              <span className="text-xs text-slate-400">
                {formatPercent(row.completionRate)} completion · {formatPercent(row.engagementIndex)} engagement ·{' '}
                {formatPercent(row.competencyAttainment)} competency
              </span>
            </Row>
          ))}
        </div>
      </Panel>
    </>
  );
}
