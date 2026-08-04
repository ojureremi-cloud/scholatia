'use client';

import { usePathname } from 'next/navigation';
import { coursesUrl, learningUrl, pathsUrl, programmesUrl } from './format';

type NavigationItem = {
  label: string;
  href: string;
  icon: string;
};

const NAV_ITEMS: NavigationItem[] = [
  { label: 'Dashboard', href: learningUrl(), icon: '📊' },
  { label: 'Courses', href: coursesUrl(), icon: '📘' },
  { label: 'Programmes', href: programmesUrl(), icon: '🎓' },
  { label: 'Paths', href: pathsUrl(), icon: '🧭' },
];

export function LearningNavigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="Learning navigation" className="flex flex-wrap gap-2 rounded-3xl bg-slate-100 p-2 dark:bg-slate-800">
      {NAV_ITEMS.map((item) => {
        const active = item.href === learningUrl() ? pathname === learningUrl() : pathname.startsWith(item.href);
        return (
          <a
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
          </a>
        );
      })}
    </nav>
  );
}
