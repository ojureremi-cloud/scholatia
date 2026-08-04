'use client';

import StatisticCard from '@/components/ui/StatisticCard';
import useLearning from '@/hooks/useLearning';
import { formatPercent } from '../format';
import { Panel } from '../primitives';
import { AdminEmptyState } from './AdminEmptyState';
import { AdminWidgets } from './AdminWidgets';

export function DepartmentAnalytics() {
  const { department } = useLearning();
  const model = department();
  const rows = model.analytics;

  if (rows.length === 0) {
    return <AdminEmptyState title="No department analytics" description="Department statistics will appear here." />;
  }

  return (
    <>
      <AdminWidgets>
        <StatisticCard icon="🏛️" title="Departments" value={String(rows.length)} />
        <StatisticCard
          icon="🎓"
          title="Learners"
          value={String(rows.reduce((sum, row) => sum + row.learners, 0))}
          trend="Across tracked departments"
          trendPositive
        />
      </AdminWidgets>

      <Panel eyebrow="Department analytics" title="Aggregated statistics" icon="📈">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400 dark:border-slate-700">
                <th className="py-3 pr-4">Department</th>
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
    </>
  );
}
