'use client';

import StatisticCard from '@/components/ui/StatisticCard';
import useLearning from '@/hooks/useLearning';
import { academyKindIcon, academyKindLabel } from '../format';
import { Chip, Panel } from '../primitives';
import { AdminEmptyState } from './AdminEmptyState';
import { AdminWidgets } from './AdminWidgets';

export function AcademyAnalytics() {
  const { academy } = useLearning();
  const model = academy();

  if (model.academies.length === 0) {
    return <AdminEmptyState title="No academy analytics" description="Academy statistics will appear here." />;
  }

  const totalMembers = model.academies.reduce((sum, row) => sum + row.memberCount, 0);
  const totalRegistrations = model.academies.reduce((sum, row) => sum + row.registrations, 0);

  return (
    <>
      <AdminWidgets>
        <StatisticCard icon="👥" title="Total members" value={String(totalMembers)} />
        <StatisticCard icon="🎟️" title="Total registrations" value={String(totalRegistrations)} trend="Across academies" trendPositive />
      </AdminWidgets>

      <Panel eyebrow="Academy analytics" title="Engagement summary" icon="📈">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400 dark:border-slate-700">
                <th className="py-3 pr-4">Academy</th>
                <th className="py-3 pr-4">Kind</th>
                <th className="py-3 pr-4">Members</th>
                <th className="py-3 pr-4">Events</th>
                <th className="py-3">Registrations</th>
              </tr>
            </thead>
            <tbody>
              {model.academies.map((row) => (
                <tr key={row.academy.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                  <td className="py-3 pr-4 font-semibold text-slate-800 dark:text-slate-100">{row.academy.name}</td>
                  <td className="py-3 pr-4">
                    <Chip tone="warning" icon={academyKindIcon(row.kind)}>
                      {academyKindLabel(row.kind)}
                    </Chip>
                  </td>
                  <td className="py-3 pr-4 text-slate-500">{row.memberCount}</td>
                  <td className="py-3 pr-4 text-slate-500">{row.eventCount}</td>
                  <td className="py-3 text-slate-500">{row.registrations}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
