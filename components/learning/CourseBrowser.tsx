'use client';

import { LearningSearch } from './LearningSearch';
import { LearningFilters } from './LearningFilters';
import { CourseGrid } from './CourseGrid';
import { LearningEmptyState } from './LearningEmptyState';
import { formatNumber } from './format';
import useLearning from '@/hooks/useLearning';

export function CourseBrowser() {
  const {
    query,
    setQuery,
    category,
    setCategory,
    courseKind,
    setCourseKind,
    domain,
    setDomain,
    sort,
    setSort,
    categories,
    courses,
    searchResults,
  } = useLearning();

  const visible = query.trim() ? searchResults : courses();

  return (
    <div className="space-y-6">
      <LearningSearch value={query} onChange={setQuery} />
      <LearningFilters
        categories={categories}
        category={category}
        onCategoryChange={setCategory}
        courseKind={courseKind}
        onCourseKindChange={setCourseKind}
        domain={domain}
        onDomainChange={setDomain}
        sort={sort}
        onSortChange={setSort}
      />
      <p className="text-sm text-slate-500 dark:text-slate-400" role="status">
        {query.trim() ? (
          <>
            {formatNumber(visible.length)} result{visible.length === 1 ? '' : 's'} for “{query}”
          </>
        ) : (
          <>
            {formatNumber(visible.length)} published course{visible.length === 1 ? '' : 's'}
          </>
        )}
      </p>
      {visible.length === 0 ? (
        <LearningEmptyState
          title="No courses found"
          description={
            query.trim()
              ? `No courses match “${query}”. Try a different keyword or clear your filters.`
              : 'No courses match the current filters. Try widening your search.'
          }
        />
      ) : (
        <CourseGrid courses={visible} />
      )}
    </div>
  );
}
