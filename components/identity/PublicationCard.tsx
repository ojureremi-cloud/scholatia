import React from 'react';
import Badge from '@/components/ui/Badge';

type PublicationCardProps = {
  title: string;
  authors: string[];
  journal: string;
  year: string;
  citations: number;
  doi: string;
  type: string;
};

export default function PublicationCard({ title, authors, journal, year, citations, doi, type }: PublicationCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap gap-2">
            <Badge variant="info">{type}</Badge>
            <Badge variant="default">{year}</Badge>
          </div>
          <h3 className="mt-3 text-lg font-semibold text-slate-900">{title}</h3>
          <p className="mt-2 text-sm text-slate-600">{authors.join(', ')}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-center">
          <p className="text-2xl font-semibold text-slate-900">{citations}</p>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Citations</p>
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-1.5 text-sm text-slate-500 sm:flex-row sm:flex-wrap sm:gap-x-6">
        <p>Journal: <span className="font-medium text-slate-700">{journal}</span></p>
        <p>DOI: <span className="font-mono text-sky-700">{doi}</span></p>
      </div>
    </div>
  );
}
