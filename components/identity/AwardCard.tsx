import React from 'react';
import Badge from '@/components/ui/Badge';

type AwardCardProps = {
  title: string;
  organisation: string;
  year: string;
  description: string;
};

export default function AwardCard({ title, organisation, year, description }: AwardCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <Badge variant="success">{year}</Badge>
      </div>
      <p className="mt-2 text-sm font-medium text-sky-700">{organisation}</p>
      <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
    </div>
  );
}
