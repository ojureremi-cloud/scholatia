'use client';

import Select from '@/components/ui/Select';
import Switch from '@/components/ui/Switch';
import { ACTIVITY_TYPES } from '@/types/activity';
import type { ActivitySort, ActivityType } from '@/types/activity';

type ActivityFiltersProps = {
  type: ActivityType | 'all';
  onTypeChange: (type: ActivityType | 'all') => void;
  sort: ActivitySort;
  onSortChange: (sort: ActivitySort) => void;
  publicOnly: boolean;
  onPublicOnlyChange: (value: boolean) => void;
};

const sortOptions: { label: string; value: ActivitySort }[] = [
  { label: 'Most recent', value: 'recent' },
  { label: 'Most engaged', value: 'engagement' },
  { label: 'Trending', value: 'trending' },
];

export function ActivityFilters({
  type,
  onTypeChange,
  sort,
  onSortChange,
  publicOnly,
  onPublicOnlyChange,
}: ActivityFiltersProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Select
        label="Activity type"
        id="activity-type"
        value={type}
        onChange={(event) => onTypeChange(event.target.value as ActivityType | 'all')}
        options={[
          { label: 'All types', value: 'all' },
          ...ACTIVITY_TYPES.map((activityType) => ({ label: activityType, value: activityType })),
        ]}
      />
      <Select
        label="Sort by"
        id="activity-sort"
        value={sort}
        onChange={(event) => onSortChange(event.target.value as ActivitySort)}
        options={sortOptions}
      />
      <div className="flex items-end pb-2">
        <Switch checked={publicOnly} onChange={onPublicOnlyChange} label="Public only" />
      </div>
    </div>
  );
}
