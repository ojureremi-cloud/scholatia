'use client';

import SearchBox from '@/components/ui/SearchBox';
import Select from '@/components/ui/Select';
import useCommunities from '@/hooks/useCommunities';
import { CommunityGrid } from './CommunityGrid';
import { formatCategory } from './format';
import type { CommunityCategory, CommunitySort, CommunityVisibility } from '@/types/communities';
import { COMMUNITY_CATEGORIES, COMMUNITY_VISIBILITIES } from '@/types/communities';

export function CommunityBrowser() {
  const communities = useCommunities();

  const list = communities.query.trim() ? communities.searchResults : communities.filtered;

  const categoryOptions = [
    { label: 'All categories', value: 'all' },
    ...COMMUNITY_CATEGORIES.map((category) => ({ label: formatCategory(category), value: category })),
  ];
  const visibilityOptions = [
    { label: 'All visibility', value: 'all' },
    ...COMMUNITY_VISIBILITIES.map((visibility) => ({
      label: visibility.charAt(0).toUpperCase() + visibility.slice(1).replace(/-/g, ' '),
      value: visibility,
    })),
  ];
  const countryOptions = [
    { label: 'All countries', value: 'all' },
    ...communities.countries.map((country) => ({ label: country, value: country })),
  ];
  const languageOptions = [
    { label: 'All languages', value: 'all' },
    ...communities.languages.map((language) => ({ label: language, value: language })),
  ];
  const disciplineOptions = [
    { label: 'All disciplines', value: 'all' },
    ...communities.disciplines.map((discipline) => ({ label: discipline, value: discipline })),
  ];
  const sortOptions = [
    { label: 'Highest activity', value: 'activity' },
    { label: 'Recently updated', value: 'recent' },
    { label: 'Name (A–Z)', value: 'name' },
    { label: 'Most members', value: 'members' },
    { label: 'Most followers', value: 'followers' },
    { label: 'Most discussions', value: 'discussions' },
    { label: 'Most resources', value: 'resources' },
    { label: 'Most events', value: 'events' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1fr_repeat(5,minmax(0,180px))]">
        <SearchBox
          value={communities.query}
          onChange={communities.setQuery}
          placeholder="Search communities by name, description, discipline, country, or keyword…"
        />
        <Select
          label="Category"
          options={categoryOptions}
          value={communities.category}
          onChange={(event) => communities.setCategory(event.target.value as 'all' | CommunityCategory)}
        />
        <Select
          label="Visibility"
          options={visibilityOptions}
          value={communities.visibility}
          onChange={(event) => communities.setVisibility(event.target.value as 'all' | CommunityVisibility)}
        />
        <Select
          label="Country"
          options={countryOptions}
          value={communities.country}
          onChange={(event) => communities.setCountry(event.target.value as 'all' | string)}
        />
        <Select
          label="Language"
          options={languageOptions}
          value={communities.language}
          onChange={(event) => communities.setLanguage(event.target.value as 'all' | string)}
        />
        <Select
          label="Discipline"
          options={disciplineOptions}
          value={communities.discipline}
          onChange={(event) => communities.setDiscipline(event.target.value as 'all' | string)}
        />
        <Select
          label="Sort"
          options={sortOptions}
          value={communities.sort}
          onChange={(event) => communities.setSort(event.target.value as CommunitySort)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <p className="text-slate-500 dark:text-slate-400">
          Showing <span className="font-semibold text-slate-900 dark:text-slate-100">{list.length}</span> communit
          {list.length === 1 ? 'y' : 'ies'}
        </p>
        <span className="text-slate-300 dark:text-slate-600">·</span>
        <p className="text-slate-500 dark:text-slate-400">
          You belong to{' '}
          <span className="font-semibold text-sky-600 dark:text-sky-400">{communities.myCommunities.length}</span>{' '}
          communit{communities.myCommunities.length === 1 ? 'y' : 'ies'}
        </p>
        <span className="text-slate-300 dark:text-slate-600">·</span>
        <p className="text-slate-500 dark:text-slate-400">signed in as {communities.currentUserName}</p>
      </div>

      <CommunityGrid communities={list} />
    </div>
  );
}
