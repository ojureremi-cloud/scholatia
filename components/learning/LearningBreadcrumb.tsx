import { Fragment } from 'react';
import { coursesUrl, learningUrl, pathsUrl, programmesUrl } from './format';

type Crumb = {
  label: string;
  href?: string;
};

export type LearningBreadcrumbProps = {
  crumbs: Crumb[];
};

export function LearningBreadcrumb({ crumbs }: LearningBreadcrumbProps) {
  const trail: Crumb[] = [{ label: 'Learning', href: learningUrl() }, ...crumbs];
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
        {trail.map((crumb, index) => {
          const isLast = index === trail.length - 1;
          return (
            <Fragment key={`${crumb.label}-${index}`}>
              <li>
                {isLast || !crumb.href ? (
                  <span aria-current={isLast ? 'page' : undefined} className={isLast ? 'font-semibold text-slate-900 dark:text-slate-100' : ''}>
                    {crumb.label}
                  </span>
                ) : (
                  <a href={crumb.href} className="hover:text-sky-600 hover:underline dark:hover:text-sky-400">
                    {crumb.label}
                  </a>
                )}
              </li>
              {!isLast ? <li aria-hidden="true">›</li> : null}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

export function CoursesCrumb(): Crumb {
  return { label: 'Courses', href: coursesUrl() };
}

export function ProgrammesCrumb(): Crumb {
  return { label: 'Programmes', href: programmesUrl() };
}

export function PathsCrumb(): Crumb {
  return { label: 'Paths', href: pathsUrl() };
}
