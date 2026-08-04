'use client';

import { usePathname } from 'next/navigation';

export const ADMIN_LINKS: { href: string; label: string; icon: string }[] = [
  { href: '/learning/educator', label: 'Educator', icon: '👩‍🏫' },
  { href: '/learning/mentor', label: 'Mentor', icon: '🧭' },
  { href: '/learning/programmes/manage', label: 'Programmes', icon: '🎓' },
  { href: '/learning/assessments', label: 'Assessments', icon: '📝' },
  { href: '/learning/institutions', label: 'Institutions', icon: '🏛️' },
  { href: '/learning/analytics', label: 'Analytics Centre', icon: '📊' },
  { href: '/learning/admin', label: 'Administration', icon: '🛡️' },
];

export function isAdminLinkActive(pathname: string, href: string): boolean {
  if (href === '/learning') return pathname === '/learning';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <nav className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
      <p className="px-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
        Operations
      </p>
      <ul className="mt-3 space-y-1">
        {ADMIN_LINKS.map((link) => {
          const active = isAdminLinkActive(pathname, link.href);
          return (
            <li key={link.href}>
              <a
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={[
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition',
                  active
                    ? 'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <span aria-hidden="true">{link.icon}</span>
                {link.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
