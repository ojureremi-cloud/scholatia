'use client';

import { usePathname } from 'next/navigation';
import {
  crieAgentsUrl,
  crieAnalyticsUrl,
  crieDashboardUrl,
  crieFederationUrl,
  crieGraphUrl,
  crieInstitutionsUrl,
  crieKnowledgeUrl,
  crieMemoryUrl,
  crieProjectsUrl,
  crieReasoningUrl,
  crieResearchUrl,
  crieTrustUrl,
} from './format';

type SidebarSection = {
  label: string;
  items: { label: string; href: string; icon: string }[];
};

const DEFAULT_SECTIONS: SidebarSection[] = [
  {
    label: 'Workspace',
    items: [
      { label: 'Dashboard', href: crieDashboardUrl(), icon: '📊' },
      { label: 'Research', href: crieResearchUrl(), icon: '🔬' },
      { label: 'Projects', href: crieProjectsUrl(), icon: '🗂️' },
    ],
  },
  {
    label: 'Knowledge',
    items: [
      { label: 'Knowledge', href: crieKnowledgeUrl(), icon: '🧬' },
      { label: 'Graph', href: crieGraphUrl(), icon: '🕸️' },
      { label: 'Memory', href: crieMemoryUrl(), icon: '🧠' },
      { label: 'Reasoning', href: crieReasoningUrl(), icon: '🧭' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { label: 'Agents', href: crieAgentsUrl(), icon: '🤖' },
      { label: 'Analytics', href: crieAnalyticsUrl(), icon: '📈' },
    ],
  },
  {
    label: 'Governance',
    items: [
      { label: 'Institutions', href: crieInstitutionsUrl(), icon: '🏛️' },
      { label: 'Federation', href: crieFederationUrl(), icon: '🤝' },
      { label: 'Trust', href: crieTrustUrl(), icon: '🛡️' },
    ],
  },
];

export type CRIESidebarProps = {
  sections?: string[];
};

export function CRIESidebar({ sections }: CRIESidebarProps) {
  const pathname = usePathname();
  const active = sections && sections.length > 0 ? DEFAULT_SECTIONS.filter((section) => sections.includes(section.label)) : DEFAULT_SECTIONS;

  return (
    <nav aria-label="CRIE section navigation" className="space-y-6 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      {active.map((section) => (
        <div key={section.label}>
          <h2 className="px-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{section.label}</h2>
          <ul className="mt-2 space-y-1">
            {section.items.map((item) => {
              const isActive = item.href === crieDashboardUrl() ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={[
                      'flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500',
                      isActive
                        ? 'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <span aria-hidden="true">{item.icon}</span>
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
