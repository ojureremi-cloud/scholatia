'use client';

import Badge from '@/components/ui/Badge';
import type { ResearcherProfile } from '@/types/researcher';

type EditorialAppointmentsProps = {
  researcher: ResearcherProfile;
  className?: string;
};

export default function EditorialAppointments({ researcher, className = '' }: EditorialAppointmentsProps) {
  const { editorialAppointments } = researcher;
  if (editorialAppointments.length === 0) {
    return <p className={['text-sm text-slate-600', className].filter(Boolean).join(' ')}>No editorial appointments recorded.</p>;
  }
  return (
    <section className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <h3 className="text-lg font-semibold text-slate-900">Editorial appointments</h3>
      <ul className="mt-5 space-y-3">
        {editorialAppointments.map((appointment) => (
          <li key={appointment.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-slate-900">{appointment.role}</p>
              <Badge variant={appointment.status === 'Active' ? 'success' : 'default'}>{appointment.status}</Badge>
            </div>
            <p className="mt-1 text-sm text-slate-600">{appointment.journal}</p>
            {appointment.publisher ? <p className="mt-1 text-sm text-slate-500">{appointment.publisher}</p> : null}
            <p className="mt-1 text-sm text-slate-500">
              {appointment.since}
              {appointment.until ? ` - ${appointment.until}` : ' - Present'}
            </p>
            {appointment.scope ? <p className="mt-2 text-sm text-slate-600">Scope: {appointment.scope}</p> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
