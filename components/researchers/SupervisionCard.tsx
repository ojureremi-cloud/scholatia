'use client';

import Badge from '@/components/ui/Badge';
import type { ResearcherProfile } from '@/types/researcher';

type SupervisionCardProps = {
  researcher: ResearcherProfile;
  className?: string;
};

export default function SupervisionCard({ researcher, className = '' }: SupervisionCardProps) {
  const { supervision } = researcher;
  const stats = [
    { label: 'Current PhD', value: supervision.currentPhd },
    { label: 'Completed PhD', value: supervision.completedPhd },
    { label: 'Current Masters', value: supervision.currentMasters },
    { label: 'Completed Masters', value: supervision.completedMasters },
    { label: 'Total supervised', value: supervision.totalSupervised },
  ];
  return (
    <section className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <h3 className="text-lg font-semibold text-slate-900">Supervision</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xl font-semibold text-slate-900">{stat.value}</p>
            <p className="mt-1 text-xs font-medium text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>
      {supervision.students.length > 0 ? (
        <ul className="mt-5 space-y-3">
          {supervision.students.map((student) => (
            <li key={student.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-900">{student.name}</p>
                <div className="flex gap-2">
                  <Badge>{student.level}</Badge>
                  <Badge variant={student.status === 'Current' ? 'success' : 'default'}>{student.status}</Badge>
                </div>
              </div>
              {student.thesisTitle ? <p className="mt-1 text-sm text-slate-600">{student.thesisTitle}</p> : null}
              <p className="mt-1 text-sm text-slate-500">
                {student.institution} • {student.period}
              </p>
              {student.outcome ? <p className="mt-1 text-sm text-slate-600">Outcome: {student.outcome}</p> : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-slate-600">No individual students listed.</p>
      )}
    </section>
  );
}
