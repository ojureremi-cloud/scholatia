import React from 'react';
import Badge from '@/components/ui/Badge';
import type { Manuscript, ManuscriptAuthorRole } from '@/types/manuscript';

const roleVariant: Record<ManuscriptAuthorRole, 'success' | 'warning' | 'info' | 'default'> = {
  corresponding: 'success',
  first: 'info',
  senior: 'warning',
  'co-author': 'default',
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

type AuthorContributionCardProps = {
  manuscript: Manuscript;
};

export function AuthorContributionCard({ manuscript }: AuthorContributionCardProps) {
  const authorById = new Map(manuscript.authors.map((author) => [author.id, author]));

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Authors</p>
        <ul className="mt-3 space-y-3">
          {manuscript.authors.map((author) => (
            <li key={author.id} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-cyan-100 text-sm font-semibold text-cyan-800">
                {initials(author.name)}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-semibold text-slate-900">{author.name}</h4>
                  <Badge variant={roleVariant[author.role]}>{author.role.replace(/-/g, ' ')}</Badge>
                </div>
                <p className="mt-1 text-sm text-slate-600">{author.institution}</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {author.said}
                  {author.orcid ? ` · ${author.orcid}` : null}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Contributions (CRediT)
        </p>
        <ul className="mt-3 space-y-2">
          {manuscript.contributions.map((contribution) => (
            <li key={contribution.role} className="rounded-2xl bg-slate-50 p-3 text-sm">
              <span className="font-medium text-slate-900">{contribution.role}: </span>
              <span className="text-slate-600">
                {contribution.authors.map((authorId) => authorById.get(authorId)?.name ?? authorId).join(', ')}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
