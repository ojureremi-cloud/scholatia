'use client';

import { useWorkflow } from '@/hooks';
import { SearchBox, Select } from '@/components/ui';
import { WorkflowGrid } from './WorkflowGrid';
import { WorkflowStatusBadge } from './WorkflowStatusBadge';
import { formatKind } from './format';
import { WORKFLOW_STATUSES } from '@/types/workflows';

export function WorkflowBrowser() {
  const {
    filtered,
    searchResults,
    query,
    setQuery,
    kind,
    setKind,
    status,
    setStatus,
    sort,
    setSort,
  } = useWorkflow();

  const visible = query.trim() ? searchResults : filtered;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="md:col-span-2">
          <SearchBox value={query} onChange={setQuery} placeholder="Search workflows, sources, tags..." />
        </div>
        <Select
          label="Kind"
          value={kind}
          onChange={(event) => setKind(event.target.value as typeof kind)}
          options={[
            { label: 'All kinds', value: 'all' },
            ...['undergraduate-project', 'masters-dissertation', 'phd-thesis', 'journal-submission', 'conference-submission', 'book-publishing', 'grant-proposal', 'ethics-review', 'consultancy-project', 'institutional-approval', 'marketplace-delivery', 'service-delivery'].map((value) => ({ label: formatKind(value as never), value })),
          ]}
        />
        <Select
          label="Status"
          value={status}
          onChange={(event) => setStatus(event.target.value as typeof status)}
          options={[
            { label: 'All statuses', value: 'all' },
            ...WORKFLOW_STATUSES.map((value) => ({ label: value, value })),
          ]}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          Showing <span className="font-bold text-slate-900 dark:text-slate-100">{visible.length}</span> workflows
        </p>
        <Select
          label="Sort"
          value={sort}
          onChange={(event) => setSort(event.target.value as typeof sort)}
          options={[
            { label: 'Most recent', value: 'recent' },
            { label: 'Name', value: 'name' },
            { label: 'Status', value: 'status' },
            { label: 'Priority', value: 'priority' },
            { label: 'Progress', value: 'progress' },
          ]}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {WORKFLOW_STATUSES.slice(0, 6).map((entry) => (
          <button
            key={entry}
            type="button"
            onClick={() => setStatus(status === entry ? 'all' : entry)}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-sky-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            <WorkflowStatusBadge status={entry} />
          </button>
        ))}
      </div>

      <WorkflowGrid workflows={visible} />
    </div>
  );
}
