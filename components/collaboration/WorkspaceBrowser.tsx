'use client';

import SearchBox from '@/components/ui/SearchBox';
import Select from '@/components/ui/Select';
import useCollaboration from '@/hooks/useCollaboration';
import { WorkspaceGrid } from './WorkspaceGrid';
import { formatKind } from './format';
import type {
  CollaborationSort,
  CollaborationWorkspaceKind,
  CollaborationWorkspaceStatus,
  CollaborationWorkspaceVisibility,
} from '@/types/collaboration';
import {
  COLLABORATION_WORKSPACE_KINDS,
  COLLABORATION_WORKSPACE_STATUSES,
  COLLABORATION_WORKSPACE_VISIBILITIES,
} from '@/types/collaboration';

export function WorkspaceBrowser() {
  const collaboration = useCollaboration();

  const list = collaboration.query.trim()
    ? collaboration.searchResults
    : collaboration.filtered;

  const kindOptions = [
    { label: 'All kinds', value: 'all' },
    ...COLLABORATION_WORKSPACE_KINDS.map((kind) => ({ label: formatKind(kind), value: kind })),
  ];
  const visibilityOptions = [
    { label: 'All visibility', value: 'all' },
    ...COLLABORATION_WORKSPACE_VISIBILITIES.map((visibility) => ({
      label: visibility.charAt(0).toUpperCase() + visibility.slice(1),
      value: visibility,
    })),
  ];
  const statusOptions = [
    { label: 'All statuses', value: 'all' },
    ...COLLABORATION_WORKSPACE_STATUSES.map((status) => ({
      label: status.charAt(0).toUpperCase() + status.slice(1),
      value: status,
    })),
  ];
  const sortOptions = [
    { label: 'Recently updated', value: 'recent' },
    { label: 'Name (A–Z)', value: 'name' },
    { label: 'Most members', value: 'members' },
    { label: 'Most tasks', value: 'tasks' },
    { label: 'Most progress', value: 'progress' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1fr_repeat(4,minmax(0,180px))]">
        <SearchBox
          value={collaboration.query}
          onChange={collaboration.setQuery}
          placeholder="Search workspaces by name, description, tag, or owner…"
        />
        <Select label="Kind" options={kindOptions} value={collaboration.kind} onChange={(event) => collaboration.setKind(event.target.value as 'all' | CollaborationWorkspaceKind)} />
        <Select label="Visibility" options={visibilityOptions} value={collaboration.visibility} onChange={(event) => collaboration.setVisibility(event.target.value as 'all' | CollaborationWorkspaceVisibility)} />
        <Select label="Status" options={statusOptions} value={collaboration.status} onChange={(event) => collaboration.setStatus(event.target.value as 'all' | CollaborationWorkspaceStatus)} />
        <Select label="Sort" options={sortOptions} value={collaboration.sort} onChange={(event) => collaboration.setSort(event.target.value as CollaborationSort)} />
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <p className="text-slate-500 dark:text-slate-400">
          Showing <span className="font-semibold text-slate-900 dark:text-slate-100">{list.length}</span> workspace
          {list.length === 1 ? '' : 's'}
        </p>
        <span className="text-slate-300 dark:text-slate-600">·</span>
        <p className="text-slate-500 dark:text-slate-400">
          You are a member of{' '}
          <span className="font-semibold text-sky-600 dark:text-sky-400">{collaboration.myWorkspaces.length}</span>{' '}
          workspace{collaboration.myWorkspaces.length === 1 ? '' : 's'}
        </p>
        <span className="text-slate-300 dark:text-slate-600">·</span>
        <p className="text-slate-500 dark:text-slate-400">signed in as {collaboration.currentUserName}</p>
      </div>

      <WorkspaceGrid workspaces={list} />
    </div>
  );
}
