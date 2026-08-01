import React from 'react';
import { IntegrityStatusBadge, SeverityBadge } from './TrustBadge';
import { formatDateLabel, integrityTypeLabel } from './format';
import type { IntegrityEvent } from '@/types/trust';

type IntegrityEventCardProps = {
  event: IntegrityEvent;
  featured?: boolean;
};

export default function IntegrityEventCard({ event, featured = false }: IntegrityEventCardProps) {
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {integrityTypeLabel(event.type)}
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <SeverityBadge severity={event.severity} />
          <IntegrityStatusBadge status={event.status} />
        </div>
      </div>
      <h3 className={['mt-3 font-semibold text-slate-900', featured ? 'text-2xl leading-8' : 'text-lg leading-7'].join(' ')}>
        {event.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{event.description}</p>
      {event.entityName ? (
        <p className="mt-3 text-sm font-medium text-slate-700">
          <span className="text-slate-400">Record: </span>
          {event.entityName}
        </p>
      ) : null}
      {event.doi ? <p className="mt-1 text-xs text-slate-400">{event.doi}</p> : null}
      {event.parties && event.parties.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {event.parties.map((party) => (
            <span key={party} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
              {party}
            </span>
          ))}
        </div>
      ) : null}
      <div className="mt-4 border-t border-slate-100 pt-3">
        <p className="text-xs text-slate-400">{formatDateLabel(event.date)}</p>
        {event.resolution ? <p className="mt-2 text-sm text-slate-600">{event.resolution}</p> : null}
      </div>
    </article>
  );
}
