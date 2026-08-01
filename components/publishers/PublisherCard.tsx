'use client';

import React from 'react';
import PublisherBadge from './PublisherBadge';
import type { Publisher } from '@/types/publisher';

type PublisherCardProps = {
  publisher: Publisher;
  className?: string;
};

export default function PublisherCard({ publisher, className = '' }: PublisherCardProps) {
  return (
    <div className={['flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-2xl">{publisher.logo}</span>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{publisher.name}</h3>
            <p className="text-sm text-slate-500">{publisher.acronym} · {publisher.country}</p>
          </div>
        </div>
        <PublisherBadge status={publisher.verificationStatus} />
      </div>
      <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{publisher.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {publisher.type.replace(/-/g, ' ')}
        </span>
        {publisher.openAccess ? (
          <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700">Open access</span>
        ) : null}
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {publisher.metrics.journals.toLocaleString('en-US')} journals
        </span>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4 text-sm">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Trust</p>
          <p className="mt-1 font-semibold text-slate-900">{publisher.trustScore}/100</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Founded</p>
          <p className="mt-1 font-medium text-slate-900">{publisher.foundedYear ?? '—'}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Countries</p>
          <p className="mt-1 font-medium text-slate-900">{publisher.countriesServed.length}</p>
        </div>
      </div>
    </div>
  );
}
