'use client';

import React, { useState } from 'react';

type AdvancedSearchPanelProps = {
  onApply?: (params: AdvancedSearchParams) => void;
  className?: string;
};

export type AdvancedSearchParams = {
  query: string;
  discipline: string;
  yearFrom: string;
  yearTo: string;
  country: string;
  status: string;
};

const disciplines = [
  'Computer Science',
  'Physics',
  'Mathematics',
  'Chemistry',
  'Biology',
  'Economics',
  'Engineering',
  'Environmental Science',
  'Philosophy',
  'Public Health',
];

const statuses = ['Open', 'Active', 'Submissions open', 'Ongoing', 'Published'];

const inputClasses =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100';

export default function AdvancedSearchPanel({ onApply, className = '' }: AdvancedSearchPanelProps) {
  const [params, setParams] = useState<AdvancedSearchParams>({
    query: '',
    discipline: '',
    yearFrom: '',
    yearTo: '',
    country: '',
    status: '',
  });

  function update<K extends keyof AdvancedSearchParams>(key: K, value: AdvancedSearchParams[K]) {
    setParams((previous) => ({ ...previous, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onApply?.(params);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}
    >
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Advanced search</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="sm:col-span-2 lg:col-span-1">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Query</label>
          <input
            type="text"
            value={params.query}
            onChange={(event) => update('query', event.target.value)}
            placeholder="Keywords, authors, venues…"
            className={`${inputClasses} mt-2`}
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Discipline</label>
          <select
            value={params.discipline}
            onChange={(event) => update('discipline', event.target.value)}
            className={`${inputClasses} mt-2`}
          >
            <option value="">Any</option>
            {disciplines.map((discipline) => (
              <option key={discipline} value={discipline}>
                {discipline}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">From</label>
            <input
              type="number"
              min="1900"
              max="2100"
              value={params.yearFrom}
              onChange={(event) => update('yearFrom', event.target.value)}
              placeholder="2015"
              className={`${inputClasses} mt-2`}
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">To</label>
            <input
              type="number"
              min="1900"
              max="2100"
              value={params.yearTo}
              onChange={(event) => update('yearTo', event.target.value)}
              placeholder="2026"
              className={`${inputClasses} mt-2`}
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Country</label>
          <input
            type="text"
            value={params.country}
            onChange={(event) => update('country', event.target.value)}
            placeholder="Germany, USA, India…"
            className={`${inputClasses} mt-2`}
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Status</label>
          <select
            value={params.status}
            onChange={(event) => update('status', event.target.value)}
            className={`${inputClasses} mt-2`}
          >
            <option value="">Any</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() =>
            setParams({ query: '', discipline: '', yearFrom: '', yearTo: '', country: '', status: '' })
          }
          className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
        >
          Reset
        </button>
        <button
          type="submit"
          className="rounded-full bg-slate-900 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800"
        >
          Apply filters
        </button>
      </div>
    </form>
  );
}
