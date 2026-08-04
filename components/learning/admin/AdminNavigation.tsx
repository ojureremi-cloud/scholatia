'use client';

import { usePathname } from 'next/navigation';
import { ADMIN_LINKS, isAdminLinkActive } from './AdminSidebar';

export function AdminNavigation() {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Learning operations">
      {ADMIN_LINKS.map((link) => {
        const active = isAdminLinkActive(pathname, link.href);
        return (
          <a
            key={link.href}
            href={link.href}
            role="tab"
            aria-selected={active}
            className={[
              'inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition',
              active
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'border border-slate-200 bg-white text-slate-600 hover:border-sky-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <span aria-hidden="true">{link.icon}</span>
            {link.label}
          </a>
        );
      })}
    </div>
  );
}
