'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { coursesUrl, homeUrl, learningUrl, pathsUrl, programmesUrl, readingUrl, workspaceUrl } from '../format';

type NavigationItem = {
  label: string;
  href: string;
  icon: string;
};

const NAV_ITEMS: NavigationItem[] = [
  { label: 'Workspace', href: workspaceUrl(), icon: '🗂️' },
  { label: 'Reading', href: readingUrl(), icon: '📚' },
  { label: 'Home', href: homeUrl(), icon: '🏠' },
  { label: 'Dashboard', href: learningUrl(), icon: '📊' },
  { label: 'Courses', href: coursesUrl(), icon: '📘' },
  { label: 'Programmes', href: programmesUrl(), icon: '🎓' },
  { label: 'Paths', href: pathsUrl(), icon: '🧭' },
];

export function WorkspaceNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Learning workspace navigation"
      className="flex flex-wrap gap-2 rounded-3xl bg-slate-100 p-2 dark:bg-slate-800"
    >
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href || (item.href !== learningUrl() && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={[
              'rounded-3xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500',
              active
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-slate-100'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <span aria-hidden="true">{item.icon}</span> {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
