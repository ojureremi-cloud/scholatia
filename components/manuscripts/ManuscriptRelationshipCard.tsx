import React from 'react';
import Badge from '@/components/ui/Badge';
import type { Manuscript } from '@/types/manuscript';

type ManuscriptRelationshipGroup = 'project' | 'dataset' | 'publication' | 'all';

type ManuscriptRelationshipCardProps = {
  manuscript: Manuscript;
  group?: ManuscriptRelationshipGroup;
};

export function ManuscriptRelationshipCard({
  manuscript,
  group = 'all',
}: ManuscriptRelationshipCardProps) {
  const { relationships } = manuscript;
  const showProject = group === 'all' || group === 'project';
  const showDataset = group === 'all' || group === 'dataset';
  const showPublication = group === 'all' || group === 'publication';

  return (
    <div className="space-y-5">
      {showProject ? (
        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="flex items-center gap-2">
            <span aria-hidden="true">🧪</span>
            <h4 className="font-semibold text-slate-900">Research project</h4>
          </div>
          {relationships.project ? (
            <div className="mt-2">
              <p className="font-medium text-slate-900">{relationships.project.title}</p>
              {relationships.project.detail ? (
                <p className="mt-0.5 text-sm text-slate-600">{relationships.project.detail}</p>
              ) : null}
            </div>
          ) : (
            <p className="mt-2 text-sm text-slate-500">No linked research project.</p>
          )}
          {relationships.grants.length > 0 ? (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Grants</p>
              <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
                {relationships.grants.map((grant) => (
                  <li key={grant.id}>
                    <span aria-hidden="true">💰</span> {grant.title}
                    {grant.detail ? <span className="text-slate-500"> — {grant.detail}</span> : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
      {showDataset ? (
        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="flex items-center gap-2">
            <span aria-hidden="true">📊</span>
            <h4 className="font-semibold text-slate-900">Related datasets</h4>
          </div>
          {relationships.datasets.length > 0 ? (
            <ul className="mt-2 space-y-2">
              {relationships.datasets.map((dataset) => (
                <li key={dataset.id}>
                  <p className="font-medium text-slate-900">{dataset.title}</p>
                  {dataset.detail ? <p className="text-xs text-slate-500">{dataset.detail}</p> : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-slate-500">No linked datasets yet.</p>
          )}
        </div>
      ) : null}
      {showPublication ? (
        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="flex items-center gap-2">
            <span aria-hidden="true">📄</span>
            <h4 className="font-semibold text-slate-900">Related publications</h4>
          </div>
          {relationships.publications.length > 0 ? (
            <ul className="mt-2 space-y-2">
              {relationships.publications.map((publication) => (
                <li key={publication.id}>
                  <p className="font-medium text-slate-900">{publication.title}</p>
                  {publication.detail ? <p className="text-xs text-slate-500">{publication.detail}</p> : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-slate-500">No linked publications yet.</p>
          )}
        </div>
      ) : null}
      {group === 'all' ? (
        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="flex items-center gap-2">
            <span aria-hidden="true">🆔</span>
            <h4 className="font-semibold text-slate-900">Researchers (SAID)</h4>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {relationships.researchers.map((said) => (
              <Badge key={said} variant="info">
                {said}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
