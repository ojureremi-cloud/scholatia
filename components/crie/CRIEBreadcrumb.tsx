import { Fragment } from 'react';
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
  crieUrl,
} from './format';

type Crumb = {
  label: string;
  href?: string;
};

export type CRIEBreadcrumbProps = {
  crumbs: Crumb[];
};

export function CRIEBreadcrumb({ crumbs }: CRIEBreadcrumbProps) {
  const trail: Crumb[] = [{ label: 'CRIE', href: crieUrl() }, ...crumbs];
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

export function DashboardCrumb(): Crumb {
  return { label: 'Dashboard', href: crieDashboardUrl() };
}

export function ResearchCrumb(): Crumb {
  return { label: 'Research', href: crieResearchUrl() };
}

export function ProjectsCrumb(): Crumb {
  return { label: 'Projects', href: crieProjectsUrl() };
}

export function KnowledgeCrumb(): Crumb {
  return { label: 'Knowledge', href: crieKnowledgeUrl() };
}

export function GraphCrumb(): Crumb {
  return { label: 'Graph', href: crieGraphUrl() };
}

export function MemoryCrumb(): Crumb {
  return { label: 'Memory', href: crieMemoryUrl() };
}

export function ReasoningCrumb(): Crumb {
  return { label: 'Reasoning', href: crieReasoningUrl() };
}

export function AgentsCrumb(): Crumb {
  return { label: 'Agents', href: crieAgentsUrl() };
}

export function AnalyticsCrumb(): Crumb {
  return { label: 'Analytics', href: crieAnalyticsUrl() };
}

export function InstitutionsCrumb(): Crumb {
  return { label: 'Institutions', href: crieInstitutionsUrl() };
}

export function FederationCrumb(): Crumb {
  return { label: 'Federation', href: crieFederationUrl() };
}

export function TrustCrumb(): Crumb {
  return { label: 'Trust', href: crieTrustUrl() };
}
