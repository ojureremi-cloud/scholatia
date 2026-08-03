'use client';

import SearchBox from '@/components/ui/SearchBox';
import Select from '@/components/ui/Select';
import useGroups from '@/hooks/useGroups';
import { GroupGrid } from './GroupGrid';
import { formatCategory } from './format';
import type { GroupCategory, GroupSort, GroupVisibility } from '@/types/groups';
import { GROUP_CATEGORIES, GROUP_VISIBILITIES } from '@/types/groups';

export function GroupBrowser() {
  const groups = useGroups();

  const list = groups.query.trim() ? groups.searchResults : groups.filtered;

  const categoryOptions = [
    { label: 'All categories', value: 'all' },
    ...GROUP_CATEGORIES.map((category) => ({ label: formatCategory(category), value: category })),
  ];
  const visibilityOptions = [
    { label: 'All visibility', value: 'all' },
    ...GROUP_VISIBILITIES.map((visibility) => ({
      label: visibility.charAt(0).toUpperCase() + visibility.slice(1).replace(/-/g, ' '),
      value: visibility,
    })),
  ];
  const countryOptions = [
    { label: 'All countries', value: 'all' },
    ...groups.countries.map((country) => ({ label: country, value: country })),
  ];
  const disciplineOptions = [
    { label: 'All disciplines', value: 'all' },
    ...groups.disciplines.map((discipline) => ({ label: discipline, value: discipline })),
  ];
  const sortOptions = [
    { label: 'Recently updated', value: 'recent' },
    { label: 'Name (A–Z)', value: 'name' },
    { label: 'Most members', value: 'members' },
    { label: 'Most publications', value: 'publications' },
    { label: 'Most events', value: 'events' },
    { label: 'Broadest research areas', value: 'research' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1fr_repeat(5,minmax(0,180px))]">
        <SearchBox
          value={groups.query}
          onChange={groups.setQuery}
          placeholder="Search groups by name, description, institution, discipline, or keyword…"
        />
        <Select
          label="Category"
          options={categoryOptions}
          value={groups.category}
          onChange={(event) => groups.setCategory(event.target.value as 'all' | GroupCategory)}
        />
        <Select
          label="Visibility"
          options={visibilityOptions}
          value={groups.visibility}
          onChange={(event) => groups.setVisibility(event.target.value as 'all' | GroupVisibility)}
        />
        <Select
          label="Country"
          options={countryOptions}
          value={groups.country}
          onChange={(event) => groups.setCountry(event.target.value as 'all' | string)}
        />
        <Select
          label="Discipline"
          options={disciplineOptions}
          value={groups.discipline}
          onChange={(event) => groups.setDiscipline(event.target.value as 'all' | string)}
        />
        <Select
          label="Sort"
          options={sortOptions}
          value={groups.sort}
          onChange={(event) => groups.setSort(event.target.value as GroupSort)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <p className="text-slate-500 dark:text-slate-400">
          Showing <span className="font-semibold text-slate-900 dark:text-slate-100">{list.length}</span> group
          {list.length === 1 ? '' : 's'}
        </p>
        <span className="text-slate-300 dark:text-slate-600">·</span>
        <p className="text-slate-500 dark:text-slate-400">
          You are a member of{' '}
          <span className="font-semibold text-sky-600 dark:text-sky-400">{groups.myGroups.length}</span> group
          {groups.myGroups.length === 1 ? '' : 's'}
        </p>
        <span className="text-slate-300 dark:text-slate-600">·</span>
        <p className="text-slate-500 dark:text-slate-400">signed in as {groups.currentUserName}</p>
      </div>

      <GroupGrid groups={list} />
    </div>
  );
}
