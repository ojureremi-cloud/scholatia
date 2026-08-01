import React from 'react';
import Badge from '@/components/ui/Badge';
import type { Dataset } from '@/types/dataset';

function citationYear(dataset: Dataset): string {
  if (dataset.publishedAt) return new Date(dataset.publishedAt).getFullYear().toString();
  if (dataset.updatedAt) return new Date(dataset.updatedAt).getFullYear().toString();
  return 'n.d.';
}

type DatasetCitationCardProps = {
  dataset: Dataset;
};

export function DatasetCitationCard({ dataset }: DatasetCitationCardProps) {
  const recommendedCitation = `${dataset.creator}. (${citationYear(dataset)}). ${dataset.title}. Scholatia Datasets. ${dataset.doi}.`;
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Recommended citation</p>
        <p className="mt-2 text-sm leading-6 text-slate-700">{recommendedCitation}</p>
      </div>
      {dataset.citations.length > 0 ? (
        <ul className="space-y-3">
          {dataset.citations.map((citation) => (
            <li key={citation.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h4 className="font-semibold text-slate-900">{citation.title}</h4>
                <Badge variant="success">Citing work</Badge>
              </div>
              <p className="mt-1 text-sm text-slate-600">{citation.authors.join(', ')}</p>
              <p className="mt-1 text-xs text-slate-500">
                {citation.venue} · {citation.year} · {citation.doi}
              </p>
              <p className="mt-2 text-sm font-medium text-slate-900">{citation.count} citations</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-500">No citing works recorded yet.</p>
      )}
    </div>
  );
}
