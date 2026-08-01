import React from 'react';
import Badge from '@/components/ui/Badge';
import type { DatasetContributor, DatasetContributorRole } from '@/types/dataset';

const roleVariant: Record<DatasetContributorRole, 'default' | 'info' | 'success' | 'warning'> = {
  'principal-investigator': 'success',
  'data-curator': 'info',
  'data-collector': 'default',
  researcher: 'info',
  analyst: 'warning',
  'software-engineer': 'default',
  verifier: 'success',
};

function initials(name: string): string {
  return name
    .replace(/^(Dr\.|Prof\.)\s+/i, '')
    .split(' ')
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

type DatasetContributorCardProps = {
  contributors: DatasetContributor[];
};

export function DatasetContributorCard({ contributors }: DatasetContributorCardProps) {
  return (
    <ul className="space-y-3">
      {contributors.map((contributor) => (
        <li key={contributor.id} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-800">
            {initials(contributor.name)}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-semibold text-slate-900">{contributor.name}</h4>
              <Badge variant={roleVariant[contributor.role]}>{contributor.role.replace(/-/g, ' ')}</Badge>
            </div>
            <p className="mt-1 text-sm text-slate-600">{contributor.institution}</p>
            <p className="mt-0.5 text-xs text-slate-500">
              {contributor.said}
              {contributor.orcid ? ` · ${contributor.orcid}` : null}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
