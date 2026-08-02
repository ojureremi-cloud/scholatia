'use client';

import { SearchBox } from '@/components/ui';
import {
  ANNOTATION_ROLES,
  ANNOTATION_STATUSES,
  ANNOTATION_TYPES,
} from '@/types/annotations';
import type {
  AnnotationRole,
  AnnotationSort,
  AnnotationStatus,
  AnnotationType,
} from '@/types/annotations';

type AnnotationFiltersProps = {
  status?: AnnotationStatus;
  type?: AnnotationType;
  role?: AnnotationRole;
  sourceEntity?: string;
  sort?: AnnotationSort;
  query?: string;
  onStatusChange?: (status: AnnotationStatus | undefined) => void;
  onTypeChange?: (type: AnnotationType | undefined) => void;
  onRoleChange?: (role: AnnotationRole | undefined) => void;
  onSourceEntityChange?: (sourceEntity: string | undefined) => void;
  onSortChange?: (sort: AnnotationSort) => void;
  onQueryChange?: (query: string) => void;
};

const SOURCE_ENTITIES = ['artefact', 'journal', 'conference', 'dataset', 'funding'];

const SELECT_CLASS =
  'rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200';

export function AnnotationFilters({
  status,
  type,
  role,
  sourceEntity,
  sort = 'recent',
  query,
  onStatusChange,
  onTypeChange,
  onRoleChange,
  onSourceEntityChange,
  onSortChange,
  onQueryChange,
}: AnnotationFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex-1 min-w-[16rem]">
        <SearchBox
          placeholder="Search annotations…"
          value={query ?? ''}
          onChange={(next) => onQueryChange?.(next)}
        />
      </div>
      <select
        className={SELECT_CLASS}
        value={status ?? ''}
        onChange={(event) => onStatusChange?.((event.target.value || undefined) as AnnotationStatus)}
      >
        <option value="">All statuses</option>
        {ANNOTATION_STATUSES.map((option) => (
          <option key={option} value={option}>
            {option[0].toUpperCase() + option.slice(1)}
          </option>
        ))}
      </select>
      <select
        className={SELECT_CLASS}
        value={type ?? ''}
        onChange={(event) => onTypeChange?.((event.target.value || undefined) as AnnotationType)}
      >
        <option value="">All types</option>
        {ANNOTATION_TYPES.map((option) => (
          <option key={option} value={option}>
            {option[0].toUpperCase() + option.slice(1)}
          </option>
        ))}
      </select>
      <select
        className={SELECT_CLASS}
        value={role ?? ''}
        onChange={(event) => onRoleChange?.((event.target.value || undefined) as AnnotationRole)}
      >
        <option value="">All roles</option>
        {ANNOTATION_ROLES.map((option) => (
          <option key={option} value={option}>
            {option[0].toUpperCase() + option.slice(1)}
          </option>
        ))}
      </select>
      <select
        className={SELECT_CLASS}
        value={sourceEntity ?? ''}
        onChange={(event) => onSourceEntityChange?.(event.target.value || undefined)}
      >
        <option value="">All sources</option>
        {SOURCE_ENTITIES.map((option) => (
          <option key={option} value={option}>
            {option[0].toUpperCase() + option.slice(1)}
          </option>
        ))}
      </select>
      <select
        className={SELECT_CLASS}
        value={sort}
        onChange={(event) => onSortChange?.(event.target.value as AnnotationSort)}
      >
        <option value="recent">Recent</option>
        <option value="oldest">Oldest</option>
        <option value="status">Status</option>
        <option value="type">Type</option>
        <option value="role">Role</option>
      </select>
    </div>
  );
}
