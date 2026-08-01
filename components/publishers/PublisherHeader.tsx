'use client';

import React from 'react';
import PublisherBadge from './PublisherBadge';
import { formatCompactNumber } from './format';
import type { Publisher } from '@/types/publisher';

type PublisherHeaderProps = {
  publisher: Publisher;
  className?: string;
};

export default function PublisherHeader({ publisher, className = '' }: PublisherHeaderProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card sm:p-8', className].filter(Boolean).join(' ')}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-4xl">
            {publisher.logo}
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">
              {publisher.type.replace(/-/g, ' ')}
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">{publisher.name}</h3>
            <p className="mt-1 text-sm text-slate-500">
              {publisher.headquarters} · Founded {publisher.foundedYear ?? '—'}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <PublisherBadge status={publisher.verificationStatus} />
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            Trust score {publisher.trustScore}/100
          </span>
          {publisher.openAccess ? (
            <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">Open access</span>
          ) : null}
        </div>
      </div>
      <p className="mt-5 max-w-3xl text-sm leading-6 text-slate-600">{publisher.description}</p>
      {publisher.mission ? (
        <p className="mt-3 max-w-3xl border-l-2 border-sky-200 pl-4 text-sm italic leading-6 text-slate-500">
          {publisher.mission}
        </p>
      ) : null}
      <div className="mt-6 flex flex-wrap gap-2">
        {publisher.countriesServed.slice(0, 12).map((country) => (
          <span key={country} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            {country}
          </span>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-5 sm:grid-cols-4">
        <div>
          <p className="text-2xl font-semibold text-slate-900">{publisher.metrics.journals.toLocaleString('en-US')}</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Journals</p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-slate-900">{publisher.metrics.conferences.toLocaleString('en-US')}</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Conferences</p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-slate-900">
            {formatCompactNumber(publisher.metrics.articlesPublished)}
          </p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Articles published</p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-slate-900">{publisher.metrics.openAccessShare}%</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Open access share</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
        <a href={publisher.website} className="font-medium text-sky-700 hover:underline">
          {publisher.website.replace(/^https?:\/\//, '')}
        </a>
      </div>
    </div>
  );
}
