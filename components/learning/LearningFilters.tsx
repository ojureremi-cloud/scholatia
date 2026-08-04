import Select from '@/components/ui/Select';
import { COMPETENCY_DOMAINS } from '@/types/learning';
import type { CompetencyDomain, CourseKind, LearningSort } from '@/types/learning';

type LearningFiltersProps = {
  categories: string[];
  category: string;
  onCategoryChange: (category: string) => void;
  courseKind: 'all' | CourseKind;
  onCourseKindChange: (courseKind: 'all' | CourseKind) => void;
  domain: 'all' | CompetencyDomain;
  onDomainChange: (domain: 'all' | CompetencyDomain) => void;
  sort: LearningSort;
  onSortChange: (sort: LearningSort) => void;
};

export function LearningFilters({
  categories,
  category,
  onCategoryChange,
  courseKind,
  onCourseKindChange,
  domain,
  onDomainChange,
  sort,
  onSortChange,
}: LearningFiltersProps) {
  const categoryOptions = [
    { label: 'All categories', value: 'all' },
    ...categories.map((item) => ({ label: item, value: item })),
  ];

  const kindOptions = [
    { label: 'All kinds', value: 'all' },
    { label: 'Course', value: 'standard' },
    { label: 'Micro Course', value: 'micro' },
  ];

  const domainOptions = [
    { label: 'All domains', value: 'all' },
    ...COMPETENCY_DOMAINS.map((item) => ({ label: item, value: item })),
  ];

  const sortOptions: { label: string; value: LearningSort }[] = [
    { label: 'Recently updated', value: 'recent' },
    { label: 'Title A–Z', value: 'title' },
    { label: 'Level', value: 'level' },
    { label: 'Duration', value: 'duration' },
    { label: 'Progress', value: 'progress' },
  ];

  return (
    <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900 sm:grid-cols-2 lg:grid-cols-4">
      <Select
        label="Category"
        id="learning-category"
        options={categoryOptions}
        value={category}
        onChange={(event) => onCategoryChange(event.target.value)}
      />
      <Select
        label="Course kind"
        id="learning-kind"
        options={kindOptions}
        value={courseKind}
        onChange={(event) => onCourseKindChange(event.target.value as 'all' | CourseKind)}
      />
      <Select
        label="Competency domain"
        id="learning-domain"
        options={domainOptions}
        value={domain}
        onChange={(event) => onDomainChange(event.target.value as 'all' | CompetencyDomain)}
      />
      <Select
        label="Sort by"
        id="learning-sort"
        options={sortOptions}
        value={sort}
        onChange={(event) => onSortChange(event.target.value as LearningSort)}
      />
    </div>
  );
}
