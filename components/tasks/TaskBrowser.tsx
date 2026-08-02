'use client';

import { useTasks } from '@/hooks';
import { SearchBox, Select } from '@/components/ui';
import { TaskCard } from './TaskCard';
import { TaskStatusBadge } from './TaskStatusBadge';
import { TASK_PRIORITIES, TASK_STATUSES } from '@/types/tasks';
import { formatTaskPriority } from './format';

export function TaskBrowser() {
  const {
    filtered,
    searchResults,
    query,
    setQuery,
    status,
    setStatus,
    priority,
    setPriority,
    sort,
    setSort,
  } = useTasks();

  const visible = query.trim() ? searchResults : filtered;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="md:col-span-2">
          <SearchBox value={query} onChange={setQuery} placeholder="Search tasks, workflows, sources..." />
        </div>
        <Select
          label="Status"
          value={status}
          onChange={(event) => setStatus(event.target.value as typeof status)}
          options={[
            { label: 'All statuses', value: 'all' },
            ...TASK_STATUSES.map((value) => ({ label: value, value })),
          ]}
        />
        <Select
          label="Priority"
          value={priority}
          onChange={(event) => setPriority(event.target.value as typeof priority)}
          options={[
            { label: 'All priorities', value: 'all' },
            ...TASK_PRIORITIES.map((value) => ({ label: formatTaskPriority(value), value })),
          ]}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          Showing <span className="font-bold text-slate-900 dark:text-slate-100">{visible.length}</span> tasks
        </p>
        <Select
          label="Sort"
          value={sort}
          onChange={(event) => setSort(event.target.value as typeof sort)}
          options={[
            { label: 'Most recent', value: 'recent' },
            { label: 'Title', value: 'title' },
            { label: 'Due date', value: 'due' },
            { label: 'Priority', value: 'priority' },
          ]}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {TASK_STATUSES.map((entry) => (
          <button
            key={entry}
            type="button"
            onClick={() => setStatus(status === entry ? 'all' : entry)}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-sky-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            <TaskStatusBadge status={entry} />
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
